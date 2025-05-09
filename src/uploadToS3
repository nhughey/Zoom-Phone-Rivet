import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.BUCKET_NAME;

if (!BUCKET) {
  throw new Error("Missing env var: BUCKET_NAME");
}
if (!REGION) {
  throw new Error("Missing env var: AWS_REGION");
}

const s3 = new S3Client({ region: REGION });

/**
 * Uploads a Readable stream to S3 under the given key.
 */
export async function uploadToS3(
  stream: Readable,
  key: string
): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: stream,
      ContentType: "audio/mpeg", // adjust if Zoom returns wav/etc
    })
  );
}
