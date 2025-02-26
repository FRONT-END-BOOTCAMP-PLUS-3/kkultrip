"use client";

import { useState } from "react";
import styles from "./SearchFilter.module.scss";
import { IoSearch } from "react-icons/io5";
import Image from "next/image";

const categories = [
  { id: "", name: "전체", icon: "" },
  { id: "landmark", name: "랜드마크", icon: "/images/landmark.svg" },
  { id: "activity", name: "액티비티", icon: "/images/activity.svg" },
  { id: "cafe", name: "카페", icon: "/images/cafe.svg" },
  { id: "restaurant", name: "음식점", icon: "/images/restaurant.svg" },
];

const prices = [
  { value: "", label: "전체" },
  { value: "0", label: "무료" },
  { value: "10000", label: "~ 1만원" },
  { value: "30000", label: "~ 3만원" },
  { value: "50000", label: "~ 5만원" },
];

const SearchFilter = ({
  updateFilters,
  tempQuery,
  setTempQuery,
  initialCategory,
  initialPrice,
}: {
  updateFilters: (filters: {
    query?: string;
    category?: string;
    price?: string;
  }) => void;
  tempQuery: string;
  setTempQuery: (value: string) => void;
  initialCategory: string;
  initialPrice: string;
}) => {
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

  return (
    <div className={styles.filterContainer}>
      {/* 🔍 검색창 */}
      <form onSubmit={handleSearch} className={styles.searchBox}>
        <input
          type="text"
          placeholder="명소 검색"
          value={tempQuery}
          onChange={(e) => setTempQuery(e.target.value)} // 실시간 URL 변경 X
        />
        <button type="submit">
          <IoSearch />
        </button>
      </form>

      {/* 🏷 카테고리 필터 */}
      <div className={styles.categoryFilter}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={
              selectedCategory === category.name ? styles.selected : ""
            }
            onClick={() => handleCategorySelect(category.name)}
          >
            {category.icon && (
              <Image
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

      {/* 💰 가격 필터 (추가) */}
      <div className={styles.priceFilter}>
        {prices.map((price) => (
          <button
            key={price.value}
            className={selectedPrice === price.value ? styles.selected : ""}
            onClick={() => handlePriceSelect(price.value)}
          >
            {price.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
