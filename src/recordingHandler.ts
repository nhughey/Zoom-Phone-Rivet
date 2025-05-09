// src/recordingHandler.ts
import axios, { AxiosResponse } from "axios";
import { Readable } from "stream";
import { uploadToS3 } from "./uploadToS3";



export interface PhoneRecordingPayload {
  payload: {
    object: {
      recordings: Array<{
        call_log_id: string;
        call_id?: string;
        download_url?: string;
        id: string;
        // You can add other relevant fields here if needed
      }>;
    };
  };
}

/**
 * Handles a phone.recording_completed webhook payload
 * by downloading and uploading the recording to S3.
 */
export async function handleRecordingCompleted(
  payload: PhoneRecordingPayload
): Promise<void> {
  const recordings = payload.payload.object.recordings;

  if (!recordings || recordings.length === 0) {
    console.warn("No recordings in payload – skipping upload");
    return;
  }

  for (const recording of recordings) {
    const url = recording.download_url;
    const callLogId = recording.call_log_id;
    const recordingId = recording.id;
  // const callLogId = rec.call_log_id;

  if (!url) {
    console.warn("No download_url in payload – skipping upload");
    return;
  }

  // 1. Fetch as stream
  try {
    const response: AxiosResponse<Readable> = await axios.get(url, {
    responseType: "stream",
  });

  // 2. Build an S3 key
  const timestamp = Date.now();
  const key = `zoom-phone-recordings/${callLogId}/${timestamp}-${recordingId}.mp3`;


  // 3. Upload
  await uploadToS3(response.data, key);
  console.log(
    `✅ Uploaded recording for callLogId=${callLogId} to s3://${process.env.BUCKET_NAME}/${key}`
  );
    
  } catch (error) { 
    console.error('failed to upload recording')
  }
  
} 
 }
