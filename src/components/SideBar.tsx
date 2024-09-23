"use client"
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Footer from './Footer'
import PlaidLinks from './PlaidLinks'

const SideBar = ({user}:SiderbarProps) => {
    const pathName= usePathname()
    const SideBarLinks=sidebarLinks.map((item)=> {
        const ActiveState= pathName===item.route || pathName.startsWith(`${item.label}/`)
        return <Link href={item.route} key={item.label} className={cn('sidebar-link',{'bg-bank-gradient':ActiveState})}><div className='relative size-6'><Image src={item.imgURL} fill alt={item.label} className={cn({'brightness-[3] invert-0':ActiveState})}/></div> <p className={cn('sidebar-label',{'!text-white':ActiveState})}>{item.label}</p></Link>
    }
)
  return (
    <section className='sidebar'>
      <nav className='flex flex-col gap-4'>
        <Link href={'/'} className=' flex gap-3 cursor-pointer  items-center mb-10'>
        <Image src={'icons/logo.svg'} height={34} width={34} alt='Horizon' className='size-[24px] max-xl:size-14 max-2xl:size-16 cursor-pointer' />
        <h1 className='sidebar-logo'>Horizan</h1>
        </Link>
        
        {SideBarLinks}
        <PlaidLinks user={user}/>
      </nav>
      <Footer user={user}/>
    </section >
  )
}

export default SideBar
