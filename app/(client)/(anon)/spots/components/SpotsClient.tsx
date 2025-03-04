// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { GetSpotsDTO } from "@/application/usecases/spot/dto/GetSpotsDto";
// import SearchFilter from "./SearchFilter";
// import NaverMap from "./NaverMap";
// import BottomSheet from "./BottomSheet";

// const SpotsClient = ({
//   initialLat,
//   initialLon,
//   initialSpots,
// }: {
//   initialLat: number;
//   initialLon: number;
//   initialSpots: GetSpotsDTO[];
// }) => {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [lat, setLat] = useState(initialLat);
//   const [lon, setLon] = useState(initialLon);
//   const [userLat, setUserLat] = useState(37.5665);
//   const [userLon, setUserLon] = useState(126.978);
//   const [spots, setSpots] = useState<GetSpotsDTO[]>(initialSpots || []);
//   const [isLocationUpdated, setIsLocationUpdated] = useState(false);
//   const [tempQuery, setTempQuery] = useState(searchParams.get("query") || "");

//   // URL에 있는 lat, lon을 기반으로 지도 이동 & 데이터 요청
//   useEffect(() => {
//     const params = new URLSearchParams(searchParams.toString());
//     const queryLat = params.get("lat");
//     const queryLon = params.get("lon");

//     if (queryLat && queryLon) {
//       const newLat = parseFloat(queryLat);
//       const newLon = parseFloat(queryLon);

//       setLat(newLat);
//       setLon(newLon);

//       fetch(`/api/spots?${params.toString()}`)
//         .then((res) => res.json())
//         .then((data) => {
//           setSpots(Array.isArray(data.spots) ? data.spots : []);
//         })
//         .catch((error) => {
//           console.log("명소 데이터를 불러올 수 없음:", error);
//           setSpots([]);
//         });
//     }
//   }, [searchParams]);

//   // 내 위치 감지 (최초 1회)
//   useEffect(() => {
//     if (!isLocationUpdated && navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const userLat = position.coords.latitude;
//           const userLon = position.coords.longitude;

//           setLat(userLat);
//           setLon(userLon);
//           setUserLat(userLat);
//           setUserLon(userLon);
//           setIsLocationUpdated(true);

//           const params = new URLSearchParams(searchParams.toString());
//           params.set("lat", userLat.toString());
//           params.set("lon", userLon.toString());

//           router.replace(`/spots?${params.toString()}`);
//         },
//         (error) => {
//           console.log("위치 정보를 가져올 수 없습니다:", error);
//           setIsLocationUpdated(true);
//         }
//       );
//     }
//   }, [isLocationUpdated, searchParams, router]);

//   // 필터 업데이트 함수 (카테고리, 가격 변경 시 바로 반영)
//   const updateFilters = ({
//     query,
//     category,
//     price,
//   }: {
//     query?: string;
//     category?: string;
//     price?: string;
//   }) => {
//     const params = new URLSearchParams(searchParams.toString());

//     // query가 없거나 빈 문자열이면 삭제 (API 요청에서 제외)
//     if (!query || query.trim() === "" || query === "default") {
//       params.delete("query");
//     } else {
//       params.set("query", query);
//     }

//     if (category !== undefined) params.set("category", category);
//     if (price !== undefined) params.set("price", price);

//     // 검색어가 있는 경우 위치 검색 API 호출
//     if (query && query.trim() !== "" && query !== "default") {
//       fetch(`/api/spots?query=${query}`)
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.lat && data.lon) {
//             params.set("lat", data.lat.toString());
//             params.set("lon", data.lon.toString());

//             // 특정 명소 검색 시, 해당 명소만 표시 (주변 명소 X)
//             if (data.spots.length === 1) {
//               setSpots(data.spots);
//             } else {
//               setSpots(Array.isArray(data.spots) ? data.spots : []);
//             }

//             setLat(data.lat);
//             setLon(data.lon);
//           }

//           router.push(`/spots?${params.toString()}`);
//         })
//         .catch((error) => {
//           console.log(" 위치 검색 실패:", error);
//           router.push(`/spots?${params.toString()}`);
//         });
//     } else {
//       // 검색어 없이 필터만 변경하는 경우
//       router.push(`/spots?${params.toString()}`);
//     }
//   };

//   return (
//     <div>
//       <SearchFilter
//         updateFilters={updateFilters}
//         tempQuery={tempQuery}
//         setTempQuery={setTempQuery}
//         initialCategory={searchParams.get("category") || ""}
//         initialPrice={searchParams.get("price") || ""}
//       />
//       <NaverMap lat={lat} lon={lon} spots={spots} />
//       <BottomSheet spots={spots} userLat={userLat} userLon={userLon} />
//     </div>
//   );
// };

// export default SpotsClient;
