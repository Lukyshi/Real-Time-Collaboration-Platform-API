import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import workspaceRoutes from './modules/workspaces/workspace.routes.js';
import workspaceMemberRoutes from './modules/workspaceMember/member.route.js';
import workspaceInvitationRoutes from './modules/workspace-invitation/invitation.route.js';
import projectRoutes from './modules/projects/project.route.js';
import taskRoutes from './modules/tasks/task.route.js';
import emailVerificationRoutes from './modules/emailVerification/emailVerification.route.js';

import './jobs/invitation.worker.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/verification/', emailVerificationRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/workspaces', workspaceRoutes);
app.use('/api/v1/members', workspaceMemberRoutes);
app.use('/api/v1/invitations', workspaceInvitationRoutes);
app.use('/api/v1/', projectRoutes);
app.use('/api/v1/', taskRoutes);


export default app;