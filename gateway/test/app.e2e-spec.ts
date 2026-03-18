import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/login (GET) - should redirect to /auth/login', () => {
    return request(app.getHttpServer())
      .get('/login')
      .expect(302)
      .expect('Location', '/auth/login');
  });

  it('/auth/login (GET) - should redirect to Keycloak', () => {
    return request(app.getHttpServer())
      .get('/auth/login')
      .expect(302)
      .expect((res) => {
        const location = res.header['location'];
        if (!location || !location.includes('keycloak')) {
          throw new Error('Should redirect to Keycloak');
        }
      });
  });

  it('/auth/me (GET) - should return 401 without token', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .expect(401);
  });

  it('/auth/set-token (POST) - should set auth cookie', () => {
    const token = 'test-jwt-token';
    return request(app.getHttpServer())
      .post('/auth/set-token')
      .send({ token })
      .expect(204)
      .expect('Set-Cookie', /auth_token=/);
  });

  it('/auth/logout (POST) - should clear auth cookie', () => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .expect(204)
      .expect('Set-Cookie', /auth_token=/);
  });
});
