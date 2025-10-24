// Set the API base URL for all frontend requests
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.30.82:8001/api/lite";

// API response wrapper type from backend
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
