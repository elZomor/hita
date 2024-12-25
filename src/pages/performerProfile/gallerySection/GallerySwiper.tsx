import { Swiper, SwiperSlide } from 'swiper/react';
import { EditButton } from '../../../components/shared/EditButton.tsx';
import { DeleteButton } from '../../../components/shared/DeleteButton.tsx';
import { Grid, Navigation } from 'swiper/modules';
import { Gallery } from '../../../models/Performer.ts';

type GallerySwiperCardProps = {
  images: Gallery[];
  onClick: (index: number) => void;
  isEditing: boolean;
  onEdit: (index: number) => void;
  onDelete: (image: Gallery) => void;
  slidesPerView: number;
  rows: number;
};

export const GallerySwiper = ({
  images,
  onClick,
  isEditing,
  onEdit,
  onDelete,
  slidesPerView,
  rows,
}: GallerySwiperCardProps) => {
  return (
    <Swiper
      modules={[Grid, Navigation]} // Include Grid and Navigation modules
      slidesPerView={slidesPerView} // Number of images per row
      grid={{
        rows, // Number of rows (adjust as needed)
        fill: 'row', // Fill slides by row
      }}
      navigation // Enables navigation buttons
      className="relative"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index} className="p-2">
          <div className="flex justify-center items-center w-full h-full">
            <img
              src={image.imagePath}
              alt={`Image ${index}`}
              onClick={() => onClick(index)}
              className="object-contain w-40 h-40 hover:cursor-pointer"
            />
            {isEditing && (
              <div className="absolute inset-0 rounded-lg transition-all duration-200 flex items-center justify-center pointer-events-auto">
                <div className="flex gap-2">
                  <EditButton
                    onClick={() => onEdit(index)}
                    className="text-white hover:text-purple-200"
                  />
                  <DeleteButton
                    onClick={() => onDelete(image)}
                    className="text-white hover:text-red-200"
                  />
                </div>
              </div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
