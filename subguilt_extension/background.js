const API_ENDPOINT = "http://127.0.0.1:8000/api/track"; 

console.log("[SubGuilt] Service Worker has started and is awake.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`[SubGuilt] Received message type: ${message.type}`);
  
  if (message.type === "LOG_SESSION") {
    chrome.storage.local.get({ sessions: [] }).then((result) => {
      const updatedSessions = [...result.sessions, message.payload];
      chrome.storage.local.set({ sessions: updatedSessions });
      console.log(`[SubGuilt] Saved session. Total pending: ${updatedSessions.length}`);
    });
  } 
  else if (message.type === "FORCE_SYNC") {
    console.log("[SubGuilt] Starting manual sync process...");
    syncSessionsToBackend().then(() => {
      console.log("[SubGuilt] Sync process finished.");
      sendResponse({ status: "success" });
    });
    return true; // Keep the message channel open
  }
});

async function syncSessionsToBackend() {
  try {
    const result = await chrome.storage.local.get({ sessions: [], user_id: "demo_user_123" });
    console.log(`[SubGuilt] Attempting to push ${result.sessions.length} sessions to backend.`);

    if (result.sessions.length === 0) {
      return;
    }

    const payload = {
      user_id: result.user_id,
      sessions: result.sessions
    };

    console.log("[SubGuilt] Sending payload:", payload);

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      await chrome.storage.local.set({ sessions: [] });
      console.log("[SubGuilt] ✅ SUCCESS! Backend accepted the data.");
    } else {
      console.error("[SubGuilt] ❌ SERVER REJECTED DATA. Status:", response.status);
    }
  } catch (error) {
    console.error("[SubGuilt] ❌ CRITICAL FETCH ERROR (Is FastAPI running?):", error);
  }
}