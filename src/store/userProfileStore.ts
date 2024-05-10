import { create } from "zustand";

interface UserProfileStore {
  userProfile: any; // Update this to the appropriate type of userProfile
  setUserProfile: (userProfile: any) => void; // Update this to match your setUserProfile function
}

const useUserProfileStore = create<UserProfileStore>((set) => ({
  userProfile: null,
  setUserProfile: (userProfile) => set({ userProfile }),
  addPost: (post: any) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        posts: [post.id, ...state.userProfile.posts],
      },
    })),
  deletePost: (postId: string) =>
    set((state: any) => ({
      userProfile: {
        ...state.userProfile,
        posts: state.userProfile.posts.filter((id: any) => id !== postId),
      },
    })),
}));

export default useUserProfileStore;
