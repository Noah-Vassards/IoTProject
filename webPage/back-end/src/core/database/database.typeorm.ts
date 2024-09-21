import { type TypeOrmModuleOptions } from '@nestjs/typeorm'

import { User } from 'src/modules/users/users.entity'

const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5433,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME_DEVELOPMENT,
  entities: [
    User
  ],
  synchronize: true
}
export { typeormConfig }