import express from "express";
import userRouter from "./users";

const blimitedRouter = express.Router();

blimitedRouter.use("/users", userRouter);

blimitedRouter.get("/", async(req, res) => {
    return res.status(200).send({message: "welcome to Bsoft Limited API"});
});

export default blimitedRouter;