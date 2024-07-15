npx sequelize-cli model:generate --name notifications --attributes senderId:string,receiverId:string,action:string,status:string

npx sequelize-cli db:migrate:undo:all --to 20240708103841-create-notifications.js
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
