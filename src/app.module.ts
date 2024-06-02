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

@Module({
  imports: [
    
    TypeOrmModule.forRoot({
    type: 'postgres',
    url: process.env.DATABASE_URL || "postgres://postgres.lprmxigitpcgddvpehit:laGalere72@Beuvrages@aws-0-eu-west-2.pooler.supabase.com:5432/postgres",
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: true,
  }),
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    playground: true,
    include: [AuthModule, UserModule, RoleModule],
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  }),
  AuthModule, 
    UserModule, 
  RoleModule, AdminModule],
  
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
