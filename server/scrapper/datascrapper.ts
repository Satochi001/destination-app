import puppeteer from "puppeteer-core";

async function scrppeDt (url: string): Promise<string | any >{
try{
    const browser = await puppeteer.launch({
        executablePath:  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless : true
    });

    const page = await browser.newPage(); 
    await page.goto(url);
    await page.setViewport({width: 1080, height: 1024});

    await page.waitForSelector('img'); 
     const images = await page.$$eval('img', imgs =>{
       return  imgs.map(data => ({
            src: data.src,
            title : data.title,
            alt: data.alt?.trim()|| null

        }));
    });

    console.log(images)


    await browser.close();
    


}
catch(error){
    console.error("failed to run this scrapdt  here ", error); 
    return { 

      pageTitle : ' ',
      locationName : ' ',
      locationImg : ' ',
    }
  };
}


// promising all url that i want scrap!
(async ()=> {
  const result = await scrppeDt('https://www.housebeautiful.com/lifestyle/g4500/most-beautiful-places-world/');
  console.log(result)

})(); 
