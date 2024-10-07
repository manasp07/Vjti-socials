import express from "express";
import {getFeedPosts,getUserPosts,likePost} from "../controller/posts.js";
import { verifytoken } from "../middleware/auth.js";

const router=express.Router();

router.get("/",verifytoken,getFeedPosts);
//home for the useraccount and there posts

router.get("/:userId/posts",verifytoken,getUserPosts);

router.patch("/:postId/like",verifytoken,likePost);
export default router;