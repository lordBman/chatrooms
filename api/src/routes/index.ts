import express from "express";
import userRouter from "./users";
import roomRouter from "./room";
import commentsRouter from "./comments";

const router = express.Router();

router.use("/users", userRouter);
router.use("/rooms", roomRouter);
router.use("/comments", commentsRouter);

router.get("/", async(req, res) => {
    return res.status(200).send({message: "welcome to Chat Room API"});
});

export default router;