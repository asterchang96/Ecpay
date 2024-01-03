export const config = () => ({
  port: Number(process.env.PORT),
  envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env',
  database: {
    logging: process.env.DB_LOGGING,
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../products/entity/**/*.entity{.ts,.js}'],
    synchronize: process.env.DB_SYNCHRONIZE,
  },
});
