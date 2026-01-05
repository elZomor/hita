interface VideoPlayerProps {
  videoId: string;
  className?: string;
}

export function VideoPlayer({ videoId, className = '' }: VideoPlayerProps) {
  // If videoId is already a full URL (from CF Worker), use it directly
  const isFullUrl =
    videoId.startsWith('http://') || videoId.startsWith('https://');

  if (!videoId || (!isFullUrl && !videoId.trim())) {
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
          src={videoId}
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
