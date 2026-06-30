import dotenv from 'dotenv';
dotenv.config;

import express from 'express';
import router from './modules/auth/auth.routes.js';

const app = express();

app.use(express.json());

app.use('api/v1/auth', authRoutes);

export default app;