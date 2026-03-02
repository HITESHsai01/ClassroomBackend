import AgentAPI from 'apminsight';
AgentAPI.config();

import express from "express";
import subjectRouter from './routes/subjects.js';
import userRouter from './routes/users.js';
import cors from "cors";
import securityMiddleware from './middleware/security.js';
import { auth } from './lib/auth.js';
import { toNodeHandler } from 'better-auth/node';
import classRouter from './routes/classes.js'

const app = express();

if(!process.env.FRONTEND_URL) throw new Error("FRONTEND_URL is missing");

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods:['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}))

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

app.use(securityMiddleware);

app.use('/api/subjects',subjectRouter)
app.use('/api/users', userRouter)
app.use('/api/classes',classRouter)

app.get("/", (req, res) => {
  res.send("Hello from TypeScript server!");
});


const port =  8000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
