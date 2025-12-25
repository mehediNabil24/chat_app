import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'

export default function Navbar() {
  const {logout, authUser} = useAuthStore();
  return (
    <header className='bg-base-100 border-b broder-base-300 fixed w-full top-0  z-40'>
<div className='conatainer mx-auto px-4 h-16 '>
  <div className='flex items-center justify-between h-full'>

  </div>

</div>
    </header>
    
  )
}
