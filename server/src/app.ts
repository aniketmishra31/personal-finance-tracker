import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/authRouter";
import userRouter from "./routers/userRouter";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server running at port ${process.env.PORT}`);
});
