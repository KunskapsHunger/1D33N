import { useEffect } from 'react';

interface BrowserInfo {
  isFirefox: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isEdge: boolean;
}

export function detectBrowser(): BrowserInfo {
  if (typeof navigator === 'undefined') {
    return { isFirefox: false, isSafari: false, isChrome: false, isEdge: false };
  }

  const ua = navigator.userAgent.toLowerCase();

  return {
    isFirefox: ua.includes('firefox'),
    isSafari: ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium'),
    isChrome: (ua.includes('chrome') || ua.includes('chromium')) && !ua.includes('edg'),
    isEdge: ua.includes('edg'),
  };
}

/**
 * Adds browser-specific classes to the document element
 * This allows CSS to target specific browsers for workarounds
 */
export function useBrowserDetect(): BrowserInfo {
  const browser = detectBrowser();

  useEffect(() => {
    const html = document.documentElement;

    if (browser.isFirefox) html.classList.add('is-firefox');
    if (browser.isSafari) html.classList.add('is-safari');
    if (browser.isChrome) html.classList.add('is-chrome');
    if (browser.isEdge) html.classList.add('is-edge');

    return () => {
      html.classList.remove('is-firefox', 'is-safari', 'is-chrome', 'is-edge');
    };
  }, [browser.isFirefox, browser.isSafari, browser.isChrome, browser.isEdge]);

  return browser;
}
