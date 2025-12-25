import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) =>({
    authUser:null,
    isSignUp:false,
    isLoggingIn:false,
    isUpdating:false,


    isCheckingAuth:true,

    checkAuth:async()=>{
        try{

            const res = await axiosInstance.get("/auth/check");
            set ({authUser:res.data})

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
        }
        catch(error){
            toast.error(error.response.data.message);

        }finally{
            set({isSignUp:false})
        }

    },


    logout: async (data)=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully")
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
            const res = await axiosInstance.put('/auth/update-profile')
            set({authUser:res.data});
            toast.success("Image Update Successfully")
         }
         catch(error){
            toast.error(error.response.message)
         }
         finally{
            set({isUpdating:false})
         }

    }










}));