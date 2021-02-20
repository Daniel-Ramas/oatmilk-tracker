"use strict";
module.exports = {
	up: async (queryInterface, DatatTypes) => {
		await queryInterface.createTable("locations", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DatatTypes.INTEGER,
			},
			zip_code: {
				type: DatatTypes.INTEGER,
				allowNull: false,
			},
			area_name: {
				type: DatatTypes.STRING,
				allowNull: false,
			},
			createdAt: {
				allowNull: false,
				type: DatatTypes.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: DatatTypes.DATE,
			},
		});
	},
	down: async (queryInterface, DatatTypes) => {
		await queryInterface.dropTable("locations");
	},
};
