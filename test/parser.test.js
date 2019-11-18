const cheerio = require('cheerio');
const expect = require('chai').expect;
const parser = require('../lib/parser.js');
const fs = require('fs'); // filesystem
 
const base = process.env.PWD;
const html = fs.readFileSync(base + "/test/mocks/page1.html","utf-8");
const $ = cheerio.load(html);
const element = fs.readFileSync(base + "/test/mocks/page1job1.html","utf-8");

describe('parser.js tests', () => {
    describe('listingsScraper() Test', () => {
        it('number of objects should equal 35', () => {
            const result = parser.listingsScraper(html);
            expect(result.length).to.equal(35);
        });
    });
    describe('scraper() Test', () => {
        it('name should equal "NASTAVNIK/CA FIZIKE"', () => {
            const result = parser.scraper($,element);
            expect(result.title).to.equal("NASTAVNIK/CA FIZIKE");
        });
    }); 
});

// adding this comment just to test codebuild