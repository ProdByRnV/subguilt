document.addEventListener("DOMContentLoaded", () => {
  const sessionCountText = document.getElementById("sessionCount");
  const syncButton = document.getElementById("syncNow");

  function updateCount() {
    chrome.storage.local.get({ sessions: [] }, (result) => {
      sessionCountText.textContent = `Unsynced sessions: ${result.sessions.length}`;
    });
  }

  updateCount();

  syncButton.addEventListener("click", () => {
    console.log("Force Sync button clicked!");
    syncButton.textContent = "Syncing...";
    
    chrome.runtime.sendMessage({ type: "FORCE_SYNC" }, (response) => {
      // Check if the message failed to send
      if (chrome.runtime.lastError) {
        console.error("Message failed to send:", chrome.runtime.lastError.message);
        syncButton.textContent = "Error! See Console";
        return;
      }
      
      console.log("Background script responded:", response);
      syncButton.textContent = "Force Sync";
      updateCount();
    });
  });
});