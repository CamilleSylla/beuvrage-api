import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { RoleModule } from './role/role.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AdminModule } from './admin/admin.module';
import { dataSourceOptions } from './database/data-source';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot(dataSourceOptions),
    GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    playground: true,
    include: [AuthModule, UserModule, RoleModule, AdminModule],
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  }),
  AuthModule, 
    UserModule, 
  RoleModule, AdminModule],
  
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
