/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxPicaErrorType } from './ngx-pica-error.interface';
import { NgxPicaExifService } from './ngx-pica-exif.service';
import Pica from 'pica/dist/pica.js';
export class NgxPicaService {
    /**
     * @param {?} _ngxPicaExifService
     */
    constructor(_ngxPicaExifService) {
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
    resizeImages(files, width, height, options) {
        /** @type {?} */
        const resizedImage = new Subject();
        /** @type {?} */
        const totalFiles = files.length;
        if (totalFiles > 0) {
            /** @type {?} */
            const nextFile = new Subject();
            /** @type {?} */
            let index = 0;
            /** @type {?} */
            const subscription = nextFile.subscribe((/**
             * @param {?} file
             * @return {?}
             */
            (file) => {
                this.resizeImage(file, width, height, options).subscribe((/**
                 * @param {?} imageResized
                 * @return {?}
                 */
                imageResized => {
                    index++;
                    resizedImage.next(imageResized);
                    if (index < totalFiles) {
                        nextFile.next(files[index]);
                    }
                    else {
                        resizedImage.complete();
                        subscription.unsubscribe();
                    }
                }), (/**
                 * @param {?} err
                 * @return {?}
                 */
                (err) => {
                    /** @type {?} */
                    const ngxPicaError = {
                        file: file,
                        err: err
                    };
                    resizedImage.error(ngxPicaError);
                }));
            }));
            nextFile.next(files[index]);
        }
        else {
            /** @type {?} */
            const ngxPicaError = {
                err: NgxPicaErrorType.NO_FILES_RECEIVED
            };
            resizedImage.error(ngxPicaError);
            resizedImage.complete();
        }
        return resizedImage.asObservable();
    }
    /**
     * @param {?} file
     * @param {?} width
     * @param {?} height
     * @param {?=} options
     * @return {?}
     */
    resizeImage(file, width, height, options) {
        /** @type {?} */
        const resizedImage = new Subject();
        /** @type {?} */
        const originCanvas = document.createElement('canvas');
        /** @type {?} */
        const ctx = originCanvas.getContext('2d');
        /** @type {?} */
        const img = new Image();
        if (ctx) {
            img.onload = (/**
             * @return {?}
             */
            () => {
                this._ngxPicaExifService.getExifOrientedImage(img).then((/**
                 * @param {?} orientedImage
                 * @return {?}
                 */
                orientedImage => {
                    window.URL.revokeObjectURL(img.src);
                    originCanvas.width = orientedImage.width;
                    originCanvas.height = orientedImage.height;
                    ctx.drawImage(orientedImage, 0, 0);
                    /** @type {?} */
                    const imageData = ctx.getImageData(0, 0, orientedImage.width, orientedImage.height);
                    if (options && options.aspectRatio && options.aspectRatio.keepAspectRatio) {
                        /** @type {?} */
                        let ratio = 0;
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
                    const destinationCanvas = document.createElement('canvas');
                    destinationCanvas.width = width;
                    destinationCanvas.height = height;
                    this.picaResize(file, originCanvas, destinationCanvas, options)
                        .catch((/**
                     * @param {?} err
                     * @return {?}
                     */
                    (err) => resizedImage.error(err)))
                        .then((/**
                     * @param {?} imgResized
                     * @return {?}
                     */
                    (imgResized) => {
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
    }
    /**
     * @param {?} files
     * @param {?} sizeInMB
     * @return {?}
     */
    compressImages(files, sizeInMB) {
        /** @type {?} */
        const compressedImage = new Subject();
        /** @type {?} */
        const totalFiles = files.length;
        if (totalFiles > 0) {
            /** @type {?} */
            const nextFile = new Subject();
            /** @type {?} */
            let index = 0;
            /** @type {?} */
            const subscription = nextFile.subscribe((/**
             * @param {?} file
             * @return {?}
             */
            (file) => {
                this.compressImage(file, sizeInMB).subscribe((/**
                 * @param {?} imageCompressed
                 * @return {?}
                 */
                imageCompressed => {
                    index++;
                    compressedImage.next(imageCompressed);
                    if (index < totalFiles) {
                        nextFile.next(files[index]);
                    }
                    else {
                        compressedImage.complete();
                        subscription.unsubscribe();
                    }
                }), (/**
                 * @param {?} err
                 * @return {?}
                 */
                (err) => {
                    /** @type {?} */
                    const ngxPicaError = {
                        file: file,
                        err: err
                    };
                    compressedImage.error(ngxPicaError);
                }));
            }));
            nextFile.next(files[index]);
        }
        else {
            /** @type {?} */
            const ngxPicaError = {
                err: NgxPicaErrorType.NO_FILES_RECEIVED
            };
            compressedImage.error(ngxPicaError);
            compressedImage.complete();
        }
        return compressedImage.asObservable();
    }
    /**
     * @param {?} file
     * @param {?} sizeInMB
     * @return {?}
     */
    compressImage(file, sizeInMB) {
        /** @type {?} */
        const compressedImage = new Subject();
        if (this.bytesToMB(file.size) <= sizeInMB) {
            setTimeout((/**
             * @return {?}
             */
            () => {
                compressedImage.next(file);
            }));
        }
        else {
            /** @type {?} */
            const originCanvas = document.createElement('canvas');
            /** @type {?} */
            const ctx = originCanvas.getContext('2d');
            /** @type {?} */
            const img = new Image();
            if (ctx) {
                img.onload = (/**
                 * @return {?}
                 */
                () => {
                    this._ngxPicaExifService.getExifOrientedImage(img).then((/**
                     * @param {?} orientedImage
                     * @return {?}
                     */
                    orientedImage => {
                        window.URL.revokeObjectURL(img.src);
                        originCanvas.width = orientedImage.width;
                        originCanvas.height = orientedImage.height;
                        ctx.drawImage(orientedImage, 0, 0);
                        this.getCompressedImage(originCanvas, file.type, 1, sizeInMB, 0)
                            .catch((/**
                         * @param {?} err
                         * @return {?}
                         */
                        (err) => compressedImage.error(err)))
                            .then((/**
                         * @param {?} blob
                         * @return {?}
                         */
                        (blob) => {
                            /** @type {?} */
                            const imgCompressed = this.blobToFile(blob, file.name, file.type, new Date().getTime());
                            compressedImage.next(imgCompressed);
                        }));
                    }));
                });
                img.src = window.URL.createObjectURL(file);
            }
            else {
                compressedImage.error(NgxPicaErrorType.CANVAS_CONTEXT_IDENTIFIER_NOT_SUPPORTED);
            }
        }
        return compressedImage.asObservable();
    }
    /**
     * @private
     * @param {?} canvas
     * @param {?} type
     * @param {?} quality
     * @param {?} sizeInMB
     * @param {?} step
     * @return {?}
     */
    getCompressedImage(canvas, type, quality, sizeInMB, step) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.picaResizer.toBlob(canvas, type, quality)
                .catch((/**
             * @param {?} err
             * @return {?}
             */
            (err) => reject(err)))
                .then((/**
             * @param {?} blob
             * @return {?}
             */
            (blob) => {
                this.checkCompressedImageSize(canvas, blob, quality, sizeInMB, step)
                    .catch((/**
                 * @param {?} err
                 * @return {?}
                 */
                (err) => reject(err)))
                    .then((/**
                 * @param {?} compressedBlob
                 * @return {?}
                 */
                (compressedBlob) => {
                    resolve(compressedBlob);
                }));
            }));
        }));
    }
    /**
     * @private
     * @param {?} canvas
     * @param {?} blob
     * @param {?} quality
     * @param {?} sizeInMB
     * @param {?} step
     * @return {?}
     */
    checkCompressedImageSize(canvas, blob, quality, sizeInMB, step) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            if (step > this.MAX_STEPS) {
                reject(NgxPicaErrorType.NOT_BE_ABLE_TO_COMPRESS_ENOUGH);
            }
            else if (this.bytesToMB(blob.size) < sizeInMB) {
                resolve(blob);
            }
            else {
                /** @type {?} */
                const newQuality = quality - (quality * 0.1);
                /** @type {?} */
                const newStep = step + 1;
                // recursively compression
                resolve(this.getCompressedImage(canvas, blob.type, newQuality, sizeInMB, newStep));
            }
        }));
    }
    /**
     * @private
     * @param {?} file
     * @param {?} from
     * @param {?} to
     * @param {?} options
     * @return {?}
     */
    picaResize(file, from, to, options) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.picaResizer.resize(from, to, options)
                .catch((/**
             * @param {?} err
             * @return {?}
             */
            (err) => reject(err)))
                .then((/**
             * @param {?} resizedCanvas
             * @return {?}
             */
            (resizedCanvas) => this.picaResizer.toBlob(resizedCanvas, file.type)))
                .then((/**
             * @param {?} blob
             * @return {?}
             */
            (blob) => {
                /** @type {?} */
                const fileResized = this.blobToFile(blob, file.name, file.type, new Date().getTime());
                resolve(fileResized);
            }));
        }));
    }
    /**
     * @private
     * @param {?} blob
     * @param {?} name
     * @param {?} type
     * @param {?} lastModified
     * @return {?}
     */
    blobToFile(blob, name, type, lastModified) {
        return new File([blob], name, { type: type, lastModified: lastModified });
    }
    /**
     * @private
     * @param {?} bytes
     * @return {?}
     */
    bytesToMB(bytes) {
        return bytes / 1048576;
    }
}
NgxPicaService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
NgxPicaService.ctorParameters = () => [
    { type: NgxPicaExifService }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpY2Euc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BkaWdpdGFsYXNjZXRpYy9uZ3gtcGljYS8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtcGljYS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQTRCLE1BQU0sTUFBTSxDQUFDO0FBQ3pELE9BQU8sRUFBeUIsZ0JBQWdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUVyRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM3RCxPQUFPLElBQUksTUFBTSxtQkFBbUIsQ0FBQztBQUtyQyxNQUFNLE9BQU8sY0FBYzs7OztJQUl2QixZQUFvQixtQkFBdUM7UUFBdkMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFvQjtRQUhuRCxnQkFBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDekIsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUduQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQy9DLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDeEM7SUFDTCxDQUFDOzs7Ozs7OztJQUVNLFlBQVksQ0FBQyxLQUFhLEVBQUUsS0FBYSxFQUFFLE1BQWMsRUFBRSxPQUF1Qzs7Y0FDL0YsWUFBWSxHQUFrQixJQUFJLE9BQU8sRUFBRTs7Y0FDM0MsVUFBVSxHQUFXLEtBQUssQ0FBQyxNQUFNO1FBRXZDLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTs7a0JBQ1YsUUFBUSxHQUFrQixJQUFJLE9BQU8sRUFBRTs7Z0JBQ3pDLEtBQUssR0FBRyxDQUFDOztrQkFFUCxZQUFZLEdBQWlCLFFBQVEsQ0FBQyxTQUFTOzs7O1lBQUMsQ0FBQyxJQUFV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QUFFLE9BQU8sQ0FBQztpQkFDckMsS0FBSzs7OztZQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUM7aUJBQzNCLElBQUk7Ozs7WUFBQyxDQUFDLGFBQWdDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUM7aUJBQzdGLElBQUk7Ozs7WUFBQyxDQUFDLElBQVUsRUFBRSxFQUFFOztzQkFDWCxXQUFXLEdBQVMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzNGLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6QixDQUFDLEVBQUMsQ0FBQztRQUNYLENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7Ozs7Ozs7O0lBRU8sVUFBVSxDQUFDLElBQVUsRUFBRSxJQUFZLEVBQUUsSUFBWSxFQUFFLFlBQW9CO1FBQzNFLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBQzlFLENBQUM7Ozs7OztJQUVPLFNBQVMsQ0FBQyxLQUFhO1FBQzNCLE9BQU8sS0FBSyxHQUFHLE9BQU8sQ0FBQztJQUMzQixDQUFDOzs7WUEvUEosVUFBVTs7OztZQUxGLGtCQUFrQjs7Ozs7OztJQU92QixxQ0FBaUM7Ozs7O0lBQ2pDLG1DQUF1Qjs7Ozs7SUFFWCw2Q0FBK0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE5neFBpY2FFcnJvckludGVyZmFjZSwgTmd4UGljYUVycm9yVHlwZSB9IGZyb20gJy4vbmd4LXBpY2EtZXJyb3IuaW50ZXJmYWNlJztcbmltcG9ydCB7IE5neFBpY2FSZXNpemVPcHRpb25zSW50ZXJmYWNlIH0gZnJvbSAnLi9uZ3gtcGljYS1yZXNpemUtb3B0aW9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgTmd4UGljYUV4aWZTZXJ2aWNlIH0gZnJvbSAnLi9uZ3gtcGljYS1leGlmLnNlcnZpY2UnO1xuaW1wb3J0IFBpY2EgZnJvbSAncGljYS9kaXN0L3BpY2EuanMnO1xuXG5kZWNsYXJlIGxldCB3aW5kb3c6IGFueTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5neFBpY2FTZXJ2aWNlIHtcbiAgICBwcml2YXRlIHBpY2FSZXNpemVyID0gbmV3IFBpY2EoKTtcbiAgICBwcml2YXRlIE1BWF9TVEVQUyA9IDIwO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfbmd4UGljYUV4aWZTZXJ2aWNlOiBOZ3hQaWNhRXhpZlNlcnZpY2UpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBpY2FSZXNpemVyIHx8ICF0aGlzLnBpY2FSZXNpemVyLnJlc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5waWNhUmVzaXplciA9IG5ldyB3aW5kb3cuUGljYSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2l6ZUltYWdlcyhmaWxlczogRmlsZVtdLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgb3B0aW9ucz86IE5neFBpY2FSZXNpemVPcHRpb25zSW50ZXJmYWNlKTogT2JzZXJ2YWJsZTxGaWxlPiB7XG4gICAgICAgIGNvbnN0IHJlc2l6ZWRJbWFnZTogU3ViamVjdDxGaWxlPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgIGNvbnN0IHRvdGFsRmlsZXM6IG51bWJlciA9IGZpbGVzLmxlbmd0aDtcblxuICAgICAgICBpZiAodG90YWxGaWxlcyA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHRGaWxlOiBTdWJqZWN0PEZpbGU+ID0gbmV3IFN1YmplY3QoKTtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IDA7XG5cbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gbmV4dEZpbGUuc3Vic2NyaWJlKChmaWxlOiBGaWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemVJbWFnZShmaWxlLCB3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKS5zdWJzY3JpYmUoaW1hZ2VSZXNpemVkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgcmVzaXplZEltYWdlLm5leHQoaW1hZ2VSZXNpemVkKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCB0b3RhbEZpbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0RmlsZS5uZXh0KGZpbGVzW2luZGV4XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc2l6ZWRJbWFnZS5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5neFBpY2FFcnJvcjogTmd4UGljYUVycm9ySW50ZXJmYWNlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycjogZXJyXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzaXplZEltYWdlLmVycm9yKG5neFBpY2FFcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbmV4dEZpbGUubmV4dChmaWxlc1tpbmRleF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgbmd4UGljYUVycm9yOiBOZ3hQaWNhRXJyb3JJbnRlcmZhY2UgPSB7XG4gICAgICAgICAgICAgICAgZXJyOiBOZ3hQaWNhRXJyb3JUeXBlLk5PX0ZJTEVTX1JFQ0VJVkVEXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXNpemVkSW1hZ2UuZXJyb3Iobmd4UGljYUVycm9yKTtcbiAgICAgICAgICAgIHJlc2l6ZWRJbWFnZS5jb21wbGV0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc2l6ZWRJbWFnZS5hc09ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzaXplSW1hZ2UoXG4gICAgICAgIGZpbGU6IEZpbGUsXG4gICAgICAgIHdpZHRoOiBudW1iZXIsXG4gICAgICAgIGhlaWdodDogbnVtYmVyLFxuICAgICAgICBvcHRpb25zPzogTmd4UGljYVJlc2l6ZU9wdGlvbnNJbnRlcmZhY2VcbiAgICApOiBPYnNlcnZhYmxlPEZpbGU+IHtcbiAgICAgICAgY29uc3QgcmVzaXplZEltYWdlOiBTdWJqZWN0PEZpbGU+ID0gbmV3IFN1YmplY3QoKTtcbiAgICAgICAgY29uc3Qgb3JpZ2luQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICBjb25zdCBjdHggPSBvcmlnaW5DYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZ3hQaWNhRXhpZlNlcnZpY2UuZ2V0RXhpZk9yaWVudGVkSW1hZ2UoaW1nKS50aGVuKG9yaWVudGVkSW1hZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTChpbWcuc3JjKTtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luQ2FudmFzLndpZHRoID0gb3JpZW50ZWRJbWFnZS53aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luQ2FudmFzLmhlaWdodCA9IG9yaWVudGVkSW1hZ2UuaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2Uob3JpZW50ZWRJbWFnZSwgMCwgMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCBvcmllbnRlZEltYWdlLndpZHRoLCBvcmllbnRlZEltYWdlLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuYXNwZWN0UmF0aW8gJiYgb3B0aW9ucy5hc3BlY3RSYXRpby5rZWVwQXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByYXRpbyA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmFzcGVjdFJhdGlvLmZvcmNlTWluRGltZW5zaW9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdGlvID0gTWF0aC5tYXgod2lkdGggLyBpbWFnZURhdGEud2lkdGgsIGhlaWdodCAvIGltYWdlRGF0YS5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRpbyA9IE1hdGgubWluKHdpZHRoIC8gaW1hZ2VEYXRhLndpZHRoLCBoZWlnaHQgLyBpbWFnZURhdGEuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggPSBNYXRoLnJvdW5kKGltYWdlRGF0YS53aWR0aCAqIHJhdGlvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IE1hdGgucm91bmQoaW1hZ2VEYXRhLmhlaWdodCAqIHJhdGlvKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbkNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbkNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5waWNhUmVzaXplKGZpbGUsIG9yaWdpbkNhbnZhcywgZGVzdGluYXRpb25DYW52YXMsIG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVzaXplZEltYWdlLmVycm9yKGVycikpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoaW1nUmVzaXplZDogRmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc2l6ZWRJbWFnZS5uZXh0KGltZ1Jlc2l6ZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpbWcuc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNpemVkSW1hZ2UuZXJyb3IoTmd4UGljYUVycm9yVHlwZS5DQU5WQVNfQ09OVEVYVF9JREVOVElGSUVSX05PVF9TVVBQT1JURUQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc2l6ZWRJbWFnZS5hc09ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29tcHJlc3NJbWFnZXMoZmlsZXM6IEZpbGVbXSwgc2l6ZUluTUI6IG51bWJlcik6IE9ic2VydmFibGU8RmlsZT4ge1xuICAgICAgICBjb25zdCBjb21wcmVzc2VkSW1hZ2U6IFN1YmplY3Q8RmlsZT4gPSBuZXcgU3ViamVjdCgpO1xuICAgICAgICBjb25zdCB0b3RhbEZpbGVzOiBudW1iZXIgPSBmaWxlcy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHRvdGFsRmlsZXMgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBuZXh0RmlsZTogU3ViamVjdDxGaWxlPiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSAwO1xuXG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5leHRGaWxlLnN1YnNjcmliZSgoZmlsZTogRmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHJlc3NJbWFnZShmaWxlLCBzaXplSW5NQikuc3Vic2NyaWJlKGltYWdlQ29tcHJlc3NlZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIGNvbXByZXNzZWRJbWFnZS5uZXh0KGltYWdlQ29tcHJlc3NlZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgdG90YWxGaWxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEZpbGUubmV4dChmaWxlc1tpbmRleF0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wcmVzc2VkSW1hZ2UuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZ3hQaWNhRXJyb3I6IE5neFBpY2FFcnJvckludGVyZmFjZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnI6IGVyclxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXByZXNzZWRJbWFnZS5lcnJvcihuZ3hQaWNhRXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG5leHRGaWxlLm5leHQoZmlsZXNbaW5kZXhdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG5neFBpY2FFcnJvcjogTmd4UGljYUVycm9ySW50ZXJmYWNlID0ge1xuICAgICAgICAgICAgICAgIGVycjogTmd4UGljYUVycm9yVHlwZS5OT19GSUxFU19SRUNFSVZFRFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29tcHJlc3NlZEltYWdlLmVycm9yKG5neFBpY2FFcnJvcik7XG4gICAgICAgICAgICBjb21wcmVzc2VkSW1hZ2UuY29tcGxldGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb21wcmVzc2VkSW1hZ2UuYXNPYnNlcnZhYmxlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbXByZXNzSW1hZ2UoZmlsZTogRmlsZSwgc2l6ZUluTUI6IG51bWJlcik6IE9ic2VydmFibGU8RmlsZT4ge1xuICAgICAgICBjb25zdCBjb21wcmVzc2VkSW1hZ2U6IFN1YmplY3Q8RmlsZT4gPSBuZXcgU3ViamVjdCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmJ5dGVzVG9NQihmaWxlLnNpemUpIDw9IHNpemVJbk1CKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb21wcmVzc2VkSW1hZ2UubmV4dChmaWxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBjb25zdCBvcmlnaW5DYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgICBjb25zdCBjdHggPSBvcmlnaW5DYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmd4UGljYUV4aWZTZXJ2aWNlLmdldEV4aWZPcmllbnRlZEltYWdlKGltZykudGhlbihvcmllbnRlZEltYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGltZy5zcmMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luQ2FudmFzLndpZHRoID0gb3JpZW50ZWRJbWFnZS53aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbkNhbnZhcy5oZWlnaHQgPSBvcmllbnRlZEltYWdlLmhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShvcmllbnRlZEltYWdlLCAwLCAwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb21wcmVzc2VkSW1hZ2Uob3JpZ2luQ2FudmFzLCBmaWxlLnR5cGUsIDEsIHNpemVJbk1CLCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiBjb21wcmVzc2VkSW1hZ2UuZXJyb3IoZXJyKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoYmxvYjogQmxvYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWdDb21wcmVzc2VkOiBGaWxlID0gdGhpcy5ibG9iVG9GaWxlKGJsb2IsIGZpbGUubmFtZSwgZmlsZS50eXBlLCBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcHJlc3NlZEltYWdlLm5leHQoaW1nQ29tcHJlc3NlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpbWcuc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbXByZXNzZWRJbWFnZS5lcnJvcihOZ3hQaWNhRXJyb3JUeXBlLkNBTlZBU19DT05URVhUX0lERU5USUZJRVJfTk9UX1NVUFBPUlRFRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcHJlc3NlZEltYWdlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q29tcHJlc3NlZEltYWdlKFxuICAgICAgICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxuICAgICAgICB0eXBlOiBzdHJpbmcsXG4gICAgICAgIHF1YWxpdHk6IG51bWJlcixcbiAgICAgICAgc2l6ZUluTUI6IG51bWJlcixcbiAgICAgICAgc3RlcDogbnVtYmVyXG4gICAgKTogUHJvbWlzZTxCbG9iPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxCbG9iPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBpY2FSZXNpemVyLnRvQmxvYihjYW52YXMsIHR5cGUsIHF1YWxpdHkpXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKVxuICAgICAgICAgICAgICAgIC50aGVuKChibG9iOiBCbG9iKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDb21wcmVzc2VkSW1hZ2VTaXplKGNhbnZhcywgYmxvYiwgcXVhbGl0eSwgc2l6ZUluTUIsIHN0ZXApXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoY29tcHJlc3NlZEJsb2I6IEJsb2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvbXByZXNzZWRCbG9iKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tDb21wcmVzc2VkSW1hZ2VTaXplKFxuICAgICAgICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxuICAgICAgICBibG9iOiBCbG9iLFxuICAgICAgICBxdWFsaXR5OiBudW1iZXIsXG4gICAgICAgIHNpemVJbk1COiBudW1iZXIsXG4gICAgICAgIHN0ZXA6IG51bWJlclxuICAgICk6IFByb21pc2U8QmxvYj4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8QmxvYj4oKHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgaWYgKHN0ZXAgPiB0aGlzLk1BWF9TVEVQUykge1xuICAgICAgICAgICAgICAgIHJlamVjdChOZ3hQaWNhRXJyb3JUeXBlLk5PVF9CRV9BQkxFX1RPX0NPTVBSRVNTX0VOT1VHSCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYnl0ZXNUb01CKGJsb2Iuc2l6ZSkgPCBzaXplSW5NQikge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoYmxvYik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1F1YWxpdHk6IG51bWJlciA9IHF1YWxpdHkgLSAocXVhbGl0eSAqIDAuMSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U3RlcDogbnVtYmVyID0gc3RlcCArIDE7XG5cbiAgICAgICAgICAgICAgICAvLyByZWN1cnNpdmVseSBjb21wcmVzc2lvblxuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5nZXRDb21wcmVzc2VkSW1hZ2UoY2FudmFzLCBibG9iLnR5cGUsIG5ld1F1YWxpdHksIHNpemVJbk1CLCBuZXdTdGVwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGljYVJlc2l6ZShmaWxlOiBGaWxlLCBmcm9tOiBIVE1MQ2FudmFzRWxlbWVudCwgdG86IEhUTUxDYW52YXNFbGVtZW50LCBvcHRpb25zOiBhbnkpOiBQcm9taXNlPEZpbGU+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPEZpbGU+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGljYVJlc2l6ZXIucmVzaXplKGZyb20sIHRvLCBvcHRpb25zKVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzaXplZENhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpID0+IHRoaXMucGljYVJlc2l6ZXIudG9CbG9iKHJlc2l6ZWRDYW52YXMsIGZpbGUudHlwZSkpXG4gICAgICAgICAgICAgICAgLnRoZW4oKGJsb2I6IEJsb2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZVJlc2l6ZWQ6IEZpbGUgPSB0aGlzLmJsb2JUb0ZpbGUoYmxvYiwgZmlsZS5uYW1lLCBmaWxlLnR5cGUsIG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmaWxlUmVzaXplZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYmxvYlRvRmlsZShibG9iOiBCbG9iLCBuYW1lOiBzdHJpbmcsIHR5cGU6IHN0cmluZywgbGFzdE1vZGlmaWVkOiBudW1iZXIpOiBGaWxlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGaWxlKFtibG9iXSwgbmFtZSwgeyB0eXBlOiB0eXBlLCBsYXN0TW9kaWZpZWQ6IGxhc3RNb2RpZmllZCB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGJ5dGVzVG9NQihieXRlczogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBieXRlcyAvIDEwNDg1NzY7XG4gICAgfVxufVxuIl19