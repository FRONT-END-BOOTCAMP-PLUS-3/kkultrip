import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  img: string | null;
  nickname: string | null;
  isLoggedIn: boolean;
  setImg: (img: string) => void;
  setNickname: (nickname: string) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      img: null,
      nickname: null,
      isLoggedIn: false,
      setImg: (img) => set({ img: img }),
      setNickname: (nickname) => set({ nickname: nickname }),
      setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
      clearInfo: () => set({ img: null, nickname: null, isLoggedIn: false }),
    }),
    {
      name: "user-store", // unique name
    }
  )
);

export default useUserStore;
