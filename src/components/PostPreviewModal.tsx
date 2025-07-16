"use client";
import { Post } from "@/types";
import { Dialog } from "@headlessui/react";
import Image from "next/image";

interface Props {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostPreviewModal({ post, isOpen, onClose }: Props) {
  if (!post) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" />

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center px-4 py-6">
        <Dialog.Panel className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl border border-gray-200">
          {/* Title */}
          <Dialog.Title className="text-2xl font-bold text-indigo-800 mb-2">
            {post.title}
          </Dialog.Title>

          {/* Author and Timestamp */}
          <div className="text-sm text-gray-500 mb-4 flex justify-between items-center">
            <span>
              By <span className="font-semibold text-indigo-600">{post.author.username}</span>
            </span>
            <span className="italic">
              {new Date(post.reportedAt).toLocaleString()}
            </span>
          </div>

          {/* Image Section */}
          {post.imageUrl && (
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg mb-5 border border-gray-200">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 ease-in-out hover:scale-105 rounded-lg"
              />
            </div>
          )}

          {/* Content */}
          <p className="text-gray-800 text-sm leading-relaxed mb-4">{post.content}</p>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t pt-3">
            <div>
              <span className="font-medium text-gray-700">Reported Reason</span>
              <p className="mt-1 bg-red-50 text-red-700 px-3 py-1.5 rounded-md border border-red-200">
                {post.reportedReason}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Post Status</span>
              <p
                className={`mt-1 px-3 py-1.5 rounded-md border font-medium ${
                  post.status === "pending"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                    : post.status === "approved"
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-red-100 text-red-700 border-red-300"
                }`}
              >
                {post.status.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 text-right">
            <button
              onClick={onClose}
              className="inline-block px-5 py-2 text-sm font-medium rounded-lg bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
