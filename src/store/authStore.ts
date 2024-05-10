import { create, SetState } from "zustand";

interface User {
  uid: string;
  fullName: string;
  username: string;
  email: string;
  bio: string;
  profilePicURL: string;
  followers: string[];
  following: string[];
  posts: string[];
  createdAt: Date;
}

interface AuthStore {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const useAuthStore = create<AuthStore>((set: SetState<AuthStore>) => {
  const storedUser = localStorage.getItem("user_info");
  // Parse storedUser only if it's not null
  const initialUser = storedUser ? (JSON.parse(storedUser) as User) : null;

  return {
    user: initialUser,
    login: (user) => set({ user }),
    logout: () => set({ user: null }),
    setUser: (user) => set({ user }),
  };
});

export default useAuthStore;
