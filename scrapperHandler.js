import { scrapTata } from './shopsScrappers/scrapTata.js';


export function startScrapping(shopName, query) {
    //process query down here then send url to desired shop name
    let temp = query.split(" ").join("%20");
    //start scrapping shop data
    (async () => {
        await scrapTata(shopName, temp);
    })();
}

