import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersRepository } from '../repositories/users.repositories';
import { HashService } from '../../../../common/hash.service';

describe('UsersService', () => {
  let service: UsersService;

  const usersRepositoryMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    recoverPassword: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
    deleteInactiveOlderThan: jest.fn(),
  };

  const hashServiceMock = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn().mockReturnValue('10'),
  };

  const createUserDto = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'StrongPassword123!'
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: usersRepositoryMock,
        },
        {
          provide: HashService,
          useValue: hashServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should convert salt rounds from config before hashing during user creation', async () => {
    usersRepositoryMock.deleteInactiveOlderThan.mockResolvedValue({ count: 0 });
    usersRepositoryMock.findByEmail.mockResolvedValue(null);
    hashServiceMock.hash.mockResolvedValue('hashed-password');
    usersRepositoryMock.create.mockResolvedValue({
      id: 'user-id',
      name: createUserDto.name,
      email: createUserDto.email,
      password: 'hashed-password',
      createdAt: new Date(),
    });

    await service.createUser(createUserDto);

    expect(usersRepositoryMock.deleteInactiveOlderThan).toHaveBeenCalledWith(30);
    expect(hashServiceMock.hash).toHaveBeenCalledWith(createUserDto.password, 10);
    expect(usersRepositoryMock.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: 'hashed-password',
    });
  });

  it('should purge inactive users older than 30 days before listing users', async () => {
    usersRepositoryMock.deleteInactiveOlderThan.mockResolvedValue({ count: 2 });
    usersRepositoryMock.findAll.mockResolvedValue([]);

    await service.findAll();

    expect(usersRepositoryMock.deleteInactiveOlderThan).toHaveBeenCalledWith(30);
    expect(usersRepositoryMock.findAll).toHaveBeenCalledWith(false);
  });

  it('should soft delete user on default remove flow', async () => {
    usersRepositoryMock.deleteInactiveOlderThan.mockResolvedValue({ count: 0 });
    usersRepositoryMock.findById.mockResolvedValue({ id: 'user-id', isActive: true });
    usersRepositoryMock.softDelete.mockResolvedValue({ id: 'user-id', isActive: false });

    await service.remove('user-id');

    expect(usersRepositoryMock.findById).toHaveBeenCalledWith('user-id', false);
    expect(usersRepositoryMock.softDelete).toHaveBeenCalledWith('user-id');
    expect(usersRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should permanently delete user in administrative remove flow', async () => {
    usersRepositoryMock.deleteInactiveOlderThan.mockResolvedValue({ count: 0 });
    usersRepositoryMock.findById.mockResolvedValue({ id: 'user-id', isActive: false });
    usersRepositoryMock.delete.mockResolvedValue({ id: 'user-id' });

    await service.removePermanently('user-id');

    expect(usersRepositoryMock.findById).toHaveBeenCalledWith('user-id', true);
    expect(usersRepositoryMock.delete).toHaveBeenCalledWith('user-id');
  });
});
