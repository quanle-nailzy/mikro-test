/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityRepository, MongoDriver } from '@mikro-orm/mongodb';
import { User } from './user.entity';
import { UsersModule } from './user.module';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Users (E2E)', () => {
  let app: INestApplication;
  let userRepository: EntityRepository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        MikroOrmModule.forRoot({
          driver: MongoDriver,
          clientUrl:
            'mongodb://nailzy:nailzy@localhost:27017/nailzy?authSource=admin',
          autoLoadEntities: true,
          ensureIndexes: true,
          allowGlobalContext: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<EntityRepository<User>>(
      getRepositoryToken(User),
    );

    await userRepository.nativeDelete({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john@example.com',
    });
  });

  it('should get a user by ID', async () => {
    const user = await userRepository.insert({
      firstName: 'Jane',
      lastName: 'Doe',
      emailAddress: 'jane@example.com',
    });

    const response = await request(app.getHttpServer())
      .get(`/users/${user.toString()}`)
      .expect(200);

    expect(response.body).toMatchObject({
      firstName: 'Jane',
      lastName: 'Doe',
      emailAddress: 'jane@example.com',
    });
  });

  it('should get user by name', async () => {
    await userRepository.insert({
      firstName: 'Jane',
      lastName: 'Doe',
      emailAddress: 'jane@example.com',
    });

    const data = await userRepository.findOne({ firstName: 'Jane' });
    expect(data).toMatchObject({
      firstName: 'Jane',
      lastName: 'Doe',
      emailAddress: 'jane@example.com',
    });
  });

  it('should update user', async () => {
    const user = await userRepository.insert({
      firstName: 'Jane',
      lastName: 'Doe',
      emailAddress: 'jane@example.com',
    });

    await userRepository.nativeUpdate(
      { id: user.toString() },
      {
        firstName: 'Jane1',
        lastName: 'Doe1',
        emailAddress: 'jane@example.com1',
      },
    );

    const data = await userRepository.findOne({ id: user.toString() });
    expect(data).toMatchObject({
      firstName: 'Jane1',
      lastName: 'Doe1',
      emailAddress: 'jane@example.com1',
    });
  });

  it('should aggregate', async () => {
    const data = await userRepository.aggregate([
      { $match: { first_name: 'Jane' } },
    ]);

    console.log(data);

    // [
    //   {
    //     _id: ObjectId('67b59cea0d0f8228cc022fda'),
    //     first_name: 'Jane',
    //     last_name: 'Doe',
    //     email_address: 'jane@example.com'
    //   },
    //   {
    //     _id: ObjectId('67b59cea0d0f8228cc022fdb'),
    //     first_name: 'Jane',
    //     last_name: 'Doe',
    //     email_address: 'jane@example.com'
    //   }
    // ]
  });
});
