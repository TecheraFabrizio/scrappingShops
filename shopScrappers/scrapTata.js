import  * as cheerio  from 'cheerio';
import  puppeteer from 'puppeteer';
import  jsdom from 'jsdom';
import { processProductData } from '../processProductName.js';
import { jsonData } from '../processProductName.js';


//tags are used to filter results even more
//query is the necessesary data to search product in web filter
//shop is the "name" so we save it later easily
export const scrapTata = async (shop, query) => {

    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();

    await page.goto("https://www.tata.com.uy/buscar?storeId=318&text="+ query,{waitUntil: 'load', timeout: 0});

    const pageData = await page.evaluate(() => {
        return {
            html: document.documentElement.innerHTML,
        };
    });


   // await page.screenshot({ path: "image.png"})
   function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
    }
    await delay(60000);

    const $ = cheerio.load(pageData.html);
    const productsStr = $('[class="styles__Container-tyimju-1 cQnGrL"]').html();

    const productsContainer = new jsdom.JSDOM(productsStr);
    let productsCol = productsContainer.window.document.body.childNodes;

    productsCol.forEach(function (a) {
        //product name, unit, weight

        //save raw data in variables
        let rawProductName = a.childNodes[0].childNodes[2].childNodes[1].innerHTML;
        let price = a.childNodes[0].childNodes[3].firstChild.innerHTML;
        let image = a.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].getAttribute("src");
        let link = "https://www." + shop + ".com.uy/"+a.childNodes[0].childNodes[2].getAttribute("href");

        //CHECK IF PRODUCT IS THE CORRECT BEFORE SAVE IT, CHECK MATCH OF FIRST WORD

        //send the data, process it and save it to json file
        processProductData(rawProductName,price,image,link, shop);
    });

    //we print final result of all scrapped data
    console.log(jsonData.forEach(function(val){
        console.log(val);
    }));
    await browser.close();
};

