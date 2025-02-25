"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./SpotsCreatePage.module.scss";

const SpotsCreatePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    lon: null,
    lat: null,
    phone1: "",
    phone2: "",
    phone3: "",
    info: "",
    category: "",
    link: "",
    img: "",
    tickets: [{ name: "", price: "" }], // [수정] 티켓 배열 추가
  });

  // 입력 필드 참조 (자동 포커스 이동을 위해)
  const phoneRef1 = useRef<HTMLInputElement>(null);
  const phoneRef2 = useRef<HTMLInputElement>(null);
  const phoneRef3 = useRef<HTMLInputElement>(null);

  // 전화번호 입력 핸들러
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    part: "phone1" | "phone2" | "phone3"
  ) => {
    let value = e.target.value.replace(/\D/g, ""); // 숫자만 입력받기

    if (part === "phone1" && value.length > 3) value = value.slice(0, 3);
    if (part === "phone2" && value.length > 4) value = value.slice(0, 4);
    if (part === "phone3" && value.length > 4) value = value.slice(0, 4);

    setFormData((prev) => ({ ...prev, [part]: value }));

    // 자동 포커스 이동
    if (part === "phone1" && value.length === 3) phoneRef2.current?.focus();
    if (part === "phone2" && (value.length === 4 || value.length === 4))
      phoneRef3.current?.focus();
  };

  // 백스페이스로 이전 칸 이동
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    part: "phone1" | "phone2" | "phone3"
  ) => {
    if (e.key === "Backspace" && formData[part] === "") {
      if (part === "phone3") phoneRef2.current?.focus();
      if (part === "phone2") phoneRef1.current?.focus();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? parseFloat(value) : null) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, img: imageUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phone = `${formData.phone1}-${formData.phone2}-${formData.phone3}`;

    const data = {
      ...formData,
      phone, // 하나의 필드로 합쳐서 전송
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await fetch("/api/admin/spots", {
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
        phone1: "",
        phone2: "",
        phone3: "",
        info: "",
        category: "",
        link: "",
        img: "",
        tickets: [{ name: "", price: "" }], // [수정] 티켓 배열 추가
      });
      router.push("/admin/spots");
    } else {
      alert("Spot 생성에 실패했습니다.");
    }
  };

  const handleTicketChange = <T extends keyof (typeof formData.tickets)[0]>(
    index: number,
    field: T,
    value: (typeof formData.tickets)[0][T]
  ) => {
    const updatedTickets = [...formData.tickets];
    updatedTickets[index][field] = value;

    setFormData((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  const addTicket = () => {
    setFormData((prev) => ({
      ...prev,
      tickets: [...prev.tickets, { name: "", price: "" }],
    }));
  };

  const removeTicket = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tickets: prev.tickets.filter((_, i) => i !== index),
    }));
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

        {/* 전화번호 입력 (3개 칸) */}
        <div className={styles.phoneInputContainer}>
          <input
            type="text"
            ref={phoneRef1}
            value={formData.phone1}
            onChange={(e) => handlePhoneChange(e, "phone1")}
            onKeyDown={(e) => handleKeyDown(e, "phone1")}
            className={styles.inputField}
            placeholder="000"
            maxLength={3}
            required
          />
          <span>-</span>
          <input
            type="text"
            ref={phoneRef2}
            value={formData.phone2}
            onChange={(e) => handlePhoneChange(e, "phone2")}
            onKeyDown={(e) => handleKeyDown(e, "phone2")}
            className={styles.inputField}
            placeholder="0000"
            maxLength={4}
            required
          />
          <span>-</span>
          <input
            type="text"
            ref={phoneRef3}
            value={formData.phone3}
            onChange={(e) => handlePhoneChange(e, "phone3")}
            onKeyDown={(e) => handleKeyDown(e, "phone3")}
            className={styles.inputField}
            placeholder="0000"
            maxLength={4}
            required
          />
        </div>

        <textarea
          name="info"
          placeholder="정보"
          value={formData.info}
          onChange={handleChange}
          className={styles.textareaField}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`${styles.inputField} ${styles.selectField}`}
          required
        >
          <option value="">카테고리 선택</option>
          <option value="액티비티">액티비티</option>
          <option value="랜드마크">랜드마크</option>
          <option value="카페">카페</option>
          <option value="음식점">음식점</option>
        </select>

        <input
          type="url"
          name="link"
          placeholder="웹사이트 링크"
          value={formData.link}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.inputField}
          required
        />
        {/* 이미지 미리보기 */}
        {formData.img && (
          <div className={styles.imagePreviewContainer}>
            <img
              src={formData.img}
              alt="미리보기"
              className={styles.imagePreview}
            />
          </div>
        )}

        <div className={styles.ticketsContainer}>
          <h2>티켓 정보</h2>
          {formData.tickets.map((ticket, index) => (
            <div key={index} className={styles.ticketRow}>
              <input
                type="text"
                placeholder="티켓 이름"
                value={ticket.name}
                className={styles.inputField}
                onChange={(e) =>
                  handleTicketChange(index, "name", e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="티켓 가격"
                value={ticket.price}
                className={styles.inputField}
                onChange={(e) =>
                  handleTicketChange(index, "price", e.target.value)
                }
                required
              />
              <button type="button" onClick={() => removeTicket(index)}>
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTicket}
            className={styles.addButton}
          >
            티켓 추가
          </button>
        </div>

        <button type="submit" className={styles.submitButton}>
          Spot 생성
        </button>
      </form>
    </div>
  );
};

export default SpotsCreatePage;
