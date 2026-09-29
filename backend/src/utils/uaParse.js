function detectDevice(ua = '') {
  const s = ua.toLowerCase();
  if (/ipad|tablet/.test(s)) return 'tablet';
  if (/mobi|android|iphone/.test(s)) return 'mobile';
  if (s) return 'desktop';
  return 'other';
}

function detectBrowser(ua = '') {
  const s = ua.toLowerCase();
  if (s.includes('edg/')) return 'Edge';
  if (s.includes('chrome/') && !s.includes('chromium')) return 'Chrome';
  if (s.includes('firefox/')) return 'Firefox';
  if (s.includes('safari/') && !s.includes('chrome/')) return 'Safari';
  if (s.includes('opr/') || s.includes('opera')) return 'Opera';
  return 'Other';
}

function detectOS(ua = '') {
  const s = ua.toLowerCase();
  if (s.includes('windows')) return 'Windows';
  if (s.includes('mac os')) return 'macOS';
  if (s.includes('android')) return 'Android';
  if (s.includes('iphone') || s.includes('ipad')) return 'iOS';
  if (s.includes('linux')) return 'Linux';
  return 'Other';
}

function sourceFromReferrer(referrer = '') {
  if (!referrer) return 'direct';
  try {
    const host = new URL(referrer).hostname.replace('www.', '');
    if (/google\./.test(host)) return 'google';
    if (/bing\./.test(host)) return 'bing';
    if (/facebook\.|fb\./.test(host)) return 'facebook';
    if (/instagram\./.test(host)) return 'instagram';
    if (/linkedin\./.test(host)) return 'linkedin';
    if (/t\.co|twitter\.|x\.com/.test(host)) return 'twitter';
    if (/whatsapp\./.test(host)) return 'whatsapp';
    return host;
  } catch (_) {
    return 'direct';
  }
}

module.exports = { detectDevice, detectBrowser, detectOS, sourceFromReferrer };
