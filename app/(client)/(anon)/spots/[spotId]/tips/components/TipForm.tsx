"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./TipForm.module.scss";
import { GoPlus } from "react-icons/go";

const TipForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const [images, setImages] = useState<File[]>([]);
  const [cost, setCost] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [waitingTime, setWaitingTime] = useState("");
  const [isInstant, setIsInstant] = useState(false);
  const [tipContent, setTipContent] = useState("");
  const maxLength = 500;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileArray = Array.from(e.target.files);
    setImages((prev) => [...prev, ...fileArray]);
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, ""); // 기존 쉼표 제거
    if (!isNaN(Number(value))) {
      setCost(Number(value).toLocaleString()); // 쉼표 추가된 숫자로 변환
    }
  };

  const handleFreeCheck = () => {
    setIsFree(!isFree);
    setCost(isFree ? "" : "0");
  };

  const handleInstantCheck = () => {
    setIsInstant(!isInstant);
    setWaitingTime(isInstant ? "" : "0");
  };

  const handleTipChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setTipContent(text);
  };

  // 모든 입력값이 채워졌는지 확인
  const isFormValid =
    cost !== "" && waitingTime !== "" && tipContent.trim() !== "";

  return (
    <div className={styles.tipFormContainer}>
      <h2>{isEdit ? "꿀팁 수정" : "꿀팁 등록"}</h2>

      {/* 사진 업로드 */}
      <h3>장소 사진 (최대 2개)</h3>
      <div
        className={
          images.length >= 1 ? styles.imagePreviewFull : styles.imagePreview
        }
      >
        {images.map((img, index) => (
          <div key={index} className={styles.imageContainer}>
            <Image
              src={URL.createObjectURL(img)}
              alt="업로드된 이미지"
              width={220}
              height={220}
            />
            <button
              className={styles.removeImage}
              onClick={() => handleImageRemove(index)}
            >
              ✕
            </button>
          </div>
        ))}
        {images.length < 2 && (
          <label className={styles.uploadBtn}>
            <GoPlus />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={images.length >= 2}
            />
          </label>
        )}
      </div>

      <div className={styles.formRowWrapper}>
        {/* 1인 평균 비용 */}
        <div className={styles.formRowBox}>
          <h3>1인 평균 비용</h3>
          <div className={styles.formRow}>
            <div className={styles.wrapInput}>
              <input
                type="text"
                value={cost}
                onChange={handleCostChange}
                disabled={isFree}
                placeholder="0"
                maxLength={7}
              />
              <span className={styles.unit}>원</span>
            </div>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={isFree}
                onChange={handleFreeCheck}
              />
              <span>무료</span>
            </label>
          </div>
        </div>

        {/* 대기 시간 */}
        <div className={styles.formRowBox}>
          <h3>대기 시간</h3>
          <div className={styles.formRow}>
            <div className={styles.wrapInput}>
              <input
                type="text"
                value={waitingTime}
                onChange={(e) => setWaitingTime(e.target.value)}
                disabled={isInstant}
                placeholder="0"
                maxLength={7}
              />
              <span className={styles.unit}>분</span>
            </div>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={isInstant}
                onChange={handleInstantCheck}
              />
              <span>바로입장</span>
            </label>
          </div>
        </div>
      </div>

      {/* 꿀팁 내용 */}
      <div className={styles.textareaWrapper}>
        <h3>꿀팁 내용</h3>
        <textarea
          placeholder="꿀팁을 입력하세요."
          value={tipContent}
          onChange={handleTipChange}
          maxLength={maxLength}
        />
        <span className={styles.charCount}>
          {tipContent.length} / {maxLength}
        </span>
      </div>

      {/* 등록 / 수정 버튼 */}
      <div className={styles.wrapBtn}>
        <button className={styles.submitBtn} disabled={!isFormValid}>
          {isEdit ? "수정" : "등록"}
        </button>
      </div>
    </div>
  );
};

export default TipForm;
