"use client";

import SideBar from "../components/sideBar/SideBar";
import Header from "../components/header/Header";
import styles from "./AdminImagesPage.module.scss";
import { useEffect, useState } from "react";
import ImageContainer from "../components/imageContainer/ImageContainer";
import { Image } from "@prisma/client";
import SearchBar from "../components/searchBar/SearchBar";

const AdminImagesPage = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/admin/images");
        if (!res.ok) {
          throw new Error("Failed to fetch images");
        }
        const data: Image[] = await res.json();
        setImages(data);
        setFilteredImages(data); // 초기 로드 시 모든 이미지를 표시
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages();
  }, []);

  const handleSearch = async (query: string, category: string) => {
    try {
      let url = "";

      if (category === "spot") {
        url = `/api/admin/images/spot/search?spotName=${encodeURIComponent(
          query
        )}`;
      } else if (category === "user") {
        url = `/api/admin/images/user/search?userName=${encodeURIComponent(
          query
        )}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await res.json();
      setFilteredImages(data.images);
    } catch (error) {
      alert("검색 결과가 없습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <SideBar />
      <main className={styles.main}>
        <Header title="꿀팁 사진 관리" />
        <SearchBar onSearch={handleSearch} />
        <ImageContainer images={filteredImages} />
      </main>
    </div>
  );
};

export default AdminImagesPage;
