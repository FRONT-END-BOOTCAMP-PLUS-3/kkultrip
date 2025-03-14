# 꿀트립 (KKULTRIP)

## 프로젝트 소개
**"여행 명소 도슨트와 꿀팁을 제공하는 웹앱 서비스"**  
사용자의 위치를 기반으로 주변 명소를 추천하고, 명소에 대한 **정보, 스토리, 역사**를 제공하는 **도슨트 기능**과  
사용자들이 남긴 **꿀팁(명소 리뷰) 및 팁 공유 기능**을 제공하는 서비스입니다.

📍 [꿀트립 서비스 이동](https://kkultrip.newlecture.com)

---

## 개발 기간
- 2025년 02월 ~ 2025년 03월

---

## 👥 팀원
| 이름 | 역할 | Github |
|------|------|------------|
| 김재연 | 어드민페이지 |[GitHub](https://github.com/getsoss) |
| 김종윤 | 명소상세조회 |[GitHub]() |
| 박소정 | 로그인, 유저페이지 |[GitHub]() |
| 심동섭 | 명소 조회/검색, 꿀팁 등록/수정 |[GitHub](https://github.com/ShimDongseup) |


---

## ⚙ 기술 스택
### **Frontend**
- **React**, **Next.js**, **TypeScript**, **Zustand**
- **SCSS Module**

### **Backend**
- **Node.js (Next.js API Routes)**, **Prisma ORM**
- **PostgreSQL (데이터베이스)**

### **Deployment & DevOps**
- **Nginx** (프록시 서버, 정적 파일 서빙)
- **PM2** (애플리케이션 자동 실행 및 관리)
- **GitHub Actions** (CI/CD 자동 배포)
- **Certbot** (SSL 인증서 발급, HTTPS 보안)

---

## 주요 기능

1. 명소 조회, 검색필터, 지도표시
<img src="https://github.com/user-attachments/assets/2048171c-edb4-4af1-ba50-29cfabfdca63" width="300" alt="명소조회"/>

4. 명소 상세검색 (명소정보, 도슨트, 꿀팁, 사진)
5. 꿀팁 등록/수정
<img src="https://github.com/user-attachments/assets/797e324e-8853-4eb7-955d-0cb752fb5042" width="300" alt="명소조회"/>

7. 유저 조회 (다른유저가 올린 꿀팁조회, 마이페이지)
8. 어드민 페이지 (명소,꿀팁,유저 등록/조회/삭제)
<img width="1051" alt="관리자 명소조회" src="https://github.com/user-attachments/assets/cee0f41e-6c6e-4810-af7f-4562b576593a" />

<img width="1053" alt="관리자 꿀팁조회" src="https://github.com/user-attachments/assets/56a4b09b-8200-4e6f-b6d1-83df398af4f8" />

<img width="1048" alt="관리자 이미지관리" src="https://github.com/user-attachments/assets/fb85d166-0e60-4024-94e0-e95aad9c626a" />

![화면 기록 2025-03-14 오후 5 29 55](https://github.com/user-attachments/assets/411e3f37-46c5-481e-a830-a462c3f7656b)

---

## 🖥️ 프로젝트 실행 방법

### 1 **환경 변수 설정**
프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고, 다음 내용을 추가하세요.

```env
DATABASE_URL="postgresql://honeytrip:honeytrip123@rland.co.kr:5432/honeytripdb?schema=public"
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=네이버API아이디
NAVER_MAP_CLIENT_SECRET=네이버API키
NEXT_PUBLIC_SERVICE_URL=https://kkultrip.newlecture.com
JWT_SECRET_KEY=68dd241f460048656e0b8448bc7109b78b90a8feaefac542bdb640d1e2d7b62b
```

### 2 **의존성 설치**
```bash
npm install
```

### 3 **개발 서버 실행**
```bash
npm run dev
```

### 4 **빌드 후 실행**
```bash
npm run build
npm start
```

## 📌 성과 및 배운 점
* SSR 및 CSR을 적절히 활용하여 SEO 최적화
* 쿼리 기반 필터링 및 정렬 기능으로 사용자 경험(UX) 개선
* 클린 아키텍처 적용하여 유지보수성과 확장성 향상
* CI/CD 구축을 통한 배포 자동화로 운영 효율성 향상  
