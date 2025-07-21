import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteProduct, fetchadminProducts } from '../../redux/slices/adminProductSlice';

const ProductManagement = () => {
   const dispatch =useDispatch();
   const {products,loading,error} =useSelector((state)=>state.adminProducts);

   useEffect(()=>{
    dispatch(fetchadminProducts());
   },[dispatch]);
    const handleDelete =(productId)=>{
        if(window.confirm("Are you sureyou want to delete")){
            dispatch(deleteProduct(productId));
        }
    };

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error: {error}</p>
    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className='text-2xl font-bold'>Product Management</h2>
            <div className='mt-8 overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='min-w-full text-left'>
                    <thead className='bg-gray-300 text-sm uppercase text-left'>
                        <tr>
                            <th className='px-4 py-3'>Name</th>
                            <th className='px-4 py-3'>Price</th>
                            <th className='px-4 py-3'>SKU</th>
                            <th className='px-4 py-3'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='bg-gray-50 text-gray-700'>
                       {products.length >0 ?(products.map((product)=>(
                         <tr key={product._id} className='border-b hover:bg-gray-50 cursor-pointer'>
                            <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>
                                {product.name}
                            </td>
                            <td className='p-4'>${product.price}</td>
                            <td className='p-4'>{product.sku}</td>
                            <td className='p-4'>
                                <Link to ={`/admin/products/${product._id}/edit`}
                                className='bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600'>
                                    Edit
                                </Link>
                                <button onClick={()=>handleDelete(product._id)} className='
                                bg-red-500 text-white p-1 rounded hover:bg-red-600'>Delete</button>
                            </td>
                         </tr>)
                       )):
                       (<tr>
                        <td colSpan={4} className='p-4 text-center text-gray-600'>No Products Available.</td>
                       </tr>)} 
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductManagement