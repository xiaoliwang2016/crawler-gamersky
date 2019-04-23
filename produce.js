var config = require('./config/db.json')
var SequelizeAuto = require('sequelize-auto')

var auto = new SequelizeAuto(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'mysql',
    directory: './models/', // prevents the program from writing to disk
    port: config.port,
    additional: {
        timestamps: true,
        paranoid: true,
        createdAt: false,
        updatedAt: 'update_time',
        deletedAt: 'delete_time'
    }
})

auto.run(function (err) {
  if (err) throw err;
  console.log('创建成功');
});