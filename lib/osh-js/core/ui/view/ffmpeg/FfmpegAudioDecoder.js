var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import FfmpegDecoder from "./FfmpegDecoder";
var FfmpegAudioDecoder = /** @class */ (function (_super) {
    __extends(FfmpegAudioDecoder, _super);
    function FfmpegAudioDecoder(codec) {
        return _super.call(this, {
            codec: codec,
            codecMap: {
            // 'aac': 'mp4a.40.2',
            },
            pktDataAllocSize: 1024
        }) || this;
    }
    FfmpegAudioDecoder.prototype.handleAvFrame = function (avFrame, pktSize, timestamp) {
        var nb_samples = this.Module.getValue(avFrame + 76, 'i32');
        var audioFramePtr = this.Module.getValue(avFrame, '*');
        return {
            frame: new Float32Array(this.Module.HEAPU8.buffer.slice(audioFramePtr, audioFramePtr + nb_samples * 4))
        };
    };
    return FfmpegAudioDecoder;
}(FfmpegDecoder));
export default FfmpegAudioDecoder;
//# sourceMappingURL=FfmpegAudioDecoder.js.map