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

export interface User {
  id: string;
  email: string;
  username: string;
  role: ROLE;
  status: ENTITY_STATUS;
  hasPassword: boolean;
  metadata?: Record<string, any>;
  avatarUrl: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AdminProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export type UserProfile = FarmerProfile | AdminProfile;

export interface UserWithProfile extends User {
  farmerProfile?: FarmerProfile | null;
  adminProfile?: AdminProfile | null;
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
  oldPassword?: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UserField {
  id: string;
  userId: string;
  fieldName: string;
  address?: string;
  gpsLat: number;
  gpsLng: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserFieldPayload {
  fieldName: string;
  address?: string;
  gpsLat: number;
  gpsLng: number;
  isDefault?: boolean;
}

export interface UpdateUserFieldPayload {
  fieldName?: string;
  address?: string;
  gpsLat?: number;
  gpsLng?: number;
  isDefault?: boolean;
}
