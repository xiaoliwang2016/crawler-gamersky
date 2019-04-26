const Sequelize = require('sequelize');
const dbConfig = require('./config/db.json');
const program = require('commander');
const request = require('request')

program
    .version('0.1.0')
    .option('-s, --start [start]', '从第几页开始拿取', '1', parseInt)
    .option('-n, --total [total]', '一共拿取多少页', '10', parseInt)
    .option('-t, --type [type]', '选择拿取什么类型数据，可选：news|image|gamer', 'news')
    .parse(process.argv);

program.on('--help', function() {
    console.log('')
    console.log('Examples:');
    console.log('$ node app --type news --start 1 --total 10');
});



if (program.type == 'news') {
    if (isNaN(program.start) || isNaN(program.total)) {
        console.log('请输入正确参数,例如：');
        console.log('node app --type news --start 1 --total 10');
        return
    }
}

global.sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});
global.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


var NewsTask = require("./task/news.js");
if (program.type == 'news') {
   loadNews(program.start, program.total)
}


function loadNews(page, total){
    if(total <= 0){
        console.log('任务完成');
        process.exit()
        return
    }
    NewsTask.run(page).then(() => {
        console.log(`第${page}页列表爬取完成！`)
        page += 1
        total -= 1
        loadNews(page,total)
    }).catch(err => {
        console.log(`第${page}页列表爬取错误！`, err)
        page += 1
        total -= 1
        loadNews(page,total)
    })
} 

