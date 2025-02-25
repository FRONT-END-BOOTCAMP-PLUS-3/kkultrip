"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./SearchFilter.module.scss";
import Image from "next/image";

const categories = [
  { id: "undefined", name: "전체" },
  { id: "landmark", name: "랜드마크", icon: "/images/landmark.svg" },
  { id: "activity", name: "액티비티", icon: "/images/activity.svg" },
  { id: "cafe", name: "카페", icon: "/images/cafe.svg" },
  { id: "restaurant", name: "음식점", icon: "/images/restaurant.svg" },
];

const prices = [
  { value: undefined, label: "전체" },
  { value: 0, label: "무료" },
  { value: 10000, label: "~ 1만원" },
  { value: 30000, label: "~ 3만원" },
  { value: 50000, label: "~ 5만원" },
];

const SearchFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedPrice, setSelectedPrice] = useState(
    searchParams.get("price") || ""
  );

  const updateFilter = (category?: string, price?: string) => {
    const params = new URLSearchParams();
    if (category) {
      params.set("category", category);
      setSelectedCategory(category);
    }
    if (price) {
      params.set("price", price);
      setSelectedPrice(price);
    }
    router.push(`/spots?${params.toString()}`);
  };

  return (
    <div className={styles.filterContainer}>
      {/* 카테고리 필터 */}
      <div className={styles.categoryFilter}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={selectedCategory === category.id ? styles.selected : ""}
            onClick={() => updateFilter(category.id, selectedPrice)}
          >
            {category.icon !== undefined ? (
              <Image
                src={category.icon}
                alt={category.name}
                width={20}
                height={20}
                className={styles.icon}
              />
            ) : (
              ""
            )}
            <span className={styles.label}> {category.name}</span>
          </button>
        ))}
      </div>

      {/* 가격 필터 */}
      <div className={styles.priceFilter}>
        {prices.map((price, index) => (
          <button
            key={index}
            className={
              selectedPrice === String(price.value) ? styles.selected : ""
            }
            onClick={() => updateFilter(selectedCategory, String(price.value))}
          >
            {price.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
