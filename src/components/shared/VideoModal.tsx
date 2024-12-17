import { useEffect } from 'react';
import { X } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer.tsx';

interface VideoModalProps {
  isOpen: boolean;
  videoUrl: string;
  title?: string;
  onClose: () => void;
}

export function VideoModal({
  isOpen,
  videoUrl,
  title,
  onClose,
}: VideoModalProps) {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    // Prevent background scrolling when the modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto'; // Re-enable scrolling
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Function to determine if the URL is from YouTube or Vimeo
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtube.com')
        ? url.split('v=')[1]?.split('&')[0]
        : url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const isEmbeddedVideo =
    videoUrl.includes('youtube.com') ||
    videoUrl.includes('youtu.be') ||
    videoUrl.includes('vimeo.com');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-2 sm:px-4 py-6 text-center">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="relative w-full max-w-screen-lg sm:my-8 mx-2 sm:mx-0 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all md:h-[70vh]">
          <div className="absolute right-0 top-0 p-2 sm:p-4 z-10">
            <button
              type="button"
              className="rounded-full bg-white text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-8 w-8" />
            </button>
          </div>

          <div className="bg-white h-full flex flex-col">
            {title && (
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2 px-4 pt-5">
                {title}
              </h3>
            )}

            <div className="flex-1 relative">
              {isEmbeddedVideo ? (
                <iframe
                  src={getEmbedUrl(videoUrl)}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={title || 'Video'}
                />
              ) : (
                <VideoPlayer videoId={videoUrl} className="absolute inset-0" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
