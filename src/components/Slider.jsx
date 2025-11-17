import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Slider() {
  const images = [
    "https://www.fiestroevents.com/uploads/24/08/66b21e981eced0608241722949272.png",
    "https://www.mrsfields.com/cdn/shop/articles/shutterstock_2408066691_1.jpg?v=1725556532",
    "https://floweraura-blog-img.s3.ap-south-1.amazonaws.com/Celebrate+Anniversary+travel/cvr.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzZg9yKSUy0oKJsxJZblexdfoMYhwUAtY2yA&s",
    "https://5.imimg.com/data5/SELLER/Default/2022/8/QF/JF/PJ/2713142/retirement-party-decoration-service.JPG",
    "https://www.parents.com/thmb/JlKRSVpphFei1B17UE35pVnV5Fg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/shutterstock_762391612-41aca833e9184016833a754be5e7d5c3.jpg",
  ];

  return (
    <div className="w-full max-w-full mx-auto">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-500"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative group">
              <img
                src={src}
                alt={`Event ${index}`}
                className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              {/* Gradient overlay for style */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
