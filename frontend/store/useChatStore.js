import {create} from "zustand";
import toast from  "react-hot-toast";

import {axiosInstance} from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

const notificationSound = new Audio("/notification.mp3");



export const useChatStore = create((set,get) =>({
    messages: [],
    users: [],
    selectedUser: null, 
    unreadCounts: {}, // 👈 NEW
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
        const { selectedUser, messages, unreadCounts } = get();
        const authUser = useAuthStore.getState().authUser;

        // ❌ ignore own messages
        if (newMessage.senderId === authUser._id) return;

        // 🔔 message from another chat
        if (!selectedUser || newMessage.senderId !== selectedUser._id) {
            notificationSound.play().catch(() => {});

            set({
                unreadCounts: {
                    ...unreadCounts,
                    [newMessage.senderId]:
                        (unreadCounts[newMessage.senderId] || 0) + 1,
                },
            });

            return;
        }

        // ✅ message for currently open chat
        set({
            messages: [...messages, newMessage],
        });
    });
},



    unsubscribeFromMessages: ()=>{
        const socket = useAuthStore.getState().socket;
        socket?.off("new-message");
    },

   setSelectedUser: (selectedUser) =>
    set((state) => ({
        selectedUser,
        unreadCounts: {
            ...state.unreadCounts,
            [selectedUser._id]: 0, // 👈 reset
        },
    })),


}));