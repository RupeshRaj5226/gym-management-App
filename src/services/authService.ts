import { apiRequest } from '@/services/api';
import type {
  LoginRequest,
  LoginResponse,
} from '@/types/auth';

export function login(
  request: LoginRequest,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
