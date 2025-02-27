const fs = require("fs").promises;

const CapicuaImager = require('.');

const imager = new CapicuaImager('a6780866-bd3e-4ea1-9f31-41eefd148264');

const filePath = "/Users/noel/Downloads/Azure_Dragon_Logo.jpg";


const method = async () => {
    const data = await fs.readFile(filePath);
    const uploaded = await imager.uploadImage({ data, compress: false, webp: false });
    console.log(uploaded)
    //const test = await imager.getImageInfo('d35ff392-2dc5-42fb-81b6-98358378a6e5');
}

method()