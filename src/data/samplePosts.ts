export const samplePosts = [
  {
    id: 'post_001',
    title: 'Spam Post',
    content: 'Buy this amazing product!',
    author: { username: 'user123', id: 'user_001' },
    reportedReason: 'Spam',
    reportedAt: '2025-06-27T10:30:00Z',
    status: 'pending',
    reportCount: 3,
  },
  {
    id: 'post_002',
    title: 'Inappropriate Comment',
    content: 'This is offensive...',
    author: { username: 'user456', id: 'user_002' },
    reportedReason: 'Harassment',
    reportedAt: '2025-06-27T11:00:00Z',
    status: 'pending',
    reportCount: 2,
  },
];
