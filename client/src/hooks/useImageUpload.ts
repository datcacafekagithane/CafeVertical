import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

interface UploadResponse {
  success: boolean;
  imageUrl: string;
  originalName: string;
  size: number;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data: UploadResponse = await response.json();
      setUploadProgress(100);
      return data.imageUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return {
    uploadImage,
    isUploading,
    uploadProgress,
  };
}