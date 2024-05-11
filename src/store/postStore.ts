import { create } from "zustand";

interface Post {
  id: string;
  caption: string;
  imageURL: string;
  likes: string[];
  comments: string[];
  createdAt: Date;
  createdBy: string;
}

const usePostStore = create((set) => ({
  posts: [],
  setPost: (post: Post) => set({ post }),
  createPost: (post: Post) =>
    set((state: any) => ({ posts: [post, ...state.posts] })),
  deletePost: (id: string) =>
    set((state: any) => ({
      posts: state.posts.filter((post: any) => post.id !== id),
    })),
  setPosts: (posts: Post) => set({ posts }),
  addComment: (postId: string, comment: string) =>
    set((state: any) => ({
      posts: state.posts.map((post: any) => {
        if (post.id === postId) {
          return { ...post, comments: [...post.comments, comment] };
        }
        return post;
      }),
    })),
}));

export default usePostStore;
