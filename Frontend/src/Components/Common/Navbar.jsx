import React from 'react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import {HiOutlineUser,HiOutlineShoppingBag,HiBars3BottomRight} from 'react-icons/hi2'
import CartDrawer from '../Layout/CartDrawer'
import { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { useSelector } from 'react-redux'

const Navbar = () => {
    const [drawerOpen,setdrawerOpen]=useState(false);
    const [navdrawerOpen,setNavdrawerOpen] =useState(false);
    const {cart} =useSelector((state)=>state.cart);
    const {user} =useSelector((state)=>state.auth);

    const cartItemCount = cart?.products?.reduce((total,product)=>total+product.quantity,0) ||0;
    const toggleCartdrawer =()=>{
        setdrawerOpen(!drawerOpen);
    }
    const toggleNavdrawerOpen =()=>{
        setNavdrawerOpen(!navdrawerOpen);
    }
    return (
        <>
            <nav className="container mx-auto flex items-center justify-between py-4 px-4 h-12">
                {/*left - logo */}
                <div>
                    <Link to="/" className="text-2xl font-medium">ApniDukaan</Link>
                </div>

                {/*Center naviagtion links */}

                <div className='hidden md:flex space-x-10'>
                    <Link to="/collections/all?gender=Men" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
                        Men
                    </Link>
                    <Link to="/collections/all?gender=Women" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
                        Women
                    </Link>
                    <Link to="/collections/all?category=Top Wear" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
                    Top Wear
                    </Link>
                    <Link to="/collections/all?category=Bottom Wear" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
                    Bottom Wear
                    </Link>
                </div>

                {/*Right - icons */}
                <div className='flex items-center space-x-4'>
                    {user && user.role === "admin" &&
                    (<Link to="/admin" className='bg-black rounded-lg text-white px-2 py-1 text-smA'>Admin</Link>)}
                    <Link to="/profile" className='hover:text-black'>
                    <HiOutlineUser className ="h-6 w-6 text-gray-700"/>
                    </Link>
                    <button onClick={toggleCartdrawer}className="relative hover:text-black">
                     <HiOutlineShoppingBag className="h-6 w-6 text-gray-700"/>
                     {cartItemCount > 0 && (
                     <span className="absolute -top-1 bg-orange-900 text-white text-xs rounded-full px-2 py-0.5">{cartItemCount}</span>
                     )}
                    </button>
                    {/*search  icon*/}
                    <div className='overflow-hidden'>
                    <SearchBar/>
                    </div>
                    
                    <button onClick={toggleNavdrawerOpen} className='md:hidden'>
                        <HiBars3BottomRight className="h-6 w-6 text-gray-700"/>
                    </button>
                </div>

            </nav>
            <CartDrawer drawerOpen={drawerOpen} toggleCartdrawer={toggleCartdrawer}/>

            {/*Mobile Navigation*/}
            <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
                navdrawerOpen ? "translate-x-0":"-translate-x-full"}`}>
                    <div className='flex justify-end p-4'>
                        <button onClick={toggleNavdrawerOpen}>
                            <IoMdClose className='h-6 w-6 text-gray-600'/>
                        </button>
                    </div>
                    <div className='p-4'>
                        <h2 className='text-xl font-semibold mb-4'>Menu</h2>
                        <nav className='space-y-4'>
                            <Link
                            to  ="/collections/all?gender=Men" onClick={toggleNavdrawerOpen}
                            className='block text-gray-600 hover:text-black'
                            >
                                Men
                            </Link>
                            <Link
                            to  ="/collections/all?gender=Women" onClick={toggleNavdrawerOpen}
                            className='block text-gray-600 hover:text-black'
                            >
                                Women
                            </Link>
                            <Link
                            to  ="/collections/all?category=Top Wear" onClick={toggleNavdrawerOpen}
                            className='block text-gray-600 hover:text-black'
                            >
                                Top Wear
                            </Link>
                            <Link
                            to  ='/collections/all?category=Bottom Wear'onClick={toggleNavdrawerOpen}
                            className='block text-gray-600 hover:text-black'
                            >
                                Bottom Wear
                            </Link>
                        </nav>
                    </div>
                </div>
        </>
    )
}

export default Navbar