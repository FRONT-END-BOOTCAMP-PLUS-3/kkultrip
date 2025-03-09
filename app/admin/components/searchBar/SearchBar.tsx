"use client";

import { useState } from "react";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  onSearch: (query: string, category: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("user");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, category); // 검색어와 선택된 카테고리 전달
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
