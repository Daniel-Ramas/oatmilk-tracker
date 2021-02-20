"use strict";
const { Model, UUID } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Oatmilk extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Location }) {
			// define association here
			this.belongsTo(Location, {
				foreignKey: "locationId",
				as: "location",
			});
		}

		//hide primary key
		toJSON() {
			return { ...this.get(), id: undefined, locationId: undefined };
		}
	}
	Oatmilk.init(
		{
			uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
			name: { type: DataTypes.STRING, allowNull: false },
			price: { type: DataTypes.STRING, allowNull: false },
			store: { type: DataTypes.STRING, allowNull: false },
			image_src: { type: DataTypes.STRING, allowNull: false },
			address: { type: DataTypes.STRING, allowNull: false },
		},
		{
			sequelize,
			tableName: "oatmilks",
			modelName: "Oatmilk",
		}
	);
	return Oatmilk;
};
