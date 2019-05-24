/*
# Picture factory
*/
import { constructors, asset } from '../core/library.js';
import { mergeOver, xt, xta, addStrings } from '../core/utilities.js';

import { gettableVideoAssetAtributes, settableVideoAssetAtributes } from './videoAsset.js';
import { gettableImageAssetAtributes, settableImageAssetAtributes } from './imageAsset.js';

import baseMix from '../mixin/base.js';
import positionMix from '../mixin/position.js';
import entityMix from '../mixin/entity.js';
import assetConsumerMix from '../mixin/assetConsumer.js';
import filterMix from '../mixin/filter.js';

/*
## Picture constructor
*/
const Picture = function (items = {}) {

	this.entityInit(items);

	return this;
};

/*
## Picture object prototype setup
*/
let P = Picture.prototype = Object.create(Object.prototype);
P.type = 'Picture';
P.lib = 'entity';
P.isArtefact = true;
P.isAsset = false;

/*
Apply mixins to prototype object
*/
P = baseMix(P);
P = positionMix(P);
P = entityMix(P);
P = assetConsumerMix(P);
P = filterMix(P);

/*
## Define default attributes
*/
let defaultAttributes = {

/*

*/
	copyStart: {},

/*

*/
	currentCopyStart: {},

/*

*/
	copyWidth: 0,

/*

*/
	copyHeight: 0,

/*

*/
	currentCopyWidth: 0,

/*

*/
	currentCopyHeight: 0,
};
P.defs = mergeOver(P.defs, defaultAttributes);

let G = P.getters,
	S = P.setters,
	D = P.deltaSetters;

/*

*/
G.copyStartX = function () {

	this.checkVector('copyStart');
	return this.copyStart.x;
};

/*

*/
G.copyStartY = function () {

	this.checkVector('copyStart');
	return this.copyStart.y;
};

/*

*/
S.copyStartX = function (item) {

	this.checkVector('copyStart');
	this.copyStart.x = item;
	this.dirtyCopyStart = true;
	this.dirtyImage = true;
};

/*

*/
S.copyStartY = function (item) {

	this.checkVector('copyStart');
	this.copyStart.y = item;
	this.dirtyCopyStart = true;
	this.dirtyImage = true;
};

/*

*/
S.copyStart = function (item = {}) {

	this.checkVector('copyStart');
	this.copyStart.x = (xt(item.x)) ? item.x : this.copyStart.x;
	this.copyStart.y = (xt(item.y)) ? item.y : this.copyStart.y;
	this.dirtyCopyStart = true;
	this.dirtyImage = true;
};

/*

*/
S.copyWidth = function (item) {

	this.copyWidth = item;
	this.dirtyCopyDimensions = true;
	this.dirtyImage = true;
};

/*

*/
S.copyHeight = function (item) {

	this.copyHeight = item;
	this.dirtyCopyDimensions = true;
	this.dirtyImage = true;
};

/*

*/
D.copyStartX = function (item) {

	this.checkVector('copyStart');
	this.copyStart.x = addStrings(this.copyStart.x, item);
	this.dirtyCopyStart = true;
	this.dirtyImage = true;
};

/*

*/
D.copyStartY = function (item) {

	this.checkVector('copyStart');
	this.copyStart.y = addStrings(this.copyStart.y, item);
	this.dirtyCopyStart = true;
	this.dirtyImage = true;
};

/*

*/
D.copyStart = function (item = {}) {

	this.checkVector('copyStart');
	this.copyStart.x = (xt(item.x)) ? addStrings(this.copyStart.x, item) : this.copyStart.x;
	this.copyStart.y = (xt(item.y)) ? addStrings(this.copyStart.y, item) : this.copyStart.y;
	this.dirtyCopyStart = true;
	this.dirtyImage = true;
};

/*

*/
D.copyWidth = function (item) {

	this.copyWidth = addStrings(this.copyWidth, item);
	this.dirtyCopyDimensions = true;
	this.dirtyImage = true;
};

/*

*/
D.copyHeight = function (item) {

	this.copyHeight = addStrings(this.copyHeight, item);
	this.dirtyCopyDimensions = true;
	this.dirtyImage = true;
};


/*
## Define prototype functions
*/


