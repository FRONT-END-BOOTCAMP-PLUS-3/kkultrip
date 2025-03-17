"use client";

import styles from "./SearchFilter.module.scss";
import { useSearchParams, useRouter } from "next/navigation";
import { IoSearch, IoClose } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getGeocode } from "@/utils/getGeocode";
import { getMyLocation } from "@/utils/getMyLocation";
import useUserStore from "@/store/useUserStore";
import Loading from "@/components/loading/Loading";

const SearchFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query") || "";
  const selectedCategory = searchParams.get("category") || "";
  const selectedPrice = searchParams.get("price") || "";
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isRecentVisible, setIsRecentVisible] = useState(false);
  const [tempQuery, setTempQuery] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserLat, setUserLon } = useUserStore();
  const userLat = useUserStore((state) => state.userLat);
  const userLon = useUserStore((state) => state.userLon);

  const inputRef = useRef<HTMLInputElement>(null); // 검색 input 요소 참조 추가

  // 로컬 스토리지에서 최근 검색어 불러오기
  useEffect(() => {
    const storedSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );
    setRecentSearches(storedSearches);
  }, []);

  // 최근 검색어 저장 (중복 제거 & 최대 5개 유지)
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;

    let updatedSearches = [query, ...recentSearches.filter((q) => q !== query)];
    updatedSearches = updatedSearches.slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  // 검색어 및 필터 업데이트
  const updateFilters = async (updates: {
    query?: string;
    category?: string;
    price?: string;
    lat?: number;
    lon?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.query !== undefined) {
      if (!updates.query.trim()) {
        params.delete("query");
      } else {
        params.set("query", updates.query);

        // 1. DB에서 검색한 명소의 위치 가져오기
        try {
          const res = await fetch(`/api/spots?query=${updates.query}`);
          const data = await res.json();

          if (data.spots.length === 1) {
            const spot = data.spots[0];
            params.set("lat", spot.lat.toString());
            params.set("lon", spot.lon.toString());
            setUserLat(spot.lat);
            setUserLon(spot.lon);
          } else {
            // 2. DB에 없을 경우, 일반 주소 geocode 검색
            const geocode = await getGeocode(updates.query);
            if (geocode) {
              params.set("lat", geocode.lat.toString());
              params.set("lon", geocode.lon.toString());
              setUserLat(geocode.lat);
              setUserLon(geocode.lon);
            }
          }
        } catch (error) {
          console.log("❌ 위치 검색 실패:", error);
        }
      }
    }

    if (updates.category !== undefined) {
      if (updates.category === "") {
        params.delete("category");
      } else {
        params.set("category", updates.category);
      }
    }

    if (updates.price !== undefined) {
      if (updates.price === "") {
        params.delete("price");
      } else {
        params.set("price", updates.price);
      }
    }

    // 검색어(쿼리) 입력 시, 위도/경도 가져오기 & 지도 이동
    if (updates.query && updates.query.trim() !== "default") {
      const geocode = await getGeocode(updates.query);
      if (geocode) {
        params.set("lat", geocode.lat.toString());
        params.set("lon", geocode.lon.toString());
      }
    }

    // 내 위치 업데이트 시, `lat, lon` 추가
    if (updates.lat !== undefined && updates.lon !== undefined) {
      params.set("lat", updates.lat.toString());
      params.set("lon", updates.lon.toString());
    }

    router.push(`/spots?${params.toString()}`);
  };

  // 검색 실행
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    saveRecentSearch(tempQuery);
    updateFilters({ query: tempQuery });

    if (inputRef.current) {
      inputRef.current.blur(); // 검색 후 input 포커스 해제
    }
  };

  // 최근 검색어 클릭 시 검색어 적용
  const handleRecentSearchClick = (query: string) => {
    setTempQuery(query);
    updateFilters({ query });
    setIsRecentVisible(false);
  };

  // 개별 최근 검색어 삭제
  const removeRecentSearch = (query: string) => {
    const updatedSearches = recentSearches.filter((q) => q !== query);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  // 모든 최근 검색어 삭제
  const removeAllRecentSearch = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // 내 위치 업데이트 기능 (위도/경도 가져오기)
  const handleUpdateLocation = async () => {
    try {
      setIsLoading(true);
      const location = await getMyLocation();
      if (location) {
        setIsLoading(false);
        setUserLat(location.lat);
        setUserLon(location.lon);
        updateFilters({ lat: location.lat, lon: location.lon, query: "" });
        setTempQuery("");
      } else {
        alert("현재 위치를 가져올 수 없습니다. 기본 위치로 이동합니다.");
        updateFilters({ lat: userLat, lon: userLon, query: "" });
      }
    } catch (error) {
      setIsLoading(false);
      console.log("위치 정보를 가져올 수 없음:", error);
      alert(
        "현재 위치를 가져올 수 없습니다. 기본 위치(서울시청)로 이동합니다."
      );
      updateFilters({ lat: userLat, lon: userLon, query: "" });
    }
  };

  return (
    <div className={styles.filterContainer}>
      {/* 검색창 */}
      <form onSubmit={handleSearch} className={styles.searchBox}>
        <input
          ref={inputRef}
          type="text"
          placeholder="명소, 주소 검색"
          value={tempQuery}
          onChange={(e) => setTempQuery(e.target.value)}
          onFocus={() => setIsRecentVisible(true)} // 포커스 시 최근 검색어 표시
          onBlur={() => setTimeout(() => setIsRecentVisible(false), 200)} // 포커스 해제 시 숨김
        />
        <button type="submit">
          <IoSearch />
        </button>
      </form>

      {/* 최근 검색어 리스트 */}
      {isRecentVisible && (
        <div className={styles.recentSearchContainer}>
          {recentSearches.length > 0 && (
            <div className={styles.top}>
              <span>최근 검색어</span>
              <button onClick={removeAllRecentSearch}>모두삭제</button>
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
            onClick={() => updateFilters({ category: category.value })}
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

      {/* 가격 필터 */}
      <div className={styles.priceFilter}>
        {prices.map((price) => (
          <button
            key={price.value}
            className={selectedPrice === price.value ? styles.selected : ""}
            onClick={() => updateFilters({ price: price.value })}
          >
            <span className={styles.label}>{price.label}</span>
          </button>
        ))}
      </div>

      {/* 현재 위치 업데이트 버튼 */}
      <button
        type="button"
        className={styles.updateLocationBtn}
        onClick={handleUpdateLocation}
      >
        {isLoading ? (
          <Loading size={20} color="#3196f3" />
        ) : (
          <TbCurrentLocation className={styles.icon} />
        )}
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
