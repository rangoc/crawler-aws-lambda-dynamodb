'use strict';
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const  uuid = require('uuid/v4');
const chromium = require('chrome-aws-lambda');
const cheerio = require("cheerio");

const jobsTable = process.env.JOBS_TABLE;

async function scrapeListings(page) {
  await page.goto("http://www.zzzcg.me/poslovi/page/1/");
  const html = await page.content();
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
  console.log(listings);
  return listings;
}

module.exports.crawler = async function (event, context) {
  try {
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    const listings = await scrapeListings(page);
    for (var i = 0; i < listings.length; i++) {
      const job = {
        id: uuid(),
        url: listings[i].url,
        employer: listings[i].employer,
        title: listings[i].title,
        location: listings[i].location,
        datePosted: listings[i].datePosted
      };
      
      await db.put({
        TableName: jobsTable,
        Item: job
      }).promise();
    }
  } catch (error) {
    return context.fail(error);
  }
  return context.succeed("success");
}
