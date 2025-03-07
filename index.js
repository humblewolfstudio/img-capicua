const FormData = require('form-data');
const fetch = require('node-fetch');
const { Platform } = require("react-native");
const uuid = require('react-native-uuid');

const BASE_URL = "https://img.capicua.org.es/api";

/**
 * @typedef {Object} IMG
 * @property {string} id - The unique ID of the uploaded image.
 * @property {string} name - The name of the uploaded file.
 * @property {number} size - The size of the uploaded file in bytes.
 * @property {string} contentType - The MIME type of the uploaded file.
 * @property {Object} dimensions - The dimensions of the uploaded image.
 * @property {number} dimensions.height - The height of the image in pixels.
 * @property {number} dimensions.width - The width of the image in pixels.
 */

/**
 * A client for uploading images to the CapicuaImager API.
 */
class CapicuaImager {
    /**
     * API token for authentication.
     * @private
     * @type {string}
     */
    apiToken;

    /**
     * Creates an instance of CapicuaImager.
     *
     * @param {string} apiToken - The API token for authentication.
     * @throws {Error} If no API token is provided.
     *
     * @example
     * const imager = new CapicuaImager('your-api-token');
     */
    constructor(apiToken) {
        if (!apiToken) {
            throw new Error(
                'CapicuaImager requires a token, generate yours here: https://img.capicua.org.es/dashboard'
            );
        }
        this.apiToken = apiToken;
    }

    /**
     * Uploads an image to the CapicuaImager API.
     *
     * @async
     * @param {Buffer} data - The local URI of the image to upload.
     * @returns {Promise<IMG>} A promise that resolves with the uploaded image details.
     * @throws {Error} If the upload fails.
     *
     * @example
     *   try {
     *     const imager = new CapicuaImager('your-api-token');
     *     const response = await imager.uploadImage('file:///path/to/image.jpg');
     *     console.log("Upload successful:", response);
     *   } catch (error) {
     *     console.error("Upload failed:", error);
     *   }
     */
    uploadImage = async ({ data, compress = true, webp = false }) => {
        try {
            const imageName = `${Platform.OS === "web" ? crypto.randomUUID() : uuid.v4()}.jpg`;

            let fileStream;
            let formData = new FormData();

            if (typeof data === "string" && data.startsWith("file://")) {
                const response = await fetch(data);
                const blob = await response.blob();
                fileStream = blob;
            } else if (typeof data === "string" && data.startsWith("data:image")) {
                const base64Response = await fetch(data);
                const blob = await base64Response.blob();
                fileStream = blob;
            } else {
                throw new Error("Unsupported data format in React Native");
            }

            formData.append("file", fileStream, imageName);

            formData.append("compressImage", compress ? "on" : "off");
            formData.append("webpImage", webp ? "on" : "off");

            let headers = {
                Authorization: this.apiToken,
            };

            const response = await fetch(`${BASE_URL}/file/upload`, {
                method: "POST",
                body: formData,
                headers,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: (${response.status}) ${await response.text()}`);
            }

            return await response.json();
        } catch (e) {
            throw e;
        }
    };

    /**
     * Retrieves information about an uploaded image from the CapicuaImager API.
     *
     * @async
     * @param {string} id - The unique ID of the image.
     * @returns {Promise<IMG>} A promise that resolves with the image details.
     * @throws {Error} If the request fails.
     *
     * @example
     *   try {
     *     const imager = new CapicuaImager('your-api-token');
     *     const imageInfo = await imager.getImageInfo('image-id-123');
     *     console.log("Image Info:", imageInfo);
     *   } catch (error) {
     *     console.error("Failed to retrieve image info:", error);
     *   }
     */
    getImageInfo = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/file/info/${id}`, {
                headers: {
                    Authorization: this.apiToken,
                }
            });

            if (!response.ok) {
                console.log(await response.text())
                throw new Error(`GetImageInfo failed with status: ${response.status}`);
            }

            return await response.json();
        } catch (e) {
            throw e;
        }
    }

    /**
     * Deletes an image from the CapicuaImager API.
     *
     * @async
     * @param {string} id - The unique ID of the image.
     * @returns {Promise<{deleted: boolean}>} A promise that resolves with a boolean if the image was deleted.
     * @throws {Error} If the request fails.
     *
     * @example
     *   try {
     *     const imager = new CapicuaImager('your-api-token');
     *     const imageInfo = await imager.getImageInfo('image-id-123');
     *     console.log("Image Info:", imageInfo);
     *   } catch (error) {
     *     console.error("Failed to retrieve image info:", error);
     *   }
     */
    deleteImage = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/file/delete/${id}`, {
                headers: {
                    Authorization: this.apiToken,
                }
            });

            if (!response.ok) {
                console.log(await response.text())
                throw new Error(`DeleteImage failed with status: ${response.status}`);
            }

            return await response.json();
        } catch (e) {
            throw e;
        }
    }
}

module.exports = CapicuaImager;
