import prisma from "../../config/prisma.js";
import crypto from "crypto";
import { invitationQueue } from "../../jobs/invitation.queue.js";
import { th } from "zod/v4/locales";
import { includes } from "zod";

// owners enter userid email and they will invite it
// system will create a inivitations
// status = pending
// send email
// user clicks
// status = accepted

const createWorkspaceInvitation = async (userId, data) => {
  const { workspaceId, email } = data;

  const normalizedEmail = email.toLowerCase().trim();
  
  const workspaceExist = await prisma.workspace.findUnique({
    where : { id : workspaceId },
  });

  if(!workspaceExist) {
    throw new Error("Wokspace Not Found");
  } 

  const existingUser = await prisma.user.findUnique({
    where : { email : normalizedEmail },
  });

  if(existingUser) {
    const existingMember = await prisma.workspaceMember.findFirst({
      where : { workspaceId, userId : existingUser.id, },
    });

    if(existingMember) {
      throw new Error ("User is already a workspace member");
    }
  }

  const existingInvitation = await prisma.workspaceInvitation.findFirst({
    where : {
      workspaceId,
      email : normalizedEmail,
      status : "PENDING",
    },
  });

  if(existingInvitation) {
    throw new Error ("Invitation already exist");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const createdInvitation = await prisma.workspaceInvitation.create({
    data : {
      workspaceId,
      invitedById : userId,
      email : normalizedEmail,
      token,
      expiresAt,
    }
  });

  try {
      // i should create a sending email to user ill used nodemailer

      // sent invitation from queue
    await invitationQueue.add(
      "send-invitation-email",
      {
        email : normalizedEmail,
        token,
        workspaceName : workspaceExist.name 
      },
      {
        //retry jobs failed up to 3
        attempts : 3,

        // wait longet between retries 5s to 20s...
        //helps handle temporary failures 
        backoff : {
          type : "exponential",
          delay : 5000,
        },
      }
    );

    await invitationQueue.add(
    "expire-invitation",
    {
      invitationId : createdInvitation.id
    },
    {
      delay : expiresAt.getTime() - Date.now()
    },
  );

  }catch(err) {
    // rollback the invitations if queue fails
    console.error("Failed to schedule invitation jobs", err);
    await prisma.createWorkspaceInvitation.delete({where: {id: createdInvitation.id}});
    throw new Error("Failed to create invitation, please try again");
  };  
  
  return createdInvitation;

};

// it will show invite details
const getInvitationByToken = async(token) => {
  const invitation = await prisma.workspaceInvitation.findUnique({
    where : { token },
    include : { 
      workspace : {
        select : { id: true, name: true},
      },
      invitedBy : {
        select : {id: true, name: true, email: true}
      },
    },
  });

  if(!invitation) throw new Error("Invaild Invitation");

  if( invitation.status !== "PENDING" && invitation.expiresAt < new Date() ) {
    throw new Error("Invitation has expired");
  }

  return {
    email : invitation.email,
    status : invitation.status,
    workspace : invitation.workspace,
    invitedBy : invitation.invitedBy,
    expiresAt : invitation.expiresAt,
  };
};


const acceptInvitation = async(token, user) => {
  const invitation = await prisma.user.findUnique({
    where : { token },
  });

  // check if invition is existing
  if(!invitation) throw new Error("Invalid Invitation");

  // check if invitation is valid
  if(invitation !== "PENDING") throw new Error("Invitation is no longer valid");

  //check if invitation has expired
  if(invitation.expiresAt < new Date()) throw new Error("Invitation has expired");

  // check if email is match the invited email
  if(user.email.toLowerCase() !== invitation.email.toLowerCase()) {
    throw new Error("This invitation was sent to a different email address");
  }

  await prisma.workspace.create({
    data :{
      workspaceId : invitation.workspaceId,
      userId : invitation.userId,
      role : "MEMBER"
    },
  });

  await prisma.workspaceInvitation.update({
    where : { id : invitation.id },
      data : {
        status : "ACCEPTED"
      },
  });

  return { workspaceId : invitation.workspaceId };

};


// update register(sign up) - done
// validate the accept invitation tom - done
const declineInvitation = async(token) => {
  const invitation = await prisma.workspaceInvitation.findUnique({
    where : { token }
  })

  if(!invitation) {
    throw new Error("Invalid invitation");
  }

  if(invitation !== "PENDING") throw new Error("Invitation is no longer valid");

  if(invitation.expiresAt < new Date()) throw new Error("Invitation has expired");

  await prisma.workspaceInvitation.update({
    where : {id : invitation.id },
    data : {
      status : "DECLINE"
    },
  });

  return {
    workspaceId : invitation.workspaceId
  };

};

export default {
  createWorkspaceInvitation,
  getInvitationByToken,
  acceptInvitation,
  declineInvitation
}

// task later :
// validate it - done
// put status in my create 
// create 3 more service for http
// create task and project
// test it