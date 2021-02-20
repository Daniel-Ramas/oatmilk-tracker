"use strict";

const { uuid } = require("uuidv4");
var faker = require("faker");

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

		await queryInterface.bulkInsert(
			"oatmilks",
			[
				{
					locationId: locationRows[0].id,
					uuid: uuid(),
					name: "Oatly",
					price: faker.commerce.price(),
					store: "Target",
					image_src: faker.image.image(),
					address: faker.address.streetAddress(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					locationId: locationRows[0].id,
					uuid: uuid(),
					name: "Oatly",
					price: faker.commerce.price(),
					store: "Ralphs",
					image_src: faker.image.image(),
					address: faker.address.streetAddress(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					locationId: locationRows[0].id,
					uuid: uuid(),
					name: "Oatly",
					price: faker.commerce.price(),
					store: "Sprouts",
					image_src: faker.image.image(),
					address: faker.address.streetAddress(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					locationId: locationRows[0].id,
					uuid: uuid(),
					name: "Oatly",
					price: faker.commerce.price(),
					store: "Whole Foods",
					image_src: faker.image.image(),
					address: faker.address.streetAddress(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					locationId: locationRows[1].id,
					uuid: uuid(),
					name: "Oatly",
					price: faker.commerce.price(),
					store: "Target",
					image_src: faker.image.image(),
					address: faker.address.streetAddress(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					locationId: locationRows[1].id,
					uuid: uuid(),
					name: "Oatly",
					price: faker.commerce.price(),
					store: "Ralphs",
					image_src: faker.image.image(),
					address: faker.address.streetAddress(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					locationId: locationRows[1].id,
					uuid: uuid(),
					name: "Oatly",
					price: faker.commerce.price(),
					store: "Smart & Final",
					image_src: faker.image.image(),
					address: faker.address.streetAddress(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					locationId: locationRows[1].id,
					uuid: uuid(),
					name: "Oatly",
					price: faker.commerce.price(),
					store: "Whole Foods",
					image_src: faker.image.image(),
					address: faker.address.streetAddress(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
