"use client";

import styles from "./SearchFilter.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearch, IoClose } from "react-icons/io5";
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
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isRecentVisible, setIsRecentVisible] = useState(false); // 🔹 최근 검색어 표시 여부

  // 로컬 스토리지에서 최근 검색어 불러오기
  useEffect(() => {
    const storedSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );
    setRecentSearches(storedSearches);
  }, []);

  // 최근 검색어 저장 함수
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return; // 빈 값 저장 방지

    let updatedSearches = [query, ...recentSearches.filter((q) => q !== query)];
    updatedSearches = updatedSearches.slice(0, 5); // 최대 5개 유지

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    saveRecentSearch(tempQuery);
    updateFilters({
      query: tempQuery,
      category: selectedCategory,
      price: selectedPrice,
    });
    setIsRecentVisible(false);
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

  // 최근 검색어 클릭 시 검색어 입력
  const handleRecentSearchClick = (query: string) => {
    setTempQuery(query);
    updateFilters({ query, category: selectedCategory, price: selectedPrice });
    setIsRecentVisible(false);
  };

  // 최근 검색어 개별 삭제
  const removeRecentSearch = (query: string) => {
    const updatedSearches = recentSearches.filter((q) => q !== query);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };
  // 최근 검색어 전체 삭제
  const removeAllRecentSearch = () => {
    setRecentSearches([]);
    localStorage.setItem("recentSearches", "");
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
          onFocus={() => setIsRecentVisible(true)} // 포커스 시 최근 검색어 표시
          onBlur={() => setTimeout(() => setIsRecentVisible(false), 200)} // 포커스 해제 시 숨김
        />
        <button type="submit">
          <IoSearch />
        </button>
      </form>

      {/*  최근 검색어 리스트 */}
      {isRecentVisible && (
        <div className={styles.recentSearchContainer}>
          {recentSearches.length > 0 && (
            <div className={styles.top}>
              <span>최근 검색어</span>
              <button onClick={() => removeAllRecentSearch()}>모두삭제</button>
            </div>
          )}
          {recentSearches.length > 0 ? (
            recentSearches.map((search, index) => (
              <div key={index} className={styles.recentSearchItem}>
                <span onClick={() => handleRecentSearchClick(search)}>
                  {search}
                </span>
                <button onClick={() => removeRecentSearch(search)}>
                  <IoClose />
                </button>
              </div>
            ))
          ) : (
            <p className={styles.noRecentSearch}>최근 검색어가 없습니다.</p>
          )}
        </div>
      )}

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
