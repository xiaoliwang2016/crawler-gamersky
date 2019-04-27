const request = require('request')
const fs = require('fs')
const path = require('path')
var UUID = require('uuid')
const download = require('download');

var Image = {}

Image.path = path.resolve(__dirname, '../download/image/')

Image.saveImage = function(url){
	var filename = UUID.v1() + url.slice(url.lastIndexOf('.'))
	return new Promise((resolve, reject) => {
		console.log(url);
		
		var readable = request.get({
			url,
			headers: {
				"accept": "image/webp,image/apng,image/*,*/*;q=0.8",
				"accept-encoding": "gzip, deflate, br",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36",
				"Referer": "https://www.gamersky.com/pcgame/"
			},
			timeout: 5000
		})
		var writable = fs.createWriteStream(`${this.path}/${filename}`)
		readable.pipe(writable)
		writable.on('finish', () => {
			resolve(`/download/image/${filename}`)
		})
		writable.on('unpipe', ()=>{
			console.error('已移除可写流管道');
		})
		writable.on('error', ()=>{
			reject(`保存图片${url}时出现错误`);
		})
		readable.on('error', ()=>{
			reject(`下载图片${url}时出现错误`);
		})
	})
}

module.exports = Image