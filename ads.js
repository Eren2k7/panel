/* ads.js
   Shared ad storage + helpers for URL-based ads.
   localStorage key: 'site_ads_v1'
*/

const ADS_KEY = 'site_ads_v1';

/* --- Storage helpers --- */
function loadAds() {
  try {
    const raw = localStorage.getItem(ADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load ads', e);
    return [];
  }
}

function saveAds(ads) {
  try {
    localStorage.setItem(ADS_KEY, JSON.stringify(ads));
  } catch (e) {
    console.error('Failed to save ads', e);
  }
}

/* create a new ad object
   type: 'image' | 'video' | 'text'
   payload: for image/video = URL string, for text = plain text
   meta: optional {title, link}
*/
function createAd(type, payload, meta = {}) {
  return {
    id: 'ad_' + Date.now() + '_' + Math.floor(Math.random()*1000),
    type,
    payload,
    meta,
    createdAt: new Date().toISOString()
  };
}

/* create ad from URL (image/video) or text */
function createAdFromURL(type, urlOrText, meta = {}) {
  if (type === 'text') {
    return createAd('text', urlOrText, meta);
  }
  // For URL types, just store the URL as payload
  return createAd(type, urlOrText, meta);
}

/* delete ad by id */
function deleteAd(id) {
  const ads = loadAds().filter(a => a.id !== id);
  saveAds(ads);
}

/* update ad by id (partial update) */
function updateAd(id, patch) {
  const ads = loadAds();
  const idx = ads.findIndex(a => a.id === id);
  if (idx !== -1) {
    ads[idx] = { ...ads[idx], ...patch };
    saveAds(ads);
  }
}

/* clear all ads (admin convenience) */
function clearAllAds() {
  localStorage.removeItem(ADS_KEY);
}

/* Expose functions to window for easy use from pages */
window.AdStore = {
  loadAds,
  saveAds,
  createAd,
  createAdFromURL,
  deleteAd,
  updateAd,
  clearAllAds
};
