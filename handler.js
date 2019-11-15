'use strict';
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const uuid = require('uuid/v4');
const chromium = require('chrome-aws-lambda');
const parser = require('./lib/parser.js');

const jobsTable = process.env.JOBS_TABLE;

async function scrapeListings(page) {
  await page.goto("http://www.zzzcg.me/poslovi/page/1/");
  const html = await page.content();
  const result = parser.listingsScraper(html);
  return result;
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
    await browser.close();
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
