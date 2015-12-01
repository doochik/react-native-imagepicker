# react-native-imagepicker

A React Native module which wraps [ActionSheetIOS](http://facebook.github.io/react-native/docs/actionsheetios.html#content),
 [CameraRoll](http://facebook.github.io/react-native/docs/cameraroll.html#content) and
 undocummented [ImagePickerIOS](https://github.com/facebook/react-native/blob/master/Libraries/CameraRoll/ImagePickerIOS.js)
 to select a photo from the library or camera. No external plugins needed.
 
## Setup

1. `npm install react-native-imagepicker` 
2. You need to include the RCTCameraRoll.xcodeproj in your project Libraries, and then make sure libRCTCameraRoll.a is included under "Link Binary With Libraries" in the Build Phases tab. See more docs on [Linking Libraries page](http://facebook.github.io/react-native/docs/linking-libraries-ios.html#content).
3. Current version of react-native has 2 bugs ([#4411](https://github.com/facebook/react-native/pull/4412), [#4412](https://github.com/facebook/react-native/pull/4412)).
   So you need to replace file `/Libraries/CameraRoll/RCTImagePickerManager.m` with [this one](https://github.com/facebook/react-native/blob/d08727d99fa07caabcb1fb37cf91de9a47e13b82/Libraries/CameraRoll/RCTImagePickerManager.m)
   until new version will be released. 

## Usage

```js
var imagePicker = require('react-native-imagepicker');

imagePicker.open({
    takePhoto: true,
    useLastPhoto: true,
    chooseFromLibrary: true
}).then(function(imageUri) {
    console.log('imageUri', imageUri);
}, function() {
    console.log('user cancel');
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
var imagePicker = require('react-native-imagepicker');

imagePicker.open({
    takePhoto: 'Custom title',  // Shorthand for custom title
    useLastPhoto: false, // disable this button
    chooseFromLibrary: true // get default values
})
```

## `imageUri` usage

`imageUri` from Promise can be directly passed to `<Image/>` or `FormData`

```js
...
render() {
    <Image source={uri: imageUri, isStatic: true}/>
} 
...
```

```js
var fd = new FormData();

fd.append('photo', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg'
});
```
