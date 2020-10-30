"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uid = exports.Model = void 0;
class Model {
    constructor() {
        this._id = uid();
    }
    static new(data) {
        const instance = new this();
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            instance[key] = data[key];
        }
        return instance;
    }
}
exports.Model = Model;
const lut = [];
for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? "0" : "") + i.toString(16);
}
function uid() {
    let d0 = (Math.random() * 0xffffffff) | 0;
    let d1 = (Math.random() * 0xffffffff) | 0;
    let d2 = (Math.random() * 0xffffffff) | 0;
    let d3 = (Math.random() * 0xffffffff) | 0;
    return (lut[d0 & 0xff] +
        lut[(d0 >> 8) & 0xff] +
        lut[(d0 >> 16) & 0xff] +
        lut[(d0 >> 24) & 0xff] +
        "-" +
        lut[d1 & 0xff] +
        lut[(d1 >> 8) & 0xff] +
        "-" +
        lut[((d1 >> 16) & 0x0f) | 0x40] +
        lut[(d1 >> 24) & 0xff] +
        "-" +
        lut[(d2 & 0x3f) | 0x80] +
        lut[(d2 >> 8) & 0xff] +
        "-" +
        lut[(d2 >> 16) & 0xff] +
        lut[(d2 >> 24) & 0xff] +
        lut[d3 & 0xff] +
        lut[(d3 >> 8) & 0xff] +
        lut[(d3 >> 16) & 0xff] +
        lut[(d3 >> 24) & 0xff]);
}
exports.uid = uid;
