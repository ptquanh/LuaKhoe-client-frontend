export interface ForumUser {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: "farmer" | "expert" | "admin";
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
  userVote?: "up" | "down" | null;
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
  userVote?: "up" | "down" | null;
}
