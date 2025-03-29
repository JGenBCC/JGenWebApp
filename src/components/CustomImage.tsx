import Image, { ImageProps } from "next/image";

const CustomImage = (props: ImageProps) => {
  return <Image {...props} crossOrigin="anonymous" />;
};

export default CustomImage;
