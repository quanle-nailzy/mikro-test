import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
} from '@mikro-orm/mongodb';
import { User } from './user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async createUser(data: User): Promise<User> {
    const user = this.userRepository.create(data);
    await this.em.persistAndFlush(user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    const data = await this.userRepository.findOne({ id });
    return data;
  }

  async find(query: FilterQuery<User>): Promise<User | null> {
    return this.userRepository.findOne(query);
  }
}
