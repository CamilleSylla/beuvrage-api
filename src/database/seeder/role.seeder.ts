import { RoleEntity } from 'src/role/entity/role.entity';
import { RoleList } from 'src/role/entity/role.enum';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('seed.role : starting process');

    await dataSource.query('TRUNCATE "role_entity" RESTART IDENTITY CASCADE');

    const roleRepository = dataSource.getRepository(RoleEntity);
    console.log(roleRepository);

    // Use for...of loop to await async operations
    for (const key of Object.values(RoleList)) {
      console.log(`seed.role : creating ${key} role`);
      await roleRepository.insert({
        name: key,
      });
      console.log(`seed.role : ${key} role created`);
    }

    console.log('seed.role : done');
  }
}
