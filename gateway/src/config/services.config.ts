export const services = {

  users: {
    url: process.env.USER_SERVICE_URL || "http://localhost:3001"
  },

  payment: {
    url: process.env.PAYMENT_SERVICE_URL || "http://localhost:5045"
  },

  notification: {
    url: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4000"
  }

};

// Log de inicialização para debug
if (process.env.NODE_ENV === 'production') {
  console.log('[Services Config] Loaded service URLs:');
  console.log(`  - User Service: ${services.users.url}`);
  console.log(`  - Payment Service: ${services.payment.url}`);
  console.log(`  - Notification Service: ${services.notification.url}`);
}