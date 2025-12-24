import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import SIgnup from './pages/SIgnup'
import Login from './pages/Login'
import Setting from './pages/Setting'


export default function App() {
  return (
    <div>
   <Navbar />

   <Routes>
    <Route path='/' element={<Homepage />} />
    <Route path='/signup' element={<SIgnup />} />
    <Route path='/login' element={<Login />} />
    <Route path='/setting' element={<Setting />} />

   </Routes>
      
    </div>
  )
}
