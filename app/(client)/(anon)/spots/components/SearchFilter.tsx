"use client";

import styles from "./SearchFilter.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import Image from "next/image";

const SearchFilter = ({
  updateFilters,
  tempQuery,
  setTempQuery,
  initialCategory,
  initialPrice,
}: {
  updateFilters: (filters: {
    lat?: number;
    lon?: number;
    query?: string;
    category?: string;
    price?: string;
  }) => void;
  tempQuery: string;
  setTempQuery: (value: string) => void;
  initialCategory: string;
  initialPrice: string;
}) => {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPrice, setSelectedPrice] = useState(initialPrice);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      query: tempQuery,
      category: selectedCategory,
      price: selectedPrice,
    });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    updateFilters({ category, price: selectedPrice, query: tempQuery });
  };

  const handlePriceSelect = (price: string) => {
    setSelectedPrice(price);
    updateFilters({ category: selectedCategory, price, query: tempQuery });
  };

  const updateCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("현재 위치를 가져올 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        updateFilters({
          lat: userLat,
          lon: userLon,
          query: "",
          category: "",
          price: "",
        });
        setTempQuery("");

        // URL 업데이트
        const params = new URLSearchParams();
        params.set("lat", userLat.toString());
        params.set("lon", userLon.toString());

        router.push(`/spots?${params.toString()}`);
      },
      (error) => {
        console.log("위치 정보를 가져올 수 없음:", error);
        alert("위치 정보를 가져오지 못했습니다.");
      }
    );
  };

  return (
    <div className={styles.filterContainer}>
      {/* 검색창 */}
      <form onSubmit={handleSearch} className={styles.searchBox}>
        <input
          type="text"
          placeholder="명소, 주소 검색"
          value={tempQuery}
          onChange={(e) => setTempQuery(e.target.value)} // 실시간 URL 변경 X
        />
        <button type="submit">
          <IoSearch />
        </button>
      </form>

      {/* 카테고리 필터 */}
      <div className={styles.categoryFilter}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={
              selectedCategory === category.value ? styles.selected : ""
            }
            onClick={() => handleCategorySelect(category.value)}
          >
            {category.icon && (
              <Image
                className={styles.icon}
                src={category.icon}
                alt={category.name}
                width={20}
                height={20}
              />
            )}
            <span className={styles.label}>{category.name}</span>
          </button>
        ))}
      </div>

      {/* 가격 필터 (추가) */}
      <div className={styles.priceFilter}>
        {prices.map((price) => (
          <button
            key={price.value}
            className={selectedPrice === price.value ? styles.selected : ""}
            onClick={() => handlePriceSelect(price.value)}
          >
            <span className={styles.label}>{price.label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className={styles.updateLocationBtn}
        onClick={updateCurrentLocation}
      >
        <TbCurrentLocation className={styles.icon} />
      </button>
    </div>
  );
};

export default SearchFilter;

const categories = [
  { id: "", value: "", name: "전체", icon: "" },
  {
    id: "landmark",
    value: "랜드마크",
    name: "랜드마크",
    icon: "/images/landmark.svg",
  },
  {
    id: "activity",
    value: "액티비티",
    name: "액티비티",
    icon: "/images/activity.svg",
  },
  { id: "cafe", value: "카페", name: "카페", icon: "/images/cafe.svg" },
  {
    id: "restaurant",
    value: "음식점",
    name: "음식점",
    icon: "/images/restaurant.svg",
  },
];

const prices = [
  { value: "", label: "전체" },
  { value: "0", label: "무료" },
  { value: "10000", label: "~ 1만원" },
  { value: "30000", label: "~ 3만원" },
  { value: "50000", label: "~ 5만원" },
];
