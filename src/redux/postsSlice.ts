import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { samplePosts } from '@/data/samplePosts';

type Post = typeof samplePosts[0];

interface PostsState {
  posts: Post[];
}

const initialState: PostsState = {
  posts: samplePosts,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    approvePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) post.status = 'approved';
    },
    rejectPost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) post.status = 'rejected';
    },
    approveMultiplePosts: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(id => {
        const post = state.posts.find(p => p.id === id);
        if (post && post.status === 'pending') post.status = 'approved';
      });
    },
    rejectMultiplePosts: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(id => {
        const post = state.posts.find(p => p.id === id);
        if (post && post.status === 'pending') post.status = 'rejected';
      });
    },
  },
});

// ✅ Export actions
export const {
  approvePost,
  rejectPost,
  approveMultiplePosts,
  rejectMultiplePosts,
} = postsSlice.actions;

// ✅ Export reducer
export default postsSlice.reducer;

