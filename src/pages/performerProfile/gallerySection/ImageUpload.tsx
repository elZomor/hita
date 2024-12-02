import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';
import { clsx } from 'clsx';

interface ImageUploadProps {
    currentImage?: string;
    onImageUpload: (file: File) => void;
    error?: string;
}

export function ImageUpload({
                                currentImage,
                                onImageUpload,
                                error,
                            }: ImageUploadProps) {
    const { t } = useTranslation();

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            onImageUpload(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    return (
        <div>
            <div
                className={clsx(
            'relative border-2 border-dashed rounded-lg p-4 text-center',
            error ? 'border-red-300' : 'border-gray-300 hover:border-purple-400',
            'transition-colors duration-200'
    )}
    onDragOver={(e) => e.preventDefault()}
    onDrop={handleDrop}
        >
        {currentImage ? (
                    <div className="relative aspect-video">
                    <img
                        src={currentImage}
                alt=""
            className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white">
            <p className="text-sm">{t('DRAG_DROP_OR_CLICK')}</p>
    </div>
    </div>
    </div>
) : (
        <div className="py-12">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">{t('DRAG_DROP_OR_CLICK')}</p>
    </div>
)}
    <input
        type="file"
    accept="image/*"
    onChange={handleChange}
    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        </div>
    {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
    }