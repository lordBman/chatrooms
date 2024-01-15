import express from "express";
import userRouter from "./users";

const router = express.Router();

router.use("/users", userRouter);

router.get("/", async(req, res) => {
    return res.status(200).send({message: "welcome to Chat Room API"});
});

export default router;