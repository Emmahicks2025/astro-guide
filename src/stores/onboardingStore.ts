import { create } from 'zustand';

export interface PartnerDetails {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

export interface UserData {
  fullName: string;
  gender: 'male' | 'female' | 'other' | '';
  dateOfBirth: Date | null;
  timeOfBirth: string;
  placeOfBirth: string;
  purpose: string;
  role: 'user' | 'jotshi';
  // New professional fields
  birthTimeExactness: 'exact' | 'approximate' | 'unknown' | '';
  majorConcern: string;
  relationshipStatus: 'single' | 'dating' | 'engaged' | 'married' | 'separated' | '';
  partnerDetails: PartnerDetails | null;
}

interface OnboardingStore {
  currentStep: number;
  userData: UserData;
  isComplete: boolean;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateUserData: <K extends keyof UserData>(key: K, value: UserData[K]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentStep: 0,
  userData: {
    fullName: '',
    gender: '',
    dateOfBirth: null,
    timeOfBirth: '',
    placeOfBirth: '',
    purpose: '',
    role: 'user',
    birthTimeExactness: '',
    majorConcern: '',
    relationshipStatus: '',
    partnerDetails: null,
  },
  isComplete: false,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  updateUserData: (key, value) =>
    set((state) => ({
      userData: { ...state.userData, [key]: value },
    })),
  completeOnboarding: () => set({ isComplete: true }),
  resetOnboarding: () =>
    set({
      currentStep: 0,
      userData: {
        fullName: '',
        gender: '',
        dateOfBirth: null,
        timeOfBirth: '',
        placeOfBirth: '',
        purpose: '',
        role: 'user',
        birthTimeExactness: '',
        majorConcern: '',
        relationshipStatus: '',
        partnerDetails: null,
      },
      isComplete: false,
    }),
}));
