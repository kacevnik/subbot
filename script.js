const puppeteer = require('puppeteer');
const fs = require('fs');
let json = {};
let jsonElement = {};
let flag = true;

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function getPic() {
		const browser = await puppeteer.launch({
			headless: true
		});
		const page = await browser.newPage();
		await page.setViewport({
			width: 1280,
			height: 768
		});

		let count = 1;

		await page.goto('https://2gis.ru');
		await page.focus('.suggest__input._hiddenText');
		await page.keyboard.type('Ломбарды в москве');
		await page.click('.searchBar__submit._directory');

		console.log('Жду 3 секунды');
		await page.waitFor(3 * 1000);

		COUNT_ITEMS_SELECTOR = '.searchResults__headerName';
		let countItems = await page.evaluate((sel) => {
			let countItemsText = document.querySelector(sel).innerText;
			let resultCountHtml = countItemsText.replace('организаций', '').trim();
			return resultCountHtml;
		}, COUNT_ITEMS_SELECTOR);

		console.log('Обнаружено элементов: ' + countItems + ' элементов');

		while (flag) {
			const LIST_ITEM_SELECTOR = '.miniCard__content';
			let listLength = await page.evaluate((sel) => {
				return document.querySelectorAll(sel).length;
			}, LIST_ITEM_SELECTOR);

			console.log("Количество элементов на странице: " + listLength);

			const NEXT_PAGE_SELECTOR = '.pagination__arrow._right';
			const DISABLED = '.pagination__arrow._right._disabled';

			const ELEMENT_ITEM_SELECTOR = '.searchResults__list > article:nth-child(INDEX)';
			const ELEMENT_ITEM_SELECTOR_TITLE = '.searchResults__list > article:nth-child(INDEX) > div > header > h3';
			const ELEMENT_ITEM_SELECTOR_ID = '.searchResults__list > article:nth-child(INDEX) > div > header > h3 > a';

			for (let i = 1; i <= listLength; i++) {

				jsonElement = {};

				let sec = getRandomInt(3, 7);
				await page.waitFor(1 * 1000);
				let idTitleElementInList = ELEMENT_ITEM_SELECTOR_TITLE.replace('INDEX', i);
				let titleElementInList = await page.evaluate((sel) => {
					return document.querySelector(sel).innerText;
				}, idTitleElementInList);

				let idFirmSelector = ELEMENT_ITEM_SELECTOR_ID.replace('INDEX', i);

				let idFirm = await page.evaluate((sel) => {
					let idsFitms = document.querySelector(sel).getAttribute('href').split('/');
					return idsFitms[idsFitms.length - 1];
				}, idFirmSelector);

				jsonElement.title = {
					name: titleElementInList,
					id: idFirm
				}

				await page.waitFor(sec * 1000);
				console.log('Открываю: ' + count++ + '/' + countItems + ' - ' + ' после ' + sec + ' сек. ' + titleElementInList);
				console.log('------------------------------------------------------');
				console.log('ID Фирмы: ' + idFirm);
				await page.click(ELEMENT_ITEM_SELECTOR.replace("INDEX", i));
				await page.waitFor(2 * 1000);

				const ELEMENT_ADDRESS_SELECTOR = '.card__addressPart';

				//Получаем адрес
				let address = await page.evaluate((sel) => {
					addressText = document.querySelector(sel);
					if(!addressText){
						return false;
					} else {
						return document.querySelector(sel).innerText;
					}
					
				}, ELEMENT_ADDRESS_SELECTOR);

				console.log('Адрес: ' + address);

				jsonElement.address = address;

				//Получаем координаты
				const ELEMENT_COORDS_SELECTOR = '.card__section._geo .card__address';
				await page.waitFor(1 * 1000);
				let coords = await page.evaluate((sel) => {
					let lat,lon;
					let latItem = document.querySelector(sel);
					if(latItem.getAttribute('data-lat')){
						lat = latItem.getAttribute('data-lat');
					} else {
						lat = false;
					}
					let lonItem = document.querySelector(sel);
					if(latItem.getAttribute('data-lon')){
						lon = lonItem.getAttribute('data-lon');
					} else {
						lon = false;
					}
					if(lat && lon){
						return lat + ',' + lon;
					}
					return false;
					
				}, ELEMENT_COORDS_SELECTOR);

				console.log('Коородинаты: ' + coords);

				jsonElement.coords = coords;

				//Получаем район
				const ELEMENT_RAYON_SELECTOR = '.card__addressDrilldown';

				let rayon = await page.evaluate((sel) => {
					let rayonItem = document.querySelector(sel);

					if(!rayonItem){
						return false;
					} else{
						let rayonText = rayonItem.innerText;
						rayon = rayonText.search(/Москва/gi);
						if (rayon !== -1) {
							return rayonText.replace(/район,| Москва/gm, "").trim();
						} else {
							return false;
						}
					}

				}, ELEMENT_RAYON_SELECTOR);

				console.log('Район: ' + rayon);

				jsonElement.rayon = rayon;

				const ELEMENT_FILIALS_SELECTOR = '.card__filials > a';

				//Филилалы
				let filials = await page.evaluate((sel) => {
					let branch = document.querySelector(sel);

					if (!branch) {
						return {
							idBranch: 0,
							countBranch: 0
						}
					} else {
						let branchArray = branch.getAttribute('href').split('/');
						let countBranchText = document.querySelector(sel).innerText;
						let countBranch = countBranchText.replace(/филиалов|филиала|филиал/gm, '').trim();
						return {
							idBranch: branchArray[branchArray.length - 1],
							countBranch: countBranch
						}
					}

				}, ELEMENT_FILIALS_SELECTOR);

				console.log('Ветка Филиалов: ' + filials.idBranch + ' (' + filials.countBranch + ')');

				jsonElement.filials = {
					id: filials.idBranch,
					count: filials.countBranch
				}

				//Время работы
				let work = await page.evaluate((sel) => {
					let workText = document.querySelector(sel);

					if (!workText) {
						return false;
					} else {
						workText = workText.innerText;
						return workText.replace('Сегодня', 'Ежедневно').trim();
					}

				}, '.schedule__statusText');

				console.log('Режим работы: ' + work);

				jsonElement.work = work;

				//телефон
				let phone = await page.evaluate((sel) => {
					let phonwText = document.querySelector(sel);

					if (!phonwText) {
						return false;
					} else {
						return phonwText.innerText;
					}

				}, '.contact__phonesVisible .contact__phonesItem._type_phone a .contact__phonesItemLinkNumber');

				console.log('Телефон: ' + phone);

				jsonElement.phone = phone;

				//Ссылка
				let link = await page.evaluate((sel) => {
					let linkText = document.querySelector(sel);

					if (!linkText) {
						return false;
					} else {
						return linkText.innerText;
					}

				}, '.link.contact__linkText');

				console.log('Ссылка: ' + link);

				jsonElement.link = link;

				//Метро
				let metro = await page.evaluate((sel) => {
					let distans;
					let metroText = document.querySelector(sel);
					let metroDistans = document.querySelector('span.cardNearStops__comment');
					if (!metroText) {
						return false;
					} else {
						let metroId = metroText.getAttribute('href').split('/');
						let id = metroId[metroId.length - 1];
						let metroName = metroText.innerText;
						if (!metroDistans) {
							distans = false;
						} else {
							distans = metroDistans.innerText.replace('—', '').trim();
						}

						return {
							id: id,
							name: metroName,
							dis: distans
						}
					}

				}, '[data-type="metro"]');

				console.log('Метро: ' + metro.name + ' ' + metro.dis + ' (' + metro.id + ')');

				jsonElement.metro = {
					name: metro.name,
					id: metro.id,
					dist: metro.dis
				}

				console.log('------------------------------------------------------');
				
				if(rayon){
					json[count] = jsonElement;

					fs.writeFile('lombardy.json', JSON.stringify(json), _ => console.log('Элемент добавлен в JSON'));
				}

				if(i == listLength){
					i = 1;
					let disabled = await page.evaluate((sel) => {
						let disabledItem = document.querySelector(sel);
	
						if (!disabledItem) {
							return false;
						} else {
							return true;
						}
	
					}, DISABLED);

					if(disabled){
						flag = false;
						await browser.close();
					}else{
						i = 1;
						await page.click(NEXT_PAGE_SELECTOR);
					}
				}
			}
		}

			//   page.on("response", response => {
			//     const request = response.request();
			//     const url = request.url();
			//     const status = response.status();
			//     console.log("response data:", url, "status:", status, "data");

			//   });

			//await page.waitFor(2*1000);
			//await browser.close();
		}

		getPic();