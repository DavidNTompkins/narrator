import { v4 as uuidv4 } from 'uuid';

function getCustomClientId() {
  const existingClientId = localStorage.getItem('customClientId');

  if (existingClientId) {
    return existingClientId;
  }

  const newClientId = uuidv4();
  localStorage.setItem('customClientId', newClientId);

  return newClientId;
}

export function trackPageView() {
  if (!window.gtag) {
    return;
  }

  window.gtag('event', 'page_view', {
    user_pseudo_id: getCustomClientId(),
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
  });
  console.log('pagevisit logged anonymously')
}

export function trackEvent(eventName, params) {
  if (!window.gtag) {
    return;
  }

  params = { ...params, user_pseudo_id: getCustomClientId() };
  console.log('gameplay logged anonymously')
  window.gtag('event', eventName, params);
}
