import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const CustomImage = ({ src, className }) => {
  const [showImage, setShowImage] = useState(null);

  const fetchImage = async () => {
    const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const fullUrl = `${baseUrl.replace(/\/?$/, "/")}api/${src}`;

    // Validate the constructed URL
    if (!/^https?:\/\/.+/.test(fullUrl)) {
      console.error("Invalid image URL:", fullUrl);
      return;
    }

    try {
      const response = await axios.get(fullUrl, { responseType: "blob" });
      const imageBlob = response.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      setShowImage(imageUrl);
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  };

  useEffect(() => {
    if (src) {
      fetchImage();
    }
  }, [src]);

  return (
    <img
      src={showImage || "/assets/image-placeholder.png"}
      className={className}
      alt="Member"
    />
  );
};

CustomImage.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default CustomImage;
