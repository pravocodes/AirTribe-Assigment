import Express from "express";
import color from "colors";
import dotenv from "dotenv";
import conn from "./dbconfig/db.js";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import instructorRoute from "./routes/instructorRoute.js";
import courseRoute from "./routes/courseRoute.js"
const app = Express();
app.get("/", (req, res) => {
  res.send("<h1>Welcome</h1>");
});

dotenv.config();

app.use(Express.json());

app.use(cors());
app.use("/api/auth", authRoute);
app.use("/api/instructor", instructorRoute);
app.use("/api/course", courseRoute);

conn();
const port = 5000;
app.listen(5000, () => {
  console.log(`Server is running on ${port}`);
});
