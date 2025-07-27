// app/components/Slider.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { ProductItem } from '~/components/ProductItem';


export function ProductSlider({ products }) {
  return (
    <Swiper
      className='product-slider relative h-96'
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      // loop={true}
      // rewind={true}
      spaceBetween={50}
      slidesPerView={4}
      slidesPerGroup={4}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
    >
      {products.map((product) => (
        <SwiperSlide key={product.id} className='product-slide'>
          <ProductItem key={product.id} product={product} />
        </SwiperSlide>
      ))}

    </Swiper>
  );
}
