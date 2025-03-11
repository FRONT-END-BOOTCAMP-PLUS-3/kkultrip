"use client";

import { useState } from "react";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  onSearch: (query: string, category: string) => void;
  userOnly?: boolean; // 유저 이름으로만 검색 가능 여부
}

const SearchBar = ({ onSearch, userOnly = false }: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("user");

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
        value="user"
        onChange={(e) => setCategory(e.target.value)}
        className={styles.select}
        disabled={userOnly}
      >
        <option value="user">작성자 이름</option>
        <option value="spot">명소 이름</option>
      </select>
      <button onClick={handleSearch} className={styles.button}>
        검색
      </button>
    </div>
  );
};

export default SearchBar;
