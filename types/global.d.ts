declare global {
  interface Window {
    naver: typeof naver;
  }

  namespace naver {
    namespace maps {
      class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
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
        setZoom(zoom: number): void;
        getCenter(): LatLng;
      }

      class Marker {
        constructor(options: {
          position: LatLng;
          map: Map;
          title?: string;
          icon?: {
            url?: string;
            size?: Size;
            content?: string;
            anchor?: Point;
          };
        });

        setMap(map: Map | null): void;
      }

      class Size {
        constructor(width: number, height: number);
      }

      class Point {
        constructor(x: number, y: number);
      }
      class Event {
        static addListener(
          instance: Marker | Map,
          eventName: string,
          listener: (event) => void
        ): void;
      }
    }
  }
}

export {};
