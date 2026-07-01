/**
 * Đọc giới hạn dung lượng ảnh từ biến môi trường.
 * Fallback về 10MB nếu chưa cấu hình.
 * Đồng bộ với backend SYSTEM_CONFIG_KEY.MAX_IMAGE_SIZE_MB
 */
export const MAX_IMAGE_SIZE_MB = (() => {
  const val = Number(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE_MB);
  return isNaN(val) || val <= 0 ? 10 : val;
})();

export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const FILE_SIZE_ERROR = (fileName?: string) =>
  fileName
    ? `Ảnh ${fileName} vượt quá dung lượng ${MAX_IMAGE_SIZE_MB}MB cho phép!`
    : `Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn ${MAX_IMAGE_SIZE_MB}MB.`;
