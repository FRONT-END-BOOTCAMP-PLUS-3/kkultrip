"use client";

import { useState } from "react";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  onSearch: (query: string, category: string) => void;
  isSpotOnly?: boolean;
}

const SearchBar = ({ onSearch, isSpotOnly = false }: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>(
    isSpotOnly ? "spot" : "user"
  );

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, category);
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요..."
        className={styles.input}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={styles.select}
        disabled={isSpotOnly} // 2 페이지에서는 선택할 수 없게 비활성화
      >
        <option value="user">유저 이름</option>
        <option value="spot">명소 이름</option>
      </select>
      <button onClick={handleSearch} className={styles.button}>
        검색
      </button>
    </div>
  );
};

export default SearchBar;
