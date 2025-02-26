declare global {
  interface Window {
    naver: typeof naver;
  }

  namespace naver {
    namespace maps {
      class LatLng {
        constructor(lat: number, lng: number);
      }

      class Map {
        constructor(
          element: string | HTMLElement,
          options: {
            center: LatLng;
            zoom: number;
          }
        );

        setCenter(center: LatLng): void;
      }

      class Marker {
        constructor(options: {
          position: LatLng;
          map: Map;
          icon?: {
            url: string;
            size: Size;
          };
        });
      }

      class Size {
        constructor(width: number, height: number);
      }
    }
  }
}

export {};
