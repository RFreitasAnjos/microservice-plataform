import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';
import { UsersPublicController } from '../src/modules/users/controllers/users.public.controller';
import { UsersPasswordController } from '../src/modules/users/controllers/users.password.controller';
import { UsersService } from '../src/modules/users/services/users.service';

describe('User Service (e2e)', () => {
  let app: INestApplication<App>;
  const usersServiceMock = {
    createUser: jest.fn(),
    recoverPassword: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController, UsersPublicController, UsersPasswordController],
      providers: [
        AppService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.enableVersioning({
      type: VersioningType.URI,
    });

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should expose users create endpoint only under versioned URI', async () => {
    usersServiceMock.createUser.mockResolvedValue({
      id: '5a8c4c2d-59a7-4c6e-8f11-1f4f40f33111',
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'StrongPassword123!',
      })
      .expect(404);

    await request(app.getHttpServer())
      .post('/v1/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'StrongPassword123!',
      })
      .expect(201);
  });

  it('should reject create user with non-whitelisted payload fields', async () => {
    await request(app.getHttpServer())
      .post('/v1/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'StrongPassword123!',
        role: 'admin',
      })
      .expect(400);
  });

  it('should reject weak password on change password endpoint', async () => {
    await request(app.getHttpServer())
      .patch('/v1/users/password/5a8c4c2d-59a7-4c6e-8f11-1f4f40f33111')
      .send({ password: '123' })
      .expect(400);
  });

  it('should reject invalid UUID on change password endpoint', async () => {
    await request(app.getHttpServer())
      .patch('/v1/users/password/not-a-uuid')
      .send({ password: 'StrongPassword123!' })
      .expect(400);
  });

  it('should accept valid change password payload on versioned route', async () => {
    usersServiceMock.recoverPassword.mockResolvedValue(undefined);

    await request(app.getHttpServer())
      .patch('/v1/users/password/5a8c4c2d-59a7-4c6e-8f11-1f4f40f33111')
      .send({ password: 'StrongPassword123!' })
      .expect(204);

    expect(usersServiceMock.recoverPassword).toHaveBeenCalledWith(
      '5a8c4c2d-59a7-4c6e-8f11-1f4f40f33111',
      { password: 'StrongPassword123!' },
    );
  });
});
