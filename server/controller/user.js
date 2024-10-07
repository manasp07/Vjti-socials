import User from "../models/User.js";

export const getUser=async(req,res)=>{
    try{
     const {id} =req.params;
     console.log(id)
     const user=await User.findById(id);
     res.status(200).json(user);
    } catch(err){
        res.status(404).json({message:err.message});
    }
}

export const getUserFriends=async(req,res)=>{
    try{

        const {id}=req.params;
        console.log({id});
        const user=await User.findById(id);
    
        const friends=await Promise.all(
            user.friends.map((id)=>User.findById(id))
        );
        const formattedfriends = friends.map(
            ({ _id,firstName,lastName,occupation,location,picturePath})=>{
                return {_id,firstName,lastName,occupation,location,picturePath};
            }
        );
        res.status(200).json(formattedfriends);
    }catch(err){
        res.status(404).json({message:err.message});
    }
};

// Route handler for adding/removing friends
export const addRemoveFriend = async (req, res) => {
    try {
      const { id, friendId } = req.body;
      console.log("Hello",req.body) // Use req.body for POST requests
      const user = await User.findById(id);
      const friend = await User.findById(friendId);
      console.log("This is the user",user);
      console.log("This is the friednd",friend);
      if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter((id) => id !== friendId);
        friend.friends = friend.friends.filter((id) => id !== id);
      } else {
        user.friends.push(friendId);
        friend.friends.push(id);
      }
      await user.save();
      await friend.save();
  
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );
  
      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  export const getalluser = async (req, res) => {
    try {
      const users = await User.find();
      if (!users.length) {
        res.status(404).json({ message: 'No users found' });
      } else {
        res.json(users);
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
