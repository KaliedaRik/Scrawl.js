/*! scrawl 2014-07-04 */
"use strict";var scrawl=function(a){return a.newColor=function(b){return new a.Color(b)},a.Color=function(b){return b=a.safeObject(b),a.Base.call(this,b),this.set(b),a.xt(b.color)&&this.convert(b.color),b.random&&this.generateRandomColor(b),this.checkValues(),a.design[this.name]=this,a.pushUnique(a.designnames,this.name),this},a.Color.prototype=Object.create(a.Base.prototype),a.Color.prototype.type="Color",a.Color.prototype.classname="designnames",a.d.Color={r:0,g:0,b:0,a:1,rShift:0,gShift:0,bShift:0,aShift:0,rMax:255,gMax:255,bMax:255,aMax:1,rMin:0,gMin:0,bMin:0,aMin:0,rBounce:!1,gBounce:!1,bBounce:!1,aBounce:!1,autoUpdate:!1},a.mergeInto(a.d.Color,a.d.Base),a.Color.prototype.get=function(b){return a.xt(b)?"random"===b?(this.generateRandomColor(),this.get()):a.Base.prototype.get.call(this,b):"rgba("+(this.r||0)+", "+(this.g||0)+", "+(this.b||0)+", "+(this.a||1)+")"},a.Color.prototype.clone=function(b){var c,d,e=this.parse();return c=a.mergeOver(e,a.isa(b,"obj")?b:{}),d=a.newColor(c),b=a.safeObject(b),a.xt(b.random)&&b.random&&(delete d.r,delete d.g,delete d.b,delete d.a,d.generateRandomColor(b)),d},a.Color.prototype.getData=function(){return this.get("autoUpdate")&&this.update(),this.checkValues(),this.get()},a.Color.prototype.generateRandomColor=function(b){var c=this.get("rMax"),d=this.get("gMax"),e=this.get("bMax"),f=this.get("aMax"),g=this.get("rMin"),h=this.get("gMin"),i=this.get("bMin"),j=this.get("aMin");return b=a.safeObject(b),a.Base.prototype.set.call(this,{r:b.r||Math.round(Math.random()*(c-g)+g),g:b.g||Math.round(Math.random()*(d-h)+h),b:b.b||Math.round(Math.random()*(e-i)+i),a:b.a||Math.random()*(f-j)+j}),this.checkValues(),this},a.Color.prototype.checkValues=function(){var b=Math.floor(this.r)||0,c=Math.floor(this.g)||0,d=Math.floor(this.b)||0,e=this.a||1;return b=b>255?255:0>b?0:b,c=c>255?255:0>c?0:c,d=d>255?255:0>d?0:d,e=e>1?1:0>e?0:e,a.Base.prototype.set.call(this,{r:b,g:c,b:d,a:e}),this},a.Color.prototype.set=function(b){return a.Base.prototype.set.call(this,b),b=a.safeObject(b),b.random&&this.generateRandomColor(b),this.checkValues(),this},a.Color.prototype.update=function(){for(var b,c,d,e,f,g=["r","g","b","a"],h=[],i=[],j=0,k=g.length;k>j;j++)b=this.get(g[j]),c=this.get(g[j]+"Shift"),d=this.get(g[j]+"Min"),e=this.get(g[j]+"Max"),f=this.get(g[j]+"Bounce"),a.isBetween(b+c,e,d,!0)||(f?c=-c:(b=b>(e+d)/2?e:d,c=0)),h[j]=b+c,i[j]=c;return a.Base.prototype.set.call(this,{r:h[0],g:h[1],b:h[2],a:h[3],rShift:i[0],gShift:i[1],bShift:i[2],aShift:i[3]}),this},a.Color.prototype.setDelta=function(b){return b=a.isa(b,"obj")?b:{},a.Base.prototype.set.call(this,{r:(this.r||0)+(b.r||0),g:(this.g||0)+(b.g||0),b:(this.b||0)+(b.b||0),a:(this.a||1)+(b.a||0)}),this.checkValues(),this},a.Color.prototype.convert=function(b){if(b=a.isa(b,"str")?b:"",b.length>0){b.toLowerCase();var c,d=0,e=0,f=0,g=1;if("#"===b[0])b.length<5?(d=this.toDecimal(b[1]+b[1]),e=this.toDecimal(b[2]+b[2]),f=this.toDecimal(b[3]+b[3])):b.length<8&&(d=this.toDecimal(b[1]+b[2]),e=this.toDecimal(b[3]+b[4]),f=this.toDecimal(b[5]+b[6]));else if(/rgb\(/.test(b))c=b.match(/([0-9.]+\b)/g),/%/.test(b)?(d=Math.round(c[0]/100*255),e=Math.round(c[1]/100*255),f=Math.round(c[2]/100*255)):(d=Math.round(c[0]),e=Math.round(c[1]),f=Math.round(c[2]));else if(/rgba\(/.test(b))c=b.match(/([0-9.]+\b)/g),d=c[0],e=c[1],f=c[2],g=c[3];else switch(b){case"green":d=0,e=128,f=0;break;case"silver":d=192,e=192,f=192;break;case"lime":d=0,e=255,f=0;break;case"gray":d=128,e=128,f=128;break;case"grey":d=128,e=128,f=128;break;case"olive":d=128,e=128,f=0;break;case"white":d=255,e=255,f=255;break;case"yellow":d=255,e=255,f=0;break;case"maroon":d=128,e=0,f=0;break;case"navy":d=0,e=0,f=128;break;case"red":d=255,e=0,f=0;break;case"blue":d=0,e=0,f=255;break;case"purple":d=128,e=0,f=128;break;case"teal":d=0,e=128,f=128;break;case"fuchsia":d=255,e=0,f=255;break;case"aqua":d=0,e=255,f=255;break;default:d=0,e=0,f=0}}return a.Base.prototype.set.call(this,{r:d,g:e,b:f,a:g}),this.checkValues(),this},a.Color.prototype.toDecimal=function(a){return parseInt(a,16)},a.Color.prototype.toHex=function(a){return a.toString(16)},a.Color.prototype.remove=function(){return delete a.dsn[this.name],delete a.design[this.name],a.removeItem(a.designnames,this.name),!0},a}(scrawl);