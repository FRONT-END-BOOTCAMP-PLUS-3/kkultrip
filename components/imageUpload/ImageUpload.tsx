import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./ImageUpload.module.scss";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";

type ImageUploadProps = {
  onImageChange?: (file: File | null) => void;
};

const ImageUpload = ({ onImageChange }: ImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (onImageChange) {
        onImageChange(file);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageChange) {
      onImageChange(null);
    }
  };

  return (
    <div className={styles.imageUploadContainer} onClick={handleUploadClick}>
      {!imagePreview && <AiOutlinePlus className={styles.uploadIcon} />}

      {imagePreview && (
        <>
          <Image
            src={imagePreview}
            fill
            alt="image preview"
            className={styles.imagePreview}
          />
          <button
            className={styles.deleteButton}
            onClick={handleDeleteButtonClick}
          >
            <AiOutlineClose />
          </button>
        </>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className={styles.hiddenFileInput}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;
