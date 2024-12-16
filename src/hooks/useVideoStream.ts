import { useEffect, useState } from 'react';
import { get_blob_video } from '../utils/restUtils.ts';

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
        const { data } = await get_blob_video(videoId);
        setState({
          loading: false,
          error: null,
          videoUrl: URL.createObjectURL(data),
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
