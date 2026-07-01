// hooks/useImage.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useImage = (imagePath) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imagePath) {
      setImageUrl(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);
      
      const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const fullUrl = `${baseUrl.replace(/\/?$/, "/")}api/${imagePath}`;

      try {
        const response = await axios.get(fullUrl, { 
          responseType: "blob",
          timeout: 10000
        });
        const imageBlob = response.data;
        const url = URL.createObjectURL(imageBlob);
        setImageUrl(url);
      } catch (err) {
        console.error("Error fetching the image:", err);
        setError(err);
        setImageUrl('/assets/image-placeholder.png');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();

    // Cleanup
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imagePath]);

  return { imageUrl, isLoading, error };
};