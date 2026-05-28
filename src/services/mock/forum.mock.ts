import { ForumComment, ForumPost, ForumUser } from "@/types/forum.type";

export const MOCK_CURRENT_USER: ForumUser = {
  id: "u_current",
  name: "Nguyễn Văn A",
  role: "farmer",
  location: "Đồng Tháp",
  avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
};

export const MOCK_POSTS: ForumPost[] = [
  {
    id: "p_1",
    author: {
      id: "u_1",
      name: "Trần Hữu Khang",
      role: "farmer",
      location: "An Giang",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    },
    content:
      "Chào bà con, lúa nhà tôi đang giai đoạn đẻ nhánh mà lá bị đốm nâu như thế này thì có phải bị đạo ôn không ạ? Có thuốc nào đặc trị hiệu quả giới thiệu giúp tôi với.",
    images: [
      "https://images.unsplash.com/photo-1595180908869-7ee475ec1eb7?q=80&w=600&auto=format&fit=crop",
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    upvotes: 24,
    downvotes: 0,
    commentCount: 5,
    tags: ["Bệnh đạo ôn", "Đốm lá"],
    userVote: "up",
  },
  {
    id: "p_2",
    author: {
      id: "u_2",
      name: "Chuyên gia Minh",
      role: "expert",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    },
    content:
      "Cảnh báo sớm: Hiện tại thời tiết khu vực ĐBSCL đang có sương mù nhẹ vào sáng sớm, độ ẩm cao. Bà con lưu ý phòng ngừa bệnh đạo ôn cổ bông và vi khuẩn cháy bìa lá nhé. Nên phun phòng trước khi lúa trổ đều.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    upvotes: 156,
    downvotes: 2,
    commentCount: 32,
    tags: ["Cảnh báo thời tiết", "Đạo ôn cổ bông"],
  },
  {
    id: "p_3",
    author: {
      id: "u_3",
      name: "Lê Văn Tám",
      role: "farmer",
      location: "Sóc Trăng",
    },
    content:
      "Mọi người cho hỏi giống lúa ST25 sạ thưa thì khoảng cách bao nhiêu là vừa đẹp nhất để hạt gạo bóng và ít sâu bệnh?",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    upvotes: 12,
    downvotes: 0,
    commentCount: 8,
    tags: ["Giống ST25", "Kỹ thuật canh tác"],
  },
];

export const MOCK_COMMENTS: ForumComment[] = [
  {
    id: "c_1",
    postId: "p_1",
    author: {
      id: "u_4",
      name: "Chú Ba Đất",
      role: "farmer",
      location: "Đồng Tháp",
    },
    content:
      "Đúng bệnh đạo ôn rồi đó Khang ơi. Bệnh này đang phát triển mạnh do sương mù buổi sáng. Nên phun thuốc trị ngay.",
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    upvotes: 5,
    downvotes: 0,
    replies: [
      {
        id: "c_1_1",
        postId: "p_1",
        author: {
          id: "u_2",
          name: "Chuyên gia Minh",
          role: "expert",
          avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
        },
        content:
          "Đúng vậy, chú Ba nói chuẩn rồi. Em có thể dùng thuốc Beam hoặc Filia để phun nhé. Nhớ rút bớt nước trong ruộng ra trước khi xịt.",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        upvotes: 12,
        downvotes: 0,
      },
    ],
  },
  {
    id: "c_2",
    postId: "p_1",
    author: {
      id: "u_5",
      name: "Nguyễn Văn Chín",
      role: "farmer",
    },
    content:
      "Ruộng nhà tôi cũng bị y chang, xịt thuốc gì thì xịt nhớ xịt lúc chiều mát nha Khang, xịt nắng cháy lá luôn đó.",
    createdAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(),
    upvotes: 3,
    downvotes: 0,
    userVote: "down",
  },
];

// Calculate and assign topComment for each post dynamically to simulate backend aggregation
MOCK_POSTS.forEach((post) => {
  const postComments = MOCK_COMMENTS.filter((c) => c.postId === post.id);
  if (postComments.length > 0) {
    const sorted = [...postComments].sort((a, b) => {
      const scoreA = a.upvotes - a.downvotes;
      const scoreB = b.upvotes - b.downvotes;
      return scoreB - scoreA;
    });
    const top = sorted[0];
    // Threshold verification: only highlight positive score comment
    if (top && top.upvotes - top.downvotes > 0) {
      post.topComment = top;
    }
  }
});
