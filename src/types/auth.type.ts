export enum ROLE {
  FARMER = "FARMER",
  ADMIN = "ADMIN",
}

export enum ENTITY_STATUS {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  INACTIVE = "inactive",
  DELETED = "deleted",
}

export enum VERIFY_OTP_ACTION {
  REGISTER = "register",
}

export enum SOCIAL_PROVIDER {
  GOOGLE = "google",
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errCode?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: ROLE;
  status: ENTITY_STATUS;
  hasPassword: boolean;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
}

export interface UserWithProfile extends User {
  profile?: UserProfile;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface VerifyOtpPayload {
  usernameOrEmail: string;
  code: string;
  action: VERIFY_OTP_ACTION;
}

export interface ResendEmailPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
  otpCode: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  gps?: string;
}
