"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    naver: typeof naver;
  }
}

interface Spot {
  id: number;
  name: string;
  category: string;
  avgPrice?: number;
  lat: number;
  lng: number;
  bookmark?: number;
  phone?: number;
  time?: string;
  img: string;
}

const NaverMap = ({ spots }: { spots: Spot[] }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  useEffect(() => {
    if (!apiKey) {
      console.error("네이버 지도 API Client ID가 설정되지 않았습니다.");
      return;
    }

    if (document.getElementById("naver-map-script")) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "naver-map-script";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${apiKey}`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !window.naver) return;

    const mapInstance = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(37.5665, 126.978),
      zoom: 15,
    });

    setMap(mapInstance);
  }, [mapLoaded]);

  useEffect(() => {
    if (!map) return;

    // ✅ 내 위치 가져오기 (비동기)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = new window.naver.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        // ✅ 내 위치 마커 추가 (bee 아이콘)
        new window.naver.maps.Marker({
          position: userLocation,
          map: map,
          icon: {
            url: "/images/bee_50x58.png",
            size: new window.naver.maps.Size(50, 58),
          },
        });

        // 지도 중심을 내 위치로 이동
        map.setCenter(userLocation);
      },
      (error) => {
        console.error("위치 정보를 가져올 수 없습니다:", error);
      }
    );

    // ✅ 명소 마커 추가
    spots.forEach((spot) => {
      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(spot.lat, spot.lng),
        map: map,
        icon: {
          url: `/images/flower-${spot.category}.svg`,
          size: new window.naver.maps.Size(50, 50),
        },
      });
    });
  }, [map, spots]);

  return <div id="map" style={{ height: "90vh", width: "100%" }} />;
};

export default NaverMap;
