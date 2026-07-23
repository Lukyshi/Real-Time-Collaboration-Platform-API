import { prisma } from "../config/prisma.js";

const expireInvitation = async (invitationId) => {
  const invitation = await prisma.workspaceInvitation.findUnique({
    where : { id : invitationId },
  });

  if(!invitation) {
    throw new Error ("Invitation not found");
  }

  if(invitation.status !== "PENDING") {
    return;
  }

  await prisma.workspaceInvitation.update({
    where : { id: invitationId },
    data : { status : "EXPIRED" },
  });

  console.log(`Invitation ${invitationId} expired`);

};

export default expireInvitation;