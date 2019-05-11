/*
# Block factory
*/
import { constructors } from '../core/library.js';
import { mergeOver } from '../core/utilities.js';

import baseMix from '../mixin/base.js';
import positionMix from '../mixin/position.js';
import entityMix from '../mixin/entity.js';
import filterMix from '../mixin/filter.js';

/*
## Block constructor
*/
const Block = function (items = {}) {

	this.entityInit(items);
	return this;
};

/*
## Block object prototype setup
*/
let P = Block.prototype = Object.create(Object.prototype);
P.type = 'Block';
P.lib = 'entity';
P.isArtefact = true;
P.isAsset = false;

/*
Apply mixins to prototype object
*/
P = baseMix(P);
P = positionMix(P);
P = entityMix(P);
P = filterMix(P);

/*
## Define default attributes
*/
let defaultAttributes = {

/*

*/
	width: 10,

/*

*/
	height: 10,
};
P.defs = mergeOver(P.defs, defaultAttributes);

/*
## Define prototype functions
*/

/*

*/
P.cleanPathObject = function () {

	this.dirtyPathObject = false;

	let p = this.pathObject = new Path2D();
	
	let handle = this.currentHandle,
		scale = this.scale,
		mimic = this.mimic, 
		x, y, w, h;

	if (mimic) {

		let mPhrase = (this.mimicType === 'Phrase'),
			mWidth = this.localMimicPaddingWidth,
			mHeight = this.localMimicPaddingHeight;

		x = (-handle.x * scale) - mWidth;
		y = (mPhrase) ? -handle.y - mHeight : (-handle.y * scale) - mHeight;

		w = (this.localWidth * scale) + (mWidth * 2);
		h = (mPhrase) ? this.localHeight + (mHeight * 2) : (this.localHeight * scale) + (mHeight * 2);
	}
	else {

		x = -handle.x * scale;
		y = -handle.y * scale;

		w = this.localWidth * scale;
		h = this.localHeight * scale;
	}

	p.rect(x, y, w, h);
};


/*
## Exported factory function
*/
const makeBlock = function (items) {
	return new Block(items);
};

/*
Also store constructor in library - clone functionality expects to find it there
*/
constructors.Block = Block;

export {
	makeBlock,
};
