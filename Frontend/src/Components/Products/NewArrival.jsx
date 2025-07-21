import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NewArrival = () => {
  const scrollRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [newArrivals, setNewArrivals] = useState([]);

  // Fetch new arrivals
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrival`);
        setNewArrivals(response.data);
      } catch (error) {
        console.error('Failed to fetch new arrivals:', error);
      }
    };
    fetchNewArrivals();
  }, []);

  // Drag-scroll handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Scroll using buttons
  const scroll = (direction) => {
    const scrollAmount = direction === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Update button state
  const updateScrollButtons = useCallback(() => {
    const container = scrollRef.current;
    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScroll = container.scrollWidth > leftScroll + container.clientWidth + 1;
      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScroll);
    }
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [newArrivals, updateScrollButtons]);

  return (
    <section className="py-2 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-sm md:text-lg text-gray-600 mb-10">
          Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.
        </p>

        {/* Scroll Buttons */}
        <div className="absolute right-0 top-[93px] md:top-[84px] flex space-x-2 z-10">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll Left"
            className={`p-1 rounded border transition ${
              canScrollLeft ? 'bg-white text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll Right"
            className={`p-1 rounded border transition ${
              canScrollRight ? 'bg-white text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          style={{ userSelect: isDragging ? 'none' : 'auto' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`overflow-x-scroll flex space-x-6 relative snap-x snap-mandatory ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {newArrivals.length === 0 ? (
            <p className="text-gray-500 text-center w-full">No new arrivals found.</p>
          ) : (
            newArrivals.map((product) => (
              <div
                key={product._id}
                className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative snap-start"
              >
                <img
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.images?.[0]?.altText || product.name}
                  className="w-full h-[400px] object-cover rounded-lg"
                  draggable="false"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
                  <Link to={`/product/${product._id}`} className="block">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="mt-1">${product.price}</p>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
