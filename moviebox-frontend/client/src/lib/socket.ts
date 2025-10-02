import { io } from 'socket.io-client';

import { API_BASE_URL } from '@/api';

// Derive the base URL from the API constant for the socket connection.
const SOCKET_URL = new URL(API_BASE_URL).origin;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: {
    token: localStorage.getItem('accessToken')
  }
});
