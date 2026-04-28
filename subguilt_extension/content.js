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

    if (durationMinutes > 1) {
      const payload = {
        platform: getPlatformName(),
        event_type: "watch_session",
        session_start: sessionStartTime,
        session_end: sessionEndTime,
        duration_minutes: parseFloat(durationMinutes.toFixed(2)),
        device_type: "desktop_browser"
      };

      chrome.runtime.sendMessage({ type: "LOG_SESSION", payload: payload });
      console.log("[SubGuilt] Session logged:", payload);
    }
    sessionStartTime = null;
  }
}

setInterval(() => {
  const video = document.querySelector('video');
  if (video && video !== currentVideoElement) {
    if (currentVideoElement) {
      currentVideoElement.removeEventListener('play', handlePlay);
      currentVideoElement.removeEventListener('pause', handlePause);
    }
    
    currentVideoElement = video;
    currentVideoElement.addEventListener('play', handlePlay);
    currentVideoElement.addEventListener('pause', handlePause);
    
    if (!video.paused) {
      handlePlay();
    }
  }
}, 2000);

window.addEventListener('beforeunload', () => {
  if (currentVideoElement && !currentVideoElement.paused) {
    handlePause();
  }
});