import React from 'react'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'

const TopBar = () => {
    return (
        <div className="bg-[#613dd8] text-white">
            <div className="container mx-auto flex items-center justify-between py-3 px-4">
                <div className="hidden md:flex items-center space-x-4">
                    <a href="#" className="hover:text-gray-300">
                        <TbBrandMeta className="h-5 w-5" />
                    </a>
                    <a href="#" className="hover:text-gray-300">
                        <IoLogoInstagram className="h-5 w-5" />
                    </a>
                    <a href="#" className="hover:text-gray-300">
                        <RiTwitterXLine className="h-4 w-4" />
                    </a>
                </div>
                <div className="text-sm text-center flex-grow">
                    <span>We ship WorldWide -- fast and reliable shipping!</span>
                </div>
                <div className="text-sm hidden md:block">
                    <a href="tel: +98120 00176" className=" md:hover:text-gray-300">
                        +91 98120 00176
                    </a>
                </div>
            </div>
        </div >
    )
}

export default TopBar