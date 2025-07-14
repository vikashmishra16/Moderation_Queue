// src/types/index.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  reportedReason: string;
  reportedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reportCount: number;
  author: {
    username: string;
    id: string;
  };
}
