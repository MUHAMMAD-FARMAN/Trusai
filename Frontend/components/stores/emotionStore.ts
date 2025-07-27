import { create } from "zustand"

interface EmotionState {
    facialEmotions: Record<string, number>
    speechEmotions: Record<string, number>
    facialEmotionHistory: Record<string, number>[]
    speechEmotionHistory: Record<string, number>[]
    setFacialEmotions: (emotions: Record<string, number>) => void
    setSpeechEmotions: (emotions: Record<string, number>) => void
}

export const useEmotionStore = create<EmotionState>((set) => ({
    facialEmotions: {},
    speechEmotions: {},
    facialEmotionHistory: [],
    speechEmotionHistory: [],
    setFacialEmotions: (emotions) =>
        set((state) => ({
            facialEmotions: emotions,
            facialEmotionHistory: [...state.facialEmotionHistory, emotions],
        })),
    setSpeechEmotions: (emotions) =>
        set((state) => ({
            speechEmotions: emotions,
            speechEmotionHistory: [...state.speechEmotionHistory, emotions],
        })),
}))

