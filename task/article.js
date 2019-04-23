const request = require('request')
const cheerio = require('cheerio')
const ImageTask = require('./image.js')
const Entities = require('html-entities').XmlEntities
var Article = {}

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
	info.views =  $("#countn").text()
	info.follow =  $(".supportMe span").html()

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

	return info
}

Article.run = function(url){
	return new Promise((resolve, reject) => {
		request.get(url, (err, response, body) => {
			resolve(this.parse(body))
		})
	})

}

module.exports = Article