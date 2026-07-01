## Sequelize commands

1. Command to migrate the models : **npx sequelize db:migrate**
   This will migrate all the models and migration files
2. Command to insert the initial datas from seeders: **npx sequelize db:seed:all**
   This will insert any default values from all the seed files

3. Command to create migration file: **npx sequelize-cli migration:generate --name filename**
   this will create a migration file for any model Note: filename will be meaningful when creating the migration name with model name

4. Command to create seeder file. **npx sequelize-cli seed:generate --name filename** this will create a seeder file for any model Note: filename will be meaningful when creating the seeder name with model name

5. Command to run application. **npm run dev**

6. Please check config.json file inside config folder for the database.
