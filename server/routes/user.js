import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    getalluser,
} from "../controller/user.js";
import { verifytoken } from "../middleware/auth.js";
import cors from 'cors';

const router = express.Router();
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, // access-control-allow-credentials:true
    optionSuccessStatus: 200
}
router.use(cors(corsOptions)); 

router.get("/:id", verifytoken, getUser); 
router.get("/:id/friends", verifytoken, getUserFriends);
// Update friends list with POST request
router.post("/:id/friends", verifytoken, addRemoveFriend);
// Optional: Define other routes as needed
// router.post('/:id/send-friend-request/:friendId', sendFriendRequest);
// router.post('/:id/accept-friend-request/:friendId', acceptFriendRequest);
router.get('/', getalluser);
export default router;
