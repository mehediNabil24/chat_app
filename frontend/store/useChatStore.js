import {create} from "zustand";
import toast from  "react-hot-toast";

import {axiosInstance} from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

const notificationSound = new Audio("/notification.mp3");



export const useChatStore = create((set,get) =>({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,


    getUsers: async()=>{
        set({isUserLoading: true});
        try{
            const res = await axiosInstance.get("/messages/users");
            console.log("users",res)
            set({users:res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isUserLaoding:false});
        }

    },
    getMessages: async(userId)=>{
        set({isMessageLoading: true});
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isMessageLaoding:false});
        }

    },

    sendMessage: async(messageData) =>{
        const {selectedUser, messages} = get();
        try{
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            // console.log("send data",res.data);
            set({messages: [...messages,res.data]})
            
        }
        catch(error){
            toast.error(error.response.data.message);
        }

    },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket?.on("new-message", (newMessage) => {
        const { selectedUser, messages } = get();

        // ✅ If user is NOT in that chat → play sound
        if (!selectedUser || newMessage.senderId !== selectedUser._id) {
            notificationSound.play().catch(() => {});
            toast.success(`New message from ${newMessage.senderName || "Someone"}`);
            return;
        }

        // ✅ If user IS in the chat → just append message
        set({
            messages: [...messages, newMessage],
        });
    });
},


    unsubscribeFromMessages: ()=>{
        const socket = useAuthStore.getState().socket;
        socket?.off("new-message");
    },

    setSelectedUser: (selectedUser)=> set({selectedUser}),

}));