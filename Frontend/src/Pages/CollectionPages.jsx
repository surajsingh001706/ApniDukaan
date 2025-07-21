import React, { useEffect } from 'react'
import { useState,useRef} from 'react';
import { FaFilter } from "react-icons/fa"
import FilterSidebar from '../Components/Products/FilterSidebar';
import SortOptions from '../Components/Products/SortOptions';
import ProductGrid from '../Components/Products/ProductGrid';
import {useSelector,useDispatch} from "react-redux";
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchProductsByFilter } from '../redux/slices/ProductSlice';

const CollectionPages = () => {
    const {collection} =useParams();
    const [searchParams] =useSearchParams();
    const dispatch =useDispatch();
    const {products,loading,error} =useSelector((state)=>state.products);
    const queryParams =Object.fromEntries([...searchParams]);

    const SidebarRef =useRef(null);
    const [isSidebarOpen,setisSidebar]=useState(false);

    useEffect(()=>{
        dispatch(fetchProductsByFilter({collection,...queryParams}));
    },[dispatch,collection,searchParams]);

    const togglesidebar =()=>{
        setisSidebar(!isSidebarOpen);
    }
    const handleClickOutside =(e)=>{
        if(SidebarRef.current && !SidebarRef.current.contains(e.target)){
            setisSidebar(false);
        }
    }

  useEffect(() => {
    // Add event listener on mount
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove the listener on unmount
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);



    return (
        <div className='flex flex-col lg:flex-row'>
            {/* Mobile version */}
            <button onClick={togglesidebar} className='lg:hidden border flex p-2 justify-center items-center'>
                <FaFilter className='mr-2' /> Filters
            </button>

            {/*Filter Sidebar */}
            <div ref ={SidebarRef} className={`${isSidebarOpen ? "translate-x-0":"-translate-x-full"} fixed inset-y-0 z-50
            left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
                <FilterSidebar />
            </div>
            <div className='flex-grow p-4'>
                <h2 className='text-2xl uppercase mb-4'>All Collection
                </h2>
                {/* Sort Options */}
                <SortOptions/>
                
                {/* Product Grid */}
                <ProductGrid products={products} loading={loading} error={error}/>
            </div>
        </div>
    )
}

export default CollectionPages