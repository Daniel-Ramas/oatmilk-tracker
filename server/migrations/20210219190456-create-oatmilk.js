"use strict";
module.exports = {
	up: async (queryInterface, DataTypes) => {
		await queryInterface.createTable("oatmilks", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			locationId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			price: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			store: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			image_src: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		});
	},
	down: async (queryInterface, DataTypes) => {
		await queryInterface.dropTable("oatmilks");
	},
};
