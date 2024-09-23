import AuthForm from '@/components/AuthForm'
import React from 'react'

const SignUP = async() => {
  return (
    <div className='flex justify-center size-full max-sm:px-6'>
      <AuthForm type='Sign Up'/>
    </div>
  )
}

export default SignUP
