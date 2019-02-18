/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxPicaErrorType } from './ngx-pica-error.interface';
import { NgxPicaExifService } from './ngx-pica-exif.service';
import Pica from 'pica/dist/pica.js';
var NgxPicaService = /** @class */ (function () {
    function NgxPicaService(_ngxPicaExifService) {
        this._ngxPicaExifService = _ngxPicaExifService;
        this.picaResizer = new Pica();
        this.MAX_STEPS = 20;
        if (!this.picaResizer || !this.picaResizer.resize) {
            this.picaResizer = new window.Pica();
        }
    }
    /**
     * @param {?} files
     * @param {?} width
     * @param {?} height
     * @param {?=} options
     * @return {?}
     */
    NgxPicaService.prototype.resizeImages = /**
     * @param {?} files
     * @param {?} width
     * @param {?} height
     * @param {?=} options
     * @return {?}
     */
    function (files, width, height, options) {
        var _this = this;
        /** @type {?} */
        var resizedImage = new Subject();
        /** @type {?} */
        var totalFiles = files.length;
        if (totalFiles > 0) {
            /** @type {?} */
            var nextFile_1 = new Subject();
            /** @type {?} */
            var index_1 = 0;
            /** @type {?} */
            var subscription_1 = nextFile_1.subscribe((/**
             * @param {?} file
             * @return {?}
             */
            function (file) {
                _this.resizeImage(file, width, height, options).subscribe((/**
                 * @param {?} imageResized
                 * @return {?}
                 */
                function (imageResized) {
                    index_1++;
                    resizedImage.next(imageResized);
                    if (index_1 < totalFiles) {
                        nextFile_1.next(files[index_1]);
                    }
                    else {
                        resizedImage.complete();
                        subscription_1.unsubscribe();
                    }
                }), (/**
                 * @param {?} err
                 * @return {?}
                 */
                function (err) {
                    /** @type {?} */
                    var ngxPicaError = {
                        file: file,
                        err: err
                    };
                    resizedImage.error(ngxPicaError);
                }));
            }));
            nextFile_1.next(files[index_1]);
        }
        else {
            /** @type {?} */
            var ngxPicaError = {
                err: NgxPicaErrorType.NO_FILES_RECEIVED
            };
            resizedImage.error(ngxPicaError);
            resizedImage.complete();
        }
        return resizedImage.asObservable();
    };
    /**
     * @param {?} file
     * @param {?} width
     * @param {?} height
     * @param {?=} options
     * @return {?}
     */
    NgxPicaService.prototype.resizeImage = /**
     * @param {?} file
     * @param {?} width
     * @param {?} height
     * @param {?=} options
     * @return {?}
     */
    function (file, width, height, options) {
        var _this = this;
        /** @type {?} */
        var resizedImage = new Subject();
        /** @type {?} */
        var originCanvas = document.createElement('canvas');
        /** @type {?} */
        var ctx = originCanvas.getContext('2d');
        /** @type {?} */
        var img = new Image();
        if (ctx) {
            img.onload = (/**
             * @return {?}
             */
            function () {
                _this._ngxPicaExifService.getExifOrientedImage(img).then((/**
                 * @param {?} orientedImage
                 * @return {?}
                 */
                function (orientedImage) {
                    window.URL.revokeObjectURL(img.src);
                    originCanvas.width = orientedImage.width;
                    originCanvas.height = orientedImage.height;
                    ctx.drawImage(orientedImage, 0, 0);
                    /** @type {?} */
                    var imageData = ctx.getImageData(0, 0, orientedImage.width, orientedImage.height);
                    if (options && options.aspectRatio && options.aspectRatio.keepAspectRatio) {
                        /** @type {?} */
                        var ratio = 0;
                        if (options.aspectRatio.forceMinDimensions) {
                            ratio = Math.max(width / imageData.width, height / imageData.height);
                        }
                        else {
                            ratio = Math.min(width / imageData.width, height / imageData.height);
                        }
                        width = Math.round(imageData.width * ratio);
                        height = Math.round(imageData.height * ratio);
                    }
                    /** @type {?} */
                    var destinationCanvas = document.createElement('canvas');
                    destinationCanvas.width = width;
                    destinationCanvas.height = height;
                    _this.picaResize(file, originCanvas, destinationCanvas, options)
                        .catch((/**
                     * @param {?} err
                     * @return {?}
                     */
                    function (err) { return resizedImage.error(err); }))
                        .then((/**
                     * @param {?} imgResized
                     * @return {?}
                     */
                    function (imgResized) {
                        resizedImage.next(imgResized);
                    }));
                }));
            });
            img.src = window.URL.createObjectURL(file);
        }
        else {
            resizedImage.error(NgxPicaErrorType.CANVAS_CONTEXT_IDENTIFIER_NOT_SUPPORTED);
        }
        return resizedImage.asObservable();
    };
    /**
     * @param {?} files
     * @param {?} sizeInMB
     * @return {?}
     */
    NgxPicaService.prototype.compressImages = /**
     * @param {?} files
     * @param {?} sizeInMB
     * @return {?}
     */
    function (files, sizeInMB) {
        var _this = this;
        /** @type {?} */
        var compressedImage = new Subject();
        /** @type {?} */
        var totalFiles = files.length;
        if (totalFiles > 0) {
            /** @type {?} */
            var nextFile_2 = new Subject();
            /** @type {?} */
            var index_2 = 0;
            /** @type {?} */
            var subscription_2 = nextFile_2.subscribe((/**
             * @param {?} file
             * @return {?}
             */
            function (file) {
                _this.compressImage(file, sizeInMB).subscribe((/**
                 * @param {?} imageCompressed
                 * @return {?}
                 */
                function (imageCompressed) {
                    index_2++;
                    compressedImage.next(imageCompressed);
                    if (index_2 < totalFiles) {
                        nextFile_2.next(files[index_2]);
                    }
                    else {
                        compressedImage.complete();
                        subscription_2.unsubscribe();
                    }
                }), (/**
                 * @param {?} err
                 * @return {?}
                 */
                function (err) {
                    /** @type {?} */
                    var ngxPicaError = {
                        file: file,
                        err: err
                    };
                    compressedImage.error(ngxPicaError);
                }));
            }));
            nextFile_2.next(files[index_2]);
        }
        else {
            /** @type {?} */
            var ngxPicaError = {
                err: NgxPicaErrorType.NO_FILES_RECEIVED
            };
            compressedImage.error(ngxPicaError);
            compressedImage.complete();
        }
        return compressedImage.asObservable();
    };
    /**
     * @param {?} file
     * @param {?} sizeInMB
     * @return {?}
     */
    NgxPicaService.prototype.compressImage = /**
     * @param {?} file
     * @param {?} sizeInMB
     * @return {?}
     */
    function (file, sizeInMB) {
        var _this = this;
        /** @type {?} */
        var compressedImage = new Subject();
        if (this.bytesToMB(file.size) <= sizeInMB) {
            setTimeout((/**
             * @return {?}
             */
            function () {
                compressedImage.next(file);
            }));
        }
        else {
            /** @type {?} */
            var originCanvas_1 = document.createElement('canvas');
            /** @type {?} */
            var ctx_1 = originCanvas_1.getContext('2d');
            /** @type {?} */
            var img_1 = new Image();
            if (ctx_1) {
                img_1.onload = (/**
                 * @return {?}
                 */
                function () {
                    _this._ngxPicaExifService.getExifOrientedImage(img_1).then((/**
                     * @param {?} orientedImage
                     * @return {?}
                     */
                    function (orientedImage) {
                        window.URL.revokeObjectURL(img_1.src);
                        originCanvas_1.width = orientedImage.width;
                        originCanvas_1.height = orientedImage.height;
                        ctx_1.drawImage(orientedImage, 0, 0);
                        _this.getCompressedImage(originCanvas_1, file.type, 1, sizeInMB, 0)
                            .catch((/**
                         * @param {?} err
                         * @return {?}
                         */
                        function (err) { return compressedImage.error(err); }))
                            .then((/**
                         * @param {?} blob
                         * @return {?}
                         */
                        function (blob) {
                            /** @type {?} */
                            var imgCompressed = _this.blobToFile(blob, file.name, file.type, new Date().getTime());
                            compressedImage.next(imgCompressed);
                        }));
                    }));
                });
                img_1.src = window.URL.createObjectURL(file);
            }
            else {
                compressedImage.error(NgxPicaErrorType.CANVAS_CONTEXT_IDENTIFIER_NOT_SUPPORTED);
            }
        }
        return compressedImage.asObservable();
    };
    /**
     * @private
     * @param {?} canvas
     * @param {?} type
     * @param {?} quality
     * @param {?} sizeInMB
     * @param {?} step
     * @return {?}
     */
    NgxPicaService.prototype.getCompressedImage = /**
     * @private
     * @param {?} canvas
     * @param {?} type
     * @param {?} quality
     * @param {?} sizeInMB
     * @param {?} step
     * @return {?}
     */
    function (canvas, type, quality, sizeInMB, step) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.picaResizer.toBlob(canvas, type, quality)
                .catch((/**
             * @param {?} err
             * @return {?}
             */
            function (err) { return reject(err); }))
                .then((/**
             * @param {?} blob
             * @return {?}
             */
            function (blob) {
                _this.checkCompressedImageSize(canvas, blob, quality, sizeInMB, step)
                    .catch((/**
                 * @param {?} err
                 * @return {?}
                 */
                function (err) { return reject(err); }))
                    .then((/**
                 * @param {?} compressedBlob
                 * @return {?}
                 */
                function (compressedBlob) {
                    resolve(compressedBlob);
                }));
            }));
        }));
    };
    /**
     * @private
     * @param {?} canvas
     * @param {?} blob
     * @param {?} quality
     * @param {?} sizeInMB
     * @param {?} step
     * @return {?}
     */
    NgxPicaService.prototype.checkCompressedImageSize = /**
     * @private
     * @param {?} canvas
     * @param {?} blob
     * @param {?} quality
     * @param {?} sizeInMB
     * @param {?} step
     * @return {?}
     */
    function (canvas, blob, quality, sizeInMB, step) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            if (step > _this.MAX_STEPS) {
                reject(NgxPicaErrorType.NOT_BE_ABLE_TO_COMPRESS_ENOUGH);
            }
            else if (_this.bytesToMB(blob.size) < sizeInMB) {
                resolve(blob);
            }
            else {
                /** @type {?} */
                var newQuality = quality - (quality * 0.1);
                /** @type {?} */
                var newStep = step + 1;
                // recursively compression
                resolve(_this.getCompressedImage(canvas, blob.type, newQuality, sizeInMB, newStep));
            }
        }));
    };
    /**
     * @private
     * @param {?} file
     * @param {?} from
     * @param {?} to
     * @param {?} options
     * @return {?}
     */
    NgxPicaService.prototype.picaResize = /**
     * @private
     * @param {?} file
     * @param {?} from
     * @param {?} to
     * @param {?} options
     * @return {?}
     */
    function (file, from, to, options) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.picaResizer.resize(from, to, options)
                .catch((/**
             * @param {?} err
             * @return {?}
             */
            function (err) { return reject(err); }))
                .then((/**
             * @param {?} resizedCanvas
             * @return {?}
             */
            function (resizedCanvas) { return _this.picaResizer.toBlob(resizedCanvas, file.type); }))
                .then((/**
             * @param {?} blob
             * @return {?}
             */
            function (blob) {
                /** @type {?} */
                var fileResized = _this.blobToFile(blob, file.name, file.type, new Date().getTime());
                resolve(fileResized);
            }));
        }));
    };
    /**
     * @private
     * @param {?} blob
     * @param {?} name
     * @param {?} type
     * @param {?} lastModified
     * @return {?}
     */
    NgxPicaService.prototype.blobToFile = /**
     * @private
     * @param {?} blob
     * @param {?} name
     * @param {?} type
     * @param {?} lastModified
     * @return {?}
     */
    function (blob, name, type, lastModified) {
        return new File([blob], name, { type: type, lastModified: lastModified });
    };
    /**
     * @private
     * @param {?} bytes
     * @return {?}
     */
    NgxPicaService.prototype.bytesToMB = /**
     * @private
     * @param {?} bytes
     * @return {?}
     */
    function (bytes) {
        return bytes / 1048576;
    };
    NgxPicaService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    NgxPicaService.ctorParameters = function () { return [
        { type: NgxPicaExifService }
    ]; };
    return NgxPicaService;
}());
export { NgxPicaService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgxPicaService.prototype.picaResizer;
    /**
     * @type {?}
     * @private
     */
    NgxPicaService.prototype.MAX_STEPS;
    /**
     * @type {?}
     * @private
     */
    NgxPicaService.prototype._ngxPicaExifService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpY2Euc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BkaWdpdGFsYXNjZXRpYy9uZ3gtcGljYS8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtcGljYS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQTRCLE1BQU0sTUFBTSxDQUFDO0FBQ3pELE9BQU8sRUFBeUIsZ0JBQWdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUVyRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM3RCxPQUFPLElBQUksTUFBTSxtQkFBbUIsQ0FBQztBQUlyQztJQUtJLHdCQUFvQixtQkFBdUM7UUFBdkMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFvQjtRQUhuRCxnQkFBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDekIsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUduQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQy9DLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDeEM7SUFDTCxDQUFDOzs7Ozs7OztJQUVNLHFDQUFZOzs7Ozs7O0lBQW5CLFVBQW9CLEtBQWEsRUFBRSxLQUFhLEVBQUUsTUFBYyxFQUFFLE9BQXVDO1FBQXpHLGlCQXlDQzs7WUF4Q1MsWUFBWSxHQUFrQixJQUFJLE9BQU8sRUFBRTs7WUFDM0MsVUFBVSxHQUFXLEtBQUssQ0FBQyxNQUFNO1FBRXZDLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTs7Z0JBQ1YsVUFBUSxHQUFrQixJQUFJLE9BQU8sRUFBRTs7Z0JBQ3pDLE9BQUssR0FBRyxDQUFDOztnQkFFUCxjQUFZLEdBQWlCLFVBQVEsQ0FBQyxTQUFTOzs7O1lBQUMsVUFBQyxJQUFVO2dCQUM3RCxLQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLFNBQVM7Ozs7Z0JBQUMsVUFBQSxZQUFZO29CQUNqRSxPQUFLLEVBQUUsQ0FBQztvQkFDUixZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUVoQyxJQUFJLE9BQUssR0FBRyxVQUFVLEVBQUU7d0JBQ3BCLFVBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQUssQ0FBQyxDQUFDLENBQUM7cUJBRS9CO3lCQUFNO3dCQUNILFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQzt3QkFDeEIsY0FBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO3FCQUM5QjtnQkFDTCxDQUFDOzs7O2dCQUFFLFVBQUMsR0FBRzs7d0JBQ0csWUFBWSxHQUEwQjt3QkFDeEMsSUFBSSxFQUFFLElBQUk7d0JBQ1YsR0FBRyxFQUFFLEdBQUc7cUJBQ1g7b0JBRUQsWUFBWSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDckMsQ0FBQyxFQUFDLENBQUM7WUFDUCxDQUFDLEVBQUM7WUFFRixVQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFLLENBQUMsQ0FBQyxDQUFDO1NBQy9CO2FBQU07O2dCQUNHLFlBQVksR0FBMEI7Z0JBQ3hDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxpQkFBaUI7YUFDMUM7WUFFRCxZQUFZLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2pDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUMzQjtRQUVELE9BQU8sWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3ZDLENBQUM7Ozs7Ozs7O0lBRU0sb0NBQVc7Ozs7Ozs7SUFBbEIsVUFDSSxJQUFVLEVBQ1YsS0FBYSxFQUNiLE1BQWMsRUFDZCxPQUF1QztRQUozQyxpQkFvREM7O1lBOUNTLFlBQVksR0FBa0IsSUFBSSxPQUFPLEVBQUU7O1lBQzNDLFlBQVksR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7O1lBQ2xFLEdBQUcsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQzs7WUFDbkMsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFO1FBRXZCLElBQUksR0FBRyxFQUFFO1lBQ0wsR0FBRyxDQUFDLE1BQU07OztZQUFHO2dCQUNULEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJOzs7O2dCQUFDLFVBQUEsYUFBYTtvQkFDakUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNwQyxZQUFZLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUM7b0JBQ3pDLFlBQVksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztvQkFFM0MsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzt3QkFFN0IsU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxhQUFhLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxNQUFNLENBQUM7b0JBQ25GLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxXQUFXLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUU7OzRCQUNuRSxLQUFLLEdBQUcsQ0FBQzt3QkFFYixJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUU7NEJBQ3hDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7eUJBQ3hFOzZCQUFNOzRCQUNILEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7eUJBQ3hFO3dCQUVELEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7d0JBQzVDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUM7cUJBQ2pEOzt3QkFFSyxpQkFBaUIsR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7b0JBQzdFLGlCQUFpQixDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7b0JBQ2hDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7b0JBRWxDLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxPQUFPLENBQUM7eUJBQzFELEtBQUs7Ozs7b0JBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUF2QixDQUF1QixFQUFDO3lCQUN2QyxJQUFJOzs7O29CQUFDLFVBQUMsVUFBZ0I7d0JBQ25CLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ2xDLENBQUMsRUFBQyxDQUFDO2dCQUNYLENBQUMsRUFBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFBLENBQUM7WUFFRixHQUFHLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlDO2FBQU07WUFDSCxZQUFZLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHVDQUF1QyxDQUFDLENBQUM7U0FDaEY7UUFFRCxPQUFPLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN2QyxDQUFDOzs7Ozs7SUFFTSx1Q0FBYzs7Ozs7SUFBckIsVUFBc0IsS0FBYSxFQUFFLFFBQWdCO1FBQXJELGlCQXlDQzs7WUF4Q1MsZUFBZSxHQUFrQixJQUFJLE9BQU8sRUFBRTs7WUFDOUMsVUFBVSxHQUFXLEtBQUssQ0FBQyxNQUFNO1FBRXZDLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTs7Z0JBQ1YsVUFBUSxHQUFrQixJQUFJLE9BQU8sRUFBRTs7Z0JBQ3pDLE9BQUssR0FBRyxDQUFDOztnQkFFUCxjQUFZLEdBQWlCLFVBQVEsQ0FBQyxTQUFTOzs7O1lBQUMsVUFBQyxJQUFVO2dCQUM3RCxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxTQUFTOzs7O2dCQUFDLFVBQUEsZUFBZTtvQkFDeEQsT0FBSyxFQUFFLENBQUM7b0JBQ1IsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFFdEMsSUFBSSxPQUFLLEdBQUcsVUFBVSxFQUFFO3dCQUNwQixVQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFLLENBQUMsQ0FBQyxDQUFDO3FCQUUvQjt5QkFBTTt3QkFDSCxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQzNCLGNBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztxQkFDOUI7Z0JBQ0wsQ0FBQzs7OztnQkFBRSxVQUFDLEdBQUc7O3dCQUNHLFlBQVksR0FBMEI7d0JBQ3hDLElBQUksRUFBRSxJQUFJO3dCQUNWLEdBQUcsRUFBRSxHQUFHO3FCQUNYO29CQUVELGVBQWUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3hDLENBQUMsRUFBQyxDQUFDO1lBQ1AsQ0FBQyxFQUFDO1lBRUYsVUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBSyxDQUFDLENBQUMsQ0FBQztTQUMvQjthQUFNOztnQkFDRyxZQUFZLEdBQTBCO2dCQUN4QyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsaUJBQWlCO2FBQzFDO1lBRUQsZUFBZSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNwQyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDOUI7UUFFRCxPQUFPLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMxQyxDQUFDOzs7Ozs7SUFFTSxzQ0FBYTs7Ozs7SUFBcEIsVUFBcUIsSUFBVSxFQUFFLFFBQWdCO1FBQWpELGlCQXVDQzs7WUF0Q1MsZUFBZSxHQUFrQixJQUFJLE9BQU8sRUFBRTtRQUVwRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsRUFBRTtZQUN2QyxVQUFVOzs7WUFBQztnQkFDUCxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9CLENBQUMsRUFBQyxDQUFDO1NBQ047YUFBTTs7Z0JBRUcsY0FBWSxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQzs7Z0JBQ2xFLEtBQUcsR0FBRyxjQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQzs7Z0JBQ25DLEtBQUcsR0FBRyxJQUFJLEtBQUssRUFBRTtZQUV2QixJQUFJLEtBQUcsRUFBRTtnQkFDTCxLQUFHLENBQUMsTUFBTTs7O2dCQUFHO29CQUNULEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFHLENBQUMsQ0FBQyxJQUFJOzs7O29CQUFDLFVBQUEsYUFBYTt3QkFDakUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNwQyxjQUFZLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUM7d0JBQ3pDLGNBQVksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQzt3QkFFM0MsS0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUVuQyxLQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBWSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7NkJBQzNELEtBQUs7Ozs7d0JBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUExQixDQUEwQixFQUFDOzZCQUMxQyxJQUFJOzs7O3dCQUFDLFVBQUMsSUFBVTs7Z0NBQ1AsYUFBYSxHQUFTLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDOzRCQUU3RixlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUN4QyxDQUFDLEVBQUMsQ0FBQztvQkFDWCxDQUFDLEVBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUEsQ0FBQztnQkFFRixLQUFHLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzlDO2lCQUFNO2dCQUNILGVBQWUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsdUNBQXVDLENBQUMsQ0FBQzthQUNuRjtTQUNKO1FBRUQsT0FBTyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDMUMsQ0FBQzs7Ozs7Ozs7OztJQUVPLDJDQUFrQjs7Ozs7Ozs7O0lBQTFCLFVBQ0ksTUFBeUIsRUFDekIsSUFBWSxFQUNaLE9BQWUsRUFDZixRQUFnQixFQUNoQixJQUFZO1FBTGhCLGlCQW1CQztRQVpHLE9BQU8sSUFBSSxPQUFPOzs7OztRQUFPLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDckMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7aUJBQ3pDLEtBQUs7Ozs7WUFBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBWCxDQUFXLEVBQUM7aUJBQzNCLElBQUk7Ozs7WUFBQyxVQUFDLElBQVU7Z0JBQ2IsS0FBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUM7cUJBQy9ELEtBQUs7Ozs7Z0JBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQVgsQ0FBVyxFQUFDO3FCQUMzQixJQUFJOzs7O2dCQUFDLFVBQUMsY0FBb0I7b0JBQ3ZCLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDNUIsQ0FBQyxFQUNBLENBQUM7WUFDVixDQUFDLEVBQUMsQ0FBQztRQUNYLENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7Ozs7Ozs7OztJQUVPLGlEQUF3Qjs7Ozs7Ozs7O0lBQWhDLFVBQ0ksTUFBeUIsRUFDekIsSUFBVSxFQUNWLE9BQWUsRUFDZixRQUFnQixFQUNoQixJQUFZO1FBTGhCLGlCQXNCQztRQWZHLE9BQU8sSUFBSSxPQUFPOzs7OztRQUFPLFVBQUMsT0FBTyxFQUM3QixNQUFNO1lBRU4sSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDLFNBQVMsRUFBRTtnQkFDdkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLDhCQUE4QixDQUFDLENBQUM7YUFDM0Q7aUJBQU0sSUFBSSxLQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUU7Z0JBQzdDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqQjtpQkFBTTs7b0JBQ0csVUFBVSxHQUFXLE9BQU8sR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7O29CQUM5QyxPQUFPLEdBQVcsSUFBSSxHQUFHLENBQUM7Z0JBRWhDLDBCQUEwQjtnQkFDMUIsT0FBTyxDQUFDLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDdEY7UUFDTCxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7Ozs7OztJQUVPLG1DQUFVOzs7Ozs7OztJQUFsQixVQUFtQixJQUFVLEVBQUUsSUFBdUIsRUFBRSxFQUFxQixFQUFFLE9BQVk7UUFBM0YsaUJBVUM7UUFURyxPQUFPLElBQUksT0FBTzs7Ozs7UUFBTyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ3JDLEtBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDO2lCQUNyQyxLQUFLOzs7O1lBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQVgsQ0FBVyxFQUFDO2lCQUMzQixJQUFJOzs7O1lBQUMsVUFBQyxhQUFnQyxJQUFLLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBakQsQ0FBaUQsRUFBQztpQkFDN0YsSUFBSTs7OztZQUFDLFVBQUMsSUFBVTs7b0JBQ1AsV0FBVyxHQUFTLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUMzRixPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDekIsQ0FBQyxFQUFDLENBQUM7UUFDWCxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7Ozs7OztJQUVPLG1DQUFVOzs7Ozs7OztJQUFsQixVQUFtQixJQUFVLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxZQUFvQjtRQUMzRSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUM5RSxDQUFDOzs7Ozs7SUFFTyxrQ0FBUzs7Ozs7SUFBakIsVUFBa0IsS0FBYTtRQUMzQixPQUFPLEtBQUssR0FBRyxPQUFPLENBQUM7SUFDM0IsQ0FBQzs7Z0JBL1BKLFVBQVU7Ozs7Z0JBTEYsa0JBQWtCOztJQXFRM0IscUJBQUM7Q0FBQSxBQWhRRCxJQWdRQztTQS9QWSxjQUFjOzs7Ozs7SUFDdkIscUNBQWlDOzs7OztJQUNqQyxtQ0FBdUI7Ozs7O0lBRVgsNkNBQStDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBOZ3hQaWNhRXJyb3JJbnRlcmZhY2UsIE5neFBpY2FFcnJvclR5cGUgfSBmcm9tICcuL25neC1waWNhLWVycm9yLmludGVyZmFjZSc7XG5pbXBvcnQgeyBOZ3hQaWNhUmVzaXplT3B0aW9uc0ludGVyZmFjZSB9IGZyb20gJy4vbmd4LXBpY2EtcmVzaXplLW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IE5neFBpY2FFeGlmU2VydmljZSB9IGZyb20gJy4vbmd4LXBpY2EtZXhpZi5zZXJ2aWNlJztcbmltcG9ydCBQaWNhIGZyb20gJ3BpY2EvZGlzdC9waWNhLmpzJztcblxuZGVjbGFyZSBsZXQgd2luZG93OiBhbnk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ3hQaWNhU2VydmljZSB7XG4gICAgcHJpdmF0ZSBwaWNhUmVzaXplciA9IG5ldyBQaWNhKCk7XG4gICAgcHJpdmF0ZSBNQVhfU1RFUFMgPSAyMDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX25neFBpY2FFeGlmU2VydmljZTogTmd4UGljYUV4aWZTZXJ2aWNlKSB7XG4gICAgICAgIGlmICghdGhpcy5waWNhUmVzaXplciB8fCAhdGhpcy5waWNhUmVzaXplci5yZXNpemUpIHtcbiAgICAgICAgICAgIHRoaXMucGljYVJlc2l6ZXIgPSBuZXcgd2luZG93LlBpY2EoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyByZXNpemVJbWFnZXMoZmlsZXM6IEZpbGVbXSwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIG9wdGlvbnM/OiBOZ3hQaWNhUmVzaXplT3B0aW9uc0ludGVyZmFjZSk6IE9ic2VydmFibGU8RmlsZT4ge1xuICAgICAgICBjb25zdCByZXNpemVkSW1hZ2U6IFN1YmplY3Q8RmlsZT4gPSBuZXcgU3ViamVjdCgpO1xuICAgICAgICBjb25zdCB0b3RhbEZpbGVzOiBudW1iZXIgPSBmaWxlcy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHRvdGFsRmlsZXMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBuZXh0RmlsZTogU3ViamVjdDxGaWxlPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSAwO1xuXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5leHRGaWxlLnN1YnNjcmliZSgoZmlsZTogRmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplSW1hZ2UoZmlsZSwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucykuc3Vic2NyaWJlKGltYWdlUmVzaXplZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIHJlc2l6ZWRJbWFnZS5uZXh0KGltYWdlUmVzaXplZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgdG90YWxGaWxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEZpbGUubmV4dChmaWxlc1tpbmRleF0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNpemVkSW1hZ2UuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZ3hQaWNhRXJyb3I6IE5neFBpY2FFcnJvckludGVyZmFjZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnI6IGVyclxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc2l6ZWRJbWFnZS5lcnJvcihuZ3hQaWNhRXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG5leHRGaWxlLm5leHQoZmlsZXNbaW5kZXhdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG5neFBpY2FFcnJvcjogTmd4UGljYUVycm9ySW50ZXJmYWNlID0ge1xuICAgICAgICAgICAgICAgIGVycjogTmd4UGljYUVycm9yVHlwZS5OT19GSUxFU19SRUNFSVZFRFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVzaXplZEltYWdlLmVycm9yKG5neFBpY2FFcnJvcik7XG4gICAgICAgICAgICByZXNpemVkSW1hZ2UuY29tcGxldGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNpemVkSW1hZ2UuYXNPYnNlcnZhYmxlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2l6ZUltYWdlKFxuICAgICAgICBmaWxlOiBGaWxlLFxuICAgICAgICB3aWR0aDogbnVtYmVyLFxuICAgICAgICBoZWlnaHQ6IG51bWJlcixcbiAgICAgICAgb3B0aW9ucz86IE5neFBpY2FSZXNpemVPcHRpb25zSW50ZXJmYWNlXG4gICAgKTogT2JzZXJ2YWJsZTxGaWxlPiB7XG4gICAgICAgIGNvbnN0IHJlc2l6ZWRJbWFnZTogU3ViamVjdDxGaWxlPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgIGNvbnN0IG9yaWdpbkNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgY29uc3QgY3R4ID0gb3JpZ2luQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIGlmIChjdHgpIHtcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbmd4UGljYUV4aWZTZXJ2aWNlLmdldEV4aWZPcmllbnRlZEltYWdlKGltZykudGhlbihvcmllbnRlZEltYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwoaW1nLnNyYyk7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbkNhbnZhcy53aWR0aCA9IG9yaWVudGVkSW1hZ2Uud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbkNhbnZhcy5oZWlnaHQgPSBvcmllbnRlZEltYWdlLmhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKG9yaWVudGVkSW1hZ2UsIDAsIDApO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlRGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgb3JpZW50ZWRJbWFnZS53aWR0aCwgb3JpZW50ZWRJbWFnZS5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmFzcGVjdFJhdGlvICYmIG9wdGlvbnMuYXNwZWN0UmF0aW8ua2VlcEFzcGVjdFJhdGlvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmF0aW8gPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5hc3BlY3RSYXRpby5mb3JjZU1pbkRpbWVuc2lvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRpbyA9IE1hdGgubWF4KHdpZHRoIC8gaW1hZ2VEYXRhLndpZHRoLCBoZWlnaHQgLyBpbWFnZURhdGEuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF0aW8gPSBNYXRoLm1pbih3aWR0aCAvIGltYWdlRGF0YS53aWR0aCwgaGVpZ2h0IC8gaW1hZ2VEYXRhLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoID0gTWF0aC5yb3VuZChpbWFnZURhdGEud2lkdGggKiByYXRpbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBNYXRoLnJvdW5kKGltYWdlRGF0YS5oZWlnaHQgKiByYXRpbyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXN0aW5hdGlvbkNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25DYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb25DYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGljYVJlc2l6ZShmaWxlLCBvcmlnaW5DYW52YXMsIGRlc3RpbmF0aW9uQ2FudmFzLCBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlc2l6ZWRJbWFnZS5lcnJvcihlcnIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGltZ1Jlc2l6ZWQ6IEZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNpemVkSW1hZ2UubmV4dChpbWdSZXNpemVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaW1nLnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzaXplZEltYWdlLmVycm9yKE5neFBpY2FFcnJvclR5cGUuQ0FOVkFTX0NPTlRFWFRfSURFTlRJRklFUl9OT1RfU1VQUE9SVEVEKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNpemVkSW1hZ2UuYXNPYnNlcnZhYmxlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbXByZXNzSW1hZ2VzKGZpbGVzOiBGaWxlW10sIHNpemVJbk1COiBudW1iZXIpOiBPYnNlcnZhYmxlPEZpbGU+IHtcbiAgICAgICAgY29uc3QgY29tcHJlc3NlZEltYWdlOiBTdWJqZWN0PEZpbGU+ID0gbmV3IFN1YmplY3QoKTtcbiAgICAgICAgY29uc3QgdG90YWxGaWxlczogbnVtYmVyID0gZmlsZXMubGVuZ3RoO1xuXG4gICAgICAgIGlmICh0b3RhbEZpbGVzID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbmV4dEZpbGU6IFN1YmplY3Q8RmlsZT4gPSBuZXcgU3ViamVjdCgpO1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gMDtcblxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXh0RmlsZS5zdWJzY3JpYmUoKGZpbGU6IEZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXByZXNzSW1hZ2UoZmlsZSwgc2l6ZUluTUIpLnN1YnNjcmliZShpbWFnZUNvbXByZXNzZWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICBjb21wcmVzc2VkSW1hZ2UubmV4dChpbWFnZUNvbXByZXNzZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IHRvdGFsRmlsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRGaWxlLm5leHQoZmlsZXNbaW5kZXhdKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcHJlc3NlZEltYWdlLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbmd4UGljYUVycm9yOiBOZ3hQaWNhRXJyb3JJbnRlcmZhY2UgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyOiBlcnJcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBjb21wcmVzc2VkSW1hZ2UuZXJyb3Iobmd4UGljYUVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBuZXh0RmlsZS5uZXh0KGZpbGVzW2luZGV4XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBuZ3hQaWNhRXJyb3I6IE5neFBpY2FFcnJvckludGVyZmFjZSA9IHtcbiAgICAgICAgICAgICAgICBlcnI6IE5neFBpY2FFcnJvclR5cGUuTk9fRklMRVNfUkVDRUlWRURcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbXByZXNzZWRJbWFnZS5lcnJvcihuZ3hQaWNhRXJyb3IpO1xuICAgICAgICAgICAgY29tcHJlc3NlZEltYWdlLmNvbXBsZXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcHJlc3NlZEltYWdlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjb21wcmVzc0ltYWdlKGZpbGU6IEZpbGUsIHNpemVJbk1COiBudW1iZXIpOiBPYnNlcnZhYmxlPEZpbGU+IHtcbiAgICAgICAgY29uc3QgY29tcHJlc3NlZEltYWdlOiBTdWJqZWN0PEZpbGU+ID0gbmV3IFN1YmplY3QoKTtcblxuICAgICAgICBpZiAodGhpcy5ieXRlc1RvTUIoZmlsZS5zaXplKSA8PSBzaXplSW5NQikge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29tcHJlc3NlZEltYWdlLm5leHQoZmlsZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gb3JpZ2luQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25neFBpY2FFeGlmU2VydmljZS5nZXRFeGlmT3JpZW50ZWRJbWFnZShpbWcpLnRoZW4ob3JpZW50ZWRJbWFnZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTChpbWcuc3JjKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbkNhbnZhcy53aWR0aCA9IG9yaWVudGVkSW1hZ2Uud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5DYW52YXMuaGVpZ2h0ID0gb3JpZW50ZWRJbWFnZS5oZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2Uob3JpZW50ZWRJbWFnZSwgMCwgMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q29tcHJlc3NlZEltYWdlKG9yaWdpbkNhbnZhcywgZmlsZS50eXBlLCAxLCBzaXplSW5NQiwgMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gY29tcHJlc3NlZEltYWdlLmVycm9yKGVycikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGJsb2I6IEJsb2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW1nQ29tcHJlc3NlZDogRmlsZSA9IHRoaXMuYmxvYlRvRmlsZShibG9iLCBmaWxlLm5hbWUsIGZpbGUudHlwZSwgbmV3IERhdGUoKS5nZXRUaW1lKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXByZXNzZWRJbWFnZS5uZXh0KGltZ0NvbXByZXNzZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb21wcmVzc2VkSW1hZ2UuZXJyb3IoTmd4UGljYUVycm9yVHlwZS5DQU5WQVNfQ09OVEVYVF9JREVOVElGSUVSX05PVF9TVVBQT1JURUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbXByZXNzZWRJbWFnZS5hc09ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvbXByZXNzZWRJbWFnZShcbiAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCxcbiAgICAgICAgdHlwZTogc3RyaW5nLFxuICAgICAgICBxdWFsaXR5OiBudW1iZXIsXG4gICAgICAgIHNpemVJbk1COiBudW1iZXIsXG4gICAgICAgIHN0ZXA6IG51bWJlclxuICAgICk6IFByb21pc2U8QmxvYj4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8QmxvYj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5waWNhUmVzaXplci50b0Jsb2IoY2FudmFzLCB0eXBlLCBxdWFsaXR5KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSlcbiAgICAgICAgICAgICAgICAudGhlbigoYmxvYjogQmxvYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQ29tcHJlc3NlZEltYWdlU2l6ZShjYW52YXMsIGJsb2IsIHF1YWxpdHksIHNpemVJbk1CLCBzdGVwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGNvbXByZXNzZWRCbG9iOiBCbG9iKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjb21wcmVzc2VkQmxvYik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrQ29tcHJlc3NlZEltYWdlU2l6ZShcbiAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCxcbiAgICAgICAgYmxvYjogQmxvYixcbiAgICAgICAgcXVhbGl0eTogbnVtYmVyLFxuICAgICAgICBzaXplSW5NQjogbnVtYmVyLFxuICAgICAgICBzdGVwOiBudW1iZXJcbiAgICApOiBQcm9taXNlPEJsb2I+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPEJsb2I+KChyZXNvbHZlLFxuICAgICAgICAgICAgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChzdGVwID4gdGhpcy5NQVhfU1RFUFMpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoTmd4UGljYUVycm9yVHlwZS5OT1RfQkVfQUJMRV9UT19DT01QUkVTU19FTk9VR0gpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJ5dGVzVG9NQihibG9iLnNpemUpIDwgc2l6ZUluTUIpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGJsb2IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdRdWFsaXR5OiBudW1iZXIgPSBxdWFsaXR5IC0gKHF1YWxpdHkgKiAwLjEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1N0ZXA6IG51bWJlciA9IHN0ZXAgKyAxO1xuXG4gICAgICAgICAgICAgICAgLy8gcmVjdXJzaXZlbHkgY29tcHJlc3Npb25cbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuZ2V0Q29tcHJlc3NlZEltYWdlKGNhbnZhcywgYmxvYi50eXBlLCBuZXdRdWFsaXR5LCBzaXplSW5NQiwgbmV3U3RlcCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBpY2FSZXNpemUoZmlsZTogRmlsZSwgZnJvbTogSFRNTENhbnZhc0VsZW1lbnQsIHRvOiBIVE1MQ2FudmFzRWxlbWVudCwgb3B0aW9uczogYW55KTogUHJvbWlzZTxGaWxlPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxGaWxlPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBpY2FSZXNpemVyLnJlc2l6ZShmcm9tLCB0bywgb3B0aW9ucylcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc2l6ZWRDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSA9PiB0aGlzLnBpY2FSZXNpemVyLnRvQmxvYihyZXNpemVkQ2FudmFzLCBmaWxlLnR5cGUpKVxuICAgICAgICAgICAgICAgIC50aGVuKChibG9iOiBCbG9iKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVSZXNpemVkOiBGaWxlID0gdGhpcy5ibG9iVG9GaWxlKGJsb2IsIGZpbGUubmFtZSwgZmlsZS50eXBlLCBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmlsZVJlc2l6ZWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGJsb2JUb0ZpbGUoYmxvYjogQmxvYiwgbmFtZTogc3RyaW5nLCB0eXBlOiBzdHJpbmcsIGxhc3RNb2RpZmllZDogbnVtYmVyKTogRmlsZSB7XG4gICAgICAgIHJldHVybiBuZXcgRmlsZShbYmxvYl0sIG5hbWUsIHsgdHlwZTogdHlwZSwgbGFzdE1vZGlmaWVkOiBsYXN0TW9kaWZpZWQgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBieXRlc1RvTUIoYnl0ZXM6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gYnl0ZXMgLyAxMDQ4NTc2O1xuICAgIH1cbn1cbiJdfQ==