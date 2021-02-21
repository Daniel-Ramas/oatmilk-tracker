"use strict";

const { uuid } = require("uuidv4");
var faker = require("faker");
const scrapers = require("../scrapers");
const { URL_INSTACART, URL_TARGET, URL_WHOLEFOODS, ZIP } = require("../urls");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			"locations",
			[
				{
					zip_code: 93010,
					area_name: "Camarillo",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					zip_code: 91202,
					area_name: "Glendale",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);

		//get id's of locations
		//Cam = 1, Glendale = 2
		const locations = await queryInterface.sequelize.query(
			"select id from locations;"
		);

		const locationRows = locations[0];

		//scrape and initialize the seed data
		var instacartData = await scrapers.scrapeInstacart(URL_INSTACART, ZIP);

		var targetData = await scrapers.scrapeTarget(URL_TARGET, ZIP);

		var wholefoodsData = await scrapers.scrapeWholeFoods(URL_WHOLEFOODS, ZIP);

		await queryInterface.bulkInsert("oatmilks", [
			{
				//instacart data
				uuid: uuid(),
				locationId: locationRows[0].id,
				name: instacartData.name,
				price: instacartData.price,
				store: instacartData.store,
				image_src: faker.image.imageUrl(),
				address: instacartData.address,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//target data
				uuid: uuid(),
				locationId: locationRows[0].id,
				name: targetData.name,
				price: targetData.price,
				store: targetData.store,
				image_src: faker.image.imageUrl(),
				address: targetData.address,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//whole foods data
				uuid: uuid(),
				locationId: locationRows[0].id,
				name: wholefoodsData.name,
				price: wholefoodsData.price,
				store: wholefoodsData.store,
				image_src: faker.image.imageUrl(),
				address: wholefoodsData.address,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("oatmilks", null, {});
		await queryInterface.bulkDelete("locations", null, {});
	},
};
