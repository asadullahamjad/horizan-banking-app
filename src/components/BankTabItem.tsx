"use client"
import React from 'react';
import { useSearchParams,useRouter } from 'next/navigation';
import { cn, formUrlQuery } from '@/lib/utils';
const BankTabItem = ({appwriteItemId,account}:BankTabItemProps) => {
  const router=useRouter()
  const search=useSearchParams();
  const isActive= appwriteItemId == account?.appwriteItemId;

  const handle=()=>{
    const newUrl= formUrlQuery({
      params:search.toString(),
      key:'id',
      value:account?.appwriteItemId
    }
  )
  router.push(newUrl,{scroll:false})
  }
  return (
    <div className={cn('banktab-item',{'border-blue-600':isActive})} onClick={handle}>
  <p className={cn('text-16 line-clamp-1 flex-1 font-medium text-gray-500',{'text-blue-600':isActive})}> {account.name}</p>
    </div>
  )
}

export default BankTabItem;
