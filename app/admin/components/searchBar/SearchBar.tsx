"use client";

import { useState } from "react";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  onSearch: (query: string, category: string) => void;
  options?: string[];
}

const SearchBar = ({
  onSearch,
  options = ["user", "spot", "address"],
}: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>(options[0]);

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
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "user"
              ? "유저 이름"
              : option === "spot"
              ? "명소 이름"
              : "주소명"}
          </option>
        ))}
      </select>
      <button onClick={handleSearch} className={styles.button}>
        검색
      </button>
    </div>
  );
};

export default SearchBar;
