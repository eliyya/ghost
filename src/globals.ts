import { create } from 'zustand'

type useLabsAccordeonStore = {
    active: number
    setActive: (tab: number) => void
  }
export const useLabsAccordeon = create<useLabsAccordeonStore>((set) => ({
    active: 1,
    setActive: (tab) => set({ active: tab }),
  }))