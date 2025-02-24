"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./SpotsEditPage.module.scss";

const SpotsEditPage = () => {
  const router = useRouter();
  const params = useParams(); // ✅ 동적 경로에서 id 가져오기
  const id = params.id as string | undefined; // ✅ TypeScript 적용

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

  useEffect(() => {
    if (!id) return;

    const fetchSpot = async () => {
      try {
        const res = await fetch(`/api/admin/spots/${id}/edit`); // ✅ API 경로 유지
        if (!res.ok) throw new Error("Failed to fetch spot");

        const data = await res.json();
        if (!data || data.id !== Number(id)) {
          // ✅ id 일치 여부 확인
          throw new Error("Invalid spot data received");
        }

        console.log(`Spot ID ${id}:`, data);
        setFormData(data);
      } catch (error) {
        console.error(error);
        alert("데이터를 불러오는 데 실패했습니다.");
      }
    };

    fetchSpot();
  }, [id]);

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

    const res = await fetch(`/api/admin/spots/${id}/edit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Spot이 성공적으로 수정되었습니다!");
      router.push("/admin/spots");
    } else {
      alert("Spot 수정에 실패했습니다.");
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
      <h1 className={styles.title}>Spot 수정</h1>
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
          Spot 수정
        </button>
      </form>
    </div>
  );
};

export default SpotsEditPage;
