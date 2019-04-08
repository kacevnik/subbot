const puppeteer = require('puppeteer');
const fs = require('fs');
var datayt = require('./datayt.json');

console.log('   ____ ___ ______   ________ ______   ____     _______ ________')
console.log('  /   /   //      \\ /   /   //  __  \\ /   /    /   ___//   /   /')
console.log(' /      < /   /   //   /   //  __   //   /___ /   ___//   /   /')
console.log('/___/___/ \\______/ \\______//___/___//_______//______/ \\______/')

const EMAIL  = 'kacevnik@gmail.com';
const PASS   = 'G9564665g';
//const SEARCH = 'РОБЛОКС';
//const SEARCH = 'Roblox';
const SEARCH = 'Егор';
const URL    = 'https://youtube.com';

let sec = 0;
let min = 0;
let count = 1;

var date = new Date();

const CONTENT_SELECTOR = '#contents.style-scope.ytd-item-section-renderer >ytd-channel-renderer:nth-child(INDEX)';

//Функция получения времени выполнения скрипта
function getTimeScript (sec){
	min = Math.floor(sec/60);
	let res_sec = sec%60;
	return 'Время скрипта: ' + min + 'мин. ' + Math.floor(res_sec) + 'сек.';
}

//Функция получения случайного числа
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Главная функция
async function getDataSubes(){
	const browser = await puppeteer.launch({
		headless: false
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 1280,
		height: 768
	});

	await page.goto(URL);

	console.log('Защел на ' + URL + '. Жду 5 секунды');
	await page.waitFor(5 * 1000);
	sec = sec + 5;
	console.log('----------------- ' + getTimeScript (sec) + ' ------------------');

	await page.click('#buttons ytd-button-renderer');

	console.log('Перешел на авторизацию и жду 5 секунды');
	await page.waitFor(5 * 1000);
	sec = sec + 5;
	console.log('----------------- ' + getTimeScript (sec) + ' ------------------');

	await page.focus('input[type=email]');
	await page.keyboard.type(EMAIL);
	await page.click('div[role=button]');
	console.log('Ввел Email и жду 3 секенды');
	await page.waitFor(3 * 1000);
	sec = sec + 3;
	console.log('----------------- ' + getTimeScript (sec) + ' ------------------');

	await page.focus('input[type=password]');
	await page.keyboard.type(PASS);
	await page.click('#passwordNext');
	console.log('Ввел Пароль и жду 3 секенды');
	await page.waitFor(3 * 1000);
	sec = sec + 3;
	console.log('----------------- ' + getTimeScript (sec) + ' ------------------');

	await page.focus('input#search');
	await page.keyboard.type(SEARCH);
	await page.click('#search-icon-legacy');
	console.log('Ввел Поисковой запрос: ' + SEARCH + ' и жду 10 секунд');
	await page.waitFor(10 * 1000);
	sec = sec + 10;
	console.log('----------------- ' + getTimeScript (sec) + ' ------------------');

	await page.click('#container ytd-toggle-button-renderer a');
	await page.waitFor(1000);

	await page.click(`[title='С фильтром "Каналы"']`);
	await page.waitFor(1000);

	await page.click('#container ytd-toggle-button-renderer a');
	await page.waitFor(1000);

	await page.click(`[title="Упорядочить по дате загрузки"]`);
	await page.waitFor(1000);

	console.log('Произвел фильтрацию начинаем сканирование');
	sec = sec + 4;
	console.log('----------------- ' + getTimeScript (sec) + ' ------------------');

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
		}, CONTENT_SELECTOR.replace('INDEX',index) + ' ytd-subscribe-button-renderer > paper-button');

		let paper = await page.evaluate((sel) => {
			let paparItem = document.querySelector(sel);
	
			if(!paparItem){
				return false;
			}else{
				return true
			}
		}, 'paper-dialog');

		if(rayon == 3){
			let chanel = await page.evaluate((sel) => {
				let chanelItem = document.querySelector(sel);
		
				if(!chanelItem){
					return false;
				}else{
					let chanelText = chanelItem.getAttribute('aria-label');
					return chanelText.replace('Оформить подписку на канал ', '');
				}
			}, CONTENT_SELECTOR.replace('INDEX',index) + ' ytd-subscribe-button-renderer > paper-button');

			let subSub = await page.evaluate((sel) => {
				let subItem = document.querySelector(sel);
		
				if(!subItem){
					return 1;
				}else{
					linkSubItem = subItem.getAttribute('href').split('/')
					let idCnanel = linkSubItem[linkSubItem.length - 1];
					return idCnanel;
				}
			}, CONTENT_SELECTOR.replace('INDEX',index) + '>a');

			if(subSub != 1){
				if(!paper){
					if(datayt[subSub] == undefined || datayt[subSub] <= date.getTime() ){
						await page.click(CONTENT_SELECTOR.replace('INDEX',index) + ' ytd-subscribe-button-renderer > paper-button');
						timer = getRandomInt(3, 5);
						await page.waitFor(timer * 1000);
						sec = sec + timer
						datayt[subSub] = date.getTime();
						fs.writeFile('datayt.json', JSON.stringify(datayt), _ => console.log('*Подписка №' + count + ' на канал: ' + chanel));
						count++;
						console.log('----------------- ' + getTimeScript (sec) + ' ------------------');
					}else{
						await page.waitFor(1 * 1000);
						sec++;
						console.log('*Уже был подписан на этот канал!!!');
						console.log('----------------- ' + getTimeScript (sec) + ' ------------------');
					}
				}else{
					await page.waitFor(1 * 1000);
					sec++;
					console.log('****Внимание закончен лимит подписок!****');
					console.log('----------------- ' + getTimeScript (sec) + ' ------------------');
				}
			}
		}

		if(rayon == 2){
			let chanel = await page.evaluate((sel) => {
				let chanelItem = document.querySelector(sel);
		
				if(!chanelItem){
					return false;
				}else{
					let chanelText = chanelItem.getAttribute('aria-label');
					return chanelText.replace('Отменить подписку на канал ', '');
				}
			}, CONTENT_SELECTOR.replace('INDEX',index)  + ' ytd-subscribe-button-renderer > paper-button');

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
					if(datayt[sub]/1000 + 864000 <= date.getTime()/1000) {
						await page.waitFor(1000);
						sec++;
						await page.click(CONTENT_SELECTOR.replace('INDEX',index) + ' ytd-subscribe-button-renderer > paper-button');
						await page.waitFor(1000);
						sec++;
						await page.click('#confirm-button');
						await page.waitFor(1000);
						datayt[sub] = date.getTime() + 25920000000;
						fs.writeFile('datayt.json', JSON.stringify(datayt), _ => console.log('*Отписался от пользователя: ' + chanel));
						sec++;
						await page.waitFor(1000);
						sec++;
						console.log('----------------- ' + getTimeScript (sec) + ' ------------------');
					}else{

						let subOverDay = Math.floor(( datayt[sub]/1000 + 864000 - date.getTime()/1000 )/86400);
						let subOverHor = Math.floor(( datayt[sub]/1000 + 864000 - date.getTime()/1000 )%86400/3600);
						console.log('*Подписка на: ' + chanel + ' - Закончиться через ' + subOverDay + ' дн. ' + subOverHor + ' ч.');
						await page.waitFor(1000);
						sec++;
						console.log('----------------- ' + getTimeScript (sec) + ' ------------------');
					}
				}
			}else{
				datayt[sub] = date.getTime();
				fs.writeFile('datayt.json', JSON.stringify(datayt), _ => console.log('*Элемент ' + chanel + ' добавлен в JSON'));
				await page.waitFor(1000);
				sec++;
				console.log('----------------- ' + getTimeScript (sec) + ' ------------------');
			}

		}

		let remove = await page.evaluate((sel) => {
			let removeItem = document.querySelector(sel);
	
			if(!removeItem){
				return false;
			}else{
				removeItem.remove();
			}
		}, 'iron-dropdown');

		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
	
	}
}

getDataSubes();
