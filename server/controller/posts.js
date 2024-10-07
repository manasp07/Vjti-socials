import Post from "../models/post.js";
import User from "../models/User.js";
export const createPost=async(req,res)=>{
    try{
        const{userId,description,picturePath}=req.body;
        console.log("********************")
        console.log(req.body,"nukllfsdlijtgfh");
        console.log("********************")
        const user= await User.findOne({_id:userId});
        const newPost=new Post({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            hometown:user.hometown,
            description,
            userPicturePath:user.picturePath,
            picturePath,
            likes:{},
            comments:[]
        })
        await newPost.save();
        const post=await Post.find();//all post will be returned
        res.status(201).json(post);
    }catch(err){
      console.log("**************")
      console.log("**************")
        console.log(err.message)
        res.status(409).json({message:err.message})
    }
}

//Read all the post upcoming from the friends list 
export const getFeedPosts=async(req,res)=>{
    try{
    const post = await Post.find();
    res.status(200).json(post);
    }catch(err){
        res.status(404).json({message:err.message})
    }
}
//displays the only the users posts someone want to see
export const getUserPosts = async (req,res)=>{
    try{
        const{userId}=req.params;
        console.log(userId)
        const post=await Post.find({userId});
        console.log(post)
        res.status(200).json(post);
    
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

export const likePost = async (req, res) => {
    try {
      const id = req.params.postId;
      const { userId } = req.body;
      console.log("Hi this is post",id)
      // Find the post by ID
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if the post is already liked by the user
      const isLiked = post.likes.get(userId);
       console.log("sTATUS",isLiked)
      if (isLiked) {
        post.likes.delete(userId); // Remove the like
      } else {
        post.likes.set(userId, true); // Add a like
      }
  
      // Update the post with new likes data
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
      );
  
      res.status(200).json(updatedPost); // Return updated post
    } catch (err) {
      res.status(500).json({ message: err.message }); // Handle errors
    }
  };