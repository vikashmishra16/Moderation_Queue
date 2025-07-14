"use client";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  approvePost,
  rejectPost,
  approveMultiplePosts,
  rejectMultiplePosts,
} from "@/redux/postsSlice";
import { useEffect, useState } from "react";
import PostPreviewModal from "@/components/PostPreviewModal";
import { Post } from "@/types";
import ConfirmDialog from "@/components/ConfirmDialog";
import UndoToast from "@/components/UndoToast";

export default function ModerationPage() {
  const posts = useAppSelector((state) => state.posts.posts);
  const dispatch = useAppDispatch();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalPost, setModalPost] = useState<Post | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [confirmRejectId, setConfirmRejectId] = useState<string | null>(null);
  const [toastData, setToastData] = useState<{
    message: string;
    undo: () => void;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 1;
  const filteredPosts = posts.filter((post) => post.status === statusFilter);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const allPending = posts
      .filter((p) => p.status === "pending")
      .map((p) => p.id);
    setSelectedIds(allPending);
  };

  const clearSelection = () => setSelectedIds([]);

  const handleBatchApprove = () => {
    dispatch(approveMultiplePosts(selectedIds));
    clearSelection();
  };

  const handleBatchReject = () => {
    const confirmReject = confirm(
      `Reject ${selectedIds.length} selected post(s)?`
    );
    if (confirmReject) {
      dispatch(rejectMultiplePosts(selectedIds));
      clearSelection();
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const focused = posts.find((p) => p.status === statusFilter); // Simplified — you can track actual selection
      if (!focused) return;

      if (e.key === "a") {
        dispatch(approvePost(focused.id));
        setToastData({
          message: "Post approved via shortcut",
          undo: () => dispatch(rejectPost(focused.id)),
        });
      }
      if (e.key === "r") {
        setConfirmRejectId(focused.id);
      }
      if (e.key === "Escape") {
        setModalPost(null);
        setConfirmRejectId(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [posts, statusFilter]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Moderation Queue</h1>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">
          Selected: {selectedIds.length}
        </span>
        <div className="space-x-2">
          <button
            onClick={selectAll}
            className="bg-gray-100 px-3 py-1 rounded text-sm hover:bg-gray-200"
          >
            Select All
          </button>
          <button
            onClick={clearSelection}
            className="bg-gray-100 px-3 py-1 rounded text-sm hover:bg-gray-200"
          >
            Clear
          </button>
          <button
            onClick={handleBatchApprove}
            disabled={selectedIds.length === 0}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
          >
            Approve Selected
          </button>
          <button
            onClick={handleBatchReject}
            disabled={selectedIds.length === 0}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
          >
            Reject Selected
          </button>
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        {(["pending", "approved", "rejected"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-sm capitalize ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Post List */}
      {posts
        .filter((post) => post.status === statusFilter)
        .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
        .map((post) => (
          <div
            key={post.id}
            className={`p-4 rounded shadow mb-4 transition ${
              post.status === "pending" ? "bg-white" : "bg-gray-100"
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={selectedIds.includes(post.id)}
                disabled={post.status !== "pending"}
                onChange={() => toggleSelect(post.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2
                      className="text-lg font-semibold cursor-pointer underline"
                      onClick={() => setModalPost(post as Post)}
                    >
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      By {post.author.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      Reason: {post.reportedReason}
                    </p>
                    <p className="text-sm text-gray-400">
                      Status: {post.status}
                    </p>
                  </div>
                  <button
                    onClick={() => setModalPost(post as Post)}
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    View
                  </button>
                </div>

                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => {
                      dispatch(approvePost(post.id));
                      setToastData({
                        message: `Post approved`,
                        undo: () => dispatch(rejectPost(post.id)),
                      });
                    }}
                    disabled={post.status !== "pending"}
                    className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setConfirmRejectId(post.id)}
                    disabled={post.status !== "pending"}
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {posts.filter((post) => post.status === statusFilter).length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No posts in "{statusFilter}"
        </p>
      )}
      <ConfirmDialog
        isOpen={!!confirmRejectId}
        message="Are you sure you want to reject this post?"
        showReasonInput
        onCancel={() => setConfirmRejectId(null)}
        onConfirm={(reason) => {
          dispatch(rejectPost(confirmRejectId!));
          setToastData({
            message: "Post rejected",
            undo: () => dispatch(approvePost(confirmRejectId!)),
          });
          console.log("Rejection reason:", reason);
          setConfirmRejectId(null);
        }}
      />
      {toastData && (
        <UndoToast message={toastData.message} onUndo={toastData.undo} />
      )}
      {/* Modal */}
      <PostPreviewModal
        post={modalPost}
        isOpen={!!modalPost}
        onClose={() => setModalPost(null)}
      />
    </div>
  );
}
