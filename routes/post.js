import express from 'express';
import { newPost, getMyPost, updatePost, deletePost, getAllPosts,postLike,postUnLike ,addComment, deleteComment} from '../controllers/post.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post("/new",isAuthenticated, newPost);
router.get("/mypost",isAuthenticated, getMyPost);
router.get("/all",getAllPosts);
router.route("/:id").put(isAuthenticated,updatePost).delete(isAuthenticated,deletePost);
router.put("/like/:id",isAuthenticated,postLike)
router.put("/unlike/:id",isAuthenticated,postUnLike)
router.route("/comment/:id/:commentID").post(isAuthenticated,addComment).delete(isAuthenticated,deleteComment)



export default router;