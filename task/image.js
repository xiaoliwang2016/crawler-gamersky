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
		request(url).pipe(writable)
		writable.on('finish', () => {
			resolve(`/download/image/${filename}`)
		})
	})
}

module.exports = Image