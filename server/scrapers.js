const e = require("express");
const faker = require("faker");
const puppeteer = require("puppeteer");

const fakeScraper = (locationId, store) => {
	return {
		locationId,
		uuid: faker.random.uuid(),
		name: "Oatly",
		price: faker.commerce.price(),
		store,
		image_src: faker.random.image(),
		address: faker.address.streetAddress(),
	};
};

const name = "Oatly";

// 1. Scrape to update existing oatmilks zipcode
const zip = 91202;

//hard code URLs at first then later add to db
const scrapeInstacart = async (url, zip) => {
	//init headless chromium browser
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto(url, {
		waitUntil: "networkidle2",
	});

	//get src of img
	var image_src;
	try {
		image_src = await page.$eval(
			"#main-content > div.rmq-55d4a504 > div > div.rmq-dff875f > picture > img",
			(el) => {
				return el.src;
			}
		);
	} catch (error) {
		console.log(error);
		image_src = "/public/oatly-default-img.jpeg";
	}

	//wait for update link to render & for zip input field to open

	await page.waitForSelector(
		"#main-content > div.rmq-ff664b58 > div > section:nth-child(5) > div > div:nth-child(3) > a > strong"
	);

	//get reference to trigger zipcode
	const updateZipButton = await page.$(
		"#main-content > div.rmq-ff664b58 > div > section:nth-child(5) > div > div:nth-child(3) > a > strong"
	);
	await updateZipButton.click();
	await page.waitForSelector("#signup-zipcode");

	//get input field reference
	const inputZipField = await page.$("#signup-zipcode");
	await inputZipField.click({ clickCount: 2 });
	await inputZipField.type(zip);

	//get ref to update button
	const updateButton = await page.$(
		"#main-content > div.rmq-ff664b58 > div > section:nth-child(5) > div > form > button"
	);
	await updateButton.click();
	//wait for navigation
	await page.waitForNavigation();

	//wait for store name to be rendered
	await page.waitForSelector(
		"#main-content > div.rmq-172b9778 > div:nth-child(2) > div > div:nth-child(2) > a"
	);

	//get store name
	const store = await page.$eval(
		"#main-content > div.rmq-172b9778 > div:nth-child(2) > div > div:nth-child(2) > a",
		(el) => {
			return el.innerHTML;
		}
	);

	//get price if error, then item isn't available
	var price = await page.$eval(
		"#main-content > div.rmq-ff664b58 > div > div:nth-child(1) > div:nth-child(1)",
		(el) => {
			return el.innerHTML;
		}
	);

	if (price === "") price = `This item is not available at ${store}`;

	//adress will be a full address if it is available (such as whole foods web page)
	await browser.close();
	return {
		name,
		price,
		store,
		address: zip,
		image_src,
	};
};

const scrapeTarget = async (url, zip) => {
	//Target price matches so location does not matter

	const store = "Target";
	//init headless browser & nav to url
	const browser = await puppeteer.launch({
		headless: true,
	});
	const page = await browser.newPage();
	await page.goto(url, {
		waitUntil: "networkidle2",
	});

	//wait for image to render
	await page.waitForSelector(
		"#viewport > div:nth-child(4) > div > div.Row-uds8za-0.fdXLni > div.Col-favj32-0.hKWLcP > div > div > div > div.Col-favj32-0.gUxEJK.carouselMainImageWrapper > div > div > div > div > div > div:nth-child(3) > a > div > div > div > div > div > img"
	);

	var image_src;
	try {
		image_src = await page.$eval(
			"#viewport > div:nth-child(4) > div > div.Row-uds8za-0.fdXLni > div.Col-favj32-0.hKWLcP > div > div > div > div.Col-favj32-0.gUxEJK.carouselMainImageWrapper > div > div > div > div > div > div:nth-child(3) > a > div > div > div > div > div > img",
			(el) => {
				return el.src;
			}
		);
	} catch (error) {
		console.log(error);
		image_src = "/public/oatly-default-img.jpeg";
	}

	//get price
	const price = await page.$eval(
		"#viewport > div:nth-child(4) > div > div.Row-uds8za-0.fdXLni > div.Col-favj32-0.styles__StyledCol-sc-1n8m629-5.MkLC.dbdzSB.h-padding-h-default.h-padding-t-tight > div.h-padding-b-default > div:nth-child(1) > div.style__PriceFontSize-sc-17wlxvr-0.ceEMdT",
		(el) => {
			return el.textContent;
		}
	);

	//console.log({ price, brand, image });

	await browser.close();

	return {
		store,
		name: "Oatly",
		price,
		address: zip,
		image_src,
	};
};

const scrapeWholeFoods = async (url, zip) => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto(url, {
		waitUntil: "networkidle2",
	});

	//wait for image to render on DOM
	await page.waitForSelector(
		"#main-content > div > div.w-pie--pdp-image > div > div.w-pie--product-detail-carousel > div.w-pie--pdc__small > div > div > div > div.slick-slide.slick-active.slick-current > div > div > img"
	);

	//get img
	var image_src;
	try {
		image_src = await page.$eval(
			"#main-content > div > div.w-pie--pdp-image > div > div.w-pie--product-detail-carousel > div.w-pie--pdc__small > div > div > div > div.slick-slide.slick-active.slick-current > div > div > img",
			(el) => {
				return el.src;
			}
		);
	} catch (error) {
		console.log(error);
		image_src = "/public/oat-default-img.src";
	}

	//get reference to zipcode input field
	const inputZipField = await page.$("#pie-pdp-storefinder");
	//click input field to focus
	await inputZipField.click();
	//type into input field
	await inputZipField.type(zip);

	//wait for dropdown to open up & get first location
	//wait for a second li to pop up, the 0 index will be a valid address
	await page.waitForSelector(
		"#main-content > div > div.w-pie--pdp-description > section.w-pie--pdp__storefinder > section > div > wfm-search-bar > div.wfm-search-bar--list_container > div > ul > li:nth-child(2)"
	);
	//get address
	const address = await page.$eval(
		"#main-content > div > div.w-pie--pdp-description > section.w-pie--pdp__storefinder > section > div > wfm-search-bar > div.wfm-search-bar--list_container > div > ul > li:nth-child(1) > span",
		(el) => {
			return el.textContent;
		}
	);

	//get reference to list item of address
	const closestLocation = await page.$(
		"#main-content > div > div.w-pie--pdp-description > section.w-pie--pdp__storefinder > section > div > wfm-search-bar > div.wfm-search-bar--list_container > div > ul > li:nth-child(1) > span"
	);
	//click the list item to trigger navigation
	await closestLocation.click();

	//wait for navigation and for the price to pop into screen
	await page.waitForNavigation();
	await page.waitForSelector(
		"#main-content > div > div.w-pie--pdp-description > div.w-pie--pdp__pricing > div.w-pie--prices > ul > li > span"
	);

	//get price
	const price = await page.$eval(
		"#main-content > div > div.w-pie--pdp-description > div.w-pie--pdp__pricing > div.w-pie--prices > ul > li > span > b",
		(el) => {
			return el.textContent;
		}
	);

	return {
		store: "Whole Foods",
		name,
		address,
		price,
		image_src,
	};
};

module.exports = {
	fakeScraper,
	scrapeInstacart,
	scrapeTarget,
	scrapeWholeFoods,
};
