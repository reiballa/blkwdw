const uuidv1 = require('uuid/v1');

module.exports = class Crawler {
    constructor() {
        this.admin = require("firebase-admin");
        this.puppeteer = require('puppeteer');
        this.fs = require('fs');
        this.shortid = require('shortid');
        this.bcrypt = require('bcrypt');
        this.imageDownolad = require('./imageDownload');
        this.rx = require('rxjs');
        this.messages = new this.rx.Subject();
        this.intercom = new this.rx.Subject();
        this.stopProcess = false;

        this.db = require('../metadata/config/mongoConfig');
        this.visited = require('../metadata/models/visited');

    }



    testSocket() {
        this.messages.next("Socket works correctly");
    }

    checkIfExists(title, description) {
        return new Promise(resolve => {
            this.visited.findOne({ title: title, description: description }, (err, res) => {
                console.log(res);
                if (res) resolve(true);
                else resolve(false);
            })
        })

    }

    async stopCrawl() {
        this.intercom.next('stop')
    }

    async startCrawl(opt) {
        const browser = await this.puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        this.crawl(opt, page, browser);

        let stopSubscription = this.intercom.subscribe(message => {
            if (message == 'stop') {
                this.stopProcess = true;
                stopSubscription.unsubscribe()
            }
        })
    };

    async crawl(options, page, browser) {

        console.log("----------------------------------------------");
        console.log("----------------started crawl-----------------");

        this.messages.next("started crawl");

        await page.goto(options.startUrl);

        // EITHER GET NEXT URL OR NULL
        // ===========================
        // const nextUrl = await page.evaluate((options) => {
        //     if (document.querySelector(options.nextPageSelector)) return document.querySelector(options.nextPageSelector).getAttribute('href');
        //     return null
        // }, options);
        // ===========================

        // GET URLS OF ITEMS
        // ===========================
        const urls = await page.evaluate((options) => {
            let data = [];
            let elements = document.querySelectorAll(options.itemSelector);
            for (var element of elements) {
                let url = element.getAttribute('href');
                // if (!url.includes(options.baseUrl)) {
                //     url = options.baseUrl.concat(url);
                // }
                data.push(url);
            }

            return data;
        }, options);
        // ===========================

        // GET DATA FOR EACH ITEM
        // ===========================
        for (let url of urls) {

            var pathArray = options.startUrl.split('/');
            var protocol = pathArray[0];
            var httpProtocol = 'http:'
            var host = pathArray[2];
            var baseUrl = protocol + '//' + host;
            var httpBaseUrl = httpProtocol + '//' + host;

            if (!url.includes(baseUrl) && !url.includes(httpBaseUrl)) url = baseUrl.concat(url);

            console.log("crawling " + url);
            this.messages.next("crawling " + url);

            // Check if page was already visited
            // ===========================
            await page.goto(url);
            let crawlData = await page.evaluate((options) => {

                let data = {};

                for (const attr of options.attributes) {

                    if (attr.unique == true) {
                        if (document.querySelector(attr.selector)) {
                            if (attr.infoToExtract == "text") data[attr.name] = document.querySelector(attr.selector).innerText;
                            else data[attr.name] = document.querySelector(attr.selector).getAttribute(attr.infoToExtract);
                        }
                    } else {
                        if (document.querySelectorAll(attr.selector)) {
                            data[attr.name] = [];
                            let elements = document.querySelectorAll(attr.selector);
                            elements.forEach(element => {
                                if (attr.infoToExtract == "text") data[attr.name].push(element.innerText);
                                else data[attr.name].push(element.getAttribute(attr.infoToExtract));
                            });
                        }
                    }

                }

                return data;

            }, options);

            crawlData.id = this.shortid.generate();



            console.log("-----------------getting data-----------------");
            this.messages.next("getting data");

            // execute pipelines
            // ===========================
            crawlData = await this.executePipelines(options, crawlData)
            // ===========================


            // log final result
            // ===========================
            console.log(crawlData);
            this.messages.next(JSON.stringify(crawlData));
            // ===========================


            if (this.stopProcess == true) {
                page.close();
                break
            }



        }

        this.stopProcess = false;


        // RECURSIVE LOGIC
        // ===========================
        // if (nextUrl) return crawl(mockOptions, nextUrl, page);
        // else
        console.log("----------------------------------------------");
        console.log("----------------------------------------------");
        console.log("--------------finished crawling---------------");
        console.log("----------------------------------------------");
        console.log("----------------------------------------------");

        this.messages.next("finished crawling");

        // ===========================

    }

    async executePipelines(options, data) {
        return new Promise(resolve => {
            for (let x = 0; x < options.pipelines.length; x++) {
                console.log('Running ' + options.pipelines[x].name)
                eval(options.pipelines[x].code)
            }
            resolve(data);
        })
    }

    hashAndSaveToDB(str, src) {
        this.bcrypt.hash(str, 1, function (err, hash) {

        });
    }

    async handleOcr(page, attr) {

        try {
            let resp = await this.screenshotDOMElement({
                path: './public/images/temp/numri.png',
                selector: attr.selector,
                padding: 0
            }, page);
            var number = await this.ocrPipe.getChatactersFromImageV2(`/home/rei/Desktop/personal/blkwdw/main/public/images/temp/numri.png`);
            // console.log(number);
            return number.replace(/\r?\n|\r/g, "");
        } catch (e) {
            return null
        }
    };

    async screenshotDOMElement(opts = {}, page) {

        const padding = 'padding' in opts ? opts.padding : 0;
        const path = 'path' in opts ? opts.path : null;
        const selector = opts.selector;

        if (!selector)
            throw Error('Please provide a selector.');

        const rect = await page.evaluate(selector => {
            const element = document.querySelector(selector);
            if (!element)
                return null;
            const { x, y, width, height } = element.getBoundingClientRect();
            return { left: x, top: y, width, height, id: element.id };
        }, selector);

        if (!rect)
            throw Error(`Could not find element that matches selector: ${selector}.`);

        return await page.screenshot({
            path,
            clip: {
                x: rect.left - padding,
                y: rect.top - padding,
                width: rect.width + padding * 2,
                height: rect.height + padding * 2
            }
        });
    };

};