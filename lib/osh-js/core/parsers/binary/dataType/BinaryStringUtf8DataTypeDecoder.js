// http://www.opengis.net/def/dataType/OGC/0/string-utf-8
DataView.prototype.getString = function (offset, length, littleEndian) {
    var end = typeof length == 'number' ? offset + length : this.byteLength;
    var text = '';
    var val = -1;
    while (offset < this.byteLength && offset < end) {
        val = this.getUint8(offset++, littleEndian);
        if (val === 0)
            break;
        text += String.fromCharCode(val);
    }
    return text;
};
var decoderForStringDataTypeDecoder = new TextDecoder("utf-8");
var BinaryStringDataTypeDecoder = /** @class */ (function () {
    function BinaryStringDataTypeDecoder() {
    }
    BinaryStringDataTypeDecoder.prototype.decode = function (dataView, offset, littleEndian) {
        if (littleEndian === void 0) { littleEndian = false; }
        this.strLength = dataView.getUint16(offset, littleEndian);
        return decoderForStringDataTypeDecoder.decode(new DataView(dataView.buffer, offset + 2, this.strLength));
    };
    BinaryStringDataTypeDecoder.prototype.length = function () {
        // 2 = size of the strLength at the beginning of the string = getUint16()
        return this.strLength + 2;
    };
    return BinaryStringDataTypeDecoder;
}());
export default BinaryStringDataTypeDecoder;
//# sourceMappingURL=BinaryStringUtf8DataTypeDecoder.js.map