import { ValidationPipe } from '@nestjs/common'

/**
 * Função
 * Remove propriedades extras
 * valida DTO automaticamente
 * transforma tipos
 */
export const GlobalValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
})