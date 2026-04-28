let sessionStartTime = null;
let currentVideoElement = null;

function getPlatformName() {
  const hostname = window.location.hostname;
  if (hostname.includes("netflix.com")) return "Netflix";
  if (hostname.includes("primevideo.com")) return "Amazon Prime";
  if (hostname.includes("youtube.com")) return "YouTube";
  return "Unknown";
}

function handlePlay() {
  if (!sessionStartTime) {
    sessionStartTime = new Date().toISOString();
    console.log(`[SubGuilt] Started watching on ${getPlatformName()} at ${sessionStartTime}`);
  }
}

function handlePause() {
  if (sessionStartTime) {
    const sessionEndTime = new Date().toISOString();
    const startTime = new Date(sessionStartTime);
    const endTime = new Date(sessionEndTime);
    const durationMinutes = (endTime - startTime) / 1000 / 60;

    if (durationMinutes > 1) { // Ignore accidental clicks under 1 minute
      const payload = {
        platform: getPlatformName(),
        event_type: "watch_session",
        session_start: sessionStartTime,
        session_end: sessionEndTime,
        duration_minutes: parseFloat(durationMinutes.toFixed(2)),
        device_type: "desktop_browser"
      };

      // Send data to the background service worker
      chrome.runtime.sendMessage({ type: "LOG_SESSION", payload: payload });
      console.log("[SubGuilt] Session logged:", payload);
    }
    sessionStartTime = null; // Reset for the next play event
  }
}

// SPAs load videos dynamically, so we must poll for new video elements
setInterval(() => {
  const video = document.querySelector('video');
  if (video && video !== currentVideoElement) {
    // Clean up old listeners if a new video element takes over
    if (currentVideoElement) {
      currentVideoElement.removeEventListener('play', handlePlay);
      currentVideoElement.removeEventListener('pause', handlePause);
    }
    
    currentVideoElement = video;
    currentVideoElement.addEventListener('play', handlePlay);
    currentVideoElement.addEventListener('pause', handlePause);
    
    // If we attached to a video that is already playing
    if (!video.paused) {
      handlePlay();
    }
  }
}, 2000);

// Ensure we log time if the user closes the tab while the video is playing
window.addEventListener('beforeunload', () => {
  if (currentVideoElement && !currentVideoElement.paused) {
    handlePause();
  }
});