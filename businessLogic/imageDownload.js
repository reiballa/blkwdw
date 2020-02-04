const fs = require('fs');

exports.handleImages = async function(item, itemId, browser){
    const page = await browser.newPage();
    let images = [], i=0;
    fs.mkdirSync('./public/images/items/'+itemId);
    for (var imageUrl of item.images) {

        const image = await page.goto(imageUrl);
        
        // GETTING IMAGE TYPE
        // ===========================
        const split = imageUrl.split('/');
        const imageType = split[split.length - 1].split('.')[1];
        // ===========================
        
        // SAVING IMAGE
        // ===========================
        await fs.writeFile(`./public/images/items/`+itemId+`/`+i+`.`+imageType, await image.buffer(), function(err){
            err? console.log('Error!: '+err): null;
        })
        images.push(`/public/images/items/`+itemId+`/`+i+`.`+imageType);
        // ===========================
        i++;
    }
    page.close();
    item.images = images;
    return item;
};

exports.testState = function(){
    return true;
};

