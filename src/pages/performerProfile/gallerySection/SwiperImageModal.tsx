import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Navigation } from 'swiper/modules';
import { Gallery } from '../../../models/Performer';

type SwiperImageModalProps = {
  closeModal: () => void;
  activeIndex: number;
  images: Gallery[];
};

const SwiperImageModal = ({
  closeModal,
  activeIndex,
  images,
}: SwiperImageModalProps) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={(e) => e.key === 'Escape' && closeModal()}
    >
      <div
        className="relative bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center
                  hover:cursor-pointer z-10"
          onClick={closeModal}
          aria-label="Close"
        >
          &times;
        </button>

        <Swiper
          modules={[Grid, Navigation]}
          initialSlide={activeIndex}
          spaceBetween={8}
          navigation
          loop={false}
          className="swiper-modal"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="flex justify-center items-center h-[80vh]">
                <img
                  src={image.imagePath}
                  alt={`Image ${index}`}
                  className="max-h-full max-w-full"
                />
                {image.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-65 text-white p-2 text-center">
                    {image.description}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SwiperImageModal;
