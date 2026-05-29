import axiosClient from "@/lib/axiosClient";
import { BaseResponse } from "@/types/common.type";
import { ForumComment, ForumPost, ForumUser } from "@/types/forum.type";

// Mapping helper for User structures from backend to frontend ForumUser
export const mapUserToForumUser = (user: any): ForumUser => {
  if (!user) {
    return {
      id: "anonymous",
      name: "Người dùng ẩn danh",
      avatarUrl:
        "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png",
    };
  }

  const profile = user.farmerProfile || user.adminProfile || null;
  const firstName = profile?.firstName || "";
  const lastName = profile?.lastName || "";
  const fullName =
    `${lastName} ${firstName}`.trim() || user.username || "Thành viên Lúa Khỏe";

  let role: "farmer" | "expert" | "admin" = "farmer";
  if (user.role === "ADMIN") {
    role = "admin";
  } else if (user.metadata?.isExpert) {
    role = "expert";
  }

  return {
    id: user.id,
    name: fullName,
    avatarUrl: user.avatarUrl,
    role,
    location: profile?.defaultProvince || user.metadata?.location || undefined,
  };
};

// Mapping helper for Post structures from backend to frontend ForumPost
export const mapBackendPostToForumPost = (post: any): ForumPost => {
  return {
    id: post.id,
    author: mapUserToForumUser(post.author),
    content: post.content,
    images: post.images || [],
    createdAt: post.createdAt,
    upvotes: post.upvotes || 0,
    downvotes: post.downvotes || 0,
    commentCount: post.commentCount || 0,
    tags: post.tags || [],
    userVote: post.userVote || null,
    topComment: post.topComment
      ? mapBackendCommentToForumComment(post.topComment)
      : undefined,
    status: post.status,
    category: post.category,
    flaggedReason: post.flaggedReason,
    isAdminPost: post.isAdminPost,
  };
};

// Mapping helper for Comment structures from backend to frontend ForumComment
export const mapBackendCommentToForumComment = (comment: any): ForumComment => {
  return {
    id: comment.id,
    postId: comment.postId,
    parentId: comment.parentId || null,
    author: mapUserToForumUser(comment.author),
    content: comment.content,
    createdAt: comment.createdAt,
    upvotes: comment.upvotes || 0,
    downvotes: comment.downvotes || 0,
    userVote: comment.userVote || null,
    imageUrl: comment.imageUrl || null,
    replies: comment.replies
      ? comment.replies.map((reply: any) =>
          mapBackendCommentToForumComment(reply),
        )
      : [],
  };
};

export interface CreatePostPayload {
  content: string;
  images?: string[];
  tags?: string[];
  category?: string;
  isDraft?: boolean;
}

export interface UpdatePostPayload {
  content?: string;
  images?: string[];
  tags?: string[];
  category?: string;
}

export interface CreateCommentPayload {
  content: string;
  parentId?: string;
}

export interface UpdateCommentPayload {
  content: string;
}

export interface GetPostsParams {
  cursor?: string;
  limit?: number;
  sort?: "new" | "hot";
  tag?: string;
  category?: string;
  status?: string;
}

export interface GetCommentsParams {
  cursor?: string;
  limit?: number;
}

