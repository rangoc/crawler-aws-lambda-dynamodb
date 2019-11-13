const cheerio = require("cheerio");

module.exports = {
    listingsScraper: function (html) {
        const $ = cheerio.load(html);

        const listings = $(".job").map((index, element) => {
            const titleElement = $(element).find(".title strong a");
            const titleTextElement = $(element).find(".title");
            const timeElement = $(element).find(".date");
            const locationElement = $(element).find(".location");
            const employerElement = $(titleTextElement).contents().filter(function () {
                return this.nodeType === 3 && /\S/.test(this.nodeValue);
            })
            const title = $(titleElement).text();
            const url = $(titleElement).attr("href");
            const datePosted = $(timeElement).text();
            const employer = $(employerElement).text().trim();
            const location = $(locationElement).text();

            return { title, url, datePosted, employer, location };
        }).get();
        return listings;
    }
};