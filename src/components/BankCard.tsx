import { formatAmount } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
// import Copy from './Copy'

const BankCard = ({ account, userName, showBalance = true }: CreditCardProps) => {

  console.log(account);
  return (
   <div className="flex flex-col">
    <Link href={'/'} className='bank-card'>
    <div className='bank-card_content'>
        <div>
            <h1 className='text-white font-semibold'>{account.name || userName}</h1>
        <p className='font-ibm-plex-serif text-white'>{formatAmount(account.currentBalance)}</p>
        </div>
        <article className='flex flex-col'> 
        <div className='flex justify-between gap-10'>
            <h1 className='text-12  text-white'>{userName}</h1>
            <h2 className='text-12 font-semibold text-white'>◍◍/◍◍</h2>
        </div>
        <p className="text-14 text-white w-[100%] tracking-[1.1px]" >
        ◍◍◍◍ ◍◍◍◍ ◍◍◍◍ <span className='text-16 text-white tracking-[1.1px]'>1234</span>
        </p>
        </article>
    </div>
    <div className="bank-card_icon">
        <Image
        src={'/icons/Paypass.svg'}
        width={20}
        height={25}
        alt='Visa Card'
        />
        <Image
        src={'/icons/mastercard.svg'}
        width={42}
        height={32}
        alt='master card'
        className='ml-1'
        />
        <Image
        src={'/icons/lines.png'}
        width={360}
        height={190}
        alt='Lines'
        className='absolute top-0 left-0'
        />
    </div>
    </Link>
   </div>
  )
}

export default BankCard