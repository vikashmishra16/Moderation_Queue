# 🛡️ Moderation Queue Interface

A full-featured **Moderation Interface** built with [Next.js](https://nextjs.org), [Redux Toolkit](https://redux-toolkit.js.org/), and [Tailwind CSS](https://tailwindcss.com), allowing admins to review, approve, or reject reported posts with ease.

> ✨ Project by **Vikash Mishra**

## 🔧 Features

- 📋 View a queue of reported posts with images, content, and report reasons
- ✅ Approve or ❌ Reject posts individually or in bulk
- 💬 Input rejection reason with optional notes
- 🔄 Undo recent actions using a toast notification
- 🧠 Keyboard shortcuts:
  - `A`: Approve
  - `R`: Reject
  - `Esc`: Close modals/dialogs
- 🔍 Filter posts by status: Pending, Approved, Rejected
- 💻 Clean, responsive UI built with Tailwind CSS
- 📷 Image preview and post content modal
- ⚠️ Color-coded report severity badges

🛠️ Tech Stack
Framework: Next.js App Router
State Management: Redux Toolkit
Styling: Tailwind CSS
Icons: Lucide Icons
Image Optimization: Next.js <Image /> component

📂 Folder Structure
php
Copy
Edit
.
├── app/
│   ├── page.tsx             # Home page
│   └── moderation/          # Main moderation interface
├── components/              # Reusable UI components
│   ├── ConfirmDialog.tsx
│   ├── PostPreviewModal.tsx
│   └── UndoToast.tsx
├── redux/                   # Redux store and slices
│   ├── hooks.ts
│   └── postsSlice.ts
├── public/                  # Static assets
├── styles/                  # Global styles (optional)
├── types/                   # TypeScript types
└── README.md                

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed (v18 or later is recommended).

### Installation

```bash
git clone https://github.com/vikashmishra16/moderation-queue.git
cd Moderation_Queue
npm install
Start npm run dev