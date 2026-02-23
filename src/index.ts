import express from "express";
const app = express();


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from TypeScript server!");
});


const port =  8000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
