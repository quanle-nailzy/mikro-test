import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
