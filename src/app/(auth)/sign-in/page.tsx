import AuthForm from '@/components/AuthForm'
import React from 'react'

const SignIn = () => {
  return (
    <div className='flex justify-center size-full max-sm:px-6 py-6'>
      <AuthForm type='Sign in'/>
    </div>
  )
}

export default SignIn
