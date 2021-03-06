import { Test } from '@nestjs/testing';
import { filter } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of the auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with saled and hashed password', async () => {
    const user = await service.signup('test.test.de', 'test1234');
    expect(user.password).not.toEqual('test1234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with an email that is in use', async () => {
    await service.signup('test@test.de', 'test1234');
    try {
      await service.signup('test@test.de', 'test1234');
    } catch (error) {
      expect(error.toString()).toMatch('BadRequestException: email in use');
    }
  });

  it('throws an error if signin is called with an unused email', async () => {
    try {
      await service.signin('test.test.de', 'test@12');
    } catch (error) {
      expect(error.toString()).toMatch('NotFoundException: user not found');
    }
  });

  it('throws an error if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    try {
      await service.signin('laskdjf@alskdfj.com', 'password2');
    } catch (error) {
      expect(error.toString()).toMatch('BadRequestException: bad password');
    }
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('test@test.de', 'test1234');
    const user = await service.signin('test@test.de', 'test1234');
    expect(user).toBeDefined();
  });
});
