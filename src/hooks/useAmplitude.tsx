import { useEffect } from 'react';
import {
  getUserId,
  identify,
  Identify,
  init,
  logEvent,
  setUserId,
} from '@amplitude/analytics-browser';
import { AMPLITUDE_API_KEY, DEBUG } from '../constants.ts';
import { getUserId as getUserFromLocalStorage } from '../utils/restUtils.ts';
import { getAccessToken } from '../utils/tokenUtils.ts';

let isAmplitudeInitialized = false;

const isMobile = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
    userAgent
  );
};

export const useAmplitude = () => {
  const debug = DEBUG;
  const apiKey = AMPLITUDE_API_KEY;

  useEffect(() => {
    if (!debug && !isAmplitudeInitialized) {
      init(apiKey);
      isAmplitudeInitialized = true;
      logEvent(isMobile() ? 'from_mobile' : 'from_pc');
      if (getUserId() === undefined && getAccessToken() !== null) {
        identifyUser(getUserFromLocalStorage());
      }
    }
  }, []);

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (!debug) {
      logEvent(eventName, properties);
    }
  };

  const identifyUser = (
    userId: string,
    userProperties?: Record<string, any>
  ) => {
    if (!debug) {
      setUserId(userId.toString());

      if (userProperties) {
        const identifyInstance = new Identify();
        Object.entries(userProperties).forEach(([key, value]) => {
          identifyInstance.set(key, value);
        });
        identify(identifyInstance);
      }
    }
  };

  return { trackEvent, identifyUser };
};
