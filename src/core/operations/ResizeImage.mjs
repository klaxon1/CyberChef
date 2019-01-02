/**
 * @author Klaxon [klaxon@veyr.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation";
import OperationError from "../errors/OperationError";
import Magic from "../lib/Magic";
import { toBase64 } from "../lib/Base64";
import { getImageDimensions, resizeImage } from "../lib/ImageProcessing";

/**
 * Resize Image operation
 */
class ResizeImage extends Operation {

    /**
     * ResizeImage constructor
     */
    constructor() {
        super();

        this.name = "Resize Image";
        this.module = "Image";
        this.description = "Resize an image.<br>A value of 0 for the Width or Height will auto scale that dimension";
        this.infoURL = "";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
        this.presentType = "html";
        this.args = [
            {
                name: "Width",
                type: "number",
                value: 0,
                hint: "0 = auto scale"
            },
            {
                name: "Height",
                type: "number",
                value: 0,
                hint: "0 = auto scale"

            },
            {
                name: "Units",
                type: "option",
                value: ["Pixels", "Percentage"]
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {ByteArray}
     */
    async run(input, args) {
        // validate input as an image.
        if (!input.length) return [];
        const type = Magic.magicFileType(input);
        if (type  === null || type.mime.indexOf("image") !== 0) {
            throw new OperationError("Invalid file type.");
        }
        // validate width and height.
        let width = args[0], height = args[1];
        if (width < 0 || height < 0){
            throw new OperationError("Width and height must be greater than or equal to 0");
        }
        // compute width and heigh based on units type.
        const units = args[2];
        const dimensions = await getImageDimensions(input);
        if (units === "Percentage"){
            width = width * (dimensions.width / 100);
            height = height * (dimensions.height / 100);
        }
        if (width === 0) width = undefined;
        if (height === 0) height = undefined;
        if (width === undefined && height === undefined) width = dimensions.width;
        // resize image
        // resizeImage retures a byteArray
        const image = await resizeImage(input, width, height);
        return image;

    }

    /**
     * Displays the image using HTML for web apps.
     *
     * @param {byteArray} data
     * @returns {html}
     */
    async present(data) {
        if (!data.length) return "";

        let dataURI = "data:";

        // Determine file type
        const type = Magic.magicFileType(data);
        if (type && type.mime.indexOf("image") === 0) {
            dataURI += type.mime + ";";
        } else {
            throw new OperationError("Invalid file type");
        }

        // Add image data to URI
        dataURI += "base64," + toBase64(data);

        return "<img src='" + dataURI + "'>";
    }
}

export default ResizeImage;
