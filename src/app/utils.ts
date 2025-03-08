import { randomUUID } from "crypto";

export function getDateString() {
  return new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "long",
    timeZone: "UTC",
  });
}

export function getRandomUUID() {
  return randomUUID();
}

// Function to compress the image using a canvas.
export function compressImage(file: File, quality = 0.7, maxWidth = 1024): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio.
      const scaleSize = maxWidth / image.width;
      const canvas = document.createElement("canvas");
      canvas.width = maxWidth;
      canvas.height = image.height * scaleSize;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      } else {
        reject(new Error("Failed to get canvas context."));
        return;
      }

      // Convert canvas to Blob (compressed image)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Compression failed."));
          }
        },
        "image/jpeg", // you can change the format if needed
        quality      // quality factor between 0 (lowest) and 1 (highest)
      );
    };
    image.onerror = (error) => reject(error);
  });
}
