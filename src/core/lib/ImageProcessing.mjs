/**
 * Image processing resources.
 *
 * @author Klaxon [klaxon@veyr.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import OperationError from "../errors/OperationError";
import jimp from "jimp";

/**
 * resize Image
 *
 * @param {byteArray} input
 * @param  {number} width
 * @param  {number} height
 * @return {byteArray}
 */
export async function resizeImage(input, width=jimp.AUTO, height=jimp.AUTO){
    try {
        const image = await jimp.read(Buffer.from(input));
        image.resize(width, height);
        const buffer = await image.getBufferAsync(jimp.AUTO);
        return [...buffer];
    } catch (err) {
        throw new OperationError("Error: " + err.toString());
    }
}

/**
 * get image dimensions
 *
 * @param  {byteArray} input
 * @return {object} - with the properties .width .height
 */
export async function getImageDimensions(input){
    const dimensions = {};
    let image;
    try {
        image = await jimp.read(Buffer.from(input));
        dimensions.width = image.getWidth();
        dimensions.height = image.getHeight();
        return dimensions;
    } catch (err) {
        throw new OperationError("Error: " + err.toString());
    }
}
