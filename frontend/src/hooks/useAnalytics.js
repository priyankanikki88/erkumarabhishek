import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/client';
import { getVisitorId, getSessionId } from '../utils/visitor';

export default function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    api.post('/analytics/track', {
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      path: location.pathname,
      referrer: document.referrer || null
    }).catch(() => {});
  }, [location.pathname]);
}
