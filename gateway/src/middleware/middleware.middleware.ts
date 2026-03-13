import { createProxyMiddleware } from 'http-proxy-middleware'
import { services } from '../config/services.config'

export const usersProxy = createProxyMiddleware({
  target: services.users.url,
  changeOrigin: true
})

export const authProxy = createProxyMiddleware({
  target: services.users.url,
  changeOrigin: true
})

export const paymentProxy = createProxyMiddleware({
  target: services.payment.url,
  changeOrigin: true
})

export const notificationProxy = createProxyMiddleware({
  target: services.notification.url,
  changeOrigin: true
})