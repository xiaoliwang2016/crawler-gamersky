const request = require('request')
const cheerio = require('cheerio')
const ImageTask = require('./image.js')
const Entities = require('html-entities').XmlEntities

var Article = {}
var ArticleModel = global.sequelize.import('../models/article.js')

Article.parse = async function(context){
	var $ = cheerio.load(context)
	var info = {
		title : '',
		source : '',
		views : 0,
		author : '',
		editor : '',
		follow : 0,
		content : ''
	}
	var detail = Entities.decode($(".Mid2L_tit .detail").text()).trim()
	info.title = Entities.decode($(".Mid2L_tit h1").text())
	info.content = Entities.decode($(".Mid2L_con").html())	
	info.source = detail.slice(detail.indexOf('来源') + 3, detail.indexOf('作者'))
	info.author = detail.slice(detail.indexOf('作者') + 3, detail.indexOf('编辑'))
	info.editor = detail.slice(detail.indexOf('编辑') + 3, detail.indexOf('浏览'))
	// info.views =  $("#countn").text() >= 0 ? $("#countn").text() : 0
	// info.follow =  $(".supportMe span").text() >= 0 ? $(".supportMe span").text() : 0

	//下载内容中的图片
	var imageArr = []
	var imgs = $(".Mid2L_con img")
	imgs.each((index,img)=>{
		imageArr.push(ImageTask.saveImage($(img).attr("src")))	
	})

	//等待所有图片下载完成，然后替换
	var urls = await Promise.all(imageArr)
	urls.forEach((url ,index) => {
		info.content = info.content.replace($(imgs[index]).attr("src"), url)
	})
	return ArticleModel.create(info)
}

Article.run = function(url){
	return new Promise((resolve, reject) => {
		request.get({
			url,
			headers: {
				"Host": "www.gamersky.com",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36",
				"Referer": "https://www.gamersky.com/pcgame/",
				"Cache-Control": "max-age=0",
				"Connection": "keep-alive"
			}
		}, (err, response, body) => {
			this.parse(body).then(result => {
				resolve(result)
			})
			
		})
	})

}

module.exports = Article