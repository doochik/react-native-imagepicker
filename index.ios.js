'use strict';

var React = require('react-native');
var {
    ActionSheetIOS,
    CameraRoll,
    ImagePickerIOS
} = React;

var ImagePicker = {

    /**
     * Opens ActionSheetIOS to select further action (take photo, choose last photo, choose from library).
     *
     * @param {object} config
     * @param {string} [config.cancelTitle="Cancel"] Cancel button title
     *
     * @param {object|boolean|string} [config.takePhoto] "Take photo" button config. False to disable this button.
     * @param {string} [config.takePhoto.title="Take photo"] Button title.
     * @param {string} [config.takePhoto.config={}] Config objects passed to ImagePickerIOS.openCameraDialog().
     *
     * @param {object|boolean|string} [config.useLastPhoto] "Use last photo" button config. False to disable this button.
     * @param {string} [config.useLastPhoto.title="Take photo"] Button title.
     * @param {object} [config.useLastPhoto.config={first: 1}] Config objects passed to CameraRoll.getPhotos().
     *
     * @param {object|boolean|string} [config.chooseFromLibrary] "Choose from library" button config. False to disable this button.
     * @param {string} [config.chooseFromLibrary.title="Choose from library"] Button title.
     * @param {object} [config.chooseFromLibrary.config={}] Config objects passed to ImagePickerIOS.openSelectDialog().
     *
     * @returns {Promise}
     */
    open: function (config) {
        return new Promise(function (resolve, reject) {
            var asOptions = [];
            var buttons = [];

            // extend config with defaults
            config = config || {};

            config.cancelTitle = config.cancelTitle || 'Cancel';
            asOptions.push(config.cancelTitle);
            buttons.push('cancel');

            addButton('takePhoto', {
                title: 'Take Photo',
                config: {}
            });

            addButton('useLastPhoto', {
                title: 'Use last photo',
                config: {first: 1}
            });

            addButton('chooseFromLibrary', {
                title: 'Choose from library',
                config: {}
            });

            ActionSheetIOS.showActionSheetWithOptions({
                options: asOptions,
                cancelButtonIndex: 0
            }, (index) => {
                var actionId = buttons[index];
                var buttonCfg = config[actionId];

                switch (actionId) {
                    case 'takePhoto':
                        ImagePickerIOS.openCameraDialog(buttonCfg.config, resolve, reject);
                        break;

                    case 'useLastPhoto':
                        CameraRoll.getPhotos(buttonCfg.config, function (response) {
                            var lastPhoto = response.edges[0];
                            if (lastPhoto) {
                                resolve(lastPhoto.node.image.uri);
                            } else {
                                reject('NO_PHOTOS');
                            }
                        }, reject);
                        break;

                    case 'chooseFromLibrary':
                        ImagePickerIOS.openSelectDialog(buttonCfg.config, resolve, reject);
                        break;

                    default:
                        reject();
                        break;
                }
            });

            function addButton(id, defaults) {
                var button = config[id];
                if (button) {

                    // cast to object
                    var type = typeof button;
                    if (type === 'string') {
                        button = {
                            title: button
                        };

                    } else if (type !== 'object') {
                        button = {};
                    }

                    button = Object.assign(defaults, button);
                    config[id] = button;

                    asOptions.push(button.title);
                    buttons.push(id);
                }
            }

        });
    }

};

module.exports = ImagePicker;
