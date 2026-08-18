import { success } from "zod";
import invitationService from "./invitation.service.js";

//untested
const createWorkspaceInvitations = async(req, res, next) =>{
  try {
    const userId  = req.user.id;
    const { workspaceId } = req.params;
    const { email } = req.body;

    const invitation = await invitationService.createWorkspaceInvitation(userId, workspaceId, {email});

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

    if(!token) {
      res.status(401).json({
        success : false,
        message : "Invitation token is required"
      });
    }

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

  }catch(error) {
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