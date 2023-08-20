import React from 'react'
import Image from 'next/image'
export default function Footer() {
    const homeClickHandler = () => {

    }
    const featureClickHandler = () => { }
    const pricingClickHandler = () => { }

    return (
        <footer className='w-full bg-light-gray xl:py-28 lg:py-14 sm:py-20 py-12'>
          <div className='container flex flex-col items-center justify-center mx-auto px-2 sm:gap-16 gap-4 sm:px-6 lg:px-10'>
            <div className='h-[50px] xl:mb-4 lg:mb-2'><Image className='h-full object-cover' alt='logo of adds' width={200} height={200} src={'/images/logo.png'} /></div>
            <p className="text-center my-2">We created a tool to bring your advertising game to a whole new level.</p>
          </div>
        </footer>
      )
}
