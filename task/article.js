const request = require('request')
const cheerio = require('cheerio')
const ImageTask = require('./image.js')
const Entities = require('html-entities').XmlEntities

var Article = {}
var ArticleModel = global.sequelize.import('../models/article.js')

function sleep(ms){
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve()
        },ms)
    })
}

Article.data = {}
Article.parse = async function(context, info = {}){
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
	//下载内容中的图片
	var imageArr = []
	var imgs = $(".Mid2L_con img")
	imgs.each(async function(index,img){
		imageArr.push(ImageTask.saveImage($(img).attr("src")))
		await sleep(300)
	})

	//等待所有图片下载完成，然后替换
	var urls = await Promise.all(imageArr)
	urls.forEach((url ,index) => {
		content = content.replace($(imgs[index]).attr("src"), url)
	})
	info.content += content

	this.data = info
}

Article.load = function(url, page = 1){
	return new Promise((resolve, reject) => {
		request.get({
				url,
				headers: {
					"Host": "www.gamersky.com",
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36",
					"Referer": "https://www.gamersky.com/pcgame/",
					"Cache-Control": "max-age=0",
					"Connection": "keep-alive"
				},
				timeout: 5000
			}, (err, response, body) => {
				if(err){
					reject(`文章${url}爬取失败`)
					return
				}
				if(response.statusCode == 404 && page == 1){
					reject(`文章${url}页面不存在`)
					return
				}
				if(response.statusCode == 404 && page > 1){
					resolve(true)
					return
				}
				if(page > 1) console.log(`加载${this.data.title}第${page}页`);

				this.parse(body, this.data)
				if(page == 1){
					this.load(`${url.slice(0,url.lastIndexOf('.'))}_2${url.slice(url.lastIndexOf('.'))}`, 2).then(res => {
						if(res === true){
							resolve(true)
						}
					})
				} else {
					page += 1
					this.load(`${url.slice(0,url.lastIndexOf('.')-2)}_${page}${url.slice(url.lastIndexOf('.'))}`, page).then(res => {
						if(res === true){
							resolve(true)
						}
					})
				}
			})		
	})
}


Article.run = function(url){
	return new Promise((resolve, reject) => {
		this.load(url).then(res => {
			ArticleModel.create(this.data).then(article => {
				resolve(article)
			})
		})
	})
}

module.exports = Article