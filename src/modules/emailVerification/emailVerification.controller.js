import { success } from "zod";
import emailVerificationService from "./emailVerification.service.js";

const verifyEmail = async(req, res, next) => {
  try {
    const { token } = req.query;

    const verifiedEmail = await emailVerificationService.verifyEmail(token);

    return res.status(200).json({
      success : true,
      data : verifiedEmail
    });

  }catch(error){
    next(error);
  };
};

const resendEmail = async(req, res, next) => {
  try {
    const email = req.body;

    const resendEmail = await emailVerificationService.verifyEmail(email);

    return res.status(200).json({
      success : true,
      data : resendEmail
    });

  }catch(error) {
    next(error)
  }
};

export default {
  verifyEmail,
  resendEmail
}