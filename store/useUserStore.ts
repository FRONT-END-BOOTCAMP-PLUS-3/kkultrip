import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserStore = {
  img: string | null;
  nickname: string | null;
  isLoggedIn: boolean;
  userLat: number;
  userLon: number;
  id: string | null;
  setImg: (img: string) => void;
  setNickname: (nickname: string) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setUserLat: (lat: number) => void;
  setUserLon: (lon: number) => void;
  setId: (id: string) => void;
  clearInfo: () => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      img: null,
      nickname: null,
      isLoggedIn: false,
      userLat: 37.5665,
      userLon: 126.978,
      id: null,
      setImg: (img) => set({ img }),
      setNickname: (nickname) => set({ nickname }),
      setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
      setUserLat: (lat) => set({ userLat: lat }),
      setUserLon: (lon) => set({ userLon: lon }),
      setId: (id) => set({ id }),
      clearInfo: () =>
        set({ img: null, nickname: null, isLoggedIn: false, id: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserStore;
