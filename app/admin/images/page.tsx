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

  const handleSearch = (query: string, category: string) => {
    const filtered = images.filter((image) => {
      if (category === "user") {
        return image.userName.toLowerCase().includes(query.toLowerCase());
      } else if (category === "spot") {
        return image.spotName.toLowerCase().includes(query.toLowerCase());
      }
      return true;
    });
    setFilteredImages(filtered);
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
