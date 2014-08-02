/*! scrawl 2014-07-30 */
"use strict";var scrawl=function(a){return a.prepareFilterSection(),a.filterSetup=function(b,c){b=a.safeObject(b);var d=a.xt(b.useSourceData)?b.useSourceData:!1,e={};return e.items=b,e.image=c||!1,e.useSourceData=d,e.imgData=b.use||c.getImageData(d),e.save=a.xt(b.save)?b.save:!0,e},a.filterSave=function(b){var c;b.save&&b.image&&(c=b.image.getImageDataUrl(b.imgData,!0),a.img[b.image.name]=b.image.makeImage(c,b.image.name+"_current",b.image.width,b.image.height))},a.filter.grayscale=function(b,c){var d,e,f=a.filterSetup(b,c),g=a.xt(f.items.value)?f.items.value:1,h=f.imgData.data;g=a.isa(g,"str")?parseFloat(g)/100:g,g=a.isBetween(g,0,1,!0)?g:g>.5?1:0;for(var i=0,j=h.length;j>i;i+=4){e=i,d=Math.floor(.2126*h[e]+.7152*h[++e]+.0722*h[++e]);for(var k=0;3>k;k++)e=i+k,h[e]=h[e]+(d-h[e])*g}return a.filterSave(f),f.imgData},a.pushUnique(a.filternames,"grayscale"),a.filter.sharpen=function(b,c){var d,e=a.filterSetup(b,c),f=a.xt(e.items.value)?e.items.value:1;return f=a.isa(f,"str")?parseFloat(f)/100:f,d=a.filter.matrix({use:e.imgData,data:[0,-1,0,-1,5,-1,0,-1,0],save:!1},e.image),e.imgData=a.filter.mergeImages({image1:e.imgData,image2:d,value:f}),a.filterSave(e),e.imgData},a.pushUnique(a.filternames,"sharpen"),a.filter.mergeImages=function(b){if(a.isa(b,"obj")&&a.xta([b.image1,b.image2,b.value])){var c,d=b.image1,e=d.data,f=b.image2,g=f.data,h=b.value,i=1-h;if(0===h)return d;if(1===h)return f;for(var j=0,k=e.length;k>j;j+=4)for(var l=0;3>l;l++)c=j+l,e[c]=e[c]*i+g[c]*h;return d}return!1},a.pushUnique(a.filternames,"mergeImages"),a.filter.invert=function(b,c){var d,e,f=a.filterSetup(b,c),g=a.xt(f.items.value)?f.items.value:1,h=f.imgData.data;g=a.isa(g,"str")?parseFloat(g)/100:g,g=a.isBetween(g,0,1,!0)?g:g>.5?1:0,d=1-g;for(var i=0,j=h.length;j>i;i+=4)for(var k=0;3>k;k++)e=i+k,h[e]=h[e]*d+(255-h[e])*g;return a.filterSave(f),f.imgData},a.pushUnique(a.filternames,"invert"),a.filter.brightness=function(b,c){var d,e=a.filterSetup(b,c),f=a.xt(e.items.value)?e.items.value:1,g=e.imgData.data;f=a.isa(f,"str")?parseFloat(f)/100:f,f=0>f?0:f;for(var h=0,i=g.length;i>h;h+=4)for(var j=0;3>j;j++)d=h+j,g[d]=g[d]*f;return a.filterSave(e),e.imgData},a.pushUnique(a.filternames,"brightness"),a.filter.saturation=function(b,c){var d,e=a.filterSetup(b,c),f=a.xt(e.items.value)?e.items.value:1,g=e.imgData.data;f=a.isa(f,"str")?parseFloat(f)/100:f,f=0>f?0:f;for(var h=0,i=g.length;i>h;h+=4)for(var j=0;3>j;j++)d=h+j,g[d]=127+(g[d]-127)*f;return a.filterSave(e),e.imgData},a.pushUnique(a.filternames,"saturation"),a.filter.threshold=function(b,c){var d,e,f=a.filterSetup(b,c),g=a.xt(b.value)?b.value:.5;g=a.isa(g,"str")?parseFloat(g)/100:g,g=a.isBetween(g,0,1,!0)?g:g>.5?1:0,g*=255,f.imgData=a.filter.grayscale({useSourceData:f.useSourceData,use:f.imgData,save:!1},f.image),d=f.imgData.data;for(var h=0,i=d.length;i>h;h+=4)for(var j=0;3>j;j++)e=h+j,d[e]=d[e]>g?255:0;return a.filterSave(f),f.imgData},a.pushUnique(a.filternames,"threshold"),a.filter.channels=function(b,c){var d,e=a.filterSetup(b,c),f=a.xt(e.items.red)?e.items.red:1,g=a.xt(e.items.green)?e.items.green:1,h=a.xt(e.items.blue)?e.items.blue:1,i=a.xt(e.items.alpha)?e.items.alpha:1,j=e.imgData.data;f=a.isa(f,"str")?parseFloat(f)/100:f,g=a.isa(g,"str")?parseFloat(g)/100:g,h=a.isa(h,"str")?parseFloat(h)/100:h,i=a.isa(i,"str")?parseFloat(i)/100:i;for(var k=0,l=j.length;l>k;k+=4)d=k,j[d]=j[d]*f,d++,j[d]=j[d]*g,d++,j[d]=j[d]*h,d++,j[d]=j[d]*i;return a.filterSave(e),e.imgData},a.pushUnique(a.filternames,"channels"),a.filter.channelStep=function(b,c){for(var d,e=a.filterSetup(b,c),f=a.xt(e.items.red)?e.items.red:1,g=a.xt(e.items.green)?e.items.green:1,h=a.xt(e.items.blue)?e.items.blue:1,i=a.xt(e.items.alpha)?e.items.alpha:1,j=e.imgData.data,k=0,l=j.length;l>k;k+=4)d=k,j[d]=Math.floor(j[d]/f)*f,d++,j[d]=Math.floor(j[d]/g)*g,d++,j[d]=Math.floor(j[d]/h)*h,d++,j[d]=Math.floor(j[d]/i)*i;return a.filterSave(e),e.imgData},a.pushUnique(a.filternames,"channelStep"),a.filter.sepia=function(b,c){return a.filter.tint(b,c)},a.pushUnique(a.filternames,"sepia"),a.filter.tint=function(b,c){var d,e,f,g,h,i,j,k=a.filterSetup(b,c),l=a.xt(k.items.value)?k.items.value:1,m=k.items.rr||k.items.redInRed||.393,n=k.items.rg||k.items.redInGreen||.349,o=k.items.rb||k.items.redInBlue||.272,p=k.items.gr||k.items.greenInRed||.769,q=k.items.gg||k.items.greenInGreen||.686,r=k.items.gb||k.items.greenInBlue||.534,s=k.items.br||k.items.blueInRed||.189,t=k.items.bg||k.items.blueInGreen||.168,u=k.items.bb||k.items.blueInBlue||.131,v=k.imgData.data;l=a.isa(l,"str")?parseFloat(l)/100:l,l=a.isBetween(l,0,1,!0)?l:l>.5?1:0,d=1-l;for(var w=0,x=v.length;x>w;w+=4)e=v[w],g=v[w+1],i=v[w+2],f=e*m+g*p+i*s,h=e*n+g*q+i*t,j=e*o+g*r+i*u,v[w]=e*d+f*l,v[w+1]=g*d+h*l,v[w+2]=i*d+j*l;return a.filterSave(k),k.imgData},a.pushUnique(a.filternames,"tint"),a.filter.blur=function(b,c){var d=a.filterSetup(b,c);if(d.items.includeAlpha=a.isa(d.items.includeAlpha,"bool")?d.items.includeAlpha:!1,d.items.wrap=!1,!a.xt(d.items.brush)){var e=a.xt(d.items.radius)?Math.abs(d.items.radius):0,f=a.xt(d.items.radiusX)?Math.abs(d.items.radiusX):2,g=a.xt(d.items.radiusY)?Math.abs(d.items.radiusY):2,h=a.xt(d.items.roll)?d.items.roll:0,i=e||f||2,j=e||g||2;d.items.brush=a.filter.getBrush(i,j,h)}return d.imgData=a.filter.doMatrix(d.items.brush,d),a.filterSave(d),d.imgData},a.pushUnique(a.filternames,"blur"),a.filter.getBrush=function(b,c,d){var e=b>c?b+2:c+2,f=Math.floor(e/2),g=Math.cos(d*a.radian),h=Math.sin(d*a.radian),i=[];a.cv.width=e,a.cv.height=e,a.cvx.setTransform(g,h,-h,g,f,f),a.cvx.beginPath(),a.cvx.moveTo(-b,0),a.cvx.lineTo(-1,-1),a.cvx.lineTo(0,-c),a.cvx.lineTo(1,-1),a.cvx.lineTo(b,0),a.cvx.lineTo(1,1),a.cvx.lineTo(0,c),a.cvx.lineTo(-1,1),a.cvx.lineTo(-b,0),a.cvx.closePath();for(var j=0;e>j;j++)for(var k=0;e>k;k++)a.cvx.isPointInPath(k,j)&&i.push({ox:k-f,oy:j-f,wt:1});return a.cvx.setTransform(1,0,0,1,0,0),i},a.pushUnique(a.filternames,"getBrush"),a.filter.pixelate=function(b,c){var d,e,f,g,h,i,j,k,l,m,n=a.filterSetup(b,c),o=a.xt(n.items.width)?Math.ceil(n.items.width):5,p=a.xt(n.items.height)?Math.ceil(n.items.height):5,q=a.xt(n.items.includeAlpha)?n.items.includeAlpha:!1,r=n.imgData.width,s=n.imgData.height;a.cv.width=r,a.cv.height=s,a.cvx.putImageData(n.imgData,0,0);for(var t=0;s>t;t+=p)for(var u=0;r>u;u+=o){d=e=f=g=i=0,j=u+o>r?r-u:o,k=t+p>s?s-t:p,l=j*k*4,h=a.cvx.getImageData(u,t,j,k);for(var v=0;l>v;v+=4)h.data[v+3]>0&&(m=v,d+=h.data[m],e+=h.data[++m],f+=h.data[++m],g+=h.data[++m],i++);d=Math.floor(d/i),e=Math.floor(e/i),f=Math.floor(f/i),g=Math.floor(g/i),a.cvx.fillStyle=q?"rgba("+d+","+e+","+f+","+g+")":"rgb("+d+","+e+","+f+")",a.cvx.fillRect(u,t,j,k)}return n.imgData=a.cvx.getImageData(0,0,n.imgData.width,n.imgData.height),a.filterSave(n),n.imgData},a.pushUnique(a.filternames,"pixelate"),a.filter.glassTile=function(b,c){var d,e,f=a.filterSetup(b,c),g=a.xt(f.items.width)?Math.ceil(f.items.width):5,h=a.xt(f.items.height)?Math.ceil(f.items.height):5,i=a.xt(f.items.outerWidth)?Math.ceil(f.items.outerWidth):8,j=a.xt(f.items.outerHeight)?Math.ceil(f.items.outerHeight):8;a.cv.width=f.imgData.width,a.cv.height=f.imgData.height,a.cvx.putImageData(f.imgData,0,0);for(var k=0;k<f.imgData.height;k+=h)for(var l=0;l<f.imgData.width;l+=g)d=l+i>f.imgData.width?f.imgData.width-l:i,e=k+j>f.imgData.height?f.imgData.height-k:j,a.cvx.drawImage(a.cv,l,k,d,e,l,k,g,h);return f.imgData=a.cvx.getImageData(0,0,f.imgData.width,f.imgData.height),a.filterSave(f),f.imgData},a.pushUnique(a.filternames,"glassTile"),a.filter.matrix=function(b,c){var d,e,f,g,h=a.filterSetup(b,c),i=a.isa(h.items.data,"arr")?h.items.data:[1],j=[],k=0;h.items.includeAlpha=a.isa(h.items.includeAlpha,"bool")?h.items.includeAlpha:!1,h.items.wrap=a.isa(h.items.wrap,"bool")?h.items.wrap:!1,d=Math.ceil(Math.sqrt(i.length)),d=d%2===1?Math.pow(d,2):Math.pow(d+1,2);for(var l=0;d>l;l++)i[l]=a.xt(i[l])?parseFloat(i[l]):0,i[l]=isNaN(i[l])?0:i[l];e=Math.floor(i.length/2),f=Math.sqrt(i.length),g=Math.floor(f/2);for(var l=0;f>l;l++)for(var m=0;f>m;m++)0!==i[k]&&j.push({ox:m-g,oy:l-g,wt:i[k]}),k++;return h.imgData=a.filter.doMatrix(j,h),a.filterSave(h),h.imgData},a.pushUnique(a.filternames,"matrix"),a.filter.doMatrix=function(b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q=c.imgData.width,r=c.imgData.height,s=c.imgData.data,t=a.cvx.createImageData(c.imgData),u=t.data,v=c.items.includeAlpha,w=c.items.wrap,x=b.length;if(x>0){for(var y=0;r>y;y++)for(var z=0;q>z;z++){e=g=f=h=d=0,l=4*(y*q+z);for(var A=0,B=x;B>A;A++)n=!0,i=b[A].ox,j=b[A].oy,k=b[A].wt,o=a.isBetween(z+i,0,q-1,!0),p=a.isBetween(y+j,0,r-1,!0),o&&p||(w?(o||(i+=i>0?-q:q),p||(j+=j>0?-r:r)):n=!1),n&&(m=l+4*(j*q+i),e+=s[m]*k,f+=s[++m]*k,g+=s[++m]*k,d+=k,v&&(h+=s[++m]*k));u[l]=0!==d?e/d:e,u[++l]=0!==d?f/d:f,u[++l]=0!==d?g/d:g,u[++l]=v?0!==d?h/d:h:s[l]}return t}return!1},a.pushUnique(a.filternames,"doMatrix"),a}(scrawl);