import { rootServer, RootBotStartState } from "@rootsdk/server-bot";
import { initializeMojave } from "./mojave";
import { startKeepalive, setupGracefulShutdown } from "./keepalive";

async function onStarting(state: RootBotStartState) {
  console.log('🤖 Starting Mojave D&D Bot...');
  
  // Initialize bot commands
  initializeMojave();
  
  // Start connection keepalive
  startKeepalive();
  
  // Setup graceful shutdown handlers
  setupGracefulShutdown();
  
  console.log('✅ Mojave is fully initialized and ready!');
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
