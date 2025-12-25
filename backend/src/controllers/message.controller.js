import cloudinary from "../lib/cloudniary.js";
import Message from "../model/message.model.js";
import User from "../model/user.model.js";

export const getUsersForSidebar = async (req,res)=>{

    try{
        const loggedUserId = req.user._id;

        const filterdUsers = await User.find({_id:{$ne: loggedUserId}}.select("-password"));

        res.status(200).json(filterdUsers)

    } catch (error){
        console.log("error in getUserSidebar",res.message);
        res.status(500).json({error:"Internal server error"});

    }
}


export const getMessages = async (req,res)=>{
   try{
    const {id:userToChatId} = req.params
    const myId = req.user._id;

    const messages = await Message.find({
        $or: [
            {senderId:myId, receiverId:userToChatId},
            {senderId:userToChatId, receiverId:myId}
        ]
    })

    res.status(200).json(messages)
   } 
   catch(error){
    console.log("error in getMessages controllers:", error.message);
    res.status(500).json({error:"internal Server Error"})

   }
}


export const sendMessage = async (req,res) =>{

    try{
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }


        const newMessage = new Message({
            senderId,
            receiverId,
            text,image: imageUrl
        });

        await newMessage.save();


        res.status(201).json(newMessage)


    }

    catch(error) {

        console.log("Error in snedMessage controller ", error.message);
        res.status(500).json({error:"Internal Server Error"})

    }



}