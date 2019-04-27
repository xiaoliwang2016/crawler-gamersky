const request = require('request')
const cheerio = require('cheerio')
const ImageTask = require('./image.js')
const Entities = require('html-entities').XmlEntities
const async = require('async');


var Article = {}
var ArticleModel = global.sequelize.import('../models/article.js')


Article.data = {}
Article.parse = function(context, info = {}){
	var $ = cheerio.load(context)

	if(JSON.stringify(info) == '{}'){
		var detail = Entities.decode($(".Mid2L_tit .detail").text()).trim()
		info.title = Entities.decode($(".Mid2L_tit h1").text())
		info.source = detail.slice(detail.indexOf('来源') + 3, detail.indexOf('作者'))
		info.author = detail.slice(detail.indexOf('作者') + 3, detail.indexOf('编辑'))
		info.editor = detail.slice(detail.indexOf('编辑') + 3, detail.indexOf('浏览'))
		info.content = ''
	}

	var content = Entities.decode($(".Mid2L_con").html())
	//获取全部图片路径
	var imageArr = []
	$(".Mid2L_con img").each((index, item) => {
		let src = $(item).attr("data-src") ? $(item).attr("data-src") : $(item).attr("src")
		imageArr.push(src)
	})
	
	return new Promise((resolve, reject) => {
		async.eachLimit(imageArr, 2, (img, callback) => {
			ImageTask.saveImage(img).then(newImg => {
				console.log(newImg);
				content = content.replace(img, newImg)
				setTimeout(() => {
					callback(null)
				},1000)
			}).catch(err => {
				setTimeout(() => {
					callback(null)
				},1000)
				console.log(err)
			})
		}, err => {
			info.content += content
			this.data = info
			resolve()
		})
	})
}

Article.load = function(url){
	return new Promise((resolve, reject) => {
		var urls = []
		for(let i = 1; i <= 10; i++){
			if(i == 1){
				urls.push(url)
			} else {
				urls.push(`${url.slice(0,url.lastIndexOf('.'))}_${i}${url.slice(url.lastIndexOf('.'))}`)
			}
		}
		async.eachSeries(urls, (item, callback) => {
			console.log(`${item} 爬取中...`)
			request.get({
				url: item,
				headers: {
					"Host": "www.gamersky.com",
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36",
					"Referer": "https://www.gamersky.com/pcgame/",
					"Cache-Control": "max-age=0",
					"Connection": "keep-alive"
				},
				timeout: 5000
			}, (err, response, body) => {
				console.log(response.statusCode);
				
				if(response.statusCode == 404){
					callback('finish')
				} else {
					this.parse(body, this.data).then(() => {
						setTimeout(()=>{
							callback(null)
						},3000)
					})
				}
			})
		}, err => {
			resolve()
		})
	})
}

Article.run = function(url){
	return new Promise((resolve, reject) => {
		this.load(url).then(() => {
			ArticleModel.create(this.data).then(article => {
				resolve(article)
			})
		})
	})
}

module.exports = Article