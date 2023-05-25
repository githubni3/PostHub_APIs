import ErrorHandler from "../middlewares/error.js";
import { Posts } from "../models/post.js";
import cloudinary from 'cloudinary'
cloudinary.config({ 
  cloud_name: 'dlceka44g', 
  api_key: '329694817346381', 
  api_secret: 'CI4dQPmc98xucPVEI0LVgVzy9fE' 
});

// create new post
export const newPost = async (req, res, next) => {
  try {
    const { title, caption } = req.body;
    const file = req.files.post_img;
    cloudinary.v2.uploader.upload(file.tempFilePath,  async function(error, result) {
      const post = await Posts.create({
        title,
        caption,
        image: {
          public_id: result.public_id,
          url: result.url,
        },
        user: req.user._id,
      });
      res.status(201).json({
        success: true,
        post,
      });
     });
    
  } catch (error) {
    next(error);
  }
};

// get all users posts
export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Posts.find();
    res.status(200).json({
      success: true,
      allPosts,
    });
  } catch (error) {
    next(error);
  }
};

// get my post
export const getMyPost = async (req, res, next) => {
  try {
    const posts = await Posts.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// update post
export const updatePost = async (req, res, next) => {
  try {
    let post = await Posts.findById(req.params.id);
    if (!post) {
      return next(new ErrorHandler("Post Not Found", 404));
    }

    const { title, caption } = req.body;
    const file = req.files.post_img;
    cloudinary.v2.uploader.upload(file.tempFilePath,  async function(error, result) {
      post.title = title;
      post.caption = caption;
      post.image.public_id = result.public_id;
      post.image.url = result.url;
      await post.save();
      res.status(201).json({
        success: true,
        message: "Post Updated Successfully",
      });
     });
  } catch (error) {
    next(error);
  }
};

//delete post
export const deletePost = async (req, res, next) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return next(new ErrorHandler("Post Not Found", 404));
    }

    await post.deleteOne();
    res.status(200).json({
      success: true,
      message: "Post Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// like post
export const postLike = async (req, res, next) => {
  try {
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return next(new ErrorHandler("Post Not Found", 404));
    }

    const userId = req.user._id;
    post.likes = [...post.likes,userId];

    await post.save();
    res.status(200).json({
      success: true,
      message: "Liked Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const postUnLike = async (req, res, next) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return next(new ErrorHandler("Post Not Found", 404));
    }

    const userId = req.user._id;
    // console.log(post.likes[0].toString() === userId.toString())
    // console.log(post.likes[0],"\n",userId)
    post.likes = post.likes.filter((item) => item.toString() !== userId.toString());

    await post.save();
    res.status(200).json({
      success: true,
      message: "unLiked Successfully",
    });
  } catch (error) {
    next(error);
  }
};


// Add comment

export const addComment = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const post = await Posts.findById(req.params.id);

    const name = req.user.name;
    const newComment = {
      name: name || '',
      comment: comment || '',
    };


    post.comments.push(newComment);
    post.save();
    
    res.status(201).json({
      success: true,
      message:"Comment Added Successfully"
    });
  } catch (error) {
    next(error);
  }
};

//delete comment

export const deleteComment = async (req, res, next) => {
  try {
    const post = await Posts.findById(req.params.id);
    
    post.comments.pull({_id : req.params.commentID} )
    
    post.save();

    res.status(201).json({
      success: true,
      message:"Comment deleted Successfully"
    });
  } catch (error) {
    next(error);
  }
};
