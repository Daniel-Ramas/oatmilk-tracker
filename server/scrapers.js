const faker = require("faker");

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

// 1. Scrape to update existing oatmilks zipcode

// 2. Scrape to get a new zip code not in the database
// 3. Cron job to update entire database

module.exports = { fakeScraper };
