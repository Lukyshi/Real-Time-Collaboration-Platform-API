import { prisma } from "../../config/prisma.js";
import crypto from "node:crypto";
import { sendVerificationEmail } from "./sendVerificationEmail.transport.js";
import { invitationQueue } from "../../jobs/invitation.queue.js";
import { email } from "zod";
import { Backoffs, delay } from "bullmq";
import { type } from "node:os";

const VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

// hashing token
// creating a random token
const hashToken = async (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const createVerification = async (user) => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);

  const expiresAt = new Date(Date.now + VERIFICATION_TOKEN_EXPIRY_MS);

  //upsert : means update natin tong record kung nag eexist, kung hindi creat it
  await prisma.emailVerification.upsert({
    where: {
      userId: user.id,
    },
    update: {
      tokenHash,
      expiresAt,
    },
    create: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  await invitationQueue.add(
    "send-verification-email",
    {
      email: user.email,
      token: rawToken,
      name: user.name,
    },
    {
      attempt: 3,
      Backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: 1000,
    },
  );
};

const verifyEmail = async (rawToken) => {
  if (!rawToken) throw new Error("Invalid verification token");

  const tokenHash = hashToken(rawToken);

  const verification = await prisma.emailVerification.findUnique({
    where: { id: tokenHash },
  });

  if (!verification) throw new Error("Invalid or expired verification token");

  if (verification.expiresAt < new Date()) {
    await prisma.emailVerification.delete({
      where: { id: verification },
    });

    throw new Error("Invalid or expired verification token");
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: verification.id },
      data: {
        isVerified: true,
      },
    });

    await tx.emailVerification.delete({
      where: { id: verification.id },
    });
  });

  return {
    message: "Email verified successfully",
  };
};

const resendVerification = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return {
      message:
        "If an account exists with this email, a verification email will be sent.",
    };
  }

  if (user.isVerified) {
    return {
      message:
        "If an account exists with this email, a verification email will be sent.",
    };
  }

  await createVerification(user);

  return {
    message:
      "If an account exists with this email, a verification email will be sent.",
  };
};


export default {
  createVerification,
  verifyEmail,
  resendVerification
}