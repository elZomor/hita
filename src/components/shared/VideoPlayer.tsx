import { useVideoStream } from '../../hooks/useVideoStream.ts';

interface VideoPlayerProps {
  videoId: string;
  className?: string;
}

export function VideoPlayer({ videoId, className = '' }: VideoPlayerProps) {
  const { loading, error, videoUrl } = useVideoStream(videoId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60 md:h-80">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-60 md:h-80 px-4 text-red-500 text-sm md:text-base">
        {error}
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="flex items-center justify-center h-60 md:h-80 px-4 text-gray-500">
        Video unavailable.
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-lg mx-auto p-2">
      <div className="w-full aspect-video md:aspect-auto rounded-lg shadow-md">
        <video
          src={videoUrl}
          controls
          autoPlay
          className={`w-full h-full object-contain ${className}`}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
