import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware'
import { services } from '../config/services.config'
import { RequestHandler } from 'express'

// Configuração base para todos os proxies
const baseProxyOptions = {
  changeOrigin: true,
  timeout: 30000,
  proxyTimeout: 30000,
  logLevel: 'warn' as const,
  on: {
    error: (err: Error, req: any, res: any) => {
      console.error(`[Proxy Error] ${req.method} ${req.path}:`, err.message)

      const payload = JSON.stringify({
        error: 'Service unavailable',
        message: 'Could not reach the service',
        details: err.message,
        timestamp: new Date().toISOString()
      })

      if (!res.headersSent) {
        res.writeHead(503, {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        })
      }

      res.end(payload)
    },
    proxyReq: (proxyReq, req) => {
      // Re-stream parsed bodies safely when Nest/Express body parser already consumed the request stream.
      fixRequestBody(proxyReq, req)

      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body)
        console.log(`[Proxy Request] ${req.method} ${req.path} - Body bytes: ${Buffer.byteLength(bodyData)}`)
      }
    }
  }
}

const createServiceProxy = (target: string, pathRewrite?: () => string): RequestHandler =>
  createProxyMiddleware({
    target,
    ...baseProxyOptions,
    ...(pathRewrite ? { pathRewrite } : {})
  })

export const usersProxy: RequestHandler = createServiceProxy(services.users.url)

export const authProxy: RequestHandler = createServiceProxy(services.users.url)

export const userRegisterAliasProxy: RequestHandler = createServiceProxy(
  services.users.url,
  () => '/users/register'
)

export const userLoginAliasProxy: RequestHandler = createServiceProxy(
  services.users.url,
  () => '/auth/login'
)

export const paymentProxy: RequestHandler = createServiceProxy(services.payment.url)

export const notificationProxy: RequestHandler = createServiceProxy(services.notification.url)