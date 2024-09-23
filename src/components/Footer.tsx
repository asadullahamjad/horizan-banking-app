import { logout } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({user,type='desktop'}:FooterProps) => {

    const router= useRouter()

    const handleLogout= async()=>{
        const LoggOut= await logout()
        console.log("🚀 ~ handleLogout ~ LoggOut:", LoggOut)
        
            router.push('/sign-in')
        
    }
  return (
    <footer className='footer'>
      <div className={`${type==='mobile'?'footer_name-mobile':'footer_name'}`}>
        <p className='text-lg text-gray-700 font-bold'>{user?.firstName?.[0]}</p>
        
      </div>
      <div className={`${type==='mobile'?'footer_email-mobile':'footer_email'}`}>
        <h1 className='text-sm truncate text-gray-700 font-semibold'>{user?.firstName} {user?.lastName}</h1>
        <p className='text-14 text-gray-600 font-normal'>{user.email}</p>

      </div>
        <div className='ml-3'>
        <Image src={'/icons/logout.svg'} className='hover:border-gray-300' width={20} height={20} alt='Logout' onClick={handleLogout}/>
        </div>
    </footer>
  )
}

export default Footer
