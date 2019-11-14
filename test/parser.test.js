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
        /* test iznad daje: ReferenceError: scraper is not defined
                            at Node.$.map (lib/parser.js:22:60)
                            at /home/goran/workspace/zzzcg/node_modules/cheerio/lib/api/traversing.js:306:18
                            at /home/goran/workspace/zzzcg/node_modules/lodash/_baseReduce.js:18:9
                            at /home/goran/workspace/zzzcg/node_modules/lodash/_createBaseEach.js:24:11
                            at baseReduce (node_modules/lodash/_baseReduce.js:15:3)
                            at Object.reduce (node_modules/lodash/reduce.js:48:10)
                            at initialize.exports.map (node_modules/cheerio/lib/api/traversing.js:305:23)
                            at Object.listingsScraper (lib/parser.js:22:36)
                            at Context.it (test/parser.test.js:14:35)*/
    });
    describe('scraper() Test', () => {
        it('name should equal "NASTAVNIK/CA FIZIKE"', () => {
            const result = parser.scraper($,element);
            expect(result.title).to.equal("NASTAVNIK/CA FIZIKE");
        });
    }); 
});