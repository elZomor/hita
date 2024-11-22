import {GalleryObject} from "../../models/Performer.ts";
import {useTranslation} from "react-i18next";
import {FaLock} from "react-icons/fa6";

type GallerySectionProps = {
    galleryObject: GalleryObject;
}
const GallerySection = ({galleryObject}: GallerySectionProps) => {
    const {t} = useTranslation();
    const {data, isLocked} = galleryObject;
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('GALLERY')}</h2>
            {isLocked ? (<div
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                    <FaLock className="text-gray-500" size={20}/>
                    <span className="text-gray-700 text-sm">{t('LOCKED')}</span>
                </div>)
                : (<div className="grid grid-cols-2 gap-4">
                    {data?.map((image, index) => (
                        <img
                            key={index}
                            src={image.imagePath}
                            alt={image.description}
                            className="w-full h-32 object-cover rounded-lg"
                        />
                    ))}
                </div>)
            }

        </div>
    );
};

export default GallerySection;