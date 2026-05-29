export const ERROR_MESSAGES: Record<string, string> = {
  // Forum & Moderation
  CONTENT_POLICY_VIOLATION:
    "Nội dung chứa từ ngữ hoặc hình ảnh không phù hợp với tiêu chuẩn cộng đồng.",
  POST_NOT_FOUND: "Bài viết không tồn tại hoặc đã bị xóa.",
  COMMENT_NOT_FOUND: "Bình luận không tồn tại.",

  // File Uploads
  FILE_TOO_LARGE: "Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 5MB.",
  INVALID_FILE_TYPE: "Định dạng tệp không được hỗ trợ.",

  // Auth & Permissions
  UNAUTHORIZED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  FORBIDDEN: "Bạn không có quyền thực hiện hành động này.",

  // System Fallbacks
  INTERNAL_SERVER_ERROR: "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.",
  NETWORK_ERROR:
    "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.",
  DEFAULT: "Đã có lỗi xảy ra. Vui lòng thử lại.",
};
