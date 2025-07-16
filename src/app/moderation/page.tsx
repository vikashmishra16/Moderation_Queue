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
import { Eye, X, Check, Clock, User, AlertTriangle } from "lucide-react";

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
  const postsPerPage = 5;
  const filteredPosts = posts.filter((post) => post.status === statusFilter);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    approved: <Check className="w-4 h-4" />,
    rejected: <X className="w-4 h-4" />,
  };

  const getReportColor = (count: number) => {
    if (count >= 5) return "text-red-800 border-red-600 bg-red-300";
    if (count >= 3) return "text-red-600 border-red-400 bg-red-200";
    if (count >= 1) return "text-red-400 border-red-200 bg-red-100";
    return "text-red-500 border-red-300 bg-red-50";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Moderation Queue</h1>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {(["pending", "approved", "rejected"] as const).map((status) => {
          const isActive = statusFilter === status;
          const styles = {
            pending: {
              active: "bg-yellow-400 text-yellow-900 border-yellow-500",
              hover: "hover:bg-yellow-100 hover:text-yellow-800",
            },
            approved: {
              active: "bg-green-400 text-green-900 border-green-500",
              hover: "hover:bg-green-100 hover:text-green-800",
            },
            rejected: {
              active: "bg-red-400 text-red-900 border-red-500",
              hover: "hover:bg-red-100 hover:text-red-800",
            },
          };
          const baseClasses =
            "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 shadow-sm";
          const statusStyle = styles[status];
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`${baseClasses} ${
                isActive
                  ? `${statusStyle.active}`
                  : `bg-white text-gray-700 border-gray-200 ${statusStyle.hover}`
              }`}
            >
              {statusIcons[status]}{" "}
              {status.charAt(0).toUpperCase() + status.slice(1)} (
              {posts.filter((p) => p.status === status).length})
            </button>
          );
        })}
      </div>

      {/* Bulk Toolbar - Show only in "pending" status with any selection */}
      {statusFilter === "pending" && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={
                selectedIds.length > 0 &&
                selectedIds.length ===
                  posts.filter((p) => p.status === "pending").length
              }
              onChange={(e) => {
                if (e.target.checked) {
                  selectAll();
                } else {
                  clearSelection();
                }
              }}
              className="w-4 h-4"
            />
            <span>
              {selectedIds.length > 0
                ? `${selectedIds.length} selected`
                : `Select All (${
                    posts.filter((p) => p.status === "pending").length
                  } pending posts)`}
            </span>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={clearSelection}
                className="bg-gray-100 px-3 py-1 rounded text-sm hover:bg-gray-200"
              >
                Clear
              </button>
              <button
                onClick={handleBatchApprove}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
              >
                Approve Selected
              </button>
              <button
                onClick={handleBatchReject}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
              >
                Reject Selected
              </button>
            </div>
          )}
        </div>
      )}

      {/* Post List */}
      {posts
        .filter((post) => post.status === statusFilter)
        .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
        .map((post) => (
          <div
            key={post.id}
            className={`p-4 rounded shadow-sm mb-4 transition-transform duration-300 ease-in-out hover:scale-[1.01]
            `}
          >
            <div className="flex items-start gap-4">
              {statusFilter === "pending" && (
              <input
                type="checkbox"
                checked={selectedIds.includes(post.id)}
                disabled={post.status !== "pending"}
                onChange={() => toggleSelect(post.id)}
                className="mt-1"
              />
              )}
              {post.imageUrl && (
                <div className="relative group w-20 h-20 overflow-visible rounded mb-3">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-[10px] transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2
                      className="text-lg font-semibold cursor-pointer underline"
                      onClick={() => setModalPost(post as Post)}
                    >
                      {post.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author.username}</span>
                      <span>•</span>
                      <span>
                        {hasMounted
                          ? new Date(post.reportedAt).toLocaleString()
                          : "Loading..."}
                      </span>
                    </div>
                    <p className="text-[15px] text-gray-600">{post.content}</p>
                  </div>
                  <span
                    className={`
                             px-3 py-1 rounded-xl border flex items-center gap-1 text-sm font-medium
                              ${
                                post.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : post.status === "approved"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : "bg-red-100 text-red-800 border-red-300"
                              }
                                `}
                  >
                    {
                      statusIcons[
                        post.status as "pending" | "approved" | "rejected"
                      ]
                    }{" "}
                    {post.status}
                  </span>
                </div>
                <hr className="my-4 border-t border-gray-300" />
                <div className="flex justify-between  mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="bg-gray-100 px-3 py-1 rounded-xl border border-gray-300">
                      Reason: {post.reportedReason}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-xl border flex items-center gap-1 text-sm font-medium ${getReportColor(
                        post.reportCount
                      )}`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      {post.reportCount} reports
                    </span>
                  </div>
                  <div className=" flex gap-4">
                    <button
                      onClick={() => setModalPost(post as Post)}
                      className="flex items-center gap-2 text-sm font-medium border border-blue-500 text-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 cursor-pointer"
                    >
                      <Eye className="w-5 h-5" />
                      View
                    </button>
                    {statusFilter === "pending" && (
                      <>
                        <button
                          onClick={() => {
                            dispatch(approvePost(post.id));
                            setToastData({
                              message: `Post approved`,
                              undo: () => dispatch(rejectPost(post.id)),
                            });
                          }}
                          disabled={post.status !== "pending"}
                          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-white bg-green-500 hover:bg-gradient-to-r from-green-400 to-green-600 hover:scale-[1.03] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>

                        <button
                          onClick={() => setConfirmRejectId(post.id)}
                          disabled={post.status !== "pending"}
                          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-white bg-red-500 hover:bg-gradient-to-r from-red-400 to-red-600 hover:scale-[1.03] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
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