export const forumService = {
  getPosts: async (
    params?: GetPostsParams,
  ): Promise<
    BaseResponse<{ items: ForumPost[]; nextCursor: string | null }>
  > => {
    const response = await axiosClient.get<
      BaseResponse<{ items: any[]; nextCursor: string | null }>
    >("/forum/posts", {
      params,
    });

    // Map response items cleanly
    const items = response.data.data?.items
      ? response.data.data.items.map(mapBackendPostToForumPost)
      : [];

    return {
      success: response.data.success,
      message: response.data.message,
      data: {
        items,
        nextCursor: response.data.data?.nextCursor || null,
      },
    };
  },

  getPost: async (id: string): Promise<BaseResponse<ForumPost>> => {
    const response = await axiosClient.get<BaseResponse<any>>(
      `/forum/posts/${id}`,
    );
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data
        ? mapBackendPostToForumPost(response.data.data)
        : undefined,
    };
  },

  createPost: async (
    payload: CreatePostPayload | FormData,
  ): Promise<BaseResponse<ForumPost>> => {
    const response = await axiosClient.post<BaseResponse<any>>(
      "/forum/posts",
      payload,
    );
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data
        ? mapBackendPostToForumPost(response.data.data)
        : undefined,
    };
  },

  updatePost: async (
    id: string,
    payload: UpdatePostPayload,
  ): Promise<BaseResponse<ForumPost>> => {
    const response = await axiosClient.put<BaseResponse<any>>(
      `/forum/posts/${id}`,
      payload,
    );
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data
        ? mapBackendPostToForumPost(response.data.data)
        : undefined,
    };
  },

  deletePost: async (id: string): Promise<BaseResponse<void>> => {
    const response = await axiosClient.delete<BaseResponse<void>>(
      `/forum/posts/${id}`,
    );
    return response.data;
  },

  votePost: async (
    id: string,
    type: "UP" | "DOWN" | "NONE",
  ): Promise<BaseResponse<void>> => {
    const response = await axiosClient.post<BaseResponse<void>>(
      `/forum/posts/${id}/vote`,
      { type },
    );
    return response.data;
  },

  getComments: async (
    postId: string,
    params?: GetCommentsParams,
  ): Promise<
    BaseResponse<{ items: ForumComment[]; nextCursor: string | null }>
  > => {
    const response = await axiosClient.get<
      BaseResponse<{ items: any[]; nextCursor: string | null }>
    >(`/forum/posts/${postId}/comments`, { params });

    const items = response.data.data?.items
      ? response.data.data.items.map(mapBackendCommentToForumComment)
      : [];

    return {
      success: response.data.success,
      message: response.data.message,
      data: {
        items,
        nextCursor: response.data.data?.nextCursor || null,
      },
    };
  },

  createComment: async (
    postId: string,
    payload: CreateCommentPayload | FormData,
  ): Promise<BaseResponse<ForumComment>> => {
    const response = await axiosClient.post<BaseResponse<any>>(
      `/forum/posts/${postId}/comments`,
      payload,
    );
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data
        ? mapBackendCommentToForumComment(response.data.data)
        : undefined,
    };
  },

  updateComment: async (
    commentId: string,
    payload: UpdateCommentPayload,
  ): Promise<BaseResponse<ForumComment>> => {
    const response = await axiosClient.put<BaseResponse<any>>(
      `/forum/comments/${commentId}`,
      payload,
    );
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data
        ? mapBackendCommentToForumComment(response.data.data)
        : undefined,
    };
  },

  deleteComment: async (commentId: string): Promise<BaseResponse<void>> => {
    const response = await axiosClient.delete<BaseResponse<void>>(
      `/forum/comments/${commentId}`,
    );
    return response.data;
  },

  voteComment: async (
    commentId: string,
    type: "UP" | "DOWN" | "NONE",
  ): Promise<BaseResponse<void>> => {
    const response = await axiosClient.post<BaseResponse<void>>(
      `/forum/comments/${commentId}/vote`,
      { type },
    );
    return response.data;
  },

  aiEnhanceContent: async (
    content: string,
  ): Promise<
    BaseResponse<{
      enhancedContent: string;
      hashtags: string[];
      category: string;
    }>
  > => {
    const response = await axiosClient.post<BaseResponse<any>>(
      "/forum/posts/ai-enhance",
      { content },
    );
    return response.data;
  },

  getMyPosts: async (params?: {
    status?: string;
    search?: string;
  }): Promise<BaseResponse<ForumPost[]>> => {
    const response = await axiosClient.get<BaseResponse<any[]>>(
      "/forum/posts/my-posts",
      { params },
    );
    const items = response.data.data
      ? response.data.data.map(mapBackendPostToForumPost)
      : [];
    return {
      success: response.data.success,
      message: response.data.message,
      data: items,
    };
  },

  moderatePost: async (
    id: string,
    status: string,
    flaggedReason?: string,
  ): Promise<BaseResponse<any>> => {
    const response = await axiosClient.put<BaseResponse<any>>(
      `/admin/forum/posts/${id}/moderate`,
      { status, flaggedReason },
    );
    return response.data;
  },
};
