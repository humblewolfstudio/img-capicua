# img-capicua

this package is used to upload, get and delete images from the [service](https://img.capicua.org.es)

to use this package, you must create an account [here](https://img.capicua.org.es/register)

## installation

```bash
npm i img-capicua
```

## usage

we import the CapicuaImager package and we set the *API_TOKEN* that we can get from [here](https://img.capicua.org.es/dashboard)

### upload image
```js

import { CapicuaImager } from 'img-capicua';

const uploadImage = async () => {
    const capicua = new CapicuaImager('your-api-token');

    const data = ... // Buffer of image

    const options = {
        data,
        compress: true,
        webp: false
    }
    const uploaded = await capicua.uploadImage(options);

    console.log(uploaded.id);
}

```

### information about image
```js

import { CapicuaImager } from 'img-capicua';

const imageInfo = async () => {
    const capicua = new CapicuaImager('your-api-token');

    const id = '...' // id of image

    const info = await capicua.getImageInfo(id);

    console.log(info.id);
}

```

### delete image
```js

import { CapicuaImager } from 'img-capicua';

const deleteImage = async () => {
    const capicua = new CapicuaImager('your-api-token');

    const id = '...' // id of image

    const deleted = await capicua.deleteImage(id);

    console.log(deleted.deleted);
}

```

### get image

to get the image, make a get request to "https://img.capicua.org.es/api/file/{id}"