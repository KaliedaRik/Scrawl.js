'use strict';
/**
# scrawlSaveLoad

## Purpose and features

Adds the ability to save and load Scrawl objects and scenes as JSON strings

_This module is experimental and thus likely to change significantly as Scrawl evolves_

@module scrawlSaveLoad
**/

var scrawl = (function(my){

/**
# window.scrawl

scrawlSaveLoad module adaptions to the Scrawl library object

@class window.scrawl_SaveLoad
**/

/**
A __load__ function

Argument should be a JSON String, or an Array of JSON Strings, of objects to be loaded or updated
@method load
@param {Array} item Array of JSON Strings; alternatively, a JSON String
@return Always true
**/
	my.load = function(item){
		var a,			//object from item
			type,
			b,			//existing object settings
			c,			//defaults
			k;			//a keys
		if(my.isa(item, 'str')){
			item = [item];
			}
		for(var i=0, z=item.length; i<z; i++){
			if(my.isa(item[i], 'str')){
				a = JSON.parse(item[i]);
				if(my.xt(a.type)){
					type = a.type.toLowerCase();
					if(my.contains(my[a.classname], a.name)){
						//update
						b = my[type][a.name].parse();
						c = my.d[a.type];
						k = Object.keys(b);
						for(var j=0, w=k.length; j<w; j++){
							if(!my.xt(a[k])){
								a[k] = c[k];
								}
							}
						my[type][a.name].set(a);
						}
					else{
						//create
						switch(type){
							case 'pad' : 
								my.addCanvasToPage(a); 
								my.currentPad = a.name;
								break;
							case 'cell' : 
								if(my.xt(a.pad) && my.contains(my.padnames, a.pad)  && !my.contains(my.pad[a.pad].cells, a.name)){
									my.pad[a.pad].addNewCell(a); 
									}
								break;
							case 'group' : 
								my.newGroup(a); break;
							case 'path' : 
								my.makePath(a); break;
							case 'gradient' : 
								my.newGradient(a); break;
							case 'radialgradient' : 
								my.newRadialGradient(a); break;
							default :
								new my[a.type](a);
							}
						}
					}
				}
			}
		return true;
		};
/**
A __save__ function

Argument should be a String literal: 'pads', 'groups', 'sprites', 'designs', 'animsheets'

_Note: this function does not check for duplicate objects_
@method save
@param {string} item A String literal: 'pads', 'cells', 'groups', 'sprites', 'designs', 'animsheets', 'springs'
@return Array of saved data
**/
	my.save = function(item){
		var results = [];
		switch(item){
			case 'pads' :
				for(var i=0, z=my.padnames.length; i<z; i++){
					results = results.concat(my.pad[my.padnames[i]].toString());
					}
				break;
			case 'cells' :
				for(var i=0, z=my.cellnames.length; i<z; i++){
					results = results.concat(my.cell[my.cellnames[i]].toString());
					}
				break;
			case 'groups' :
				for(var i=0, z=my.groupnames.length; i<z; i++){
					results = results.concat(my.group[my.groupnames[i]].toString());
					}
				break;
			case 'sprites' :
				for(var i=0, z=my.spritenames.length; i<z; i++){
					results = results.concat(my.sprite[my.spritenames[i]].toString());
					}
				break;
			case 'designs' :
				for(var i=0, z=my.designnames.length; i<z; i++){
					results = results.concat(my.design[my.designnames[i]].toString());
					}
				break;
			case 'animsheets' :
				if(my.xt(my.animnames)){
					for(var i=0, z=my.animnames.length; i<z; i++){
						results = results.concat(my.anim[my.animnames[i]].toString());
						}
					}
				break;
			case 'springs' :
				if(my.xt(my.springnames)){
					for(var i=0, z=my.springnames.length; i<z; i++){
						results = results.concat(my.spring[my.springnames[i]].toString());
						}
					}
				break;
			}
		return results;
		};

/**
Turn the object into a JSON String
@method Base.toString
@return JSON string of non-default value attributes
**/
	my.Base.prototype.toString = function(){
		var keys = Object.keys(my.d[this.type]),
			result = {};
		result.type = this.type;
		result.classname = this.classname;
		result.name = this.name;
		for(var i = 0, z = keys.length; i < z; i++){
			if(my.xt(this[keys[i]]) && this[keys[i]] !== my.d[this.type][keys[i]]){
				result[keys[i]] = this[keys[i]];
				}
			}
		return JSON.stringify(result);
		};

/**
Turn the object into a JSON String
@method Position.toString
@return JSON string of non-default value attributes
**/
	my.Position.prototype.toString = function(){
		var keys = Object.keys(my.d[this.type]),
			result = {};
		result.type = this.type;
		result.classname = this.classname;
		result.name = this.name;
		for(var i = 0, z = keys.length; i < z; i++){
			if(my.contains(['start', 'delta', 'handle'], keys[i])){
				if(!this[keys[i]].isLike(my.d[this.type][keys[i]])){
					result[keys[i]] = this[keys[i]];
					}
				}
			else if(my.xt(this[keys[i]]) && this[keys[i]] !== my.d[this.type][keys[i]]){
				result[keys[i]] = this[keys[i]];
				}
			}
		return JSON.stringify(result);
		};
		
/**
Turn the object into a JSON String
@method PageElement.toString
@return JSON string of non-default value attributes
**/
	my.PageElement.prototype.toString = function(){
		var keys = Object.keys(my.d[this.type]),
			result = {},
			temp;
		result.type = this.type;
		result.classname = this.classname;
		result.name = this.name;
		for(var i = 0, z = keys.length; i < z; i++){
			if(my.contains(['start', 'delta', 'handle', 'perspective', 'translate'], keys[i])){
				if(!this[keys[i]].isLike(my.d[this.type][keys[i]])){
					result[keys[i]] = this[keys[i]];
					}
				}
			if(keys[i] === 'rotation'){
				temp = this.rotation.getEulerAngles();
				if(temp.pitch !== 0){result.pitch = temp.pitch;}
				if(temp.yaw !== 0){result.yaw = temp.yaw;}
				if(temp.roll !== 0){result.roll = temp.roll;}
				}
			if(keys[i] === 'deltaRotation'){
				temp = this.rotation.getEulerAngles();
				if(temp.pitch !== 0){result.deltaPitch = temp.pitch;}
				if(temp.yaw !== 0){result.deltaYaw = temp.yaw;}
				if(temp.roll !== 0){result.deltaRoll = temp.roll;}
				}
			else if(my.xt(this[keys[i]]) && this[keys[i]] !== my.d[this.type][keys[i]]){
				result[keys[i]] = this[keys[i]];
				}
			}
		return JSON.stringify(result);
		};

/**
Turn the object into a JSON String
@method Pad.toString
@param {Boolean} [noexternalobjects] True to exclude external objects such as sprites, designs and groups
@return Array of JSON strings of non-default value attributes
**/
	my.Pad.prototype.toString = function(noexternalobjects){
		var keys = Object.keys(my.d[this.type]),
			result = {},
			resarray = [],
			groups = [],
			sprites = [],
			ctx,
			designs = [];
		result.type = this.type;
		result.classname = this.classname;
		result.name = this.name;
		result.parentElement = my.canvas[this.name].parentElement.id;
		for(var i = 0, z = keys.length; i < z; i++){
			if(my.contains(['start', 'delta', 'handle'], keys[i])){
				if(!this[keys[i]].isLike(my.d[this.type][keys[i]])){
					result[keys[i]] = this[keys[i]];
					}
				}
			else if(my.xt(this[keys[i]]) && this[keys[i]] !== my.d[this.type][keys[i]]){
				result[keys[i]] = this[keys[i]];
				}
			}
		delete result.displayOffsetX;
		delete result.displayOffsetY;
		resarray.push(JSON.stringify(result));
		if(!noexternalobjects){
			for(var i=0, z=this.cells.length; i<z; i++){
				for(var j=0, w=my.cell[this.cells[i]].groups.length; j<w; j++){
					my.pushUnique(groups, my.cell[this.cells[i]].groups[j]);
					}
				resarray.push(my.cell[this.cells[i]].toString(true));
				}
			for(var i=0, z=groups.length; i<z; i++){
				for(var j=0, w=my.group[groups[i]].sprites.length; j<w; j++){
					my.pushUnique(sprites, my.group[groups[i]].sprites[j]);
					}
				resarray.push(my.group[groups[i]].toString(true));
				}
			for(var i=0, z=sprites.length; i<z; i++){
				ctx = my.ctx[my.sprite[sprites[i]].context];
				if(my.contains(my.designnames, ctx.fillStyle)){
					my.pushUnique(designs, ctx.fillStyle);
					}
				if(my.contains(my.designnames, ctx.strokeStyle)){
					my.pushUnique(designs, ctx.strokeStyle);
					}
				if(my.contains(my.designnames, ctx.shadowColor)){
					my.pushUnique(designs, ctx.shadowColor);
					}
				}
			for(var i=0, z=designs.length; i<z; i++){
				resarray.push(my.design[designs[i]].toString());
				}
			for(var i=0, z=sprites.length; i<z; i++){
				resarray.push(my.sprite[sprites[i]].toString(true));
				}
			}
		return resarray;
		};
		
/**
Turn the object into a JSON String
@method Cell.toString
@param {Boolean} [noexternalobjects] True to exclude external objects such as sprites, designs and groups
@return Array of JSON strings of non-default value attributes
**/
	my.Cell.prototype.toString = function(noexternalobjects){
		var keys = Object.keys(my.d[this.type]),
			result = {},
			resarray = [],
			sprites = [],
			ctx,
			designs = [];
		result.type = this.type;
		result.classname = this.classname;
		result.name = this.name;
		for(var i = 0, z = keys.length; i < z; i++){
			if(my.contains(['start', 'delta', 'handle', 'source', 'sourceDelta'], keys[i])){
				if(!this[keys[i]].isLike(my.d[this.type][keys[i]])){
					result[keys[i]] = this[keys[i]];
					}
				}
			else if(my.xt(this[keys[i]]) && this[keys[i]] !== my.d[this.type][keys[i]]){
				result[keys[i]] = this[keys[i]];
				}
			}
		resarray.push(JSON.stringify(result));
		if(!noexternalobjects){
			for(var i=0, z=this.groups.length; i<z; i++){
				for(var j=0, w=my.group[this.groups[i]].sprites.length; j<w; j++){
					my.pushUnique(sprites, my.group[this.groups[i]].sprites[j]);
					}
				resarray.push(my.group[this.groups[i]].toString(true));
				}
			for(var i=0, z=sprites.length; i<z; i++){
				ctx = my.ctx[my.sprite[sprites[i]].context];
				if(my.contains(my.designnames, ctx.fillStyle)){
					my.pushUnique(designs, ctx.fillStyle);
					}
				if(my.contains(my.designnames, ctx.strokeStyle)){
					my.pushUnique(designs, ctx.strokeStyle);
					}
				if(my.contains(my.designnames, ctx.shadowColor)){
					my.pushUnique(designs, ctx.shadowColor);
					}
				}
			for(var i=0, z=designs.length; i<z; i++){
				resarray.push(my.design[designs[i]].toString());
				}
			for(var i=0, z=sprites.length; i<z; i++){
				resarray.push(my.sprite[sprites[i]].toString(true));
				}
			}
		return resarray;
		};
/**
Turn the object into a JSON String; doesn't include name and type attributes
@method Context.toString
@return JSON string of non-default value attributes
**/
	my.Context.prototype.toString = function(){
		var result = {};
		for(var i = 0, z = my.contextKeys.length; i < z; i++){
			if(my.contextKeys[i] === 'lineDash'){
				if(my.xt(this.lineDash) && this.lineDash.length > 0){
					result.lineDash = this.lineDash;
					}
				}
			else if(my.xt(this[my.contextKeys[i]]) && this[my.contextKeys[i]] !== my.d.Context[my.contextKeys[i]]){
				result[my.contextKeys[i]] = this[my.contextKeys[i]];
				}
			}
		return JSON.stringify(result);
		};
/**
Turn the object into a JSON String

Automatically removes the sprites attribute from the result; when loading, existing sprites need to be re-added to the group
@method Group.toString
@param {Boolean} [nosprites] True to exclude the sprites attribute; false will return an array containing this and each of the sprites in the sprites array
@return Array of JSON strings of non-default value attributes
**/
	my.Group.prototype.toString = function(nosprites){
		var keys = Object.keys(my.d[this.type]),
			result = {},
			resarray = [],
			ctx,
			designs = [];
		result.type = this.type;
		result.classname = this.classname;
		result.name = this.name;
		for(var i = 0, z = keys.length; i < z; i++){
			if(my.xt(this[keys[i]]) && this[keys[i]] !== my.d[this.type][keys[i]]){
				result[keys[i]] = this[keys[i]];
				}
			}
		delete result.sprites;
		resarray.push(JSON.stringify(result));
		if(!nosprites){
			for(var i=0, z=this.sprites.length; i<z; i++){
				ctx = my.ctx[my.sprite[this.sprites[i]].context];
				if(my.contains(my.designnames, ctx.fillStyle)){
					my.pushUnique(designs, ctx.fillStyle);
					}
				if(my.contains(my.designnames, ctx.strokeStyle)){
					my.pushUnique(designs, ctx.strokeStyle);
					}
				if(my.contains(my.designnames, ctx.shadowColor)){
					my.pushUnique(designs, ctx.shadowColor);
					}
				}
			for(var i=0, z=designs.length; i<z; i++){
				resarray.push(my.design[designs[i]].toString());
				}
			for(var i=0, z=this.sprites.length; i<z; i++){
				resarray.push(my.sprite[this.sprites[i]].toString(true));
				}
			}
		return resarray;
		};
		
/**
Turn the object into a JSON String

Retains the sprites attribute Array; does not include any other objects in the return Array
@method Group.save
@return Array of JSON Strings
**/
	my.Group.prototype.save = function(){
		var keys = Object.keys(my.d[this.type]),
			result = {};
		result.type = this.type;
		result.classname = this.classname;
		result.name = this.name;
		for(var i = 0, z = keys.length; i < z; i++){
			if(my.xt(this[keys[i]]) && this[keys[i]] !== my.d[this.type][keys[i]]){
				result[keys[i]] = this[keys[i]];
				}
			}
		return [JSON.stringify(result)];
		};
		
/**
Turn the object into a JSON String
@method Sprite.toString
@return JSON string of non-default value attributes, including non-default context values
**/
	my.Sprite.prototype.toString = function(noexternalobjects){
		noexternalobjects = (my.xt(noexternalobjects)) ? noexternalobjects : false;
		var keys = Object.keys(my.d[this.type]),
			result = {},
			ctx = my.ctx[this.context],
			ctxArray,
			designs = [],
			resarray = [];
		result.type = this.type;
		result.classname = this.classname;
		result.name = this.name;
		if(!noexternalobjects){
			if(ctx && ctx.fillStyle && my.contains(my.designnames, ctx.fillStyle)){
				my.pushUnique(designs, ctx.fillStyle);
				}
			if(ctx && ctx.strokeStyle && my.contains(my.designnames, ctx.strokeStyle)){
				my.pushUnique(designs, ctx.strokeStyle);
				}
			if(ctx && ctx.shadowColor && my.contains(my.designnames, ctx.shadowColor)){
				my.pushUnique(designs, ctx.shadowColor);
				}
			for(var i=0, z=designs.length; i<z; i++){
				resarray.push(my.design[designs[i]].toString());
				}
			}
		for(var i = 0, z = keys.length; i < z; i++){
			if(my.contains(['start', 'delta', 'handle'], keys[i])){
				if(!this[keys[i]].isLike(my.d[this.type][keys[i]])){
					result[keys[i]] = this[keys[i]];
					}
				}
			else if(keys[i] === 'context' && my.xt(my.ctx[this.context])){
				ctx = JSON.parse(my.ctx[this.context].toString());
				ctxArray = Object.keys(ctx);
				for(var j = 0, w = ctxArray.length; j < w; j++){
					result[ctxArray[j]] = ctx[ctxArray[j]];
					}
				}
			else if(my.contains(['collisionVectors','dataSet','pointList','firstPoint','linkList','linkDurations','perimeterLength','style','variant','weight','size','metrics','family','texts'], keys[i])){
				//do nothing
				}
			else if(my.xt(this[keys[i]]) && this[keys[i]] !== my.d[this.type][keys[i]]){
				result[keys[i]] = this[keys[i]];
				}
			}
		if(this.type === 'Picture'){
			result.url = my.image[this.source].source;
			}
		resarray.push(JSON.stringify(result).replace('\\n', '\\\\n'));		//replace required for multiline Phrase sprites
		return resarray
		};
		
	return my;
	}(scrawl));
