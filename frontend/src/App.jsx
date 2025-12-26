import React, { use, useEffect } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import SIgnup from './pages/SIgnup'
import Login from './pages/Login'
import Setting from './pages/Setting'
import { useAuthStore } from '../store/useAuthStore'
import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";
import ProfilePage from './pages/Profile'
import { useThemeStore } from '../store/useThemeStore'
import SettingsPage from './pages/Setting'


export default function App() {

  const {authUser, checkAuth,isCheckingAuth} = useAuthStore();
  const {theme} =useThemeStore();
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
    <div data-theme={theme}>
   <Navbar />

   <Routes>
    <Route path='/' element={authUser?<Homepage />: <Navigate to="/login" />}/>
    <Route path='/profile' element={authUser?<ProfilePage />: <Navigate to="/login" />}/>
    {/* <Route path='/signup' element={authUser?<SIgnup />:<Navigate to="/login"/>} /> */}
    <Route path='/login' element={!authUser?<Login /> :<Navigate to="/"/>} />
    <Route path='/signup' element={!authUser?<SIgnup />:<Navigate to="/"/>} />
    <Route path='/setting' element={<SettingsPage />} />

   </Routes>

   <Toaster/>
      
    </div>
  )
}
