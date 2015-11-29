'use strict';

var React = require('react-native');
var {
    ActionSheetIOS,
    CameraRoll,
    ImagePickerIOS
    } = React;

var ImagePicker = {

    /**
     * Open ActionSheetIOS to select further action (take photo, choose last photo, choose from library).
     * @param {object} config
     * @returns {Promise}
     */
    open: function (config) {
        return new Promise(function (resolve, reject) {
            var asOptions = [];
            var buttons = [];

            // extend config with defaults
            config = Object.assign({
                cancel: 'Cancel',
                takePhoto: 'Take Photo',
                useLastPhoto: 'Use last photo',
                chooseFromLibrary: 'Choose from library'
            }, config);
            config.cancel = config.cancel || 'Cancel';

            addButton('cancel', 'Cancel');
            addButton('takePhoto', 'Take Photo');
            addButton('useLastPhoto', 'Use last photo');
            addButton('chooseFromLibrary', 'Choose from library');

            ActionSheetIOS.showActionSheetWithOptions({
                options: asOptions,
                cancelButtonIndex: 0
            }, (index) => {
                var actionId = buttons[index];

                switch (actionId) {
                    case 'takePhoto':
                        ImagePickerIOS.openCameraDialog({}, resolve, reject);
                        break;

                    case 'useLastPhoto':
                        CameraRoll.getPhotos({first: 1}, function (response) {
                            console.log('getPhotos', 'success', response);
                            var lastPhoto = response.edges[0];
                            if (lastPhoto) {
                                resolve(node.image.uri);
                            } else {
                                reject('NO_PHOTOS');
                            }
                        }, reject);
                        break;

                    case 'chooseFromLibrary':
                        ImagePickerIOS.openSelectDialog({}, resolve, reject);
                        break;
                }
            });

            function addButton(id, defaultTitle) {
                if (config[id]) {
                    config[id] = config[id] || defaultTitle;

                    asOptions.push(config[id]);
                    buttons.push(id);
                }
            }

        });
    }

};

module.exports = ImagePicker;
