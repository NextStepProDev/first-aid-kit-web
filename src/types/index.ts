// User types
export interface User {
  userId: number;
  username: string;
  email: string;
  name?: string;
  roles?: string[];
  createdAt?: string;
  lastLogin?: string;
  alertsEnabled?: boolean;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface UpdateProfileRequest {
  name: string;
  username: string;
}

export interface BroadcastEmailRequest {
  subject: string;
  message: string;
}

export interface MessageResponse {
  message: string;
}

// Drug types
export type DrugForm =
  | 'GEL'
  | 'PILLS'
  | 'SYRUP'
  | 'DROPS'
  | 'SUPPOSITORIES'
  | 'SACHETS'
  | 'CREAM'
  | 'SPRAY'
  | 'OINTMENT'
  | 'LIQUID'
  | 'POWDER'
  | 'INJECTION'
  | 'BANDAGE'
  | 'INHALER'
  | 'PATCH'
  | 'SOLUTION'
  | 'OTHER';

export interface Drug {
  drugId: number;
  drugName: string;
  drugForm: DrugForm;
  expirationDate: string;
  drugDescription: string | null;
}

export interface DrugRequest {
  name: string;
  form: string;
  expirationYear: number;
  expirationMonth: number;
  description?: string | null;
}

export interface DrugStatistics {
  totalDrugs: number;
  expiredDrugs: number;
  activeDrugs: number;
  alertSentCount: number;
  drugsByForm: Record<string, number>;
}

export interface FormOption {
  value: string;
  label: string;
}

// Pagination
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Search params
export interface DrugSearchParams {
  name?: string;
  form?: string;
  expired?: boolean;
  expiringSoon?: boolean;
  expirationUntilYear?: number;
  expirationUntilMonth?: number;
  page?: number;
  size?: number;
  sort?: string;
}

// API Error
export interface ApiError {
  status: number;
  error: string;
  message: string;
  errors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}
