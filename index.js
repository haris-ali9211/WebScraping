const cheerio = require("cheerio")
const axios = require("axios")
const puppeteer = require('puppeteer');
//https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore
(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto("https://www.nike.com/w/mens-shoes-nik1zy7ok");
    // await page.setViewport({
    //     width: 1200,
    //     height: 800
    // });

    await autoScroll(page);

    await page.screenshot({
        path: 'yourSite.png',
        fullPage: true
    });

    await browser.close();
})();

async function autoScroll(page) {
    try {
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    console.log("<==")
                    if (totalHeight >= scrollHeight - window.innerHeight) {
                        clearInterval(timer);
                        resolve();
                        console.log("(==>")
                    }
                    else{
                        console.log("(==>")
                    }
                    // else {
                    //     console.log("🚀💥💥💥💥💥💥💥💥💥💥💥💥")

                    // }
                }, 50);
            });
        });
        await getProduct()
    }
    catch (err) {
        console.log("error",err)
    }
}

async function getProduct(url) {
    try {
        const products = [];
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // const genre = $("h1").text();
        // console.log(genre);

        $('.product-card__body').each((i, el) => {
            const image = $(el).find('.product-card__hero-image').attr('src');
            const name = $(el).find('.product-card__title').text();
            const price = $(el).find('.product-price__wrapper').text();
            products.push({ image, name, price });
        });

        console.log("🚀 ~ file: index.js:8 ~ products", products.length)

    }
    catch (err) {
        console.log(err)
    }
}

// const puppeteer = require('puppeteer');
// const cheerio = require('cheerio');
// const axios = require('axios');

// const baseUrl = 'https://www.nike.com/w/mens-shoes-nik1zy7ok';

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(baseUrl);
  
//   // Scroll to the bottom of the page
//   await page.evaluate(() => {
//     window.scrollTo(0, document.body.scrollHeight);
//   });
  
//   // Wait for any lazy-loaded images to load
//   await page.waitForSelector('.lazyload-image-loaded');

//   // Get the page HTML and parse with Cheerio
//   const html = await page.content();
//   const $ = cheerio.load(html);

//   const genre = $('h1').text();
//   console.log(genre);

//   const products = [];
//   $('.product-card__body').each((i, el) => {
//     const image = $(el).find('.product-card__hero-image').attr('src');
//     const name = $(el).find('.product-card__title').text();
//     const price = $(el).find('.product-price__wrapper').text();
//     products.push({ image, name, price });
//   });
//   console.log(`Found ${products.length} products`);

//   await browser.close();
// })();
