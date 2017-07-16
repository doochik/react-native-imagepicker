# react-native-imagepicker

A React Native module which wraps [ActionSheetIOS](https://facebook.github.io/react-native/docs/actionsheetios.html),
 [CameraRoll](https://facebook.github.io/react-native/docs/cameraroll.html) and
 [ImagePickerIOS](https://facebook.github.io/react-native/docs/imagepickerios.html)
 to select a photo from the PhotoLibrary or CameraRoll. No external plugins needed.
 
## Setup

1. `npm install --save react-native-imagepicker` 
2. [Setup CameraRoll](http://facebook.github.io/react-native/releases/docs/cameraroll.html)

## Usage

Basics

```js
const imagePicker = require('react-native-imagepicker');
imagePicker.open({
    takePhoto: true,
    useLastPhoto: true,
    chooseFromLibrary: true
}).then(({ uri, width, height }) => {
    console.log('image asset', uri, width, height);
}, (error) => {
    // Typically, user cancel  
    console.log('error', error);
});

```
 
Each button (`takePhoto`, `useLastPhoto`, `chooseFromLibrary`) can be configure in following way

```js
imagePicker.open({
    cancelTitle: 'Your custom title',
    takePhoto: {
        title: 'Your custom title',
        config: { /* Config object to ImagePickerIOS.openCameraDialog() */ }
    },
    useLastPhoto: {
        title: 'Your custom title',
        config: { /* Config object to CameraRoll.getPhotos() */ }
    },
    chooseFromLibrary: {
        title: 'Your custom title',
        config: { /* Config object to ImagePickerIOS.openSelectDialog() */ }
    },
    ...
})
```

Also you can disable some of buttons

```js
const imagePicker = require('react-native-imagepicker');

imagePicker.open({
    takePhoto: 'Custom title',  // Shorthand for custom title
    useLastPhoto: false, // disable this button
    chooseFromLibrary: true // get default values
})
```

## `uri` usage

`uri` can be directly passed to `<Image/>` or `FormData`

```js
...
render() {
    <Image source={{ uri: uri, isStatic: true }}/>
} 
...
```

```js
const fd = new FormData();
fd.append('photo', {
    uri: uri,
    type: 'image/jpeg',
    name: 'photo.jpg'
});
```

## Known bugs

1. ImagePickerIOS take photo with wrong orientation [#12249](https://github.com/facebook/react-native/pull/12249).
 You can replace `RCTImagePickerManager.m` with version from PR.
