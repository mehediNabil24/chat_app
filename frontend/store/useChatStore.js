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
  if (!socket) return;

  socket.off("new-message"); // prevent duplicate listeners

  socket.on("new-message", (newMessage) => {
    const { selectedUser, messages } = get();
    const authUser = useAuthStore.getState().authUser;
    if (!authUser) return;

    const isMyMessage = newMessage.senderId === authUser._id;
    const isChatOpen = newMessage.senderId === selectedUser?._id;
    const isWindowFocused = document.hasFocus();

    // 🔊 PLAY SOUND
    if (!isMyMessage && (!isChatOpen || !isWindowFocused)) {
      notificationSound
        .play()
        .catch(err =>
          console.warn("🔇 Sound blocked:", err.message)
        );
    }

    // Add message ONLY if current chat is open
    if (isChatOpen) {
      set({ messages: [...messages, newMessage] });
    }
  });
},


    unsubscribeFromMessages: ()=>{
        const socket = useAuthStore.getState().socket;
        socket?.off("new-message");
    },

    setSelectedUser: (selectedUser)=> set({selectedUser}),

}));