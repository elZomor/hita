import { useVideoStream } from '../../hooks/useVideoStream.ts';

interface VideoPlayerProps {
  videoId: string;
  className?: string;
}

export function VideoPlayer({ videoId, className = '' }: VideoPlayerProps) {
  const { loading, error, videoUrl } = useVideoStream(videoId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );
  }

  if (!videoUrl) {
    return null;
  }

  return (
    <video
      src={videoUrl}
      controls
      className={`w-full h-full object-contain ${className}`}
    >
      Your browser does not support the video tag.
    </video>
  );
}
