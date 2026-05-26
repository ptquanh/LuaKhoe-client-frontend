export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";
export const ERROR_CODE_MAP: Record<string, string> = {
  user_not_found: "Tài khoản đăng nhập không tồn tại.",
  email_already_exists: "Địa chỉ email này đã được đăng ký sử dụng.",
  username_already_exists: "Tên đăng nhập này đã được đăng ký sử dụng.",
  account_is_not_active: "Tài khoản chưa được kích hoạt.",
  password_incorrect: "Mật khẩu không chính xác.",
  password_or_username_incorrect:
    "Tên đăng nhập hoặc mật khẩu không chính xác.",
  password_same_as_old: "Mật khẩu mới không được trùng với mật khẩu cũ.",
  password_confirmation_mismatch: "Xác nhận mật khẩu mới không trùng khớp.",
  invalid_otp: "Mã OTP không hợp lệ hoặc đã hết hạn.",
  otp_already_sent: "Mã OTP đã được gửi, vui lòng chờ trước khi yêu cầu lại.",
};

export const VALIDATION_ERROR_MAPPINGS = [
  {
    keyword: "password must be longer than or equal to 8 characters",
    msg: "Mật khẩu đăng nhập phải từ 8 ký tự trở lên.",
  },
  {
    keyword: "password incorrect",
    msg: "Mật khẩu không chính xác.",
  },
  {
    keyword: "user not found",
    msg: "Tài khoản đăng nhập không tồn tại.",
  },
  {
    keyword: "email already exists",
    msg: "Địa chỉ email này đã được đăng ký sử dụng.",
  },
  {
    keyword: "username already exists",
    msg: "Tên đăng nhập này đã được đăng ký sử dụng.",
  },
  {
    keyword: "user is not active",
    msg: "Tài khoản chưa được kích hoạt.",
  },
  {
    keyword: "password must be a strong password",
    msg: "Mật khẩu đăng ký phải là mật khẩu mạnh (bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt).",
  },
];
