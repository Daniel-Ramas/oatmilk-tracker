"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Location extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Oatmilk }) {
			// define association here
			//one location has many oatmilks associated (one to many)
			this.hasMany(Oatmilk, {
				foreignKey: "locationId",
				as: "oatmilks",
			});
		}

		//hide primary key
		toJSON() {
			return { ...this.get(), id: undefined };
		}
	}
	Location.init(
		{
			zip_code: { type: DataTypes.INTEGER, allowNull: false },
			area_name: { type: DataTypes.STRING, allowNull: false },
		},
		{
			sequelize,
			tableName: "locations",
			modelName: "Location",
		}
	);
	return Location;
};
