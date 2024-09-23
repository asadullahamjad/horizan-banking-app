import React from 'react'

const Header = ({type='title',title,subtext,user}:HeaderBoxProps) => {
  return (
    <div className='header-box '>
      <h1 className='header-box-title '>{title}</h1> {type==='greeting' && ( <span className='text-bankGradient'>&nbsp;{user}</span>)}
      <p className='header-box-subtext'>{subtext}</p>
    </div>
  )
}

export default Header
