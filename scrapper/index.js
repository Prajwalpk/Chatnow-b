const fs = require('fs');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);

const URL = i => `https://help.nowfinance.com.au/hc/en-us/sections/115000538392-FAQ?page=${i}#articles`;
const noop = () => {};

const FAQ = new Set();

async function main() {
	console.log('Starting scrapper ... ');
	let browser = await puppeteer.launch();
	let page = await browser.newPage();

	for(let i=1; i < 5; i++) {
		console.log('Scrapping URL ...  ' + URL(i));
		await page.goto(URL(i));

		let html = await page.evaluate(_ => document.body.innerHTML);
		let $ = cheerio.load(html);

		let questions = [];

		$('.article-list-item ').each((i, el) => {
			let children = $(el).children();

			let question = {
				text: children.eq(0).text(),
				href: `https://help.nowfinance.com.au/` + children.eq(0).attr('href')
			}

			console.log('Adding faq ...  ' + question.text);

			questions.push(question);
		});	

		for(let question of questions) {
			let _page =  await browser.newPage();

			console.log('Scraping faq page ...  ' + question.href);
			await _page.goto(question.href);

			let content = await _page.evaluate(_ => document.body.innerHTML);
			let $$ = cheerio.load(content);

			let o = {
				...question,
				answer: $$('.article-body').text()
			}
			
			console.log('Content for faq page ...  ' + o.href + ' is added');

			FAQ.add(o);
		}
	}
}

async function writeToJSON() {
	let faq = [...FAQ];
	let file = await writeFileAsync('faq.json',  `{ "faqs": ${JSON.stringify(faq, null, 4)} }`)
}

main()
	.then(writeToJSON)
	.catch(err => console.log(err))
	.then(_ => {
		process.exit(0)
	})