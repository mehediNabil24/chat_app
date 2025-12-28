import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE==="development" ? "http://localhost:5001" : "/";


export const useAuthStore = create((set,get) =>({
    authUser:null,
    isSignUp:false,
    isLoggingIn:false,
    isUpdating:false,


    isCheckingAuth:true,
    onlineUsers: [],
    socket: null,

    checkAuth:async()=>{
        try{

            const res = await axiosInstance.get("/auth/check");
            set ({authUser:res.data})
            get().connectSocket();

        }
        catch(error){
            set({authUser:null})
            console.log("error in checkauth:", error);

        }
        finally {
            set({isCheckingAuth:false});
        }

    },


    signup: async (data) =>{
        set({isSignUp:true});

        try{
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account Created Successfully");
            get().connectSocket();
        }
        catch(error){
            toast.error(error.response.data.message);

        }finally{
            set({isSignUp:false})
        }

    },


    logout: async ()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully")
            get().disconnectSocket();
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    },


    login: async (data) =>{
        set({isLoggingIn:true});
        try{
            const res = await axiosInstance.post('/auth/login',data);
            set({authUser:res.data});
            toast.success("Logged in Successfully");
            get().connectSocket();
        }
        catch (error){
            toast.error(error.response.data.message)
        }
        finally{
            set({isLoggingIn:false});
        }
    },

    updateProfile: async (data)=>{
        set({isUpdating:true});
         try{
            const res = await axiosInstance.put('/auth/update-profile',data)
            set({authUser:res.data});
            toast.success("Image Update Successfully")
         }
         catch(error){
            toast.error(error.response.data.message)
         }
         finally{
            set({isUpdating:false})
         }

    },


connectSocket:()=>{
    const {authUser} = get();
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL,{
        query:{
            userId: authUser._id,
        }
    } );
    socket.connect();
    set({socket:socket});

    socket.on("get-online-users",(userIds)=>{
        set({onlineUsers:userIds});
    });
},

disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconnect();
}







}));