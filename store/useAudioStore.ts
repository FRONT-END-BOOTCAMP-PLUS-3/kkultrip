import { create } from "zustand";

type AudioStore = {
    currentAudioId: number | null;
    setCurrentAudioId: (id: number | null) => void;
};

export const useAudioStore = create<AudioStore>((set) => ({
    currentAudioId: null,
    setCurrentAudioId: (id) => set({ currentAudioId: id }),
}));
