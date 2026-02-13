import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

function isExternal(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function SmartImage({ src, alt, className, sizes }: Props) {
  // External image → fallback to <img>
  if (isExternal(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
      />
    );
  }

  // Local image → use next/image
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
    />
  );
}
