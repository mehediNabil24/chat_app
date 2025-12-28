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

    subscribeToMessages: ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        // socket?.on("new-message", (newMessage)=>{
        //     if(newMessage.senderId !== selectedUser._id) return;
        //     set({
        //         messages: [...get().messages, newMessage]
        //     })
        // })

        socket?.on("new-message", (newMessage) => {
    const { selectedUser } = get();
    const authUser = useAuthStore.getState().authUser;

    const isMyMessage = newMessage.senderId === authUser._id;
    const isChatOpen = newMessage.senderId === selectedUser?._id;
    const isWindowFocused = document.hasFocus();

    // 🔊 PLAY SOUND when needed
    if (!isMyMessage && (!isChatOpen || !isWindowFocused)) {
        notificationSound.play();
    }

    // Only add message if current chat is open
    if (isChatOpen) {
        set({
            messages: [...get().messages, newMessage],
        });
    }
});

    },

    unsubscribeFromMessages: ()=>{
        const socket = useAuthStore.getState().socket;
        socket?.off("new-message");
    },

    setSelectedUser: (selectedUser)=> set({selectedUser}),

}));