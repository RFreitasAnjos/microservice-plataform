'use client';

import axios, { AxiosInstance, AxiosError } from 'axios';

let getTokenFn: (() => string | null) = () => null;

const apiInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

let interceptorsConfigured = false;

function ensureInterceptors() {
  if (interceptorsConfigured) {
    return;
  }

  apiInstance.interceptors.request.use(
    (config) => {
      const token = getTokenFn();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // O refresh/logout é tratado pelo Keycloak e pelo backend.
      }
      return Promise.reject(error);
    }
  );

  interceptorsConfigured = true;
}

export function initializeApi(getToken: () => string | null): AxiosInstance {
  getTokenFn = getToken;
  ensureInterceptors();

  return apiInstance;
}

export function getApi(): AxiosInstance {
  ensureInterceptors();
  return apiInstance;
}

export default getApi;
