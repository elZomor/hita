import { useEffect, useState } from 'react';

interface VideoStreamState {
  loading: boolean;
  error: string | null;
  videoUrl: string | null;
}

export const useVideoStream = (videoId: string) => {
  const [state, setState] = useState<VideoStreamState>({
    loading: true,
    error: null,
    videoUrl: null,
  });

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // Create a URL for the video stream
        const streamUrl = videoId;

        // Check if the video exists by making a HEAD request
        // const response = await fetch(streamUrl, { method: 'GET' });

        // if (!response.ok) {
        //   throw new Error('Video not found');
        // }

        setState({
          loading: false,
          error: null,
          videoUrl: streamUrl,
        });
      } catch (error) {
        setState({
          loading: false,
          error:
            error instanceof Error ? error.message : 'Failed to load video',
          videoUrl: null,
        });
      }
    };

    fetchVideo();
  }, [videoId]);

  return state;
};
