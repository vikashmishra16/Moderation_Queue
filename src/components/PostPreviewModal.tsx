'use client';
import { Post } from '@/types';
import { Dialog } from '@headlessui/react';

interface Props {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostPreviewModal({ post, isOpen, onClose }: Props) {
  if (!post) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl">
          <Dialog.Title className="text-xl font-bold mb-2">{post.title}</Dialog.Title>
          <p className="text-sm text-gray-500 mb-4">By {post.author.username}</p>
          <p className="mb-4">{post.content}</p>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post visual"
              className="w-full h-auto rounded mb-4"
            />
          )}

          <p className="text-sm text-gray-400">Reported Reason: {post.reportedReason}</p>
          <p className="text-sm text-gray-400">Status: {post.status}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
