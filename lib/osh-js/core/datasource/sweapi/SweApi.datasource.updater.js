var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var SweApiDatasourceUpdater = /** @class */ (function () {
    function SweApiDatasourceUpdater(properties) {
        this.properties = properties;
        this.datastreamInterval = undefined;
    }
    SweApiDatasourceUpdater.prototype.fetchTime = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, fetch(url)
                        .then(function (response) {
                        if (!response.ok) {
                            // create error object and reject if not a 2xx response code
                            var err = new Error("HTTP status code: " + response.status);
                            err.response = response;
                            err.status = response.status;
                            _this.onError(err);
                            throw err;
                        }
                        return response;
                    })
                        .then(function (response) { return response.json(); })
                        .then(function (response) {
                        // update datastream times
                        if (response && response.items.length > 0 && response.items[0].phenomenonTime
                            && response.items[0].phenomenonTime.length > 1) {
                            var minTime = response.items[0].phenomenonTime[0];
                            var maxTime = response.items[0].phenomenonTime[1];
                            _this.onTimeChanged(minTime, maxTime);
                        }
                    })];
            });
        });
    };
    SweApiDatasourceUpdater.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var regex, match, datastreamId, url_1;
            var _this = this;
            return __generator(this, function (_a) {
                regex = new RegExp('\\/(.*\\/)(.*)\\/observations');
                if (regex.test(this.properties.resource)) {
                    match = regex.exec(this.properties.resource);
                    datastreamId = match[2];
                    url_1 = "http".concat(this.properties.tls ? 's' : '', "://").concat(this.properties.endpointUrl, "/datastreams?id=").concat(datastreamId, "&select=id,phenomenonTime&f=application%2Fjson");
                    return [2 /*return*/, this.fetchTime(url_1).then(function () {
                            _this.datastreamInterval = setInterval(function () {
                                _this.fetchTime(url_1);
                            }, 5000);
                        })];
                }
                else {
                    throw Error("Cannot parse dataStream id from resource ".concat(this.properties.resource));
                }
                return [2 /*return*/];
            });
        });
    };
    SweApiDatasourceUpdater.prototype.onTimeChanged = function (min, max) { };
    SweApiDatasourceUpdater.prototype.onError = function (err) { };
    SweApiDatasourceUpdater.prototype.destroy = function () {
        clearInterval(this.datastreamInterval);
    };
    return SweApiDatasourceUpdater;
}());
export default SweApiDatasourceUpdater;
//# sourceMappingURL=SweApi.datasource.updater.js.map