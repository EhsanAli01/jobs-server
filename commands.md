npx sequelize-cli model:generate --name jobRequest --attributes experience:string,education:string,languages:text,skills:text,description:string

npx sequelize-cli db:migrate:undo:all --to 20240521115404-create-jobs.js
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate