import { createProxyMiddleware } from 'http-proxy-middleware';
import { services } from '../config/services.config';

export const userProxy = createProxyMiddleware({
  target: services.user.url,
  changeOrigin: true,
  pathRewrite: {
    '^/users': '',
  },
});

export const paymentProxy = createProxyMiddleware({
  target: services.payment.url,
  changeOrigin: true,
  pathRewrite: {
    '^/payments': '',
  },
});

export const notificationProxy = createProxyMiddleware({
  target: services.notification.url,
  changeOrigin: true,
  pathRewrite:{
    "^/notification":""
  }
});