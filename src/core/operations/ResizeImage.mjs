/**
 * @author Klaxon [klaxon@veyr.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation";
import OperationError from "../errors/OperationError";
import Magic from "../lib/Magic";
import { toBase64 } from "../lib/Base64";

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
        this.description = "Resize an image.";
        this.infoURL = "";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
        this.presentType = "html";
        this.args = [
            {
                name: "Scale",
                type: "option",
                value: ["Height", "Width"]
            },
            {
                name: "Value",
                type: "number",
                value: 100
            },
            {
                name: "Units",
                type: "option",
                value: ["pixels", "Percentage"]
            }
        ];
    }

    /**
     * @param {File} input
     * @param {Object[]} args
     * @returns {File}
     */
    run(input, args) {
        // const [firstArg, secondArg] = args;
        const type = Magic.magicFileType(input);

        // Make sure that the input is an image
        if (type && type.mime.indexOf("image") !== 0) {
            throw new OperationError("Not image");

        }
        return input;

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
