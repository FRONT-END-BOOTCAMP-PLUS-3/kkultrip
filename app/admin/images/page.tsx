"use client";

import SideBar from "../components/sideBar/SideBar";
import Header from "../components/header/Header";
import styles from "./AdminImagesPage.module.scss";
import { useEffect, useState } from "react";
import ImageContainer from "../components/imageContainer/ImageContainer";
import { Image } from "@prisma/client";

const AdminImagesPage = () => {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/admin/images");
        if (!res.ok) {
          throw new Error("Failed to fetch images");
        }
        const data: Image[] = await res.json();
        setImages(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className={styles.container}>
      <SideBar />
      <main className={styles.main}>
        <Header title="꿀팁 사진 관리" />
        <ImageContainer images={images} />
      </main>
    </div>
  );
};

export default AdminImagesPage;
