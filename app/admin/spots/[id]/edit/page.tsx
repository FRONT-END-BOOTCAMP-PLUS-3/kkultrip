"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./SpotsEditPage.module.scss";
import Image from "next/image";
import { UpdateSpotDto } from "@/application/usecases/admin/spot/dto/UpdateSpotDto";
import { UpdateTicketDto } from "@/application/usecases/admin/spot/ticket/dto/UpdateTicketDto";
import { Time } from "@prisma/client";

const SpotsEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const spotId = params.id as string | undefined;

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const defaultOperatingHours = Object.fromEntries(
    days.map((day) => [
      day,
      { id: 0, type: "시간 지정", start: "09:00", end: "18:00" },
    ])
  );

  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    lon: number | undefined;
    lat: number | undefined;
    phone1: string;
    phone2: string;
    phone3: string;
    info: string;
    category: string;
    link: string;
    img: string;
    tickets: { id: number | null; name: string; price: string | number }[];
    operatingHours: typeof defaultOperatingHours;
    docents: {
      id: number | null;
      title: string;
      description: string;
      audioPath: string;
    }[];
  }>({
    name: "",
    address: "",
    lon: undefined,
    lat: undefined,
    phone1: "",
    phone2: "",
    phone3: "",
    info: "",
    category: "",
    link: "",
    img: "",
    tickets: [{ id: null, name: "", price: "" }],
    operatingHours: defaultOperatingHours,
    docents: [{ id: null, title: "", description: "", audioPath: "" }],
  });

  const [initialTickets, setInitialTickets] = useState<
    { id: number | null; name: string; price: string | number }[]
  >([]);
  const phoneRef1 = useRef<HTMLInputElement>(null);
  const phoneRef2 = useRef<HTMLInputElement>(null);
  const phoneRef3 = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (spotId) {
      fetch(`/api/admin/spots/${spotId}`)
        .then((res) => res.json())
        .then((data) => {
          const [phone1, phone2, phone3] = data.phone?.split("-") || [
            "",
            "",
            "",
          ];
          const operatingHours = days.reduce((acc, day) => {
            const timeInfo = data.times?.find((time: Time) => time.day === day);
            if (timeInfo) {
              acc[day] = {
                id: timeInfo.id,
                type: timeInfo.all_hours
                  ? "24시간"
                  : timeInfo.closeDay
                  ? "휴무"
                  : "시간 지정",
                start: timeInfo.open || "",
                end: timeInfo.close || "",
              };
            } else {
              acc[day] = { ...defaultOperatingHours[day], id: 0 };
            }
            return acc;
          }, {} as typeof defaultOperatingHours);

          setFormData({
            ...data,
            phone1,
            phone2,
            phone3,
            operatingHours,
            tickets: data.tickets || [],
            docents: data.docents || [
              { title: "", description: "", audioPath: "" },
            ],
          });
          setInitialTickets(data.tickets || []);
        });
    }
  }, [spotId]);

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    part: "phone1" | "phone2" | "phone3"
  ) => {
    let value = e.target.value.replace(/\D/g, "");
    if (part === "phone1" && value.length > 3) value = value.slice(0, 3);
    if (part === "phone2" && value.length > 4) value = value.slice(0, 4);
    if (part === "phone3" && value.length > 4) value = value.slice(0, 4);
    setFormData((prev) => ({ ...prev, [part]: value }));

    if (part === "phone1" && value.length === 3) phoneRef2.current?.focus();
    if (part === "phone2" && value.length === 4) phoneRef3.current?.focus();
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

  const handleConvertAddress = async () => {
    try {
      const res = await fetch(
        `/api/geocode?query=${encodeURIComponent(formData.address)}`
      );
      const data = await res.json();
      if (data.lat && data.lon) {
        setFormData((prev) => ({
          ...prev,
          lat: data.lat,
          lon: data.lon,
        }));
        alert("주소가 성공적으로 변환되었습니다.");
      } else {
        alert("주소 변환에 실패했습니다.");
      }
    } catch (error) {
      console.error("주소 변환 오류:", error);
      alert("주소 변환 중 오류가 발생했습니다.");
    }
  };

  const handleOperatingHoursChange = (
    day: keyof typeof defaultOperatingHours,
    field: "type" | "start" | "end",
    value: string
  ) => {
    setFormData((prev) => {
      const updatedHours = { ...prev.operatingHours };

      if (field === "type") {
        if (value === "24시간") {
          updatedHours[day] = {
            ...updatedHours[day],
            type: value,
            start: "",
            end: "",
          };
        } else if (value === "휴무") {
          updatedHours[day] = {
            ...updatedHours[day],
            type: value,
            start: "",
            end: "",
          };
        } else {
          updatedHours[day] = {
            ...updatedHours[day],
            type: value,
            start: "09:00",
            end: "18:00",
          };
        }
      } else {
        updatedHours[day] = { ...updatedHours[day], [field]: value };
      }

      return { ...prev, operatingHours: updatedHours };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const phone = `${formData.phone1}-${formData.phone2}-${formData.phone3}`;
    const tickets: UpdateTicketDto[] = formData.tickets.map((ticket) => ({
      id: ticket.id,
      name: ticket.name,
      price: Number(ticket.price),
    }));
    const data: UpdateSpotDto = {
      ...formData,
      phone,
      tickets,
      times: Object.entries(formData.operatingHours).map(([day, hours]) => ({
        id: hours.id || null,
        spotId: Number(spotId),
        day,
        open: hours.start || null,
        close: hours.end || null,
        all_hours: hours.type === "24시간",
        closeDay: hours.type === "휴무",
      })),
      docents: formData.docents.map((docent) => ({
        id: docent.id || null,
        title: docent.title,
        description: docent.description,
        audioPath: docent.audioPath,
      })),
      updatedAt: new Date(),
    };
    const res = await fetch(`/api/admin/spots/${spotId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Spot이 성공적으로 수정되었습니다!");
      router.push("/admin/spots");
    } else {
      alert("Spot 수정에 실패했습니다.");
    }

    const deletedTickets = initialTickets.filter(
      (initialTicket) =>
        !formData.tickets.some((ticket) => ticket.id === initialTicket.id)
    );

    for (const ticket of deletedTickets) {
      await fetch(`/api/admin/spots/${spotId}/${ticket.id}`, {
        method: "DELETE",
      });
    }
  };

  const handleTicketChange = (
    index: number,
    field: "name" | "price",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      tickets: prev.tickets.map((ticket, i) =>
        i === index
          ? {
              ...ticket,
              [field]: field === "price" ? Number(value) || 0 : value,
            }
          : ticket
      ),
    }));
  };

  const addTicket = () => {
    setFormData((prev) => ({
      ...prev,
      tickets: [...prev.tickets, { id: null, name: "", price: "" }],
    }));
  };

  const removeTicket = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tickets: prev.tickets.filter((_, i) => i !== index),
    }));
  };

  const handleDocentChange = (
    index: number,
    field: "title" | "description" | "audioPath",
    value: string | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      docents: prev.docents.map((docent, i) =>
        i === index ? { ...docent, [field]: value } : docent
      ),
    }));
  };

  const addDocent = () => {
    setFormData((prev) => ({
      ...prev,
      docents: [
        ...prev.docents,
        { id: null, title: "", description: "", audioPath: "" },
      ],
    }));
  };

  const removeDocent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      docents: prev.docents.filter((_, i) => i !== index),
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
      <h1 className={styles.title}>Spot 수정</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <div className={styles.addressContainer}>
          <input
            type="text"
            name="address"
            placeholder="주소"
            value={formData.address}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <button
            type="button"
            onClick={handleConvertAddress}
            className={styles.convertButton}
          >
            변환
          </button>
        </div>
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
          type="number"
          name="lon"
          value={formData.lon ?? ""}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <input
          type="number"
          name="lat"
          value={formData.lat ?? ""}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <div className={styles.phoneInputContainer}>
          <input
            type="text"
            ref={phoneRef1}
            value={formData.phone1 ?? ""}
            onChange={(e) => handlePhoneChange(e, "phone1")}
            className={styles.inputField}
            maxLength={3}
          />
          <span>-</span>
          <input
            type="text"
            ref={phoneRef2}
            value={formData.phone2 ?? ""}
            onChange={(e) => handlePhoneChange(e, "phone2")}
            className={styles.inputField}
            maxLength={4}
          />
          <span>-</span>
          <input
            type="text"
            ref={phoneRef3}
            value={formData.phone3 ?? ""}
            onChange={(e) => handlePhoneChange(e, "phone3")}
            className={styles.inputField}
            maxLength={4}
          />
        </div>
        <textarea
          name="info"
          value={formData.info ?? ""}
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
          value={formData.link ?? ""}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.inputField}
          ref={fileInputRef}
        />
        {/* 이미지 미리보기 */}
        {formData.img && (
          <div className={styles.imagePreviewContainer}>
            <Image
              src={formData.img}
              alt="미리보기"
              className={styles.imagePreview}
              width={300}
              height={300}
            />
          </div>
        )}

        <div className={styles.ticketsContainer}>
          <h2>티켓 정보</h2>
          {formData.tickets &&
            formData.tickets.map((ticket, index) => (
              <div key={index} className={styles.ticketRow}>
                <input
                  type="text"
                  placeholder="티켓 이름"
                  value={ticket.name}
                  className={styles.inputField}
                  onChange={(e) =>
                    handleTicketChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="티켓 가격"
                  value={ticket.price}
                  className={styles.inputField}
                  onChange={(e) =>
                    handleTicketChange(index, "price", e.target.value)
                  }
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

        <div className={styles.operatingHoursContainer}>
          <h2>운영 시간</h2>
          {Object.entries(formData.operatingHours).map(([day, data]) => {
            const isDisabled = data.type !== "시간 지정";

            return (
              <div key={day} className={styles.operatingHoursRow}>
                <span className={styles.dayLabel}>{day}</span>

                <input
                  type="time"
                  value={data.start}
                  disabled={isDisabled}
                  onChange={(e) =>
                    handleOperatingHoursChange(
                      day as keyof typeof defaultOperatingHours,
                      "start",
                      e.target.value
                    )
                  }
                  className={`${styles.timeInput} ${
                    isDisabled ? styles.disabledInput : ""
                  }`}
                />

                <input
                  type="time"
                  value={data.end}
                  disabled={isDisabled}
                  onChange={(e) =>
                    handleOperatingHoursChange(
                      day as keyof typeof defaultOperatingHours,
                      "end",
                      e.target.value
                    )
                  }
                  className={`${styles.timeInput} ${
                    isDisabled ? styles.disabledInput : ""
                  }`}
                />

                <select
                  value={data.type}
                  onChange={(e) =>
                    handleOperatingHoursChange(
                      day as keyof typeof defaultOperatingHours,
                      "type",
                      e.target.value
                    )
                  }
                  className={styles.selectField}
                >
                  <option value="시간 지정">시간 지정</option>
                  <option value="24시간">24시간</option>
                  <option value="휴무">휴무</option>
                </select>
              </div>
            );
          })}
        </div>

        <div className={styles.docentsContainer}>
          <h2>도슨트 정보</h2>
          {formData.docents.map((docent, index) => (
            <div key={index} className={styles.docentItem}>
              <div className={styles.docentRow}>
                <input
                  type="text"
                  placeholder="도슨트 제목"
                  value={docent.title}
                  className={styles.inputField}
                  onChange={(e) =>
                    handleDocentChange(index, "title", e.target.value)
                  }
                />
                <textarea
                  placeholder="도슨트 설명"
                  value={docent.description}
                  className={styles.textareaField}
                  onChange={(e) =>
                    handleDocentChange(index, "description", e.target.value)
                  }
                />
                <button type="button" onClick={() => removeDocent(index)}>
                  삭제
                </button>
              </div>
              <div className={styles.docentRow}>
                <input
                  type="file"
                  accept="audio/*"
                  className={styles.inputField}
                  onChange={(e) =>
                    handleDocentChange(
                      index,
                      "audioPath",
                      e.target.files?.[0] || null
                    )
                  }
                />
              </div>
              <div className={styles.docentRow}>
                {typeof docent.audioPath === "string" && (
                  <p className={styles.inputField}>{docent.audioPath}</p>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addDocent}
            className={styles.addButton}
          >
            도슨트 추가
          </button>
        </div>

        <button type="submit" className={styles.submitButton}>
          Spot 수정
        </button>
      </form>
    </div>
  );
};

export default SpotsEditPage;
