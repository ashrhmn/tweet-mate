# Template for NestJS and NextJS Stack
*End-to-end validated and type defined api*

### Scripts

1. Use `yarn dev` to run in development mode
2. Use `yarn build` for production build
3. Use `yarn db:reset` to reset database as per created migrations and seed data from `seed.ts`
4. Use `yarn seed` to run seeder from `seed.ts`
5. Use `yarn migration:create` to create new migration, migration files will be auto populated based on the changes in `prisma.schema`

    - For interactive migration creation
    ```bash
    yarn migration:create
    ```
    - Pass the migration name
    ```bash
    yarn migration:create --name add-users-table
    ```
    - Create only migration file and skip pushing changes to database
    ```bash
    yarn migration:create --name add-users-table --create-only
    ```