const request = require('request')
const fs = require('fs')
const path = require('path')
var UUID = require('uuid')

var Image = {}

Image.path = path.resolve(__dirname, '../download/image/')

Image.saveImage = function(url){
	var filename = UUID.v1() + url.slice(url.lastIndexOf('.'))
	return new Promise((resolve, reject) => {
		var writable = fs.createWriteStream(`${this.path}/${filename}`)
		var readable = request(url,{timeout: 5000})
		readable.pipe(writable)
		writable.on('finish', () => {
			resolve(`/download/image/${filename}`)
		})
		writable.on('unpipe', ()=>{
			console.error('已移除可写流管道');
		})
		writable.on('error', ()=>{
			console.error(`保存图片${url}时出现错误`);
		})
		readable.on('error', ()=>{
			console.error(`下载图片${url}时出现错误`);
		})
	})
}

module.exports = Image