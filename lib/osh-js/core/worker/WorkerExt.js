import { randomUUID } from "../utils/Utils";
var WorkerExt = /** @class */ (function () {
    function WorkerExt(worker) {
        this.worker = worker;
        this.onmessage = null;
    }
    WorkerExt.prototype.postMessage = function (message, transfer) {
        // console.log('post no ack');
        this.worker.postMessage(message, transfer);
    };
    WorkerExt.prototype.postMessageWithAck = function (message, transfer) {
        var _this = this;
        var ackId = randomUUID();
        // console.log('post ack ' + ackId);
        return new Promise(function (resolve, reject) {
            var controller = new AbortController();
            _this.worker.addEventListener("message", function (e) {
                //console.log('resp ' + e.data.ackId);
                if (e.data.ackId === ackId) {
                    delete e.data.ackId;
                    controller.abort();
                    if (e.error) {
                        reject(e.error);
                    }
                    else {
                        resolve(e.data);
                    }
                }
            }, { signal: controller.signal });
            message.ackId = ackId;
            _this.worker.postMessage(message, transfer);
        });
    };
    Object.defineProperty(WorkerExt.prototype, "onmessage", {
        set: function (f) {
            this.worker.onmessage = f;
        },
        enumerable: false,
        configurable: true
    });
    WorkerExt.prototype.terminate = function () {
        if (this.worker) {
            this.worker.terminate();
        }
    };
    return WorkerExt;
}());
export default WorkerExt;
//# sourceMappingURL=WorkerExt.js.map