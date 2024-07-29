npx sequelize-cli model:generate --name otpdata --attributes email:string,otp:integer,timestamp:date

npx sequelize-cli db:migrate:undo:all --to 20240726064831-create-otpdata.js
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
