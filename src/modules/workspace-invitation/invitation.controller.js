import { success } from "zod";
import invitationService from "./invitation.service.js";

const createWorkspaceInvitations = async(req, res, next) =>{
  try {
    const { userId } = req.user.id;
    const { workspaceId, email } = req.body;

    const invitation = await invitationService.createWorkspaceInvitation(userId, {workspaceId, email});

    res.status(201).json({
      success : true,
      data : invitation
    });

  }catch(error) {
    next(error);
  }
}

const getInvitationByToken = async(req, res, next) => {
  try {

    const { token } = req.query; // from email service invitelink

    const invitation = await invitationService.getInvitationByToken(token);

    res.status(200).json({
      success : true,
      data : invitation
    });
  }catch(error) {
    next(error);
  }
};


const acceptInvitation = async(req, res, next) => {
  try {

    const { token } = req.query;
    const user = req.user;

    const invitation = await invitationService.acceptInvitation(token, user);

    res.status(200).json({
      success: true,
      data: invitation,
    });

  }catch(erorr) {
    next(error);
  }
};

const declineInvitation = async(req, res, next) => {
  try {

    const { token } = req.query;

    const invitation = await invitationService.declineInvitation(token);

    res.status(200).json({
      success: true,
      data: invitation,
    });

  }catch(error) {
    next(error);
  }
};

export default {
  createWorkspaceInvitations,
  getInvitationByToken,
  acceptInvitation,
  declineInvitation
}