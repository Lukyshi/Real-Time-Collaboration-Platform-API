import { Queue } from 'bullmq';
import { redis } from '../config/redis.js';

export const invitationQueue = new Queue(
  "invitation", 
  {
    connection : redis // redis connection
  }
);

