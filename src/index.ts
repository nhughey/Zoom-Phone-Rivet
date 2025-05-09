// src/index.ts
import { PhoneOAuthClient } from "@zoom/rivet/phone";
import dotenv from "dotenv";
import { handleRecordingCompleted } from "./recordingHandler";

dotenv.config();

const {
  CLIENT_ID,
  CLIENT_SECRET,
  WEBHOOK_SECRET_TOKEN,
  OAUTH_PORT = "4000",
} = process.env;

if (!CLIENT_ID || !CLIENT_SECRET || !WEBHOOK_SECRET_TOKEN) {
  console.error(
    "Ensure CLIENT_ID, CLIENT_SECRET, and WEBHOOK_SECRET_TOKEN are set in .env"
  );
  process.exit(1);
}

const phoneClient = new PhoneOAuthClient({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  webhooksSecretToken: WEBHOOK_SECRET_TOKEN,
  installerOptions: {
    redirectUri: "https://3a3f-63-233-134-131.ngrok-free.app",
    stateStore: "abc",
  },
  port: parseInt(OAUTH_PORT, 10),
});

(async () => {
  try {
    phoneClient.webEventConsumer.event(
      "phone.recording_completed",
      async ({ payload }) => {
        try {
         await handleRecordingCompleted(payload);
          console
        } catch (err) {
          console.error("Error in recording handler:", err);
        }
      }
    );

    await phoneClient.start();
    console.log(`OAuth server running on http://localhost:${OAUTH_PORT}`);
  } catch (err) {
    console.error("Failed to start OAuth server:", err);
  }
})();
