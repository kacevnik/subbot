const puppeteer = require('puppeteer');
const fs = require('fs');
var datayt = require('./datayt.json');

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log('   ____ ___ ______   ________ ______   ____     _______ ________')
console.log('  /   /   //      \\ /   /   //  __  \\ /   /    /   ___//   /   /')
console.log(' /      < /   /   //   /   //  __   //   /___ /   ___//   /   /')
console.log('/___/___/ \\______/ \\______//___/___//_______//______/ \\______/')

const EMAIL = 'kacevnik@gmail.com';
const PASS  = 'G9564665g';
const SARCH = 'РОБЛОКС';
let sec = 0;
let min = 0;

var date = new Date();

//const CONTENT_SELECTOR = '#contents.style-scope.ytd-item-section-renderer >ytd-channel-renderer:nth-child(INDEX) ytd-subscribe-button-renderer > paper-button';
const CONTENT_SELECTOR = '#contents.style-scope.ytd-item-section-renderer >ytd-channel-renderer:nth-child(INDEX)';
let id = 'UCsL1izwykBfCf4THgR98E7w';
console.log(datayt.test);
console.log(date.getTime());
async function getDataSubes(){
	const browser = await puppeteer.launch({
		headless: false
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 1280,
		height: 768
	});

	await page.goto('https://youtube.com');

	console.log('Жду 3 секунды');
	await page.waitFor(3 * 1000);

	let count = 1;

	
	// await page.focus('.suggest__input._hiddenText');
	// await page.keyboard.type('Ломбарды в москве');
	

	console.log('Жду 3 секунды');
	await page.waitFor(3 * 1000);
	// let rayon = await page.evaluate((sel) => {
	// 	let rayonText = document.querySelector(sel);

	// 	if(!rayonText){
	// 		return false;
	// 	}else{
	// 		return rayonText.innerHTML;
	// 	}
	// }, '#buttons ytd-button-renderer');

	await page.click('#buttons ytd-button-renderer');

	console.log('Перешел на авторизацию и жду 3 секунды');
	await page.waitFor(5 * 1000);

	await page.focus('input[type=email]');
	await page.keyboard.type(EMAIL);

	await page.click('div[role=button]');

	await page.waitFor(3 * 1000);

	await page.focus('input[type=password]');
	await page.keyboard.type(PASS);

	await page.click('#passwordNext');

	await page.waitFor(3 * 1000);

	await page.focus('input#search');
	await page.keyboard.type(SARCH);
	
	await page.click('#search-icon-legacy');

	await page.waitFor(10 * 1000);

	await page.click('#container ytd-toggle-button-renderer a');
	await page.waitFor(1000);

	await page.click(`[title='С фильтром "Каналы"']`);
	await page.waitFor(1000);

	await page.click('#container ytd-toggle-button-renderer a');
	await page.waitFor(1000);

	await page.click(`[title="Упорядочить по дате загрузки"]`);
	await page.waitFor(1000);

	for (let index = 1; index < 4; index++) {
		let rayon = await page.evaluate((sel) => {
			let rayonText = document.querySelector(sel);
	
			if(!rayonText){
				return 1;
			}else{
				let text = rayonText.innerText;
				if(text.search(/ВЫ ПОДПИСАНЫ/gi) != -1) {
					return 2;
				}else{
					return 3;
				}
			}
		}, CONTENT_SELECTOR.replace('INDEX',index) + ' ytd-subscribe-button-renderer > paper-button');

		if(rayon == 3){
			await page.click(CONTENT_SELECTOR.replace('INDEX',index));
			timer = getRandomInt(3, 5);
			await page.waitFor(timer * 1000);
			sec = sec + timer
			min = Math.floor(sec/60);
			let res_sec = sec%60;
			console.log('Подписка № ' + count + '- Общее время ' + min + 'мин. ' + Math.floor(res_sec) + 'сек.');
			count++;
		}

		if(rayon == 2){
			let sub = await page.evaluate((sel) => {
				let subItem = document.querySelector(sel);
		
				if(!subItem){
					return 1;
				}else{
					linkSubItem = subItem.getAttribute('href').split('/')
					let idCnanel = linkSubItem[linkSubItem.length - 1];
					return idCnanel;
				}
			}, CONTENT_SELECTOR.replace('INDEX',index) + '>a');

			if(datayt[sub] != undefined && sub != 1){
				if(datayt[sub] != 333){
					console.log(datayt[sub]/1000 + 864000);
					if(datayt[sub]/1000 + 864000 <= date.getTime()/1000) {
						await page.waitFor(1000);
						await page.click(CONTENT_SELECTOR.replace('INDEX',index) + ' ytd-subscribe-button-renderer > paper-button');
					}else{
						await page.waitFor(1000);
						console.log(datayt[sub]/1000 + 864000);
						console.log(date.getTime()/1000);
						let subOverDay = Math.floor(( datayt[sub]/1000 + 864000 - date.getTime()/1000 )/86400);
						let subOverHor = Math.floor(( datayt[sub]/1000 + 864000 - date.getTime()/1000 )%86400/3600);
						console.log('Подписка на: ' + sub + ' - Закончиться через ' + subOverDay + ' дн. ' + subOverHor + ' ч.');
					}
				}
			}else{
				datayt[sub] = date.getTime();
				fs.writeFile('datayt.json', JSON.stringify(datayt), _ => console.log('Элемент добавлен в JSON'));
			}

		}

		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
	
	}
}