/*
Overwrites function defined in mixin/entity.js - takes into account image/videoAsset source attributes
*/
P.get = function (item) {

	let source = this.source;

	if ((item.indexOf('video_') === 0 || item.indexOf('image_') === 0) && source) {

		if (gettableVideoAssetAtributes.indexOf(item) >= 0) return source[item.substring(6)];
		else if (gettableImageAssetAtributes.indexOf(item) >= 0) return source[item.substring(6)];
	}

	else {

		let getter = this.getters[item];

		if (getter) return getter.call(this);

		else {

			let def = this.defs[item],
				state = this.state,
				val;

			if (typeof def != 'undefined') {

				val = this[item];
				return (typeof val != 'undefined') ? val : def;
			}

			def = state.defs[item];

			if (typeof def != 'undefined') {

				val = state[item];
				return (typeof val != 'undefined') ? val : def;
			}
			return undef;
		}
	}
};

/*
Overwrites function defined in mixin/entity.js - takes into account State object attributes
*/
P.set = function (items = {}) {

	if (items) {

		let setters = this.setters,
			defs = this.defs,
			state = this.state,
			source = this.source,
			stateSetters = (state) ? state.setters : {},
			stateDefs = (state) ? state.defs : {};

		Object.entries(items).forEach(([key, value]) => {

			if ((key.indexOf('video_') === 0 || key.indexOf('image_') === 0) && source) {

				if (settableVideoAssetAtributes.indexOf(key) >= 0) source[key.substring(6)] = value
				else if (settableImageAssetAtributes.indexOf(key) >= 0) source[key.substring(6)] = value
			}

			else if (key !== 'name') {

				let predefined = setters[key],
					stateFlag = false;

				if (!predefined) {

					predefined = stateSetters[key];
					stateFlag = true;
				}

				if (predefined) predefined.call(stateFlag ? this.state : this, value);
				else if (typeof defs[key] !== 'undefined') this[key] = value;
				else if (typeof stateDefs[key] !== 'undefined') state[key] = value;
			}
		}, this);
	}
	return this;
};

/*

*/
P.cleanImage = function () {

	let start, x, y, w, h,
		natWidth = this.sourceNaturalWidth,
		natHeight = this.sourceNaturalHeight;

	if (xta(natWidth, natHeight)) {

		this.dirtyImage = false;

		if (this.dirtyCopyStart) this.cleanCopyStart();

		start = this.currentCopyStart;
		x = start.x;
		y = start.y;

		if (this.dirtyCopyDimensions) this.cleanCopyDimensions();

		w = this.currentCopyWidth;
		h = this.currentCopyHeight;

		if (x + w > natWidth) start.x = natWidth - w;
		if (y + h > natHeight) start.y = natHeight - h;

		this.copyObject = {
			x: start.x,
			y: start.y,
			w: w,
			h: h
		};
	}
};

/*

*/
P.cleanCopyStart = function () {

	let start = this.copyStart,
		width = this.sourceNaturalWidth,
		height = this.sourceNaturalHeight,
		current, x, y;

	if (xta(width, height)) {

		this.dirtyCopyStart = false;

		this.cleanVectorParameter('currentCopyStart', start, width, height);

		current = this.currentCopyStart;
		x = current.x;
		y = current.y;

		if (x < 0 || x > width) {

			if (x < 0) current.x = 0;
			else current.x = width - 1;
		}

		if (y < 0 || y > height) {

			if (y < 0) current.y = 0;
			else current.y = height - 1;
		}
	}
};

/*

*/
P.cleanCopyDimensions = function () {

	let width = this.copyWidth, 
		height = this.copyHeight,
		natWidth = this.sourceNaturalWidth,
		natHeight = this.sourceNaturalHeight,
		currentWidth, currentHeight;

	this.dirtyCopyDimensions = false;

	if (width.substring) this.currentCopyWidth = (parseFloat(width) / 100) * natWidth;
	else this.currentCopyWidth = width;

	if (height.substring) this.currentCopyHeight = (parseFloat(height) / 100) * natHeight;
	else this.currentCopyHeight = height;

	currentWidth = this.currentCopyWidth;
	currentHeight = this.currentCopyHeight;

	if (currentWidth <= 0 || currentWidth > natWidth) {

		if (currentWidth <= 0) this.currentCopyWidth = 1;
		else this.currentCopyWidth = natWidth;
	}

	if (currentHeight <= 0 || currentHeight > natHeight) {

		if (currentHeight <= 0) this.currentCopyHeight = 1;
		else this.currentCopyHeight = natHeight;
	}
};

