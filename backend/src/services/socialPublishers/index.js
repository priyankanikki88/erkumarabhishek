const facebook = require('./facebook');
const instagram = require('./instagram');
const youtube = require('./youtube');

async function publishToTarget(account, post, mediaInfo) {
  if (account.platform === 'facebook') return facebook.publish({ account, post, mediaUrl: mediaInfo.mediaUrl });
  if (account.platform === 'instagram') return instagram.publish({ account, post, mediaUrl: mediaInfo.mediaUrl });
  if (account.platform === 'youtube') {
    return youtube.publish({ account, post, mediaAbsolutePath: mediaInfo.mediaAbsolutePath, mediaMime: mediaInfo.mediaMime });
  }
  throw new Error(`Unknown platform: ${account.platform}`);
}

module.exports = { publishToTarget };