getDataSubes();

async function getPic() {
	const browser = await puppeteer.launch({
		headless: false
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 1280,
		height: 768
	});

	await page.goto('https://youtube.com');

	console.log('Жду 3 секунды');
	await page.waitFor(3 * 1000);

	let count = 1;

	
	// await page.focus('.suggest__input._hiddenText');
	// await page.keyboard.type('Ломбарды в москве');
	

	console.log('Жду 3 секунды');
	await page.waitFor(3 * 1000);
	// let rayon = await page.evaluate((sel) => {
	// 	let rayonText = document.querySelector(sel);

	// 	if(!rayonText){
	// 		return false;
	// 	}else{
	// 		return rayonText.innerHTML;
	// 	}
	// }, '#buttons ytd-button-renderer');

	await page.click('#buttons ytd-button-renderer');

	console.log('Перешел на авторизацию и жду 3 секунды');
	await page.waitFor(5 * 1000);

	await page.focus('input[type=email]');
	await page.keyboard.type(EMAIL);

	await page.click('div[role=button]');

	await page.waitFor(3 * 1000);

	await page.focus('input[type=password]');
	await page.keyboard.type(PASS);

	await page.click('#passwordNext');

	await page.waitFor(3 * 1000);

	await page.focus('input#search');
	await page.keyboard.type(SARCH);
	
	await page.click('#search-icon-legacy');

	await page.waitFor(10 * 1000);

	await page.click('#container ytd-toggle-button-renderer a');
	await page.waitFor(1000);

	await page.click(`[title='С фильтром "Каналы"']`);
	await page.waitFor(1000);

	await page.click('#container ytd-toggle-button-renderer a');
	await page.waitFor(1000);

	await page.click(`[title="Упорядочить по дате загрузки"]`);
	await page.waitFor(1000);

	for (let index = 1; index < 10000; index++) {
		let rayon = await page.evaluate((sel) => {
			let rayonText = document.querySelector(sel);
	
			if(!rayonText){
				return 1;
			}else{
				let text = rayonText.innerText;
				if(text.search(/ВЫ ПОДПИСАНЫ/gi) != -1) {
					return 2;
				}else{
					return 3;
				}
			}
		}, CONTENT_SELECTOR.replace('INDEX',index));
	

		//await page.keyboard.press('ArrowDown');

		if(rayon == 3){
			await page.click(CONTENT_SELECTOR.replace('INDEX',index));
			timer = getRandomInt(3, 5);
			await page.waitFor(timer * 1000);
			sec = sec + timer
			min = Math.floor(sec/60);
			let res_sec = sec%60;
			console.log('Подписка № ' + count + '- Общее время ' + min + 'мин. ' + Math.floor(res_sec) + 'сек.');
			count++;
		}

		if(rayon == 2){
			let sub = await page.evaluate((sel) => {
				let subItem = document.querySelector(sel);
		
				if(!subItem){
					return 1;
				}else{
					let subText = subItem.getAttribute('aria-label');
					return subText.replace('Отменить подписку на канал ', '');
				}
			}, CONTENT_SELECTOR.replace('INDEX',index));

			await page.waitFor(1000);
			sec = sec + 1;
			min = Math.floor(sec/60);
			let res_sec = sec%60;
			console.log('Уже подписан на: ' + sub + '- Общее время ' + min + 'мин. ' + Math.floor(res_sec) + 'сек.');
		}
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');

	}

}

//getPic();
