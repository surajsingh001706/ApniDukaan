import React from 'react'
import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi2';

const FeatureSection = () => {
  return (
    <section className='py -16 px-4 bg-white'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
           {/*1 */}
            <div className='flex flex-col items-center mb-12'>
                <div className='p-4 rounded items-center'>
                    <HiShoppingBag className='text-xl'/>
                </div>
                <h4 className='tracking-tighter mb-2'>FREE INTERNATIONAL SHIPPING</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                    on all orders over $100.00
                </p>
            </div>

            {/*2 */}
            <div className='flex flex-col items-center mb-12'>
                <div className='p-4 rounded items-center'>
                    <HiArrowPathRoundedSquare className='text-xl'/>
                </div>
                <h4 className='tracking-tighter mb-2'>45 DAYS RETURN</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                    Money back guarantee
                </p>
            </div>

           {/*3 */}
            <div className='flex flex-col items-center mb-12'>
                <div className='p-4 rounded items-center'>
                    <HiOutlineCreditCard className='text-xl'/>
                </div>
                <h4 className='tracking-tighter mb-2'>SECURE CHECKOUT</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                    100% secured checkout process
                </p>
            </div>
        </div>
    </section>
  )
};

export default FeatureSection