import { Worker } from 'bullmq';
import { redis } from '../config/redis.js';
import expireInvitation from '../jobs/invitation.expiry.job.js';
import { sendInvitationEmail } from '../modules/workspace-invitation/email.service.js';
import { sendVerificationEmail } from '../modules/emailVerification/sendVerificationEmail.transport.js';

console.log("🚀 INVITATION WORKER STARTED");

export const worker = new Worker(
  
  "invitation",

  async(job) => {
    switch(job.name){

      case "expire-invitation" : {
        const { invitationId } = job.data;
        await expireInvitation(invitationId);
        break;
      }

      case "send-invitation-email" : {
        const { email, token, workspaceName } = job.data;
        await sendInvitationEmail({
          to: email, 
          token, 
          workspaceName
        });

        break;
      }

      case "send-verification-email" : {
        const { email, token, name } = job.data;

        console.log("📨 Worker received verification job:", email);

        await sendVerificationEmail({
          to : email,
          token,
          name
        });

        console.log("✅ Verification email sent:", email);

        break;
      }

      default : 
        console.warn(`Unknow job type ${job.name}`);
    }
  },
  {
    connection : redis, 
    // concurrency how many jobs a single worker can do
    concurrency : 5
  }
);
  
worker.on(`completed`, (job) => {
  console.log(`job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`job ${job.id} failed`, error);
});