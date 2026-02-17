"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_bot_1 = require("@rootsdk/server-bot");
const mojave_1 = require("./mojave");
async function onStarting(state) {
    console.log('🤖 Starting Mojave D&D Bot...');
    (0, mojave_1.initializeMojave)();
}
(async () => {
    await server_bot_1.rootServer.lifecycle.start(onStarting);
})();