/*
Overrides mixin/entity.js
*/
P.prepareStamp = function() {

	if (this.asset && this.asset.checkSource) this.asset.checkSource(this.sourceNaturalWidth, this.sourceNaturalHeight);

	if (this.dirtyDimensions || this.dirtyHandle || this.dirtyScale) this.dirtyPaste = true;

	if (this.dirtyDimensions) this.cleanDimensions();
	if (this.dirtyStart) this.cleanStart();
	if (this.dirtyHandle) this.cleanHandle();
	if (this.dirtyOffset || this.dirtyScale || this.pivot) this.cleanOffset();
	if (this.dirtyPathObject) this.cleanPathObject();
	if (this.dirtyPivoted) this.updatePivotSubscribers();

	if (this.dirtyImage) this.cleanImage();
	if (this.dirtyPaste) this.preparePasteObject();
};

/*

*/
P.preparePasteObject = function () {

	let handle, scale;

	this.dirtyPaste = false;

	handle = this.currentHandle;
	scale = this.scale;

	this.pasteObject = {
		x: -handle.x * scale,
		y: -handle.y * scale,
		w: this.localWidth * scale,
		h: this.localHeight * scale,
	};
};

/*

*/
P.cleanPathObject = function () {

	let p, obj;

	this.dirtyPathObject = false;

	if (!this.pasteObject) this.preparePasteObject();

	p = this.pathObject = new Path2D();
	obj = this.pasteObject;
	
	p.rect(obj.x, obj.y, obj.w, obj.h);
};

/*

*/
P.fill = function (engine) {

	let copy = this.copyObject,
		paste = this.pasteObject;

	engine.drawImage(this.source, copy.x, copy.y, copy.w, copy.h, paste.x, paste.y, paste.w, paste.h);
};

/*

*/
P.draw = function (engine) {

	let paste = this.pasteObject;

	engine.strokeRect(paste.x, paste.y, paste.w, paste.h);
};

/*

*/
P.stamper = {

	draw: function (engine, entity) {

		entity.draw(engine);
	},

	fill: function (engine, entity) {

		entity.fill(engine);
	},

	drawFill: function (engine, entity) {

		entity.draw(engine);
		entity.currentHost.clearShadow();
		entity.fill(engine);
	},

	fillDraw: function (engine, entity) {

		entity.draw(engine);
		entity.currentHost.clearShadow();
		entity.fill(engine);
		entity.draw(engine);
	},

	floatOver: function (engine, entity) {

		entity.draw(engine);
		entity.fill(engine);
	},

	sinkInto: function (engine, entity) {

		entity.fill(engine);
		entity.draw(engine);
	},

	clear: function (engine, entity) {

		let gco = engine.globalCompositeOperation;

		engine.globalCompositeOperation = 'destination-out';
		engine.fill(entity.pathObject, entity.winding);
		
		engine.globalCompositeOperation = gco;
	},	

	none: function (engine, entity) {},	
};

/*
video actions
*/
P.videoAction = function (action, ...args) {

	let myAsset = this.asset;

	if (myAsset && myAsset.type === 'Video') return myAsset[action](...args);
};

P.videoPromiseAction = function (action, ...args) {

	let myAsset = this.asset;

	if (myAsset && myAsset.type === 'Video') return myAsset[action](...args);
	else return Promise.reject('Asset not a video');
};

P.videoAddTextTrack = function (kind, label, language) {
	return this.videoAction('addTextTrack', kind, label, language);
};

P.videoCaptureStream = function () {
	return this.videoAction('captureStream');
};

P.videoCanPlayType = function (mytype) {
	return this.videoAction('canPlayType', mytype);
};

P.videoFastSeek = function (time) {
	return this.videoAction('fastSeek', time);
};

P.videoLoad = function () {
	return this.videoAction('load');
};

P.videoPause = function () {
	return this.videoAction('pause');
};

P.videoPlay = function () {
	return this.videoPromiseAction('play');
};

P.videoSetMediaKeys = function (keys) {
	return this.videoPromiseAction('setMediaKeys', keys);
};

P.videoSetSinkId = function () {
	return this.videoPromiseAction('setSinkId');
};


/*
## Exported factory function
*/
const makePicture = function (items) {
	return new Picture(items);
};

/*
Also store constructor in library - clone functionality expects to find it there
*/
constructors.Picture = Picture;

export {
	makePicture,
};