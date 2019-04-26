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
			//必须等待图片保存结束
			info.img =  await ImageTask.saveImage(bannerUrl)
			info.title = title
			info.descrption = entities.decode($(`li:nth-child(${i})`).find($(".con .txt")).text())
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

	// var content = ({"status":"ok","totalPages":8387,"body":"\r\n                \r\n              \r\n\r\n                                     <li>\r\n\t\t\t\t\t\n                     <div class=\"img\"><a href=\"https://www.gamersky.com/news/201904/1175821.shtml\" target=\"_blank\" title=\"《Apex》Twitch收视人数大幅下滑 跌破前十只差一步\"><img src=\"https://imgs.gamersky.com/upimg/2019/201904221601499417.jpg\" alt=\"《Apex》Twitch收视人数大幅下滑 跌破前十只差一步\"  width=\"200\" height=\"110\" class=\"pe_u_thumb\" border=\"0\"></a></div>\n                  \r\n                                        <div class=\"con\">\r\n\t\t\t\t\t  <div class=\"tit\"><a href=\"https://www.gamersky.com/news/201904/1175821.shtml\" target=\"_blank\" title=\"{《Apex英雄》Twitch收视人数大幅下滑 跌破前十只差一步}\">《Apex》Twitch收视人数大幅下滑 跌破前十只差一步</a></div>\r\n\t\t\t\t\t  <div class=\"txt\">《Apex英雄》爆红之后，如今的收视情况却不见良好，在线观看人数离跌破前十只一步之遥。</div>\r\n\t\t\t\t\t  <div class=\"tme2\">\r\n\t\t\t\t\t    <div class=\"time\">2019-04-22 16:38</div>\r\n\t\t\t\t\t    <div class=\"visit gshit\" data-gid=\"1175821\">1913</div>\r\n\t\t\t\t\t    <div class=\"pls cy_comment\" data-sid=\"1175821\"></div>\r\n\t\t\t\t\t  </div>\r\n\t\t\t\t\t</div>\r\n                                     </li>\r\n\r\n                                     <li>\r\n\t\t\t\t\t\n                     <div class=\"img\"><a href=\"https://www.gamersky.com/news/201904/1175787.shtml\" target=\"_blank\" title=\"Fami通读者投票平成最佳游戏 《塞尔达》排名第二\"><img src=\"https://imgs.gamersky.com/upimg/2019/201904221536078377.jpg\" alt=\"Fami通读者投票平成最佳游戏 《塞尔达》排名第二\"  width=\"200\" height=\"110\" class=\"pe_u_thumb\" border=\"0\"></a></div>\n                  \r\n                                        <div class=\"con\">\r\n\t\t\t\t\t  <div class=\"tit\"><a href=\"https://www.gamersky.com/news/201904/1175787.shtml\" target=\"_blank\" title=\"{Fami通杂志读者投票平成年代最佳游戏 《塞尔达传说：旷野之息》排名第二}\">Fami通读者投 票平成最佳游戏 《塞尔达》排名第二</a></div>\r\n\t\t\t\t\t  <div class=\"txt\">近日，Fami通杂志发布了“平成年代最佳游戏”调查问卷，荣获第一名的是95年《超时空之轮》，《塞尔达传说：旷野之息》排第二。</div>\r\n\t\t\t\t\t  <div class=\"tme2\">\r\n\t\t\t\t\t    <div class=\"time\">2019-04-22 16:05</div>\r\n\t\t\t\t\t    <div class=\"visit gshit\" data-gid=\"1175787\">8971</div>\r\n\t\t\t\t\t    <div class=\"pls cy_comment\" data-sid=\"1175787\"></div>\r\n\t\t\t\t\t  </div>\r\n\t\t\t\t\t</div>\r\n                                     </li>\r\n\r\n                                     <li>\r\n\t\t\t\t\t\n                     <div class=\"img\"><a href=\"https://www.gamersky.com/news/201904/1175778.shtml\" target=\"_blank\" title=\"动作益智《噗哟噗哟eSports》将出实体版 6.27发售\"><img src=\"https://imgs.gamersky.com/upimg/2019/201904221519405062.jpg\" alt=\"动作益智《噗哟噗哟eSports》将出实体版 6.27发售\"  width=\"200\" height=\"110\" class=\"pe_u_thumb\" border=\"0\"></a></div>\n                  \r\n                                        <div class=\"con\">\r\n\t\t\t\t\t  <div class=\"tit\"><a href=\"https://www.gamersky.com/news/201904/1175778.shtml\" target=\"_blank\" title=\"{《魔法气泡eSports》将出实体中文版 6月27日发售登陆PS4/NS}\">动作益智《噗哟噗哟eSports》将出实体版 6.27发售</a></div>\r\n\t\t\t\t\t  <div class=\"txt\">世嘉经典动作益智游戏「魔法气泡eSports」将于6月27日推出PS4/NS实体版。</div>\r\n\t\t\t\t\t  <div class=\"tme2\">\r\n\t\t\t\t\t    <div class=\"time\">2019-04-22 15:52</div>\r\n\t\t\t\t\t    <div class=\"visit gshit\" data-gid=\"1175778\">1625</div>\r\n\t\t\t\t\t    <div class=\"pls cy_comment\" data-sid=\"1175778\"></div>\r\n\t\t\t\t\t  </div>\r\n\t\t\t\t\t</div>\r\n                                     </li>\r\n\r\n                                     <li>\r\n\t\t\t\t\t\n                     <div class=\"img\"><a href=\"https://www.gamersky.com/news/201904/1175750.shtml\" target=\"_blank\" title=\"《尼尔》粉丝玩游戏找到妹子 横尾太郎整个人都酸了\"><img src=\"https://imgs.gamersky.com/upimg/2019/201904221511523572.jpg\" alt=\"《尼尔》粉丝玩游戏找到妹子 横尾太郎整个人都酸了\"  width=\"200\" height=\"110\" class=\"pe_u_thumb\" border=\"0\"></a></div>\n                  \r\n                                        <div class=\"con\">\r\n\t\t\t\t\t  <div class=\"tit\"><a href=\"https://www.gamersky.com/news/201904/1175750.shtml\" target=\"_blank\" title=\"{《尼尔：机械纪元》粉丝玩游戏找到妹子 横尾太郎整个人都“酸了”}\">《尼尔》粉丝玩游戏找到妹子 横尾太郎整个人都酸了</a></div>\r\n\t\t\t\t\t  <div class=\"txt\">最近，推特上一位粉丝@并感谢了横尾太郎，他表示自己因为《尼尔：机械纪元》而找到了女朋友。</div>\r\n\t\t\t\t\t  <div class=\"tme2\">\r\n\t\t\t\t\t    <div class=\"time\">2019-04-22 15:47</div>\r\n\t\t\t\t\t    <div class=\"visit gshit\" data-gid=\"1175750\">18880</div>\r\n\t\t\t\t\t    <div class=\"pls cy_comment\" data-sid=\"1175750\"></div>\r\n\t\t\t\t\t  </div>\r\n\t\t\t\t\t</div>\r\n                                     </li>\r\n\r\n                                     <li>\r\n\t\t\t\t\t\n                     <div class=\"img\"><a href=\"https://www.gamersky.com/handbook/201904/1175795.shtml\" target=\"_blank\" title=\"《纪元1800》战役玩法视频攻略\"><img src=\"https://imgs.gamersky.com/pic/2019/20190416_my_227_8.jpg\" alt=\"《纪元1800》战役玩法视频攻略\"  width=\"200\" height=\"110\" class=\"pe_u_thumb\" border=\"0\"></a></div>\n                  \r\n                                        <div class=\"con\">\r\n\t\t\t\t\t  <div class=\"tit\"><a href=\"https://www.gamersky.com/handbook/201904/1175795.shtml\" target=\"_blank\" title=\"{《纪元1800》视频攻略 战役玩法视频攻略}\">《纪元1800》战役玩法视频攻略</a></div>\r\n\t\t\t\t\t  <div class=\"txt\">《纪元1800》战役模式虽说是教学关，但上手难度并不低，尤其是任务、建筑布局及后期运营上，大家可能会遇到各方面的困扰，下面是“NovaTang”分享的《纪元1800》战役玩法视频攻略，助各位顺利过关。</div>\r\n\t\t\t\t\t  <div class=\"tme2\">\r\n\t\t\t\t\t    <div class=\"time\">2019-04-22 15:43</div>\r\n\t\t\t\t\t    <div class=\"visit gshit\" data-gid=\"1175795\">62</div>\r\n\t\t\t\t\t    <div class=\"pls cy_comment\" data-sid=\"1175795\"></div>\r\n\t\t\t\t\t  </div>\r\n\t\t\t\t\t</div>\r\n                                     </li>\r\n\r\n                                     <li>\r\n\t\t\t\t\t\n                     <div class=\"img\"><a href=\"https://www.gamersky.com/news/201904/1175776.shtml\" target=\"_blank\" title=\"《真三8》新DLC中文预告 假想剧本曹丕欲统一天下\"><img src=\"https://imgs.gamersky.com/upimg/2019/201904221517193726.jpg\" alt=\"《真三8》新DLC中文预告 假想剧本曹丕欲统一天下\"  width=\"200\" height=\"110\" class=\"pe_u_thumb\" border=\"0\"></a></div>\n                  \r\n                                        <div class=\"con\">\r\n\t\t\t\t\t  <div class=\"tit\"><a href=\"https://www.gamersky.com/news/201904/1175776.shtml\" target=\"_blank\" title=\"{《真三国无双8》新DLC中文预告 假想剧本曹丕欲统一天下}\">《真三8》新DLC中文预告 假想剧本曹丕欲统一天下</a></div>\r\n\t\t\t\t\t  <div class=\"txt\">根据台湾光荣特库摩官方消息，《真三国无双8》将于2019年4月25日发布付费DLC《追加IF剧本组合》第2弹</div>\r\n\t\t\t\t\t  <div class=\"tme2\">\r\n\t\t\t\t\t    <div class=\"time\">2019-04-22 15:40</div>\r\n\t\t\t\t\t    <div class=\"visit gshit\" data-gid=\"1175776\">6169</div>\r\n\t\t\t\t\t    <div class=\"pls cy_comment\" data-sid=\"1175776\"></div>\r\n\t\t\t\t\t  </div>\r\n\t\t\t\t\t</div>\r\n                                     </li>\r\n\r\n                                     <li>\r\n\t\t\t\t\t\n                     <div class=\"img\"><a href=\"https://www.gamersky.com/hardware/201904/1175782.shtml\" target=\"_blank\" title=\"声卡巨头又一新作 售699的H6游戏耳机值得买吗？\"><img src=\"https://imgs.gamersky.com/upimg/2019/201904221535109116.jpg\" alt=\"声卡巨头又一新作 售699的H6游戏耳机值得买吗？\"  width=\"200\" height=\"110\" class=\"pe_u_thumb\" border=\"0\"></a></div>\n                  \r\n                                        <div class=\"con\">\r\n\t\t\t\t\t  <div class=\"tit\"><a href=\"https://www.gamersky.com/hardware/201904/1175782.shtml\" target=\"_blank\" title=\"{声卡巨头“创新科技”的又一新作 售699的Sound BlasterX H6游戏耳机值得买吗？}\">声卡巨头又一新作 售699的H6游戏耳机值得买吗？</a></div>\r\n\t\t\t\t\t  <div class=\"txt\">最新的Sound BlasterX H6究竟在游戏和音乐方面表现如何？让我们一起来看一下吧！</div>\r\n\t\t\t\t\t  <div class=\"tme2\">\r\n\t\t\t\t\t    <div class=\"time\">2019-04-22 15:23</div>\r\n\t\t\t\t\t    <div class=\"visit gshit\" data-gid=\"1175782\">150</div>\r\n\t\t\t\t\t    <div class=\"pls cy_comment\" data-sid=\"1175782\"></div>\r\n\t\t\t\t\t  </div>\r\n\t\t\t\t\t</div>\r\n                                     </li>\r\n\r\n                                     <li>\r\n\t\t\t\t\t\n                     <div class=\"img\"><a href=\"https://www.gamersky.com/news/201904/1175721.shtml\" target=\"_blank\" title=\"DC新游戏《法外者》曝光 红头罩登场、或登陆Epic\"><img src=\"https://imgs.gamersky.com/upimg/2019/201904221441033362.jpg\" alt=\"DC新游戏《法外者》曝光 红头罩登场、或登陆Epic\"  width=\"200\" height=\"110\" class=\"pe_u_thumb\" border=\"0\"></a></div>\n                  \r\n                                        <div class=\"con\">\r\n\t\t\t\t\t  <div class=\"tit\"><a href=\"https://www.gamersky.com/news/201904/1175721.shtml\" target=\"_blank\" title=\"{DC新游戏《法外者（Outlaws）》曝光 蝙蝠侠门徒登场、或登陆Epic}\">DC新游 戏《法外者》曝光 红头罩登场、或登陆Epic</a></div>\r\n\t\t\t\t\t  <div class=\"txt\">今日4chan曝光了一张海报，显示一款名 为《Outlaws》（暂译：法外者）的DC漫画改编新游戏。</div>\r\n\t\t\t\t\t  <div class=\"tme2\">\r\n\t\t\t\t\t    <div class=\"time\">2019-04-22 14:46</div>\r\n\t\t\t\t\t    <div class=\"visit gshit\" data-gid=\"1175721\">12599</div>\r\n\t\t\t\t\t    <div class=\"pls cy_comment\" data-sid=\"1175721\"></div>\r\n\t\t\t\t\t  </div>\r\n\t\t\t\t\t</div>\r\n                                     </li>\r\n\r\n                                     <li>\r\n\t\t\t\t\t\n                     <div class=\"img\"><a href=\"https://www.gamersky.com/news/201904/1175709.shtml\" target=\"_blank\" title=\"《只狼》明日更 新：仙峰脚削弱 神之飞雪掉率提高\"><img src=\"https://imgs.gamersky.com/upimg/2019/201904221231528012.jpg\" alt=\"《只狼 》明日更新：仙峰脚削弱 神之飞雪掉率提高\"  width=\"200\" height=\"110\" class=\"pe_u_thumb\" border=\"0\"></a></div>\n                  \r\n                                        <div class=\"con\">\r\n\t\t\t\t\t  <div class=\"tit\"><a href=\"https://www.gamersky.com/news/201904/1175709.shtml\" target=\"_blank\" title=\"{《只狼：影逝二度》明日更新：仙峰脚削弱 神之飞雪掉率提高}\">《只狼》明日更新：仙峰脚削弱 神之飞雪掉率提高</a></div>\r\n\t\t\t\t\t  <div class=\"txt\">《只狼 ：影逝二度》官网今日发布了1.03版本的更新公告，此次更新将于北京时间4月23日早上9：00上线。</div>\r\n\t\t\t\t\t  <div class=\"tme2\">\r\n\t\t\t\t\t    <div class=\"time\">2019-04-22 12:51</div>\r\n\t\t\t\t\t    <div class=\"visit gshit\" data-gid=\"1175709\">43350</div>\r\n\t\t\t\t\t    <div class=\"pls cy_comment\" data-sid=\"1175709\"></div>\r\n\t\t\t\t\t  </div>\r\n\t\t\t\t\t</div>\r\n                                     </li>\r\n\r\n                                     <li>\r\n\t\t\t\t\t\n                     <div class=\"img\"><a href=\"https://www.gamersky.com/news/201904/1175637.shtml\" target=\"_blank\" title=\"大神用虚幻4重制《网络奇兵2》场景 画面风格绝赞\"><img src=\"https://imgs.gamersky.com/upimg/2019/201904221044303878.jpg\" alt=\"大神用虚幻4重制《网络奇兵2》场景 画面风格绝赞\"  width=\"200\" height=\"110\" class=\"pe_u_thumb\" border=\"0\"></a></div>\n                  \r\n                                        <div class=\"con\">\r\n\t\t\t\t\t  <div class=\"tit\"><a href=\"https://www.gamersky.com/news/201904/1175637.shtml\" target=\"_blank\" title=\"{大神用虚幻4重制《网络奇兵2》场景 画面风格绝赞}\">大神用虚幻4重制《网络奇兵2》场景 画面风格绝赞</a></div>\r\n\t\t\t\t\t  <div class=\"txt\">大锤工作室的环境艺术家Sami Bashir最近利用虚幻4引擎，对经典游戏《网络奇兵2》的一处场景进行了重制。</div>\r\n\t\t\t\t\t  <div class=\"tme2\">\r\n\t\t\t\t\t    <div class=\"time\">2019-04-22 12:39</div>\r\n\t\t\t\t\t    <div class=\"visit gshit\" data-gid=\"1175637\">8350</div>\r\n\t\t\t\t\t    <div class=\"pls cy_comment\" data-sid=\"1175637\"></div>\r\n\t\t\t\t\t  </div>\r\n\t\t\t\t\t</div>\r\n                                     </li>\r\n\r\n                                     <li>\r\n\t\t\t\t\t\n                     <div class=\"img\"><a href=\"https://www.gamersky.com/news/201904/1175624.shtml\" target=\"_blank\" title=\"《只狼》武器元素伤害MOD 装上你就是苇名最酷的人\"><img src=\"https://imgs.gamersky.com/upimg/2019/201904221028082824.jpg\" alt=\"《只狼》武器元素伤害MOD 装上你就是苇名最酷的人\"  width=\"200\" height=\"110\" class=\"pe_u_thumb\" border=\"0\"></a></div>\n                  \r\n                                        <div class=\"con\">\r\n\t\t\t\t\t  <div class=\"tit\"><a href=\"https://www.gamersky.com/news/201904/1175624.shtml\" target=\"_blank\" title=\"{《只狼：影逝二度》武器元素伤害MOD 装上你就是苇名最酷的人}\">《只狼》武器元素伤害MOD 装上 你就是苇名最酷的人</a></div>\r\n\t\t\t\t\t  <div class=\"txt\">有MOD作者为《只狼：影逝二度》打造了一款元素武器伤害MOD， 它让你的主角的武士刀能够注入五种元素力量buff，攻击敌人简直炫酷爆表。</div>\r\n\t\t\t\t\t  <div class=\"tme2\">\r\n\t\t\t\t\t    <div class=\"time\">2019-04-22 12:27</div>\r\n\t\t\t\t\t    <div class=\"visit gshit\" data-gid=\"1175624\">24016</div>\r\n\t\t\t\t\t    <div class=\"pls cy_comment\" data-sid=\"1175624\"></div>\r\n\t\t\t\t\t  </div>\r\n\t\t\t\t\t</div>\r\n                                     </li>\r\n<!-- ParserInfo: Processed in 1.2976445 second(s) Ticks:2407738 -->"});
	// this.parse(content.body)
}

module.exports = News
