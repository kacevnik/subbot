const puppeteer = require('puppeteer');
const fs = require('fs');
let json = {};
let jsonElement = {};
let flag = true;

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log('   ____ ___ ______   ________ ______   ____     _______ ________')
console.log('  /   /   //      \\ /   /   //  __  \\ /   /    /   ___//   /   /')
console.log(' /      < /   /   //   /   //  __   //   /___ /   ___//   /   /')
console.log('/___/___/ \\______/ \\______//___/___//_______//______/ \\______/')


// async function getPic() {
// 		const browser = await puppeteer.launch({
// 			headless: false
// 		});
// 		const page = await browser.newPage();
// 		await page.setViewport({
// 			width: 1280,
// 			height: 768
// 		});

// 		let count = 1;

// 		await page.goto('https://yandex.ru');
// 		await page.focus('.input__control.input__input');
// 		await page.keyboard.type('Ломбарды в москве');
// 		await page.click('.suggest2-form__button');

// 		console.log('Жду 3 секунды');
// 		await page.waitFor(3 * 1000);

//         await page.click('ul.serp-list li:nth-child(3) a.organic__url');
//         await page.waitFor(2 * 1000);

//         // get all the currently open pages as an array
//         let pages = await browser.pages();

//         //await page.click('ul.serp-list li:nth-child(4) a.organic__url');

//         let address = await pages[2].evaluate((sel) => {
//             addressText = document.querySelector(sel);
//             if(!addressText){
//                 return false;
//             } else {
//                 return addressText.innerText;
//             }
            
//         }, 'h2.header__title');

//         console.log(address);

//         for (const page of pages) {
//             console.log(page.url())   // new page now appear!
//          }

//         await pages[2].close();

//         await page.click('ul.serp-list li:nth-child(6) a.organic__url');

			//   page.on("response", response => {
			//     const request = response.request();
			//     const url = request.url();
			//     const status = response.status();
			//     console.log("response data:", url, "status:", status, "data");

			//   });

			//await page.waitFor(2*1000);
			//await browser.close();
		// }

		// getPic();