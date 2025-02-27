"use client";

import { useEffect, useRef, useState } from "react";
import { GetSpotsDTO } from "@/application/usecases/spot/dto/GetSpotsDto";
import { useRouter } from "next/navigation";

const NaverMap = ({
  lat,
  lon,
  spots,
}: {
  lat: number;
  lon: number;
  spots: GetSpotsDTO[];
}) => {
  const router = useRouter();

  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const myLocationMarkerRef = useRef<naver.maps.Marker | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 네이버 지도 API 로드
  useEffect(() => {
    if (!window.naver) {
      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
      script.async = true;
      script.onload = () => setIsMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsMapLoaded(true);
    }
  }, []);

  // 지도 초기화 (검색 시 이동)
  useEffect(() => {
    if (!isMapLoaded || !window.naver) return;

    if (!mapRef.current) {
      mapRef.current = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(lat, lon),
        zoom: 15,
      });
    } else {
      mapRef.current.setCenter(new window.naver.maps.LatLng(lat, lon));
      mapRef.current.setZoom(17);
    }
  }, [isMapLoaded, lat, lon]);

  const categoryMap: { [key: string]: string } = {
    액티비티: "activity",
    랜드마크: "landmark",
    카페: "cafe",
    레스토랑: "restaurant",
  };

  const getCategoryName = (category: string) => {
    return categoryMap[category] || category;
  };

  // 명소 마커 추가
  useEffect(() => {
    if (!mapRef.current) return;

    // 기존 명소 마커 삭제
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 새로운 명소 마커 추가
    spots.forEach((spot) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(spot.lat, spot.lon),
        map: mapRef.current!,
        icon: {
          url: `/images/flower-${getCategoryName(spot.category)}.svg`,
          size: new window.naver.maps.Size(50, 50),
        },
      });

      window.naver.maps.Event.addListener(marker, "click", () => {
        router.push(`/spots/${spot.id}/info`);
      });

      // 마커 아래 명소 이름 표시
      const label = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(spot.lat, spot.lon),
        map: mapRef.current!,
        icon: {
          content: `
          <div style="
          background: white;
          border-radius: 5px;
          padding: 5px 10px;
          font-size: 13px;
          font-weight: bold;
          text-align: center;
          white-space: nowrap;
          box-shadow: 0px 0px 3px rgba(0,0,0,0.2);
        ">
            ${spot.name}
          </div>`,
          anchor: new window.naver.maps.Point(35, 0), // 마커 아래 위치 조정
        },
      });
      markersRef.current.push(marker);
      markersRef.current.push(label);
    });
  }, [spots]);

  // 내 위치 마커 추가 (내 위치가 있을 때만)
  useEffect(() => {
    if (!mapRef.current) return;

    // 기존 내 위치 마커 삭제
    if (myLocationMarkerRef.current) {
      myLocationMarkerRef.current.setMap(null);
    }

    // 내 위치 마커 추가 (사용자의 현재 위치 기준)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          myLocationMarkerRef.current = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(userLat, userLon),
            map: mapRef.current!,
            icon: {
              url: "/images/bee_50x58.png", // 내 위치 아이콘
              size: new window.naver.maps.Size(50, 58),
            },
          });

          // 지도 중심을 내 위치로 이동
          mapRef.current?.setCenter(
            new window.naver.maps.LatLng(userLat, userLon)
          );
        },
        (error) => {
          console.log("❌ 내 위치를 가져올 수 없습니다:", error);
        }
      );
    }
  }, [isMapLoaded]);

  return <div id="map" style={{ height: "90vh", width: "100%" }} />;
};

export default NaverMap;
