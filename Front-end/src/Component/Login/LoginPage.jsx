import React from 'react'
import LoginForm from './LoginForm'
import {
  ShoppingCart,
} from "lucide-react";
export default function LoginPage() {
  return (
    <div className='w-full flex h-screen'>
        <div className='LoginBackground relative w-[45%]'>
            <div className='m-4 flex gap-1 items-center'>
                <div className='bg-white p-2 rounded-full'>
                <ShoppingCart size={18} color='#2563EB'></ShoppingCart>
                </div>
            <h1 className='text-white font-bold text-[24px]'>
                Store Pilot
            </h1>
            </div>
            <div className='absolute bottom-8 left-8 text-[42px] text-white w-[60%] text-centre font-bold'>
            Pilotez votre commerce,vers de nouveaux sommets.
            </div>
        </div>
        <LoginForm></LoginForm>
    </div>
  )
}
