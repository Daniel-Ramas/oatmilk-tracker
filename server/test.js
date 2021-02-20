var faker = require("faker");
const scrapers = require("./scrapers");

//console.log(faker.address.streetAddress({ useFullAddress: true }));

console.log(scrapers.fakeScraper(1, "target"));
