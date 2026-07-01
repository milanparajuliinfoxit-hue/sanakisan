// components/CustomImage.jsx
import PropTypes from "prop-types";
import { useImage } from "@/hooks/useImage";

const CustomImage = ({ src, className, alt, onClick, fallbackSrc }) => {
  const { imageUrl, isLoading, error } = useImage(src);

  // Show loading skeleton
  if (isLoading) {
    return (
      <div 
        className={`${className} bg-gray-200 animate-pulse`}
        style={{ minWidth: '20px', minHeight: '20px' }}
      />
    );
  }

  // Show placeholder on error or no image
  if (error || !imageUrl) {
    return (
      <img
        src={fallbackSrc || "/assets/image-placeholder.png"}
        className={className}
        alt={alt || "Image placeholder"}
        onClick={onClick}
      />
    );
  }

  // Show the actual image
  return (
    <img
      src={imageUrl}
      className={className}
      alt={alt || "Image"}
      onClick={onClick}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = fallbackSrc || "/assets/image-placeholder.png";
      }}
    />
  );
};

CustomImage.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  alt: PropTypes.string,
  onClick: PropTypes.func,
  fallbackSrc: PropTypes.string,
};

CustomImage.defaultProps = {
  fallbackSrc: "/assets/image-placeholder.png",
};

export default CustomImage;