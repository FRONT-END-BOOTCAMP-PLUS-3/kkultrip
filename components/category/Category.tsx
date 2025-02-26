import { useState } from "react";
import Image from "next/image";
import styles from "./Category.module.scss";

const categories = [
  { id: "all", label: "전체" },
  { id: "activity", label: "액티비티", icon: "/images/activity.svg" },
  { id: "landmark", label: "랜드마크", icon: "/images/landmark.svg" },
  { id: "cafe", label: "카페", icon: "/images/cafe.svg" },
  { id: "restaurant", label: "음식점", icon: "/images/restaurant.svg" },
];

const Category = () => {
  const [selected, setSelected] = useState<string>("all");

  return (
    <div className={styles.container}>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`${styles.category} ${
            selected === category.id ? styles.selected : ""
          }`}
          onClick={() => setSelected(category.id)}
        >
          {category.icon && (
            <Image
              src={category.icon}
              alt={category.label}
              width={16}
              height={16}
              className={styles.icon}
            />
          )}
          <span className={styles.label}>{category.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Category;
