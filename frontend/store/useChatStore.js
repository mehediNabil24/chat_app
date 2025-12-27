import {create} from "zustand";
import toast from  "react-hot-toast";

import {axiosInstance} from "../lib/axios";


export const useChatStore = create((set) =>({
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

    setSelectedUser: (selectedUser)=> set({selectedUser}),

}));