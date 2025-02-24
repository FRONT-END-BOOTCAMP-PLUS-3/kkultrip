"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 추가
import styles from "./SpotsCreatePage.module.scss";

const SpotsCreatePage = () => {
  const router = useRouter(); // 추가
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    lon: null,
    lat: null,
    phone: "",
    info: "",
    category: "",
    link: "",
    img: "",
    avgPrice: null,
    avgWaitingTime: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? parseFloat(value) : null) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await fetch("/api/admin/spots/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Spot이 성공적으로 생성되었습니다!");
      setFormData({
        name: "",
        address: "",
        lon: null,
        lat: null,
        phone: "",
        info: "",
        category: "",
        link: "",
        img: "",
        avgPrice: null,
        avgWaitingTime: null,
      });
      router.push("/admin/spots"); // 생성 후 자동 이동
    } else {
      alert("Spot 생성에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => router.push("/admin/spots")}
        className={styles.backButton}
      >
        뒤로가기
      </button>
      <h1 className={styles.title}>새로운 Spot 생성</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="주소"
          value={formData.address}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <input
          type="number"
          name="lon"
          placeholder="경도 (lon)"
          value={formData.lon ?? ""}
          onChange={handleChange}
          className={styles.inputField}
          step="any"
          required
        />
        <input
          type="number"
          name="lat"
          placeholder="위도 (lat)"
          value={formData.lat ?? ""}
          onChange={handleChange}
          className={styles.inputField}
          step="any"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="전화번호"
          value={formData.phone}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <textarea
          name="info"
          placeholder="정보"
          value={formData.info}
          onChange={handleChange}
          className={styles.textareaField}
        />
        <input
          type="text"
          name="category"
          placeholder="카테고리"
          value={formData.category}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <input
          type="url"
          name="link"
          placeholder="웹사이트 링크"
          value={formData.link}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="text"
          name="img"
          placeholder="이미지 URL"
          value={formData.img}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <input
          type="number"
          name="avgPrice"
          placeholder="평균 가격"
          value={formData.avgPrice ?? ""}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="number"
          name="avgWaitingTime"
          placeholder="평균 대기 시간(분)"
          value={formData.avgWaitingTime ?? ""}
          onChange={handleChange}
          className={styles.inputField}
        />
        <button type="submit" className={styles.submitButton}>
          Spot 생성
        </button>
      </form>
    </div>
  );
};

export default SpotsCreatePage;
