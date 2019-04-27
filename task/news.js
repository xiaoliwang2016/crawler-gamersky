const request = require('request')
const cheerio = require('cheerio')
const ImageTask = require('./image.js')
const ArticleTask = require('./article.js')
const Entities = require('html-entities').XmlEntities
entities = new Entities()

var NewsModel = global.sequelize.import('../models/news.js')
var News = {}

News.url = "https://db2.gamersky.com/LabelJsonpAjax.aspx"

News.parse = async function(content){
	var $ = cheerio.load(content)
	var taskArr = []
	for(let i = 1; i < $("li").length; i++){
		let info = {
			article_id: '',
			title: '',
			descrption: '',
			img: ''
		}
		let bannerUrl = entities.decode($(`li:nth-child(${i})`).find($(".img a img")).attr('src'))
		let title = entities.decode($(`li:nth-child(${i})`).find($(".con .tit a")).attr('title'))
		let articleUrl = entities.decode($(`li:nth-child(${i})`).find($(".con .tit a")).attr('href'))
		if(!articleUrl || !title || !bannerUrl){
			console.log('跳过', articleUrl, title, bannerUrl);
			continue
		}
		let res = await ArticleTask.run(articleUrl)
		if(res){
			console.log(`${title}.........完成!`)
			info.article_id = res.id
			// 必须等待图片保存结束
			info.img =  await ImageTask.saveImage(bannerUrl)
			info.title = title
			info.descrption = entities.decode($(`li:nth-child(${i})`).find($(".con .txt")).text())
			console.log(info);
			taskArr.push(NewsModel.create(info))
		} else {
			console.log(`${title}.........失败!`)
		}
	}
	return taskArr
}

News.run = function(page){
	return new Promise((resolve, reject) => {
		var param = {
			"type":"updatenodelabel",
			"isCache":true,
			"cacheTime":60,
			"nodeId":"11017",
			page
		}
		request.get({
			url: this.url,
			qs: {
				jsondata: JSON.stringify(param)
			},
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36",
				"Referer": "https://www.gamersky.com/pcgame/"
			},
			timeout: 5000
		}, (err, response, body) => {
			if(err) {
				reject(err)
				return
			}
			this.parse(JSON.parse(body.toString().slice(1,-2)).body).then(news => {
				resolve()
			})
		})		
	})
}

module.exports = News
