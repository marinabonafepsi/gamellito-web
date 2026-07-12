export type Platform = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  platform: Platform;
  device_type: string;
}

/**
 * Coarse device detection from the User-Agent header. Good enough to tell
 * mobile/tablet/desktop and OS apart for prioritization — not meant to be a
 * precise UA parser (browser/version aren't captured).
 */
export function parseDeviceInfo(userAgent: string | null): DeviceInfo {
  const ua = userAgent || '';

  const isTablet = /iPad|Tablet(?!.*Mobile)/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
  const isMobile = !isTablet && /Mobi|iPhone|Android|IEMobile|BlackBerry|Opera Mini/i.test(ua);
  const platform: Platform = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

  let device_type = 'other';
  if (/iPhone|iPad|iPod/i.test(ua)) device_type = 'ios';
  else if (/Android/i.test(ua)) device_type = 'android';
  else if (/Windows/i.test(ua)) device_type = 'windows';
  else if (/Macintosh|Mac OS/i.test(ua)) device_type = 'macos';
  else if (/Linux/i.test(ua)) device_type = 'linux';

  return { platform, device_type };
}
