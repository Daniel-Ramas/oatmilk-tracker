const express = require("express");
const bodyParser = require("body-parser");
const { sequelize, Location, Oatmilk } = require("./models");
const scrapers = require("./scrapers");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

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

		const location = await Location.findOne({
			where: { zip_code },
			include: "oatmilks",
		});

		//pass zip_code to scrapers to scrape information
		const scrapedTargetData = scrapers.fakeScraper(location.id, "Target");
		const scrapedInstacartData = scrapers.fakeScraper(location.id, "Ralphs");
		const scrapedWholeFoodsData = scrapers.fakeScraper(
			location.id,
			"Whole Foods"
		);
		const scrapedSproutsData = scrapers.fakeScraper(location.id, "Sprouts");

		//create table entries(objects should include locationId for relations)
		await Oatmilk.create(scrapedTargetData);
		await Oatmilk.create(scrapedInstacartData);
		await Oatmilk.create(scrapedWholeFoodsData);
		await Oatmilk.create(scrapedSproutsData);

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
