import emailVerificationController from "./emailVerification.controller.js";
import { Router } from "express";

const route = Router();

route.get('/verify-email', emailVerificationController.verifyEmail);
route.get('/resend-verification', emailVerificationController.resendEmail);

export default route;