'use strict';

import {
    ActionSheetIOS,
    CameraRoll,
    ImagePickerIOS
} from 'react-native';

const ImagePicker = {

    /**
     * Opens ActionSheetIOS to select further action (take photo, choose last photo, choose from library).
     *
     * @param {object} config
     * @param {string} [config.cancelTitle="Cancel"] Cancel button title
     *
     * @param {object|boolean|string} [config.takePhoto] "Take photo" button config. False to disable this button.
     * @param {string} [config.takePhoto.title="Take photo"] Button title.
     * @param {string} [config.takePhoto.saveToCameraRoll=true] Save photo to Camera roll.
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
    open(config) {
        return new Promise(function (resolve, reject) {
            const asOptions = [];
            const buttons = [];

            // extend config with defaults
            config = config || {};

            config.cancelTitle = config.cancelTitle || 'Cancel';
            asOptions.push(config.cancelTitle);
            buttons.push('cancel');

            addButton('takePhoto', {
                title: 'Take Photo',
                saveToCameraRoll: true,
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
                const actionId = buttons[index];
                const buttonCfg = config[actionId];

                switch (actionId) {
                    case 'takePhoto':
                        ImagePicker.openCameraDialog(buttonCfg).then(resolve, reject);
                        break;

                    case 'useLastPhoto':
                        CameraRoll.getPhotos(buttonCfg.config)
                            .then(function (response) {
                                const lastPhoto = response.edges[0];
                                if (lastPhoto) {
                                    const image = lastPhoto.node.image;
                                    resolve({
                                        uri: image.uri,
                                        height: image.height,
                                        width: image.width,
                                    });
                                } else {
                                    reject('NO_PHOTOS');
                                }
                            },
                            reject);
                        break;

                    case 'chooseFromLibrary':
                        ImagePicker.openSelectDialog(buttonCfg).then(resolve, reject);
                        break;

                    default:
                        reject();
                        break;
                }
            });

            function addButton(id, defaults) {
                let button = config[id];
                if (button) {

                    // cast to object
                    const type = typeof button;
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
    },

    /**
     * Open camera dialog with ImagePickerIOS.openCameraDialog().
     * @param {object} [cameraDialogConfig={}] Config.
     * @param {string} [cameraDialogConfig.saveToCameraRoll=false] Save photo to Camera roll.
     * @param {string} [cameraDialogConfig.config={}] Config objects passed to ImagePickerIOS.openCameraDialog().
     * @returns {Promise}
     */
    openCameraDialog(cameraDialogConfig = {}) {
        return new Promise((resolve, reject) => {
            ImagePickerIOS.canUseCamera((response) => {
                if (response) {
                    ImagePickerIOS.openCameraDialog(cameraDialogConfig.config || {}, (uri, height, width) => {
                        if (cameraDialogConfig.saveToCameraRoll) {
                            CameraRoll.saveToCameraRoll(uri);
                        }

                        resolve({ uri, height, width });
                    }, reject);
                } else {
                    reject('CAMERA_UNAVAILABLE');
                }
            });
        });
    },

    /**
     * Open select dialog with ImagePickerIOS.openSelectDialog().
     * @param {object} [selectDialogConfig={}] Config.
     * @param {string} [selectDialogConfig.config={}] Config objects passed to ImagePickerIOS.openSelectDialog().
     * @returns {Promise}
     */
    openSelectDialog(selectDialogConfig) {
        return new Promise((resolve, reject) => {
            ImagePickerIOS.openSelectDialog(selectDialogConfig.config || {}, (uri, height, width) => {
                resolve({ uri, height, width });
            }, reject);
        });
    },

};

export default ImagePicker;
