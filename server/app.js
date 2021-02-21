const express = require("express");
const bodyParser = require("body-parser");
const { sequelize, Location, Oatmilk } = require("./models");
const scrapers = require("./scrapers");
const { URL_INSTACART, URL_TARGET, URL_WHOLEFOODS } = require("./urls");
const { uuid } = require("uuidv4");
var faker = require("faker");
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

//this app is simple enough to not require routers

//endpoint to serve quasar spa
app.get("/", (req, res) => {
	res.send("Endpoint to serve quasar application");
});

//get all oatmilks
app.get("/api/oatmilks", async (req, res) => {
	try {
		//get array of oatmilks in database
		const oatmilks = await Oatmilk.findAll();
		return res.status(200).json(oatmilks);
	} catch (error) {
		//need to look into error codes
		console.log(error);
		return res.status(500).json({
			error,
		});
	}
});

//get all locations
app.get("/api/locations", async (req, res) => {
	try {
		const locations = await Location.findAll();
		return res.json(locations);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error,
		});
	}
});

//get oatmilks by location(zip)
app.get("/api/oatmilks/:zip", async (req, res) => {
	//get zip_code from params
	const zip_code = req.params.zip;
	try {
		const oatmilks = await Location.findOne({
			where: {
				zip_code,
			},
			include: "oatmilks",
		});

		return oatmilks
			? res.status(200).json(oatmilks)
			: res.json({
					msg: "That zip code is not in our database!",
			  });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: "Something went wrong!",
		});
	}
});

//endpoint for user editing the oatmilk price (user reporting feature)
app.patch("/api/oatmilks/:uuid", async (req, res) => {
	const uuid = req.params.uuid;
	const { price } = req.body;

	try {
		const oatmilk = await Oatmilk.findOne({ where: { uuid } });
		await oatmilk.update({ price });
		return res.status(200).json(oatmilk);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: "Something went wrong!",
		});
	}
});

//endpoint for adding a new zipcode which will use the scrapers to obtain the oatmilk data
app.post("/api/locations", async (req, res) => {
	const { zip_code, area_name } = req.body;
	try {
		//create location
		await Location.create({
			zip_code,
			area_name,
		});

		//get location to get location ID for relations
		const location = await Location.findOne({
			where: { zip_code },
		});

		//pass zip_code to scrapers to scrape information
		var instacartData = await scrapers.scrapeInstacart(URL_INSTACART, zip_code);
		instacartData.uuid = uuid();
		instacartData.locationId = location.id;
		instacartData.image_src = faker.image.imageUrl();
		var targetData = await scrapers.scrapeTarget(URL_TARGET, zip_code);
		targetData.uuid = uuid();
		targetData.locationId = location.id;
		targetData.image_src = faker.image.imageUrl();
		var wholefoodsData = await scrapers.scrapeWholeFoods(
			URL_WHOLEFOODS,
			zip_code
		);
		wholefoodsData.uuid = uuid();
		wholefoodsData.locationId = location.id;
		wholefoodsData.image_src = faker.image.imageUrl();

		//create table entries
		await Oatmilk.create(instacartData);
		await Oatmilk.create(targetData);
		await Oatmilk.create(wholefoodsData);

		const results = await Location.findOne({
			where: { id: location.id },
			include: "oatmilks",
		});
		return res.status(200).json(results);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: "Something went wrong!",
		});
	}
});

//endpoint for adding a price

//endpoint for calling scrape method to update all info in db
app.patch("/api/oatmilks", (req, res) => {
	res.send("This endpoint for updating the entire database");
});

//Start server
app.listen(PORT, async () => {
	console.log(`Server started on http://localhost:${PORT}/`);
	try {
		await sequelize.authenticate();
		console.log("Database connected");
	} catch (error) {
		console.log("Unable to authenticate to database");
	}
});
