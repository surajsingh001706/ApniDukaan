import React from 'react'
import heroImg from "../../assets/Hero1.jpg";
import { Link } from 'react-router-dom';
const Hero = () => {
    return <section className='relative'>
        <img src={heroImg} alt="Rabbit" className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center">
            <div className='text-center text-white p-6'>
                <h1 className='text-5xl md:text-9xl font-bold tracking-tighter uppercase mb-4'>
                    Vacation <br />Ready
                </h1>
                <p className='text-sm tracking-tighter md:text-lg font-semibold mb-6'>
                    Explore our Vacation-ready outfits with fast worldwide shipping.
                </p>
                <Link to="/collections/all" className="bg-black text-white font-bold px-2 py-2 md:px-3 md:py-3 text-xs rounded-md md:text-lg hover:bg-gray-800 transition-all">Shop Now</Link>
            </div>
        </div>
    </section>
}

export default Hero