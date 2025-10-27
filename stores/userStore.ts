import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface UserState {
  user: User | null;
  nickname: string | null;
  bio: string | null;
  avatar_url: string | null;
  setUser: (user: User | null) => void;
  setNickname: (nickname: string | null) => void;
  setBio: (bio: string | null) => void;
  setAvatarUrl: (avatar_url: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  nickname: null,
  bio: null,
  avatar_url: null,
  setUser: (user) => set({ user }),
  setNickname: (nickname) => set({ nickname }),
  setBio: (bio) => set({ bio }),
  setAvatarUrl: (avatar_url) => set({ avatar_url }),
  clearUser: () => set({ user: null, nickname: null, bio: null, avatar_url: null }),
}));