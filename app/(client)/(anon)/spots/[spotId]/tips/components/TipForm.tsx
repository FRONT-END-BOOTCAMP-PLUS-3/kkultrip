"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./TipForm.module.scss";
import { GoPlus } from "react-icons/go";

const TipForm = ({
  isEdit = false,
  spotId,
  tipId,
}: {
  isEdit?: boolean;
  spotId: number;
  tipId?: number;
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [cost, setCost] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [waitingTime, setWaitingTime] = useState("");
  const [isInstant, setIsInstant] = useState(false);
  const [tipContent, setTipContent] = useState("");
  const maxLength = 500;
  const router = useRouter();

  // 팁 수정 시 기존 데이터 불러오기
  useEffect(() => {
    if (isEdit && tipId) {
      fetch(`/api/spots/${spotId}/tips/${tipId}`)
        .then((res) => res.json())
        .then((data) => {
          setCost(data.price.toLocaleString());
          setWaitingTime(data.waitingTime.toString());
          setTipContent(data.description);
          setImageUrls(data.images || []); // 기존 이미지 경로
          setIsFree(data.price === 0);
          setIsInstant(data.waitingTime === 0);
        })
        .catch((error) => console.log("❌ 팁 정보 불러오기 실패:", error));
    }
  }, [isEdit, spotId, tipId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileArray = Array.from(e.target.files);
    setImages((prev) => [...prev, ...fileArray]);
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExistingImageRemove = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(value))) {
      setCost(Number(value).toLocaleString());
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

  // 꿀팁 내용 변경 핸들러
  const handleTipChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setTipContent(text);
  };

  // 팁 등록 또는 수정 요청
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("description", tipContent);
    formData.append("price", cost.replace(/,/g, ""));
    formData.append("waitingTime", waitingTime);
    images.forEach((img) => formData.append("images", img));

    const url = isEdit
      ? `/api/spots/${spotId}/tips/${tipId}`
      : `/api/spots/${spotId}/tips/create`;

    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        alert(isEdit ? "팁이 수정되었습니다." : "팁이 등록되었습니다.");
        router.push(`/spots/${spotId}/tips`);
      } else {
        throw new Error("서버 오류");
      }
    } catch (error) {
      console.log("❌ 팁 등록/수정 실패:", error);
      alert("등록에 실패했습니다. 다시 시도해주세요.");
    }
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
        {imageUrls.map((img, index) => (
          <div key={index} className={styles.imageContainer}>
            <Image src={img} alt="기존 이미지" width={220} height={220} />
            <button
              className={styles.removeImage}
              onClick={() => handleExistingImageRemove(index)}
            >
              ✕
            </button>
          </div>
        ))}
        {images.map((img, index) => (
          <div key={index} className={styles.imageContainer}>
            <Image
              src={URL.createObjectURL(img)}
              alt="새 이미지"
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
        {images.length + imageUrls.length < 2 && (
          <label className={styles.uploadBtn}>
            <GoPlus />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={images.length + imageUrls.length >= 2}
            />
          </label>
        )}
      </div>

      {/* 1인 평균 비용 */}
      <div className={styles.formRowWrapper}>
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

      {/*  꿀팁 내용 */}
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
      <button
        className={styles.submitBtn}
        disabled={!isFormValid}
        onClick={handleSubmit}
      >
        {isEdit ? "수정" : "등록"}
      </button>
    </div>
  );
};

export default TipForm;
