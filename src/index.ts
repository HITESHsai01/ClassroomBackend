import express from "express";
import subjectRouter from './routes/subjects';
import cors from "cors";
import securityMiddleware from './middleware/security';
const app = express();

if(!process.env.FRONTEND_URL) throw new Error("FRONTEND_URL is missing");

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods:['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}))

app.use(express.json());

app.use(securityMiddleware);

app.use('/api/subjects',subjectRouter)

app.get("/", (req, res) => {
  res.send("Hello from TypeScript server!");
});


const port =  8000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
