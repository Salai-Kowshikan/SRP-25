import { create } from 'zustand';
import api from "@/api/api";

interface AccountDetails {
  account_holder_name: string;
  account_number: string;
  account_type: string;
  balance: number;
  bank_name: string;
  branch_name: string;
  ifsc_code: string;
}

interface Profile {
  shg_id: string;
  shg_name: string;
  rating: number;
  balance: number;
  account_details: AccountDetails;
}

interface Member {
  member_id: string;
  member_name: string;
  non_smartphone_user: boolean;
}

interface ProfileState {
  profile: Profile | null;
  members: Member[];
  updateProfile: (profile: Profile) => void;
  resetProfile: () => void;
  fetchProfile: (shgId: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  profile: null,
  members: [],
  updateProfile: (profile) => set(() => ({ profile })),
  resetProfile: () => set(() => ({ profile: null, members: [] })),
  fetchProfile: async (shgId) => {
    try {
      const response = await api.get(`/api/profile/${shgId}`);
      const { data, members } = response.data;
      set(() => ({ profile: data, members }));
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  },
}));
