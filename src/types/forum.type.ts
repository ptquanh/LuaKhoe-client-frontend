import { DiagnosisResponse } from "./diagnose.type";

export interface ForumUser {
  id: string;
  name: string;
  avatarUrl: string;
  role?: "FARMER" | "EXPERT" | "ADMIN";
  location?: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  parentId?: string | null;
  author: ForumUser;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  replies?: ForumComment[];
  userVote?: "UP" | "DOWN" | null;
  imageUrl?: string | null;
}

export interface ForumPost {
  id: string;
  author: ForumUser;
  content: string;
  images?: string[];
  createdAt: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  tags?: string[];
  topComment?: ForumComment;
  userVote?: "UP" | "DOWN" | null;
  status?: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
  rejectedBy?: "AI" | "ADMIN" | null;
  category?: string;
  flaggedReason?: string | null;
  isAdminPost?: boolean;
  diagnosis?: DiagnosisResponse;
  taggedUsers?: { id: string; username: string }[];
}
