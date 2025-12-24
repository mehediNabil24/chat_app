import {create} from "zustand";

export const useAuthStore = create({set} =>({
    authUser:null,
    isSignUp:false,
    isLoggingIng:false,
    isUpdating:false,
    isCheckingAuth:true,



}));