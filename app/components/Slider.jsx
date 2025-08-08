// app/components/Slider.jsx
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { ProductItem } from '~/components/ProductItem';


// Custom navigation icons
const PrevIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M15 18L9 12L15 6" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const NextIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M9 18L15 12L9 6" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export function ProductSlider({ products }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const productsToDisplay = products.filter(product => product.featuredImage);

  return (
    <div className="product-slider-container relative">
      {/* Custom Navigation Buttons */}
      <button
        ref={prevRef}
        className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Previous slide"
      >
        <PrevIcon />
      </button>
      
      <button
        ref={nextRef}
        className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Next slide"
      >
        <NextIcon />
      </button>

      <Swiper
        className='product-slider relative h-96'
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        // loop={true}
        // rewind={true}
        spaceBetween={50}
        slidesPerView={4}
        slidesPerGroup={4}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
      >
        {productsToDisplay.map((product) => (
          <SwiperSlide key={product.id} className='product-slide'>
            <ProductItem key={product.id} product={product} />
          </SwiperSlide>
        ))}

      </Swiper>
    </div>
  );
}
