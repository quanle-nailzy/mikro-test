import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MongoDriver } from '@mikro-orm/mongodb';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      driver: MongoDriver,
      clientUrl:
        'mongodb://nailzy:nailzy@localhost:27017/nailzy?authSource=admin',
      autoLoadEntities: true,
      ensureIndexes: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
