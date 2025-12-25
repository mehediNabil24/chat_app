import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import SIgnup from './pages/SIgnup'
import Login from './pages/Login'
import Setting from './pages/Setting'
import { useAuthStore } from '../store/useAuthStore'
import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";


export default function App() {

  const {authUser, checkAuth,isCheckingAuth} = useAuthStore()
  useEffect(()=>{
    checkAuth()
  }, [checkAuth]);
  console.log('authuser',authUser)
  if(isCheckingAuth && !authUser)
    return (
  <div className='flex items-center justify-center h-screen'>
    <Loader className='size-10 animate-spin'/>
  </div>
  );
  return (
    <div>
   <Navbar />

   <Routes>
    <Route path='/' element={authUser?<Homepage />: <Navigate to="/login" />}/>
    {/* <Route path='/signup' element={authUser?<SIgnup />:<Navigate to="/login"/>} /> */}
    <Route path='/login' element={!authUser?<Login /> :<Navigate to="/"/>} />
    <Route path='/signup' element={<SIgnup />} />
    <Route path='/setting' element={<Setting />} />

   </Routes>

   <Toaster/>
      
    </div>
  )
}
