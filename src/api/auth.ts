import apiClient, { tokenStorage } from './client';
import type {
  LoginRequest,
  RegisterRequest,
  JwtResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  UpdateProfileRequest,
  MessageResponse,
  User,
} from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<JwtResponse> => {
    const response = await apiClient.post<JwtResponse>('/auth/login', data);
    const { accessToken, refreshToken } = response.data;
    tokenStorage.setTokens(accessToken, refreshToken);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/auth/register', data);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<MessageResponse> => {
    const response = await apiClient.get<MessageResponse>('/auth/verify-email', {
      params: { token },
    });
    return response.data;
  },

  resendVerification: async (email: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/auth/resend-verification', {
      email,
    });
    return response.data;
  },

  logout: (): void => {
    tokenStorage.clearTokens();
    window.location.href = '/login';
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/auth/reset-password', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/auth/change-password', data);
    return response.data;
  },

  deleteAccount: async (data: DeleteAccountRequest): Promise<void> => {
    await apiClient.delete('/auth/account', { data });
    tokenStorage.clearTokens();
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put<User>('/auth/profile', data);
    return response.data;
  },
};
