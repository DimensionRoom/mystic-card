interface OracleCardImageProps {
  src?: string;
  alt: string;
  className?: string;
}

/** card art with a CSS gradient fallback when no asset exists */
export default function OracleCardImage({
  src,
  alt,
  className = "",
}: OracleCardImageProps) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center rounded-[18px] border border-[#E9D8FF] bg-gradient-to-b from-[#6f58b8] via-[#8d76c9] to-[#d9c2ec] shadow-pastel ${className}`}
      >
        <span className="text-4xl" aria-hidden="true">
          🌙
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-[18px] border border-[#E9D8FF] object-cover shadow-pastel ${className}`}
    />
  );
}
