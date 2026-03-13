import { createProxyMiddleware } from 'http-proxy-middleware'
import { services } from '../config/services.config'
import { RequestHandler } from 'express'

// Configuração base para todos os proxies
const baseProxyOptions = {
  changeOrigin: true,
  timeout: 30000,
  proxyTimeout: 30000,
  logLevel: 'warn' as const,
  onError: (err: Error, req: any, res: any) => {
    console.error(`[Proxy Error] ${req.method} ${req.path}:`, err.message)
    res.status(503).json({
      error: 'Service unavailable',
      message: 'Could not reach the service',
      timestamp: new Date().toISOString()
    })
  },
  onProxyReq(proxyReq, req) {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      console.log(`[Proxy Request] ${req.method} ${req.path} - Body bytes: ${Buffer.byteLength(bodyData)}`);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  
}

export const usersProxy: RequestHandler = createProxyMiddleware({
  target: services.users.url,
  ...baseProxyOptions
})

export const authProxy: RequestHandler = createProxyMiddleware({
  target: services.users.url,
  ...baseProxyOptions
})

export const paymentProxy: RequestHandler = createProxyMiddleware({
  target: services.payment.url,
  ...baseProxyOptions
})

export const notificationProxy: RequestHandler = createProxyMiddleware({
  target: services.notification.url,
  ...baseProxyOptions
})