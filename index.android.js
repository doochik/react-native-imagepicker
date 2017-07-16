'use strict';

const ImagePicker = {

    open() {
        return new Promise(function (resolve, reject) {
            reject('NOT_IMPLEMENTED_FOR_ANDROID');
        });
    }

};

export default ImagePicker;
