"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./TipForm.module.scss";

const TipForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const [images, setImages] = useState<File[]>([]);
  const [cost, setCost] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [waitingTime, setWaitingTime] = useState("");
  const [isInstant, setIsInstant] = useState(false);
  const [tipContent, setTipContent] = useState("");
  const maxLength = 500;

  // 사진 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileArray = Array.from(e.target.files);
    if (images.length + fileArray.length > 2) {
      alert("사진은 최대 2장만 등록할 수 있습니다.");
      return;
    }
    setImages((prev) => [...prev, ...fileArray]);
  };

  // 사진 삭제 핸들러
  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 무료 체크 시 가격 0원 설정
  const handleFreeCheck = () => {
    setIsFree(!isFree);
    setCost(isFree ? "" : "0");
  };

  // 바로입장 체크 시 대기시간 0분 설정
  const handleInstantCheck = () => {
    setIsInstant(!isInstant);
    setWaitingTime(isInstant ? "" : "0");
  };

  // 꿀팁 내용 변경 핸들러
  const handleTipChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length > maxLength) {
      alert("꿀팁 내용은 최대 500자까지 입력 가능합니다.");
      return;
    }
    setTipContent(text);
  };

  // 모든 입력값이 채워졌는지 확인
  const isFormValid =
    images.length > 0 &&
    cost !== "" &&
    waitingTime !== "" &&
    tipContent.trim() !== "";

  return (
    <div className={styles.tipForm}>
      <h2>{isEdit ? "꿀팁 수정" : "꿀팁 등록"}</h2>

      {/* 사진 업로드 */}
      <div className={styles.imageUpload}>
        <div className={styles.imagePreview}>
          {images.map((img, index) => (
            <div key={index} className={styles.imageContainer}>
              <Image
                src={URL.createObjectURL(img)}
                alt="업로드된 이미지"
                width={60}
                height={60}
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
              <span className={styles.plus}>+</span>
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
      </div>

      {/* 1인 평균 비용 */}
      <div className={styles.formRow}>
        <label>1인 평균 비용</label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          disabled={isFree}
          placeholder="금액을 입력해주세요."
        />
        <span>원</span>
        <label className={styles.checkbox}>
          <input type="checkbox" checked={isFree} onChange={handleFreeCheck} />
          무료
        </label>
      </div>

      {/* 대기 시간 */}
      <div className={styles.formRow}>
        <label>대기 시간</label>
        <input
          type="number"
          value={waitingTime}
          onChange={(e) => setWaitingTime(e.target.value)}
          disabled={isInstant}
          placeholder="대기 시간을 입력해주세요."
        />
        <span>분</span>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={isInstant}
            onChange={handleInstantCheck}
          />
          바로입장
        </label>
      </div>

      {/* 꿀팁 내용 */}
      <div className={styles.textareaContainer}>
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
      <button className={styles.submitBtn} disabled={!isFormValid}>
        {isEdit ? "수정" : "등록"}
      </button>
    </div>
  );
};

export default TipForm;
