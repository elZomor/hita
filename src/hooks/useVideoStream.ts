import { useEffect, useState } from 'react';

// Cloudflare Worker URL for media streaming
const CF_WORKER_URL = import.meta.env.VITE_CF_WORKER_URL || '';

interface VideoStreamState {
  loading: boolean;
  error: string | null;
  videoUrl: string | null;
}

export const useVideoStream = (fileKey: string) => {
  const [state, setState] = useState<VideoStreamState>({
    loading: true,
    error: null,
    videoUrl: null,
  });

  useEffect(() => {
    if (!fileKey) {
      setState({
        loading: false,
        error: 'No video file specified',
        videoUrl: null,
      });
      return;
    }

    // Use Cloudflare Worker for streaming with Range request support
    if (CF_WORKER_URL) {
      setState({
        loading: false,
        error: null,
        videoUrl: `${CF_WORKER_URL}/${fileKey}`,
      });
    } else {
      // Fallback to direct S3 URL if CF Worker not configured
      // This should be replaced with the actual S3 bucket URL
      setState({
        loading: false,
        error: null,
        videoUrl: fileKey,
      });
    }
  }, [fileKey]);

  return state;
};
