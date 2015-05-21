// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var osname = Ti.Platform.osname;

var isIos = (osname === 'iphone' || osname === 'ipad');
var isAndroid = (osname === 'android');

var sdkVersion = parseFloat(Ti.version);

var indicatorAdded = false;

var ActivityIndicatorStyle;
if (isIos) {
	ActivityIndicatorStyle = Titanium.UI.iPhone.ActivityIndicatorStyle;
} else if (sdkVersion >= 3.0){
	ActivityIndicatorStyle = Titanium.UI.ActivityIndicatorStyle;
}

var actInd = Titanium.UI.createActivityIndicator({
	width : Ti.UI.SIZE,
	height : Ti.UI.SIZE
});
if (ActivityIndicatorStyle) {
	actInd.style = ActivityIndicatorStyle.PLAIN;
}