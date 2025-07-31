import styles from "./PhotosGalleryItem.module.css";

interface PhotosGalleryItemProps {
  src: string;
  alt: string;
  avg_color: string;
  onClick: () => void;
}

export default function PhotosGalleryItem({ src, alt, avg_color, onClick }: PhotosGalleryItemProps) {
  return (
      <div
        className={styles.thumb}
        style={{
          backgroundColor: avg_color,
          borderColor: avg_color,
        }}
        onClick={onClick}
      >
        <img src={src} alt={alt} />
      </div>
  );
}
