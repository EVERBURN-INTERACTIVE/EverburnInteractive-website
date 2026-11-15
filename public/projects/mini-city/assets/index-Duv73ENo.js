var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n=class{listeners=new Map;on(e,t){let n=this.listeners.get(e);n||(n=new Set,this.listeners.set(e,n));let r=t;return n.add(r),()=>n?.delete(r)}off(e,t){this.listeners.get(e)?.delete(t)}emit(e,t){let n=this.listeners.get(e);if(n)for(let e of n)e(t)}clear(){this.listeners.clear()}},r=`attached`,i=1e3,a=1001,o=1002,s=1003,c=1004,l=1005,u=1006,d=1007,f=1008,p=1009,m=1014,h=1015,g=1016,_=1020,v=1023,y=1026,b=1027,x=2300,S=2301,C=2302,w=2400,T=2401,E=2402,D=2500,ee=3e3,O=3001,k=3200,te=3201,A=`srgb`,j=`srgb-linear`,ne=`display-p3`,re=`display-p3-linear`,ie=`linear`,ae=`srgb`,oe=`rec709`,se=7680,ce=35044,le=35048,ue=1035,de=2e3,fe=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let n=this._listeners[e];if(n!==void 0){let e=n.indexOf(t);e!==-1&&n.splice(e,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let n=t.slice(0);for(let t=0,r=n.length;t<r;t++)n[t].call(this,e);e.target=null}}},M=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),pe=1234567,me=Math.PI/180,he=180/Math.PI;function ge(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(M[e&255]+M[e>>8&255]+M[e>>16&255]+M[e>>24&255]+`-`+M[t&255]+M[t>>8&255]+`-`+M[t>>16&15|64]+M[t>>24&255]+`-`+M[n&63|128]+M[n>>8&255]+`-`+M[n>>16&255]+M[n>>24&255]+M[r&255]+M[r>>8&255]+M[r>>16&255]+M[r>>24&255]).toLowerCase()}function N(e,t,n){return Math.max(t,Math.min(n,e))}function _e(e,t){return(e%t+t)%t}function P(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function ve(e,t,n){return e===t?0:(n-e)/(t-e)}function F(e,t,n){return(1-n)*e+n*t}function I(e,t,n,r){return F(e,t,1-Math.exp(-n*r))}function L(e,t=1){return t-Math.abs(_e(e,t*2)-t)}function ye(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function be(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function R(e,t){return e+Math.floor(Math.random()*(t-e+1))}function xe(e,t){return e+Math.random()*(t-e)}function Se(e){return e*(.5-Math.random())}function Ce(e){e!==void 0&&(pe=e);let t=pe+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function we(e){return e*me}function Te(e){return e*he}function Ee(e){return(e&e-1)==0&&e!==0}function De(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Oe(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function ke(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:console.warn(`THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Ae(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`Invalid component type.`)}}function z(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`Invalid component type.`)}}var je={DEG2RAD:me,RAD2DEG:he,generateUUID:ge,clamp:N,euclideanModulo:_e,mapLinear:P,inverseLerp:ve,lerp:F,damp:I,pingpong:L,smoothstep:ye,smootherstep:be,randInt:R,randFloat:xe,randFloatSpread:Se,seededRandom:Ce,degToRad:we,radToDeg:Te,isPowerOfTwo:Ee,ceilPowerOfTwo:De,floorPowerOfTwo:Oe,setQuaternionFromProperEuler:ke,normalize:z,denormalize:Ae},B=class e{constructor(t=0,n=0){e.prototype.isVector2=!0,this.x=t,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(N(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},V=class e{constructor(t,n,r,i,a,o,s,c,l){e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,r,i,a,o,s,c,l)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Me.makeScale(e,t)),this}rotate(e){return this.premultiply(Me.makeRotation(-e)),this}translate(e,t){return this.premultiply(Me.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Me=new V;function Ne(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Pe(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Fe(){let e=Pe(`canvas`);return e.style.display=`block`,e}var Ie={};function Le(e){e in Ie||(Ie[e]=!0,console.warn(e))}var Re=new V().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),ze=new V().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Be={[j]:{transfer:ie,primaries:oe,toReference:e=>e,fromReference:e=>e},[A]:{transfer:ae,primaries:oe,toReference:e=>e.convertSRGBToLinear(),fromReference:e=>e.convertLinearToSRGB()},[re]:{transfer:ie,primaries:`p3`,toReference:e=>e.applyMatrix3(ze),fromReference:e=>e.applyMatrix3(Re)},[ne]:{transfer:ae,primaries:`p3`,toReference:e=>e.convertSRGBToLinear().applyMatrix3(ze),fromReference:e=>e.applyMatrix3(Re).convertLinearToSRGB()}},Ve=new Set([j,re]),H={enabled:!0,_workingColorSpace:j,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(e){if(!Ve.has(e))throw Error(`Unsupported working color space, "${e}".`);this._workingColorSpace=e},convert:function(e,t,n){if(this.enabled===!1||t===n||!t||!n)return e;let r=Be[t].toReference,i=Be[n].fromReference;return i(r(e))},fromWorkingColorSpace:function(e,t){return this.convert(e,this._workingColorSpace,t)},toWorkingColorSpace:function(e,t){return this.convert(e,t,this._workingColorSpace)},getPrimaries:function(e){return Be[e].primaries},getTransfer:function(e){return e===``?ie:Be[e].transfer}};function He(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Ue(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var We,Ge=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{We===void 0&&(We=Pe(`canvas`)),We.width=e.width,We.height=e.height;let n=We.getContext(`2d`);e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=We}return t.width>2048||t.height>2048?(console.warn(`THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons`,e),t.toDataURL(`image/jpeg`,.6)):t.toDataURL(`image/png`)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Pe(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=He(i[e]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(He(t[e]/255)*255):t[e]=He(t[e]);return{data:t,width:e.width,height:e.height}}else return console.warn(`THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Ke=0,qe=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ke++}),this.uuid=ge(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Je(r[t].image)):e.push(Je(r[t]))}else e=Je(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Je(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Ge.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(console.warn(`THREE.Texture: Unable to serialize Texture.`),{})}var Ye=0,Xe=class e extends fe{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=a,i=a,o=u,s=f,c=v,l=p,d=e.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ye++}),this.uuid=ge(),this.name=``,this.source=new qe(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=o,this.minFilter=s,this.anisotropy=d,this.format=c,this.internalFormat=null,this.type=l,this.offset=new B(0,0),this.repeat=new B(1,1),this.center=new B(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new V,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof m==`string`?this.colorSpace=m:(Le(`THREE.Texture: Property .encoding has been replaced by .colorSpace.`),this.colorSpace=m===3001?A:``),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case i:e.x-=Math.floor(e.x);break;case a:e.x=e.x<0?0:1;break;case o:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case i:e.y-=Math.floor(e.y);break;case a:e.y=e.y<0?0:1;break;case o:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Le(`THREE.Texture: Property .encoding has been replaced by .colorSpace.`),this.colorSpace===`srgb`?O:ee}set encoding(e){Le(`THREE.Texture: Property .encoding has been replaced by .colorSpace.`),this.colorSpace=e===3001?A:``}};Xe.DEFAULT_IMAGE=null,Xe.DEFAULT_MAPPING=300,Xe.DEFAULT_ANISOTROPY=1;var Ze=class e{constructor(t=0,n=0,r=0,i=1){e.prototype.isVector4=!0,this.x=t,this.y=n,this.z=r,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Qe=class extends fe{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Ze(0,0,e,t),this.scissorTest=!1,this.viewport=new Ze(0,0,e,t);let r={width:e,height:t,depth:1};n.encoding!==void 0&&(Le(`THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace.`),n.colorSpace=n.encoding===3001?A:``),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:u,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Xe(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new qe(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:`dispose`})}},$e=class extends Qe{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},et=class extends Xe{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=s,this.minFilter=s,this.wrapR=a,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},tt=class extends Xe{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=s,this.minFilter=s,this.wrapR=a,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},nt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(o===0){e[t+0]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=p,e[t+3]=m;return}if(u!==m||s!==d||c!==f||l!==p){let e=1-o,t=s*d+c*f+l*p+u*m,n=t>=0?1:-1,r=1-t*t;if(r>2**-52){let i=Math.sqrt(r),a=Math.atan2(i,t*n);e=Math.sin(e*a)/i,o=Math.sin(o*a)/i}let i=o*n;if(s=s*e+d*i,c=c*e+f*i,l=l*e+p*i,u=u*e+m*i,e===1-o){let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:console.warn(`THREE.Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<2**-52?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(N(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,r=this._y,i=this._z,a=this._w,o=a*e._w+n*e._x+r*e._y+i*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=i,this;let s=1-o*o;if(s<=2**-52){let e=1-t;return this._w=e*a+t*this._w,this._x=e*n+t*this._x,this._y=e*r+t*this._y,this._z=e*i+t*this._z,this.normalize(),this}let c=Math.sqrt(s),l=Math.atan2(c,o),u=Math.sin((1-t)*l)/c,d=Math.sin(t*l)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=i*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),r=2*Math.PI*Math.random(),i=2*Math.PI*Math.random();return this.set(t*Math.cos(r),n*Math.sin(i),n*Math.cos(i),t*Math.sin(r))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},U=class e{constructor(t=0,n=0,r=0){e.prototype.isVector3=!0,this.x=t,this.y=n,this.z=r}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(it.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(it.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return rt.copy(this).projectOnVector(e),this.sub(rt)}reflect(e){return this.sub(rt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(N(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},rt=new U,it=new nt,at=class{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(st.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(st.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=st.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,st):st.fromBufferAttribute(r,t),st.applyMatrix4(e.matrixWorld),this.expandByPoint(st);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),ct.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),ct.copy(e.boundingBox)),ct.applyMatrix4(e.matrixWorld),this.union(ct)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,st),st.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ht),gt.subVectors(this.max,ht),lt.subVectors(e.a,ht),ut.subVectors(e.b,ht),dt.subVectors(e.c,ht),ft.subVectors(ut,lt),pt.subVectors(dt,ut),mt.subVectors(lt,dt);let t=[0,-ft.z,ft.y,0,-pt.z,pt.y,0,-mt.z,mt.y,ft.z,0,-ft.x,pt.z,0,-pt.x,mt.z,0,-mt.x,-ft.y,ft.x,0,-pt.y,pt.x,0,-mt.y,mt.x,0];return!yt(t,lt,ut,dt,gt)||(t=[1,0,0,0,1,0,0,0,1],!yt(t,lt,ut,dt,gt))?!1:(_t.crossVectors(ft,pt),t=[_t.x,_t.y,_t.z],yt(t,lt,ut,dt,gt))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,st).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(st).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ot[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ot[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ot[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ot[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ot[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ot[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ot[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ot[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ot),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},ot=[new U,new U,new U,new U,new U,new U,new U,new U],st=new U,ct=new at,lt=new U,ut=new U,dt=new U,ft=new U,pt=new U,mt=new U,ht=new U,gt=new U,_t=new U,vt=new U;function yt(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){vt.fromArray(e,a);let o=i.x*Math.abs(vt.x)+i.y*Math.abs(vt.y)+i.z*Math.abs(vt.z),s=t.dot(vt),c=n.dot(vt),l=r.dot(vt);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var bt=new at,xt=new U,St=new U,Ct=class{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?bt.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;xt.subVectors(e,this.center);let t=xt.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(xt,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(St.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(xt.copy(e.center).add(St)),this.expandByPoint(xt.copy(e.center).sub(St))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},wt=new U,Tt=new U,Et=new U,Dt=new U,Ot=new U,kt=new U,At=new U,jt=class{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,wt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=wt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(wt.copy(this.origin).addScaledVector(this.direction,t),wt.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Tt.copy(e).add(t).multiplyScalar(.5),Et.copy(t).sub(e).normalize(),Dt.copy(this.origin).sub(Tt);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Et),o=Dt.dot(this.direction),s=-Dt.dot(Et),c=Dt.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0)if(u=a*s-o,d=a*o-s,p=i*l,u>=0)if(d>=-p)if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c);else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Tt).addScaledVector(Et,d),f}intersectSphere(e,t){wt.subVectors(e.center,this.origin);let n=wt.dot(this.direction),r=wt.dot(wt)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,wt)!==null}intersectTriangle(e,t,n,r,i){Ot.subVectors(t,e),kt.subVectors(n,e),At.crossVectors(Ot,kt);let a=this.direction.dot(At),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Dt.subVectors(this.origin,e);let s=o*this.direction.dot(kt.crossVectors(Dt,kt));if(s<0)return null;let c=o*this.direction.dot(Ot.cross(Dt));if(c<0||s+c>a)return null;let l=-o*Dt.dot(At);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},W=class e{constructor(t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g){e.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,r=1/Mt.setFromMatrixColumn(e,0).length(),i=1/Mt.setFromMatrixColumn(e,1).length(),a=1/Mt.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Pt,e,Ft)}lookAt(e,t,n){let r=this.elements;return Rt.subVectors(e,t),Rt.lengthSq()===0&&(Rt.z=1),Rt.normalize(),It.crossVectors(n,Rt),It.lengthSq()===0&&(Math.abs(n.z)===1?Rt.x+=1e-4:Rt.z+=1e-4,Rt.normalize(),It.crossVectors(n,Rt)),It.normalize(),Lt.crossVectors(Rt,It),r[0]=It.x,r[4]=Lt.x,r[8]=Rt.x,r[1]=It.y,r[5]=Lt.y,r[9]=Rt.y,r[2]=It.z,r[6]=Lt.z,r[10]=Rt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],ee=r[13],O=r[2],k=r[6],te=r[10],A=r[14],j=r[3],ne=r[7],re=r[11],ie=r[15];return i[0]=a*x+o*T+s*O+c*j,i[4]=a*S+o*E+s*k+c*ne,i[8]=a*C+o*D+s*te+c*re,i[12]=a*w+o*ee+s*A+c*ie,i[1]=l*x+u*T+d*O+f*j,i[5]=l*S+u*E+d*k+f*ne,i[9]=l*C+u*D+d*te+f*re,i[13]=l*w+u*ee+d*A+f*ie,i[2]=p*x+m*T+h*O+g*j,i[6]=p*S+m*E+h*k+g*ne,i[10]=p*C+m*D+h*te+g*re,i[14]=p*w+m*ee+h*A+g*ie,i[3]=_*x+v*T+y*O+b*j,i[7]=_*S+v*E+y*k+b*ne,i[11]=_*C+v*D+y*te+b*re,i[15]=_*w+v*ee+y*A+b*ie,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15];return p*(+i*s*u-r*c*u-i*o*d+n*c*d+r*o*f-n*s*f)+m*(+t*s*f-t*c*d+i*a*d-r*a*f+r*c*l-i*s*l)+h*(+t*c*u-t*o*f-i*a*u+n*a*f+i*o*l-n*c*l)+g*(-r*o*l-t*s*u+t*o*d+r*a*u-n*a*d+n*s*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=u*h*c-m*d*c+m*s*f-o*h*f-u*s*g+o*d*g,v=p*d*c-l*h*c-p*s*f+a*h*f+l*s*g-a*d*g,y=l*m*c-p*u*c+p*o*f-a*m*f-l*o*g+a*u*g,b=p*u*s-l*m*s-p*o*d+a*m*d+l*o*h-a*u*h,x=t*_+n*v+r*y+i*b;if(x===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/x;return e[0]=_*S,e[1]=(m*d*i-u*h*i-m*r*f+n*h*f+u*r*g-n*d*g)*S,e[2]=(o*h*i-m*s*i+m*r*c-n*h*c-o*r*g+n*s*g)*S,e[3]=(u*s*i-o*d*i-u*r*c+n*d*c+o*r*f-n*s*f)*S,e[4]=v*S,e[5]=(l*h*i-p*d*i+p*r*f-t*h*f-l*r*g+t*d*g)*S,e[6]=(p*s*i-a*h*i-p*r*c+t*h*c+a*r*g-t*s*g)*S,e[7]=(a*d*i-l*s*i+l*r*c-t*d*c-a*r*f+t*s*f)*S,e[8]=y*S,e[9]=(p*u*i-l*m*i-p*n*f+t*m*f+l*n*g-t*u*g)*S,e[10]=(a*m*i-p*o*i+p*n*c-t*m*c-a*n*g+t*o*g)*S,e[11]=(l*o*i-a*u*i-l*n*c+t*u*c+a*n*f-t*o*f)*S,e[12]=b*S,e[13]=(l*m*r-p*u*r+p*n*d-t*m*d-l*n*h+t*u*h)*S,e[14]=(p*o*r-a*m*r-p*n*s+t*m*s+a*n*h-t*o*h)*S,e[15]=(a*u*r-l*o*r+l*n*s-t*u*s-a*n*d+t*o*d)*S,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements,i=Mt.set(r[0],r[1],r[2]).length(),a=Mt.set(r[4],r[5],r[6]).length(),o=Mt.set(r[8],r[9],r[10]).length();this.determinant()<0&&(i=-i),e.x=r[12],e.y=r[13],e.z=r[14],Nt.copy(this);let s=1/i,c=1/a,l=1/o;return Nt.elements[0]*=s,Nt.elements[1]*=s,Nt.elements[2]*=s,Nt.elements[4]*=c,Nt.elements[5]*=c,Nt.elements[6]*=c,Nt.elements[8]*=l,Nt.elements[9]*=l,Nt.elements[10]*=l,t.setFromRotationMatrix(Nt),n.x=i,n.y=a,n.z=o,this}makePerspective(e,t,n,r,i,a,o=de){let s=this.elements,c=2*i/(t-e),l=2*i/(n-r),u=(t+e)/(t-e),d=(n+r)/(n-r),f,p;if(o===2e3)f=-(a+i)/(a-i),p=-2*a*i/(a-i);else if(o===2001)f=-a/(a-i),p=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return s[0]=c,s[4]=0,s[8]=u,s[12]=0,s[1]=0,s[5]=l,s[9]=d,s[13]=0,s[2]=0,s[6]=0,s[10]=f,s[14]=p,s[3]=0,s[7]=0,s[11]=-1,s[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=de){let s=this.elements,c=1/(t-e),l=1/(n-r),u=1/(a-i),d=(t+e)*c,f=(n+r)*l,p,m;if(o===2e3)p=(a+i)*u,m=-2*u;else if(o===2001)p=i*u,m=-1*u;else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return s[0]=2*c,s[4]=0,s[8]=0,s[12]=-d,s[1]=0,s[5]=2*l,s[9]=0,s[13]=-f,s[2]=0,s[6]=0,s[10]=m,s[14]=-p,s[3]=0,s[7]=0,s[11]=0,s[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Mt=new U,Nt=new W,Pt=new U(0,0,0),Ft=new U(1,1,1),It=new U,Lt=new U,Rt=new U,zt=new W,Bt=new nt,Vt=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(N(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-N(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(N(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-N(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(N(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-N(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:console.warn(`THREE.Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return zt.makeRotationFromQuaternion(e),this.setFromRotationMatrix(zt,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Bt.setFromEuler(this),this.setFromQuaternion(Bt,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Vt.DEFAULT_ORDER=`XYZ`;var Ht=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!=0}},Ut=0,Wt=new U,Gt=new nt,Kt=new W,qt=new U,Jt=new U,Yt=new U,Xt=new nt,Zt=new U(1,0,0),Qt=new U(0,1,0),$t=new U(0,0,1),en={type:`added`},tn={type:`removed`},nn=class e extends fe{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ut++}),this.uuid=ge(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new U,n=new Vt,r=new nt,i=new U(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new W},normalMatrix:{value:new V}}),this.matrix=new W,this.matrixWorld=new W,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ht,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Gt.setFromAxisAngle(e,t),this.quaternion.multiply(Gt),this}rotateOnWorldAxis(e,t){return Gt.setFromAxisAngle(e,t),this.quaternion.premultiply(Gt),this}rotateX(e){return this.rotateOnAxis(Zt,e)}rotateY(e){return this.rotateOnAxis(Qt,e)}rotateZ(e){return this.rotateOnAxis($t,e)}translateOnAxis(e,t){return Wt.copy(e).applyQuaternion(this.quaternion),this.position.add(Wt.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Zt,e)}translateY(e){return this.translateOnAxis(Qt,e)}translateZ(e){return this.translateOnAxis($t,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Kt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?qt.copy(e):qt.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Jt.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Kt.lookAt(Jt,qt,this.up):Kt.lookAt(qt,Jt,this.up),this.quaternion.setFromRotationMatrix(Kt),r&&(Kt.extractRotation(r.matrixWorld),Gt.setFromRotationMatrix(Kt),this.quaternion.premultiply(Gt.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(console.error(`THREE.Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(en)):console.error(`THREE.Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(tn)),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Kt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Kt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Kt),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Jt,e,Yt),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Jt,Xt,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++){let r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){let e=this.children;for(let t=0,n=e.length;t<n;t++){let n=e[t];n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!1,!0)}}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(e=>({boxInitialized:e.boxInitialized,boxMin:e.box.min.toArray(),boxMax:e.box.max.toArray(),sphereInitialized:e.sphereInitialized,sphereRadius:e.sphere.radius,sphereCenter:e.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material);if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};nn.DEFAULT_UP=new U(0,1,0),nn.DEFAULT_MATRIX_AUTO_UPDATE=!0,nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var rn=new U,an=new U,on=new U,sn=new U,cn=new U,ln=new U,un=new U,dn=new U,fn=new U,pn=new U,mn=!1,hn=class e{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),rn.subVectors(e,t),r.cross(rn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){rn.subVectors(r,t),an.subVectors(n,t),on.subVectors(e,t);let a=rn.dot(rn),o=rn.dot(an),s=rn.dot(on),c=an.dot(an),l=an.dot(on),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,sn)===null?!1:sn.x>=0&&sn.y>=0&&sn.x+sn.y<=1}static getUV(e,t,n,r,i,a,o,s){return mn===!1&&(console.warn(`THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation().`),mn=!0),this.getInterpolation(e,t,n,r,i,a,o,s)}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,sn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,sn.x),s.addScaledVector(a,sn.y),s.addScaledVector(o,sn.z),s)}static isFrontFacing(e,t,n,r){return rn.subVectors(n,t),an.subVectors(e,t),rn.cross(an).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return rn.subVectors(this.c,this.b),an.subVectors(this.a,this.b),rn.cross(an).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getUV(t,n,r,i,a){return mn===!1&&(console.warn(`THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation().`),mn=!0),e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;cn.subVectors(r,n),ln.subVectors(i,n),dn.subVectors(e,n);let s=cn.dot(dn),c=ln.dot(dn);if(s<=0&&c<=0)return t.copy(n);fn.subVectors(e,r);let l=cn.dot(fn),u=ln.dot(fn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(cn,a);pn.subVectors(e,i);let f=cn.dot(pn),p=ln.dot(pn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(ln,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return un.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(un,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(cn,a).addScaledVector(ln,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},gn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_n={h:0,s:0,l:0},vn={h:0,s:0,l:0};function yn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var G=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=A){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,H.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=H.workingColorSpace){return this.r=e,this.g=t,this.b=n,H.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=H.workingColorSpace){if(e=_e(e,1),t=N(t,0,1),n=N(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=yn(i,r,e+1/3),this.g=yn(i,r,e),this.b=yn(i,r,e-1/3)}return H.toWorkingColorSpace(this,r),this}setStyle(e,t=A){function n(t){t!==void 0&&parseFloat(t)<1&&console.warn(`THREE.Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:console.warn(`THREE.Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);console.warn(`THREE.Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=A){let n=gn[e.toLowerCase()];return n===void 0?console.warn(`THREE.Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=He(e.r),this.g=He(e.g),this.b=He(e.b),this}copyLinearToSRGB(e){return this.r=Ue(e.r),this.g=Ue(e.g),this.b=Ue(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=A){return H.fromWorkingColorSpace(bn.copy(this),e),Math.round(N(bn.r*255,0,255))*65536+Math.round(N(bn.g*255,0,255))*256+Math.round(N(bn.b*255,0,255))}getHexString(e=A){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=H.workingColorSpace){H.fromWorkingColorSpace(bn.copy(this),t);let n=bn.r,r=bn.g,i=bn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4;break}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=H.workingColorSpace){return H.fromWorkingColorSpace(bn.copy(this),t),e.r=bn.r,e.g=bn.g,e.b=bn.b,e}getStyle(e=A){H.fromWorkingColorSpace(bn.copy(this),e);let t=bn.r,n=bn.g,r=bn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(_n),this.setHSL(_n.h+e,_n.s+t,_n.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(_n),e.getHSL(vn);let n=F(_n.h,vn.h,t),r=F(_n.s,vn.s,t),i=F(_n.l,vn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},bn=new G;G.NAMES=gn;var xn=0,Sn=class extends fe{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xn++}),this.uuid=ge(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new G(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=se,this.stencilZFail=se,this.stencilZPass=se,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Cn=class extends Sn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new G(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},wn=Tn();function Tn(){let e=new ArrayBuffer(4),t=new Float32Array(e),n=new Uint32Array(e),r=new Uint32Array(512),i=new Uint32Array(512);for(let e=0;e<256;++e){let t=e-127;t<-27?(r[e]=0,r[e|256]=32768,i[e]=24,i[e|256]=24):t<-14?(r[e]=1024>>-t-14,r[e|256]=1024>>-t-14|32768,i[e]=-t-1,i[e|256]=-t-1):t<=15?(r[e]=t+15<<10,r[e|256]=t+15<<10|32768,i[e]=13,i[e|256]=13):t<128?(r[e]=31744,r[e|256]=64512,i[e]=24,i[e|256]=24):(r[e]=31744,r[e|256]=64512,i[e]=13,i[e|256]=13)}let a=new Uint32Array(2048),o=new Uint32Array(64),s=new Uint32Array(64);for(let e=1;e<1024;++e){let t=e<<13,n=0;for(;!(t&8388608);)t<<=1,n-=8388608;t&=-8388609,n+=947912704,a[e]=t|n}for(let e=1024;e<2048;++e)a[e]=939524096+(e-1024<<13);for(let e=1;e<31;++e)o[e]=e<<23;o[31]=1199570944,o[32]=2147483648;for(let e=33;e<63;++e)o[e]=2147483648+(e-32<<23);o[63]=3347054592;for(let e=1;e<64;++e)e!==32&&(s[e]=1024);return{floatView:t,uint32View:n,baseTable:r,shiftTable:i,mantissaTable:a,exponentTable:o,offsetTable:s}}function En(e){Math.abs(e)>65504&&console.warn(`THREE.DataUtils.toHalfFloat(): Value out of range.`),e=N(e,-65504,65504),wn.floatView[0]=e;let t=wn.uint32View[0],n=t>>23&511;return wn.baseTable[n]+((t&8388607)>>wn.shiftTable[n])}function Dn(e){let t=e>>10;return wn.uint32View[0]=wn.mantissaTable[wn.offsetTable[t]+(e&1023)]+wn.exponentTable[t],wn.floatView[0]}var On={toHalfFloat:En,fromHalfFloat:Dn},kn=new U,An=new B,jn=class{constructor(e,t,n=!1){if(Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=ce,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=h,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn(`THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead.`),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)An.fromBufferAttribute(this,t),An.applyMatrix3(e),this.setXY(t,An.x,An.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)kn.fromBufferAttribute(this,t),kn.applyMatrix3(e),this.setXYZ(t,kn.x,kn.y,kn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)kn.fromBufferAttribute(this,t),kn.applyMatrix4(e),this.setXYZ(t,kn.x,kn.y,kn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)kn.fromBufferAttribute(this,t),kn.applyNormalMatrix(e),this.setXYZ(t,kn.x,kn.y,kn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)kn.fromBufferAttribute(this,t),kn.transformDirection(e),this.setXYZ(t,kn.x,kn.y,kn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ae(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=z(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ae(t,this.array)),t}setX(e,t){return this.normalized&&(t=z(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ae(t,this.array)),t}setY(e,t){return this.normalized&&(t=z(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ae(t,this.array)),t}setZ(e,t){return this.normalized&&(t=z(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ae(t,this.array)),t}setW(e,t){return this.normalized&&(t=z(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=z(t,this.array),n=z(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=z(t,this.array),n=z(n,this.array),r=z(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=z(t,this.array),n=z(n,this.array),r=z(r,this.array),i=z(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}},Mn=class extends jn{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Nn=class extends jn{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Pn=class extends jn{constructor(e,t,n){super(new Float32Array(e),t,n)}},Fn=0,In=new W,Ln=new nn,Rn=new U,zn=new at,Bn=new at,Vn=new U,Hn=class e extends fe{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Fn++}),this.uuid=ge(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ne(e)?Nn:Mn)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new V().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return In.makeRotationFromQuaternion(e),this.applyMatrix4(In),this}rotateX(e){return In.makeRotationX(e),this.applyMatrix4(In),this}rotateY(e){return In.makeRotationY(e),this.applyMatrix4(In),this}rotateZ(e){return In.makeRotationZ(e),this.applyMatrix4(In),this}translate(e,t,n){return In.makeTranslation(e,t,n),this.applyMatrix4(In),this}scale(e,t,n){return In.makeScale(e,t,n),this.applyMatrix4(In),this}lookAt(e){return Ln.lookAt(e),Ln.updateMatrix(),this.applyMatrix4(Ln.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Rn).negate(),this.translate(Rn.x,Rn.y,Rn.z),this}setFromPoints(e){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute(`position`,new Pn(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new at);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error(`THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".`,this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];zn.setFromBufferAttribute(n),this.morphTargetsRelative?(Vn.addVectors(this.boundingBox.min,zn.min),this.boundingBox.expandByPoint(Vn),Vn.addVectors(this.boundingBox.max,zn.max),this.boundingBox.expandByPoint(Vn)):(this.boundingBox.expandByPoint(zn.min),this.boundingBox.expandByPoint(zn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error(`THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ct);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error(`THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".`,this),this.boundingSphere.set(new U,1/0);return}if(e){let n=this.boundingSphere.center;if(zn.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Bn.setFromBufferAttribute(n),this.morphTargetsRelative?(Vn.addVectors(zn.min,Bn.min),zn.expandByPoint(Vn),Vn.addVectors(zn.max,Bn.max),zn.expandByPoint(Vn)):(zn.expandByPoint(Bn.min),zn.expandByPoint(Bn.max))}zn.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Vn.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Vn));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Vn.fromBufferAttribute(a,t),o&&(Rn.fromBufferAttribute(e,t),Vn.add(Rn)),r=Math.max(r,n.distanceToSquared(Vn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error(`THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=e.array,r=t.position.array,i=t.normal.array,a=t.uv.array,o=r.length/3;this.hasAttribute(`tangent`)===!1&&this.setAttribute(`tangent`,new jn(new Float32Array(4*o),4));let s=this.getAttribute(`tangent`).array,c=[],l=[];for(let e=0;e<o;e++)c[e]=new U,l[e]=new U;let u=new U,d=new U,f=new U,p=new B,m=new B,h=new B,g=new U,_=new U;function v(e,t,n){u.fromArray(r,e*3),d.fromArray(r,t*3),f.fromArray(r,n*3),p.fromArray(a,e*2),m.fromArray(a,t*2),h.fromArray(a,n*2),d.sub(u),f.sub(u),m.sub(p),h.sub(p);let i=1/(m.x*h.y-h.x*m.y);isFinite(i)&&(g.copy(d).multiplyScalar(h.y).addScaledVector(f,-m.y).multiplyScalar(i),_.copy(f).multiplyScalar(m.x).addScaledVector(d,-h.x).multiplyScalar(i),c[e].add(g),c[t].add(g),c[n].add(g),l[e].add(_),l[t].add(_),l[n].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:n.length}]);for(let e=0,t=y.length;e<t;++e){let t=y[e],r=t.start,i=t.count;for(let e=r,t=r+i;e<t;e+=3)v(n[e+0],n[e+1],n[e+2])}let b=new U,x=new U,S=new U,C=new U;function w(e){S.fromArray(i,e*3),C.copy(S);let t=c[e];b.copy(t),b.sub(S.multiplyScalar(S.dot(t))).normalize(),x.crossVectors(C,t);let n=x.dot(l[e])<0?-1:1;s[e*4]=b.x,s[e*4+1]=b.y,s[e*4+2]=b.z,s[e*4+3]=n}for(let e=0,t=y.length;e<t;++e){let t=y[e],r=t.start,i=t.count;for(let e=r,t=r+i;e<t;e+=3)w(n[e+0]),w(n[e+1]),w(n[e+2])}}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0)n=new jn(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new U,i=new U,a=new U,o=new U,s=new U,c=new U,l=new U,u=new U;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Vn.fromBufferAttribute(e,t),Vn.normalize(),e.setXYZ(t,Vn.x,Vn.y,Vn.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new jn(a,r,i)}if(this.index===null)return console.warn(`THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.6,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:`dispose`})}},Un=new W,Wn=new jt,Gn=new Ct,Kn=new U,qn=new U,Jn=new U,Yn=new U,Xn=new U,Zn=new U,Qn=new B,$n=new B,er=new B,tr=new U,nr=new U,rr=new U,ir=new U,ar=new U,K=class extends nn{constructor(e=new Hn,t=new Cn){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Zn.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Xn.fromBufferAttribute(s,e),a?Zn.addScaledVector(Xn,r):Zn.addScaledVector(Xn.sub(t),r))}t.add(Zn)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Gn.copy(n.boundingSphere),Gn.applyMatrix4(i),Wn.copy(e.ray).recast(e.near),!(Gn.containsPoint(Wn.origin)===!1&&(Wn.intersectSphere(Gn,Kn)===null||Wn.origin.distanceToSquared(Kn)>(e.far-e.near)**2))&&(Un.copy(i).invert(),Wn.copy(e.ray).applyMatrix4(Un),!(n.boundingBox!==null&&Wn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Wn)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null)if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=sr(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=sr(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}else if(s!==void 0)if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=sr(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=sr(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}};function or(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;ar.copy(s),ar.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(ar);return l<n.near||l>n.far?null:{distance:l,point:ar.clone(),object:e}}function sr(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,qn),e.getVertexPosition(c,Jn),e.getVertexPosition(l,Yn);let u=or(e,t,n,r,qn,Jn,Yn,ir);if(u){i&&(Qn.fromBufferAttribute(i,s),$n.fromBufferAttribute(i,c),er.fromBufferAttribute(i,l),u.uv=hn.getInterpolation(ir,qn,Jn,Yn,Qn,$n,er,new B)),a&&(Qn.fromBufferAttribute(a,s),$n.fromBufferAttribute(a,c),er.fromBufferAttribute(a,l),u.uv1=hn.getInterpolation(ir,qn,Jn,Yn,Qn,$n,er,new B),u.uv2=u.uv1),o&&(tr.fromBufferAttribute(o,s),nr.fromBufferAttribute(o,c),rr.fromBufferAttribute(o,l),u.normal=hn.getInterpolation(ir,qn,Jn,Yn,tr,nr,rr,new U),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let e={a:s,b:c,c:l,normal:new U,materialIndex:0};hn.getNormal(qn,Jn,Yn,e.normal),u.face=e}return u}var cr=class e extends Hn{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Pn(c,3)),this.setAttribute(`normal`,new Pn(l,3)),this.setAttribute(`uv`,new Pn(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new U;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function lr(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone():Array.isArray(i)?t[n][r]=i.slice():t[n][r]=i}}return t}function ur(e){let t={};for(let n=0;n<e.length;n++){let r=lr(e[n]);for(let e in r)t[e]=r[e]}return t}function dr(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function fr(e){return e.getRenderTarget()===null?e.outputColorSpace:H.workingColorSpace}var pr={clone:lr,merge:ur},mr=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,hr=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,gr=class extends Sn{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=mr,this.fragmentShader=hr,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=lr(e.uniforms),this.uniformsGroups=dr(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},_r=class extends nn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new W,this.projectionMatrix=new W,this.projectionMatrixInverse=new W,this.coordinateSystem=de}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},vr=class extends _r{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=he*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(me*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return he*2*Math.atan(Math.tan(me*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(me*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},yr=-90,br=1,xr=class extends nn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new vr(yr,br,e,t);r.layers=this.layers,this.add(r);let i=new vr(yr,br,e,t);i.layers=this.layers,this.add(i);let a=new vr(yr,br,e,t);a.layers=this.layers,this.add(a);let o=new vr(yr,br,e,t);o.layers=this.layers,this.add(o);let s=new vr(yr,br,e,t);s.layers=this.layers,this.add(s);let c=new vr(yr,br,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,i),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,s),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Sr=class extends Xe{constructor(e,t,n,r,i,a,o,s,c,l){e=e===void 0?[]:e,t=t===void 0?301:t,super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Cr=class extends $e{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];t.encoding!==void 0&&(Le(`THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace.`),t.colorSpace=t.encoding===3001?A:``),this.texture=new Sr(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps===void 0?!1:t.generateMipmaps,this.texture.minFilter=t.minFilter===void 0?u:t.minFilter}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new cr(5,5,5),i=new gr({name:`CubemapFromEquirect`,uniforms:lr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new K(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=u),new xr(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,r){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},wr=new U,Tr=new U,Er=new V,Dr=class{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=wr.subVectors(n,t).cross(Tr.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(wr),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let i=-(e.start.dot(this.normal)+this.constant)/r;return i<0||i>1?null:t.copy(e.start).addScaledVector(n,i)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Er.getNormalMatrix(e),r=this.coplanarPoint(wr).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Or=new Ct,kr=new U,Ar=class{constructor(e=new Dr,t=new Dr,n=new Dr,r=new Dr,i=new Dr,a=new Dr){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=de){let n=this.planes,r=e.elements,i=r[0],a=r[1],o=r[2],s=r[3],c=r[4],l=r[5],u=r[6],d=r[7],f=r[8],p=r[9],m=r[10],h=r[11],g=r[12],_=r[13],v=r[14],y=r[15];if(n[0].setComponents(s-i,d-c,h-f,y-g).normalize(),n[1].setComponents(s+i,d+c,h+f,y+g).normalize(),n[2].setComponents(s+a,d+l,h+p,y+_).normalize(),n[3].setComponents(s-a,d-l,h-p,y-_).normalize(),n[4].setComponents(s-o,d-u,h-m,y-v).normalize(),t===2e3)n[5].setComponents(s+o,d+u,h+m,y+v).normalize();else if(t===2001)n[5].setComponents(o,u,m,v).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Or.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Or.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Or)}intersectsSprite(e){return Or.center.set(0,0,0),Or.radius=.7071067811865476,Or.applyMatrix4(e.matrixWorld),this.intersectsSphere(Or)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(kr.x=r.normal.x>0?e.max.x:e.min.x,kr.y=r.normal.y>0?e.max.y:e.min.y,kr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(kr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function jr(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Mr(e,t){let n=t.isWebGL2,r=new WeakMap;function i(t,r){let i=t.array,a=t.usage,o=i.byteLength,s=e.createBuffer();e.bindBuffer(r,s),e.bufferData(r,i,a),t.onUploadCallback();let c;if(i instanceof Float32Array)c=e.FLOAT;else if(i instanceof Uint16Array)if(t.isFloat16BufferAttribute)if(n)c=e.HALF_FLOAT;else throw Error(`THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.`);else c=e.UNSIGNED_SHORT;else if(i instanceof Int16Array)c=e.SHORT;else if(i instanceof Uint32Array)c=e.UNSIGNED_INT;else if(i instanceof Int32Array)c=e.INT;else if(i instanceof Int8Array)c=e.BYTE;else if(i instanceof Uint8Array)c=e.UNSIGNED_BYTE;else if(i instanceof Uint8ClampedArray)c=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+i);return{buffer:s,type:c,bytesPerElement:i.BYTES_PER_ELEMENT,version:t.version,size:o}}function a(t,r,i){let a=r.array,o=r._updateRange,s=r.updateRanges;if(e.bindBuffer(i,t),o.count===-1&&s.length===0&&e.bufferSubData(i,0,a),s.length!==0){for(let t=0,r=s.length;t<r;t++){let r=s[t];n?e.bufferSubData(i,r.start*a.BYTES_PER_ELEMENT,a,r.start,r.count):e.bufferSubData(i,r.start*a.BYTES_PER_ELEMENT,a.subarray(r.start,r.start+r.count))}r.clearUpdateRanges()}o.count!==-1&&(n?e.bufferSubData(i,o.offset*a.BYTES_PER_ELEMENT,a,o.offset,o.count):e.bufferSubData(i,o.offset*a.BYTES_PER_ELEMENT,a.subarray(o.offset,o.offset+o.count)),o.count=-1),r.onUploadCallback()}function o(e){return e.isInterleavedBufferAttribute&&(e=e.data),r.get(e)}function s(t){t.isInterleavedBufferAttribute&&(t=t.data);let n=r.get(t);n&&(e.deleteBuffer(n.buffer),r.delete(t))}function c(e,t){if(e.isGLBufferAttribute){let t=r.get(e);(!t||t.version<e.version)&&r.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}e.isInterleavedBufferAttribute&&(e=e.data);let n=r.get(e);if(n===void 0)r.set(e,i(e,t));else if(n.version<e.version){if(n.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);a(n.buffer,e,t),n.version=e.version}}return{get:o,remove:s,update:c}}var Nr=class e extends Hn{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Pn(p,3)),this.setAttribute(`normal`,new Pn(m,3)),this.setAttribute(`uv`,new Pn(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},q={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_fragment:`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},J={common:{diffuse:{value:new G(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new V},alphaMap:{value:null},alphaMapTransform:{value:new V},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new V}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new V}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new V}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new V},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new V},normalScale:{value:new B(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new V},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new V}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new V}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new V}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new G(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new G(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new V},alphaTest:{value:0},uvTransform:{value:new V}},sprite:{diffuse:{value:new G(16777215)},opacity:{value:1},center:{value:new B(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new V},alphaMap:{value:null},alphaMapTransform:{value:new V},alphaTest:{value:0}}},Pr={basic:{uniforms:ur([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.fog]),vertexShader:q.meshbasic_vert,fragmentShader:q.meshbasic_frag},lambert:{uniforms:ur([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.fog,J.lights,{emissive:{value:new G(0)}}]),vertexShader:q.meshlambert_vert,fragmentShader:q.meshlambert_frag},phong:{uniforms:ur([J.common,J.specularmap,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.fog,J.lights,{emissive:{value:new G(0)},specular:{value:new G(1118481)},shininess:{value:30}}]),vertexShader:q.meshphong_vert,fragmentShader:q.meshphong_frag},standard:{uniforms:ur([J.common,J.envmap,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.roughnessmap,J.metalnessmap,J.fog,J.lights,{emissive:{value:new G(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:q.meshphysical_vert,fragmentShader:q.meshphysical_frag},toon:{uniforms:ur([J.common,J.aomap,J.lightmap,J.emissivemap,J.bumpmap,J.normalmap,J.displacementmap,J.gradientmap,J.fog,J.lights,{emissive:{value:new G(0)}}]),vertexShader:q.meshtoon_vert,fragmentShader:q.meshtoon_frag},matcap:{uniforms:ur([J.common,J.bumpmap,J.normalmap,J.displacementmap,J.fog,{matcap:{value:null}}]),vertexShader:q.meshmatcap_vert,fragmentShader:q.meshmatcap_frag},points:{uniforms:ur([J.points,J.fog]),vertexShader:q.points_vert,fragmentShader:q.points_frag},dashed:{uniforms:ur([J.common,J.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:q.linedashed_vert,fragmentShader:q.linedashed_frag},depth:{uniforms:ur([J.common,J.displacementmap]),vertexShader:q.depth_vert,fragmentShader:q.depth_frag},normal:{uniforms:ur([J.common,J.bumpmap,J.normalmap,J.displacementmap,{opacity:{value:1}}]),vertexShader:q.meshnormal_vert,fragmentShader:q.meshnormal_frag},sprite:{uniforms:ur([J.sprite,J.fog]),vertexShader:q.sprite_vert,fragmentShader:q.sprite_frag},background:{uniforms:{uvTransform:{value:new V},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:q.background_vert,fragmentShader:q.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:q.backgroundCube_vert,fragmentShader:q.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:q.cube_vert,fragmentShader:q.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:q.equirect_vert,fragmentShader:q.equirect_frag},distanceRGBA:{uniforms:ur([J.common,J.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:q.distanceRGBA_vert,fragmentShader:q.distanceRGBA_frag},shadow:{uniforms:ur([J.lights,J.fog,{color:{value:new G(0)},opacity:{value:1}}]),vertexShader:q.shadow_vert,fragmentShader:q.shadow_frag}};Pr.physical={uniforms:ur([Pr.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new V},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new V},clearcoatNormalScale:{value:new B(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new V},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new V},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new V},sheen:{value:0},sheenColor:{value:new G(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new V},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new V},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new V},transmissionSamplerSize:{value:new B},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new V},attenuationDistance:{value:0},attenuationColor:{value:new G(0)},specularColor:{value:new G(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new V},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new V},anisotropyVector:{value:new B},anisotropyMap:{value:null},anisotropyMapTransform:{value:new V}}]),vertexShader:q.meshphysical_vert,fragmentShader:q.meshphysical_frag};var Fr={r:0,b:0,g:0};function Ir(e,t,n,r,i,a,o){let s=new G(0),c=a===!0?0:1,l,u,d=null,f=0,p=null;function m(a,m){let g=!1,_=m.isScene===!0?m.background:null;_&&_.isTexture&&(_=(m.backgroundBlurriness>0?n:t).get(_)),_===null?h(s,c):_&&_.isColor&&(h(_,1),g=!0);let v=e.xr.getEnvironmentBlendMode();v===`additive`?r.buffers.color.setClear(0,0,0,1,o):v===`alpha-blend`&&r.buffers.color.setClear(0,0,0,0,o),(e.autoClear||g)&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),_&&(_.isCubeTexture||_.mapping===306)?(u===void 0&&(u=new K(new cr(1,1,1),new gr({name:`BackgroundCubeMaterial`,uniforms:lr(Pr.backgroundCube.uniforms),vertexShader:Pr.backgroundCube.vertexShader,fragmentShader:Pr.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute(`normal`),u.geometry.deleteAttribute(`uv`),u.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),u.material.uniforms.envMap.value=_,u.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=m.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,u.material.toneMapped=H.getTransfer(_.colorSpace)!==ae,(d!==_||f!==_.version||p!==e.toneMapping)&&(u.material.needsUpdate=!0,d=_,f=_.version,p=e.toneMapping),u.layers.enableAll(),a.unshift(u,u.geometry,u.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new K(new Nr(2,2),new gr({name:`BackgroundMaterial`,uniforms:lr(Pr.background.uniforms),vertexShader:Pr.background.vertexShader,fragmentShader:Pr.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute(`normal`),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,l.material.toneMapped=H.getTransfer(_.colorSpace)!==ae,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||f!==_.version||p!==e.toneMapping)&&(l.material.needsUpdate=!0,d=_,f=_.version,p=e.toneMapping),l.layers.enableAll(),a.unshift(l,l.geometry,l.material,0,0,null))}function h(t,n){t.getRGB(Fr,fr(e)),r.buffers.color.setClear(Fr.r,Fr.g,Fr.b,n,o)}return{getClearColor:function(){return s},setClearColor:function(e,t=1){s.set(e),c=t,h(s,c)},getClearAlpha:function(){return c},setClearAlpha:function(e){c=e,h(s,c)},render:m}}function Lr(e,t,n,r){let i=e.getParameter(e.MAX_VERTEX_ATTRIBS),a=r.isWebGL2?null:t.get(`OES_vertex_array_object`),o=r.isWebGL2||a!==null,s={},c=g(null),l=c,u=!1;function d(t,r,i,a,s){let c=!1;if(o){let e=h(a,i,r);l!==e&&(l=e,p(l.object)),c=_(t,a,i,s),c&&v(t,a,i,s)}else{let e=r.wireframe===!0;(l.geometry!==a.id||l.program!==i.id||l.wireframe!==e)&&(l.geometry=a.id,l.program=i.id,l.wireframe=e,c=!0)}s!==null&&n.update(s,e.ELEMENT_ARRAY_BUFFER),(c||u)&&(u=!1,w(t,r,i,a),s!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.get(s).buffer))}function f(){return r.isWebGL2?e.createVertexArray():a.createVertexArrayOES()}function p(t){return r.isWebGL2?e.bindVertexArray(t):a.bindVertexArrayOES(t)}function m(t){return r.isWebGL2?e.deleteVertexArray(t):a.deleteVertexArrayOES(t)}function h(e,t,n){let r=n.wireframe===!0,i=s[e.id];i===void 0&&(i={},s[e.id]=i);let a=i[t.id];a===void 0&&(a={},i[t.id]=a);let o=a[r];return o===void 0&&(o=g(f()),a[r]=o),o}function g(e){let t=[],n=[],r=[];for(let e=0;e<i;e++)t[e]=0,n[e]=0,r[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:n,attributeDivisors:r,object:e,attributes:{},index:null}}function _(e,t,n,r){let i=l.attributes,a=t.attributes,o=0,s=n.getAttributes();for(let t in s)if(s[t].location>=0){let n=i[t],r=a[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;o++}return l.attributesNum!==o||l.index!==r}function v(e,t,n,r){let i={},a=t.attributes,o=0,s=n.getAttributes();for(let t in s)if(s[t].location>=0){let n=a[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,o++}l.attributes=i,l.attributesNum=o,l.index=r}function y(){let e=l.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function b(e){x(e,0)}function x(n,i){let a=l.newAttributes,o=l.enabledAttributes,s=l.attributeDivisors;a[n]=1,o[n]===0&&(e.enableVertexAttribArray(n),o[n]=1),s[n]!==i&&((r.isWebGL2?e:t.get(`ANGLE_instanced_arrays`))[r.isWebGL2?`vertexAttribDivisor`:`vertexAttribDivisorANGLE`](n,i),s[n]=i)}function S(){let t=l.newAttributes,n=l.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function C(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function w(i,a,o,s){if(r.isWebGL2===!1&&(i.isInstancedMesh||s.isInstancedBufferGeometry)&&t.get(`ANGLE_instanced_arrays`)===null)return;y();let c=s.attributes,l=o.getAttributes(),u=a.defaultAttributeValues;for(let t in l){let a=l[t];if(a.location>=0){let o=c[t];if(o===void 0&&(t===`instanceMatrix`&&i.instanceMatrix&&(o=i.instanceMatrix),t===`instanceColor`&&i.instanceColor&&(o=i.instanceColor)),o!==void 0){let t=o.normalized,c=o.itemSize,l=n.get(o);if(l===void 0)continue;let u=l.buffer,d=l.type,f=l.bytesPerElement,p=r.isWebGL2===!0&&(d===e.INT||d===e.UNSIGNED_INT||o.gpuType===1013);if(o.isInterleavedBufferAttribute){let n=o.data,r=n.stride,l=o.offset;if(n.isInstancedInterleavedBuffer){for(let e=0;e<a.locationSize;e++)x(a.location+e,n.meshPerAttribute);i.isInstancedMesh!==!0&&s._maxInstanceCount===void 0&&(s._maxInstanceCount=n.meshPerAttribute*n.count)}else for(let e=0;e<a.locationSize;e++)b(a.location+e);e.bindBuffer(e.ARRAY_BUFFER,u);for(let e=0;e<a.locationSize;e++)C(a.location+e,c/a.locationSize,d,t,r*f,(l+c/a.locationSize*e)*f,p)}else{if(o.isInstancedBufferAttribute){for(let e=0;e<a.locationSize;e++)x(a.location+e,o.meshPerAttribute);i.isInstancedMesh!==!0&&s._maxInstanceCount===void 0&&(s._maxInstanceCount=o.meshPerAttribute*o.count)}else for(let e=0;e<a.locationSize;e++)b(a.location+e);e.bindBuffer(e.ARRAY_BUFFER,u);for(let e=0;e<a.locationSize;e++)C(a.location+e,c/a.locationSize,d,t,c*f,c/a.locationSize*e*f,p)}}else if(u!==void 0){let n=u[t];if(n!==void 0)switch(n.length){case 2:e.vertexAttrib2fv(a.location,n);break;case 3:e.vertexAttrib3fv(a.location,n);break;case 4:e.vertexAttrib4fv(a.location,n);break;default:e.vertexAttrib1fv(a.location,n)}}}}S()}function T(){ee();for(let e in s){let t=s[e];for(let e in t){let n=t[e];for(let e in n)m(n[e].object),delete n[e];delete t[e]}delete s[e]}}function E(e){if(s[e.id]===void 0)return;let t=s[e.id];for(let e in t){let n=t[e];for(let e in n)m(n[e].object),delete n[e];delete t[e]}delete s[e.id]}function D(e){for(let t in s){let n=s[t];if(n[e.id]===void 0)continue;let r=n[e.id];for(let e in r)m(r[e].object),delete r[e];delete n[e.id]}}function ee(){O(),u=!0,l!==c&&(l=c,p(l.object))}function O(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:d,reset:ee,resetDefaultState:O,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfProgram:D,initAttributes:y,enableAttribute:b,disableUnusedAttributes:S}}function Rr(e,t,n,r){let i=r.isWebGL2,a;function o(e){a=e}function s(t,r){e.drawArrays(a,t,r),n.update(r,a,1)}function c(r,o,s){if(s===0)return;let c,l;if(i)c=e,l=`drawArraysInstanced`;else if(c=t.get(`ANGLE_instanced_arrays`),l=`drawArraysInstancedANGLE`,c===null){console.error(`THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.`);return}c[l](a,r,o,s),n.update(o,a,s)}function l(e,r,i){if(i===0)return;let o=t.get(`WEBGL_multi_draw`);if(o===null)for(let t=0;t<i;t++)this.render(e[t],r[t]);else{o.multiDrawArraysWEBGL(a,e,0,r,0,i);let t=0;for(let e=0;e<i;e++)t+=r[e];n.update(t,a,1)}}this.setMode=o,this.render=s,this.renderInstances=c,this.renderMultiDraw=l}function zr(e,t,n){let r;function i(){if(r!==void 0)return r;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);r=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let o=typeof WebGL2RenderingContext<`u`&&e.constructor.name===`WebGL2RenderingContext`,s=n.precision===void 0?`highp`:n.precision,c=a(s);c!==s&&(console.warn(`THREE.WebGLRenderer:`,s,`not supported, using`,c,`instead.`),s=c);let l=o||t.has(`WEBGL_draw_buffers`),u=n.logarithmicDepthBuffer===!0,d=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),f=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=e.getParameter(e.MAX_TEXTURE_SIZE),m=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),h=e.getParameter(e.MAX_VERTEX_ATTRIBS),g=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),_=e.getParameter(e.MAX_VARYING_VECTORS),v=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),y=f>0,b=o||t.has(`OES_texture_float`),x=y&&b,S=o?e.getParameter(e.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:i,getMaxPrecision:a,precision:s,logarithmicDepthBuffer:u,maxTextures:d,maxVertexTextures:f,maxTextureSize:p,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:g,maxVaryings:_,maxFragmentUniforms:v,vertexTextures:y,floatFragmentTextures:b,floatVertexTextures:x,maxSamples:S}}function Br(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Dr,s=new V,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}function Vr(e){let t=new WeakMap;function n(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function r(r){if(r&&r.isTexture){let a=r.mapping;if(a===303||a===304)if(t.has(r)){let e=t.get(r).texture;return n(e,r.mapping)}else{let a=r.image;if(a&&a.height>0){let o=new Cr(a.height/2);return o.fromEquirectangularTexture(e,r),t.set(r,o),r.addEventListener(`dispose`,i),n(o.texture,r.mapping)}else return null}}return r}function i(e){let n=e.target;n.removeEventListener(`dispose`,i);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function a(){t=new WeakMap}return{get:r,dispose:a}}var Hr=class extends _r{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ur=4,Wr=[.125,.215,.35,.446,.526,.582],Gr=20,Kr=new Hr,qr=new G,Jr=null,Yr=0,Xr=0,Zr=(1+Math.sqrt(5))/2,Qr=1/Zr,$r=[new U(1,1,1),new U(-1,1,1),new U(1,1,-1),new U(-1,1,-1),new U(0,Zr,Qr),new U(0,Zr,-Qr),new U(Qr,0,Zr),new U(-Qr,0,Zr),new U(Zr,Qr,0),new U(-Zr,Qr,0)],ei=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){Jr=this._renderer.getRenderTarget(),Yr=this._renderer.getActiveCubeFace(),Xr=this._renderer.getActiveMipmapLevel(),this._setSize(256);let i=this._allocateTargets();return i.depthBuffer=!0,this._sceneToCubeUV(e,n,r,i),t>0&&this._blur(i,0,0,t),this._applyPMREM(i),this._cleanup(i),i}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=oi(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ai(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Jr,Yr,Xr),e.scissorTest=!1,ri(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Jr=this._renderer.getRenderTarget(),Yr=this._renderer.getActiveCubeFace(),Xr=this._renderer.getActiveMipmapLevel();let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:u,minFilter:u,generateMipmaps:!1,type:g,format:v,colorSpace:j,depthBuffer:!1},r=ni(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ni(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ti(r)),this._blurMaterial=ii(r,e,t)}return r}_compileMaterial(e){let t=new K(this._lodPlanes[0],e);this._renderer.compile(t,Kr)}_sceneToCubeUV(e,t,n,r){let i=new vr(90,1,t,n),a=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],s=this._renderer,c=s.autoClear,l=s.toneMapping;s.getClearColor(qr),s.toneMapping=0,s.autoClear=!1;let u=new Cn({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1}),d=new K(new cr,u),f=!1,p=e.background;p?p.isColor&&(u.color.copy(p),e.background=null,f=!0):(u.color.copy(qr),f=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(i.up.set(0,a[t],0),i.lookAt(o[t],0,0)):n===1?(i.up.set(0,0,a[t]),i.lookAt(0,o[t],0)):(i.up.set(0,a[t],0),i.lookAt(0,0,o[t]));let c=this._cubeSize;ri(r,n*c,t>2?c:0,c,c),s.setRenderTarget(r),f&&s.render(d,i),s.render(e,i)}d.geometry.dispose(),d.material.dispose(),s.toneMapping=l,s.autoClear=c,e.background=p}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=oi()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ai());let i=r?this._cubemapMaterial:this._equirectMaterial,a=new K(this._lodPlanes[0],i),o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;ri(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Kr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let t=1;t<this._lodPlanes.length;t++){let n=Math.sqrt(this._sigmas[t]*this._sigmas[t]-this._sigmas[t-1]*this._sigmas[t-1]),r=$r[(t-1)%$r.length];this._blur(e,t-1,t,n,r)}t.autoClear=n}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&console.error(`blur direction must be either latitudinal or longitudinal!`);let l=new K(this._lodPlanes[r],c),u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/(2*Gr-1),p=i/f,m=isFinite(i)?1+Math.floor(3*p):Gr;m>Gr&&console.warn(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Gr}`);let h=[],g=0;for(let e=0;e<Gr;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];ri(t,3*v*(r>_-Ur?r-_+Ur:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,Kr)}};function ti(e){let t=[],n=[],r=[],i=e,a=e-Ur+1+Wr.length;for(let o=0;o<a;o++){let a=2**i;n.push(a);let s=1/a;o>e-Ur?s=Wr[o-e+Ur-1]:o===0&&(s=0),r.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new Hn;h.setAttribute(`position`,new jn(f,3)),h.setAttribute(`uv`,new jn(p,2)),h.setAttribute(`faceIndex`,new jn(m,1)),t.push(h),i>Ur&&i--}return{lodPlanes:t,sizeLods:n,sigmas:r}}function ni(e,t,n){let r=new $e(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function ri(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function ii(e,t,n){let r=new Float32Array(Gr),i=new U(0,1,0);return new gr({name:`SphericalGaussianBlur`,defines:{n:Gr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:si(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ai(){return new gr({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:si(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function oi(){return new gr({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:si(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function si(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ci(e){let t=new WeakMap,n=null;function r(r){if(r&&r.isTexture){let o=r.mapping,s=o===303||o===304,c=o===301||o===302;if(s||c)if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let i=t.get(r);return n===null&&(n=new ei(e)),i=s?n.fromEquirectangular(r,i):n.fromCubemap(r,i),t.set(r,i),i.texture}else if(t.has(r))return t.get(r).texture;else{let o=r.image;if(s&&o&&o.height>0||c&&o&&i(o)){n===null&&(n=new ei(e));let i=s?n.fromEquirectangular(r):n.fromCubemap(r);return t.set(r,i),r.addEventListener(`dispose`,a),i.texture}else return null}}return r}function i(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function a(e){let n=e.target;n.removeEventListener(`dispose`,a);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function o(){t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:o}}function li(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r;switch(n){case`WEBGL_depth_texture`:r=e.getExtension(`WEBGL_depth_texture`)||e.getExtension(`MOZ_WEBGL_depth_texture`)||e.getExtension(`WEBKIT_WEBGL_depth_texture`);break;case`EXT_texture_filter_anisotropic`:r=e.getExtension(`EXT_texture_filter_anisotropic`)||e.getExtension(`MOZ_EXT_texture_filter_anisotropic`)||e.getExtension(`WEBKIT_EXT_texture_filter_anisotropic`);break;case`WEBGL_compressed_texture_s3tc`:r=e.getExtension(`WEBGL_compressed_texture_s3tc`)||e.getExtension(`MOZ_WEBGL_compressed_texture_s3tc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_s3tc`);break;case`WEBGL_compressed_texture_pvrtc`:r=e.getExtension(`WEBGL_compressed_texture_pvrtc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_pvrtc`);break;default:r=e.getExtension(n)}return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(e){e.isWebGL2?(n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`)):(n(`WEBGL_depth_texture`),n(`OES_texture_float`),n(`OES_texture_half_float`),n(`OES_texture_half_float_linear`),n(`OES_standard_derivatives`),n(`OES_element_index_uint`),n(`OES_vertex_array_object`),n(`ANGLE_instanced_arrays`)),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`)},get:function(e){let t=n(e);return t===null&&console.warn(`THREE.WebGLRenderer: `+e+` extension not supported.`),t}}}function ui(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);for(let e in s.morphAttributes){let n=s.morphAttributes[e];for(let e=0,r=n.length;e<r;e++)t.remove(n[e])}s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER);let i=n.morphAttributes;for(let n in i){let r=i[n];for(let n=0,i=r.length;n<i;n++)t.update(r[n],e.ARRAY_BUFFER)}}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else if(i!==void 0){let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}else return;let s=new(Ne(n)?Nn:Mn)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function di(e,t,n,r){let i=r.isWebGL2,a;function o(e){a=e}let s,c;function l(e){s=e.type,c=e.bytesPerElement}function u(t,r){e.drawElements(a,r,s,t*c),n.update(r,a,1)}function d(r,o,l){if(l===0)return;let u,d;if(i)u=e,d=`drawElementsInstanced`;else if(u=t.get(`ANGLE_instanced_arrays`),d=`drawElementsInstancedANGLE`,u===null){console.error(`THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.`);return}u[d](a,o,s,r*c,l),n.update(o,a,l)}function f(e,r,i){if(i===0)return;let o=t.get(`WEBGL_multi_draw`);if(o===null)for(let t=0;t<i;t++)this.render(e[t]/c,r[t]);else{o.multiDrawElementsWEBGL(a,r,0,s,e,0,i);let t=0;for(let e=0;e<i;e++)t+=r[e];n.update(t,a,1)}}this.setMode=o,this.setIndex=l,this.render=u,this.renderInstances=d,this.renderMultiDraw=f}function fi(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:console.error(`THREE.WebGLInfo: Unknown draw mode:`,r);break}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function pi(e,t){return e[0]-t[0]}function mi(e,t){return Math.abs(t[1])-Math.abs(e[1])}function hi(e,t,n){let r={},i=new Float32Array(8),a=new WeakMap,o=new Ze,s=[];for(let e=0;e<8;e++)s[e]=[e,0];function c(c,l,u){let d=c.morphTargetInfluences;if(t.isWebGL2===!0){let r=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,i=r===void 0?0:r.length,s=a.get(l);if(s===void 0||s.count!==i){s!==void 0&&s.texture.dispose();let e=l.morphAttributes.position!==void 0,n=l.morphAttributes.normal!==void 0,r=l.morphAttributes.color!==void 0,c=l.morphAttributes.position||[],u=l.morphAttributes.normal||[],d=l.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),r===!0&&(f=3);let p=l.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let g=new Float32Array(p*m*4*i),_=new et(g,p,m,i);_.type=h,_.needsUpdate=!0;let v=f*4;for(let t=0;t<i;t++){let i=c[t],a=u[t],s=d[t],l=p*m*4*t;for(let t=0;t<i.count;t++){let c=t*v;e===!0&&(o.fromBufferAttribute(i,t),g[l+c+0]=o.x,g[l+c+1]=o.y,g[l+c+2]=o.z,g[l+c+3]=0),n===!0&&(o.fromBufferAttribute(a,t),g[l+c+4]=o.x,g[l+c+5]=o.y,g[l+c+6]=o.z,g[l+c+7]=0),r===!0&&(o.fromBufferAttribute(s,t),g[l+c+8]=o.x,g[l+c+9]=o.y,g[l+c+10]=o.z,g[l+c+11]=s.itemSize===4?o.w:1)}}s={count:i,texture:_,size:new B(p,m)},a.set(l,s);function y(){_.dispose(),a.delete(l),l.removeEventListener(`dispose`,y)}l.addEventListener(`dispose`,y)}let c=0;for(let e=0;e<d.length;e++)c+=d[e];let f=l.morphTargetsRelative?1:1-c;u.getUniforms().setValue(e,`morphTargetBaseInfluence`,f),u.getUniforms().setValue(e,`morphTargetInfluences`,d),u.getUniforms().setValue(e,`morphTargetsTexture`,s.texture,n),u.getUniforms().setValue(e,`morphTargetsTextureSize`,s.size)}else{let t=d===void 0?0:d.length,n=r[l.id];if(n===void 0||n.length!==t){n=[];for(let e=0;e<t;e++)n[e]=[e,0];r[l.id]=n}for(let e=0;e<t;e++){let t=n[e];t[0]=e,t[1]=d[e]}n.sort(mi);for(let e=0;e<8;e++)e<t&&n[e][1]?(s[e][0]=n[e][0],s[e][1]=n[e][1]):(s[e][0]=2**53-1,s[e][1]=0);s.sort(pi);let a=l.morphAttributes.position,o=l.morphAttributes.normal,c=0;for(let e=0;e<8;e++){let t=s[e],n=t[0],r=t[1];n!==2**53-1&&r?(a&&l.getAttribute(`morphTarget`+e)!==a[n]&&l.setAttribute(`morphTarget`+e,a[n]),o&&l.getAttribute(`morphNormal`+e)!==o[n]&&l.setAttribute(`morphNormal`+e,o[n]),i[e]=r,c+=r):(a&&l.hasAttribute(`morphTarget`+e)===!0&&l.deleteAttribute(`morphTarget`+e),o&&l.hasAttribute(`morphNormal`+e)===!0&&l.deleteAttribute(`morphNormal`+e),i[e]=0)}let f=l.morphTargetsRelative?1:1-c;u.getUniforms().setValue(e,`morphTargetBaseInfluence`,f),u.getUniforms().setValue(e,`morphTargetInfluences`,i)}}return{update:c}}function gi(e,t,n,r){let i=new WeakMap;function a(a){let o=r.render.frame,c=a.geometry,l=t.get(a,c);if(i.get(l)!==o&&(t.update(l),i.set(l,o)),a.isInstancedMesh&&(a.hasEventListener(`dispose`,s)===!1&&a.addEventListener(`dispose`,s),i.get(a)!==o&&(n.update(a.instanceMatrix,e.ARRAY_BUFFER),a.instanceColor!==null&&n.update(a.instanceColor,e.ARRAY_BUFFER),i.set(a,o))),a.isSkinnedMesh){let e=a.skeleton;i.get(e)!==o&&(e.update(),i.set(e,o))}return l}function o(){i=new WeakMap}function s(e){let t=e.target;t.removeEventListener(`dispose`,s),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:a,dispose:o}}var _i=class extends Xe{constructor(e,t,n,r,i,a,o,c,l,u){if(u=u===void 0?y:u,u!==1026&&u!==1027)throw Error(`DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);n===void 0&&u===1026&&(n=m),n===void 0&&u===1027&&(n=_),super(null,r,i,a,o,c,u,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o===void 0?s:o,this.minFilter=c===void 0?s:c,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},vi=new Xe,yi=new _i(1,1);yi.compareFunction=515;var bi=new et,xi=new tt,Si=new Sr,Ci=[],wi=[],Ti=new Float32Array(16),Ei=new Float32Array(9),Di=new Float32Array(4);function Oi(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Ci[i];if(a===void 0&&(a=new Float32Array(i),Ci[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function ki(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Ai(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function ji(e,t){let n=wi[t];n===void 0&&(n=new Int32Array(t),wi[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Mi(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Ni(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(ki(n,t))return;e.uniform2fv(this.addr,t),Ai(n,t)}}function Pi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(ki(n,t))return;e.uniform3fv(this.addr,t),Ai(n,t)}}function Fi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(ki(n,t))return;e.uniform4fv(this.addr,t),Ai(n,t)}}function Ii(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(ki(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Ai(n,t)}else{if(ki(n,r))return;Di.set(r),e.uniformMatrix2fv(this.addr,!1,Di),Ai(n,r)}}function Li(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(ki(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Ai(n,t)}else{if(ki(n,r))return;Ei.set(r),e.uniformMatrix3fv(this.addr,!1,Ei),Ai(n,r)}}function Ri(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(ki(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Ai(n,t)}else{if(ki(n,r))return;Ti.set(r),e.uniformMatrix4fv(this.addr,!1,Ti),Ai(n,r)}}function zi(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Bi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(ki(n,t))return;e.uniform2iv(this.addr,t),Ai(n,t)}}function Vi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(ki(n,t))return;e.uniform3iv(this.addr,t),Ai(n,t)}}function Hi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(ki(n,t))return;e.uniform4iv(this.addr,t),Ai(n,t)}}function Ui(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Wi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(ki(n,t))return;e.uniform2uiv(this.addr,t),Ai(n,t)}}function Gi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(ki(n,t))return;e.uniform3uiv(this.addr,t),Ai(n,t)}}function Ki(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(ki(n,t))return;e.uniform4uiv(this.addr,t),Ai(n,t)}}function qi(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a=this.type===e.SAMPLER_2D_SHADOW?yi:vi;n.setTexture2D(t||a,i)}function Ji(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||xi,i)}function Yi(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Si,i)}function Xi(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||bi,i)}function Zi(e){switch(e){case 5126:return Mi;case 35664:return Ni;case 35665:return Pi;case 35666:return Fi;case 35674:return Ii;case 35675:return Li;case 35676:return Ri;case 5124:case 35670:return zi;case 35667:case 35671:return Bi;case 35668:case 35672:return Vi;case 35669:case 35673:return Hi;case 5125:return Ui;case 36294:return Wi;case 36295:return Gi;case 36296:return Ki;case 35678:case 36198:case 36298:case 36306:case 35682:return qi;case 35679:case 36299:case 36307:return Ji;case 35680:case 36300:case 36308:case 36293:return Yi;case 36289:case 36303:case 36311:case 36292:return Xi}}function Qi(e,t){e.uniform1fv(this.addr,t)}function $i(e,t){let n=Oi(t,this.size,2);e.uniform2fv(this.addr,n)}function ea(e,t){let n=Oi(t,this.size,3);e.uniform3fv(this.addr,n)}function ta(e,t){let n=Oi(t,this.size,4);e.uniform4fv(this.addr,n)}function na(e,t){let n=Oi(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function ra(e,t){let n=Oi(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function ia(e,t){let n=Oi(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function aa(e,t){e.uniform1iv(this.addr,t)}function oa(e,t){e.uniform2iv(this.addr,t)}function sa(e,t){e.uniform3iv(this.addr,t)}function ca(e,t){e.uniform4iv(this.addr,t)}function la(e,t){e.uniform1uiv(this.addr,t)}function ua(e,t){e.uniform2uiv(this.addr,t)}function da(e,t){e.uniform3uiv(this.addr,t)}function fa(e,t){e.uniform4uiv(this.addr,t)}function pa(e,t,n){let r=this.cache,i=t.length,a=ji(n,i);ki(r,a)||(e.uniform1iv(this.addr,a),Ai(r,a));for(let e=0;e!==i;++e)n.setTexture2D(t[e]||vi,a[e])}function ma(e,t,n){let r=this.cache,i=t.length,a=ji(n,i);ki(r,a)||(e.uniform1iv(this.addr,a),Ai(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||xi,a[e])}function ha(e,t,n){let r=this.cache,i=t.length,a=ji(n,i);ki(r,a)||(e.uniform1iv(this.addr,a),Ai(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Si,a[e])}function ga(e,t,n){let r=this.cache,i=t.length,a=ji(n,i);ki(r,a)||(e.uniform1iv(this.addr,a),Ai(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||bi,a[e])}function _a(e){switch(e){case 5126:return Qi;case 35664:return $i;case 35665:return ea;case 35666:return ta;case 35674:return na;case 35675:return ra;case 35676:return ia;case 5124:case 35670:return aa;case 35667:case 35671:return oa;case 35668:case 35672:return sa;case 35669:case 35673:return ca;case 5125:return la;case 36294:return ua;case 36295:return da;case 36296:return fa;case 35678:case 36198:case 36298:case 36306:case 35682:return pa;case 35679:case 36299:case 36307:return ma;case 35680:case 36300:case 36308:case 36293:return ha;case 36289:case 36303:case 36311:case 36292:return ga}}var va=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Zi(t.type)}},ya=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=_a(t.type)}},ba=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},xa=/(\w+)(\])?(\[|\.)?/g;function Sa(e,t){e.seq.push(t),e.map[t.id]=t}function Ca(e,t,n){let r=e.name,i=r.length;for(xa.lastIndex=0;;){let a=xa.exec(r),o=xa.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Sa(n,l===void 0?new va(s,e,t):new ya(s,e,t));break}else{let e=n.map[s];e===void 0&&(e=new ba(s),Sa(n,e)),n=e}}}var wa=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Ca(n,e.getUniformLocation(t,n.name),this)}}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Ta(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Ea=37297,Da=0;function Oa(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}function ka(e){let t=H.getPrimaries(H.workingColorSpace),n=H.getPrimaries(e),r;switch(t===n?r=``:t===`p3`&&n===`rec709`?r=`LinearDisplayP3ToLinearSRGB`:t===`rec709`&&n===`p3`&&(r=`LinearSRGBToLinearDisplayP3`),e){case j:case re:return[r,`LinearTransferOETF`];case A:case ne:return[r,`sRGBTransferOETF`];default:return console.warn(`THREE.WebGLProgram: Unsupported color space:`,e),[r,`LinearTransferOETF`]}}function Aa(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=e.getShaderInfoLog(t).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Oa(e.getShaderSource(t),r)}else return i}function ja(e,t){let n=ka(t);return`vec4 ${e}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function Ma(e,t){let n;switch(t){case 1:n=`Linear`;break;case 2:n=`Reinhard`;break;case 3:n=`OptimizedCineon`;break;case 4:n=`ACESFilmic`;break;case 6:n=`AgX`;break;case 5:n=`Custom`;break;default:console.warn(`THREE.WebGLProgram: Unsupported toneMapping:`,t),n=`Linear`}return`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}function Na(e){return[e.extensionDerivatives||e.envMapCubeUVHeight||e.bumpMap||e.normalMapTangentSpace||e.clearcoatNormalMap||e.flatShading||e.shaderID===`physical`?`#extension GL_OES_standard_derivatives : enable`:``,(e.extensionFragDepth||e.logarithmicDepthBuffer)&&e.rendererExtensionFragDepth?`#extension GL_EXT_frag_depth : enable`:``,e.extensionDrawBuffers&&e.rendererExtensionDrawBuffers?`#extension GL_EXT_draw_buffers : require`:``,(e.extensionShaderTextureLOD||e.envMap||e.transmission)&&e.rendererExtensionShaderTextureLod?`#extension GL_EXT_shader_texture_lod : enable`:``].filter(La).join(`
`)}function Pa(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``].filter(La).join(`
`)}function Fa(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Ia(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function La(e){return e!==``}function Ra(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function za(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Ba=/^[ \t]*#include +<([\w\d./]+)>/gm;function Va(e){return e.replace(Ba,Ua)}var Ha=new Map([[`encodings_fragment`,`colorspace_fragment`],[`encodings_pars_fragment`,`colorspace_pars_fragment`],[`output_fragment`,`opaque_fragment`]]);function Ua(e,t){let n=q[t];if(n===void 0){let e=Ha.get(t);if(e!==void 0)n=q[e],console.warn(`THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`Can not resolve #include <`+t+`>`)}return Va(n)}var Wa=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ga(e){return e.replace(Wa,Ka)}function Ka(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function qa(e){let t=`precision `+e.precision+` float;
precision `+e.precision+` int;`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}function Ja(e){let t=`SHADOWMAP_TYPE_BASIC`;return e.shadowMapType===1?t=`SHADOWMAP_TYPE_PCF`:e.shadowMapType===2?t=`SHADOWMAP_TYPE_PCF_SOFT`:e.shadowMapType===3&&(t=`SHADOWMAP_TYPE_VSM`),t}function Ya(e){let t=`ENVMAP_TYPE_CUBE`;if(e.envMap)switch(e.envMapMode){case 301:case 302:t=`ENVMAP_TYPE_CUBE`;break;case 306:t=`ENVMAP_TYPE_CUBE_UV`;break}return t}function Xa(e){let t=`ENVMAP_MODE_REFLECTION`;if(e.envMap)switch(e.envMapMode){case 302:t=`ENVMAP_MODE_REFRACTION`;break}return t}function Za(e){let t=`ENVMAP_BLENDING_NONE`;if(e.envMap)switch(e.combine){case 0:t=`ENVMAP_BLENDING_MULTIPLY`;break;case 1:t=`ENVMAP_BLENDING_MIX`;break;case 2:t=`ENVMAP_BLENDING_ADD`;break}return t}function Qa(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function $a(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Ja(n),l=Ya(n),u=Xa(n),d=Za(n),f=Qa(n),p=n.isWebGL2?``:Na(n),m=Pa(n),h=Fa(a),g=i.createProgram(),_,v,y=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,h].filter(La).join(`
`),_.length>0&&(_+=`
`),v=[p,`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,h].filter(La).join(`
`),v.length>0&&(v+=`
`)):(_=[qa(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,h,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors&&n.isWebGL2?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0&&n.isWebGL2?`#define MORPHTARGETS_TEXTURE`:``,n.morphTargetsCount>0&&n.isWebGL2?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0&&n.isWebGL2?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.useLegacyLights?`#define LEGACY_LIGHTS`:``,n.logarithmicDepthBuffer?`#define USE_LOGDEPTHBUF`:``,n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?`#define USE_LOGDEPTHBUF_EXT`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )`,`	attribute vec3 morphTarget0;`,`	attribute vec3 morphTarget1;`,`	attribute vec3 morphTarget2;`,`	attribute vec3 morphTarget3;`,`	#ifdef USE_MORPHNORMALS`,`		attribute vec3 morphNormal0;`,`		attribute vec3 morphNormal1;`,`		attribute vec3 morphNormal2;`,`		attribute vec3 morphNormal3;`,`	#else`,`		attribute vec3 morphTarget4;`,`		attribute vec3 morphTarget5;`,`		attribute vec3 morphTarget6;`,`		attribute vec3 morphTarget7;`,`	#endif`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(La).join(`
`),v=[p,qa(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,h,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.useLegacyLights?`#define LEGACY_LIGHTS`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.logarithmicDepthBuffer?`#define USE_LOGDEPTHBUF`:``,n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?`#define USE_LOGDEPTHBUF_EXT`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:q.tonemapping_pars_fragment,n.toneMapping===0?``:Ma(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,q.colorspace_pars_fragment,ja(`linearToOutputTexel`,n.outputColorSpace),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(La).join(`
`)),o=Va(o),o=Ra(o,n),o=za(o,n),s=Va(s),s=Ra(s,n),s=za(s,n),o=Ga(o),s=Ga(s),n.isWebGL2&&n.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,_=[m,`precision mediump sampler2DArray;`,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+_,v=[`precision mediump sampler2DArray;`,`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+v);let b=y+_+o,x=y+v+s,S=Ta(i,i.VERTEX_SHADER,b),C=Ta(i,i.FRAGMENT_SHADER,x);i.attachShader(g,S),i.attachShader(g,C),n.index0AttributeName===void 0?n.morphTargets===!0&&i.bindAttribLocation(g,0,`position`):i.bindAttribLocation(g,0,n.index0AttributeName),i.linkProgram(g);function w(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(g).trim(),r=i.getShaderInfoLog(S).trim(),a=i.getShaderInfoLog(C).trim(),o=!0,s=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(o=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,g,S,C);else{let e=Aa(i,S,`vertex`),t=Aa(i,C,`fragment`);console.error(`THREE.WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Program Info Log: `+n+`
`+e+`
`+t)}else n===``?(r===``||a===``)&&(s=!1):console.warn(`THREE.WebGLProgram: Program Info Log:`,n);s&&(t.diagnostics={runnable:o,programLog:n,vertexShader:{log:r,prefix:_},fragmentShader:{log:a,prefix:v}})}i.deleteShader(S),i.deleteShader(C),T=new wa(i,g),E=Ia(i,g)}let T;this.getUniforms=function(){return T===void 0&&w(this),T};let E;this.getAttributes=function(){return E===void 0&&w(this),E};let D=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=i.getProgramParameter(g,Ea)),D},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Da++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=S,this.fragmentShader=C,this}var eo=0,to=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),i=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new no(e),t.set(e,n)),n}},no=class{constructor(e){this.id=eo++,this.code=e,this.usedTimes=0}};function ro(e,t,n,r,i,a,o){let s=new Ht,c=new to,l=[],u=i.isWebGL2,d=i.logarithmicDepthBuffer,f=i.vertexTextures,p=i.precision,m={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distanceRGBA`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function h(e){return e===0?`uv`:`uv${e}`}function g(a,s,l,g,_){let v=g.fog,y=_.geometry,b=a.isMeshStandardMaterial?g.environment:null,x=(a.isMeshStandardMaterial?n:t).get(a.envMap||b),S=x&&x.mapping===306?x.image.height:null,C=m[a.type];a.precision!==null&&(p=i.getMaxPrecision(a.precision),p!==a.precision&&console.warn(`THREE.WebGLProgram.getParameters:`,a.precision,`not supported, using`,p,`instead.`));let w=y.morphAttributes.position||y.morphAttributes.normal||y.morphAttributes.color,T=w===void 0?0:w.length,E=0;y.morphAttributes.position!==void 0&&(E=1),y.morphAttributes.normal!==void 0&&(E=2),y.morphAttributes.color!==void 0&&(E=3);let D,ee,O,k;if(C){let e=Pr[C];D=e.vertexShader,ee=e.fragmentShader}else D=a.vertexShader,ee=a.fragmentShader,c.update(a),O=c.getVertexShaderID(a),k=c.getFragmentShaderID(a);let te=e.getRenderTarget(),A=_.isInstancedMesh===!0,ne=_.isBatchedMesh===!0,re=!!a.map,ie=!!a.matcap,ae=!!x,oe=!!a.aoMap,se=!!a.lightMap,ce=!!a.bumpMap,le=!!a.normalMap,ue=!!a.displacementMap,de=!!a.emissiveMap,fe=!!a.metalnessMap,M=!!a.roughnessMap,pe=a.anisotropy>0,me=a.clearcoat>0,he=a.iridescence>0,ge=a.sheen>0,N=a.transmission>0,_e=pe&&!!a.anisotropyMap,P=me&&!!a.clearcoatMap,ve=me&&!!a.clearcoatNormalMap,F=me&&!!a.clearcoatRoughnessMap,I=he&&!!a.iridescenceMap,L=he&&!!a.iridescenceThicknessMap,ye=ge&&!!a.sheenColorMap,be=ge&&!!a.sheenRoughnessMap,R=!!a.specularMap,xe=!!a.specularColorMap,Se=!!a.specularIntensityMap,Ce=N&&!!a.transmissionMap,we=N&&!!a.thicknessMap,Te=!!a.gradientMap,Ee=!!a.alphaMap,De=a.alphaTest>0,Oe=!!a.alphaHash,ke=!!a.extensions,Ae=!!y.attributes.uv1,z=!!y.attributes.uv2,je=!!y.attributes.uv3,B=0;return a.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(B=e.toneMapping),{isWebGL2:u,shaderID:C,shaderType:a.type,shaderName:a.name,vertexShader:D,fragmentShader:ee,defines:a.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:a.isRawShaderMaterial===!0,glslVersion:a.glslVersion,precision:p,batching:ne,instancing:A,instancingColor:A&&_.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:te===null?e.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:j,map:re,matcap:ie,envMap:ae,envMapMode:ae&&x.mapping,envMapCubeUVHeight:S,aoMap:oe,lightMap:se,bumpMap:ce,normalMap:le,displacementMap:f&&ue,emissiveMap:de,normalMapObjectSpace:le&&a.normalMapType===1,normalMapTangentSpace:le&&a.normalMapType===0,metalnessMap:fe,roughnessMap:M,anisotropy:pe,anisotropyMap:_e,clearcoat:me,clearcoatMap:P,clearcoatNormalMap:ve,clearcoatRoughnessMap:F,iridescence:he,iridescenceMap:I,iridescenceThicknessMap:L,sheen:ge,sheenColorMap:ye,sheenRoughnessMap:be,specularMap:R,specularColorMap:xe,specularIntensityMap:Se,transmission:N,transmissionMap:Ce,thicknessMap:we,gradientMap:Te,opaque:a.transparent===!1&&a.blending===1,alphaMap:Ee,alphaTest:De,alphaHash:Oe,combine:a.combine,mapUv:re&&h(a.map.channel),aoMapUv:oe&&h(a.aoMap.channel),lightMapUv:se&&h(a.lightMap.channel),bumpMapUv:ce&&h(a.bumpMap.channel),normalMapUv:le&&h(a.normalMap.channel),displacementMapUv:ue&&h(a.displacementMap.channel),emissiveMapUv:de&&h(a.emissiveMap.channel),metalnessMapUv:fe&&h(a.metalnessMap.channel),roughnessMapUv:M&&h(a.roughnessMap.channel),anisotropyMapUv:_e&&h(a.anisotropyMap.channel),clearcoatMapUv:P&&h(a.clearcoatMap.channel),clearcoatNormalMapUv:ve&&h(a.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:F&&h(a.clearcoatRoughnessMap.channel),iridescenceMapUv:I&&h(a.iridescenceMap.channel),iridescenceThicknessMapUv:L&&h(a.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&h(a.sheenColorMap.channel),sheenRoughnessMapUv:be&&h(a.sheenRoughnessMap.channel),specularMapUv:R&&h(a.specularMap.channel),specularColorMapUv:xe&&h(a.specularColorMap.channel),specularIntensityMapUv:Se&&h(a.specularIntensityMap.channel),transmissionMapUv:Ce&&h(a.transmissionMap.channel),thicknessMapUv:we&&h(a.thicknessMap.channel),alphaMapUv:Ee&&h(a.alphaMap.channel),vertexTangents:!!y.attributes.tangent&&(le||pe),vertexColors:a.vertexColors,vertexAlphas:a.vertexColors===!0&&!!y.attributes.color&&y.attributes.color.itemSize===4,vertexUv1s:Ae,vertexUv2s:z,vertexUv3s:je,pointsUvs:_.isPoints===!0&&!!y.attributes.uv&&(re||Ee),fog:!!v,useFog:a.fog===!0,fogExp2:v&&v.isFogExp2,flatShading:a.flatShading===!0,sizeAttenuation:a.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:_.isSkinnedMesh===!0,morphTargets:y.morphAttributes.position!==void 0,morphNormals:y.morphAttributes.normal!==void 0,morphColors:y.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:s.directional.length,numPointLights:s.point.length,numSpotLights:s.spot.length,numSpotLightMaps:s.spotLightMap.length,numRectAreaLights:s.rectArea.length,numHemiLights:s.hemi.length,numDirLightShadows:s.directionalShadowMap.length,numPointLightShadows:s.pointShadowMap.length,numSpotLightShadows:s.spotShadowMap.length,numSpotLightShadowsWithMaps:s.numSpotLightShadowsWithMaps,numLightProbes:s.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:a.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:B,useLegacyLights:e._useLegacyLights,decodeVideoTexture:re&&a.map.isVideoTexture===!0&&H.getTransfer(a.map.colorSpace)===`srgb`,premultipliedAlpha:a.premultipliedAlpha,doubleSided:a.side===2,flipSided:a.side===1,useDepthPacking:a.depthPacking>=0,depthPacking:a.depthPacking||0,index0AttributeName:a.index0AttributeName,extensionDerivatives:ke&&a.extensions.derivatives===!0,extensionFragDepth:ke&&a.extensions.fragDepth===!0,extensionDrawBuffers:ke&&a.extensions.drawBuffers===!0,extensionShaderTextureLOD:ke&&a.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ke&&a.extensions.clipCullDistance&&r.has(`WEBGL_clip_cull_distance`),rendererExtensionFragDepth:u||r.has(`EXT_frag_depth`),rendererExtensionDrawBuffers:u||r.has(`WEBGL_draw_buffers`),rendererExtensionShaderTextureLod:u||r.has(`EXT_shader_texture_lod`),rendererExtensionParallelShaderCompile:r.has(`KHR_parallel_shader_compile`),customProgramCacheKey:a.customProgramCacheKey()}}function _(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(v(n,t),y(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function v(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function y(e,t){s.disableAll(),t.isWebGL2&&s.enable(0),t.supportsVertexTextures&&s.enable(1),t.instancing&&s.enable(2),t.instancingColor&&s.enable(3),t.matcap&&s.enable(4),t.envMap&&s.enable(5),t.normalMapObjectSpace&&s.enable(6),t.normalMapTangentSpace&&s.enable(7),t.clearcoat&&s.enable(8),t.iridescence&&s.enable(9),t.alphaTest&&s.enable(10),t.vertexColors&&s.enable(11),t.vertexAlphas&&s.enable(12),t.vertexUv1s&&s.enable(13),t.vertexUv2s&&s.enable(14),t.vertexUv3s&&s.enable(15),t.vertexTangents&&s.enable(16),t.anisotropy&&s.enable(17),t.alphaHash&&s.enable(18),t.batching&&s.enable(19),e.push(s.mask),s.disableAll(),t.fog&&s.enable(0),t.useFog&&s.enable(1),t.flatShading&&s.enable(2),t.logarithmicDepthBuffer&&s.enable(3),t.skinning&&s.enable(4),t.morphTargets&&s.enable(5),t.morphNormals&&s.enable(6),t.morphColors&&s.enable(7),t.premultipliedAlpha&&s.enable(8),t.shadowMapEnabled&&s.enable(9),t.useLegacyLights&&s.enable(10),t.doubleSided&&s.enable(11),t.flipSided&&s.enable(12),t.useDepthPacking&&s.enable(13),t.dithering&&s.enable(14),t.transmission&&s.enable(15),t.sheen&&s.enable(16),t.opaque&&s.enable(17),t.pointsUvs&&s.enable(18),t.decodeVideoTexture&&s.enable(19),e.push(s.mask)}function b(e){let t=m[e.type],n;if(t){let e=Pr[t];n=pr.clone(e.uniforms)}else n=e.uniforms;return n}function x(t,n){let r;for(let e=0,t=l.length;e<t;e++){let t=l[e];if(t.cacheKey===n){r=t,++r.usedTimes;break}}return r===void 0&&(r=new $a(e,n,t,a),l.push(r)),r}function S(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),e.destroy()}}function C(e){c.remove(e)}function w(){c.dispose()}return{getParameters:g,getProgramCacheKey:_,getUniforms:b,acquireProgram:x,releaseProgram:S,releaseShaderCache:C,programs:l,dispose:w}}function io(){let e=new WeakMap;function t(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function n(t){e.delete(t)}function r(t,n,r){e.get(t)[n]=r}function i(){e=new WeakMap}return{get:t,remove:n,update:r,dispose:i}}function ao(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.z===t.z?e.id-t.id:e.z-t.z:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function oo(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function so(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(n,r,i,a,o,s){let c=e[t];return c===void 0?(c={id:n.id,object:n,geometry:r,material:i,groupOrder:a,renderOrder:n.renderOrder,z:o,group:s},e[t]=c):(c.id=n.id,c.object=n,c.geometry=r,c.material=i,c.groupOrder=a,c.renderOrder=n.renderOrder,c.z=o,c.group=s),t++,c}function s(e,t,a,s,c,l){let u=o(e,t,a,s,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function c(e,t,a,s,c,l){let u=o(e,t,a,s,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function l(e,t){n.length>1&&n.sort(e||ao),r.length>1&&r.sort(t||oo),i.length>1&&i.sort(t||oo)}function u(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:s,unshift:c,finish:u,sort:l}}function co(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new so,e.set(t,[i])):n>=r.length?(i=new so,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function lo(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new U,color:new G};break;case`SpotLight`:n={position:new U,direction:new U,color:new G,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new U,color:new G,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new U,skyColor:new G,groundColor:new G};break;case`RectAreaLight`:n={color:new G,position:new U,halfWidth:new U,halfHeight:new U};break}return e[t.id]=n,n}}}function uo(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`SpotLight`:n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`PointLight`:n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}var fo=0;function po(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function mo(e,t){let n=new lo,r=uo(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)i.probe.push(new U);let a=new U,o=new W,s=new W;function c(a,o){let s=0,c=0,l=0;for(let e=0;e<9;e++)i.probe[e].set(0,0,0);let u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0;a.sort(po);let x=o===!0?Math.PI:1;for(let e=0,t=a.length;e<t;e++){let t=a[e],o=t.color,S=t.intensity,C=t.distance,w=t.shadow&&t.shadow.map?t.shadow.map.texture:null;if(t.isAmbientLight)s+=o.r*S*x,c+=o.g*S*x,l+=o.b*S*x;else if(t.isLightProbe){for(let e=0;e<9;e++)i.probe[e].addScaledVector(t.sh.coefficients[e],S);b++}else if(t.isDirectionalLight){let e=n.get(t);if(e.color.copy(t.color).multiplyScalar(t.intensity*x),t.castShadow){let e=t.shadow,n=r.get(t);n.shadowBias=e.bias,n.shadowNormalBias=e.normalBias,n.shadowRadius=e.radius,n.shadowMapSize=e.mapSize,i.directionalShadow[u]=n,i.directionalShadowMap[u]=w,i.directionalShadowMatrix[u]=t.shadow.matrix,h++}i.directional[u]=e,u++}else if(t.isSpotLight){let e=n.get(t);e.position.setFromMatrixPosition(t.matrixWorld),e.color.copy(o).multiplyScalar(S*x),e.distance=C,e.coneCos=Math.cos(t.angle),e.penumbraCos=Math.cos(t.angle*(1-t.penumbra)),e.decay=t.decay,i.spot[f]=e;let a=t.shadow;if(t.map&&(i.spotLightMap[v]=t.map,v++,a.updateMatrices(t),t.castShadow&&y++),i.spotLightMatrix[f]=a.matrix,t.castShadow){let e=r.get(t);e.shadowBias=a.bias,e.shadowNormalBias=a.normalBias,e.shadowRadius=a.radius,e.shadowMapSize=a.mapSize,i.spotShadow[f]=e,i.spotShadowMap[f]=w,_++}f++}else if(t.isRectAreaLight){let e=n.get(t);e.color.copy(o).multiplyScalar(S),e.halfWidth.set(t.width*.5,0,0),e.halfHeight.set(0,t.height*.5,0),i.rectArea[p]=e,p++}else if(t.isPointLight){let e=n.get(t);if(e.color.copy(t.color).multiplyScalar(t.intensity*x),e.distance=t.distance,e.decay=t.decay,t.castShadow){let e=t.shadow,n=r.get(t);n.shadowBias=e.bias,n.shadowNormalBias=e.normalBias,n.shadowRadius=e.radius,n.shadowMapSize=e.mapSize,n.shadowCameraNear=e.camera.near,n.shadowCameraFar=e.camera.far,i.pointShadow[d]=n,i.pointShadowMap[d]=w,i.pointShadowMatrix[d]=t.shadow.matrix,g++}i.point[d]=e,d++}else if(t.isHemisphereLight){let e=n.get(t);e.skyColor.copy(t.color).multiplyScalar(S*x),e.groundColor.copy(t.groundColor).multiplyScalar(S*x),i.hemi[m]=e,m++}}p>0&&(t.isWebGL2?e.has(`OES_texture_float_linear`)===!0?(i.rectAreaLTC1=J.LTC_FLOAT_1,i.rectAreaLTC2=J.LTC_FLOAT_2):(i.rectAreaLTC1=J.LTC_HALF_1,i.rectAreaLTC2=J.LTC_HALF_2):e.has(`OES_texture_float_linear`)===!0?(i.rectAreaLTC1=J.LTC_FLOAT_1,i.rectAreaLTC2=J.LTC_FLOAT_2):e.has(`OES_texture_half_float_linear`)===!0?(i.rectAreaLTC1=J.LTC_HALF_1,i.rectAreaLTC2=J.LTC_HALF_2):console.error(`THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.`)),i.ambient[0]=s,i.ambient[1]=c,i.ambient[2]=l;let S=i.hash;(S.directionalLength!==u||S.pointLength!==d||S.spotLength!==f||S.rectAreaLength!==p||S.hemiLength!==m||S.numDirectionalShadows!==h||S.numPointShadows!==g||S.numSpotShadows!==_||S.numSpotMaps!==v||S.numLightProbes!==b)&&(i.directional.length=u,i.spot.length=f,i.rectArea.length=p,i.point.length=d,i.hemi.length=m,i.directionalShadow.length=h,i.directionalShadowMap.length=h,i.pointShadow.length=g,i.pointShadowMap.length=g,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=h,i.pointShadowMatrix.length=g,i.spotLightMatrix.length=_+v-y,i.spotLightMap.length=v,i.numSpotLightShadowsWithMaps=y,i.numLightProbes=b,S.directionalLength=u,S.pointLength=d,S.spotLength=f,S.rectAreaLength=p,S.hemiLength=m,S.numDirectionalShadows=h,S.numPointShadows=g,S.numSpotShadows=_,S.numSpotMaps=v,S.numLightProbes=b,i.version=fo++)}function l(e,t){let n=0,r=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=i.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),a.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(a),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=i.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),a.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(a),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=i.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s.identity(),o.copy(f.matrixWorld),o.premultiply(d),s.extractRotation(o),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(s),e.halfHeight.applyMatrix4(s),l++}else if(f.isPointLight){let e=i.point[r];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),r++}else if(f.isHemisphereLight){let e=i.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:c,setupView:l,state:i}}function ho(e,t){let n=new mo(e,t),r=[],i=[];function a(){r.length=0,i.length=0}function o(e){r.push(e)}function s(e){i.push(e)}function c(e){n.setup(r,e)}function l(e){n.setupView(r,e)}return{init:a,state:{lightsArray:r,shadowsArray:i,lights:n},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function go(e,t){let n=new WeakMap;function r(r,i=0){let a=n.get(r),o;return a===void 0?(o=new ho(e,t),n.set(r,[o])):i>=a.length?(o=new ho(e,t),a.push(o)):o=a[i],o}function i(){n=new WeakMap}return{get:r,dispose:i}}var _o=class extends Sn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=k,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},vo=class extends Sn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},yo=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bo=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function xo(e,t,n){let r=new Ar,i=new B,a=new B,o=new Ze,c=new _o({depthPacking:te}),l=new vo,u={},d=n.maxTextureSize,f={0:1,1:0,2:2},p=new gr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new B},radius:{value:4}},vertexShader:yo,fragmentShader:bo}),m=p.clone();m.defines.HORIZONTAL_PASS=1;let h=new Hn;h.setAttribute(`position`,new jn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new K(h,p),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let v=this.type;this.render=function(t,n,c){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||t.length===0)return;let l=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.state;p.setBlending(0),p.buffers.color.setClear(1,1,1,1),p.buffers.depth.setTest(!0),p.setScissorTest(!1);let m=v!==3&&this.type===3,h=v===3&&this.type!==3;for(let l=0,u=t.length;l<u;l++){let u=t[l],f=u.shadow;if(f===void 0){console.warn(`THREE.WebGLShadowMap:`,u,`has no shadow.`);continue}if(f.autoUpdate===!1&&f.needsUpdate===!1)continue;i.copy(f.mapSize);let g=f.getFrameExtents();if(i.multiply(g),a.copy(f.mapSize),(i.x>d||i.y>d)&&(i.x>d&&(a.x=Math.floor(d/g.x),i.x=a.x*g.x,f.mapSize.x=a.x),i.y>d&&(a.y=Math.floor(d/g.y),i.y=a.y*g.y,f.mapSize.y=a.y)),f.map===null||m===!0||h===!0){let e=this.type===3?{}:{minFilter:s,magFilter:s};f.map!==null&&f.map.dispose(),f.map=new $e(i.x,i.y,e),f.map.texture.name=u.name+`.shadowMap`,f.camera.updateProjectionMatrix()}e.setRenderTarget(f.map),e.clear();let _=f.getViewportCount();for(let e=0;e<_;e++){let t=f.getViewport(e);o.set(a.x*t.x,a.y*t.y,a.x*t.z,a.y*t.w),p.viewport(o),f.updateMatrices(u,e),r=f.getFrustum(),x(n,c,f.camera,u,this.type)}f.isPointLightShadow!==!0&&this.type===3&&y(f,c),f.needsUpdate=!1}v=this.type,_.needsUpdate=!1,e.setRenderTarget(l,u,f)};function y(n,r){let a=t.update(g);p.defines.VSM_SAMPLES!==n.blurSamples&&(p.defines.VSM_SAMPLES=n.blurSamples,m.defines.VSM_SAMPLES=n.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new $e(i.x,i.y)),p.uniforms.shadow_pass.value=n.map.texture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,p,g,null),m.uniforms.shadow_pass.value=n.mapPass.texture,m.uniforms.resolution.value=n.mapSize,m.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,m,g,null)}function b(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?l:c,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0){let e=a.uuid,t=n.uuid,r=u[e];r===void 0&&(r={},u[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,S)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?f[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function x(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=b(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=b(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)x(c[e],i,a,o,s)}function S(e){e.target.removeEventListener(`dispose`,S);for(let t in u){let n=u[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function So(e,t,n){let r=n.isWebGL2;function i(){let t=!1,n=new Ze,r=null,i=new Ze(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function a(){let t=!1,n=null,r=null,i=null;return{setTest:function(t){t?M(e.DEPTH_TEST):pe(e.DEPTH_TEST)},setMask:function(r){n!==r&&!t&&(e.depthMask(r),n=r)},setFunc:function(t){if(r!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}r=t}},setLocked:function(e){t=e},setClear:function(t){i!==t&&(e.clearDepth(t),i=t)},reset:function(){t=!1,n=null,r=null,i=null}}}function o(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?M(e.STENCIL_TEST):pe(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let s=new i,c=new a,l=new o,u=new WeakMap,d=new WeakMap,f={},p={},m=new WeakMap,h=[],g=null,_=!1,v=null,y=null,b=null,x=null,S=null,C=null,w=null,T=new G(0,0,0),E=0,D=!1,ee=null,O=null,k=null,te=null,A=null,j=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),ne=!1,re=0,ie=e.getParameter(e.VERSION);ie.indexOf(`WebGL`)===-1?ie.indexOf(`OpenGL ES`)!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),ne=re>=2):(re=parseFloat(/^WebGL (\d)/.exec(ie)[1]),ne=re>=1);let ae=null,oe={},se=e.getParameter(e.SCISSOR_BOX),ce=e.getParameter(e.VIEWPORT),le=new Ze().fromArray(se),ue=new Ze().fromArray(ce);function de(t,n,i,a){let o=new Uint8Array(4),s=e.createTexture();e.bindTexture(t,s),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let s=0;s<i;s++)r&&(t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY)?e.texImage3D(n,0,e.RGBA,1,1,a,0,e.RGBA,e.UNSIGNED_BYTE,o):e.texImage2D(n+s,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,o);return s}let fe={};fe[e.TEXTURE_2D]=de(e.TEXTURE_2D,e.TEXTURE_2D,1),fe[e.TEXTURE_CUBE_MAP]=de(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),r&&(fe[e.TEXTURE_2D_ARRAY]=de(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),fe[e.TEXTURE_3D]=de(e.TEXTURE_3D,e.TEXTURE_3D,1,1)),s.setClear(0,0,0,1),c.setClear(1),l.setClear(0),M(e.DEPTH_TEST),c.setFunc(3),F(!1),I(1),M(e.CULL_FACE),P(0);function M(t){f[t]!==!0&&(e.enable(t),f[t]=!0)}function pe(t){f[t]!==!1&&(e.disable(t),f[t]=!1)}function me(t,n){return p[t]===n?!1:(e.bindFramebuffer(t,n),p[t]=n,r&&(t===e.DRAW_FRAMEBUFFER&&(p[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(p[e.DRAW_FRAMEBUFFER]=n)),!0)}function he(r,i){let a=h,o=!1;if(r)if(a=m.get(i),a===void 0&&(a=[],m.set(i,a)),r.isWebGLMultipleRenderTargets){let t=r.texture;if(a.length!==t.length||a[0]!==e.COLOR_ATTACHMENT0){for(let n=0,r=t.length;n<r;n++)a[n]=e.COLOR_ATTACHMENT0+n;a.length=t.length,o=!0}}else a[0]!==e.COLOR_ATTACHMENT0&&(a[0]=e.COLOR_ATTACHMENT0,o=!0);else a[0]!==e.BACK&&(a[0]=e.BACK,o=!0);o&&(n.isWebGL2?e.drawBuffers(a):t.get(`WEBGL_draw_buffers`).drawBuffersWEBGL(a))}function ge(t){return g===t?!1:(e.useProgram(t),g=t,!0)}let N={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};if(r)N[103]=e.MIN,N[104]=e.MAX;else{let e=t.get(`EXT_blend_minmax`);e!==null&&(N[103]=e.MIN_EXT,N[104]=e.MAX_EXT)}let _e={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function P(t,n,r,i,a,o,s,c,l,u){if(t===0){_===!0&&(pe(e.BLEND),_=!1);return}if(_===!1&&(M(e.BLEND),_=!0),t!==5){if(t!==v||u!==D){if((y!==100||S!==100)&&(e.blendEquation(e.FUNC_ADD),y=100,S=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.ZERO,e.SRC_COLOR,e.ZERO,e.SRC_ALPHA);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t);break}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.SRC_ALPHA,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFunc(e.ZERO,e.SRC_COLOR);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t);break}b=null,x=null,C=null,w=null,T.set(0,0,0),E=0,v=t,D=u}return}a||=n,o||=r,s||=i,(n!==y||a!==S)&&(e.blendEquationSeparate(N[n],N[a]),y=n,S=a),(r!==b||i!==x||o!==C||s!==w)&&(e.blendFuncSeparate(_e[r],_e[i],_e[o],_e[s]),b=r,x=i,C=o,w=s),(c.equals(T)===!1||l!==E)&&(e.blendColor(c.r,c.g,c.b,l),T.copy(c),E=l),v=t,D=!1}function ve(t,n){t.side===2?pe(e.CULL_FACE):M(e.CULL_FACE);let r=t.side===1;n&&(r=!r),F(r),t.blending===1&&t.transparent===!1?P(0):P(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),c.setFunc(t.depthFunc),c.setTest(t.depthTest),c.setMask(t.depthWrite),s.setMask(t.colorWrite);let i=t.stencilWrite;l.setTest(i),i&&(l.setMask(t.stencilWriteMask),l.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),l.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ye(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?M(e.SAMPLE_ALPHA_TO_COVERAGE):pe(e.SAMPLE_ALPHA_TO_COVERAGE)}function F(t){ee!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),ee=t)}function I(t){t===0?pe(e.CULL_FACE):(M(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function L(t){t!==k&&(ne&&e.lineWidth(t),k=t)}function ye(t,n,r){t?(M(e.POLYGON_OFFSET_FILL),(te!==n||A!==r)&&(e.polygonOffset(n,r),te=n,A=r)):pe(e.POLYGON_OFFSET_FILL)}function be(t){t?M(e.SCISSOR_TEST):pe(e.SCISSOR_TEST)}function R(t){t===void 0&&(t=e.TEXTURE0+j-1),ae!==t&&(e.activeTexture(t),ae=t)}function xe(t,n,r){r===void 0&&(r=ae===null?e.TEXTURE0+j-1:ae);let i=oe[r];i===void 0&&(i={type:void 0,texture:void 0},oe[r]=i),(i.type!==t||i.texture!==n)&&(ae!==r&&(e.activeTexture(r),ae=r),e.bindTexture(t,n||fe[t]),i.type=t,i.texture=n)}function Se(){let t=oe[ae];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ce(){try{e.compressedTexImage2D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function we(){try{e.compressedTexImage3D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Te(){try{e.texSubImage2D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ee(){try{e.texSubImage3D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function De(){try{e.compressedTexSubImage2D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Oe(){try{e.compressedTexSubImage3D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function ke(){try{e.texStorage2D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ae(){try{e.texStorage3D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function z(){try{e.texImage2D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function je(){try{e.texImage3D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function B(t){le.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),le.copy(t))}function V(t){ue.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ue.copy(t))}function Me(t,n){let r=d.get(n);r===void 0&&(r=new WeakMap,d.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Ne(t,n){let r=d.get(n).get(t);u.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),u.set(n,r))}function Pe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),r===!0&&(e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null)),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),f={},ae=null,oe={},p={},m=new WeakMap,h=[],g=null,_=!1,v=null,y=null,b=null,x=null,S=null,C=null,w=null,T=new G(0,0,0),E=0,D=!1,ee=null,O=null,k=null,te=null,A=null,le.set(0,0,e.canvas.width,e.canvas.height),ue.set(0,0,e.canvas.width,e.canvas.height),s.reset(),c.reset(),l.reset()}return{buffers:{color:s,depth:c,stencil:l},enable:M,disable:pe,bindFramebuffer:me,drawBuffers:he,useProgram:ge,setBlending:P,setMaterial:ve,setFlipSided:F,setCullFace:I,setLineWidth:L,setPolygonOffset:ye,setScissorTest:be,activeTexture:R,bindTexture:xe,unbindTexture:Se,compressedTexImage2D:Ce,compressedTexImage3D:we,texImage2D:z,texImage3D:je,updateUBOMapping:Me,uniformBlockBinding:Ne,texStorage2D:ke,texStorage3D:Ae,texSubImage2D:Te,texSubImage3D:Ee,compressedTexSubImage2D:De,compressedTexSubImage3D:Oe,scissor:B,viewport:V,reset:Pe}}function Co(e,t,n,r,p,h,g){let v=p.isWebGL2,y=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,b=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),x=new WeakMap,S,C=new WeakMap,w=!1;try{w=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function T(e,t){return w?new OffscreenCanvas(e,t):Pe(`canvas`)}function E(e,t,n,r){let i=1;if((e.width>r||e.height>r)&&(i=r/Math.max(e.width,e.height)),i<1||t===!0)if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let r=t?Oe:Math.floor,a=r(i*e.width),o=r(i*e.height);S===void 0&&(S=T(a,o));let s=n?T(a,o):S;return s.width=a,s.height=o,s.getContext(`2d`).drawImage(e,0,0,a,o),console.warn(`THREE.WebGLRenderer: Texture has been resized from (`+e.width+`x`+e.height+`) to (`+a+`x`+o+`).`),s}else return`data`in e&&console.warn(`THREE.WebGLRenderer: Image in DataTexture is too big (`+e.width+`x`+e.height+`).`),e;return e}function D(e){return Ee(e.width)&&Ee(e.height)}function ee(e){return v?!1:e.wrapS!==1001||e.wrapT!==1001||e.minFilter!==1003&&e.minFilter!==1006}function O(e,t){return e.generateMipmaps&&t&&e.minFilter!==1003&&e.minFilter!==1006}function k(t){e.generateMipmap(t)}function te(n,r,i,a,o=!1){if(v===!1)return r;if(n!==null){if(e[n]!==void 0)return e[n];console.warn(`THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let s=r;if(r===e.RED&&(i===e.FLOAT&&(s=e.R32F),i===e.HALF_FLOAT&&(s=e.R16F),i===e.UNSIGNED_BYTE&&(s=e.R8)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(s=e.R8UI),i===e.UNSIGNED_SHORT&&(s=e.R16UI),i===e.UNSIGNED_INT&&(s=e.R32UI),i===e.BYTE&&(s=e.R8I),i===e.SHORT&&(s=e.R16I),i===e.INT&&(s=e.R32I)),r===e.RG&&(i===e.FLOAT&&(s=e.RG32F),i===e.HALF_FLOAT&&(s=e.RG16F),i===e.UNSIGNED_BYTE&&(s=e.RG8)),r===e.RGBA){let t=o?ie:H.getTransfer(a);i===e.FLOAT&&(s=e.RGBA32F),i===e.HALF_FLOAT&&(s=e.RGBA16F),i===e.UNSIGNED_BYTE&&(s=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT_4_4_4_4&&(s=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(s=e.RGB5_A1)}return(s===e.R16F||s===e.R32F||s===e.RG16F||s===e.RG32F||s===e.RGBA16F||s===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),s}function A(e,t,n){return O(e,n)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function j(t){return t===1003||t===1004||t===1005?e.NEAREST:e.LINEAR}function ne(e){let t=e.target;t.removeEventListener(`dispose`,ne),ae(t),t.isVideoTexture&&x.delete(t)}function re(e){let t=e.target;t.removeEventListener(`dispose`,re),se(t)}function ae(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=C.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&oe(e),Object.keys(i).length===0&&C.delete(n)}r.remove(e)}function oe(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=C.get(i);delete a[n.__cacheKey],g.memory.textures--}function se(t){let n=t.texture,i=r.get(t),a=r.get(n);if(a.__webglTexture!==void 0&&(e.deleteTexture(a.__webglTexture),g.memory.textures--),t.depthTexture&&t.depthTexture.dispose(),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(i.__webglFramebuffer[t]))for(let n=0;n<i.__webglFramebuffer[t].length;n++)e.deleteFramebuffer(i.__webglFramebuffer[t][n]);else e.deleteFramebuffer(i.__webglFramebuffer[t]);i.__webglDepthbuffer&&e.deleteRenderbuffer(i.__webglDepthbuffer[t])}else{if(Array.isArray(i.__webglFramebuffer))for(let t=0;t<i.__webglFramebuffer.length;t++)e.deleteFramebuffer(i.__webglFramebuffer[t]);else e.deleteFramebuffer(i.__webglFramebuffer);if(i.__webglDepthbuffer&&e.deleteRenderbuffer(i.__webglDepthbuffer),i.__webglMultisampledFramebuffer&&e.deleteFramebuffer(i.__webglMultisampledFramebuffer),i.__webglColorRenderbuffer)for(let t=0;t<i.__webglColorRenderbuffer.length;t++)i.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(i.__webglColorRenderbuffer[t]);i.__webglDepthRenderbuffer&&e.deleteRenderbuffer(i.__webglDepthRenderbuffer)}if(t.isWebGLMultipleRenderTargets)for(let t=0,i=n.length;t<i;t++){let i=r.get(n[t]);i.__webglTexture&&(e.deleteTexture(i.__webglTexture),g.memory.textures--),r.remove(n[t])}r.remove(n),r.remove(t)}let ce=0;function le(){ce=0}function de(){let e=ce;return e>=p.maxTextures&&console.warn(`THREE.WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+p.maxTextures),ce+=1,e}function fe(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function M(t,i){let a=r.get(t);if(t.isVideoTexture&&ke(t),t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)console.warn(`THREE.WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)console.warn(`THREE.WebGLRenderer: Texture marked for update but image is incomplete`);else{F(a,t,i);return}}n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function pe(t,i){let a=r.get(t);if(t.version>0&&a.__version!==t.version){F(a,t,i);return}n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function me(t,i){let a=r.get(t);if(t.version>0&&a.__version!==t.version){F(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function he(t,i){let a=r.get(t);if(t.version>0&&a.__version!==t.version){I(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ge={[i]:e.REPEAT,[a]:e.CLAMP_TO_EDGE,[o]:e.MIRRORED_REPEAT},N={[s]:e.NEAREST,[c]:e.NEAREST_MIPMAP_NEAREST,[l]:e.NEAREST_MIPMAP_LINEAR,[u]:e.LINEAR,[d]:e.LINEAR_MIPMAP_NEAREST,[f]:e.LINEAR_MIPMAP_LINEAR},_e={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function P(n,i,a){if(a?(e.texParameteri(n,e.TEXTURE_WRAP_S,ge[i.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ge[i.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ge[i.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,N[i.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,N[i.minFilter])):(e.texParameteri(n,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(n,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,e.CLAMP_TO_EDGE),(i.wrapS!==1001||i.wrapT!==1001)&&console.warn(`THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping.`),e.texParameteri(n,e.TEXTURE_MAG_FILTER,j(i.magFilter)),e.texParameteri(n,e.TEXTURE_MIN_FILTER,j(i.minFilter)),i.minFilter!==1003&&i.minFilter!==1006&&console.warn(`THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.`)),i.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,_e[i.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){let a=t.get(`EXT_texture_filter_anisotropic`);if(i.magFilter===1003||i.minFilter!==1005&&i.minFilter!==1008||i.type===1015&&t.has(`OES_texture_float_linear`)===!1||v===!1&&i.type===1016&&t.has(`OES_texture_half_float_linear`)===!1)return;(i.anisotropy>1||r.get(i).__currentAnisotropy)&&(e.texParameterf(n,a.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(i.anisotropy,p.getMaxAnisotropy())),r.get(i).__currentAnisotropy=i.anisotropy)}}function ve(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,ne));let i=n.source,a=C.get(i);a===void 0&&(a={},C.set(i,a));let o=fe(n);if(o!==t.__cacheKey){a[o]===void 0&&(a[o]={texture:e.createTexture(),usedTimes:0},g.memory.textures++,r=!0),a[o].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&oe(n)),t.__cacheKey=o,t.__webglTexture=a[o].texture}return r}function F(t,i,a){let o=e.TEXTURE_2D;(i.isDataArrayTexture||i.isCompressedArrayTexture)&&(o=e.TEXTURE_2D_ARRAY),i.isData3DTexture&&(o=e.TEXTURE_3D);let s=ve(t,i),c=i.source;n.bindTexture(o,t.__webglTexture,e.TEXTURE0+a);let l=r.get(c);if(c.version!==l.__version||s===!0){n.activeTexture(e.TEXTURE0+a);let t=H.getPrimaries(H.workingColorSpace),r=i.colorSpace===``?null:H.getPrimaries(i.colorSpace),u=i.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,i.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,i.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,i.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,u);let d=ee(i)&&D(i.image)===!1,f=E(i.image,d,!1,p.maxTextureSize);f=Ae(i,f);let g=D(f)||v,y=h.convert(i.format,i.colorSpace),b=h.convert(i.type),x=te(i.internalFormat,y,b,i.colorSpace,i.isVideoTexture);P(o,i,g);let S,C=i.mipmaps,w=v&&i.isVideoTexture!==!0&&x!==36196,T=l.__version===void 0||s===!0,j=A(i,f,g);if(i.isDepthTexture)x=e.DEPTH_COMPONENT,v?x=i.type===1015?e.DEPTH_COMPONENT32F:i.type===1014?e.DEPTH_COMPONENT24:i.type===1020?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT16:i.type===1015&&console.error(`WebGLRenderer: Floating point depth texture requires WebGL2.`),i.format===1026&&x===e.DEPTH_COMPONENT&&i.type!==1012&&i.type!==1014&&(console.warn(`THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture.`),i.type=m,b=h.convert(i.type)),i.format===1027&&x===e.DEPTH_COMPONENT&&(x=e.DEPTH_STENCIL,i.type!==1020&&(console.warn(`THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture.`),i.type=_,b=h.convert(i.type))),T&&(w?n.texStorage2D(e.TEXTURE_2D,1,x,f.width,f.height):n.texImage2D(e.TEXTURE_2D,0,x,f.width,f.height,0,y,b,null));else if(i.isDataTexture)if(C.length>0&&g){w&&T&&n.texStorage2D(e.TEXTURE_2D,j,x,C[0].width,C[0].height);for(let t=0,r=C.length;t<r;t++)S=C[t],w?n.texSubImage2D(e.TEXTURE_2D,t,0,0,S.width,S.height,y,b,S.data):n.texImage2D(e.TEXTURE_2D,t,x,S.width,S.height,0,y,b,S.data);i.generateMipmaps=!1}else w?(T&&n.texStorage2D(e.TEXTURE_2D,j,x,f.width,f.height),n.texSubImage2D(e.TEXTURE_2D,0,0,0,f.width,f.height,y,b,f.data)):n.texImage2D(e.TEXTURE_2D,0,x,f.width,f.height,0,y,b,f.data);else if(i.isCompressedTexture)if(i.isCompressedArrayTexture){w&&T&&n.texStorage3D(e.TEXTURE_2D_ARRAY,j,x,C[0].width,C[0].height,f.depth);for(let t=0,r=C.length;t<r;t++)S=C[t],i.format===1023?w?n.texSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,0,S.width,S.height,f.depth,y,b,S.data):n.texImage3D(e.TEXTURE_2D_ARRAY,t,x,S.width,S.height,f.depth,0,y,b,S.data):y===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):w?n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,0,S.width,S.height,f.depth,y,S.data,0,0):n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,t,x,S.width,S.height,f.depth,0,S.data,0,0)}else{w&&T&&n.texStorage2D(e.TEXTURE_2D,j,x,C[0].width,C[0].height);for(let t=0,r=C.length;t<r;t++)S=C[t],i.format===1023?w?n.texSubImage2D(e.TEXTURE_2D,t,0,0,S.width,S.height,y,b,S.data):n.texImage2D(e.TEXTURE_2D,t,x,S.width,S.height,0,y,b,S.data):y===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):w?n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,S.width,S.height,y,S.data):n.compressedTexImage2D(e.TEXTURE_2D,t,x,S.width,S.height,0,S.data)}else if(i.isDataArrayTexture)w?(T&&n.texStorage3D(e.TEXTURE_2D_ARRAY,j,x,f.width,f.height,f.depth),n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,f.width,f.height,f.depth,y,b,f.data)):n.texImage3D(e.TEXTURE_2D_ARRAY,0,x,f.width,f.height,f.depth,0,y,b,f.data);else if(i.isData3DTexture)w?(T&&n.texStorage3D(e.TEXTURE_3D,j,x,f.width,f.height,f.depth),n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,f.width,f.height,f.depth,y,b,f.data)):n.texImage3D(e.TEXTURE_3D,0,x,f.width,f.height,f.depth,0,y,b,f.data);else if(i.isFramebufferTexture){if(T)if(w)n.texStorage2D(e.TEXTURE_2D,j,x,f.width,f.height);else{let t=f.width,r=f.height;for(let i=0;i<j;i++)n.texImage2D(e.TEXTURE_2D,i,x,t,r,0,y,b,null),t>>=1,r>>=1}}else if(C.length>0&&g){w&&T&&n.texStorage2D(e.TEXTURE_2D,j,x,C[0].width,C[0].height);for(let t=0,r=C.length;t<r;t++)S=C[t],w?n.texSubImage2D(e.TEXTURE_2D,t,0,0,y,b,S):n.texImage2D(e.TEXTURE_2D,t,x,y,b,S);i.generateMipmaps=!1}else w?(T&&n.texStorage2D(e.TEXTURE_2D,j,x,f.width,f.height),n.texSubImage2D(e.TEXTURE_2D,0,0,0,y,b,f)):n.texImage2D(e.TEXTURE_2D,0,x,y,b,f);O(i,g)&&k(o),l.__version=c.version,i.onUpdate&&i.onUpdate(i)}t.__version=i.version}function I(t,i,a){if(i.image.length!==6)return;let o=ve(t,i),s=i.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+a);let c=r.get(s);if(s.version!==c.__version||o===!0){n.activeTexture(e.TEXTURE0+a);let t=H.getPrimaries(H.workingColorSpace),r=i.colorSpace===``?null:H.getPrimaries(i.colorSpace),l=i.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,i.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,i.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,i.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,l);let u=i.isCompressedTexture||i.image[0].isCompressedTexture,d=i.image[0]&&i.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!u&&!d?f[e]=E(i.image[e],!1,!0,p.maxCubemapSize):f[e]=d?i.image[e].image:i.image[e],f[e]=Ae(i,f[e]);let m=f[0],g=D(m)||v,_=h.convert(i.format,i.colorSpace),y=h.convert(i.type),b=te(i.internalFormat,_,y,i.colorSpace),x=v&&i.isVideoTexture!==!0,S=c.__version===void 0||o===!0,C=A(i,m,g);P(e.TEXTURE_CUBE_MAP,i,g);let w;if(u){x&&S&&n.texStorage2D(e.TEXTURE_CUBE_MAP,C,b,m.width,m.height);for(let t=0;t<6;t++){w=f[t].mipmaps;for(let r=0;r<w.length;r++){let a=w[r];i.format===1023?x?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,a.width,a.height,_,y,a.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,b,a.width,a.height,0,_,y,a.data):_===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):x?n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,a.width,a.height,_,a.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,b,a.width,a.height,0,a.data)}}}else{w=i.mipmaps,x&&S&&(w.length>0&&C++,n.texStorage2D(e.TEXTURE_CUBE_MAP,C,b,f[0].width,f[0].height));for(let t=0;t<6;t++)if(d){x?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,f[t].width,f[t].height,_,y,f[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,b,f[t].width,f[t].height,0,_,y,f[t].data);for(let r=0;r<w.length;r++){let i=w[r].image[t].image;x?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,_,y,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,b,i.width,i.height,0,_,y,i.data)}}else{x?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,_,y,f[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,b,_,y,f[t]);for(let r=0;r<w.length;r++){let i=w[r];x?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,_,y,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,b,_,y,i.image[t])}}}O(i,g)&&k(e.TEXTURE_CUBE_MAP),c.__version=s.version,i.onUpdate&&i.onUpdate(i)}t.__version=i.version}function L(t,i,a,o,s,c){let l=h.convert(a.format,a.colorSpace),u=h.convert(a.type),d=te(a.internalFormat,l,u,a.colorSpace);if(!r.get(i).__hasExternalTextures){let t=Math.max(1,i.width>>c),r=Math.max(1,i.height>>c);s===e.TEXTURE_3D||s===e.TEXTURE_2D_ARRAY?n.texImage3D(s,c,d,t,r,i.depth,0,l,u,null):n.texImage2D(s,c,d,t,r,0,l,u,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),De(i)?y.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,o,s,r.get(a).__webglTexture,0,Te(i)):(s===e.TEXTURE_2D||s>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&s<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,o,s,r.get(a).__webglTexture,c),n.bindFramebuffer(e.FRAMEBUFFER,null)}function ye(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer&&!n.stencilBuffer){let i=v===!0?e.DEPTH_COMPONENT24:e.DEPTH_COMPONENT16;if(r||De(n)){let t=n.depthTexture;t&&t.isDepthTexture&&(t.type===1015?i=e.DEPTH_COMPONENT32F:t.type===1014&&(i=e.DEPTH_COMPONENT24));let r=Te(n);De(n)?y.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,r,i,n.width,n.height):e.renderbufferStorageMultisample(e.RENDERBUFFER,r,i,n.width,n.height)}else e.renderbufferStorage(e.RENDERBUFFER,i,n.width,n.height);e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,t)}else if(n.depthBuffer&&n.stencilBuffer){let i=Te(n);r&&De(n)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,i,e.DEPTH24_STENCIL8,n.width,n.height):De(n)?y.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,i,e.DEPTH24_STENCIL8,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_STENCIL,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.RENDERBUFFER,t)}else{let t=n.isWebGLMultipleRenderTargets===!0?n.texture:[n.texture];for(let i=0;i<t.length;i++){let a=t[i],o=h.convert(a.format,a.colorSpace),s=h.convert(a.type),c=te(a.internalFormat,o,s,a.colorSpace),l=Te(n);r&&De(n)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,l,c,n.width,n.height):De(n)?y.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,l,c,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,c,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function be(t,i){if(i&&i.isWebGLCubeRenderTarget)throw Error(`Depth Texture with cube render targets is not supported`);if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`renderTarget.depthTexture must be an instance of THREE.DepthTexture`);(!r.get(i.depthTexture).__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),M(i.depthTexture,0);let a=r.get(i.depthTexture).__webglTexture,o=Te(i);if(i.depthTexture.format===1026)De(i)?y.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,a,0,o):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,a,0);else if(i.depthTexture.format===1027)De(i)?y.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,a,0,o):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,a,0);else throw Error(`Unknown depthTexture format`)}function R(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)throw Error(`target.depthTexture not supported in Cube render targets`);be(i.__webglFramebuffer,t)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]=e.createRenderbuffer(),ye(i.__webglDepthbuffer[r],t,!1)}else n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer=e.createRenderbuffer(),ye(i.__webglDepthbuffer,t,!1);n.bindFramebuffer(e.FRAMEBUFFER,null)}function xe(t,n,i){let a=r.get(t);n!==void 0&&L(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&R(t)}function Se(t){let i=t.texture,a=r.get(t),o=r.get(i);t.addEventListener(`dispose`,re),t.isWebGLMultipleRenderTargets!==!0&&(o.__webglTexture===void 0&&(o.__webglTexture=e.createTexture()),o.__version=i.version,g.memory.textures++);let s=t.isWebGLCubeRenderTarget===!0,c=t.isWebGLMultipleRenderTargets===!0,l=D(t)||v;if(s){a.__webglFramebuffer=[];for(let t=0;t<6;t++)if(v&&i.mipmaps&&i.mipmaps.length>0){a.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)a.__webglFramebuffer[t][n]=e.createFramebuffer()}else a.__webglFramebuffer[t]=e.createFramebuffer()}else{if(v&&i.mipmaps&&i.mipmaps.length>0){a.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)a.__webglFramebuffer[t]=e.createFramebuffer()}else a.__webglFramebuffer=e.createFramebuffer();if(c)if(p.drawBuffers){let n=t.texture;for(let t=0,i=n.length;t<i;t++){let i=r.get(n[t]);i.__webglTexture===void 0&&(i.__webglTexture=e.createTexture(),g.memory.textures++)}}else console.warn(`THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.`);if(v&&t.samples>0&&De(t)===!1){let r=c?i:[i];a.__webglMultisampledFramebuffer=e.createFramebuffer(),a.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,a.__webglMultisampledFramebuffer);for(let n=0;n<r.length;n++){let i=r[n];a.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,a.__webglColorRenderbuffer[n]);let o=h.convert(i.format,i.colorSpace),s=h.convert(i.type),c=te(i.internalFormat,o,s,i.colorSpace,t.isXRRenderTarget===!0),l=Te(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,l,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,a.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(a.__webglDepthRenderbuffer=e.createRenderbuffer(),ye(a.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(s){n.bindTexture(e.TEXTURE_CUBE_MAP,o.__webglTexture),P(e.TEXTURE_CUBE_MAP,i,l);for(let n=0;n<6;n++)if(v&&i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)L(a.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else L(a.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);O(i,l)&&k(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(c){let i=t.texture;for(let o=0,s=i.length;o<s;o++){let s=i[o],c=r.get(s);n.bindTexture(e.TEXTURE_2D,c.__webglTexture),P(e.TEXTURE_2D,s,l),L(a.__webglFramebuffer,t,s,e.COLOR_ATTACHMENT0+o,e.TEXTURE_2D,0),O(s,l)&&k(e.TEXTURE_2D)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(v?r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY:console.error(`THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.`)),n.bindTexture(r,o.__webglTexture),P(r,i,l),v&&i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)L(a.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else L(a.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);O(i,l)&&k(r),n.unbindTexture()}t.depthBuffer&&R(t)}function Ce(t){let i=D(t)||v,a=t.isWebGLMultipleRenderTargets===!0?t.texture:[t.texture];for(let o=0,s=a.length;o<s;o++){let s=a[o];if(O(s,i)){let i=t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:e.TEXTURE_2D,a=r.get(s).__webglTexture;n.bindTexture(i,a),k(i),n.unbindTexture()}}}function we(t){if(v&&t.samples>0&&De(t)===!1){let i=t.isWebGLMultipleRenderTargets?t.texture:[t.texture],a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,c=[],l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=t.isWebGLMultipleRenderTargets===!0;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){c.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&c.push(l);let f=u.__ignoreDepthValues===void 0?!1:u.__ignoreDepthValues;if(f===!1&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d&&e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]),f===!0&&(e.invalidateFramebuffer(e.READ_FRAMEBUFFER,[l]),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[l])),d){let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),b&&e.invalidateFramebuffer(e.READ_FRAMEBUFFER,c)}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}}function Te(e){return Math.min(p.maxSamples,e.samples)}function De(e){let n=r.get(e);return v&&e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function ke(e){let t=g.render.frame;x.get(e)!==t&&(x.set(e,t),e.update())}function Ae(e,n){let r=e.colorSpace,i=e.format,a=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||e.format===1035||r!==`srgb-linear`&&r!==``&&(H.getTransfer(r)===`srgb`?v===!1?t.has(`EXT_sRGB`)===!0&&i===1023?(e.format=ue,e.minFilter=u,e.generateMipmaps=!1):n=Ge.sRGBToLinear(n):(i!==1023||a!==1009)&&console.warn(`THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):console.error(`THREE.WebGLTextures: Unsupported texture color space:`,r)),n}this.allocateTextureUnit=de,this.resetTextureUnits=le,this.setTexture2D=M,this.setTexture2DArray=pe,this.setTexture3D=me,this.setTextureCube=he,this.rebindTextures=xe,this.setupRenderTarget=Se,this.updateRenderTargetMipmap=Ce,this.updateMultisampleRenderTarget=we,this.setupDepthRenderbuffer=R,this.setupFrameBufferTexture=L,this.useMultisampledRTT=De}function wo(e,t,n){let r=n.isWebGL2;function i(n,i=``){let a,o=H.getTransfer(i);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return r?e.HALF_FLOAT:(a=t.get(`OES_texture_half_float`),a===null?null:a.HALF_FLOAT_OES);if(n===1021)return e.ALPHA;if(n===1023)return e.RGBA;if(n===1024)return e.LUMINANCE;if(n===1025)return e.LUMINANCE_ALPHA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1035)return a=t.get(`EXT_sRGB`),a===null?null:a.SRGB_ALPHA_EXT;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(o===`srgb`)if(a=t.get(`WEBGL_compressed_texture_s3tc_srgb`),a!==null){if(n===33776)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get(`WEBGL_compressed_texture_s3tc`),a!==null){if(n===33776)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(a=t.get(`WEBGL_compressed_texture_pvrtc`),a!==null){if(n===35840)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196)return a=t.get(`WEBGL_compressed_texture_etc1`),a===null?null:a.COMPRESSED_RGB_ETC1_WEBGL;if(n===37492||n===37496)if(a=t.get(`WEBGL_compressed_texture_etc`),a!==null){if(n===37492)return o===`srgb`?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===37496)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(a=t.get(`WEBGL_compressed_texture_astc`),a!==null){if(n===37808)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(a=t.get(`EXT_texture_compression_bptc`),a!==null){if(n===36492)return o===`srgb`?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(a=t.get(`EXT_texture_compression_rgtc`),a!==null){if(n===36492)return a.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?r?e.UNSIGNED_INT_24_8:(a=t.get(`WEBGL_depth_texture`),a===null?null:a.UNSIGNED_INT_24_8_WEBGL):e[n]===void 0?null:e[n]}return{convert:i}}var To=class extends vr{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Eo=class extends nn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Do={type:`move`},Oo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Eo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Eo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Eo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Do)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Eo;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},ko=class extends fe{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,h=null,g=t.getContextAttributes(),x=null,S=null,C=[],w=[],T=new B,E=null,D=new vr;D.layers.enable(1),D.viewport=new Ze;let ee=new vr;ee.layers.enable(2),ee.viewport=new Ze;let O=[D,ee],k=new To;k.layers.enable(1),k.layers.enable(2);let te=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new Oo,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new Oo,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new Oo,C[e]=t),t.getHandSpace()};function j(e){let t=w.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ne(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,ne),r.removeEventListener(`inputsourceschange`,re);for(let e=0;e<C.length;e++){let t=w[e];t!==null&&(w[e]=null,C[e].disconnect(t))}te=null,A=null,e.setRenderTarget(x),f=null,d=null,u=null,r=null,S=null,de.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(T.width,T.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return h},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(x=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,ne),r.addEventListener(`inputsourceschange`,re),g.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(T),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){let n={antialias:r.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new $e(f.framebufferWidth,f.framebufferHeight,{format:v,type:p,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let n=null,a=null,o=null;g.depth&&(o=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=g.stencil?b:y,a=g.stencil?_:m);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=new XRWebGLBinding(r,t),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),S=new $e(d.textureWidth,d.textureHeight,{format:v,type:p,depthTexture:new _i(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0});let c=e.properties.get(S);c.__ignoreDepthValues=d.ignoreDepthValues}S.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),de.setContext(r),de.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function re(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=w.indexOf(n);r>=0&&(w[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=w.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=w.length){w.push(n),r=e;break}else if(w[e]===null){w[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let ie=new U,ae=new U;function oe(e,t,n){ie.setFromMatrixPosition(t.matrixWorld),ae.setFromMatrixPosition(n.matrixWorld);let r=ie.distanceTo(ae),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert();let g=o+m,_=s+m,v=f-h,y=p+(r-h),b=c*s/_*g,x=l*s/_*g;e.projectionMatrix.makePerspective(v,y,b,x,g,_),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}function se(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;k.near=ee.near=D.near=e.near,k.far=ee.far=D.far=e.far,(te!==k.near||A!==k.far)&&(r.updateRenderState({depthNear:k.near,depthFar:k.far}),te=k.near,A=k.far);let t=e.parent,n=k.cameras;se(k,t);for(let e=0;e<n.length;e++)se(n[e],t);n.length===2?oe(k,D,ee):k.projectionMatrix.copy(D.projectionMatrix),ce(e,k,t)};function ce(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=he*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(d===null&&f===null))return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)};let le=null;function ue(t,r){if(l=r.getViewerPose(c||a),h=r,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(S,f.framebuffer),e.setRenderTarget(S));let n=!1;t.length!==k.cameras.length&&(k.cameras.length=0,n=!0);for(let r=0;r<t.length;r++){let i=t[r],a=null;if(f!==null)a=f.getViewport(i);else{let t=u.getViewSubImage(d,i);a=t.viewport,r===0&&(e.setRenderTargetTextures(S,t.colorTexture,d.ignoreDepthValues?void 0:t.depthStencilTexture),e.setRenderTarget(S))}let o=O[r];o===void 0&&(o=new vr,o.layers.enable(r),o.viewport=new Ze,O[r]=o),o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(i.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),r===0&&(k.matrix.copy(o.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),n===!0&&k.cameras.push(o)}}for(let e=0;e<C.length;e++){let t=w[e],n=C[e];t!==null&&n!==void 0&&n.update(t,r,c||a)}le&&le(t,r),r.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:r}),h=null}let de=new jr;de.setAnimationLoop(ue),this.setAnimationLoop=function(e){le=e},this.dispose=function(){}}};function Ao(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,fr(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isMeshBasicMaterial||t.isMeshLambertMaterial?a(e,t):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(r,i){r.opacity.value=i.opacity,i.color&&r.diffuse.value.copy(i.color),i.emissive&&r.emissive.value.copy(i.emissive).multiplyScalar(i.emissiveIntensity),i.map&&(r.map.value=i.map,n(i.map,r.mapTransform)),i.alphaMap&&(r.alphaMap.value=i.alphaMap,n(i.alphaMap,r.alphaMapTransform)),i.bumpMap&&(r.bumpMap.value=i.bumpMap,n(i.bumpMap,r.bumpMapTransform),r.bumpScale.value=i.bumpScale,i.side===1&&(r.bumpScale.value*=-1)),i.normalMap&&(r.normalMap.value=i.normalMap,n(i.normalMap,r.normalMapTransform),r.normalScale.value.copy(i.normalScale),i.side===1&&r.normalScale.value.negate()),i.displacementMap&&(r.displacementMap.value=i.displacementMap,n(i.displacementMap,r.displacementMapTransform),r.displacementScale.value=i.displacementScale,r.displacementBias.value=i.displacementBias),i.emissiveMap&&(r.emissiveMap.value=i.emissiveMap,n(i.emissiveMap,r.emissiveMapTransform)),i.specularMap&&(r.specularMap.value=i.specularMap,n(i.specularMap,r.specularMapTransform)),i.alphaTest>0&&(r.alphaTest.value=i.alphaTest);let a=t.get(i).envMap;if(a&&(r.envMap.value=a,r.flipEnvMap.value=a.isCubeTexture&&a.isRenderTargetTexture===!1?-1:1,r.reflectivity.value=i.reflectivity,r.ior.value=i.ior,r.refractionRatio.value=i.refractionRatio),i.lightMap){r.lightMap.value=i.lightMap;let t=e._useLegacyLights===!0?Math.PI:1;r.lightMapIntensity.value=i.lightMapIntensity*t,n(i.lightMap,r.lightMapTransform)}i.aoMap&&(r.aoMap.value=i.aoMap,r.aoMapIntensity.value=i.aoMapIntensity,n(i.aoMap,r.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,r){e.metalness.value=r.metalness,r.metalnessMap&&(e.metalnessMap.value=r.metalnessMap,n(r.metalnessMap,e.metalnessMapTransform)),e.roughness.value=r.roughness,r.roughnessMap&&(e.roughnessMap.value=r.roughnessMap,n(r.roughnessMap,e.roughnessMapTransform)),t.get(r).envMap&&(e.envMapIntensity.value=r.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function jo(e,t,n,r){let i={},a={},o=[],s=n.isWebGL2?e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(m(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return console.error(`THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let t=0,n=r.length;t<n;t++){let n=Array.isArray(r[t])?r[t]:[r[t]];for(let r=0,i=n.length;r<i;r++){let i=n[r];if(p(i,t,r,a)===!0){let t=i.__offset,n=Array.isArray(i.value)?i.value:[i.value],r=0;for(let a=0;a<n.length;a++){let o=n[a],s=h(o);typeof o==`number`||typeof o==`boolean`?(i.__data[0]=o,e.bufferSubData(e.UNIFORM_BUFFER,t+r,i.__data)):o.isMatrix3?(i.__data[0]=o.elements[0],i.__data[1]=o.elements[1],i.__data[2]=o.elements[2],i.__data[3]=0,i.__data[4]=o.elements[3],i.__data[5]=o.elements[4],i.__data[6]=o.elements[5],i.__data[7]=0,i.__data[8]=o.elements[6],i.__data[9]=o.elements[7],i.__data[10]=o.elements[8],i.__data[11]=0):(o.toArray(i.__data,r),r+=s.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,t,i.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return typeof i==`number`||typeof i==`boolean`?r[a]=i:r[a]=i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=h(r),o=n%16;o!==0&&16-o<a.boundary&&(n+=16-o),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?console.warn(`THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.`):console.warn(`THREE.WebGLRenderer: Unsupported uniform value type.`,e),t}function g(t){let n=t.target;n.removeEventListener(`dispose`,g);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:_}}var Mo=class{constructor(e={}){let{canvas:t=Fe(),context:n=null,depth:r=!0,stencil:i=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let d;d=n===null?a:n.getContextAttributes().alpha;let m=new Uint32Array(4),h=new Int32Array(4),_=null,v=null,y=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=A,this._useLegacyLights=!1,this.toneMapping=0,this.toneMappingExposure=1;let x=this,S=!1,C=0,w=0,T=null,E=-1,D=null,ee=new Ze,O=new Ze,k=null,te=new G(0),ne=0,re=t.width,ie=t.height,ae=1,oe=null,se=null,ce=new Ze(0,0,re,ie),le=new Ze(0,0,re,ie),ue=!1,de=new Ar,fe=!1,M=!1,pe=null,me=new W,he=new B,ge=new U,N={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function _e(){return T===null?ae:1}let P=n;function ve(e,n){for(let r=0;r<e.length;r++){let i=e[r],a=t.getContext(i,n);if(a!==null)return a}return null}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r160`),t.addEventListener(`webglcontextlost`,Ve,!1),t.addEventListener(`webglcontextrestored`,H,!1),t.addEventListener(`webglcontextcreationerror`,He,!1),P===null){let t=[`webgl2`,`webgl`,`experimental-webgl`];if(x.isWebGL1Renderer===!0&&t.shift(),P=ve(t,e),P===null)throw ve(t)?Error(`Error creating WebGL context with your selected attributes.`):Error(`Error creating WebGL context.`)}typeof WebGLRenderingContext<`u`&&P instanceof WebGLRenderingContext&&console.warn(`THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163.`),P.getShaderPrecisionFormat===void 0&&(P.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(e){throw console.error(`THREE.WebGLRenderer: `+e.message),e}let F,I,L,ye,be,R,xe,Se,Ce,we,Te,Ee,De,ke,Ae,z,je,V,Me,Ne,Pe,Ie,Le,Re;function ze(){F=new li(P),I=new zr(P,F,e),F.init(I),Ie=new wo(P,F,I),L=new So(P,F,I),ye=new fi(P),be=new io,R=new Co(P,F,L,be,I,Ie,ye),xe=new Vr(x),Se=new ci(x),Ce=new Mr(P,I),Le=new Lr(P,F,Ce,I),we=new ui(P,Ce,ye,Le),Te=new gi(P,we,Ce,ye),Me=new hi(P,I,R),z=new Br(be),Ee=new ro(x,xe,Se,F,I,Le,z),De=new Ao(x,be),ke=new co,Ae=new go(F,I),V=new Ir(x,xe,Se,L,Te,d,s),je=new xo(x,Te,I),Re=new jo(P,ye,I,L),Ne=new Rr(P,F,ye,I),Pe=new di(P,F,ye,I),ye.programs=Ee.programs,x.capabilities=I,x.extensions=F,x.properties=be,x.renderLists=ke,x.shadowMap=je,x.state=L,x.info=ye}ze();let Be=new ko(x,P);this.xr=Be,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let e=F.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=F.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ae},this.setPixelRatio=function(e){e!==void 0&&(ae=e,this.setSize(re,ie,!1))},this.getSize=function(e){return e.set(re,ie)},this.setSize=function(e,n,r=!0){if(Be.isPresenting){console.warn(`THREE.WebGLRenderer: Can't change size while VR device is presenting.`);return}re=e,ie=n,t.width=Math.floor(e*ae),t.height=Math.floor(n*ae),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(re*ae,ie*ae).floor()},this.setDrawingBufferSize=function(e,n,r){re=e,ie=n,ae=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.getCurrentViewport=function(e){return e.copy(ee)},this.getViewport=function(e){return e.copy(ce)},this.setViewport=function(e,t,n,r){e.isVector4?ce.set(e.x,e.y,e.z,e.w):ce.set(e,t,n,r),L.viewport(ee.copy(ce).multiplyScalar(ae).floor())},this.getScissor=function(e){return e.copy(le)},this.setScissor=function(e,t,n,r){e.isVector4?le.set(e.x,e.y,e.z,e.w):le.set(e,t,n,r),L.scissor(O.copy(le).multiplyScalar(ae).floor())},this.getScissorTest=function(){return ue},this.setScissorTest=function(e){L.setScissorTest(ue=e)},this.setOpaqueSort=function(e){oe=e},this.setTransparentSort=function(e){se=e},this.getClearColor=function(e){return e.copy(V.getClearColor())},this.setClearColor=function(){V.setClearColor.apply(V,arguments)},this.getClearAlpha=function(){return V.getClearAlpha()},this.setClearAlpha=function(){V.setClearAlpha.apply(V,arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(T!==null){let t=T.texture.format;e=t===1033||t===1031||t===1029}if(e){let e=T.texture.type,t=e===1009||e===1014||e===1012||e===1020||e===1017||e===1018,n=V.getClearColor(),r=V.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(m[0]=i,m[1]=a,m[2]=o,m[3]=r,P.clearBufferuiv(P.COLOR,0,m)):(h[0]=i,h[1]=a,h[2]=o,h[3]=r,P.clearBufferiv(P.COLOR,0,h))}else r|=P.COLOR_BUFFER_BIT}t&&(r|=P.DEPTH_BUFFER_BIT),n&&(r|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Ve,!1),t.removeEventListener(`webglcontextrestored`,H,!1),t.removeEventListener(`webglcontextcreationerror`,He,!1),ke.dispose(),Ae.dispose(),be.dispose(),xe.dispose(),Se.dispose(),Te.dispose(),Le.dispose(),Re.dispose(),Ee.dispose(),Be.dispose(),Be.removeEventListener(`sessionstart`,Ye),Be.removeEventListener(`sessionend`,Xe),pe&&=(pe.dispose(),null),Qe.stop()};function Ve(e){e.preventDefault(),console.log(`THREE.WebGLRenderer: Context Lost.`),S=!0}function H(){console.log(`THREE.WebGLRenderer: Context Restored.`),S=!1;let e=ye.autoReset,t=je.enabled,n=je.autoUpdate,r=je.needsUpdate,i=je.type;ze(),ye.autoReset=e,je.enabled=t,je.autoUpdate=n,je.needsUpdate=r,je.type=i}function He(e){console.error(`THREE.WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Ue(e){let t=e.target;t.removeEventListener(`dispose`,Ue),We(t)}function We(e){Ge(e),be.remove(e)}function Ge(e){let t=be.get(e).programs;t!==void 0&&(t.forEach(function(e){Ee.releaseProgram(e)}),e.isShaderMaterial&&Ee.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=N);let o=i.isMesh&&i.matrixWorld.determinant()<0,s=ct(e,t,n,r,i);L.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=we.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Le.setup(i,r,s,n,c);let h,g=Ne;if(c!==null&&(h=Ce.get(c),g=Pe,g.setIndex(h)),i.isMesh)r.wireframe===!0?(L.setLineWidth(r.wireframeLinewidth*_e()),g.setMode(P.LINES)):g.setMode(P.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),L.setLineWidth(e*_e()),i.isLineSegments?g.setMode(P.LINES):i.isLineLoop?g.setMode(P.LINE_LOOP):g.setMode(P.LINE_STRIP)}else i.isPoints?g.setMode(P.POINTS):i.isSprite&&g.setMode(P.TRIANGLES);if(i.isBatchedMesh)g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function Ke(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,at(e,t,n),e.side=0,e.needsUpdate=!0,at(e,t,n),e.side=2):at(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),v=Ae.get(n),v.init(),b.push(v),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(v.pushLight(e),e.castShadow&&v.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(v.pushLight(e),e.castShadow&&v.pushShadow(e))}),v.setupLights(x._useLegacyLights);let r=new Set;return e.traverse(function(e){let t=e.material;if(t)if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];Ke(a,n,e),r.add(a)}else Ke(t,n,e),r.add(t)}),b.pop(),v=null,r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){be.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}F.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let qe=null;function Je(e){qe&&qe(e)}function Ye(){Qe.stop()}function Xe(){Qe.start()}let Qe=new jr;Qe.setAnimationLoop(Je),typeof self<`u`&&Qe.setContext(self),this.setAnimationLoop=function(e){qe=e,Be.setAnimationLoop(e),e===null?Qe.stop():Qe.start()},Be.addEventListener(`sessionstart`,Ye),Be.addEventListener(`sessionend`,Xe),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){console.error(`THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(S===!0)return;e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Be.enabled===!0&&Be.isPresenting===!0&&(Be.cameraAutoUpdate===!0&&Be.updateCamera(t),t=Be.getCamera()),e.isScene===!0&&e.onBeforeRender(x,e,t,T),v=Ae.get(e,b.length),v.init(),b.push(v),me.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),de.setFromProjectionMatrix(me),M=this.localClippingEnabled,fe=z.init(this.clippingPlanes,M),_=ke.get(e,y.length),_.init(),y.push(_),et(e,t,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(oe,se),this.info.render.frame++,fe===!0&&z.beginShadows();let n=v.state.shadowsArray;if(je.render(n,e,t),fe===!0&&z.endShadows(),this.info.autoReset===!0&&this.info.reset(),V.render(_,e),v.setupLights(x._useLegacyLights),t.isArrayCamera){let n=t.cameras;for(let t=0,r=n.length;t<r;t++){let r=n[t];tt(_,e,r,r.viewport)}}else tt(_,e,t);T!==null&&(R.updateMultisampleRenderTarget(T),R.updateRenderTargetMipmap(T)),e.isScene===!0&&e.onAfterRender(x,e,t),Le.resetDefaultState(),E=-1,D=null,b.pop(),v=b.length>0?b[b.length-1]:null,y.pop(),_=y.length>0?y[y.length-1]:null};function et(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)v.pushLight(e),e.castShadow&&v.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||de.intersectsSprite(e)){r&&ge.setFromMatrixPosition(e.matrixWorld).applyMatrix4(me);let t=Te.update(e),i=e.material;i.visible&&_.push(e,t,i,n,ge.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||de.intersectsObject(e))){let t=Te.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),ge.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),ge.copy(e.boundingSphere.center)),ge.applyMatrix4(e.matrixWorld).applyMatrix4(me)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&_.push(e,t,s,n,ge.z,o)}}else i.visible&&_.push(e,t,i,n,ge.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)et(i[e],t,n,r)}function tt(e,t,n,r){let i=e.opaque,a=e.transmissive,o=e.transparent;v.setupLightsView(n),fe===!0&&z.setGlobalState(x.clippingPlanes,n),a.length>0&&nt(i,a,t,n),r&&L.viewport(ee.copy(r)),i.length>0&&rt(i,t,n),a.length>0&&rt(a,t,n),o.length>0&&rt(o,t,n),L.buffers.depth.setTest(!0),L.buffers.depth.setMask(!0),L.buffers.color.setMask(!0),L.setPolygonOffset(!1)}function nt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;let i=I.isWebGL2;pe===null&&(pe=new $e(1,1,{generateMipmaps:!0,type:F.has(`EXT_color_buffer_half_float`)?g:p,minFilter:f,samples:i?4:0})),x.getDrawingBufferSize(he),i?pe.setSize(he.x,he.y):pe.setSize(Oe(he.x),Oe(he.y));let a=x.getRenderTarget();x.setRenderTarget(pe),x.getClearColor(te),ne=x.getClearAlpha(),ne<1&&x.setClearColor(16777215,.5),x.clear();let o=x.toneMapping;x.toneMapping=0,rt(e,n,r),R.updateMultisampleRenderTarget(pe),R.updateRenderTargetMipmap(pe);let s=!1;for(let e=0,i=t.length;e<i;e++){let i=t[e],a=i.object,o=i.geometry,c=i.material,l=i.group;if(c.side===2&&a.layers.test(r.layers)){let e=c.side;c.side=1,c.needsUpdate=!0,it(a,n,r,o,c,l),c.side=e,c.needsUpdate=!0,s=!0}}s===!0&&(R.updateMultisampleRenderTarget(pe),R.updateRenderTargetMipmap(pe)),x.setRenderTarget(a),x.setClearColor(te,ne),x.toneMapping=o}function rt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],o=a.object,s=a.geometry,c=r===null?a.material:r,l=a.group;o.layers.test(n.layers)&&it(o,t,n,s,c,l)}}function it(e,t,n,r,i,a){e.onBeforeRender(x,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(x,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,x.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,x.renderBufferDirect(n,t,r,i,e,a),i.side=2):x.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(x,t,n,r,i,a)}function at(e,t,n){t.isScene!==!0&&(t=N);let r=be.get(e),i=v.state.lights,a=v.state.shadowsArray,o=i.state.version,s=Ee.getParameters(e,i.state,a,t,n),c=Ee.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial?t.environment:null,r.fog=t.fog,r.envMap=(e.isMeshStandardMaterial?Se:xe).get(e.envMap||r.environment),l===void 0&&(e.addEventListener(`dispose`,Ue),l=new Map,r.programs=l);let u=l.get(c);if(u!==void 0){if(r.currentProgram===u&&r.lightsStateVersion===o)return st(e,s),u}else s.uniforms=Ee.getUniforms(e),e.onBuild(n,s,x),e.onBeforeCompile(s,x),u=Ee.acquireProgram(s,c),l.set(c,u),r.uniforms=s.uniforms;let d=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(d.clippingPlanes=z.uniform),st(e,s),r.needsLights=ut(e),r.lightsStateVersion=o,r.needsLights&&(d.ambientLightColor.value=i.state.ambient,d.lightProbe.value=i.state.probe,d.directionalLights.value=i.state.directional,d.directionalLightShadows.value=i.state.directionalShadow,d.spotLights.value=i.state.spot,d.spotLightShadows.value=i.state.spotShadow,d.rectAreaLights.value=i.state.rectArea,d.ltc_1.value=i.state.rectAreaLTC1,d.ltc_2.value=i.state.rectAreaLTC2,d.pointLights.value=i.state.point,d.pointLightShadows.value=i.state.pointShadow,d.hemisphereLights.value=i.state.hemi,d.directionalShadowMap.value=i.state.directionalShadowMap,d.directionalShadowMatrix.value=i.state.directionalShadowMatrix,d.spotShadowMap.value=i.state.spotShadowMap,d.spotLightMatrix.value=i.state.spotLightMatrix,d.spotLightMap.value=i.state.spotLightMap,d.pointShadowMap.value=i.state.pointShadowMap,d.pointShadowMatrix.value=i.state.pointShadowMatrix),r.currentProgram=u,r.uniformsList=null,u}function ot(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=wa.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function st(e,t){let n=be.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function ct(e,t,n,r,i){t.isScene!==!0&&(t=N),R.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial?t.environment:null,s=T===null?x.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:j,c=(r.isMeshStandardMaterial?Se:xe).get(r.envMap||o),l=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,u=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),d=!!n.morphAttributes.position,f=!!n.morphAttributes.normal,p=!!n.morphAttributes.color,m=0;r.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(m=x.toneMapping);let h=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,g=h===void 0?0:h.length,_=be.get(r),y=v.state.lights;if(fe===!0&&(M===!0||e!==D)){let t=e===D&&r.id===E;z.setState(r,e,t)}let b=!1;r.version===_.__version?_.needsLights&&_.lightsStateVersion!==y.state.version?b=!0:_.outputColorSpace===s?i.isBatchedMesh&&_.batching===!1||!i.isBatchedMesh&&_.batching===!0||i.isInstancedMesh&&_.instancing===!1||!i.isInstancedMesh&&_.instancing===!0||i.isSkinnedMesh&&_.skinning===!1||!i.isSkinnedMesh&&_.skinning===!0||i.isInstancedMesh&&_.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&_.instancingColor===!1&&i.instanceColor!==null?b=!0:_.envMap===c?r.fog===!0&&_.fog!==a||_.numClippingPlanes!==void 0&&(_.numClippingPlanes!==z.numPlanes||_.numIntersection!==z.numIntersection)?b=!0:_.vertexAlphas===l&&_.vertexTangents===u&&_.morphTargets===d&&_.morphNormals===f&&_.morphColors===p&&_.toneMapping===m?I.isWebGL2===!0&&_.morphTargetsCount!==g&&(b=!0):b=!0:b=!0:b=!0:(b=!0,_.__version=r.version);let S=_.currentProgram;b===!0&&(S=at(r,t,i));let C=!1,w=!1,ee=!1,O=S.getUniforms(),k=_.uniforms;if(L.useProgram(S.program)&&(C=!0,w=!0,ee=!0),r.id!==E&&(E=r.id,w=!0),C||D!==e){O.setValue(P,`projectionMatrix`,e.projectionMatrix),O.setValue(P,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(P,ge.setFromMatrixPosition(e.matrixWorld)),I.logarithmicDepthBuffer&&O.setValue(P,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(P,`isOrthographic`,e.isOrthographicCamera===!0),D!==e&&(D=e,w=!0,ee=!0)}if(i.isSkinnedMesh){O.setOptional(P,i,`bindMatrix`),O.setOptional(P,i,`bindMatrixInverse`);let e=i.skeleton;e&&(I.floatVertexTextures?(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(P,`boneTexture`,e.boneTexture,R)):console.warn(`THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required.`))}i.isBatchedMesh&&(O.setOptional(P,i,`batchingTexture`),O.setValue(P,`batchingTexture`,i._matricesTexture,R));let te=n.morphAttributes;if((te.position!==void 0||te.normal!==void 0||te.color!==void 0&&I.isWebGL2===!0)&&Me.update(i,n,S),(w||_.receiveShadow!==i.receiveShadow)&&(_.receiveShadow=i.receiveShadow,O.setValue(P,`receiveShadow`,i.receiveShadow)),r.isMeshGouraudMaterial&&r.envMap!==null&&(k.envMap.value=c,k.flipEnvMap.value=c.isCubeTexture&&c.isRenderTargetTexture===!1?-1:1),w&&(O.setValue(P,`toneMappingExposure`,x.toneMappingExposure),_.needsLights&&lt(k,ee),a&&r.fog===!0&&De.refreshFogUniforms(k,a),De.refreshMaterialUniforms(k,r,ae,ie,pe),wa.upload(P,ot(_),k,R)),r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(wa.upload(P,ot(_),k,R),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(P,`center`,i.center),O.setValue(P,`modelViewMatrix`,i.modelViewMatrix),O.setValue(P,`normalMatrix`,i.normalMatrix),O.setValue(P,`modelMatrix`,i.matrixWorld),r.isShaderMaterial||r.isRawShaderMaterial){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++)if(I.isWebGL2){let n=e[t];Re.update(n,S),Re.bind(n,S)}else console.warn(`THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.`)}return S}function lt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function ut(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(e,t,n){be.get(e.texture).__webglTexture=t,be.get(e.depthTexture).__webglTexture=n;let r=be.get(e);r.__hasExternalTextures=!0,r.__hasExternalTextures&&(r.__autoAllocateDepthBuffer=n===void 0,r.__autoAllocateDepthBuffer||F.has(`WEBGL_multisampled_render_to_texture`)===!0&&(console.warn(`THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided`),r.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(e,t){let n=be.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){T=e,C=t,w=n;let r=!0,i=null,a=!1,o=!1;if(e){let s=be.get(e);s.__useDefaultFramebuffer===void 0?s.__webglFramebuffer===void 0?R.setupRenderTarget(e):s.__hasExternalTextures&&R.rebindTextures(e,be.get(e.texture).__webglTexture,be.get(e.depthTexture).__webglTexture):(L.bindFramebuffer(P.FRAMEBUFFER,null),r=!1);let c=e.texture;(c.isData3DTexture||c.isDataArrayTexture||c.isCompressedArrayTexture)&&(o=!0);let l=be.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(i=Array.isArray(l[t])?l[t][n]:l[t],a=!0):i=I.isWebGL2&&e.samples>0&&R.useMultisampledRTT(e)===!1?be.get(e).__webglMultisampledFramebuffer:Array.isArray(l)?l[n]:l,ee.copy(e.viewport),O.copy(e.scissor),k=e.scissorTest}else ee.copy(ce).multiplyScalar(ae).floor(),O.copy(le).multiplyScalar(ae).floor(),k=ue;if(L.bindFramebuffer(P.FRAMEBUFFER,i)&&I.drawBuffers&&r&&L.drawBuffers(e,i),L.viewport(ee),L.scissor(O),L.setScissorTest(k),a){let r=be.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(o){let r=be.get(e.texture),i=t||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,r.__webglTexture,n||0,i)}E=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o){if(!(e&&e.isWebGLRenderTarget)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let s=be.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(s=s[o]),s){L.bindFramebuffer(P.FRAMEBUFFER,s);try{let o=e.texture,s=o.format,c=o.type;if(s!==1023&&Ie.convert(s)!==P.getParameter(P.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}let l=c===1016&&(F.has(`EXT_color_buffer_half_float`)||I.isWebGL2&&F.has(`EXT_color_buffer_float`));if(c!==1009&&Ie.convert(c)!==P.getParameter(P.IMPLEMENTATION_COLOR_READ_TYPE)&&!(c===1015&&(I.isWebGL2||F.has(`OES_texture_float`)||F.has(`WEBGL_color_buffer_float`)))&&!l){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&P.readPixels(t,n,r,i,Ie.convert(s),Ie.convert(c),a)}finally{let e=T===null?null:be.get(T).__webglFramebuffer;L.bindFramebuffer(P.FRAMEBUFFER,e)}}},this.copyFramebufferToTexture=function(e,t,n=0){let r=2**-n,i=Math.floor(t.image.width*r),a=Math.floor(t.image.height*r);R.setTexture2D(t,0),P.copyTexSubImage2D(P.TEXTURE_2D,n,0,0,e.x,e.y,i,a),L.unbindTexture()},this.copyTextureToTexture=function(e,t,n,r=0){let i=t.image.width,a=t.image.height,o=Ie.convert(n.format),s=Ie.convert(n.type);R.setTexture2D(n,0),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,n.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,n.unpackAlignment),t.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,r,e.x,e.y,i,a,o,s,t.image.data):t.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,r,e.x,e.y,t.mipmaps[0].width,t.mipmaps[0].height,o,t.mipmaps[0].data):P.texSubImage2D(P.TEXTURE_2D,r,e.x,e.y,o,s,t.image),r===0&&n.generateMipmaps&&P.generateMipmap(P.TEXTURE_2D),L.unbindTexture()},this.copyTextureToTexture3D=function(e,t,n,r,i=0){if(x.isWebGL1Renderer){console.warn(`THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.`);return}let a=e.max.x-e.min.x+1,o=e.max.y-e.min.y+1,s=e.max.z-e.min.z+1,c=Ie.convert(r.format),l=Ie.convert(r.type),u;if(r.isData3DTexture)R.setTexture3D(r,0),u=P.TEXTURE_3D;else if(r.isDataArrayTexture||r.isCompressedArrayTexture)R.setTexture2DArray(r,0),u=P.TEXTURE_2D_ARRAY;else{console.warn(`THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.`);return}P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,r.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,r.unpackAlignment);let d=P.getParameter(P.UNPACK_ROW_LENGTH),f=P.getParameter(P.UNPACK_IMAGE_HEIGHT),p=P.getParameter(P.UNPACK_SKIP_PIXELS),m=P.getParameter(P.UNPACK_SKIP_ROWS),h=P.getParameter(P.UNPACK_SKIP_IMAGES),g=n.isCompressedTexture?n.mipmaps[i]:n.image;P.pixelStorei(P.UNPACK_ROW_LENGTH,g.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,g.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,e.min.x),P.pixelStorei(P.UNPACK_SKIP_ROWS,e.min.y),P.pixelStorei(P.UNPACK_SKIP_IMAGES,e.min.z),n.isDataTexture||n.isData3DTexture?P.texSubImage3D(u,i,t.x,t.y,t.z,a,o,s,c,l,g.data):n.isCompressedArrayTexture?(console.warn(`THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture.`),P.compressedTexSubImage3D(u,i,t.x,t.y,t.z,a,o,s,c,g.data)):P.texSubImage3D(u,i,t.x,t.y,t.z,a,o,s,c,l,g),P.pixelStorei(P.UNPACK_ROW_LENGTH,d),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,f),P.pixelStorei(P.UNPACK_SKIP_PIXELS,p),P.pixelStorei(P.UNPACK_SKIP_ROWS,m),P.pixelStorei(P.UNPACK_SKIP_IMAGES,h),i===0&&r.generateMipmaps&&P.generateMipmap(u),L.unbindTexture()},this.initTexture=function(e){e.isCubeTexture?R.setTextureCube(e,0):e.isData3DTexture?R.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?R.setTexture2DArray(e,0):R.setTexture2D(e,0),L.unbindTexture()},this.resetState=function(){C=0,w=0,T=null,L.reset(),Le.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return de}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=e===`display-p3`?`display-p3`:`srgb`,t.unpackColorSpace=H.workingColorSpace===`display-p3-linear`?`display-p3`:`srgb`}get outputEncoding(){return console.warn(`THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead.`),this.outputColorSpace===`srgb`?O:ee}set outputEncoding(e){console.warn(`THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead.`),this.outputColorSpace=e===3001?A:j}get useLegacyLights(){return console.warn(`THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733.`),this._useLegacyLights}set useLegacyLights(e){console.warn(`THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733.`),this._useLegacyLights=e}},No=class extends Mo{};No.prototype.isWebGL1Renderer=!0;var Po=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new G(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Fo=class extends nn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}},Io=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=ce,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=ge()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn(`THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead.`),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ge()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ge()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Lo=new U,Ro=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Lo.fromBufferAttribute(this,t),Lo.applyMatrix4(e),this.setXYZ(t,Lo.x,Lo.y,Lo.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Lo.fromBufferAttribute(this,t),Lo.applyNormalMatrix(e),this.setXYZ(t,Lo.x,Lo.y,Lo.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Lo.fromBufferAttribute(this,t),Lo.transformDirection(e),this.setXYZ(t,Lo.x,Lo.y,Lo.z);return this}setX(e,t){return this.normalized&&(t=z(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=z(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=z(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=z(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Ae(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Ae(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Ae(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Ae(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=z(t,this.array),n=z(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=z(t,this.array),n=z(n,this.array),r=z(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=z(t,this.array),n=z(n,this.array),r=z(r,this.array),i=z(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){console.log(`THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new jn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log(`THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},zo=new U,Bo=new Ze,Vo=new Ze,Ho=new U,Uo=new W,Wo=new U,Go=new Ct,Ko=new W,qo=new jt,Jo=class extends K{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type=`SkinnedMesh`,this.bindMode=r,this.bindMatrix=new W,this.bindMatrixInverse=new W,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new at),this.boundingBox.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,Wo),this.boundingBox.expandByPoint(Wo)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Ct),this.boundingSphere.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,Wo),this.boundingSphere.expandByPoint(Wo)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Go.copy(this.boundingSphere),Go.applyMatrix4(r),e.ray.intersectsSphere(Go)!==!1&&(Ko.copy(r).invert(),qo.copy(e.ray).applyMatrix4(Ko),!(this.boundingBox!==null&&qo.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,qo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Ze,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r===1/0?e.set(1,0,0,0):e.multiplyScalar(r),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===`attached`?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===`detached`?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn(`THREE.SkinnedMesh: Unrecognized bindMode: `+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,r=this.geometry;Bo.fromBufferAttribute(r.attributes.skinIndex,e),Vo.fromBufferAttribute(r.attributes.skinWeight,e),zo.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let e=0;e<4;e++){let r=Vo.getComponent(e);if(r!==0){let i=Bo.getComponent(e);Uo.multiplyMatrices(n.bones[i].matrixWorld,n.boneInverses[i]),t.addScaledVector(Ho.copy(zo).applyMatrix4(Uo),r)}}return t.applyMatrix4(this.bindMatrixInverse)}boneTransform(e,t){return console.warn(`THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151.`),this.applyBoneTransform(e,t)}},Yo=class extends nn{constructor(){super(),this.isBone=!0,this.type=`Bone`}},Xo=class extends Xe{constructor(e=null,t=1,n=1,r,i,a,o,c,l=s,u=s,d,f){super(null,a,o,c,l,u,r,i,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Zo=new W,Qo=new W,$o=class e{constructor(e=[],t=[]){this.uuid=ge(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn(`THREE.Skeleton: Number of inverse bone matrices does not match amount of bones.`),this.boneInverses=[];for(let e=0,t=this.bones.length;e<t;e++)this.boneInverses.push(new W)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let t=new W;this.bones[e]&&t.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(t)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&t.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&(t.parent&&t.parent.isBone?(t.matrix.copy(t.parent.matrixWorld).invert(),t.matrix.multiply(t.matrixWorld)):t.matrix.copy(t.matrixWorld),t.matrix.decompose(t.position,t.quaternion,t.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let r=0,i=e.length;r<i;r++){let i=e[r]?e[r].matrixWorld:Qo;Zo.multiplyMatrices(i,t[r]),Zo.toArray(n,r*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new e(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Xo(t,e,e,v,h);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){let r=e.bones[n],i=t[r];i===void 0&&(console.warn(`THREE.Skeleton: No bone found with UUID:`,r),i=new Yo),this.bones.push(i),this.boneInverses.push(new W().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.6,type:`Skeleton`,generator:`Skeleton.toJSON`},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let r=0,i=t.length;r<i;r++){let i=t[r];e.bones.push(i.uuid);let a=n[r];e.boneInverses.push(a.toArray())}return e}},es=class extends jn{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},ts=new W,ns=new W,rs=[],is=new at,as=new W,os=new K,ss=new Ct,cs=class extends K{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new es(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,as)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new at),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ts),is.copy(e.boundingBox).applyMatrix4(ts),this.boundingBox.union(is)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ct),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ts),ss.copy(e.boundingSphere).applyMatrix4(ts),this.boundingSphere.union(ss)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){let n=this.matrixWorld,r=this.count;if(os.geometry=this.geometry,os.material=this.material,os.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ss.copy(this.boundingSphere),ss.applyMatrix4(n),e.ray.intersectsSphere(ss)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,ts),ns.multiplyMatrices(n,ts),os.matrixWorld=ns,os.raycast(e,rs);for(let e=0,n=rs.length;e<n;e++){let n=rs[e];n.instanceId=i,n.object=this,t.push(n)}rs.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new es(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:`dispose`})}},ls=class extends Sn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new G(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},us=new U,ds=new U,fs=new W,ps=new jt,ms=new Ct,hs=class extends nn{constructor(e=new Hn,t=new ls){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)us.fromBufferAttribute(t,e-1),ds.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=us.distanceTo(ds);e.setAttribute(`lineDistance`,new Pn(n,1))}else console.warn(`THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ms.copy(n.boundingSphere),ms.applyMatrix4(r),ms.radius+=i,e.ray.intersectsSphere(ms)===!1)return;fs.copy(r).invert(),ps.copy(e.ray).applyMatrix4(fs);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=new U,l=new U,u=new U,d=new U,f=this.isLineSegments?2:1,p=n.index,m=n.attributes.position;if(p!==null){let n=Math.max(0,a.start),r=Math.min(p.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=f){let n=p.getX(i),r=p.getX(i+1);if(c.fromBufferAttribute(m,n),l.fromBufferAttribute(m,r),ps.distanceSqToSegment(c,l,d,u)>s)continue;d.applyMatrix4(this.matrixWorld);let a=e.ray.origin.distanceTo(d);a<e.near||a>e.far||t.push({distance:a,point:u.clone().applyMatrix4(this.matrixWorld),index:i,face:null,faceIndex:null,object:this})}}else{let n=Math.max(0,a.start),r=Math.min(m.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=f){if(c.fromBufferAttribute(m,i),l.fromBufferAttribute(m,i+1),ps.distanceSqToSegment(c,l,d,u)>s)continue;d.applyMatrix4(this.matrixWorld);let n=e.ray.origin.distanceTo(d);n<e.near||n>e.far||t.push({distance:n,point:u.clone().applyMatrix4(this.matrixWorld),index:i,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}},gs=new U,_s=new U,vs=class extends hs{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)gs.fromBufferAttribute(t,e),_s.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+gs.distanceTo(_s);e.setAttribute(`lineDistance`,new Pn(n,1))}else console.warn(`THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},ys=class extends hs{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type=`LineLoop`}},bs=class extends Sn{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new G(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},xs=new W,Ss=new jt,Cs=new Ct,ws=new U,Ts=class extends nn{constructor(e=new Hn,t=new bs){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Cs.copy(n.boundingSphere),Cs.applyMatrix4(r),Cs.radius+=i,e.ray.intersectsSphere(Cs)===!1)return;xs.copy(r).invert(),Ss.copy(e.ray).applyMatrix4(xs);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);ws.fromBufferAttribute(l,n),Es(ws,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)ws.fromBufferAttribute(l,a),Es(ws,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Es(e,t,n,r,i,a,o){let s=Ss.distanceSqToPoint(e);if(s<n){let n=new U;Ss.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,object:o})}}var Ds=class extends Xe{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Os=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200}getPoint(){return console.warn(`THREE.Curve: .getPoint() not implemented.`),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new B:new U);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new U,r=[],i=[],a=[],o=new U,s=new W;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new U)}i[0]=new U,a[0]=new U;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(N(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(N(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},ks=class extends Os{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t){let n=t||new B,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},As=class extends ks{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function js(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Ms=new U,Ns=new js,Ps=new js,Fs=new js,Is=class extends Os{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new U){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Ms.subVectors(r[0],r[1]).add(r[0]),c=Ms);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Ms.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Ms),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Ns.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Ps.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Fs.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Ns.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Ps.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Fs.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Ns.calc(s),Ps.calc(s),Fs.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new U().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Ls(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function Rs(e,t){let n=1-e;return n*n*t}function zs(e,t){return 2*(1-e)*e*t}function Bs(e,t){return e*e*t}function Vs(e,t,n,r){return Rs(e,t)+zs(e,n)+Bs(e,r)}function Hs(e,t){let n=1-e;return n*n*n*t}function Us(e,t){let n=1-e;return 3*n*n*e*t}function Ws(e,t){return 3*(1-e)*e*e*t}function Gs(e,t){return e*e*e*t}function Ks(e,t,n,r,i){return Hs(e,t)+Us(e,n)+Ws(e,r)+Gs(e,i)}var qs=class extends Os{constructor(e=new B,t=new B,n=new B,r=new B){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new B){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Ks(e,r.x,i.x,a.x,o.x),Ks(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Js=class extends Os{constructor(e=new U,t=new U,n=new U,r=new U){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new U){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Ks(e,r.x,i.x,a.x,o.x),Ks(e,r.y,i.y,a.y,o.y),Ks(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ys=class extends Os{constructor(e=new B,t=new B){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new B){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new B){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Xs=class extends Os{constructor(e=new U,t=new U){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new U){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new U){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Zs=class extends Os{constructor(e=new B,t=new B,n=new B){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new B){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Vs(e,r.x,i.x,a.x),Vs(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Qs=class extends Os{constructor(e=new U,t=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new U){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Vs(e,r.x,i.x,a.x),Vs(e,r.y,i.y,a.y),Vs(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},$s=class extends Os{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new B){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Ls(o,s.x,c.x,l.x,u.x),Ls(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new B().fromArray(n))}return this}},ec=Object.freeze({__proto__:null,ArcCurve:As,CatmullRomCurve3:Is,CubicBezierCurve:qs,CubicBezierCurve3:Js,EllipseCurve:ks,LineCurve:Ys,LineCurve3:Xs,QuadraticBezierCurve:Zs,QuadraticBezierCurve3:Qs,SplineCurve:$s}),tc=class extends Os{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new ec[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new ec[n.type]().fromJSON(n))}return this}},nc=class extends tc{constructor(e){super(),this.type=`Path`,this.currentPoint=new B,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Ys(this.currentPoint.clone(),new B(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new Zs(this.currentPoint.clone(),new B(e,t),new B(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new qs(this.currentPoint.clone(),new B(e,t),new B(n,r),new B(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new $s([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new ks(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},rc=class e extends Hn{constructor(e=[new B(0,-.5),new B(.5,0),new B(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=N(r,0,Math.PI*2);let i=[],a=[],o=[],s=[],c=[],l=1/t,u=new U,d=new B,f=new U,p=new U,m=new U,h=0,g=0;for(let t=0;t<=e.length-1;t++)switch(t){case 0:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,m.copy(f),f.normalize(),s.push(f.x,f.y,f.z);break;case e.length-1:s.push(m.x,m.y,m.z);break;default:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),s.push(f.x,f.y,f.z),m.copy(p)}for(let i=0;i<=t;i++){let f=n+i*l*r,p=Math.sin(f),m=Math.cos(f);for(let n=0;n<=e.length-1;n++){u.x=e[n].x*p,u.y=e[n].y,u.z=e[n].x*m,a.push(u.x,u.y,u.z),d.x=i/t,d.y=n/(e.length-1),o.push(d.x,d.y);let r=s[3*n+0]*p,l=s[3*n+1],f=s[3*n+0]*m;c.push(r,l,f)}}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(s,c,o)}this.setIndex(i),this.setAttribute(`position`,new Pn(a,3)),this.setAttribute(`uv`,new Pn(o,2)),this.setAttribute(`normal`,new Pn(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.points,t.segments,t.phiStart,t.phiLength)}},ic=class e extends rc{constructor(e=1,t=1,n=4,r=8){let i=new nc;i.absarc(0,-t/2,e,Math.PI*1.5,0),i.absarc(0,t/2,e,0,Math.PI*.5),super(i.getPoints(n),r),this.type=`CapsuleGeometry`,this.parameters={radius:e,length:t,capSegments:n,radialSegments:r}}static fromJSON(t){return new e(t.radius,t.length,t.capSegments,t.radialSegments)}},ac=class e extends Hn{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Pn(u,3)),this.setAttribute(`normal`,new Pn(d,3)),this.setAttribute(`uv`,new Pn(f,2));function _(){let a=new U,_=new U,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let e=0;e<r;e++)for(let t=0;t<i;t++){let n=m[t][e],r=m[t+1][e],i=m[t+1][e+1],a=m[t][e+1];l.push(n,r,a),l.push(r,i,a),v+=6}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new B,m=new U,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},oc=class e extends ac{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},sc=class e extends Hn{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new U,d=new U,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=0;f===0&&a===0?v=.5/t:f===n&&s===Math.PI&&(v=-.5/t);for(let n=0;n<=t;n++){let s=n/t;u.x=-e*Math.cos(r+s*i)*Math.sin(a+_*o),u.y=e*Math.cos(a+_*o),u.z=e*Math.sin(r+s*i)*Math.sin(a+_*o),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(s+v,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Pn(p,3)),this.setAttribute(`normal`,new Pn(m,3)),this.setAttribute(`uv`,new Pn(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},cc=class e extends Hn{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i},n=Math.floor(n),r=Math.floor(r);let a=[],o=[],s=[],c=[],l=new U,u=new U,d=new U;for(let a=0;a<=n;a++)for(let f=0;f<=r;f++){let p=f/r*i,m=a/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(p),u.y=(e+t*Math.cos(m))*Math.sin(p),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),l.x=e*Math.cos(p),l.y=e*Math.sin(p),d.subVectors(u,l).normalize(),s.push(d.x,d.y,d.z),c.push(f/r),c.push(a/n)}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,o=(r+1)*(e-1)+t,s=(r+1)*e+t;a.push(n,i,s),a.push(i,o,s)}this.setIndex(a),this.setAttribute(`position`,new Pn(o,3)),this.setAttribute(`normal`,new Pn(s,3)),this.setAttribute(`uv`,new Pn(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}},lc=class extends Sn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:``},this.type=`MeshStandardMaterial`,this.color=new G(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new G(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new B(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},uc=class extends lc{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new B(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return N(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new G(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new G(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new G(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};function dc(e,t,n){return!e||!n&&e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function fc(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function pc(e){function t(t,n){return e[t]-e[n]}let n=e.length,r=Array(n);for(let e=0;e!==n;++e)r[e]=e;return r.sort(t),r}function mc(e,t,n){let r=e.length,i=new e.constructor(r);for(let a=0,o=0;o!==r;++a){let r=n[a]*t;for(let n=0;n!==t;++n)i[o++]=e[r+n]}return i}function hc(e,t,n,r){let i=1,a=e[0];for(;a!==void 0&&a[r]===void 0;)a=e[i++];if(a===void 0)return;let o=a[r];if(o!==void 0)if(Array.isArray(o))do o=a[r],o!==void 0&&(t.push(a.time),n.push.apply(n,o)),a=e[i++];while(a!==void 0);else if(o.toArray!==void 0)do o=a[r],o!==void 0&&(t.push(a.time),o.toArray(n,n.length)),a=e[i++];while(a!==void 0);else do o=a[r],o!==void 0&&(t.push(a.time),n.push(o)),a=e[i++];while(a!==void 0)}var gc=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`call to abstract method`)}intervalChanged_(){}},_c=class extends gc{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:w,endingEnd:w}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case T:i=e,o=2*t-n;break;case E:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case T:a=e,s=2*n-t;break;case E:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},vc=class extends gc{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},yc=class extends gc{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},bc=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=dc(t,this.TimeBufferType),this.values=dc(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:dc(e.times,Array),values:dc(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new yc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new vc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new _c(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case x:t=this.InterpolantFactoryMethodDiscrete;break;case S:t=this.InterpolantFactoryMethodLinear;break;case C:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t);return console.warn(`THREE.KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return x;case this.InterpolantFactoryMethodLinear:return S;case this.InterpolantFactoryMethodSmooth:return C}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error(`THREE.KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(console.error(`THREE.KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){console.error(`THREE.KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){console.error(`THREE.KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&fc(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){console.error(`THREE.KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===C,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0]))if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};bc.prototype.TimeBufferType=Float32Array,bc.prototype.ValueBufferType=Float32Array,bc.prototype.DefaultInterpolation=S;var xc=class extends bc{};xc.prototype.ValueTypeName=`bool`,xc.prototype.ValueBufferType=Array,xc.prototype.DefaultInterpolation=x,xc.prototype.InterpolantFactoryMethodLinear=void 0,xc.prototype.InterpolantFactoryMethodSmooth=void 0;var Sc=class extends bc{};Sc.prototype.ValueTypeName=`color`;var Cc=class extends bc{};Cc.prototype.ValueTypeName=`number`;var wc=class extends gc{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)nt.slerpFlat(i,0,a,c-o,a,c,s);return i}},Tc=class extends bc{InterpolantFactoryMethodLinear(e){return new wc(this.times,this.values,this.getValueSize(),e)}};Tc.prototype.ValueTypeName=`quaternion`,Tc.prototype.DefaultInterpolation=S,Tc.prototype.InterpolantFactoryMethodSmooth=void 0;var Ec=class extends bc{};Ec.prototype.ValueTypeName=`string`,Ec.prototype.ValueBufferType=Array,Ec.prototype.DefaultInterpolation=x,Ec.prototype.InterpolantFactoryMethodLinear=void 0,Ec.prototype.InterpolantFactoryMethodSmooth=void 0;var Dc=class extends bc{};Dc.prototype.ValueTypeName=`vector`;var Oc=class{constructor(e,t=-1,n,r=D){this.name=e,this.tracks=n,this.duration=t,this.blendMode=r,this.uuid=ge(),this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,r=1/(e.fps||1);for(let e=0,i=n.length;e!==i;++e)t.push(Ac(n[e]).scale(r));let i=new this(e.name,e.duration,t,e.blendMode);return i.uuid=e.uuid,i}static toJSON(e){let t=[],n=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let e=0,r=n.length;e!==r;++e)t.push(bc.toJSON(n[e]));return r}static CreateFromMorphTargetSequence(e,t,n,r){let i=t.length,a=[];for(let e=0;e<i;e++){let o=[],s=[];o.push((e+i-1)%i,e,(e+1)%i),s.push(0,1,0);let c=pc(o);o=mc(o,1,c),s=mc(s,1,c),!r&&o[0]===0&&(o.push(i),s.push(s[0])),a.push(new Cc(`.morphTargetInfluences[`+t[e].name+`]`,o,s).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let t=e;n=t.geometry&&t.geometry.animations||t.animations}for(let e=0;e<n.length;e++)if(n[e].name===t)return n[e];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let r={},i=/^([\w-]*?)([\d]+)$/;for(let t=0,n=e.length;t<n;t++){let n=e[t],a=n.name.match(i);if(a&&a.length>1){let e=a[1],t=r[e];t||(r[e]=t=[]),t.push(n)}}let a=[];for(let e in r)a.push(this.CreateFromMorphTargetSequence(e,r[e],t,n));return a}static parseAnimation(e,t){if(!e)return console.error(`THREE.AnimationClip: No animation in JSONLoader data.`),null;let n=function(e,t,n,r,i){if(n.length!==0){let a=[],o=[];hc(n,a,o,r),a.length!==0&&i.push(new e(t,a,o))}},r=[],i=e.name||`default`,a=e.fps||30,o=e.blendMode,s=e.length||-1,c=e.hierarchy||[];for(let e=0;e<c.length;e++){let i=c[e].keys;if(!(!i||i.length===0))if(i[0].morphTargets){let e={},t;for(t=0;t<i.length;t++)if(i[t].morphTargets)for(let n=0;n<i[t].morphTargets.length;n++)e[i[t].morphTargets[n]]=-1;for(let n in e){let e=[],a=[];for(let r=0;r!==i[t].morphTargets.length;++r){let r=i[t];e.push(r.time),a.push(+(r.morphTarget===n))}r.push(new Cc(`.morphTargetInfluence[`+n+`]`,e,a))}s=e.length*a}else{let a=`.bones[`+t[e].name+`]`;n(Dc,a+`.position`,i,`pos`,r),n(Tc,a+`.quaternion`,i,`rot`,r),n(Dc,a+`.scale`,i,`scl`,r)}}return r.length===0?null:new this(i,s,r,o)}resetDuration(){let e=this.tracks,t=0;for(let n=0,r=e.length;n!==r;++n){let e=this.tracks[n];t=Math.max(t,e.times[e.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e&&=this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}};function kc(e){switch(e.toLowerCase()){case`scalar`:case`double`:case`float`:case`number`:case`integer`:return Cc;case`vector`:case`vector2`:case`vector3`:case`vector4`:return Dc;case`color`:return Sc;case`quaternion`:return Tc;case`bool`:case`boolean`:return xc;case`string`:return Ec}throw Error(`THREE.KeyframeTrack: Unsupported typeName: `+e)}function Ac(e){if(e.type===void 0)throw Error(`THREE.KeyframeTrack: track type undefined, can not parse`);let t=kc(e.type);if(e.times===void 0){let t=[],n=[];hc(e.keys,t,n,`value`),e.times=t,e.values=n}return t.parse===void 0?new t(e.name,e.times,e.values,e.interpolation):t.parse(e)}var jc={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(this.files[e]=t)},get:function(e){if(this.enabled!==!1)return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}},Mc=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null}}},Nc=class{constructor(e){this.manager=e===void 0?Mc:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Nc.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var Pc={},Fc=class extends Error{constructor(e,t){super(e),this.response=t}},Ic=class extends Nc{constructor(e){super(e)}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=jc.get(e);if(i!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(i),this.manager.itemEnd(e)},0),i;if(Pc[e]!==void 0){Pc[e].push({onLoad:t,onProgress:n,onError:r});return}Pc[e]=[],Pc[e].push({onLoad:t,onProgress:n,onError:r});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?`include`:`same-origin`}),o=this.mimeType,s=this.responseType;fetch(a).then(t=>{if(t.status===200||t.status===0){if(t.status===0&&console.warn(`THREE.FileLoader: HTTP Status 0 received.`),typeof ReadableStream>`u`||t.body===void 0||t.body.getReader===void 0)return t;let n=Pc[e],r=t.body.getReader(),i=t.headers.get(`Content-Length`)||t.headers.get(`X-File-Size`),a=i?parseInt(i):0,o=a!==0,s=0,c=new ReadableStream({start(e){t();function t(){r.read().then(({done:r,value:i})=>{if(r)e.close();else{s+=i.byteLength;let r=new ProgressEvent(`progress`,{lengthComputable:o,loaded:s,total:a});for(let e=0,t=n.length;e<t;e++){let t=n[e];t.onProgress&&t.onProgress(r)}e.enqueue(i),t()}})}}});return new Response(c)}else throw new Fc(`fetch for "${t.url}" responded with ${t.status}: ${t.statusText}`,t)}).then(e=>{switch(s){case`arraybuffer`:return e.arrayBuffer();case`blob`:return e.blob();case`document`:return e.text().then(e=>new DOMParser().parseFromString(e,o));case`json`:return e.json();default:if(o===void 0)return e.text();{let t=/charset="?([^;"\s]*)"?/i.exec(o),n=t&&t[1]?t[1].toLowerCase():void 0,r=new TextDecoder(n);return e.arrayBuffer().then(e=>r.decode(e))}}}).then(t=>{jc.add(e,t);let n=Pc[e];delete Pc[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onLoad&&r.onLoad(t)}}).catch(t=>{let n=Pc[e];if(n===void 0)throw this.manager.itemError(e),t;delete Pc[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onError&&r.onError(t)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}},Lc=class extends Nc{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=jc.get(e);if(a!==void 0)return i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0),a;let o=Pe(`img`);function s(){l(),jc.add(e,this),t&&t(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),i.manager.itemStart(e),o.src=e,o}},Rc=class extends Nc{constructor(e){super(e)}load(e,t,n,r){let i=this,o=new Xo,s=new Ic(this.manager);return s.setResponseType(`arraybuffer`),s.setRequestHeader(this.requestHeader),s.setPath(this.path),s.setWithCredentials(i.withCredentials),s.load(e,function(e){let n;try{n=i.parse(e)}catch(e){if(r!==void 0)r(e);else{console.error(e);return}}n.image===void 0?n.data!==void 0&&(o.image.width=n.width,o.image.height=n.height,o.image.data=n.data):o.image=n.image,o.wrapS=n.wrapS===void 0?a:n.wrapS,o.wrapT=n.wrapT===void 0?a:n.wrapT,o.magFilter=n.magFilter===void 0?u:n.magFilter,o.minFilter=n.minFilter===void 0?u:n.minFilter,o.anisotropy=n.anisotropy===void 0?1:n.anisotropy,n.colorSpace===void 0?n.encoding!==void 0&&(o.encoding=n.encoding):o.colorSpace=n.colorSpace,n.flipY!==void 0&&(o.flipY=n.flipY),n.format!==void 0&&(o.format=n.format),n.type!==void 0&&(o.type=n.type),n.mipmaps!==void 0&&(o.mipmaps=n.mipmaps,o.minFilter=f),n.mipmapCount===1&&(o.minFilter=u),n.generateMipmaps!==void 0&&(o.generateMipmaps=n.generateMipmaps),o.needsUpdate=!0,t&&t(o,n)},n,r),o}},zc=class extends Nc{constructor(e){super(e)}load(e,t,n,r){let i=new Xe,a=new Lc(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},Bc=class extends nn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new G(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}},Vc=class extends Bc{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new G(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Hc=new W,Uc=new U,Wc=new U,Gc=class{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new B(512,512),this.map=null,this.mapPass=null,this.matrix=new W,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ar,this._frameExtents=new B(1,1),this._viewportCount=1,this._viewports=[new Ze(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Uc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Uc),Wc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Wc),t.updateMatrixWorld(),Hc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Hc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Hc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Kc=class extends Gc{constructor(){super(new vr(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){let t=this.camera,n=he*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},qc=class extends Bc{constructor(e,t,n=0,r=Math.PI/3,i=0,a=2){super(e,t),this.isSpotLight=!0,this.type=`SpotLight`,this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.target=new nn,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.map=null,this.shadow=new Kc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Jc=new W,Yc=new U,Xc=new U,Zc=class extends Gc{constructor(){super(new vr(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new B(4,2),this._viewportCount=6,this._viewports=[new Ze(2,1,1,1),new Ze(0,1,1,1),new Ze(3,1,1,1),new Ze(1,1,1,1),new Ze(3,0,1,1),new Ze(1,0,1,1)],this._cubeDirections=[new U(1,0,0),new U(-1,0,0),new U(0,0,1),new U(0,0,-1),new U(0,1,0),new U(0,-1,0)],this._cubeUps=[new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,0,1),new U(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,r=this.matrix,i=e.distance||n.far;i!==n.far&&(n.far=i,n.updateProjectionMatrix()),Yc.setFromMatrixPosition(e.matrixWorld),n.position.copy(Yc),Xc.copy(n.position),Xc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Xc),n.updateMatrixWorld(),r.makeTranslation(-Yc.x,-Yc.y,-Yc.z),Jc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jc)}},Qc=class extends Bc{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new Zc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},$c=class extends Gc{constructor(){super(new Hr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},el=class extends Bc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.target=new nn,this.shadow=new $c}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},tl=class extends Bc{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type=`AmbientLight`}},nl=class{static decodeText(e){if(typeof TextDecoder<`u`)return new TextDecoder().decode(e);let t=``;for(let n=0,r=e.length;n<r;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){let t=e.lastIndexOf(`/`);return t===-1?`./`:e.slice(0,t+1)}static resolveURL(e,t){return typeof e!=`string`||e===``?``:(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,`$1`)),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},rl=class extends Nc{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>`u`&&console.warn(`THREE.ImageBitmapLoader: createImageBitmap() not supported.`),typeof fetch>`u`&&console.warn(`THREE.ImageBitmapLoader: fetch() not supported.`),this.options={premultiplyAlpha:`none`}}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=jc.get(e);if(a!==void 0){if(i.manager.itemStart(e),a.then){a.then(n=>{t&&t(n),i.manager.itemEnd(e)}).catch(e=>{r&&r(e)});return}return setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0),a}let o={};o.credentials=this.crossOrigin===`anonymous`?`same-origin`:`include`,o.headers=this.requestHeader;let s=fetch(e,o).then(function(e){return e.blob()}).then(function(e){return createImageBitmap(e,Object.assign(i.options,{colorSpaceConversion:`none`}))}).then(function(n){return jc.add(e,n),t&&t(n),i.manager.itemEnd(e),n}).catch(function(t){r&&r(t),jc.remove(e),i.manager.itemError(e),i.manager.itemEnd(e)});jc.add(e,s),i.manager.itemStart(e)}},il,al=class{static getContext(){return il===void 0&&(il=new(window.AudioContext||window.webkitAudioContext)),il}static setContext(e){il=e}},ol=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=sl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=sl();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function sl(){return(typeof performance>`u`?Date:performance).now()}var cl=new U,ll=new nt,ul=new U,dl=new U,fl=class extends nn{constructor(){super(),this.type=`AudioListener`,this.context=al.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._clock=new ol}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return this.filter===null?this.gain.disconnect(this.context.destination):(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e);let t=this.context.listener,n=this.up;if(this.timeDelta=this._clock.getDelta(),this.matrixWorld.decompose(cl,ll,ul),dl.set(0,0,-1).applyQuaternion(ll),t.positionX){let e=this.context.currentTime+this.timeDelta;t.positionX.linearRampToValueAtTime(cl.x,e),t.positionY.linearRampToValueAtTime(cl.y,e),t.positionZ.linearRampToValueAtTime(cl.z,e),t.forwardX.linearRampToValueAtTime(dl.x,e),t.forwardY.linearRampToValueAtTime(dl.y,e),t.forwardZ.linearRampToValueAtTime(dl.z,e),t.upX.linearRampToValueAtTime(n.x,e),t.upY.linearRampToValueAtTime(n.y,e),t.upZ.linearRampToValueAtTime(n.z,e)}else t.setPosition(cl.x,cl.y,cl.z),t.setOrientation(dl.x,dl.y,dl.z,n.x,n.y,n.z)}},pl=class extends nn{constructor(e){super(),this.type=`Audio`,this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType=`empty`,this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType=`audioNode`,this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType=`mediaNode`,this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType=`mediaStreamNode`,this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType=`buffer`,this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){console.warn(`THREE.Audio: Audio is already playing.`);return}if(this.hasPlaybackControl===!1){console.warn(`THREE.Audio: this Audio has no playback control.`);return}this._startedAt=this.context.currentTime+e;let t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn(`THREE.Audio: this Audio has no playback control.`);return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress%=this.duration||this.buffer.duration),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(){if(this.hasPlaybackControl===!1){console.warn(`THREE.Audio: this Audio has no playback control.`);return}return this._progress=0,this.source!==null&&(this.source.stop(),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(e){return e||=[],this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){if(this.detune=e,this.source.detune!==void 0)return this.isPlaying===!0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){console.warn(`THREE.Audio: this Audio has no playback control.`);return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1}getLoop(){return this.hasPlaybackControl===!1?(console.warn(`THREE.Audio: this Audio has no playback control.`),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){console.warn(`THREE.Audio: this Audio has no playback control.`);return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}},ml=new U,hl=new nt,gl=new U,_l=new U,vl=class extends pl{constructor(e){super(e),this.panner=this.context.createPanner(),this.panner.panningModel=`HRTF`,this.panner.connect(this.gain)}connect(){super.connect(),this.panner.connect(this.gain)}disconnect(){super.disconnect(),this.panner.disconnect(this.gain)}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(e){return this.panner.refDistance=e,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(e){return this.panner.rolloffFactor=e,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(e){return this.panner.distanceModel=e,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(e){return this.panner.maxDistance=e,this}setDirectionalCone(e,t,n){return this.panner.coneInnerAngle=e,this.panner.coneOuterAngle=t,this.panner.coneOuterGain=n,this}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(ml,hl,gl),_l.set(0,0,1).applyQuaternion(hl);let t=this.panner;if(t.positionX){let e=this.context.currentTime+this.listener.timeDelta;t.positionX.linearRampToValueAtTime(ml.x,e),t.positionY.linearRampToValueAtTime(ml.y,e),t.positionZ.linearRampToValueAtTime(ml.z,e),t.orientationX.linearRampToValueAtTime(_l.x,e),t.orientationY.linearRampToValueAtTime(_l.y,e),t.orientationZ.linearRampToValueAtTime(_l.z,e)}else t.setPosition(ml.x,ml.y,ml.z),t.setOrientation(_l.x,_l.y,_l.z)}},yl=`\\[\\]\\.:\\/`,bl=RegExp(`[\\[\\]\\.:\\/]`,`g`),xl=`[^\\[\\]\\.:\\/]`,Sl=`[^`+yl.replace(`\\.`,``)+`]`,Cl=`((?:WC+[\\/:])*)`.replace(`WC`,xl),wl=`(WCOD+)?`.replace(`WCOD`,Sl),Tl=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,xl),El=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,xl),Dl=RegExp(`^`+Cl+wl+Tl+El+`$`),Ol=[`material`,`materials`,`bones`,`map`],kl=class{constructor(e,t,n){let r=n||Al.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Al=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(bl,``)}static parseTrackName(e){let t=Dl.exec(e);if(t===null)throw Error(`PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Ol.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn(`THREE.PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){console.error(`THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){console.error(`THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){console.error(`THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){console.error(`THREE.PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){console.error(`THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;console.error(`THREE.PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.needsUpdate===void 0?t.matrixWorldNeedsUpdate!==void 0&&(s=this.Versioning.MatrixWorldNeedsUpdate):s=this.Versioning.NeedsUpdate;let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Al.Composite=kl,Al.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Al.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Al.prototype.GetterByBindingType=[Al.prototype._getValue_direct,Al.prototype._getValue_array,Al.prototype._getValue_arrayElement,Al.prototype._getValue_toArray],Al.prototype.SetterByBindingTypeAndVersioning=[[Al.prototype._setValue_direct,Al.prototype._setValue_direct_setNeedsUpdate,Al.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Al.prototype._setValue_array,Al.prototype._setValue_array_setNeedsUpdate,Al.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Al.prototype._setValue_arrayElement,Al.prototype._setValue_arrayElement_setNeedsUpdate,Al.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Al.prototype._setValue_fromArray,Al.prototype._setValue_fromArray_setNeedsUpdate,Al.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var jl=class{constructor(e,t,n=0,r=1/0){this.ray=new jt(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Ht,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error(`THREE.Raycaster: Unsupported camera type: `+t.type)}intersectObject(e,t=!0,n=[]){return Nl(e,this,n,t),n.sort(Ml),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)Nl(e[r],this,n,t);return n.sort(Ml),n}};function Ml(e,t){return e.distance-t.distance}function Nl(e,t,n,r){if(e.layers.test(t.layers)&&e.raycast(t,n),r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)Nl(r[e],t,n,!0)}}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`160`}})),typeof window<`u`&&(window.__THREE__?console.warn(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`160`);var Pl=[{path:`/Scenes`},{path:`/Meshes`},{path:`/Textures`},{path:`/Materials`},{path:`/Audio`},{path:`/Fonts`},{path:`/Prefabs`},{path:`/Animations`},{path:`/Particles`}],Fl=class{events=new n;_records=new Map;_folders=new Map;constructor(e){for(let t of e?.folders??Pl)this._folders.set(t.path,{path:t.path});for(let t of e?.records??[])this._records.set(t.id,t)}get records(){return[...this._records.values()]}get folders(){return[...this._folders.values()]}get(e){return this._records.get(e)}byType(e){let t=[];for(let n of this._records.values())n.type===e&&t.push(n);return t}add(e){if(this._records.has(e.id))throw Error(`Asset id "${e.id}" already exists.`);this._records.set(e.id,e),this.events.emit(`added`,{record:e})}update(e,t){let n=this._records.get(e);if(!n)return;let r={...n,...t,meta:{...n.meta,...t.meta},id:n.id,type:n.type,createdAt:n.createdAt,updatedAt:Date.now(),_version:n._version};return this._records.set(e,r),this.events.emit(`updated`,{record:r,previous:n}),r}remove(e){let t=this._records.get(e);return t?(this._records.delete(e),this.events.emit(`removed`,{record:t}),!0):!1}addFolder(e){if(this._folders.has(e))return;let t={path:e};this._folders.set(e,t),this.events.emit(`folderAdded`,{folder:t})}removeFolder(e){let t=this._folders.get(e);return t?(this._folders.delete(e),this.events.emit(`folderRemoved`,{folder:t}),!0):!1}hydrate(e){this._records.clear(),this._folders.clear();for(let t of e.folders)this._folders.set(t.path,{path:t.path});for(let t of e.records)this._records.set(t.id,t);this.events.emit(`cleared`,{});for(let e of this._folders.values())this.events.emit(`folderAdded`,{folder:e});for(let e of this._records.values())this.events.emit(`added`,{record:e})}clear(){this._records.clear(),this._folders.clear(),this.events.emit(`cleared`,{})}},Il=`modulepreload`,Ll=function(e){return`/projects/mini-city/`+e},Rl={},zl=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=Ll(t,n),t in Rl)return;Rl[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:Il,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},Bl=class{_blobs;constructor(e=new Map){this._blobs=e}set(e,t){this._blobs.set(e,t)}delete(e){this._blobs.delete(e)}async fetch(e){let t=this._blobs.get(e);if(!t)throw Error(`No blob for asset "${e}".`);return t}async has(e){return this._blobs.has(e)}},Vl=class e{database;blobs;_gltfLoader;_textureLoader=new zc;_cache={textures:new Map,meshes:new Map,audio:new Map,audioBuffers:new Map,fonts:new Map};constructor(e,t){this.database=e,this.blobs=t}static create(t,n=new Bl){return new e(t,n)}loadTexture(e){let t=this._cache.textures.get(e);if(t)return t;let n=this._loadTexture(e).catch(t=>{throw this._cache.textures.delete(e),t});return this._cache.textures.set(e,n),n}loadMesh(e){let t=this._cache.meshes.get(e);if(t)return t;let n=this._loadMesh(e).catch(t=>{throw this._cache.meshes.delete(e),t});return this._cache.meshes.set(e,n),n}loadAudio(e){let t=this._cache.audio.get(e);if(t)return t;let n=this.blobs.fetch(e).catch(t=>{throw this._cache.audio.delete(e),t});return this._cache.audio.set(e,n),n}loadAudioBuffer(e,t){let n=this._cache.audioBuffers.get(e);if(n)return n;let r=this.loadAudio(e).then(e=>t.decodeAudioData(e.slice(0))).catch(t=>{throw this._cache.audioBuffers.delete(e),t});return this._cache.audioBuffers.set(e,r),r}loadFont(e){let t=this._cache.fonts.get(e);if(t)return t;let n=this._loadFont(e).catch(t=>{throw this._cache.fonts.delete(e),t});return this._cache.fonts.set(e,n),n}loadPrefab(e){let t=this.database.get(e);if(!(!t||t.type!==`prefab`))return t.inline}async getBlobUrl(e){try{let t=await this.blobs.fetch(e),n=this.database.get(e)?.meta?.mimeType??`application/octet-stream`;return URL.createObjectURL(new Blob([t],{type:n}))}catch{return}}invalidate(e){this._cache.textures.get(e)?.then(e=>e.dispose()).catch(()=>void 0),this._cache.meshes.get(e)?.then(e=>Hl(e)).catch(()=>void 0),this._cache.textures.delete(e),this._cache.meshes.delete(e),this._cache.audio.delete(e),this._cache.audioBuffers.delete(e),this._cache.fonts.delete(e)}dispose(){for(let e of[...this._cache.textures.keys(),...this._cache.meshes.keys()])this.invalidate(e);this._cache.audio.clear(),this._cache.audioBuffers.clear(),this._cache.fonts.clear()}async _loadTexture(e){let t=await this.blobs.fetch(e),n=this.database.get(e)?.meta?.mimeType??`image/png`,r=new Blob([t],{type:n}),i=URL.createObjectURL(r);try{let e=await new Promise((e,t)=>{this._textureLoader.load(i,t=>e(t),void 0,e=>t(e instanceof Error?e:Error(String(e))))});return e.colorSpace=A,e}finally{URL.revokeObjectURL(i)}}async _loadMesh(e){let t=await this.blobs.fetch(e);return(await(await this._getGltfLoader()).parseAsync(t,``)).scene}async _getGltfLoader(){if(!this._gltfLoader){let e=await zl(()=>Promise.resolve().then(()=>Df),void 0);this._gltfLoader=new e.GLTFLoader}return this._gltfLoader}async _loadFont(e){let t=this.database.get(e);if(!t||t.type!==`font`)throw Error(`Asset "${e}" is not a font.`);let n=t.meta,r=n.family??`fc-font-${e}`;if(typeof document>`u`||typeof FontFace>`u`)return r;let i=await this.blobs.fetch(e),a=new FontFace(r,i,{weight:n.weight??`normal`,style:n.style??`normal`});return await a.load(),document.fonts.add(a),r}};function Hl(e){e.traverse(e=>{let t=e;t.geometry&&t.geometry.dispose();let n=t.material;if(Array.isArray(n))for(let e of n)e.dispose();else n?.dispose()})}var Ul=Object.freeze({low:Object.freeze({renderScale:.5,shadowMapSize:512,shadowsEnabled:!1,shadowSoftness:`none`,antialias:`none`,postProcessing:!1,maxPixelRatio:1.5}),medium:Object.freeze({renderScale:.75,shadowMapSize:1024,shadowsEnabled:!0,shadowSoftness:`pcf`,antialias:`fxaa`,postProcessing:!1,maxPixelRatio:2}),high:Object.freeze({renderScale:1,shadowMapSize:2048,shadowsEnabled:!0,shadowSoftness:`pcss`,antialias:`msaa4x`,postProcessing:!0,maxPixelRatio:2})}),Wl=`flamecore.quality.preset`,Gl=class e{events=new n;_preset;_overrides;_context;_storageKey;constructor(e={}){this._preset=e.initialPreset??`high`,this._overrides={...e.overrides??{}},this._storageKey=e.storageKey??Wl}get preset(){return this._preset}get overrides(){return{...this._overrides}}getEffectiveSettings(){return{...Ul[this._preset],...this._overrides}}attach(e){this._context=e,this._apply(`preset`)}detach(){this._context=void 0}applyProfile(e){this._preset=e,this._overrides={},this._apply(`preset`)}setOverride(e,t){this._overrides={...this._overrides,[e]:t},this._apply(`override`)}clearOverrides(){Object.keys(this._overrides).length!==0&&(this._overrides={},this._apply(`preset`))}static autoDetect(e){let t=e?.capabilities.isWebGL2??!0,n=e?.capabilities.maxTextureSize??4096,r=typeof window<`u`&&window.screen?Math.max(window.screen.width,window.screen.height)*(typeof window<`u`&&window.devicePixelRatio||1):1920;return!t||r<768?`low`:n<4096||r<1600?`medium`:`high`}autoDetectAndApply(){if(!this._context)throw Error(`QualityManager.autoDetectAndApply: no context attached`);let t=e.autoDetect(this._context.renderer);return this._preset=t,this._overrides={},this._apply(`auto`),t}saveSelection(){if(!(typeof localStorage>`u`))try{localStorage.setItem(this._storageKey,this._preset)}catch{}}loadSelection(){if(!(typeof localStorage>`u`))try{let e=localStorage.getItem(this._storageKey);if(e===`low`||e===`medium`||e===`high`)return this.applyProfile(e),e}catch{}}_apply(e){let t=this.getEffectiveSettings(),n=this._context;n&&Kl(n,t),this.events.emit(`settingsChanged`,{preset:this._preset,settings:t,source:e})}};function Kl(e,t){let n=e.renderer;n.shadowMap.enabled=t.shadowsEnabled,n.shadowMap.type=ql(t.shadowSoftness),e.setMaxPixelRatio(t.maxPixelRatio),e.renderScale=t.renderScale,e.resize()}function ql(e){switch(e){case`pcss`:return 3;case`pcf`:return 2;default:return 0}}var Jl=class{renderer;canvas;clock;assets;loader;quality;_uiOverlay;_audioContext;renderScale;_maxPixelRatio;constructor(e={}){let t=e.canvas??document.createElement(`canvas`);this.canvas=t,this.assets=e.assetDatabase??new Fl,this.loader=Vl.create(this.assets,e.blobSource??new Bl),this.renderer=new Mo({canvas:t,antialias:e.antialias??!0,alpha:e.alpha??!1,powerPreference:`high-performance`}),this.renderer.outputColorSpace=A,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=!1,this._maxPixelRatio=Math.min(2,Math.max(1,e.maxPixelRatio??2)),this.renderScale=e.renderScale??1,this.clock=new ol,this.resize(),this.quality=e.qualityManager??new Gl({initialPreset:e.qualityPreset??`high`}),this.quality.attach(this)}get maxPixelRatio(){return this._maxPixelRatio}setMaxPixelRatio(e){this._maxPixelRatio=Math.min(4,Math.max(1,e))}resize(){let e=Math.min(this._maxPixelRatio,window.devicePixelRatio||1),t=this.canvas.getBoundingClientRect(),n=Math.max(1,Math.floor(t.width||this.canvas.clientWidth||1)),r=Math.max(1,Math.floor(t.height||this.canvas.clientHeight||1));this.renderer.setPixelRatio(e*this.renderScale),this.renderer.setSize(n,r,!1)}dispose(){this.quality.detach(),this.loader.dispose(),this.renderer.dispose(),this._uiOverlay&&this._uiOverlay.parentElement&&this._uiOverlay.parentElement.removeChild(this._uiOverlay),this._uiOverlay=void 0,this._audioContext&&this._audioContext.state!==`closed`&&this._audioContext.close(),this._audioContext=void 0}get uiOverlay(){if(this._uiOverlay)return this._uiOverlay;if(typeof document>`u`)return;let e=document.createElement(`div`);e.className=`fc-ui-overlay`,e.style.position=`absolute`,e.style.inset=`0`,e.style.pointerEvents=`none`,e.style.overflow=`hidden`;let t=this.canvas.parentElement;return t&&(getComputedStyle(t).position===`static`&&(t.style.position=`relative`),t.appendChild(e)),this._uiOverlay=e,e}getAudioContext(){if(this._audioContext)return this._audioContext;let e=globalThis.AudioContext??globalThis.webkitAudioContext;if(e)return this._audioContext=new e,this._audioContext}},Yl={INPUT:10,GAMEPLAY:20,PHYSICS:30,ANIMATION:40,RENDERING:50},Xl=class{name=`GameplaySystem`;priority=Yl.GAMEPLAY;_runtime;onRegister(e){this._runtime=e}onUnregister(){this._runtime=void 0}onUpdate(e){if(this._runtime)for(let t of this._runtime.activeScenes)t.update(e)}},Zl=class{static typeName=`BaseComponent`;_props;_actor;_disposables=[];constructor(e){this._props=e}get type(){return this.constructor.typeName}get props(){return this._props}get actor(){return this._actor}onAttach(e){this._actor=e}onDetach(){for(let e of this._disposables)e.dispose();this._disposables.length=0,this._actor=void 0}onUpdate(e){}onSceneAttach(e){}onSceneDetach(e){}onEvent(e){}setProps(e){this._props={...this._props,...e},this.onPropsChanged()}onPropsChanged(){}serialize(){return{type:this.type,props:this._props}}};function Ql(e={}){return{_version:1,projection:e.projection??`perspective`,fov:e.fov??50,orthoSize:e.orthoSize??5,near:e.near??.1,far:e.far??1e3,isMain:e.isMain??!0}}var $l=class extends Zl{static typeName=`CameraComponent`;_camera;get camera(){return this._camera}onAttach(e){super.onAttach(e),this._build()}onSceneAttach(e){this._props.isMain&&(e.mainCameraActorId=this._actor?.id)}onSceneDetach(e){e.mainCameraActorId===this._actor?.id&&(e.mainCameraActorId=void 0)}onDetach(){this._camera=void 0,super.onDetach()}updateAspect(e,t){if(!this._camera)return;let n=t===0?1:e/t;if(this._camera instanceof vr)this._camera.aspect=n,this._camera.updateProjectionMatrix();else if(this._camera instanceof Hr){let e=this._props.orthoSize;this._camera.left=-e*n,this._camera.right=e*n,this._camera.top=e,this._camera.bottom=-e,this._camera.updateProjectionMatrix()}}onPropsChanged(){if(!this._actor)return;this._camera&&=(this._actor.object3D.remove(this._camera),void 0),this._build();let e=this._actor.scene;e&&this._props.isMain&&(e.mainCameraActorId=this._actor.id)}_build(){if(this._actor){if(this._props.projection===`perspective`)this._camera=new vr(this._props.fov,1,this._props.near,this._props.far);else{let e=this._props.orthoSize;this._camera=new Hr(-e,e,e,-e,this._props.near,this._props.far)}this._actor.object3D.add(this._camera)}}},eu=class extends Zl{static typeName=`InputListenerComponent`;onClick;onHoverStart;onHoverEnd;onPointerEnter;onPointerExit;onPointerDown;onPointerMove;onPointerUp;onDrag;onPinch;dispatchClick(e){this._props.click&&this.onClick?.(e)}dispatchHoverStart(){this._props.hover&&(this.onHoverStart?.(),this.onPointerEnter?.())}dispatchHoverEnd(){this._props.hover&&(this.onHoverEnd?.(),this.onPointerExit?.())}dispatchPointerDown(e){this.onPointerDown?.(e)}dispatchPointerMove(e){(this._props.hover||this._props.drag)&&this.onPointerMove?.(e)}dispatchPointerUp(e){this.onPointerUp?.(e)}dispatchDrag(e){this._props.drag&&this.onDrag?.(e)}dispatchPinch(e){this.onPinch?.(e)}},tu=class{name=`InputSystem`;priority=Yl.INPUT;_runtime;_raycaster=new jl;_ndc=new B;_hoveredActorId;_pendingEvents=[];_pendingPinches=[];_pointerDownActorId;_isDragging=!1;_pointers=new Map;_pinchStartDist=0;_pinchActorId;_onPointerDown=e=>{this._pointers.set(e.pointerId,{clientX:e.clientX,clientY:e.clientY}),this._maybeStartPinch(),this._queue(e,`down`)};_onPointerUp=e=>{this._maybeEndPinch(),this._pointers.delete(e.pointerId),this._queue(e,`up`)};_onPointerMove=e=>{this._pointers.has(e.pointerId)&&this._pointers.set(e.pointerId,{clientX:e.clientX,clientY:e.clientY}),this._maybeUpdatePinch(),this._queue(e,`move`)};onRegister(e){this._runtime=e;let t=e.context.canvas;t.addEventListener(`pointerdown`,this._onPointerDown),t.addEventListener(`pointerup`,this._onPointerUp),t.addEventListener(`pointermove`,this._onPointerMove)}onUnregister(e){let t=e.context.canvas;t.removeEventListener(`pointerdown`,this._onPointerDown),t.removeEventListener(`pointerup`,this._onPointerUp),t.removeEventListener(`pointermove`,this._onPointerMove),this._pendingEvents=[],this._runtime=void 0}onUpdate(e){if(!this._runtime)return;let t=this._pendingEvents;this._pendingEvents=[];let n=this._pendingPinches;this._pendingPinches=[];for(let e of this._runtime.activeScenes){let r=this._getMainCamera(e);if(r){if(this._pinchActorId&&n.length>0){let t=e.findActorById(this._pinchActorId)?.getComponent(eu);if(t)for(let e of n)t.dispatchPinch(e)}for(let n of t){this._ndc.set(n.ndcX,n.ndcY),this._raycaster.setFromCamera(this._ndc,r);let t=this._raycast(e);if(n.type===`down`)this._pointerDownActorId=t?.id,this._isDragging=!1,t&&t.getComponent(eu)?.dispatchPointerDown(n);else if(n.type===`up`){let e=this._pointerDownActorId;if(this._pointerDownActorId=void 0,t){let r=t.getComponent(eu);r?.dispatchPointerUp(n),e===t.id&&!this._isDragging&&r?.dispatchClick(n)}this._isDragging=!1}else n.type===`move`&&(this._updateHover(t),t&&t.getComponent(eu)?.dispatchPointerMove(n),this._pointerDownActorId&&(this._isDragging=!0,(e.findActorById(this._pointerDownActorId)?.getComponent(eu))?.dispatchDrag(n)))}}}}_queue(e,t){if(!this._runtime)return;let n=this._runtime.context.canvas.getBoundingClientRect(),r=(e.clientX-n.left)/n.width*2-1,i=-((e.clientY-n.top)/n.height*2-1);this._pendingEvents.push({ndcX:r,ndcY:i,button:e.button,type:t})}_getMainCamera(e){let t=e.mainCameraActorId;if(t)return e.findActorById(t)?.getComponent($l)?.camera}_raycast(e){let t=!1;for(let n of e.actors){let e=n.getComponent(eu);if(e&&e.props.usePhysicsCollider){t=!0;break}}if(t){let e=this._runtime?.systems.find(e=>e.name===`PhysicsSystem`);if(e?.raycast){let t=new U,n=new U;this._raycaster.ray.at(0,t),n.copy(this._raycaster.ray.direction).normalize();let r=e.raycast(t,n);if(r){let e=r.getComponent(eu);if(e&&e.props.usePhysicsCollider)return r}}}let n=this._raycaster.intersectObject(e.threeScene,!0);for(let t of n){let n=t.object;for(;n;){let t=n.userData.actorId;if(t){let n=e.findActorById(t),r=n?.getComponent(eu);if(r&&!r.props.usePhysicsCollider)return n}n=n.parent}}}_updateHover(e){let t=e?.id;if(t===this._hoveredActorId){if(e&&this._runtime){let t=e.getComponent(eu);t&&(this._runtime.context.canvas.style.cursor=t.props.cursor)}return}if(this._hoveredActorId&&this._runtime){for(let e of this._runtime.activeScenes)e.findActorById(this._hoveredActorId)?.getComponent(eu)?.dispatchHoverEnd();this._runtime.context.canvas.style.cursor=``}if(this._hoveredActorId=t,e&&this._runtime){let t=e.getComponent(eu);t?.dispatchHoverStart(),t&&(this._runtime.context.canvas.style.cursor=t.props.cursor)}}_maybeStartPinch(){this._pointers.size===2&&(this._pinchStartDist=this._currentPointerDistance(),this._pinchActorId=this._pointerDownActorId,this._pendingPinches.push({scale:1,...this._currentPinchCenterNdc(),phase:`start`}))}_maybeUpdatePinch(){if(this._pointers.size!==2||this._pinchStartDist<=0)return;let e=this._currentPointerDistance();this._pendingPinches.push({scale:e/this._pinchStartDist,...this._currentPinchCenterNdc(),phase:`move`})}_maybeEndPinch(){if(this._pointers.size!==2||this._pinchStartDist<=0)return;let e=this._currentPointerDistance();this._pendingPinches.push({scale:e/this._pinchStartDist,...this._currentPinchCenterNdc(),phase:`end`}),this._pinchStartDist=0,this._pinchActorId=void 0}_currentPointerDistance(){let e=this._pointers.values(),t=e.next().value,n=e.next().value;if(!t||!n)return 0;let r=t.clientX-n.clientX,i=t.clientY-n.clientY;return Math.sqrt(r*r+i*i)}_currentPinchCenterNdc(){let e=this._runtime?.context.canvas;if(!e)return{centerNdcX:0,centerNdcY:0};let t=this._pointers.values(),n=t.next().value,r=t.next().value;if(!n||!r)return{centerNdcX:0,centerNdcY:0};let i=(n.clientX+r.clientX)/2,a=(n.clientY+r.clientY)/2,o=e.getBoundingClientRect();return{centerNdcX:(i-o.left)/o.width*2-1,centerNdcY:-((a-o.top)/o.height*2-1)}}},nu=class extends Zl{static typeName=`LODComponent`;_currentLevel=-1;_forcedLevel=-1;_fadeAlpha=1;_prevFadeAlpha=0;_prevLevel=-1;_root;_levelRoots=[];_loadTokens=[];get currentLevel(){return this._currentLevel}get forcedLevel(){return this._forcedLevel}get levelCount(){return this._props.levels.length}get hysteresis(){return this._props.hysteresis}get root(){return this._root}getMaxDistance(e){let t=this._props.levels;return t.length===0||e>=t.length?1/0:t[e].maxDistance}setForcedLevel(e){this._forcedLevel=Math.max(-1,Math.min(this._props.levels.length-1,e)),this._forcedLevel>=0&&this.switchToLevel(this._forcedLevel,!0)}onAttach(e){super.onAttach(e),this._build()}onSceneAttach(e){super.onSceneAttach(e),this._loadAllLevels(e)}onDetach(){this._invalidateLoads(),this._root&&=(this._root.removeFromParent(),void 0),this._levelRoots.length=0,super.onDetach()}onPropsChanged(){if(!this._actor)return;this._invalidateLoads(),this._root&&=(this._root.removeFromParent(),void 0),this._levelRoots.length=0,this._currentLevel=-1,this._prevLevel=-1,this._build();let e=this._actor.scene;e&&this._loadAllLevels(e)}switchToLevel(e,t=!1){if(e===this._currentLevel)return;let n=this._props.levels;if(n.length===0)return;let r=Math.max(0,Math.min(n.length-1,e));!t&&this._props.fadeMode===`fade`&&this._props.fadeDuration>0&&this._currentLevel>=0?(this._prevLevel=this._currentLevel,this._prevFadeAlpha=this._fadeAlpha,this._fadeAlpha=0):(this._prevLevel=-1,this._prevFadeAlpha=0,this._fadeAlpha=1),this._currentLevel=r,this._applyVisibility()}tickFade(e){if(this._prevLevel<0){this._fadeAlpha<1&&(this._fadeAlpha=Math.min(1,this._fadeAlpha+e/Math.max(.001,this._props.fadeDuration)),this._applyOpacity());return}let t=e/Math.max(.001,this._props.fadeDuration);this._fadeAlpha=Math.min(1,this._fadeAlpha+t),this._prevFadeAlpha=Math.max(0,this._prevFadeAlpha-t),this._fadeAlpha>=1&&this._prevFadeAlpha<=0&&(this._prevLevel=-1,this._prevFadeAlpha=0),this._applyOpacity()}_build(){if(!this._actor)return;let e=new Eo;e.name=`LOD`,this._actor.object3D.add(e),this._root=e,this._levelRoots.length=this._props.levels.length,this._loadTokens=Array(this._props.levels.length).fill(0);for(let t=0;t<this._props.levels.length;t++){let n=new Eo;n.name=`LOD_L${t}`,n.visible=!1,e.add(n),this._levelRoots[t]=n}}async _loadAllLevels(e){let t=e.runtime?.context.loader;if(!t)return;let n=this._props.levels;for(let e=0;e<n.length;e++){let r=n[e],i=this._levelRoots[e];if(!i)continue;let a=++this._loadTokens[e];if(r.meshAssetId)try{let n=await t.loadMesh(r.meshAssetId);if(a!==this._loadTokens[e]||!this._levelRoots[e])return;let o=n.clone(!0);for(let e of[...i.children])i.remove(e);i.add(o)}catch{}}}_invalidateLoads(){for(let e=0;e<this._loadTokens.length;e++)this._loadTokens[e]++}_applyVisibility(){for(let e=0;e<this._levelRoots.length;e++){let t=this._levelRoots[e];if(!t)continue;let n=e===this._currentLevel,r=e===this._prevLevel;t.visible=n||r}this._applyOpacity()}_applyOpacity(){let e=this._props.fadeMode===`fade`;for(let t=0;t<this._levelRoots.length;t++){let n=this._levelRoots[t];if(!n)continue;let r=t===this._currentLevel?this._fadeAlpha:t===this._prevLevel?this._prevFadeAlpha:1;n.traverse(t=>{let n=t.material;if(!n)return;let i=t=>{e?(t.userData.__lodOriginallyTransparent===void 0&&(t.userData.__lodOriginallyTransparent=t.transparent),t.transparent=!0,t.opacity=r):(t.transparent=t.userData.__lodOriginallyTransparent??!1,t.opacity=1)};Array.isArray(n)?n.forEach(i):i(n)})}}},ru=class{name=`RenderingSystem`;priority=Yl.RENDERING;_runtime;_clearColor=new G;_overrideCamera;onRegister(e){this._runtime=e}onUnregister(){this._runtime=void 0}setOverrideCamera(e){this._overrideCamera=e??void 0}get overrideCamera(){return this._overrideCamera}onUpdate(e){if(!this._runtime)return;let{renderer:t}=this._runtime.context,n=[...this._runtime.activeScenes].filter(e=>!e.nested).sort((e,t)=>e.renderOrder-t.renderOrder);if(n.length===0){t.clear(!0,!0,!1);return}for(let e=0;e<n.length;e++){let r=n[e],i=this._getMainCamera(r);i&&(this._applySettings(r,e===0),t.autoClear=!1,(e===0||r.settings.clearColor||r.settings.clearDepth)&&t.clear(r.settings.clearColor,r.settings.clearDepth,!1),t.render(r.threeScene,i))}}_applySettings(e,t){let{renderer:n}=this._runtime.context,{background:r,fog:i}=e.settings;t&&r?(this._clearColor.set(r),n.setClearColor(this._clearColor,1),e.threeScene.background=this._clearColor.clone()):t&&r===null&&(n.setClearAlpha(0),e.threeScene.background=null),i?e.threeScene.fog=new Po(i.color,i.near,i.far):e.threeScene.fog=null}_getMainCamera(e){if(this._overrideCamera)return this._overrideCamera;let t=e.mainCameraActorId;if(t)return e.findActorById(t)?.getComponent($l)?.camera}},iu=new U,au=new U,ou=class{name=`LODSystem`;priority=15;_runtime;_debugEnabled=!1;onRegister(e){this._runtime=e}onUnregister(){this._runtime=void 0}set debugEnabled(e){this._debugEnabled=e}get debugEnabled(){return this._debugEnabled}onUpdate(e){if(this._runtime)for(let t of this._runtime.activeScenes)this._updateScene(t,e)}_updateScene(e,t){let n=this._resolveCamera(e);if(!n){cu(e,(e,n)=>n.tickFade(t));return}n.getWorldPosition(iu),cu(e,(e,n)=>{if(n.tickFade(t),n.forcedLevel>=0)return;e.object3D.getWorldPosition(au);let r=su(n,au.distanceTo(iu));r!==n.currentLevel&&n.switchToLevel(r)})}_resolveCamera(e){let t=this._runtime?.getSystem(ru)?.overrideCamera;if(t)return t;let n=e.mainCameraActorId;if(n)return e.findActorById(n)?.getComponent($l)?.camera}};function su(e,t){let n=e.levelCount;if(n===0)return-1;let r=e.currentLevel,i=Math.max(0,e.hysteresis);for(let a=0;a<n;a++){let n=e.getMaxDistance(a);if(t<=(r>a?n-i:n))return a}return n-1}function cu(e,t){for(let n of e.actors){if(n.isDestroyed)continue;let e=n.getComponent(nu);e&&t(n,e),lu(n,t)}}function lu(e,t){for(let n of e.children){let e=n.getComponent(nu);e&&t(n,e),lu(n,t)}}var uu=class extends n{},du;async function fu(){if(du)return du;let e=await zl(()=>import(`./rapier.es-DRO1-9xe.js`),[]);return await e.init(),du=e,du}var pu=class{name=`PhysicsSystem`;priority=Yl.PHYSICS;_runtime;_world;_rapier;_loaded=!1;_loading=!1;_accumulator=0;_fixedDt=1/60;_debugEnabled=!1;_debugLines;_eventQueue;events=new uu;_activePairs=new Map;_stats={bodies:0,colliders:0,constraints:0,stepTimeMs:0};set debugEnabled(e){this._debugEnabled=e,!e&&this._debugLines&&(this._debugLines.parent?.remove(this._debugLines),this._debugLines.geometry.dispose(),this._debugLines.material.dispose(),this._debugLines=void 0)}get debugEnabled(){return this._debugEnabled}onRegister(e){this._runtime=e}onUnregister(e){this._world&&=(this._world.free(),void 0),this._eventQueue&&=(this._eventQueue.free(),void 0),this._activePairs.clear(),this.events.clear(),this._debugLines&&=(this._debugLines.parent?.remove(this._debugLines),this._debugLines.geometry.dispose(),this._debugLines.material.dispose(),void 0),this._rapier=void 0,this._loaded=!1,this._runtime=void 0}async onUpdate(e){if(!this._runtime||!this._checkNeedsPhysics())return;if(!this._loaded&&!this._loading){this._loading=!0;try{this._rapier=await fu(),this._world=new this._rapier.World({x:0,y:-9.81,z:0}),this._eventQueue=new this._rapier.EventQueue(!0),this._loaded=!0}catch(e){console.error(`[PhysicsSystem] Failed to load Rapier WASM:`,e),this._loading=!1;return}this._loading=!1}if(!this._loaded||!this._world||!this._rapier)return;for(let e of this._runtime.activeScenes)this._syncBodies(e);for(let e of this._runtime.activeScenes)this._syncConstraints(e);let t=typeof performance<`u`?performance.now():Date.now(),n=!1;for(this._accumulator+=e;this._accumulator>=this._fixedDt;)this._world.step(this._eventQueue),this._drainEvents(),this._accumulator-=this._fixedDt,n=!0;if(n){let e=typeof performance<`u`?performance.now():Date.now();this._emitStayEvents(),this._stats={bodies:this._world.bodies.len(),colliders:this._world.colliders.len(),constraints:this._world.impulseJoints.len(),stepTimeMs:e-t}}for(let e of this._runtime.activeScenes)this._syncTransforms(e);this._debugEnabled&&this._updateDebugVisualization()}applyImpulse(e,t,n,r){if(!this._world||!this._rapier||e._bodyHandle===void 0)return;let i=this._world.getRigidBody(e._bodyHandle);!i||i.bodyType()!==this._rapier.RigidBodyType.Dynamic||i.applyImpulse({x:t,y:n,z:r},!0)}applyForce(e,t,n,r){if(!this._world||!this._rapier||e._bodyHandle===void 0)return;let i=this._world.getRigidBody(e._bodyHandle);!i||i.bodyType()!==this._rapier.RigidBodyType.Dynamic||i.addForce({x:t,y:n,z:r},!0)}applyTorqueImpulse(e,t,n,r){if(!this._world||!this._rapier||e._bodyHandle===void 0)return;let i=this._world.getRigidBody(e._bodyHandle);!i||i.bodyType()!==this._rapier.RigidBodyType.Dynamic||i.applyTorqueImpulse({x:t,y:n,z:r},!0)}getLinearVelocity(e){if(!this._world||e._bodyHandle===void 0)return[0,0,0];let t=this._world.getRigidBody(e._bodyHandle);if(!t)return[0,0,0];let n=t.linvel();return[n.x,n.y,n.z]}setLinearVelocity(e,t,n,r){if(!this._world||e._bodyHandle===void 0)return;let i=this._world.getRigidBody(e._bodyHandle);i&&i.setLinvel({x:t,y:n,z:r},!0)}getAngularVelocity(e){if(!this._world||e._bodyHandle===void 0)return[0,0,0];let t=this._world.getRigidBody(e._bodyHandle);if(!t)return[0,0,0];let n=t.angvel();return[n.x,n.y,n.z]}setAngularVelocity(e,t,n,r){if(!this._world||e._bodyHandle===void 0)return;let i=this._world.getRigidBody(e._bodyHandle);i&&i.setAngvel({x:t,y:n,z:r},!0)}raycast(e,t,n=1e3){if(!this._world||!this._rapier||!this._runtime)return;let r=new this._rapier.Ray(e,t),i=this._world.castRay(r,n,!0);if(!i)return;let a=i.colliderHandle;if(a===void 0)return;let o=this._world.getCollider(a);if(!o)return;let s=o.parent()?.handle;if(s!==void 0)for(let e of this._runtime.activeScenes)for(let t of e.actors){let e=t.getComponent({typeName:`PhysicsBodyComponent`});if(e&&e._bodyHandle===s)return t}}raycastHit(e,t,n=1e3){if(!this._world||!this._rapier||!this._runtime)return;let r=t.clone().normalize(),i=new this._rapier.Ray(e,r),a=this._world.castRayAndGetNormal(i,n,!0);if(!a)return;let o=a.colliderHandle;if(o===void 0)return;let s=this._findActorByColliderHandle(o);if(!s)return;let c=a.timeOfImpact,l=[e.x+r.x*c,e.y+r.y*c,e.z+r.z*c],u=a.normal;return{actor:s,distance:c,point:l,normal:[u.x,u.y,u.z]}}getStats(){return this._stats}_drainEvents(){!this._eventQueue||!this._world||this._eventQueue.drainCollisionEvents((e,t,n)=>{let r=this._world?.getCollider(e),i=this._world?.getCollider(t),a=(r?.isSensor()??!1)||(i?.isSensor()??!1),o=mu(e,t);n?(this._activePairs.set(o,{a:e,b:t,trigger:a}),this._dispatchPair(e,t,a?`onTriggerEnter`:`onCollisionEnter`)):(this._activePairs.delete(o),this._dispatchPair(e,t,a?`onTriggerExit`:`onCollisionExit`))})}_emitStayEvents(){if(this._activePairs.size!==0)for(let{a:e,b:t,trigger:n}of this._activePairs.values())n||this._dispatchPair(e,t,`onCollisionStay`)}_dispatchPair(e,t,n){let r=this._findActorByColliderHandle(e),i=this._findActorByColliderHandle(t);!r||!i||(r.dispatchEvent({name:n,payload:{self:r,other:i}}),i.dispatchEvent({name:n,payload:{self:i,other:r}}),this.events.emit(n,{self:r,other:i}))}_findActorByColliderHandle(e){if(!this._world||!this._runtime)return;let t=this._world.getCollider(e)?.parent()?.handle;if(t!==void 0)for(let e of this._runtime.activeScenes)for(let n of e.actors){let e=n.getComponent({typeName:`PhysicsBodyComponent`});if(e&&e._bodyHandle===t)return n}}_syncConstraints(e){if(!(!this._world||!this._rapier))for(let t of e.actors){let n=t.getComponent({typeName:`PhysicsConstraintComponent`});if(!n||n._jointHandle!==void 0)continue;let r=n.props,i=r.bodyA?e.findActorById(r.bodyA):t,a=r.bodyB?e.findActorById(r.bodyB):void 0,o=i?.getComponent({typeName:`PhysicsBodyComponent`}),s=a?.getComponent({typeName:`PhysicsBodyComponent`});if(o?._bodyHandle===void 0||s?._bodyHandle===void 0)continue;let c=this._world.getRigidBody(o._bodyHandle),l=this._world.getRigidBody(s._bodyHandle);if(!c||!l)continue;let u={x:r.anchorA[0],y:r.anchorA[1],z:r.anchorA[2]},d={x:r.anchorB[0],y:r.anchorB[1],z:r.anchorB[2]},f={x:r.axis[0],y:r.axis[1],z:r.axis[2]},p;switch(r.type){case`hinge`:p=this._rapier.JointData.revolute(u,d,f);break;case`slider`:p=this._rapier.JointData.prismatic(u,d,f);break;default:p=this._rapier.JointData.fixed(u,{x:0,y:0,z:0,w:1},d,{x:0,y:0,z:0,w:1});break}r.enableLimits&&r.type!==`fixed`&&(p.limitsEnabled=!0,p.limits=[r.limitMin,r.limitMax]),n._jointHandle=this._world.createImpulseJoint(p,c,l,!0).handle}}_checkNeedsPhysics(){if(!this._runtime)return!1;for(let e of this._runtime.activeScenes)for(let t of e.actors)if(t.getComponent({typeName:`PhysicsBodyComponent`}))return!0;return!1}_syncBodies(e){if(!(!this._world||!this._rapier))for(let t of e.actors){let e=t.getComponent({typeName:`PhysicsBodyComponent`});e&&(e._bodyHandle===void 0||e._colliderHandle===void 0)&&this._createBody(e,t)}}_createBody(e,t){if(!this._world||!this._rapier)return;this._destroyBody(e);let n=e.props,r=t.getComponent({typeName:`TransformComponent`}),i=r?.props?.position??[0,0,0],a=r?.props?.rotation??[0,0,0],o;switch(n.bodyType){case`static`:o=this._rapier.RigidBodyDesc.fixed();break;case`kinematic`:o=this._rapier.RigidBodyDesc.kinematicPositionBased();break;default:o=this._rapier.RigidBodyDesc.dynamic();break}o.setTranslation(i[0],i[1],i[2]);let s=new Vt(a[0],a[1],a[2],`XYZ`),c=new nt().setFromEuler(s);o.setRotation({x:c.x,y:c.y,z:c.z,w:c.w}),n.bodyType===`dynamic`&&(o.setLinearDamping(n.linearDamping),o.setAngularDamping(n.angularDamping),o.setGravityScale(n.gravityScale),(n.lockRotationX||n.lockRotationY||n.lockRotationZ)&&o.lockRotations());let l=this._world.createRigidBody(o);e._bodyHandle=l.handle;let u;switch(n.shape){case`sphere`:u=this._rapier.ColliderDesc.ball(n.size[0]);break;case`capsule`:u=this._rapier.ColliderDesc.capsule(n.size[1]/2,n.size[0]);break;case`cylinder`:u=this._rapier.ColliderDesc.cylinder(n.size[1]/2,n.size[0]);break;case`plane`:u=this._rapier.ColliderDesc.cuboid(n.size[0],.01,n.size[2]);break;default:u=this._rapier.ColliderDesc.cuboid(n.size[0]/2,n.size[1]/2,n.size[2]/2);break}u.setMass(n.mass),u.setFriction(n.friction),u.setRestitution(n.restitution);let d=(n.collisionLayer??1)&65535,f=(n.collisionMask??65535)&65535;u.setCollisionGroups(d<<16|f),n.isTrigger&&u.setSensor(!0),u.setActiveEvents(this._rapier.ActiveEvents.COLLISION_EVENTS),e._colliderHandle=this._world.createCollider(u,l).handle}_destroyBody(e){if(this._world){if(e._colliderHandle!==void 0){let t=this._world.getCollider(e._colliderHandle);t&&this._world.removeCollider(t,!0),e._colliderHandle=void 0}if(e._bodyHandle!==void 0){let t=this._world.getRigidBody(e._bodyHandle);t&&this._world.removeRigidBody(t),e._bodyHandle=void 0}}}_syncTransforms(e){if(!(!this._world||!this._rapier))for(let t of e.actors){let e=t.getComponent({typeName:`PhysicsBodyComponent`});if(!e||e._bodyHandle===void 0)continue;let n=this._world.getRigidBody(e._bodyHandle);if(!n)continue;let r=n.bodyType();if(r!==this._rapier.RigidBodyType.Dynamic&&r!==this._rapier.RigidBodyType.KinematicPositionBased)continue;let i=t.getComponent({typeName:`TransformComponent`});if(!i)continue;let a=n.translation(),o=n.rotation();i.setProps({position:[a.x,a.y,a.z],rotation:[Math.atan2(2*(o.w*o.x+o.y*o.z),1-2*(o.x*o.x+o.y*o.y)),Math.asin(2*(o.w*o.y-o.z*o.x)),Math.atan2(2*(o.w*o.z+o.x*o.y),1-2*(o.y*o.y+o.z*o.z))]})}}_updateDebugVisualization(){if(!this._world||!this._runtime)return;let e=this._world.debugRender();if(!e||!e.vertices||e.vertices.length===0)return;let t=this._runtime.activeScenes[0];if(!t)return;if(!this._debugLines){let e=new Hn,n=new ls({color:65280,linewidth:1,transparent:!0,opacity:.7});this._debugLines=new vs(e,n),this._debugLines.frustumCulled=!1,t.threeScene.add(this._debugLines)}let n=new Float32Array(e.vertices);if(this._debugLines.geometry.setAttribute(`position`,new jn(n,3)),this._debugLines.geometry.computeBoundingSphere(),e.colors&&e.colors.length>0){let t=new Float32Array(e.colors);this._debugLines.geometry.setAttribute(`color`,new jn(t,4)),this._debugLines.material.vertexColors=!0}}};function mu(e,t){return e<t?`${e}:${t}`:`${t}:${e}`}var hu=[`#FF6B35`,`#F7B538`,`#3DCCC7`,`#9D8DF1`,`#FF61A6`,`#42B883`,`#5BC0EB`,`#FF8AAB`];function gu(e){if(e===void 0||typeof e==`number`)return`number`;if(typeof e==`string`)return`string`;if(typeof e==`boolean`)return`boolean`;if(Array.isArray(e)){let t=e.length;if(t===2)return`vec2`;if(t===3)return`vec3`;if(t===4)return`vec4`}if(typeof e==`object`&&e){if(`w`in e&&`x`in e)return`quaternion`;if(`r`in e)return`color`}return`number`}function _u(e){if(e._version===2)return e;let t=e,n=Date.now();return{_version:2,id:t.id,name:t.name,duration:t.duration,frameRate:30,tracks:t.tracks.map((e,n)=>({id:`track-${t.id}-${n}`,targetActorId:e.targetActorId,targetActorName:``,descriptor:{componentType:e.targetComponentType,propertyPath:e.targetProperty,valueType:gu(e.keyframes[0]?.value),label:e.targetProperty},keyframes:e.keyframes.map((e,r)=>({id:`kf-${t.id}-${n}-${r}`,time:e.time,value:e.value,easing:e.easing})),enabled:!0,locked:!1,color:hu[n%hu.length],targetComponentType:e.targetComponentType,targetProperty:e.targetProperty})),markers:[],tags:[],createdAt:n,modifiedAt:n}}var vu=Math.PI*2,yu=1.70158,bu=yu*1.525,xu=e=>Math.max(0,Math.min(1,e));function Su(e,t,n){switch(e=xu(e),t){case`linear`:return e;case`easeIn`:return e*e;case`easeOut`:return e*(2-e);case`easeInOut`:return e<.5?2*e*e:-1+(4-2*e)*e;case`easeInCubic`:return e*e*e;case`easeOutCubic`:{let t=e-1;return t*t*t+1}case`easeInOutCubic`:return e<.5?4*e*e*e:1+(e-1)*(2*(e-1))*(2*(e-1));case`cubic`:return e<.5?4*e*e*e:1+(e-1)*(2*(e-1))*(2*(e-1));case`easeInBack`:return 2.70158*e*e*e-yu*e*e;case`easeOutBack`:{let t=e-1;return 1+2.70158*t*t*t+yu*t*t}case`easeInOutBack`:return e<.5?(2*e)**2*(3.5949095*2*e-bu)/2:((2*e-2)**2*(3.5949095*(e*2-2)+bu)+2)/2;case`easeOutBounce`:return Cu(e);case`easeInBounce`:return 1-Cu(1-e);case`easeInElastic`:return e===0||e===1?e:-(2**(10*e-10))*Math.sin((e*10-10.75)*vu/3);case`easeOutElastic`:return e===0||e===1?e:2**(-10*e)*Math.sin((e*10-.75)*vu/3)+1;case`step`:return e<1?0:1;case`stepStart`:return+(e>0);case`stepEnd`:return+(e>=1);case`custom`:return n?wu(e,n.cp1[0],n.cp1[1],n.cp2[0],n.cp2[1]):e;default:return e}}function Cu(e){let t=7.5625,n=2.75;if(e<1/n)return t*e*e;if(e<2/n){let r=e-1.5/n;return t*r*r+.75}if(e<2.5/n){let r=e-2.25/n;return t*r*r+.9375}let r=e-2.625/n;return t*r*r+.984375}function wu(e,t,n,r,i){if(e<=0)return 0;if(e>=1)return 1;let a=e;for(let n=0;n<8;n++){let n=Tu(a,t,r)-e;if(Math.abs(n)<1e-6)break;let i=Du(a,t,r);if(Math.abs(i)<1e-6)break;a-=n/i}return a=Math.max(0,Math.min(1,a)),Eu(a,n,i)}function Tu(e,t,n){let r=1-e;return 3*r*r*e*t+3*r*e*e*n+e*e*e}function Eu(e,t,n){let r=1-e;return 3*r*r*e*t+3*r*e*e*n+e*e*e}function Du(e,t,n){let r=1-e;return 3*r*r*t+6*r*e*(n-t)+3*e*e*(1-n)}function Ou(e,t,n){return e+(t-e)*n}function ku(e,t,n,r){switch(r){case`number`:return Ou(e,t,n);case`vec2`:return Au(e,t,n);case`vec3`:return ju(e,t,n);case`vec4`:return Mu(e,t,n);case`color`:return Nu(e,t,n);case`quaternion`:return Pu(e,t,n);case`string`:case`boolean`:return n<.5?e:t;default:return n<.5?e:t}}function Au(e,t,n){return[Ou(e[0],t[0],n),Ou(e[1],t[1],n)]}function ju(e,t,n){return[Ou(e[0],t[0],n),Ou(e[1],t[1],n),Ou(e[2],t[2],n)]}function Mu(e,t,n){return[Ou(e[0],t[0],n),Ou(e[1],t[1],n),Ou(e[2],t[2],n),Ou(e[3],t[3],n)]}function Nu(e,t,n){if(Array.isArray(e)&&Array.isArray(t)){let r=Math.min(e.length,t.length),i=Array(r);for(let a=0;a<r;a++)i[a]=Ou(e[a],t[a],n);return i}let r=e,i=t;return{r:Ou(r.r??0,i.r??0,n),g:Ou(r.g??0,i.g??0,n),b:Ou(r.b??0,i.b??0,n),a:Ou(r.a??1,i.a??1,n)}}function Pu(e,t,n){let{x:r,y:i,z:a,w:o}=t,s=e.x*r+e.y*i+e.z*a+e.w*o;if(s<0&&(s=-s,r=-r,i=-i,a=-a,o=-o),s>.9995){let t=e.x+n*(r-e.x),s=e.y+n*(i-e.y),c=e.z+n*(a-e.z),l=e.w+n*(o-e.w),u=Math.hypot(t,s,c,l)||1;return{x:t/u,y:s/u,z:c/u,w:l/u}}let c=Math.acos(Math.min(1,s)),l=Math.sin(c),u=Math.sin((1-n)*c)/l,d=Math.sin(n*c)/l;return{x:e.x*u+r*d,y:e.y*u+i*d,z:e.z*u+a*d,w:e.w*u+o*d}}function Fu(e){if(e.length===0)return;if(e.length===1)return e[0].value;e.sort((e,t)=>e.layer-t.layer);let t=e[0].value;e[0].valueType;for(let n=1;n<e.length;n++){let r=e[n],i=Iu(r.weight);i<=0||(t=r.additive?Lu(t,r.value,r.valueType,i):ku(t,r.value,i,r.valueType),r.valueType)}return t}var Iu=e=>Math.max(0,Math.min(1,e));function Lu(e,t,n,r){switch(n){case`number`:return e+t*r;case`vec2`:{let n=e,i=t;return[n[0]+i[0]*r,n[1]+i[1]*r]}case`vec3`:{let n=e,i=t;return[n[0]+i[0]*r,n[1]+i[1]*r,n[2]+i[2]*r]}case`vec4`:{let n=e,i=t;return[n[0]+i[0]*r,n[1]+i[1]*r,n[2]+i[2]*r,n[3]+i[3]*r]}case`color`:{if(Array.isArray(e)&&Array.isArray(t))return e.map((e,n)=>e+t[n]*r);let n=e,i=t;return{r:n.r+i.r*r,g:n.g+i.g*r,b:n.b+i.b*r,a:n.a+i.a*r}}case`quaternion`:{let n=e,i=t,a=n.x+i.x*r,o=n.y+i.y*r,s=n.z+i.z*r,c=n.w+i.w*r,l=Math.hypot(a,o,s,c)||1;return{x:a/l,y:o/l,z:s/l,w:c/l}}default:return e}}var Ru=class{name=`AnimationSystem`;priority=40;events=new n;_runtime;_activePlayers=new Set;_assetDatabase;_mixBuckets=new Map;_lastTimeByPlayer=new WeakMap;onRegister(e){this._runtime=e,this._assetDatabase=e.context.assets}onUnregister(){this._runtime=void 0,this._activePlayers.clear(),this._mixBuckets.clear()}registerPlayer(e){this._activePlayers.add(e)}unregisterPlayer(e){this._activePlayers.delete(e),this._lastTimeByPlayer.delete(e)}setAssetDatabase(e){this._assetDatabase=e}onUpdate(e){if(this._runtime){this._mixBuckets.clear();for(let e of this._activePlayers){if(e.state!==`playing`)continue;let t=this._loadClip(e.props.clipId);t&&(e.clipDuration!==t.duration&&(e.clipDuration=t.duration),this._collectClipContributions(t,e),this._dispatchMarkers(t,e))}this._applyMixedContributions()}}previewClipAt(e,t,n){let r=this._loadClip(e);if(r){this._mixBuckets.clear();for(let e of r.tracks){if(!e.enabled||e.keyframes.length===0)continue;let n=this._evaluateTrack(e,t);n!==void 0&&this._addContribution(e,n,1,0,!1)}this._applyMixedContributions()}}_loadClip(e){if(!e||!this._assetDatabase)return;let t=this._assetDatabase.get(e);if(!t||t.type!==`animation-clip`||!t.inline)return;let n=t.inline;if(n._version!==2){let e=_u(n);Object.assign(n,e)}return n}_collectClipContributions(e,t){for(let n of e.tracks){if(!n.enabled||n.keyframes.length===0)continue;let e=this._evaluateTrack(n,t.time);e!==void 0&&this._addContribution(n,e,t.weight,t.layer,t.additive)}}_addContribution(e,t,n,r,i){let a=e.descriptor.componentType,o=e.descriptor.propertyPath,s=`${e.targetActorId}|${a}|${o}`,c=this._mixBuckets.get(s);c||(c=[],this._mixBuckets.set(s,c)),c.push({layer:r,weight:n,valueType:e.descriptor.valueType,value:t,additive:i})}_applyMixedContributions(){let e=this._runtime?.activeScenes??[];for(let[t,n]of this._mixBuckets){let r=Fu(n);if(r===void 0)continue;let[i,a,o]=t.split(`|`),s=this._findActor(e,i);if(!s)continue;let c=s.components.find(e=>e.type===a);c&&this._setPropertyByPath(c,o,r)}}_findActor(e,t){for(let n of e){let e=n.findActorById(t);if(e)return e}}_dispatchMarkers(e,t){if(e.markers.length===0)return;let n=this._lastTimeByPlayer.get(t)??t.time,r=t.time;if(this._lastTimeByPlayer.set(t,r),!(r<=n))for(let i of e.markers)i.time>n&&i.time<=r&&(this.events.emit(`markerReached`,{player:t,marker:i}),i.eventName&&t.onMarker&&t.onMarker(i))}_evaluateTrack(e,t){let{keyframes:n,descriptor:r}=e;if(n.length!==0){if(t<=n[0].time)return n[0].value;if(t>=n[n.length-1].time)return n[n.length-1].value;for(let e=0;e<n.length-1;e++){let i=n[e],a=n[e+1];if(t>=i.time&&t<=a.time){let e=a.time-i.time,n=zu(Su(e>0?(t-i.time)/e:0,i.easing,i.bezierHandles));return ku(i.value,a.value,n,r.valueType)}}}}_setPropertyByPath(e,t,n){let r=t.split(`.`);if(r.length===1){let t=r[0];if(!(t in e.props))return;e.setProps({[t]:n});return}let i=r[0],a=e.props[i];if(a==null)return;let o=this._deepClone(a),s=o;for(let e=1;e<r.length-1;e++){let t=s[r[e]];if(t==null)return;s=t}let c=r[r.length-1];if(Array.isArray(s)){let e=parseInt(c,10);if(Number.isNaN(e)||e<0||e>=s.length)return;s[e]=n}else{if(!(c in s))return;s[c]=n}e.setProps({[i]:o})}_deepClone(e){return typeof structuredClone==`function`?structuredClone(e):JSON.parse(JSON.stringify(e))}};function zu(e){return Math.max(0,Math.min(1,e))}var Bu=class{name=`AudioSystem`;priority=Yl.PHYSICS+5;_runtime;_listener;_components=new Set;_resumeListenerInstalled=!1;_masterVolume=1;get listener(){return this._listener}get masterVolume(){return this._masterVolume}setMasterVolume(e){this._masterVolume=Math.max(0,Math.min(1,e)),this._listener&&this._listener.setMasterVolume(this._masterVolume)}onRegister(e){this._runtime=e}onUnregister(){for(let e of[...this._components])this.unregister(e);this._components.clear(),this._listener&&=(this._listener.removeFromParent(),void 0),this._runtime=void 0}register(e){this._components.add(e),this._ensureListener(),this._listener&&e._bindListener(this._listener),this._loadBufferFor(e)}unregister(e){this._components.delete(e)}onUpdate(e){if(this._runtime&&this._listener)for(let e of this._runtime.activeScenes){let t=e.mainCameraActorId;if(!t)continue;let n=e.findActorById(t)?.getComponent($l)?.camera;n&&this._listener.parent!==n&&(this._listener.removeFromParent(),n.add(this._listener));break}}reloadBufferFor(e){this._loadBufferFor(e)}_ensureListener(){this._listener||!this._runtime||(globalThis.AudioContext??globalThis.webkitAudioContext)&&(this._listener=new fl,this._listener.setMasterVolume(this._masterVolume),this._installResumeOnGesture())}_installResumeOnGesture(){if(this._resumeListenerInstalled||typeof document>`u`)return;let e=()=>{let e=this._listener?.context;e&&e.state!==`running`&&e.resume();for(let e of this._components)e.audio&&e.audio.buffer&&e.props.autoplay&&!e.isPlaying&&e.play()};document.addEventListener(`pointerdown`,e,{once:!1,passive:!0}),document.addEventListener(`keydown`,e,{once:!1,passive:!0}),document.addEventListener(`touchstart`,e,{once:!1,passive:!0}),this._resumeListenerInstalled=!0}_loadBufferFor(e){if(!this._runtime||!this._listener)return;let t=e.props.audioAssetId;if(!t)return;let n=e._newBufferToken(),r=this._listener.context;this._runtime.context.loader.loadAudioBuffer(t,r).then(t=>{e._bindBuffer(t,n)}).catch(()=>{})}},Vu=class{name=`UISystem`;priority=Yl.ANIMATION+5;onRegister(e){e.context.uiOverlay}onUnregister(){}onUpdate(e){}},Hu=class{name=`ParticleSystem`;priority=Yl.ANIMATION+5;_components=new Set;onRegister(e){}onUnregister(){this._components.clear()}register(e){this._components.add(e)}unregister(e){this._components.delete(e)}onUpdate(e){if(this._components.size!==0)for(let t of this._components)t._tick(e)}getStats(){let e=0;for(let t of this._components)e+=t.liveParticleCount;return{components:this._components.size,liveParticles:e}}},Uu=`0.1.0`,Wu=class e{context;events=new n;version=Uu;maxDeltaTime;sceneResolver;particleResolver;setSceneResolver(e){this.sceneResolver=e}setParticleResolver(e){this.particleResolver=e}_systems=[];_scenes=new Set;_running=!1;_rafHandle=0;_lastTime=0;_resizeObserver;_onWindowResize;constructor(e){this.context=new Jl(e),this.maxDeltaTime=e.maxDeltaTime??1/15,this._onWindowResize=()=>this._handleResize(),window.addEventListener(`resize`,this._onWindowResize),typeof ResizeObserver<`u`&&(this._resizeObserver=new ResizeObserver(()=>this._handleResize()),this._resizeObserver.observe(this.context.canvas))}static create(t={}){let n=new e(t);return n.registerSystem(new tu),n.registerSystem(new ou),n.registerSystem(new Xl),n.registerSystem(new pu),n.registerSystem(new Bu),n.registerSystem(new Ru),n.registerSystem(new Hu),n.registerSystem(new Vu),n.registerSystem(new ru),n}get isRunning(){return this._running}get activeScenes(){return[...this._scenes].filter(e=>e.isActive)}get scenes(){return[...this._scenes]}get systems(){return this._systems}registerSystem(e){this._systems.push(e),this._systems.sort((e,t)=>e.priority-t.priority),e.onRegister?.(this)}unregisterSystem(e){let t=this._systems.indexOf(e);t<0||(this._systems.splice(t,1),e.onUnregister?.(this))}getSystem(e){return this._systems.find(t=>t instanceof e)}loadScene(e){e.runtime=this,this._scenes.add(e),e.isInitialized||e.init(),e.enter(),this._applySceneQuality(e),this._handleResize(),this.events.emit(`sceneActivated`,{scene:e})}unloadScene(e){this._scenes.has(e)&&(e.exit(),this._scenes.delete(e),e.runtime===this&&(e.runtime=void 0),this.events.emit(`sceneDeactivated`,{scene:e}))}registerNestedScene(e){if(!this._scenes.has(e)){e.nested=!0,e.runtime=this,this._scenes.add(e),e.isInitialized||e.init(),e.enter();for(let t of e.actors)for(let n of t.components)n.onSceneAttach(e);this.events.emit(`sceneActivated`,{scene:e})}}unregisterNestedScene(e){this.unloadScene(e)}start(){if(this._running)return;this._running=!0,this._lastTime=performance.now();let e=t=>{if(!this._running)return;let n=(t-this._lastTime)/1e3;this._lastTime=t;let r=Math.min(n,this.maxDeltaTime);this._frame(r),this._rafHandle=requestAnimationFrame(e)};this._rafHandle=requestAnimationFrame(e)}stop(){this._running&&(this._running=!1,cancelAnimationFrame(this._rafHandle))}dispose(){this.stop(),window.removeEventListener(`resize`,this._onWindowResize),this._resizeObserver?.disconnect();for(let e of[...this._systems])this.unregisterSystem(e);for(let e of[...this._scenes])e.exit(),e.dispose(),this._scenes.delete(e);this.context.dispose(),this.events.clear()}step(e){this._frame(e)}setOverrideCamera(e){this.getSystem(ru)?.setOverrideCamera(e)}_frame(e){this.events.emit(`beforeUpdate`,{dt:e});for(let t of this._systems)t.onUpdate(e);this.events.emit(`afterUpdate`,{dt:e})}_handleResize(){this.context.resize();let{width:e,height:t}=this.context.canvas.getBoundingClientRect();for(let n of this._scenes){let r=n.mainCameraActorId;r&&n.findActorById(r)?.getComponent($l)?.updateAspect(e,t)}}_applySceneQuality(e){let t=e.settings.qualityPreset;!t||t===`auto`||this.context.quality.applyProfile(t)}};function Gu(e=``){let t=typeof crypto<`u`&&`randomUUID`in crypto?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;return e?`${e}_${t}`:t}var Ku=class{id;object3D;events=new n;name;_scene;_parent;_children=[];_components=[];_destroyed=!1;constructor(e=`Actor`,t=Gu(`actor`)){this.id=t,this.name=e,this.object3D=new nn,this.object3D.name=e,this.object3D.userData.actorId=t}get scene(){return this._scene}get parent(){return this._parent}get children(){return this._children}get components(){return this._components}get isDestroyed(){return this._destroyed}_bindScene(e){this._scene=e}setParent(e){if(e!==this._parent){if(this._parent){let e=this._parent._children.indexOf(this);e>=0&&this._parent._children.splice(e,1)}this._parent=e,e?(e._children.push(this),e.object3D.add(this.object3D)):this._scene&&this._scene.threeScene.add(this.object3D)}}addComponent(e){return this._components.push(e),e.onAttach(this),this._scene&&e.onSceneAttach(this._scene),this.events.emit(`componentAdded`,{actor:this,component:e}),e}removeComponent(e){let t=this._components.indexOf(e);return t<0?!1:(this._components.splice(t,1),this._scene&&e.onSceneDetach(this._scene),e.onDetach(),this.events.emit(`componentRemoved`,{actor:this,component:e}),!0)}getComponent(e){let t=e.typeName;for(let e of this._components)if(e.type===t)return e}dispatchEvent(e){for(let t of this._components)t.onEvent(e)}destroy(){if(!this._destroyed){this._destroyed=!0;for(let e of[...this._children])e.destroy();for(let e of[...this._components])this.removeComponent(e);this.setParent(void 0),this._scene&&this._scene.threeScene.remove(this.object3D),this.events.emit(`destroyed`,{actor:this}),this.events.clear(),this._scene=void 0}}serialize(){return{id:this.id,name:this.name,parentId:this._parent?.id,components:this._components.map(e=>e.serialize())}}},qu={background:`#0b0d10`,clearColor:!0,clearDepth:!0},Ju=class{id;threeScene;events=new n;name;settings;renderOrder=0;mainCameraActorId;runtime;nested=!1;_ancestorAssetIds=new Set;_actors=[];_initialized=!1;_active=!1;constructor(e=`Untitled`,t=Gu(`scene`),n){this.id=t,this.name=e,this.threeScene=new Fo,this.threeScene.name=e,this.settings={...qu,...n}}get actors(){return this._actors}get isInitialized(){return this._initialized}get isActive(){return this._active}add(e){if(e.scene===this)return e;this._actors.push(e),e._bindScene(this),e.parent||this.threeScene.add(e.object3D);for(let t of e.components)t.onSceneAttach(this);return this.events.emit(`actorAdded`,{scene:this,actor:e}),e}remove(e){if(!this._actors.includes(e))return;let t=Yu(e);for(let e of t){let t=this._actors.indexOf(e);if(!(t<0)){for(let t of e.components)t.onSceneDetach(this);this._actors.splice(t,1),this.threeScene.remove(e.object3D),e._bindScene(void 0),this.events.emit(`actorRemoved`,{scene:this,actor:e})}}}findActorById(e){return this._actors.find(t=>t.id===e)}init(){this._initialized||(this._initialized=!0,this.events.emit(`init`,{scene:this}))}enter(){this._active||(this._active=!0,this.events.emit(`enter`,{scene:this}))}exit(){this._active&&(this._active=!1,this.events.emit(`exit`,{scene:this}))}update(e){if(this._active){for(let t of this._actors)if(!t.isDestroyed)for(let n of t.components)n.onUpdate(e);this.events.emit(`update`,{scene:this,dt:e})}}dispose(){for(let e of[...this._actors])e.destroy();this._actors.length=0,this.threeScene.clear(),this.events.clear(),this._initialized=!1,this._active=!1}serialize(){return{id:this.id,name:this.name,settings:this.settings,actors:this._actors.filter(e=>!e.isDestroyed).map(e=>e.serialize()),_version:1}}};function Yu(e){let t=[e];for(let n of e.children)t.push(...Yu(n));return t}var Xu=new Map;function Y(e){let t=Xu.get(e.typeName);if(t&&t!==e)throw Error(`Component type "${e.typeName}" is already registered to a different constructor.`);Xu.set(e.typeName,e)}function Zu(e,t){let n=Xu.get(e);if(!n)throw Error(`Cannot instantiate component: unknown type "${e}".`);return new n(t)}function Qu(e){let t=new Ju(e.name,e.id,e.settings),n=new Map;for(let t of e.actors){let e=$u(t);n.set(e.id,e)}for(let r of e.actors){let e=n.get(r.id);if(e){if(r.parentId){let i=n.get(r.parentId);if(i){i.scene||t.add(i),e.scene||t.add(e),e.setParent(i);continue}}e.scene||t.add(e)}}return t}function $u(e){let t=new Ku(e.name,e.id);for(let n of e.components){let e=Zu(n.type,n.props);t.addComponent(e)}return t}function ed(e={}){return{_version:1,position:e.position??[0,0,0],rotation:e.rotation??[0,0,0],scale:e.scale??[1,1,1]}}var td=class extends Zl{static typeName=`TransformComponent`;onAttach(e){super.onAttach(e),this._apply()}onPropsChanged(){this._apply()}setPosition(e,t,n){this.setProps({position:[e,t,n]})}_apply(){if(!this._actor)return;let e=this._actor.object3D,{position:t,rotation:n,scale:r}=this._props;e.position.set(t[0],t[1],t[2]),e.rotation.set(n[0],n[1],n[2]),e.scale.set(r[0],r[1],r[2])}};function nd(e){return new gr({uniforms:{map:{value:e??null},glitchIntensity:{value:0},time:{value:0},baseColor:{value:new G(1,1,1)}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D map;
      uniform float glitchIntensity;
      uniform float time;
      uniform vec3 baseColor;
      varying vec2 vUv;

      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv;
        float noise = rand(vec2(uv.y * 100.0, time));
        float disp = glitchIntensity * noise * 0.05;

        vec4 tex = texture2D(map, uv);
        vec3 color = tex.a > 0.001 ? tex.rgb : baseColor;

        float r = texture2D(map, uv + vec2(disp, 0.0)).r;
        float g = color.g;
        float b = texture2D(map, uv - vec2(disp, 0.0)).b;
        float a = tex.a > 0.001 ? tex.a : 1.0;

        gl_FragColor = vec4(mix(color, vec3(r, g, b), glitchIntensity), a);
      }
    `,transparent:!0})}function rd(e,t){e.uniforms.glitchIntensity.value=t.intensity,e.uniforms.time.value=t.time,t.map!==void 0&&(e.uniforms.map.value=t.map),t.baseColor&&(e.uniforms.baseColor.value=t.baseColor)}function id(e){return new gr({uniforms:{map:{value:e??null},dissolveProgress:{value:1},pixelSize:{value:4},baseColor:{value:new G(1,1,1)}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D map;
      uniform float dissolveProgress;
      uniform float pixelSize;
      uniform vec3 baseColor;
      varying vec2 vUv;

      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 pixelatedUv = floor(vUv * pixelSize) / pixelSize;
        float threshold = rand(pixelatedUv);
        if (threshold > dissolveProgress) discard;
        vec4 tex = texture2D(map, vUv);
        vec3 color = tex.a > 0.001 ? tex.rgb : baseColor;
        float alpha = tex.a > 0.001 ? tex.a : 1.0;
        gl_FragColor = vec4(color, alpha);
      }
    `,transparent:!0,side:2})}function ad(e,t){e.uniforms.dissolveProgress.value=t.progress,t.map!==void 0&&(e.uniforms.map.value=t.map),t.baseColor&&(e.uniforms.baseColor.value=t.baseColor)}var od=class extends Zl{static typeName=`MeshRendererComponent`;_mesh;_assetRoot;_loadToken=0;_standardMaterial;_glitchMaterial;_dissolveMaterial;_effectMode=`standard`;_glitchTime=0;_activeMap=null;get mesh(){return this._mesh}get assetRoot(){return this._assetRoot}onAttach(e){super.onAttach(e),this._build()}onSceneAttach(e){super.onSceneAttach(e),this._refreshAssetBindings(e)}onDetach(){this._loadToken++,this._teardownAssetRoot(),this._disposeEffectMaterials(),this._mesh&&=(this._mesh.removeFromParent(),void 0),this._standardMaterial=void 0,super.onDetach()}onUpdate(e){this._effectMode!==`glitch`||!this._glitchMaterial||(this._glitchTime+=e,rd(this._glitchMaterial,{intensity:this._props.glitchIntensity,time:this._glitchTime}))}onPropsChanged(){this._applyStandardMaterialProps(),this._syncEffectMaterial(),this._mesh&&(this._mesh.castShadow=this._props.castShadow,this._mesh.receiveShadow=this._props.receiveShadow,this._mesh.scale.setScalar(this._props.size));let e=this._actor?.scene;e&&this._refreshAssetBindings(e)}_build(){if(!this._actor)return;let e=this._createGeometry(this._props.shape),t=this._createStandardMaterial(),n=new K(e,t);n.scale.setScalar(this._props.size),n.castShadow=this._props.castShadow,n.receiveShadow=this._props.receiveShadow,n.userData.actorId=this._actor.id,this._actor.object3D.add(n),this._mesh=n,this._standardMaterial=t,this._disposables.push(e,t),this._syncEffectMaterial()}_createStandardMaterial(){let e=new lc({color:new G(this._props.color[0],this._props.color[1],this._props.color[2]),metalness:this._props.metalness,roughness:this._props.roughness,transparent:this._props.opacity<1,opacity:this._props.opacity,wireframe:this._props.wireframe});return this._props.emissiveIntensity>0&&(e.emissive.copy(e.color),e.emissiveIntensity=this._props.emissiveIntensity),e}_applyStandardMaterialProps(){if(!this._standardMaterial)return;let e=this._standardMaterial;e.color.setRGB(this._props.color[0],this._props.color[1],this._props.color[2]),e.metalness=this._props.metalness,e.roughness=this._props.roughness,e.wireframe=this._props.wireframe,e.transparent=this._props.opacity<1||this._props.dissolveProgress<1,e.opacity=this._props.opacity,e.emissive.setRGB(this._props.color[0],this._props.color[1],this._props.color[2]),e.emissiveIntensity=this._props.emissiveIntensity,e.needsUpdate=!0}_resolveEffectMode(){return this._props.glitchIntensity>0?`glitch`:this._props.dissolveProgress<1?`dissolve`:`standard`}_syncEffectMaterial(){if(!this._mesh||!this._standardMaterial)return;let e=this._resolveEffectMode();if(e===this._effectMode&&e!==`standard`){this._patchActiveEffect();return}if(this._effectMode=e,e===`standard`){this._mesh.material=this._standardMaterial;return}let t=new G(this._props.color[0],this._props.color[1],this._props.color[2]),n=this._activeMap;if(e===`glitch`){this._glitchMaterial||(this._glitchMaterial=nd(n),this._disposables.push(this._glitchMaterial)),rd(this._glitchMaterial,{intensity:this._props.glitchIntensity,time:this._glitchTime,map:n,baseColor:t}),this._mesh.material=this._glitchMaterial;return}this._dissolveMaterial||(this._dissolveMaterial=id(n),this._disposables.push(this._dissolveMaterial)),ad(this._dissolveMaterial,{progress:this._props.dissolveProgress,map:n,baseColor:t}),this._mesh.material=this._dissolveMaterial}_patchActiveEffect(){if(!this._mesh)return;let e=new G(this._props.color[0],this._props.color[1],this._props.color[2]);this._effectMode===`glitch`&&this._glitchMaterial?rd(this._glitchMaterial,{intensity:this._props.glitchIntensity,time:this._glitchTime,map:this._activeMap,baseColor:e}):this._effectMode===`dissolve`&&this._dissolveMaterial&&ad(this._dissolveMaterial,{progress:this._props.dissolveProgress,map:this._activeMap,baseColor:e})}async _refreshAssetBindings(e){let t=e.runtime?.context.loader;if(!t)return;let n=++this._loadToken;if(this._props.meshAssetId)try{let e=await t.loadMesh(this._props.meshAssetId);if(n!==this._loadToken||!this._actor)return;this._teardownAssetRoot();let r=e.clone(!0);r.scale.setScalar(this._props.size),this._mesh&&(this._mesh.visible=!1),this._actor.object3D.add(r),this._assetRoot=r}catch{}else this._assetRoot&&(this._teardownAssetRoot(),this._mesh&&(this._mesh.visible=!0));if(this._props.textureAssetId&&this._mesh&&!this._props.meshAssetId)try{let e=await t.loadTexture(this._props.textureAssetId);if(n!==this._loadToken||!this._mesh)return;this._activeMap=e;let r=this._standardMaterial;r&&(r.map=e,r.needsUpdate=!0),this._syncEffectMaterial()}catch{}else if(this._mesh&&!this._props.textureAssetId){this._activeMap=null;let e=this._standardMaterial;e?.map&&(e.map=null,e.needsUpdate=!0),this._syncEffectMaterial()}}_teardownAssetRoot(){this._assetRoot&&=(this._assetRoot.removeFromParent(),void 0)}_disposeEffectMaterials(){this._glitchMaterial=void 0,this._dissolveMaterial=void 0,this._effectMode=`standard`}_createGeometry(e){switch(e){case`sphere`:return new sc(.5,32,16);case`plane`:return new Nr(1,1);case`cylinder`:return new ac(.5,.5,1,32);case`cone`:return new oc(.5,1,32);case`torus`:return new cc(.4,.15,16,48);case`capsule`:return new ic(.4,.6,8,16);default:return new cr(1,1,1)}}};function sd(e={}){return{_version:1,kind:e.kind??`directional`,color:e.color??[1,1,1],skyColor:e.skyColor??[.5,.7,1],intensity:e.intensity??1,distance:e.distance??0,angle:e.angle??Math.PI/6,penumbra:e.penumbra??.1,decay:e.decay??2,castShadow:e.castShadow??!1}}var cd=class extends Zl{static typeName=`LightComponent`;_light;get light(){return this._light}onAttach(e){super.onAttach(e),this._build()}onDetach(){this._light&&=(this._light.removeFromParent(),void 0),super.onDetach()}onPropsChanged(){this._rebuild()}_rebuild(){this._light&&this._actor&&(this._actor.object3D.remove(this._light),this._light=void 0),this._build()}_build(){if(!this._actor)return;let e=new G(this._props.color[0],this._props.color[1],this._props.color[2]),t=new G(this._props.skyColor[0],this._props.skyColor[1],this._props.skyColor[2]),n;switch(this._props.kind){case`point`:n=new Qc(e,this._props.intensity,this._props.distance,this._props.decay);break;case`spot`:n=new qc(e,this._props.intensity,this._props.distance,this._props.angle,this._props.penumbra,this._props.decay);break;case`hemisphere`:n=new Vc(t,e,this._props.intensity);break;case`ambient`:n=new tl(e,this._props.intensity);break;default:n=new el(e,this._props.intensity);break}n.castShadow=this._props.castShadow,this._actor.object3D.add(n),this._light=n}};function ld(e={}){let t={_version:1,backgroundMode:e.backgroundMode??`color`,backgroundColor:e.backgroundColor??[.04,.05,.06],useHdriAsEnvironment:e.useHdriAsEnvironment??!0,hdriBlurriness:e.hdriBlurriness??0,fog:e.fog??{enabled:!1,color:[.5,.5,.6],near:10,far:80},exposure:e.exposure??1};return e.backgroundHdriAssetId&&(t.backgroundHdriAssetId=e.backgroundHdriAssetId),t}var ud=class extends Zl{static typeName=`EnvironmentComponent`;_hdriTexture;_hdriLoadToken=0;onAttach(e){super.onAttach(e)}onSceneAttach(e){this._apply()}onSceneDetach(e){e.threeScene.fog=null,e.threeScene.environment=null,this._disposeHdri()}onDetach(){this._disposeHdri(),super.onDetach()}onPropsChanged(){this._apply()}_apply(){let e=this._actor?.scene;if(!e)return;let t=this._props;if(t.backgroundMode===`transparent`)e.settings={...e.settings,background:null},e.threeScene.background=null,t.useHdriAsEnvironment||(e.threeScene.environment=null);else if(t.backgroundMode===`hdri`&&t.backgroundHdriAssetId)e.threeScene.background=new G(t.backgroundColor[0],t.backgroundColor[1],t.backgroundColor[2]),e.threeScene.backgroundBlurriness=t.hdriBlurriness,this._loadHdri(t.backgroundHdriAssetId);else{let n=`#${this._rgbToHex(t.backgroundColor)}`;e.settings={...e.settings,background:n},e.threeScene.background=new G(t.backgroundColor[0],t.backgroundColor[1],t.backgroundColor[2]),t.useHdriAsEnvironment||(e.threeScene.environment=null)}t.fog.enabled?e.threeScene.fog=new Po(new G(t.fog.color[0],t.fog.color[1],t.fog.color[2]),t.fog.near,t.fog.far):e.threeScene.fog=null}_loadHdri(e){let t=this._actor?.scene,n=t?.runtime;if(!t||!n)return;let r=++this._hdriLoadToken;this._loadHdriTexture(n,e).then(e=>{r!==this._hdriLoadToken||!this._actor?.scene||(this._disposeHdri(),e.mapping=303,this._hdriTexture=e,t.threeScene.background=e,t.threeScene.backgroundBlurriness=this._props.hdriBlurriness,this._props.useHdriAsEnvironment&&(t.threeScene.environment=e))}).catch(()=>{})}async _loadHdriTexture(e,t){let n=e.context.assets.get(t)?.meta?.mimeType??``,r=await e.context.loader.blobs.fetch(t);if(n.includes(`hdr`)||n.includes(`radiance`)){let e=new(await(zl(()=>import(`./RGBELoader-Cfi5NU8Q.js`),[]))).RGBELoader().parse(r),t=new Xo(e.data,e.width,e.height,v,e.type);return t.needsUpdate=!0,t}return e.context.loader.loadTexture(t)}_disposeHdri(){this._hdriTexture&&=(this._hdriTexture.dispose(),void 0)}_rgbToHex(e){let t=e=>Math.max(0,Math.min(255,Math.round(e*255))).toString(16).padStart(2,`0`);return`${t(e[0])}${t(e[1])}${t(e[2])}`}},dd=class extends Zl{static typeName=`AnimationPlayerComponent`;onMarker;onComplete;onLoop;_state=`stopped`;_time=0;_clipDuration=0;_direction=1;get state(){return this._state}get time(){return this._time}get clipDuration(){return this._clipDuration}set clipDuration(e){this._clipDuration=e}get weight(){return this._props.weight}get layer(){return this._props.layer}get additive(){return this._props.additive}get progress(){return this._clipDuration<=0?0:Math.max(0,Math.min(1,this._time/this._clipDuration))}set progress(e){this.seek(e*this._clipDuration)}onAttach(e){super.onAttach(e),(e.scene?.runtime?.getSystem(Ru))?.registerPlayer(this),this._lastClipId=this._props.clipId,this._props.autoplay&&this.play()}onDetach(){(this.actor?.scene?.runtime?.getSystem(Ru))?.unregisterPlayer(this),super.onDetach()}onPropsChanged(){this._lastClipId!==this._props.clipId&&(this._lastClipId=this._props.clipId,this._clipDuration=0,this._time=0,this._direction=1,this._state===`playing`&&(this._state=`stopped`)),this._props.autoplay&&this._props.clipId&&this._state!==`playing`&&this.play(),!this._props.autoplay&&this._state===`playing`&&this.stop()}_lastClipId=void 0;onUpdate(e){if(this._state!==`playing`)return;this._time+=e*this._props.playbackRate*this._direction;let t=this._props.playbackMode;if(t===`once`){this._time>=this._clipDuration&&this._clipDuration>0?(this._time=this._clipDuration,this._state=`stopped`,this.onComplete?.()):this._time<0&&(this._time=0,this._state=`stopped`,this.onComplete?.());return}if(t===`loop`){if(this._clipDuration>0){let e=!1;for(;this._time>=this._clipDuration;)this._time-=this._clipDuration,e=!0;for(;this._time<0;)this._time+=this._clipDuration,e=!0;e&&this.onLoop?.()}return}t===`pingPong`&&(this._time>=this._clipDuration?(this._time=this._clipDuration,this._direction=-1,this.onLoop?.()):this._time<0&&(this._time=0,this._direction=1,this.onLoop?.()))}play(){this._state=`playing`}pause(){this._state===`playing`&&(this._state=`paused`)}stop(){this._state=`stopped`,this._time=0,this._direction=1}seek(e){this._time=Math.max(0,Math.min(e,this._clipDuration))}setPlaybackRate(e){this.setProps({...this._props,playbackRate:e})}setPlaybackMode(e){this.setProps({...this._props,playbackMode:e})}setClip(e){this.setProps({...this._props,clipId:e}),this.stop()}setWeight(e){this.setProps({...this._props,weight:Math.max(0,Math.min(1,e))})}setLayer(e){this.setProps({...this._props,layer:e})}},fd=class extends Zl{static typeName=`StateMachineComponent`;_currentStateId;_transitionTimer=0;_isTransitioning=!1;_transitionTargetStateId;_transitionDuration=0;_transitionProgress=0;get currentState(){return this._props.states.find(e=>e.id===this._currentStateId)}get currentStateId(){return this._currentStateId}get isTransitioning(){return this._isTransitioning}get transitionProgress(){return this._transitionProgress}constructor(e){super(e),this._currentStateId=e.initialStateId}onAttach(e){super.onAttach(e),this._enterState(this._currentStateId)}onUpdate(e){this._isTransitioning&&this._transitionDuration>0&&(this._transitionTimer+=e,this._transitionProgress=Math.min(1,this._transitionTimer/this._transitionDuration),this._transitionProgress>=1&&this._completeTransition());for(let t of this._props.transitions)if(t.fromStateId===this._currentStateId&&this._checkTrigger(t.trigger,e)){this.transitionTo(t.toStateId,t.duration);break}}onEvent(e){for(let t of this._props.transitions)if(t.fromStateId===this._currentStateId&&t.trigger.type===`event`&&t.trigger.eventName===e.name){this.transitionTo(t.toStateId,t.duration);break}}transitionTo(e,t=0){if(!this._isTransitioning&&e!==this._currentStateId){if(!this._props.states.find(t=>t.id===e)){console.warn(`[StateMachineComponent] Unknown state: ${e}`);return}this._isTransitioning=!0,this._transitionTargetStateId=e,this._transitionDuration=t,this._transitionTimer=0,this._transitionProgress=0,t===0&&this._completeTransition()}}_completeTransition(){this._transitionTargetStateId&&(this._currentStateId=this._transitionTargetStateId,this._isTransitioning=!1,this._transitionTargetStateId=void 0,this._transitionTimer=0,this._transitionProgress=0,this._enterState(this._currentStateId))}_enterState(e){let t=this._props.states.find(t=>t.id===e);if(t){if(t.clipId&&this.actor){let e=this.actor.getComponent(dd);e&&(e.setClip(t.clipId),e.play())}if(t.propertyOverrides&&this.actor)for(let e of t.propertyOverrides){let t=this.actor.components.find(t=>t.type===e.componentType);t&&pd(t,e.property,e.value)}}}_checkTrigger(e,t){switch(e.type){case`immediate`:return!0;case`timer`:return!1;case`scroll`:return!1;case`event`:return!1;default:return!1}}addState(e){this.setProps({...this._props,states:[...this._props.states,e]})}removeState(e){this.setProps({...this._props,states:this._props.states.filter(t=>t.id!==e),transitions:this._props.transitions.filter(t=>t.fromStateId!==e&&t.toStateId!==e)})}addTransition(e){this.setProps({...this._props,transitions:[...this._props.transitions,e]})}removeTransition(e,t){this.setProps({...this._props,transitions:this._props.transitions.filter(n=>!(n.fromStateId===e&&n.toStateId===t))})}};function pd(e,t,n){let r=t.split(`.`).filter(Boolean),i=r[r.length-1];if(!i)return;let a=e.props;for(let e=0;e<r.length-1;e+=1){let t=a[r[e]];if(!md(t))return;a=t}a[i]=n}function md(e){return typeof e==`object`&&!!e}var hd=class extends Zl{static typeName=`ScrollDriverComponent`;_player;onAttach(e){super.onAttach(e),this._player=e.getComponent(dd),this._player||console.warn(`[ScrollDriverComponent] No AnimationPlayerComponent found on actor.`)}onUpdate(e){if(!this._player)return;let t=typeof window<`u`?window.scrollY:0,{scrollStart:n,scrollEnd:r,clamp:i}=this._props,a=r-n,o=a>0?(t-n)/a:0;i&&(o=Math.max(0,Math.min(1,o))),this._player.progress=o,this._player.state===`playing`&&this._player.pause()}setScrollRange(e,t){this.setProps({...this._props,scrollStart:e,scrollEnd:t})}};function gd(e,t=[]){if(e.actors.length===0)throw Error(`Prefab "${e.name}" is empty.`);let n=new Map;for(let t of e.actors)n.set(t.id,Gu(`actor`));let r=new Map,i=new Map;for(let t of e.actors){let e=$u({id:n.get(t.id),name:t.name,parentId:t.parentId?n.get(t.parentId):void 0,components:t.components});if(r.set(t.id,e),t.parentId){let e=i.get(t.parentId)??[];e.push(t.id),i.set(t.parentId,e)}}for(let t of e.actors){if(!t.parentId)continue;let e=r.get(t.parentId),n=r.get(t.id);e&&n&&n.setParent(e)}let a=e.actors[0],o=r.get(a.id);if(!o)throw Error(`Prefab root actor missing.`);let s=new Map;s.set(o,``);let c=[o];for(;c.length>0;){let e=c.pop(),t=s.get(e)??``;e.children.forEach((e,n)=>{s.set(e,t===``?String(n):`${t}/${n}`),c.push(e)})}let l=new Map;for(let[e,t]of s.entries())l.set(t,e);for(let e of t){let t=l.get(e.actorPath);if(t){for(let n of t.components)if(n.type===e.componentType){n.setProps(e.patch);break}}}return o}var _d=class extends Zl{static typeName=`PrefabInstanceComponent`;_expanded=!1;onSceneAttach(e){super.onSceneAttach(e),this._props.expandOnAttach&&(this._expanded||this._expand(e))}onSceneDetach(e){super.onSceneDetach(e),this._expanded=!1}expand(){let e=this._actor?.scene;e&&this._expand(e)}_expand(e){let t=e.runtime?.context.assets;if(!t||!this._actor)return;if(this._actor.children.length>0){this._expanded=!0;return}let n=t.get(this._props.prefabId);if(!n||n.type!==`prefab`||!n.inline)return;let r=n.inline,i=gd(r,[...this._props.overrides]);i.setParent(this._actor),vd(e,i),this._expanded=!0}};function vd(e,t){t.scene||e.add(t);for(let n of t.children)vd(e,n)}function yd(e={}){return{_version:1,bodyType:e.bodyType??`dynamic`,shape:e.shape??`box`,size:e.size??[1,1,1],mass:e.mass??1,friction:e.friction??.5,restitution:e.restitution??0,linearDamping:e.linearDamping??.01,angularDamping:e.angularDamping??.05,lockRotationX:e.lockRotationX??!1,lockRotationY:e.lockRotationY??!1,lockRotationZ:e.lockRotationZ??!1,gravityScale:e.gravityScale??1,collisionLayer:e.collisionLayer??1,collisionMask:e.collisionMask??65535,isTrigger:e.isTrigger??!1}}var bd=class extends Zl{static typeName=`PhysicsBodyComponent`;_bodyHandle;_colliderHandle;constructor(e){super(yd(e))}onAttach(e){super.onAttach(e)}onDetach(){super.onDetach()}onPropsChanged(){this._bodyHandle=void 0,this._colliderHandle=void 0}applyImpulse(e,t,n){this._physicsSystem()?.applyImpulse(this,e,t,n)}applyForce(e,t,n){this._physicsSystem()?.applyForce(this,e,t,n)}applyTorqueImpulse(e,t,n){this._physicsSystem()?.applyTorqueImpulse(this,e,t,n)}getLinearVelocity(){return this._physicsSystem()?.getLinearVelocity(this)??[0,0,0]}setLinearVelocity(e,t,n){this._physicsSystem()?.setLinearVelocity(this,e,t,n)}getAngularVelocity(){return this._physicsSystem()?.getAngularVelocity(this)??[0,0,0]}setAngularVelocity(e,t,n){this._physicsSystem()?.setAngularVelocity(this,e,t,n)}_physicsSystem(){return this._actor?.scene?.runtime?.systems.find(xd)}};function xd(e){return e.name===`PhysicsSystem`}var Sd=class extends Zl{static typeName=`AudioComponent`;_audio;_panner;_bufferToken=0;_wantsPlay=!1;get audio(){return this._audio}get isPlaying(){return this._audio?.isPlaying??!1}onAttach(e){super.onAttach(e)}onSceneAttach(e){super.onSceneAttach(e),(e.runtime?.systems.find(e=>e.name===`AudioSystem`))?.register(this)}onSceneDetach(e){(e.runtime?.systems.find(e=>e.name===`AudioSystem`))?.unregister(this),this._teardown(),super.onSceneDetach(e)}onDetach(){this._teardown(),super.onDetach()}_bindListener(e){if(!this._actor)return;this._audio&&this._teardown();let t=this._props.spatial?new vl(e):new pl(e);t.setLoop(this._props.loop),t.setVolume(this._props.volume),t.setPlaybackRate(this._props.playbackRate),t instanceof vl&&(t.setRefDistance(this._props.refDistance),t.setMaxDistance(this._props.maxDistance),t.setRolloffFactor(this._props.rolloffFactor),t.setDistanceModel(this._props.distanceModel)),this._actor.object3D.add(t),this._audio=t,this._applyPan()}_bindBuffer(e,t){!this._audio||t!==this._bufferToken||(this._audio.setBuffer(e),(this._wantsPlay||this._props.autoplay)&&(this._wantsPlay=!1,this._safePlay()))}_newBufferToken(){return++this._bufferToken}get bufferToken(){return this._bufferToken}play(){if(!this._audio||!this._audio.buffer){this._wantsPlay=!0;return}this._safePlay()}pause(){this._wantsPlay=!1,this._audio?.isPlaying&&this._audio.pause()}stop(){this._wantsPlay=!1,(this._audio?.isPlaying||this._audio?.buffer)&&this._audio.stop()}seek(e){this._audio&&(this._audio.offset=Math.max(0,e),this._audio.isPlaying&&(this._audio.stop(),this._safePlay()))}onPropsChanged(){this._audio&&(this._audio.setLoop(this._props.loop),this._audio.setVolume(this._props.volume),this._audio.setPlaybackRate(this._props.playbackRate),this._audio instanceof vl&&(this._audio.setRefDistance(this._props.refDistance),this._audio.setMaxDistance(this._props.maxDistance),this._audio.setRolloffFactor(this._props.rolloffFactor),this._audio.setDistanceModel(this._props.distanceModel)),this._applyPan(),((this._actor?.scene)?.runtime?.systems.find(e=>e.name===`AudioSystem`))?.reloadBufferFor(this))}_safePlay(){if(!(!this._audio||!this._audio.buffer))try{this._audio.isPlaying||this._audio.play()}catch{this._wantsPlay=!0}}_applyPan(){if(!this._audio||this._audio instanceof vl)return;let e=this._audio.context;if(!this._panner){if(typeof e.createStereoPanner!=`function`)return;this._panner=e.createStereoPanner();let t=this._audio.getOutput();t.disconnect(),t.connect(this._panner),this._panner.connect(e.destination)}this._panner.pan.value=Math.max(-1,Math.min(1,this._props.pan))}_teardown(){this._audio&&=(this._audio.isPlaying&&this._audio.stop(),this._audio.removeFromParent(),this._audio.disconnect(),void 0),this._panner=void 0}},Cd=class e extends Zl{static typeName=`TextComponent`;static MAX_CANVAS_DIM=4096;static PIXELS_PER_WORLD_UNIT=256;_canvas;_ctx2d;_texture;_material;_geometry;_mesh;_resolvedFamily;_fontLoadToken=0;_cameraWorldQuaternion=new nt;_parentWorldQuaternion=new nt;get mesh(){return this._mesh}onAttach(e){if(super.onAttach(e),!(typeof document>`u`)){this._canvas=document.createElement(`canvas`);try{this._ctx2d=this._canvas.getContext(`2d`)??void 0}catch{this._ctx2d=void 0}this._texture=new Ds(this._canvas),this._texture.colorSpace=A,this._texture.minFilter=u,this._texture.magFilter=u,this._texture.anisotropy=4,this._material=new Cn({map:this._texture,transparent:!0,side:2,depthWrite:!1}),this._geometry=new Nr(1,1),this._mesh=new K(this._geometry,this._material),this._mesh.renderOrder=this._props.renderOrder,this._mesh.userData.actorId=e.id,e.object3D.add(this._mesh),this._disposables.push(this._geometry,this._material,this._texture),this._render()}}onSceneAttach(e){super.onSceneAttach(e),this._loadFontIfNeeded()}onDetach(){this._fontLoadToken++,this._mesh&&=(this._mesh.removeFromParent(),void 0),super.onDetach()}onUpdate(e){if(!this._mesh||!this._props.billboard)return;let t=this._actor?.scene,n=this._resolveCamera(t);if(n){n.getWorldQuaternion(this._cameraWorldQuaternion),this._mesh.quaternion.copy(this._cameraWorldQuaternion);let e=this._mesh.parent;e&&(e.getWorldQuaternion(this._parentWorldQuaternion).invert(),this._mesh.quaternion.premultiply(this._parentWorldQuaternion))}}onPropsChanged(){!this._material||!this._mesh||(this._mesh.renderOrder=this._props.renderOrder,this._material.opacity=this._props.opacity,this._props.fontAssetId&&this._loadFontIfNeeded(),this._render())}forceRender(){this._render()}_resolveCamera(e){if(!e)return;let t=e.runtime?.systems.find(e=>e.name===`RenderingSystem`);if(t?.overrideCamera)return t.overrideCamera;let n=e.mainCameraActorId;if(n)return e.findActorById(n)?.getComponent($l)?.camera}_loadFontIfNeeded(){let e=(this._actor?.scene)?.runtime?.context.loader;if(!e||!this._props.fontAssetId)return;let t=++this._fontLoadToken;e.loadFont(this._props.fontAssetId).then(e=>{t===this._fontLoadToken&&(this._resolvedFamily=e,this._render())}).catch(()=>{})}_render(){if(!this._canvas||!this._ctx2d||!this._texture||!this._geometry)return;let t=this._props,n=this._resolvedFamily??t.fontFamily,r=e.PIXELS_PER_WORLD_UNIT,i=Math.min(e.MAX_CANVAS_DIM,Math.max(64,Math.round(t.widthWorld*r))),a=Math.max(1,i-t.paddingPx*2),o=`${t.fontStyle} ${t.fontWeight} ${t.fontSizePx}px ${n}`;this._ctx2d.font=o;let s=this._applyReveal(t.text,t.revealProgress,t.revealMode),c=this._applyScramble(s,t.scrambleProgress,t.scrambleCharSet),l=this._layoutLines(c,a,t.wrap),u=t.fontSizePx*t.lineHeight,d=l.length*u,f=Math.min(e.MAX_CANVAS_DIM,Math.max(t.fontSizePx+t.paddingPx*2,Math.ceil(d+t.paddingPx*2)));this._canvas.width!==i&&(this._canvas.width=i),this._canvas.height!==f&&(this._canvas.height=f);let p=this._ctx2d;p.clearRect(0,0,this._canvas.width,this._canvas.height),t.backgroundColor&&(p.fillStyle=`rgba(${wd(t.backgroundColor)}, ${t.backgroundOpacity})`,p.fillRect(0,0,this._canvas.width,this._canvas.height)),p.font=o,p.textBaseline=`top`,p.fillStyle=`rgb(${wd(t.color)})`,t.outlineWidth>0&&(p.strokeStyle=`rgb(${wd(t.outlineColor)})`,p.lineWidth=t.outlineWidth,p.lineJoin=`round`);for(let e=0;e<l.length;e++){let n=l[e],r=this._measureWithSpacing(p,n,t.letterSpacingPx),i=t.paddingPx;t.align===`center`?i=(this._canvas.width-r)/2:t.align===`right`&&(i=this._canvas.width-t.paddingPx-r);let a=t.paddingPx+e*u,o=this._lineStartIndex(c,e);this._drawLine(p,n,i,a,t.letterSpacingPx,t.outlineWidth>0,o,t.waveAmplitude,t.wavePhase,t.waveFrequency)}this._texture.needsUpdate=!0;let m=t.widthWorld,h=f/i*m;this._geometry.dispose(),this._geometry=new Nr(m,h),this._mesh&&(this._mesh.geometry=this._geometry,this._applyAnchor(m,h))}_applyScramble(e,t,n){let r=Math.max(0,Math.min(1,t));if(r>=1||!e||!n)return e;let i=Math.floor(e.length*r),a=n.length>0?n:`X`,o=``;for(let t=0;t<e.length;t++){let n=e[t];t<i||n===`
`||n===` `?o+=n:o+=a[this._scrambleIndex(t,n)%a.length]}return o}_scrambleIndex(e,t){let n=t.charCodeAt(0)||0;return e*7919+n*31>>>0}_lineStartIndex(e,t){if(t<=0)return 0;let n=e.split(`
`),r=0;for(let e=0;e<t&&e<n.length;e++)r+=n[e].length+1;return r}_applyReveal(e,t,n){let r=Math.max(0,Math.min(1,t));if(n===`all`||r>=1)return e;if(r<=0)return``;if(n===`character`){let t=Math.floor(e.length*r);return e.slice(0,t)}if(n===`word`){let t=e.split(/(\s+)/),n=t.map((e,t)=>({w:e,i:t})).filter(e=>e.w.trim().length>0),i=n[Math.floor(n.length*r)]?.i??t.length;return t.slice(0,i).join(``)}let i=e.split(`
`),a=Math.floor(i.length*r);return i.slice(0,a).join(`
`)}_layoutLines(e,t,n){let r=this._ctx2d,i=[];for(let a of e.split(`
`)){if(!n){i.push(a);continue}let e=a.split(` `),o=``;for(let n of e){let e=o?`${o} ${n}`:n;r.measureText(e).width<=t||!o?o=e:(i.push(o),o=n)}o&&i.push(o),e.length||i.push(``)}return i.length>0?i:[``]}_measureWithSpacing(e,t,n){if(n===0)return e.measureText(t).width;let r=0;for(let i of t)r+=e.measureText(i).width+n;return Math.max(0,r-n)}_drawLine(e,t,n,r,i,a,o=0,s=0,c=0,l=2){if(i===0&&s===0){a&&e.strokeText(t,n,r),e.fillText(t,n,r);return}let u=n;for(let n=0;n<t.length;n++){let d=t[n],f=s===0?r:r+s*Math.sin(c+(o+n)*l);a&&e.strokeText(d,u,f),e.fillText(d,u,f),u+=e.measureText(d).width+i}}_applyAnchor(e,t){if(!this._mesh)return;let n=this._props.anchor,r=0,i=0;(n===`left`||n===`top-left`||n===`bottom-left`)&&(r=e/2),(n===`right`||n===`top-right`||n===`bottom-right`)&&(r=-e/2),(n===`top`||n===`top-left`||n===`top-right`)&&(i=-t/2),(n===`bottom`||n===`bottom-left`||n===`bottom-right`)&&(i=t/2),this._mesh.position.set(r,i,0)}};function wd(e){let t=e=>Math.max(0,Math.min(255,Math.round(e*255)));return`${t(e[0])}, ${t(e[1])}, ${t(e[2])}`}function Td(e,t){e.style.position=`absolute`,e.style.display=t.visible?`block`:`none`,e.style.opacity=String(t.opacity),e.style.pointerEvents=t.pointerEvents,e.style.zIndex=String(t.zIndex),e.style.padding=`${t.paddingPx}px`,e.style.borderRadius=`${t.borderRadiusPx}px`,t.width===`auto`?e.style.width=``:e.style.width=`${t.width}px`,t.height===`auto`?e.style.height=``:e.style.height=`${t.height}px`,e.className=`flamecore-ui ${t.className}`.trim(),Ed(e,t.anchor,t.offset)}function Ed(e,t,n){e.style.left=``,e.style.right=``,e.style.top=``,e.style.bottom=``,e.style.transform=``;let[r,i]=n,a=`${r}px`,o=`${i}px`;switch(t){case`top-left`:e.style.left=a,e.style.top=o;break;case`top`:e.style.left=`calc(50% + ${r}px)`,e.style.top=o,e.style.transform=`translateX(-50%)`;break;case`top-right`:e.style.right=a,e.style.top=o;break;case`left`:e.style.left=a,e.style.top=`calc(50% + ${i}px)`,e.style.transform=`translateY(-50%)`;break;case`center`:e.style.left=`calc(50% + ${r}px)`,e.style.top=`calc(50% + ${i}px)`,e.style.transform=`translate(-50%, -50%)`;break;case`right`:e.style.right=a,e.style.top=`calc(50% + ${i}px)`,e.style.transform=`translateY(-50%)`;break;case`bottom-left`:e.style.left=a,e.style.bottom=o;break;case`bottom`:e.style.left=`calc(50% + ${r}px)`,e.style.bottom=o,e.style.transform=`translateX(-50%)`;break;case`bottom-right`:e.style.right=a,e.style.bottom=o;break}}var Dd=class extends Zl{_element;_parentElement;onAttach(e){super.onAttach(e)}onSceneAttach(e){super.onSceneAttach(e),this._mount(e),this._element&&Td(this._element,this._props),this._applyChildStyles()}onSceneDetach(e){this._unmount(),super.onSceneDetach(e)}onDetach(){this._unmount(),super.onDetach()}onPropsChanged(){this._element&&Td(this._element,this._props),this._applyChildStyles()}_applyChildStyles(){}_mount(e){let t=e.runtime?.context.uiOverlay;if(!t)return;let n=t,r=this._actor?.parent;if(r){let e=r.components.find(e=>[`UIPanelComponent`,`UIRootComponent`].includes(e.type));e?.element&&(n=e.element)}this._parentElement=n,this._element||=this._createElement(),n.appendChild(this._element)}_unmount(){this._element&&this._element.parentElement&&this._element.parentElement.removeChild(this._element),this._parentElement=void 0}get element(){return this._element}},Od=class extends Dd{static typeName=`UIRootComponent`;_createElement(){let e=document.createElement(`div`);return e.dataset.fcUiRole=`root`,e.style.position=`absolute`,e.style.inset=`0`,e}},kd=class extends Dd{static typeName=`UIPanelComponent`;_createElement(){return document.createElement(`div`)}_applyChildStyles(){this._element&&(this._element.style.background=this._props.backgroundColor,this._element.style.border=this._props.border,this._element.style.backdropFilter=this._props.backdropBlurPx>0?`blur(${this._props.backdropBlurPx}px)`:``)}},Ad=class extends Dd{static typeName=`UILabelComponent`;_fontToken=0;_createElement(){return document.createElement(`div`)}onSceneAttach(e){super.onSceneAttach(e),this._loadFont()}_applyChildStyles(){if(!this._element)return;let e=this._props;this._element.textContent=e.text,this._element.style.color=e.color,this._element.style.fontFamily=e.fontFamily,this._element.style.fontSize=`${e.fontSizePx}px`,this._element.style.fontWeight=e.fontWeight,this._element.style.lineHeight=String(e.lineHeight),this._element.style.textAlign=e.textAlign,this._element.style.whiteSpace=`pre-wrap`}_loadFont(){if(!this._props.fontAssetId)return;let e=this._actor?.scene?.runtime?.context.loader;if(!e)return;let t=++this._fontToken;e.loadFont(this._props.fontAssetId).then(e=>{t!==this._fontToken||!this._element||(this._element.style.fontFamily=`"${e}", ${this._props.fontFamily}`)}).catch(()=>void 0)}},jd=class extends Dd{static typeName=`UIButtonComponent`;_createElement(){let e=document.createElement(`button`);return e.type=`button`,e.addEventListener(`click`,()=>this._handleClick()),e.addEventListener(`pointerenter`,()=>{e.style.background=this._props.hoverBackgroundColor}),e.addEventListener(`pointerleave`,()=>{e.style.background=this._props.backgroundColor}),e}_applyChildStyles(){if(!this._element)return;let e=this._element,t=this._props;e.textContent=t.text,e.disabled=t.disabled,e.style.cursor=t.disabled?`not-allowed`:`pointer`,e.style.color=t.color,e.style.background=t.backgroundColor,e.style.fontFamily=t.fontFamily,e.style.fontSize=`${t.fontSizePx}px`,e.style.fontWeight=t.fontWeight,e.style.border=`none`,e.style.borderRadius=`${t.borderRadiusPx}px`}_handleClick(){if(this._props.disabled)return;let e=this._props.eventName;if(!this._actor)return;let t={actorId:this._actor.id,eventName:e};this._actor.components.forEach(e=>{e.onEvent({name:`uiClick`,payload:t})})}},Md=class extends Dd{static typeName=`UIImageComponent`;_objectUrl;_createElement(){return document.createElement(`img`)}onSceneAttach(e){super.onSceneAttach(e),this._refreshSource()}_applyChildStyles(){if(!this._element)return;let e=this._element;e.style.objectFit=this._props.fit,this._refreshSource()}onDetach(){this._objectUrl&&URL.revokeObjectURL(this._objectUrl),this._objectUrl=void 0,super.onDetach()}_refreshSource(){if(!this._element)return;let e=this._element;if(this._props.imageAssetId){let t=this._actor?.scene,n=t?.runtime?.context.loader;if(t?.runtime?.context.assets,n){n.getBlobUrl(this._props.imageAssetId).then(t=>{t&&(this._objectUrl&&URL.revokeObjectURL(this._objectUrl),this._objectUrl=t,e.src=t)}).catch(()=>void 0);return}}e.src=this._props.url}},Nd=class extends Zl{static typeName=`UICanvasComponent`;_canvas;_ctx2d;_texture;_material;_geometry;_mesh;_borderMesh;_dirty=!0;_pointerHandlersBound=!1;_onPointerDown=e=>{this._handlePointer(e,`down`)};_onPointerUp=e=>{this._handlePointer(e,`up`)};get mesh(){return this._mesh}get canvasElement(){return this._canvas}markDirty(){this._dirty=!0}onAttach(e){if(super.onAttach(e),!(typeof document>`u`)){this._canvas=document.createElement(`canvas`),this._canvas.width=Math.max(1,Math.floor(this._props.widthPx)),this._canvas.height=Math.max(1,Math.floor(this._props.heightPx));try{this._ctx2d=this._canvas.getContext(`2d`)??void 0}catch{this._ctx2d=void 0}this._texture=new Ds(this._canvas),this._texture.colorSpace=A,this._texture.minFilter=u,this._texture.magFilter=u,this._texture.anisotropy=4,this._material=new Cn({map:this._texture,transparent:!0,side:this._props.doubleSided?2:0,depthWrite:!1}),this._geometry=new Nr(this._props.widthWorld,this._props.heightWorld),this._mesh=new K(this._geometry,this._material),this._mesh.renderOrder=this._props.renderOrder,this._mesh.userData.actorId=e.id,this._mesh.userData.uiCanvasComponent=this,e.object3D.add(this._mesh),this._buildBorder(),this._disposables.push(this._geometry,this._material,this._texture),this._applyVisibility(),this._dirty=!0}}onSceneAttach(e){super.onSceneAttach(e),this._bindPointerHandlers(),this._dirty=!0}onSceneDetach(e){this._unbindPointerHandlers(),super.onSceneDetach(e)}onDetach(){if(this._unbindPointerHandlers(),this._mesh&&=(this._mesh.removeFromParent(),void 0),this._borderMesh){this._borderMesh.removeFromParent();let e=this._borderMesh.geometry,t=this._borderMesh.material;e?.dispose(),t?.dispose(),this._borderMesh=void 0}super.onDetach()}onUpdate(e){this._applyAnchor(),this._dirty&&=(this._render(),!1)}onPropsChanged(){if(!this._mesh||!this._material||!this._geometry||!this._canvas)return;let e=Math.max(1,Math.floor(this._props.widthPx)),t=Math.max(1,Math.floor(this._props.heightPx));(this._canvas.width!==e||this._canvas.height!==t)&&(this._canvas.width=e,this._canvas.height=t);let n=this._geometry.parameters;(n.width!==this._props.widthWorld||n.height!==this._props.heightWorld)&&(this._geometry.dispose(),this._geometry=new Nr(this._props.widthWorld,this._props.heightWorld),this._mesh.geometry=this._geometry,this._disposables.push(this._geometry),this._rebuildBorderGeometry()),this._material.side=this._props.doubleSided?2:0,this._material.opacity=this._props.opacity,this._mesh.renderOrder=this._props.renderOrder,this._applyVisibility(),this._borderMesh&&(this._borderMesh.visible=this._props.showBorderInEditor,this._borderMesh.material.color.setRGB(...this._props.borderColor)),this._dirty=!0}_applyVisibility(){this._mesh&&(this._mesh.visible=this._props.visible),this._borderMesh&&(this._borderMesh.visible=this._props.showBorderInEditor&&this._props.visible)}_buildBorder(){if(!this._mesh)return;let e=this._props.widthWorld/2,t=this._props.heightWorld/2,n=new Float32Array([-e,-t,0,e,-t,0,e,-t,0,e,t,0,e,t,0,-e,t,0,-e,t,0,-e,-t,0]),r=new Hn;r.setAttribute(`position`,new jn(n,3));let i=new ls({color:new G().setRGB(...this._props.borderColor),transparent:!0,opacity:.9,depthTest:!1});this._borderMesh=new vs(r,i),this._borderMesh.layers.set(1),this._borderMesh.renderOrder=this._props.renderOrder+1,this._borderMesh.visible=this._props.showBorderInEditor,this._borderMesh.userData.fcEditorOverlay=!0,this._mesh.add(this._borderMesh)}_rebuildBorderGeometry(){if(!this._borderMesh)return;let e=this._props.widthWorld/2,t=this._props.heightWorld/2,n=new Float32Array([-e,-t,0,e,-t,0,e,-t,0,e,t,0,e,t,0,-e,t,0,-e,t,0,-e,-t,0]);this._borderMesh.geometry.dispose();let r=new Hn;r.setAttribute(`position`,new jn(n,3)),this._borderMesh.geometry=r}_applyAnchor(){if(!this._mesh||!this._actor)return;let e=this._actor.scene;if(!e)return;let t=this._props.anchorMode;if(t===`camera`){let t=this._resolveCamera(e);if(!t)return;let n=new U;t.getWorldDirection(n);let r=new U().copy(t.getWorldPosition(new U)).addScaledVector(n,this._props.cameraDistance),i=this._actor.object3D.parent?this._actor.object3D.parent.worldToLocal(r.clone()):r;this._actor.object3D.position.copy(i),this._actor.object3D.quaternion.copy(t.quaternion);return}if(t===`parent-face`&&this._applyParentFaceAnchor(),this._props.billboard){let t=this._resolveCamera(e);if(t){this._mesh.quaternion.copy(t.quaternion);let e=this._actor.object3D.getWorldQuaternion(new nt).invert();this._mesh.quaternion.premultiply(e)}}else this._mesh.quaternion.identity()}_applyParentFaceAnchor(){if(!this._actor||!this._mesh)return;let e=this._actor.parent;if(!e)return;let t=e.getComponent(od)?.mesh;if(!t)return;let n=t.geometry;if(!n)return;let r=n.getAttribute(`position`);if(!r)return;let i=n.getIndex(),a=Math.max(0,Math.floor(this._props.parentFaceIndex))*3,o=new U,s=new U,c=new U;if(i){if(a+2>=i.count)return;o.fromBufferAttribute(r,i.getX(a)),s.fromBufferAttribute(r,i.getX(a+1)),c.fromBufferAttribute(r,i.getX(a+2))}else{if(a+2>=r.count)return;o.fromBufferAttribute(r,a),s.fromBufferAttribute(r,a+1),c.fromBufferAttribute(r,a+2)}let l=new U().addVectors(o,s).add(c).multiplyScalar(1/3),u=new U().subVectors(s,o).cross(new U().subVectors(c,o)).normalize();l.addScaledVector(u,this._props.faceNormalOffset),this._actor.object3D.position.copy(l);let d=new nt().setFromUnitVectors(new U(0,0,1),u);this._actor.object3D.quaternion.copy(d)}_resolveCamera(e){for(let t of e.actors){let e=t.getComponent($l);if(e&&e.props.isMain)return e.camera}}_render(){let e=this._ctx2d,t=this._canvas;if(!e||!t)return;if(e.save(),e.clearRect(0,0,t.width,t.height),this._props.backgroundColor&&(e.fillStyle=this._props.backgroundColor,e.fillRect(0,0,t.width,t.height)),this._props.canvasBorderColor&&this._props.canvasBorderPx>0){e.strokeStyle=this._props.canvasBorderColor,e.lineWidth=this._props.canvasBorderPx;let n=this._props.canvasBorderPx/2;e.strokeRect(n,n,t.width-n*2,t.height-n*2)}let n=this._collectElements();for(let r of n){e.save();try{let n=r.computeRect(t.width,t.height),i=n.x+n.w*r.props.pivot[0],a=n.y+n.h*r.props.pivot[1];e.globalAlpha=r.props.opacity*this._props.opacity,e.translate(i,a),r.props.rotationDeg!==0&&e.rotate(r.props.rotationDeg*Math.PI/180),e.translate(-i,-a),r.drawTo(e,n)}catch{}e.restore()}e.restore(),this._texture&&(this._texture.needsUpdate=!0)}_collectElements(){let e=[];if(!this._actor)return e;let t=n=>{for(let t of n.components)t instanceof Pd&&t.props.visible&&e.push(t);for(let e of n.children)t(e)};for(let e of this._actor.children)t(e);return e.sort((e,t)=>e.props.layer-t.props.layer),e}_bindPointerHandlers(){if(this._pointerHandlersBound)return;let e=(this._actor?.scene?.runtime)?.context.canvas;e&&(e.addEventListener(`pointerdown`,this._onPointerDown),e.addEventListener(`pointerup`,this._onPointerUp),this._pointerHandlersBound=!0)}_unbindPointerHandlers(){if(!this._pointerHandlersBound)return;let e=(this._actor?.scene?.runtime)?.context.canvas;e?.removeEventListener(`pointerdown`,this._onPointerDown),e?.removeEventListener(`pointerup`,this._onPointerUp),this._pointerHandlersBound=!1}_handlePointer(e,t){if(!this._mesh||!this._canvas||!this._actor?.scene)return;let n=this._actor.scene,r=this._resolveCamera(n);if(!r)return;let i=n.runtime?.context.canvas;if(!i)return;let a=i.getBoundingClientRect(),o=new B((e.clientX-a.left)/a.width*2-1,-((e.clientY-a.top)/a.height*2-1)),s=new jl;s.setFromCamera(o,r);let c=s.intersectObject(this._mesh,!1);if(c.length===0||!c[0].uv)return;let l=c[0].uv,u=l.x*this._canvas.width,d=(1-l.y)*this._canvas.height,f=this._collectElements();for(let e=f.length-1;e>=0;e--){let n=f[e];if(!(n instanceof Ld))continue;let r=n.computeRect(this._canvas.width,this._canvas.height);if(u>=r.x&&u<=r.x+r.w&&d>=r.y&&d<=r.y+r.h){n.handlePointer(t);return}}}},Pd=class extends Zl{onSceneAttach(e){super.onSceneAttach(e),this._markCanvasDirty()}onSceneDetach(e){this._markCanvasDirty(),super.onSceneDetach(e)}onAttach(e){super.onAttach(e),this._markCanvasDirty()}onDetach(){this._markCanvasDirty(),super.onDetach()}onPropsChanged(){this._markCanvasDirty()}findOwningCanvas(){let e=this._actor?.parent;for(;e;){for(let t of e.components)if(t instanceof Nd)return t;e=e.parent}}_markCanvasDirty(){this.findOwningCanvas()?.markDirty()}computeRect(e,t){let n=this._props,r=n.width,i=n.height,a=0,o=0;switch(n.anchor){case`top-left`:a=n.offset[0],o=n.offset[1];break;case`top`:a=(e-r)/2+n.offset[0],o=n.offset[1];break;case`top-right`:a=e-r-n.offset[0],o=n.offset[1];break;case`left`:a=n.offset[0],o=(t-i)/2+n.offset[1];break;case`center`:a=(e-r)/2+n.offset[0],o=(t-i)/2+n.offset[1];break;case`right`:a=e-r-n.offset[0],o=(t-i)/2+n.offset[1];break;case`bottom-left`:a=n.offset[0],o=t-i-n.offset[1];break;case`bottom`:a=(e-r)/2+n.offset[0],o=t-i-n.offset[1];break;case`bottom-right`:a=e-r-n.offset[0],o=t-i-n.offset[1];break}return{x:a,y:o,w:r,h:i}}},Fd=class extends Pd{static typeName=`UICanvasTextComponent`;_resolvedFamily;_fontLoadToken=0;onSceneAttach(e){super.onSceneAttach(e),this._loadFontIfNeeded()}drawTo(e,t){let n=this._props,r=this._resolvedFamily?`"${this._resolvedFamily}", ${n.fontFamily}`:n.fontFamily;e.fillStyle=n.color,e.font=`${n.fontWeight} ${n.fontSizePx}px ${r}`,e.textBaseline=`top`;let i=n.text.split(`
`),a=n.fontSizePx*n.lineHeight,o=i.length*a,s=t.y;n.verticalAlign===`middle`?s=t.y+(t.h-o)/2:n.verticalAlign===`bottom`&&(s=t.y+t.h-o);for(let r of i){let i=e.measureText(r),o=t.x;n.textAlign===`center`?o=t.x+(t.w-i.width)/2:n.textAlign===`right`&&(o=t.x+t.w-i.width),e.fillText(r,o,s),s+=a}}_loadFontIfNeeded(){let e=this._props.fontAssetId;if(!e)return;let t=this._actor?.scene?.runtime?.context.loader;if(!t)return;let n=++this._fontLoadToken;t.loadFont(e).then(e=>{n===this._fontLoadToken&&(this._resolvedFamily=e,this._markCanvasDirty())}).catch(()=>void 0)}},Id=class extends Pd{static typeName=`UICanvasImageComponent`;_image;_loadedUrl;_loadToken=0;_objectUrl;onSceneAttach(e){super.onSceneAttach(e),this._refreshImage()}onDetach(){this._objectUrl&&URL.revokeObjectURL(this._objectUrl),this._objectUrl=void 0,this._image=void 0,super.onDetach()}onPropsChanged(){super.onPropsChanged(),this._refreshImage()}drawTo(e,t){let n=this._image;if(!n||!n.width||!n.height)return;let r=this._props,i=t.x,a=t.y,o=t.w,s=t.h;if(r.fit===`contain`||r.fit===`cover`){let e=n.width/n.height,c=t.w/t.h;(r.fit===`contain`?e>c:e<c)?(o=t.w,s=t.w/e):(s=t.h,o=t.h*e),i=t.x+(t.w-o)/2,a=t.y+(t.h-s)/2}else r.fit===`none`&&(o=n.width,s=n.height,i=t.x+(t.w-o)/2,a=t.y+(t.h-s)/2);e.drawImage(n,i,a,o,s),r.tintColor&&r.tintColor!==`#ffffff`&&(e.save(),e.globalCompositeOperation=`multiply`,e.fillStyle=r.tintColor,e.fillRect(i,a,o,s),e.restore())}async _refreshImage(){let e=this._props,t=++this._loadToken,n=e.url;if(e.imageAssetId){let t=this._actor?.scene?.runtime?.context.loader;if(t){let r=await t.getBlobUrl(e.imageAssetId).catch(()=>void 0);r&&(this._objectUrl&&this._objectUrl!==r&&URL.revokeObjectURL(this._objectUrl),this._objectUrl=r,n=r)}}if(t!==this._loadToken||!n)return;if(this._loadedUrl===n&&this._image){this._markCanvasDirty();return}if(typeof Image>`u`)return;let r=new Image;r.crossOrigin=`anonymous`,r.onload=()=>{t===this._loadToken&&(this._image=r,this._loadedUrl=n,this._markCanvasDirty())},r.onerror=()=>{t===this._loadToken&&(this._image=void 0)},r.src=n}},Ld=class extends Pd{static typeName=`UICanvasButtonComponent`;_pressed=!1;drawTo(e,t){let n=this._props,r=this._pressed&&!n.disabled?n.hoverBackgroundColor:n.backgroundColor;Bd(e,t.x,t.y,t.w,t.h,n.borderRadiusPx),e.fillStyle=r,e.globalAlpha*=n.disabled?.5:1,e.fill(),n.borderColor&&n.borderWidthPx>0&&(e.lineWidth=n.borderWidthPx,e.strokeStyle=n.borderColor,e.stroke()),e.fillStyle=n.color,e.font=`${n.fontWeight} ${n.fontSizePx}px ${n.fontFamily}`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(n.text,t.x+t.w/2,t.y+t.h/2)}handlePointer(e){if(!this._props.disabled){if(e===`down`){this._pressed=!0,this._markCanvasDirty();return}if(this._pressed&&this._actor){let e={actorId:this._actor.id,eventName:this._props.eventName};this._actor.components.forEach(t=>t.onEvent({name:`uiClick`,payload:e}))}this._pressed=!1,this._markCanvasDirty()}}},Rd=class extends Pd{static typeName=`UICanvasLoadingBarComponent`;drawTo(e,t){let n=this._props,r=zd(n.value);if(Bd(e,t.x,t.y,t.w,t.h,n.borderRadiusPx),e.fillStyle=n.backgroundColor,e.fill(),r>0){let i=t.x,a=t.y,o=t.w,s=t.h;n.direction===`horizontal`?o=t.w*r:(s=t.h*r,a=t.y+(t.h-s)),Bd(e,i,a,o,s,n.borderRadiusPx),e.fillStyle=n.fillColor,e.fill()}if(n.borderColor&&n.borderWidthPx>0&&(Bd(e,t.x,t.y,t.w,t.h,n.borderRadiusPx),e.strokeStyle=n.borderColor,e.lineWidth=n.borderWidthPx,e.stroke()),n.showLabel){let i=n.labelFormat===`percent`?`${Math.round(r*100)}%`:r.toFixed(Math.max(0,Math.floor(n.labelDecimals)));e.fillStyle=n.labelColor,e.font=`${n.fontWeight} ${n.fontSizePx}px ${n.fontFamily}`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(i,t.x+t.w/2,t.y+t.h/2)}}};function zd(e){return Number.isNaN(e)||e<0?0:e>1?1:e}function Bd(e,t,n,r,i,a){let o=Math.max(0,Math.min(a,Math.min(r,i)/2));e.beginPath(),e.moveTo(t+o,n),e.lineTo(t+r-o,n),e.quadraticCurveTo(t+r,n,t+r,n+o),e.lineTo(t+r,n+i-o),e.quadraticCurveTo(t+r,n+i,t+r-o,n+i),e.lineTo(t+o,n+i),e.quadraticCurveTo(t,n+i,t,n+i-o),e.lineTo(t,n+o),e.quadraticCurveTo(t,n,t+o,n),e.closePath()}var Vd=class extends Nd{static typeName=`CameraCanvasComponent`;get _cprops(){return this._props}_ownCamera;onAttach(e){super.onAttach(e),typeof console<`u`&&!e.getComponent($l)&&console.warn(`[FlameCore] CameraCanvasComponent attached to an actor without a CameraComponent. Add a CameraComponent first so the canvas can resolve its host camera.`);let t=this.mesh;t&&t.removeFromParent()}onSceneAttach(e){super.onSceneAttach(e),this._attachMeshToOwnCamera()}onSceneDetach(e){let t=this.mesh;t&&t.parent&&t.removeFromParent(),this._ownCamera=void 0,super.onSceneDetach(e)}onUpdate(e){this._ownCamera||this._attachMeshToOwnCamera(),this._ownCamera&&this._applyScreenAnchor(),this._dirty&&=(this._render(),!1)}_attachMeshToOwnCamera(){let e=this._actor;if(!e)return;let t=e.getComponent($l);if(!t||!t.camera)return;let n=this.mesh;n&&(n.parent!==t.camera&&(n.removeFromParent(),t.camera.add(n)),this._ownCamera=t.camera)}_applyScreenAnchor(){let e=this.mesh,t=this._ownCamera;if(!e||!t)return;let n=this._cprops,r=Math.max(.001,n.cameraDistance);if(e.position.set(0,0,-r),e.quaternion.identity(),n.screenAnchor===`fill`){let{halfW:i,halfH:a}=Hd(t,r);e.scale.set(i*2/n.widthWorld,a*2/n.heightWorld,1);return}let{halfW:i,halfH:a,viewportW:o,viewportH:s}=Hd(t,r,!0);if(!o||!s){e.scale.set(1,1,1);return}let c=i*2/o,l=a*2/s,[u,d]=n.screenSizePx;e.scale.set(u*c/n.widthWorld,d*l/n.heightWorld,1);let f=u*c/2,p=d*l/2,[m,h]=n.screenOffsetPx,g=0,_=0;switch(n.screenAnchor){case`top-left`:g=-i+f+m*c,_=a-p-h*l;break;case`top`:g=m*c,_=a-p-h*l;break;case`top-right`:g=i-f-m*c,_=a-p-h*l;break;case`left`:g=-i+f+m*c,_=h*l;break;case`center`:g=m*c,_=h*l;break;case`right`:g=i-f-m*c,_=h*l;break;case`bottom-left`:g=-i+f+m*c,_=-a+p+h*l;break;case`bottom`:g=m*c,_=-a+p+h*l;break;case`bottom-right`:g=i-f-m*c,_=-a+p+h*l;break}e.position.set(g,_,-r)}};function Hd(e,t,n=!1){let r=1,i=1;if(e.isPerspectiveCamera){let n=e,a=n.fov*Math.PI/180;i=Math.tan(a/2)*t,r=i*n.aspect}else if(e.isOrthographicCamera){let t=e;r=(t.right-t.left)/2,i=(t.top-t.bottom)/2}let a=0,o=0;return n&&typeof window<`u`&&(a=window.innerWidth,o=window.innerHeight),{halfW:r,halfH:i,viewportW:a,viewportH:o}}var Ud=class extends Zl{static typeName=`ParallaxLayerComponent`;_fallbackBase=[0,0,0];_hasFallbackBase=!1;onAttach(e){super.onAttach(e);let t=e.object3D.position;this._fallbackBase[0]=t.x,this._fallbackBase[1]=t.y,this._fallbackBase[2]=t.z,this._hasFallbackBase=!0,this._applyOffset()}onPropsChanged(){this._applyOffset()}get progress(){let{scrollStart:e,scrollEnd:t,clamp:n}=this._props,r=Wd(),i=t-e,a=i>0?(r-e)/i:0;return n&&(a=Math.max(0,Math.min(1,a))),a}onUpdate(e){this._applyOffset()}_applyOffset(){if(!this._actor)return;let e=this._readBasePosition(),t=this._currentOffset();this._actor.object3D.position.set(e[0]+t[0],e[1]+t[1],e[2]+t[2])}_readBasePosition(){if(!this._actor)return this._fallbackBase;let e=this._actor.getComponent(td);if(e){let t=e.props.position;return[t[0],t[1],t[2]]}return this._hasFallbackBase?this._fallbackBase:[0,0,0]}_currentOffset(){let{startOffset:e,endOffset:t,depth:n,axis:r}=this._props,i=this.progress;return Gd(r,(e[0]+(t[0]-e[0])*i)*n,(e[1]+(t[1]-e[1])*i)*n,(e[2]+(t[2]-e[2])*i)*n)}};function Wd(){return typeof window>`u`?0:window.scrollY??0}function Gd(e,t,n,r){switch(e){case`x`:return[t,0,0];case`y`:return[0,n,0];case`z`:return[0,0,r];default:return[t,n,r]}}var Kd=class extends Zl{static typeName=`ParallaxStoryComponent`;_previousMinHeight;_appliedHeight=!1;onAttach(e){super.onAttach(e),this._applyPageHeight()}onDetach(){this._restorePageHeight(),super.onDetach()}onPropsChanged(){this._applyPageHeight()}setScrollHeight(e){this.setProps({scrollHeightPx:Math.max(0,e)})}_applyPageHeight(){let e=qd();if(!e)return;let{applyPageHeight:t,scrollHeightPx:n}=this._props;if(!t||n<=0){this._restorePageHeight();return}this._appliedHeight||=(this._previousMinHeight=e.style.minHeight,!0),e.style.minHeight=`${Math.round(n)}px`}_restorePageHeight(){if(!this._appliedHeight)return;let e=qd();e&&(e.style.minHeight=this._previousMinHeight??``),this._appliedHeight=!1,this._previousMinHeight=void 0}};function qd(){if(!(typeof document>`u`||!document.body))return document.body}var Jd=class extends Zl{static typeName=`SceneInstanceComponent`;_hostScene;_instance;get instance(){return this._instance}get isLoaded(){return this._instance!==void 0}onSceneAttach(e){super.onSceneAttach(e),this._hostScene=e,(this._props.mode===`embedded`||this._props.autoActivateOnParentEnter)&&this.loadInstance()}onSceneDetach(e){this.unloadInstance(),this._hostScene=void 0,super.onSceneDetach(e)}onDetach(){this.unloadInstance(),this._hostScene=void 0,super.onDetach()}onPropsChanged(){let e=this.isLoaded;this.unloadInstance(),(e||this._props.mode===`embedded`)&&this.loadInstance()}loadInstance(){if(this._instance||!this._actor||!this._hostScene)return;let{sceneAssetId:e}=this._props;if(!e)return;let t=this._hostScene.runtime;if(!t)return;if(this._hostScene._ancestorAssetIds.has(e)){console.warn(`[SceneInstanceComponent] Refusing to instantiate scene "${e}": cyclic nesting detected.`);return}let n=t.sceneResolver;if(!n){console.warn(`[SceneInstanceComponent] No sceneResolver set on the runtime; cannot instantiate nested scene "${e}".`);return}let r=n(e);if(!r){console.warn(`[SceneInstanceComponent] Scene asset "${e}" could not be resolved; the host scene continues without it.`);return}let i;try{i=Qu(r)}catch(t){console.warn(`[SceneInstanceComponent] Failed to deserialize scene "${e}":`,t);return}i.nested=!0,i._ancestorAssetIds=new Set([...this._hostScene._ancestorAssetIds,e]),this._props.layerOverride!==void 0&&(i.renderOrder=this._props.layerOverride),this._actor.object3D.add(i.threeScene),this._instance=i,t.registerNestedScene(i)}unloadInstance(){let e=this._instance;e&&(this._instance=void 0,(e.runtime??this._hostScene?.runtime)?.unregisterNestedScene(e),this._actor&&this._actor.object3D.remove(e.threeScene),e.dispose())}},Yd=class extends Zl{static typeName=`PhysicsConstraintComponent`;_jointHandle;onPropsChanged(){this._jointHandle=void 0}},Xd=class{capacity;count=0;posX;posY;posZ;velX;velY;velZ;r;g;b;a;size;rotation;age;life;seed;startSize;startR;startG;startB;startA;constructor(e){this.capacity=Math.max(1,Math.floor(e));let t=this.capacity;this.posX=new Float32Array(t),this.posY=new Float32Array(t),this.posZ=new Float32Array(t),this.velX=new Float32Array(t),this.velY=new Float32Array(t),this.velZ=new Float32Array(t),this.r=new Float32Array(t),this.g=new Float32Array(t),this.b=new Float32Array(t),this.a=new Float32Array(t),this.size=new Float32Array(t),this.rotation=new Float32Array(t),this.age=new Float32Array(t),this.life=new Float32Array(t),this.seed=new Float32Array(t),this.startSize=new Float32Array(t),this.startR=new Float32Array(t),this.startG=new Float32Array(t),this.startB=new Float32Array(t),this.startA=new Float32Array(t)}spawn(){if(this.count>=this.capacity)return-1;let e=this.count++;return this.posX[e]=0,this.posY[e]=0,this.posZ[e]=0,this.velX[e]=0,this.velY[e]=0,this.velZ[e]=0,this.r[e]=1,this.g[e]=1,this.b[e]=1,this.a[e]=1,this.size[e]=1,this.rotation[e]=0,this.age[e]=0,this.life[e]=1,this.seed[e]=Math.random(),e}kill(e){let t=this.count-1;e<0||e>t||(e!==t&&(this.posX[e]=this.posX[t],this.posY[e]=this.posY[t],this.posZ[e]=this.posZ[t],this.velX[e]=this.velX[t],this.velY[e]=this.velY[t],this.velZ[e]=this.velZ[t],this.r[e]=this.r[t],this.g[e]=this.g[t],this.b[e]=this.b[t],this.a[e]=this.a[t],this.size[e]=this.size[t],this.rotation[e]=this.rotation[t],this.age[e]=this.age[t],this.life[e]=this.life[t],this.seed[e]=this.seed[t],this.startSize[e]=this.startSize[t],this.startR[e]=this.startR[t],this.startG[e]=this.startG[t],this.startB[e]=this.startB[t],this.startA[e]=this.startA[t]),this.count--)}captureStartValues(e){this.startSize[e]=this.size[e],this.startR[e]=this.r[e],this.startG[e]=this.g[e],this.startB[e]=this.b[e],this.startA[e]=this.a[e]}};function Zd(e,t,n){let r=e[t];return typeof r==`number`&&Number.isFinite(r)?r:n}function Qd(e,t,n){let r=e[t];return Array.isArray(r)&&r.length>=3?[Number(r[0])||0,Number(r[1])||0,Number(r[2])||0]:n}function $d(e,t,n){let r=e[t];return Array.isArray(r)&&r.length>=4?[Number(r[0])||0,Number(r[1])||0,Number(r[2])||0,Number(r[3])||0]:n}function ef(e,t){if(e.length===0)return[1,1,1,1];if(t<=e[0].t)return[...e[0].rgba];let n=e[e.length-1];if(t>=n.t)return[...n.rgba];for(let n=0;n<e.length-1;n++){let r=e[n],i=e[n+1];if(t>=r.t&&t<=i.t){let e=i.t===r.t?0:(t-r.t)/(i.t-r.t);return[r.rgba[0]+(i.rgba[0]-r.rgba[0])*e,r.rgba[1]+(i.rgba[1]-r.rgba[1])*e,r.rgba[2]+(i.rgba[2]-r.rgba[2])*e,r.rgba[3]+(i.rgba[3]-r.rgba[3])*e]}}return[...n.rgba]}function tf(e,t){if(e.length===0)return 1;if(t<=e[0].t)return e[0].value;let n=e[e.length-1];if(t>=n.t)return n.value;for(let n=0;n<e.length-1;n++){let r=e[n],i=e[n+1];if(t>=r.t&&t<=i.t){let e=i.t===r.t?0:(t-r.t)/(i.t-r.t);return r.value+(i.value-r.value)*e}}return n.value}var nf={InitPositionSphere:{init(e,t,n,r){let i=Zd(n,`radius`,.5),a=r.random(),o=r.random(),s=r.random(),c=a*Math.PI*2,l=Math.acos(2*o-1),u=i*Math.cbrt(s);e.posX[t]+=u*Math.sin(l)*Math.cos(c),e.posY[t]+=u*Math.sin(l)*Math.sin(c),e.posZ[t]+=u*Math.cos(l)}},InitPositionBox:{init(e,t,n,r){let i=Qd(n,`extents`,[.5,.5,.5]);e.posX[t]+=(r.random()*2-1)*i[0],e.posY[t]+=(r.random()*2-1)*i[1],e.posZ[t]+=(r.random()*2-1)*i[2]}},InitVelocityCone:{init(e,t,n,r){let i=Zd(n,`angleDeg`,25)*Math.PI/180,a=Zd(n,`speedMin`,1)+r.random()*(Zd(n,`speedMax`,2)-Zd(n,`speedMin`,1)),o=r.random()*Math.PI*2,s=r.random()*i,c=Math.sin(s);e.velX[t]+=a*c*Math.cos(o),e.velY[t]+=a*Math.cos(s),e.velZ[t]+=a*c*Math.sin(o)}},InitVelocityRandomSphere:{init(e,t,n,r){let i=Zd(n,`speedMin`,1)+r.random()*(Zd(n,`speedMax`,2)-Zd(n,`speedMin`,1)),a=r.random()*Math.PI*2,o=Math.acos(2*r.random()-1);e.velX[t]+=i*Math.sin(o)*Math.cos(a),e.velY[t]+=i*Math.sin(o)*Math.sin(a),e.velZ[t]+=i*Math.cos(o)}},InitSizeRandomBetween:{init(e,t,n,r){let i=Zd(n,`min`,.1),a=Zd(n,`max`,.3);e.size[t]=i+r.random()*(a-i),e.startSize[t]=e.size[t]}},InitColorRandomBetween:{init(e,t,n,r){let i=$d(n,`colorA`,[1,1,1,1]),a=$d(n,`colorB`,[1,1,1,1]),o=r.random();e.r[t]=i[0]+(a[0]-i[0])*o,e.g[t]=i[1]+(a[1]-i[1])*o,e.b[t]=i[2]+(a[2]-i[2])*o,e.a[t]=i[3]+(a[3]-i[3])*o,e.captureStartValues(t)}},InitLifetimeRandomBetween:{init(e,t,n,r){let i=Zd(n,`min`,1),a=Zd(n,`max`,2);e.life[t]=Math.max(1e-4,i+r.random()*(a-i))}},ApplyGravity:{update(e,t,n,r,i){let a=Zd(r,`scale`,1);e.velX[t]+=i.gravity[0]*a*n,e.velY[t]+=i.gravity[1]*a*n,e.velZ[t]+=i.gravity[2]*a*n}},ApplyForce:{update(e,t,n,r){let i=Qd(r,`force`,[0,0,0]);e.velX[t]+=i[0]*n,e.velY[t]+=i[1]*n,e.velZ[t]+=i[2]*n}},Drag:{update(e,t,n,r){let i=Zd(r,`drag`,.5),a=Math.max(0,1-i*n);e.velX[t]*=a,e.velY[t]*=a,e.velZ[t]*=a}},VelocityIntegration:{update(e,t,n){e.posX[t]+=e.velX[t]*n,e.posY[t]+=e.velY[t]*n,e.posZ[t]+=e.velZ[t]*n}},ColorOverLife:{update(e,t,n,r){let[i,a,o,s]=ef(r.stops??[],e.life[t]>0?e.age[t]/e.life[t]:1);e.r[t]=i,e.g[t]=a,e.b[t]=o,e.a[t]=s}},SizeOverLife:{update(e,t,n,r){let i=r.stops??[],a=e.life[t]>0?e.age[t]/e.life[t]:1;e.size[t]=e.startSize[t]*tf(i,a)}},LifetimeKill:{}};function rf(e){return nf[e]}function af(e){let t=e>>>0;return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var of=`
  attribute vec4 aColor;
  attribute float aSize;
  varying vec4 vColor;
  uniform float uScale;
  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale * (300.0 / max(0.001, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`,sf=`
  varying vec4 vColor;
  uniform sampler2D uTexture;
  uniform bool uHasTexture;
  void main() {
    vec2 uv = gl_PointCoord;
    float alpha = vColor.a;
    if (uHasTexture) {
      vec4 tex = texture2D(uTexture, uv);
      gl_FragColor = vec4(vColor.rgb * tex.rgb, alpha * tex.a);
    } else {
      // Soft radial falloff for a glowing dot.
      float d = length(uv - vec2(0.5));
      float soft = smoothstep(0.5, 0.0, d);
      gl_FragColor = vec4(vColor.rgb, alpha * soft);
    }
    if (gl_FragColor.a < 0.003) discard;
  }
`,cf=class{def;buffer;object3D;_rng;_spawnAccumulator=0;_burstTimer=0;_emitterAge=0;_active=!0;_points;_geometry;_material;_colorAttr;_sizeAttr;_posAttr;_instanced;_tmpMatrix=new W;_tmpColor=new G;_tmpQuat=new nt;_tmpScale=new U;_tmpPos=new U;constructor(e,t){this.def=e;let n=Math.max(1,Math.floor(e.capacity));this.buffer=new Xd(n),this._rng=af(t^uf(e.name)),e.renderer===`mesh`?this.object3D=this._createMeshRenderer(n):(e.renderer===`ribbon`&&console.warn(`[ParticleSystem] Ribbon renderer is not implemented in v1; emitter "${e.name}" falls back to sprites.`),this.object3D=this._createSpriteRenderer(n)),this.object3D.frustumCulled=!1}get isFinished(){return!this._active&&this.buffer.count===0}reset(){this.buffer.count=0,this._spawnAccumulator=0,this._burstTimer=0,this._emitterAge=0,this._active=!0}update(e,t,n,r,i,a){let o={random:this._rng,gravity:r,globals:i};this._emitterAge+=e;let s=this.def.spawn.duration;if(s>0&&this._emitterAge>=s&&(this.def.spawn.looping?this._emitterAge%=s:this._active=!1),this._active&&this.def.enabled){this._spawnAccumulator+=Math.max(0,this.def.spawn.rate)*a*e;let r=Math.floor(this._spawnAccumulator);this._spawnAccumulator-=r;let i=this.def.spawn.burstCount??0,s=this.def.spawn.burstInterval??0;if(i>0&&s>0)for(this._burstTimer+=e;this._burstTimer>=s;)this._burstTimer-=s,r+=i;for(let e=0;e<r;e++){let e=this.buffer.spawn();if(e<0)break;this.buffer.seed[e]=this._rng(),n===`world`&&(this.buffer.posX[e]=t[0],this.buffer.posY[e]=t[1],this.buffer.posZ[e]=t[2]);for(let t of this.def.initialModules)rf(t.type)?.init?.(this.buffer,e,t.params,o);this.buffer.captureStartValues(e)}}let c=this.buffer;for(let t=0;t<c.count;){c.age[t]+=e;for(let n of this.def.updateModules)rf(n.type)?.update?.(c,t,e,n.params,o);if(c.age[t]>=c.life[t]){c.kill(t);continue}t++}this._uploadToGpu()}dispose(){this._geometry?.dispose(),this._material?.dispose(),this._instanced&&(this._instanced.geometry.dispose(),this._instanced.material.dispose()),this.object3D.parent?.remove(this.object3D)}_createSpriteRenderer(e){let t=new Hn,n=new Float32Array(e*3),r=new Float32Array(e*4),i=new Float32Array(e);this._posAttr=new jn(n,3),this._colorAttr=new jn(r,4),this._sizeAttr=new jn(i,1),this._posAttr.setUsage(le),this._colorAttr.setUsage(le),this._sizeAttr.setUsage(le),t.setAttribute(`position`,this._posAttr),t.setAttribute(`aColor`,this._colorAttr),t.setAttribute(`aSize`,this._sizeAttr),t.setDrawRange(0,0);let a=new gr({uniforms:{uScale:{value:1},uTexture:{value:null},uHasTexture:{value:!1}},vertexShader:of,fragmentShader:sf,transparent:!0,depthWrite:!1,blending:this.def.sprite?.blend===`normal`?1:2});this._geometry=t,this._material=a;let o=new Ts(t,a);return o.name=`Emitter:${this.def.name}`,this._points=o,o}_createMeshRenderer(e){let t=new cs(new cr(1,1,1),new lc({color:16777215}),e);return t.instanceMatrix.setUsage(le),t.count=0,t.name=`Emitter:${this.def.name}`,this._instanced=t,t}_uploadToGpu(){let e=this.buffer;if(this._points&&this._posAttr&&this._colorAttr&&this._sizeAttr){let t=this._posAttr.array,n=this._colorAttr.array,r=this._sizeAttr.array;for(let i=0;i<e.count;i++)t[i*3]=e.posX[i],t[i*3+1]=e.posY[i],t[i*3+2]=e.posZ[i],n[i*4]=e.r[i],n[i*4+1]=e.g[i],n[i*4+2]=e.b[i],n[i*4+3]=e.a[i],r[i]=e.size[i];this._posAttr.needsUpdate=!0,this._colorAttr.needsUpdate=!0,this._sizeAttr.needsUpdate=!0,this._geometry?.setDrawRange(0,e.count);return}if(this._instanced){for(let t=0;t<e.count;t++)this._tmpPos.set(e.posX[t],e.posY[t],e.posZ[t]),this._tmpQuat.setFromAxisAngle(lf,e.rotation[t]),this._tmpScale.setScalar(e.size[t]),this._tmpMatrix.compose(this._tmpPos,this._tmpQuat,this._tmpScale),this._instanced.setMatrixAt(t,this._tmpMatrix),this._tmpColor.setRGB(e.r[t],e.g[t],e.b[t]),this._instanced.setColorAt(t,this._tmpColor);this._instanced.count=e.count,this._instanced.instanceMatrix.needsUpdate=!0,this._instanced.instanceColor&&(this._instanced.instanceColor.needsUpdate=!0)}}},lf=new U(0,1,0);function uf(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return t>>>0}function df(e={}){let t={_version:1,autoPlay:e.autoPlay??!0,playbackSpeed:e.playbackSpeed??1,emissionRateScale:e.emissionRateScale??1};return e.particleSystemAssetId&&(t.particleSystemAssetId=e.particleSystemAssetId),e.simulationSpaceOverride&&(t.simulationSpaceOverride=e.simulationSpaceOverride),e.loopModeOverride&&(t.loopModeOverride=e.loopModeOverride),t}var ff=class extends Zl{static typeName=`ParticleSystemComponent`;_scene;_asset;_emitters=[];_playing=!1;_built=!1;_globals=new Map;_worldPos=new U;_masterSeed=1;constructor(e){super(df(e))}get isPlaying(){return this._playing}get asset(){return this._asset}get emitters(){return this._emitters}get liveParticleCount(){let e=0;for(let t of this._emitters)e+=t.buffer.count;return e}onSceneAttach(e){if(super.onSceneAttach(e),this._scene=e,(e.runtime?.systems.find(e=>e.name===`ParticleSystem`))?.register(this),!this._asset&&this._props.particleSystemAssetId){let t=e.runtime?.particleResolver,n=t?.(this._props.particleSystemAssetId);n?this._asset=n:t&&console.warn(`[ParticleSystem] Could not resolve particle asset "${this._props.particleSystemAssetId}" for actor "${this._actor?.name??`?`}".`)}this._ensureBuilt(),this._props.autoPlay&&this.play()}onSceneDetach(e){(e.runtime?.systems.find(e=>e.name===`ParticleSystem`))?.unregister(this),this._teardown(),this._scene=void 0,super.onSceneDetach(e)}onDetach(){this._teardown(),super.onDetach()}setAsset(e){let t=this._playing;this._teardown(),this._asset=e,this._ensureBuilt(),(t||this._props.autoPlay)&&this.play()}play(){this._ensureBuilt(),this._emitters.length!==0&&(this._playing=!0)}pause(){this._playing=!1}stop(){this._playing=!1;for(let e of this._emitters)e.reset()}restart(){for(let e of this._emitters)e.reset();this._playing=!0}setParameter(e,t){this._globals.set(e,t)}_tick(e){if(!this._playing||this._emitters.length===0)return;let t=e*Math.max(0,Math.min(8,this._props.playbackSpeed));if(t<=0)return;let n=Math.max(0,Math.min(16,this._props.emissionRateScale)),r=this._effectiveSpace(),i=this._gravity(),a=[0,0,0];r===`world`&&this._actor&&(this._actor.object3D.getWorldPosition(this._worldPos),a=[this._worldPos.x,this._worldPos.y,this._worldPos.z]);for(let e of this._emitters)e.update(t,a,r,i,this._globals,n)}_ensureBuilt(){if(this._built||!this._asset||!this._actor)return;let e=this._effectiveSpace(),t=this._scene?.threeScene;for(let n of this._asset.emitters){if(!n.enabled)continue;let r=new cf(n,this._masterSeed);(n.simulationSpaceOverride??e)===`world`&&t?t.add(r.object3D):this._actor.object3D.add(r.object3D),this._emitters.push(r)}this._built=!0}_teardown(){this._playing=!1;for(let e of this._emitters)e.dispose();this._emitters=[],this._built=!1}_effectiveSpace(){return this._props.simulationSpaceOverride??this._asset?.simulationSpace??`world`}_gravity(){let e=this._globals.get(`gravity`);return Array.isArray(e)&&e.length>=3?[Number(e[0])||0,Number(e[1])||0,Number(e[2])||0]:[0,-9.81,0]}onPropsChanged(){if(this._built&&this._scene){let e=this._playing;this._teardown(),this._ensureBuilt(),e&&this.play()}}};function pf(e){return new gr({uniforms:{color:{value:e?.color??new G(65535)},time:{value:0},scanlineSpeed:{value:e?.scanlineSpeed??1},flickerSpeed:{value:e?.flickerSpeed??3},opacity:{value:1}},vertexShader:`
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-worldPos.xyz);
        gl_Position = projectionMatrix * worldPos;
      }
    `,fragmentShader:`
      uniform vec3  color;
      uniform float time;
      uniform float scanlineSpeed;
      uniform float flickerSpeed;
      uniform float opacity;
      varying vec2  vUv;
      varying vec3  vNormal;
      varying vec3  vViewDir;

      void main() {
        float scan = step(0.5, fract(vUv.y * 80.0 - time * scanlineSpeed));
        float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 2.0);
        float flicker = 0.85 + 0.15 * sin(time * flickerSpeed * 6.28);
        float alpha = (0.3 + 0.3 * scan + 0.4 * fresnel) * flicker * opacity;
        gl_FragColor = vec4(color, alpha);
      }
    `,transparent:!0,side:2,depthWrite:!1})}function mf(e){return new gr({uniforms:{color:{value:e?.color??new G(26367)},time:{value:0},pulseSpeed:{value:e?.pulseSpeed??2},hexScale:{value:e?.hexScale??8},impactPos:{value:new U(0,0,0)},impactTime:{value:-999}},vertexShader:`
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-worldPos.xyz);
        gl_Position = projectionMatrix * worldPos;
      }
    `,fragmentShader:`
      uniform vec3  color;
      uniform float time;
      uniform float pulseSpeed;
      uniform float hexScale;
      varying vec2  vUv;
      varying vec3  vNormal;
      varying vec3  vViewDir;

      float hexDist(vec2 p) {
        p = abs(p);
        return max(dot(p, normalize(vec2(1.0, 1.73))), p.x);
      }

      void main() {
        vec2 hexUv = vUv * hexScale;
        hexUv.y *= 0.866;
        vec2 gridUv = fract(hexUv) - 0.5;
        float h = hexDist(gridUv);
        float hexLine = smoothstep(0.45, 0.5, h) - smoothstep(0.5, 0.55, h);
        float pulse = 0.5 + 0.5 * sin(time * pulseSpeed * 6.28);
        float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 3.0);
        float alpha = (hexLine * 0.6 + fresnel * 0.4) * (0.6 + 0.4 * pulse);
        gl_FragColor = vec4(color, alpha * 0.8);
      }
    `,transparent:!0,side:2,depthWrite:!1})}function hf(e){return new gr({uniforms:{colorInner:{value:e?.colorInner??new G(8913151)},colorOuter:{value:e?.colorOuter??new G(52428)},time:{value:0},speed:{value:e?.speed??1},noiseScale:{value:e?.noiseScale??3}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform vec3  colorInner;
      uniform vec3  colorOuter;
      uniform float time;
      uniform float speed;
      uniform float noiseScale;
      varying vec2  vUv;

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv - 0.5;
        float dist = length(uv);
        float angle = atan(uv.y, uv.x);
        float swirl = angle + time * speed + dist * noiseScale;
        float n = noise(vec2(swirl * 0.5, dist * 3.0));
        float ring = smoothstep(0.45, 0.5, dist) * smoothstep(0.55, 0.5, dist);
        float vortex = smoothstep(0.4, 0.0, dist) * (0.5 + 0.5 * sin(swirl * 6.0 + n));
        vec3 col = mix(colorInner, colorOuter, dist * 2.0);
        float alpha = (ring * 0.8 + vortex * 0.9) * smoothstep(0.55, 0.4, dist);
        gl_FragColor = vec4(col, alpha);
      }
    `,transparent:!0,side:2,depthWrite:!1})}var gf=class extends Zl{static typeName=`ShaderEffectComponent`;_meshRenderer;_originalMaterial;_shaderMaterial;_time=0;onAttach(e){super.onAttach(e),this._meshRenderer=e.getComponent(od),this._applyEffect()}onDetach(){this._restoreMaterial(),super.onDetach()}onUpdate(e){this._props.effect===`none`||!this._shaderMaterial||(this._time+=e*(this._props.speed??1),this._shaderMaterial.uniforms.time.value=this._time)}onPropsChanged(){this._applyEffect()}_applyEffect(){let e=this._meshRenderer?.mesh;if(!e)return;if(this._props.effect===`none`){this._restoreMaterial();return}if(!this._originalMaterial){let t=e.material;this._originalMaterial=Array.isArray(t)?t[0]:t}let t=new G(this._props.color?.[0]??0,this._props.color?.[1]??1,this._props.color?.[2]??1);(!this._shaderMaterial||this._shaderMaterial.userData.effect!==this._props.effect)&&(this._shaderMaterial?.dispose(),this._shaderMaterial=this._props.effect===`hologram`?pf({color:t,scanlineSpeed:this._props.scanlineSpeed,flickerSpeed:this._props.flickerSpeed}):this._props.effect===`energy-shield`?mf({color:t,hexScale:this._props.hexScale}):hf({noiseScale:this._props.noiseScale}),this._shaderMaterial.userData.effect=this._props.effect,this._disposables.push(this._shaderMaterial)),this._shaderMaterial.uniforms.opacity&&(this._shaderMaterial.uniforms.opacity.value=this._props.intensity??1),this._shaderMaterial.uniforms.color&&(this._shaderMaterial.uniforms.color.value=t),e.material=this._shaderMaterial}_restoreMaterial(){let e=this._meshRenderer?.mesh;e&&this._originalMaterial&&(e.material=this._originalMaterial),this._originalMaterial=void 0}},_f=class extends Zl{static typeName=`MaskWipeComponent`;_meshRenderer;_originalMaterial;_maskMaterial;onAttach(e){super.onAttach(e),this._meshRenderer=e.getComponent(od),this._rebuildMaterial()}onDetach(){this._restoreMaterial(),super.onDetach()}onPropsChanged(){this._patchUniforms()}_rebuildMaterial(){let e=this._meshRenderer?.mesh;if(e){if(!this._originalMaterial){let t=e.material;this._originalMaterial=Array.isArray(t)?t[0]:t}this._maskMaterial||(this._maskMaterial=new gr({uniforms:{map:{value:e.material.map??null},progress:{value:this._props.progress},softness:{value:this._props.softness},shapeMode:{value:this._shapeMode(this._props.shape)},baseColor:{value:new G(this._meshRenderer?.props.color[0]??1,this._meshRenderer?.props.color[1]??1,this._meshRenderer?.props.color[2]??1)}},vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,fragmentShader:`
          uniform sampler2D map;
          uniform float progress;
          uniform float softness;
          uniform float shapeMode;
          uniform vec3 baseColor;
          varying vec2 vUv;

          void main() {
            vec4 tex = texture2D(map, vUv);
            vec3 rgb = tex.a > 0.001 ? tex.rgb : baseColor;
            float alpha = tex.a > 0.001 ? tex.a : 1.0;
            float mask = 1.0;
            if (shapeMode < 0.5) {
              float dist = length(vUv - 0.5) * 2.0;
              mask = smoothstep(progress + softness, progress - softness, dist);
            } else if (shapeMode < 1.5) {
              float mx = smoothstep(progress + softness, progress - softness, abs(vUv.x - 0.5) * 2.0);
              float my = smoothstep(progress + softness, progress - softness, abs(vUv.y - 0.5) * 2.0);
              mask = mx * my;
            } else if (shapeMode < 2.5) {
              float d = vUv.x + vUv.y;
              mask = smoothstep(progress * 2.0 - softness, progress * 2.0 + softness, d);
            } else {
              float d = (1.0 - vUv.x) + vUv.y;
              mask = smoothstep(progress * 2.0 - softness, progress * 2.0 + softness, d);
            }
            gl_FragColor = vec4(rgb, alpha * mask);
          }
        `,transparent:!0,side:2}),this._disposables.push(this._maskMaterial)),e.material=this._maskMaterial,this._patchUniforms()}}_shapeMode(e){switch(e){case`rectangle`:return 1;case`diagonal-left`:return 2;case`diagonal-right`:return 3;default:return 0}}_patchUniforms(){this._maskMaterial&&(this._maskMaterial.uniforms.progress.value=this._props.progress,this._maskMaterial.uniforms.softness.value=this._props.softness,this._maskMaterial.uniforms.shapeMode.value=this._shapeMode(this._props.shape))}_restoreMaterial(){let e=this._meshRenderer?.mesh;e&&this._originalMaterial&&(e.material=this._originalMaterial),this._originalMaterial=void 0}},vf=class extends Zl{static typeName=`WeaponTrailComponent`;_mesh;_geometry;_positions=[];_writeIndex=0;_pointCount=0;onAttach(e){super.onAttach(e);let t=Math.max(4,this._props.maxPoints);this._geometry=new Hn;let n=t*2;this._geometry.setAttribute(`position`,new jn(new Float32Array(n*3),3)),this._geometry.setAttribute(`color`,new jn(new Float32Array(n*3),3));let r=new Cn({vertexColors:!0,transparent:!0,depthWrite:!1,side:2});this._mesh=new K(this._geometry,r),this._mesh.visible=!1,this._mesh.frustumCulled=!1,e.object3D.add(this._mesh),this._disposables.push(this._geometry,r)}onDetach(){this._mesh&&=(this._mesh.removeFromParent(),void 0),this._geometry=void 0,super.onDetach()}onUpdate(e){if(!this._mesh||!this._geometry||!this._actor)return;if(!this._props.enabled){this._mesh.visible=!1,this._positions=[],this._pointCount=0,this._writeIndex=0;return}this._mesh.visible=!0;let t=new U;this._actor.object3D.getWorldPosition(t),this._positions.length<this._props.maxPoints?(this._positions.push(t.clone()),this._pointCount=this._positions.length):(this._positions[this._writeIndex].copy(t),this._writeIndex=(this._writeIndex+1)%this._props.maxPoints,this._pointCount=this._props.maxPoints),this._uploadRibbon()}onPropsChanged(){!this._props.enabled&&this._mesh&&(this._mesh.visible=!1,this._positions=[],this._pointCount=0)}_uploadRibbon(){if(!this._geometry||this._pointCount<2)return;let e=this._geometry.getAttribute(`position`),t=this._geometry.getAttribute(`color`),n=this._props.width*.5,[r,i,a]=this._props.color,o=this._props.emissiveIntensity,s=0;for(let c=0;c<this._pointCount-1;c++){let l=this._samplePoint(c),u=this._samplePoint(c+1),d=u.clone().sub(l);if(d.lengthSq()<1e-8)continue;d.normalize();let f=new U(-d.y,d.x,-d.z).normalize().multiplyScalar(n);f.lengthSq()<1e-8&&f.set(n,0,0);let p=1-c/Math.max(1,this._pointCount-1),m=1-(c+1)/Math.max(1,this._pointCount-1),h=[l.clone().add(f),l.clone().sub(f),u.clone().add(f),u.clone().sub(f)],g=[p,p,m,m];for(let n=0;n<4;n++){let c=h[n],l=g[n];e.setXYZ(s,c.x,c.y,c.z),t.setXYZ(s,r*o*l,i*o*l,a*o*l),s++}}e.needsUpdate=!0,t.needsUpdate=!0,this._geometry.setDrawRange(0,s)}_samplePoint(e){if(this._positions.length<this._props.maxPoints)return this._positions[e];let t=(this._writeIndex+e)%this._props.maxPoints;return this._positions[t]}};Y(td),Y(od),Y($l),Y(cd),Y(ud),Y(eu),Y(dd),Y(fd),Y(hd),Y(_d),Y(bd),Y(nu),Y(Sd),Y(Cd),Y(Od),Y(kd),Y(Ad),Y(jd),Y(Md),Y(Nd),Y(Vd),Y(Fd),Y(Id),Y(Ld),Y(Rd),Y(Ud),Y(Kd),Y(Jd),Y(Yd),Y(ff),Y(gf),Y(_f),Y(vf);var yf={id:`house`,groundColor:3814720,skyColor:14212328,hemiIntensity:.42,keyColor:16774376,keyIntensity:.95,keyDirection:new U(.35,.85,.38).normalize(),ambientBoost:10133680,ambientIntensity:.28,envMapIntensity:.72},bf={id:`apartment-office`,groundColor:2764864,skyColor:13161708,hemiIntensity:.38,keyColor:15790847,keyIntensity:.88,keyDirection:new U(.25,.9,.32).normalize(),ambientBoost:8949928,ambientIntensity:.26,envMapIntensity:.68};new Map([[yf.id,yf],[bf.id,bf]]);function xf(e,t){let n=new ei(e);n.compileEquirectangularShader();let r=new Fo;r.background=new G(t.skyColor);let i=new Vc(t.skyColor,t.groundColor,t.hemiIntensity*1.4);r.add(i);let a=new el(t.keyColor,t.keyIntensity*1.1);a.position.copy(t.keyDirection).multiplyScalar(12),r.add(a);let o=new el(t.ambientBoost,t.ambientIntensity*1.2);o.position.set(-t.keyDirection.x,t.keyDirection.y*.35,-t.keyDirection.z),r.add(o);let s=n.fromScene(r,.04).texture;return n.dispose(),s}var Sf=new class{_byComponent=new Map;register(e){let t=this._byComponent.get(e.componentType)??[],n=t.findIndex(t=>t.propertyPath===e.propertyPath);n>=0?t[n]=e:t.push(e),this._byComponent.set(e.componentType,t)}list(e){return this._byComponent.get(e)??[]}get(e,t){return this._byComponent.get(e)?.find(e=>e.propertyPath===t)}componentTypes(){return[...this._byComponent.keys()]}clear(){this._byComponent.clear()}};function X(e,t,n,r,i){Sf.register({componentType:e,propertyPath:t,valueType:n,label:r,min:i?.min,max:i?.max})}function Cf(){if(!wf){wf=!0,X(`TransformComponent`,`position`,`vec3`,`Position`),X(`TransformComponent`,`rotation`,`vec3`,`Rotation`),X(`TransformComponent`,`scale`,`vec3`,`Scale`),X(`LightComponent`,`intensity`,`number`,`Intensity`,{min:0,max:10}),X(`LightComponent`,`color`,`color`,`Color`),X(`LightComponent`,`distance`,`number`,`Distance`,{min:0,max:100}),X(`CameraComponent`,`fov`,`number`,`FOV`,{min:10,max:120}),X(`CameraComponent`,`near`,`number`,`Near`),X(`CameraComponent`,`far`,`number`,`Far`),X(`MeshRendererComponent`,`color`,`color`,`Color`),X(`MeshRendererComponent`,`metalness`,`number`,`Metalness`,{min:0,max:1}),X(`MeshRendererComponent`,`roughness`,`number`,`Roughness`,{min:0,max:1}),X(`MeshRendererComponent`,`opacity`,`number`,`Opacity`,{min:0,max:1}),X(`MeshRendererComponent`,`emissiveIntensity`,`number`,`Emissive`,{min:0,max:10}),X(`MeshRendererComponent`,`glitchIntensity`,`number`,`Glitch`,{min:0,max:1}),X(`MeshRendererComponent`,`dissolveProgress`,`number`,`Dissolve`,{min:0,max:1}),X(`MeshRendererComponent`,`wireframe`,`boolean`,`Wireframe`),X(`TextComponent`,`text`,`string`,`Text`),X(`TextComponent`,`fontSizePx`,`number`,`Font Size`,{min:1}),X(`TextComponent`,`color`,`color`,`Color`),X(`TextComponent`,`opacity`,`number`,`Opacity`,{min:0,max:1}),X(`TextComponent`,`revealProgress`,`number`,`Reveal Progress`,{min:0,max:1}),X(`TextComponent`,`scrambleProgress`,`number`,`Scramble Progress`,{min:0,max:1}),X(`TextComponent`,`wavePhase`,`number`,`Wave Phase`),X(`TextComponent`,`waveAmplitude`,`number`,`Wave Amplitude`),X(`MaskWipeComponent`,`progress`,`number`,`Wipe Progress`,{min:0,max:1}),X(`WeaponTrailComponent`,`enabled`,`boolean`,`Trail Enabled`),X(`UIComponent`,`opacity`,`number`,`Opacity`,{min:0,max:1}),X(`UIComponent`,`offset`,`vec2`,`Offset`),X(`UICanvasComponent`,`opacity`,`number`,`Opacity`,{min:0,max:1}),X(`UICanvasComponent`,`cameraDistance`,`number`,`Camera Distance`),X(`UICanvasComponent`,`faceNormalOffset`,`number`,`Face Offset`),X(`UICanvasComponent`,`widthWorld`,`number`,`Width (world)`,{min:.001}),X(`UICanvasComponent`,`heightWorld`,`number`,`Height (world)`,{min:.001}),X(`UICanvasComponent`,`borderColor`,`color`,`Border Color`),X(`UICanvasComponent`,`canvasBorderPx`,`number`,`Canvas Border Width`,{min:0}),X(`CameraCanvasComponent`,`opacity`,`number`,`Opacity`,{min:0,max:1}),X(`CameraCanvasComponent`,`cameraDistance`,`number`,`Camera Distance`,{min:.01}),X(`CameraCanvasComponent`,`screenOffsetPx`,`vec2`,`Screen Offset (px)`),X(`CameraCanvasComponent`,`screenSizePx`,`vec2`,`Screen Size (px)`),X(`CameraCanvasComponent`,`borderColor`,`color`,`Border Color`),X(`CameraCanvasComponent`,`canvasBorderPx`,`number`,`Canvas Border Width`,{min:0});for(let e of[`UICanvasTextComponent`,`UICanvasImageComponent`,`UICanvasButtonComponent`,`UICanvasLoadingBarComponent`])X(e,`opacity`,`number`,`Opacity`,{min:0,max:1}),X(e,`offset`,`vec2`,`Position`),X(e,`rotationDeg`,`number`,`Rotation (deg)`),X(e,`width`,`number`,`Width`,{min:0}),X(e,`height`,`number`,`Height`,{min:0});X(`UICanvasTextComponent`,`color`,`string`,`Color`),X(`UICanvasTextComponent`,`fontSizePx`,`number`,`Font Size`,{min:1}),X(`UICanvasTextComponent`,`lineHeight`,`number`,`Line Height`,{min:.5,max:3}),X(`UICanvasImageComponent`,`tintColor`,`string`,`Tint`),X(`UICanvasButtonComponent`,`color`,`string`,`Text Color`),X(`UICanvasButtonComponent`,`backgroundColor`,`string`,`Background`),X(`UICanvasButtonComponent`,`hoverBackgroundColor`,`string`,`Hover Background`),X(`UICanvasButtonComponent`,`borderColor`,`string`,`Border Color`),X(`UICanvasButtonComponent`,`borderWidthPx`,`number`,`Border Width`,{min:0}),X(`UICanvasButtonComponent`,`fontSizePx`,`number`,`Font Size`,{min:1}),X(`UICanvasLoadingBarComponent`,`value`,`number`,`Value`,{min:0,max:1}),X(`UICanvasLoadingBarComponent`,`fillColor`,`string`,`Fill Color`),X(`UICanvasLoadingBarComponent`,`backgroundColor`,`string`,`Background`),X(`ParallaxLayerComponent`,`startOffset`,`vec3`,`Move From`),X(`ParallaxLayerComponent`,`endOffset`,`vec3`,`Move To`),X(`ParallaxLayerComponent`,`depth`,`number`,`Depth / Speed`,{min:-2,max:2})}}var wf=!1;Cf();var Tf=class{_root;_bar;_label;_percent;_error;_progress=0;_shownAt=performance.now();constructor(){let e=document.getElementById(`load-screen`),t=document.getElementById(`load-bar`),n=document.getElementById(`load-label`),r=document.getElementById(`load-percent`),i=document.getElementById(`load-error`);if(!(e instanceof HTMLElement))throw Error(`Expected #load-screen.`);if(!(t instanceof HTMLElement))throw Error(`Expected #load-bar.`);if(!(n instanceof HTMLElement))throw Error(`Expected #load-label.`);if(!(r instanceof HTMLElement))throw Error(`Expected #load-percent.`);if(!(i instanceof HTMLElement))throw Error(`Expected #load-error.`);this._root=e,this._bar=t,this._label=n,this._percent=r,this._error=i,document.body.classList.add(`is-loading`)}setStage(e,t){this._progress=Math.max(this._progress,Math.min(1,t)),this._label.textContent=e,this._bar.style.width=`${(this._progress*100).toFixed(1)}%`,this._percent.textContent=`${Math.round(this._progress*100)}%`;let n=this._bar.parentElement;n instanceof HTMLElement&&n.setAttribute(`aria-valuenow`,String(Math.round(this._progress*100)))}setError(e){this._error.hidden=!1,this._error.textContent=e,this._root.classList.add(`load-screen--error`)}async complete(e=700){this.setStage(`Entering Mini City…`,1);let t=performance.now()-this._shownAt;t<e&&await new Promise(n=>setTimeout(n,e-t)),this._root.classList.add(`load-screen--hide`),this._root.setAttribute(`aria-busy`,`false`),document.body.classList.remove(`is-loading`),document.body.classList.add(`is-ready`),await new Promise(e=>setTimeout(e,520)),this._root.remove()}};function Ef(e,t){if(t===0)return console.warn(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.`),e;if(t===2||t===1){let n=e.getIndex();if(n===null){let t=[],r=e.getAttribute(`position`);if(r!==void 0){for(let e=0;e<r.count;e++)t.push(e);e.setIndex(t),n=e.getIndex()}else return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.`),e}let r=n.count-2,i=[];if(t===2)for(let e=1;e<=r;e++)i.push(n.getX(0)),i.push(n.getX(e)),i.push(n.getX(e+1));else for(let e=0;e<r;e++)e%2==0?(i.push(n.getX(e)),i.push(n.getX(e+1)),i.push(n.getX(e+2))):(i.push(n.getX(e+2)),i.push(n.getX(e+1)),i.push(n.getX(e)));i.length/3!==r&&console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.`);let a=e.clone();return a.setIndex(i),a.clearGroups(),a}else return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:`,t),e}var Df=t({GLTFLoader:()=>Of}),Of=class extends Nc{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new Nf(e)}),this.register(function(e){return new Hf(e)}),this.register(function(e){return new Uf(e)}),this.register(function(e){return new Wf(e)}),this.register(function(e){return new Ff(e)}),this.register(function(e){return new If(e)}),this.register(function(e){return new Lf(e)}),this.register(function(e){return new Rf(e)}),this.register(function(e){return new Mf(e)}),this.register(function(e){return new zf(e)}),this.register(function(e){return new Pf(e)}),this.register(function(e){return new Vf(e)}),this.register(function(e){return new Bf(e)}),this.register(function(e){return new Af(e)}),this.register(function(e){return new Gf(e)}),this.register(function(e){return new Kf(e)})}load(e,t,n,r){let i=this,a;if(this.resourcePath!==``)a=this.resourcePath;else if(this.path!==``){let t=nl.extractUrlBase(e);a=nl.resolveURL(t,this.path)}else a=nl.extractUrlBase(e);this.manager.itemStart(e);let o=function(t){r?r(t):console.error(t),i.manager.itemError(e),i.manager.itemEnd(e)},s=new Ic(this.manager);s.setPath(this.path),s.setResponseType(`arraybuffer`),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(n){try{i.parse(n,a,function(n){t(n),i.manager.itemEnd(e)},o)}catch(e){o(e)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setDDSLoader(){throw Error(`THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".`)}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let i,a={},o={},s=new TextDecoder;if(typeof e==`string`)i=JSON.parse(e);else if(e instanceof ArrayBuffer)if(s.decode(new Uint8Array(e,0,4))===qf){try{a[Z.KHR_BINARY_GLTF]=new Xf(e)}catch(e){r&&r(e);return}i=JSON.parse(a[Z.KHR_BINARY_GLTF].content)}else i=JSON.parse(s.decode(e));else i=e;if(i.asset===void 0||i.asset.version[0]<2){r&&r(Error(`THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.`));return}let c=new Sp(i,{path:t||this.resourcePath||``,crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let e=0;e<this.pluginCallbacks.length;e++){let t=this.pluginCallbacks[e](c);t.name||console.error(`THREE.GLTFLoader: Invalid plugin found: missing name`),o[t.name]=t,a[t.name]=!0}if(i.extensionsUsed)for(let e=0;e<i.extensionsUsed.length;++e){let t=i.extensionsUsed[e],n=i.extensionsRequired||[];switch(t){case Z.KHR_MATERIALS_UNLIT:a[t]=new jf;break;case Z.KHR_DRACO_MESH_COMPRESSION:a[t]=new Zf(i,this.dracoLoader);break;case Z.KHR_TEXTURE_TRANSFORM:a[t]=new Qf;break;case Z.KHR_MESH_QUANTIZATION:a[t]=new $f;break;default:n.indexOf(t)>=0&&o[t]===void 0&&console.warn(`THREE.GLTFLoader: Unknown extension "`+t+`".`)}}c.setExtensions(a),c.setPlugins(o),c.parse(n,r)}parseAsync(e,t){let n=this;return new Promise(function(r,i){n.parse(e,t,r,i)})}};function kf(){let e={};return{get:function(t){return e[t]},add:function(t,n){e[t]=n},remove:function(t){delete e[t]},removeAll:function(){e={}}}}var Z={KHR_BINARY_GLTF:`KHR_binary_glTF`,KHR_DRACO_MESH_COMPRESSION:`KHR_draco_mesh_compression`,KHR_LIGHTS_PUNCTUAL:`KHR_lights_punctual`,KHR_MATERIALS_CLEARCOAT:`KHR_materials_clearcoat`,KHR_MATERIALS_IOR:`KHR_materials_ior`,KHR_MATERIALS_SHEEN:`KHR_materials_sheen`,KHR_MATERIALS_SPECULAR:`KHR_materials_specular`,KHR_MATERIALS_TRANSMISSION:`KHR_materials_transmission`,KHR_MATERIALS_IRIDESCENCE:`KHR_materials_iridescence`,KHR_MATERIALS_ANISOTROPY:`KHR_materials_anisotropy`,KHR_MATERIALS_UNLIT:`KHR_materials_unlit`,KHR_MATERIALS_VOLUME:`KHR_materials_volume`,KHR_TEXTURE_BASISU:`KHR_texture_basisu`,KHR_TEXTURE_TRANSFORM:`KHR_texture_transform`,KHR_MESH_QUANTIZATION:`KHR_mesh_quantization`,KHR_MATERIALS_EMISSIVE_STRENGTH:`KHR_materials_emissive_strength`,EXT_MATERIALS_BUMP:`EXT_materials_bump`,EXT_TEXTURE_WEBP:`EXT_texture_webp`,EXT_TEXTURE_AVIF:`EXT_texture_avif`,EXT_MESHOPT_COMPRESSION:`EXT_meshopt_compression`,EXT_MESH_GPU_INSTANCING:`EXT_mesh_gpu_instancing`},Af=class{constructor(e){this.parser=e,this.name=Z.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n=`light:`+e,r=t.cache.get(n);if(r)return r;let i=t.json,a=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e],o,s=new G(16777215);a.color!==void 0&&s.setRGB(a.color[0],a.color[1],a.color[2],j);let c=a.range===void 0?0:a.range;switch(a.type){case`directional`:o=new el(s),o.target.position.set(0,0,-1),o.add(o.target);break;case`point`:o=new Qc(s),o.distance=c;break;case`spot`:o=new qc(s),o.distance=c,a.spot=a.spot||{},a.spot.innerConeAngle=a.spot.innerConeAngle===void 0?0:a.spot.innerConeAngle,a.spot.outerConeAngle=a.spot.outerConeAngle===void 0?Math.PI/4:a.spot.outerConeAngle,o.angle=a.spot.outerConeAngle,o.penumbra=1-a.spot.innerConeAngle/a.spot.outerConeAngle,o.target.position.set(0,0,-1),o.add(o.target);break;default:throw Error(`THREE.GLTFLoader: Unexpected light type: `+a.type)}return o.position.set(0,0,0),o.decay=2,mp(o,a),a.intensity!==void 0&&(o.intensity=a.intensity),o.name=t.createUniqueName(a.name||`light_`+e),r=Promise.resolve(o),t.cache.add(n,r),r}getDependency(e,t){if(e===`light`)return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],i=(r.extensions&&r.extensions[this.name]||{}).light;return i===void 0?null:this._loadLight(i).then(function(e){return n._getNodeRef(t.cache,i,e)})}},jf=class{constructor(){this.name=Z.KHR_MATERIALS_UNLIT}getMaterialType(){return Cn}extendParams(e,t,n){let r=[];e.color=new G(1,1,1),e.opacity=1;let i=t.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){let t=i.baseColorFactor;e.color.setRGB(t[0],t[1],t[2],j),e.opacity=t[3]}i.baseColorTexture!==void 0&&r.push(n.assignTexture(e,`map`,i.baseColorTexture,A))}return Promise.all(r)}},Mf=class{constructor(e){this.parser=e,this.name=Z.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let r=n.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}},Nf=class{constructor(e){this.parser=e,this.name=Z.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:uc}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&i.push(n.assignTexture(t,`clearcoatMap`,a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&i.push(n.assignTexture(t,`clearcoatRoughnessMap`,a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(i.push(n.assignTexture(t,`clearcoatNormalMap`,a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){let e=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new B(e,e)}return Promise.all(i)}},Pf=class{constructor(e){this.parser=e,this.name=Z.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:uc}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&i.push(n.assignTexture(t,`iridescenceMap`,a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&i.push(n.assignTexture(t,`iridescenceThicknessMap`,a.iridescenceThicknessTexture)),Promise.all(i)}},Ff=class{constructor(e){this.parser=e,this.name=Z.KHR_MATERIALS_SHEEN}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:uc}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[];t.sheenColor=new G(0,0,0),t.sheenRoughness=0,t.sheen=1;let a=r.extensions[this.name];if(a.sheenColorFactor!==void 0){let e=a.sheenColorFactor;t.sheenColor.setRGB(e[0],e[1],e[2],j)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&i.push(n.assignTexture(t,`sheenColorMap`,a.sheenColorTexture,A)),a.sheenRoughnessTexture!==void 0&&i.push(n.assignTexture(t,`sheenRoughnessMap`,a.sheenRoughnessTexture)),Promise.all(i)}},If=class{constructor(e){this.parser=e,this.name=Z.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:uc}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&i.push(n.assignTexture(t,`transmissionMap`,a.transmissionTexture)),Promise.all(i)}},Lf=class{constructor(e){this.parser=e,this.name=Z.KHR_MATERIALS_VOLUME}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:uc}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];t.thickness=a.thicknessFactor===void 0?0:a.thicknessFactor,a.thicknessTexture!==void 0&&i.push(n.assignTexture(t,`thicknessMap`,a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;let o=a.attenuationColor||[1,1,1];return t.attenuationColor=new G().setRGB(o[0],o[1],o[2],j),Promise.all(i)}},Rf=class{constructor(e){this.parser=e,this.name=Z.KHR_MATERIALS_IOR}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:uc}extendMaterialParams(e,t){let n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let r=n.extensions[this.name];return t.ior=r.ior===void 0?1.5:r.ior,Promise.resolve()}},zf=class{constructor(e){this.parser=e,this.name=Z.KHR_MATERIALS_SPECULAR}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:uc}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];t.specularIntensity=a.specularFactor===void 0?1:a.specularFactor,a.specularTexture!==void 0&&i.push(n.assignTexture(t,`specularIntensityMap`,a.specularTexture));let o=a.specularColorFactor||[1,1,1];return t.specularColor=new G().setRGB(o[0],o[1],o[2],j),a.specularColorTexture!==void 0&&i.push(n.assignTexture(t,`specularColorMap`,a.specularColorTexture,A)),Promise.all(i)}},Bf=class{constructor(e){this.parser=e,this.name=Z.EXT_MATERIALS_BUMP}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:uc}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return t.bumpScale=a.bumpFactor===void 0?1:a.bumpFactor,a.bumpTexture!==void 0&&i.push(n.assignTexture(t,`bumpMap`,a.bumpTexture)),Promise.all(i)}},Vf=class{constructor(e){this.parser=e,this.name=Z.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:uc}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&i.push(n.assignTexture(t,`anisotropyMap`,a.anisotropyTexture)),Promise.all(i)}},Hf=class{constructor(e){this.parser=e,this.name=Z.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;let i=r.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures`);return null}return t.loadTextureImage(e,i.source,a)}},Uf=class{constructor(e){this.parser=e,this.name=Z.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return this.detectSupport().then(function(i){if(i)return n.loadTextureImage(e,a.source,s);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw Error(`THREE.GLTFLoader: WebP required by asset but unsupported.`);return n.loadTexture(e)})}detectSupport(){return this.isSupported||=new Promise(function(e){let t=new Image;t.src=`data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA`,t.onload=t.onerror=function(){e(t.height===1)}}),this.isSupported}},Wf=class{constructor(e){this.parser=e,this.name=Z.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return this.detectSupport().then(function(i){if(i)return n.loadTextureImage(e,a.source,s);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw Error(`THREE.GLTFLoader: AVIF required by asset but unsupported.`);return n.loadTexture(e)})}detectSupport(){return this.isSupported||=new Promise(function(e){let t=new Image;t.src=`data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=`,t.onload=t.onerror=function(){e(t.height===1)}}),this.isSupported}},Gf=class{constructor(e){this.name=Z.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let e=n.extensions[this.name],r=this.parser.getDependency(`buffer`,e.buffer),i=this.parser.options.meshoptDecoder;if(!i||!i.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files`);return null}return r.then(function(t){let n=e.byteOffset||0,r=e.byteLength||0,a=e.count,o=e.byteStride,s=new Uint8Array(t,n,r);return i.decodeGltfBufferAsync?i.decodeGltfBufferAsync(a,o,s,e.mode,e.filter).then(function(e){return e.buffer}):i.ready.then(function(){let t=new ArrayBuffer(a*o);return i.decodeGltfBuffer(new Uint8Array(t),a,o,s,e.mode,e.filter),t})})}else return null}},Kf=class{constructor(e){this.name=Z.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let r=t.meshes[n.mesh];for(let e of r.primitives)if(e.mode!==rp.TRIANGLES&&e.mode!==rp.TRIANGLE_STRIP&&e.mode!==rp.TRIANGLE_FAN&&e.mode!==void 0)return null;let i=n.extensions[this.name].attributes,a=[],o={};for(let e in i)a.push(this.parser.getDependency(`accessor`,i[e]).then(t=>(o[e]=t,o[e])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(e=>{let t=e.pop(),n=t.isGroup?t.children:[t],r=e[0].count,i=[];for(let e of n){let t=new W,n=new U,a=new nt,s=new U(1,1,1),c=new cs(e.geometry,e.material,r);for(let e=0;e<r;e++)o.TRANSLATION&&n.fromBufferAttribute(o.TRANSLATION,e),o.ROTATION&&a.fromBufferAttribute(o.ROTATION,e),o.SCALE&&s.fromBufferAttribute(o.SCALE,e),c.setMatrixAt(e,t.compose(n,a,s));for(let t in o)if(t===`_COLOR_0`){let e=o[t];c.instanceColor=new es(e.array,e.itemSize,e.normalized)}else t!==`TRANSLATION`&&t!==`ROTATION`&&t!==`SCALE`&&e.geometry.setAttribute(t,o[t]);nn.prototype.copy.call(c,e),this.parser.assignFinalMaterial(c),i.push(c)}return t.isGroup?(t.clear(),t.add(...i),t):i[0]}))}},qf=`glTF`,Jf=12,Yf={JSON:1313821514,BIN:5130562},Xf=class{constructor(e){this.name=Z.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Jf),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==qf)throw Error(`THREE.GLTFLoader: Unsupported glTF-Binary header.`);if(this.header.version<2)throw Error(`THREE.GLTFLoader: Legacy binary file detected.`);let r=this.header.length-Jf,i=new DataView(e,Jf),a=0;for(;a<r;){let t=i.getUint32(a,!0);a+=4;let r=i.getUint32(a,!0);if(a+=4,r===Yf.JSON){let r=new Uint8Array(e,Jf+a,t);this.content=n.decode(r)}else if(r===Yf.BIN){let n=Jf+a;this.body=e.slice(n,n+t)}a+=t}if(this.content===null)throw Error(`THREE.GLTFLoader: JSON content not found.`)}},Zf=class{constructor(e,t){if(!t)throw Error(`THREE.GLTFLoader: No DRACOLoader instance provided.`);this.name=Z.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,r=this.dracoLoader,i=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},s={},c={};for(let e in a){let t=cp[e]||e.toLowerCase();o[t]=a[e]}for(let t in e.attributes){let r=cp[t]||t.toLowerCase();if(a[t]!==void 0){let i=n.accessors[e.attributes[t]];c[r]=ip[i.componentType].name,s[r]=i.normalized===!0}}return t.getDependency(`bufferView`,i).then(function(e){return new Promise(function(t,n){r.decodeDracoFile(e,function(e){for(let t in e.attributes){let n=e.attributes[t],r=s[t];r!==void 0&&(n.normalized=r)}t(e)},o,c,j,n)})})}},Qf=class{constructor(){this.name=Z.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0?e:(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0,e)}},$f=class{constructor(){this.name=Z.KHR_MESH_QUANTIZATION}},ep=class extends gc{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r*3+r;for(let e=0;e!==r;e++)t[e]=n[i+e];return t}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=o*2,c=o*3,l=r-t,u=(n-t)/l,d=u*u,f=d*u,p=e*c,m=p-c,h=-2*f+3*d,g=f-d,_=1-h,v=g-d+u;for(let e=0;e!==o;e++){let t=a[m+e+o],n=a[m+e+s]*l,r=a[p+e+o],c=a[p+e]*l;i[e]=_*t+v*n+h*r+g*c}return i}},tp=new nt,np=class extends ep{interpolate_(e,t,n,r){let i=super.interpolate_(e,t,n,r);return tp.fromArray(i).normalize().toArray(i),i}},rp={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},ip={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},ap={9728:s,9729:u,9984:c,9985:d,9986:l,9987:f},op={33071:a,33648:o,10497:i},sp={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},cp={POSITION:`position`,NORMAL:`normal`,TANGENT:`tangent`,TEXCOORD_0:`uv`,TEXCOORD_1:`uv1`,TEXCOORD_2:`uv2`,TEXCOORD_3:`uv3`,COLOR_0:`color`,WEIGHTS_0:`skinWeight`,JOINTS_0:`skinIndex`},lp={scale:`scale`,translation:`position`,rotation:`quaternion`,weights:`morphTargetInfluences`},up={CUBICSPLINE:void 0,LINEAR:S,STEP:x},dp={OPAQUE:`OPAQUE`,MASK:`MASK`,BLEND:`BLEND`};function fp(e){return e.DefaultMaterial===void 0&&(e.DefaultMaterial=new lc({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:0})),e.DefaultMaterial}function pp(e,t,n){for(let r in n.extensions)e[r]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[r]=n.extensions[r])}function mp(e,t){t.extras!==void 0&&(typeof t.extras==`object`?Object.assign(e.userData,t.extras):console.warn(`THREE.GLTFLoader: Ignoring primitive type .extras, `+t.extras))}function hp(e,t,n){let r=!1,i=!1,a=!1;for(let e=0,n=t.length;e<n;e++){let n=t[e];if(n.POSITION!==void 0&&(r=!0),n.NORMAL!==void 0&&(i=!0),n.COLOR_0!==void 0&&(a=!0),r&&i&&a)break}if(!r&&!i&&!a)return Promise.resolve(e);let o=[],s=[],c=[];for(let l=0,u=t.length;l<u;l++){let u=t[l];if(r){let t=u.POSITION===void 0?e.attributes.position:n.getDependency(`accessor`,u.POSITION);o.push(t)}if(i){let t=u.NORMAL===void 0?e.attributes.normal:n.getDependency(`accessor`,u.NORMAL);s.push(t)}if(a){let t=u.COLOR_0===void 0?e.attributes.color:n.getDependency(`accessor`,u.COLOR_0);c.push(t)}}return Promise.all([Promise.all(o),Promise.all(s),Promise.all(c)]).then(function(t){let n=t[0],o=t[1],s=t[2];return r&&(e.morphAttributes.position=n),i&&(e.morphAttributes.normal=o),a&&(e.morphAttributes.color=s),e.morphTargetsRelative=!0,e})}function gp(e,t){if(e.updateMorphTargets(),t.weights!==void 0)for(let n=0,r=t.weights.length;n<r;n++)e.morphTargetInfluences[n]=t.weights[n];if(t.extras&&Array.isArray(t.extras.targetNames)){let n=t.extras.targetNames;if(e.morphTargetInfluences.length===n.length){e.morphTargetDictionary={};for(let t=0,r=n.length;t<r;t++)e.morphTargetDictionary[n[t]]=t}else console.warn(`THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.`)}}function _p(e){let t,n=e.extensions&&e.extensions[Z.KHR_DRACO_MESH_COMPRESSION];if(t=n?`draco:`+n.bufferView+`:`+n.indices+`:`+vp(n.attributes):e.indices+`:`+vp(e.attributes)+`:`+e.mode,e.targets!==void 0)for(let n=0,r=e.targets.length;n<r;n++)t+=`:`+vp(e.targets[n]);return t}function vp(e){let t=``,n=Object.keys(e).sort();for(let r=0,i=n.length;r<i;r++)t+=n[r]+`:`+e[n[r]]+`;`;return t}function yp(e){switch(e){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw Error(`THREE.GLTFLoader: Unsupported normalized accessor component type.`)}}function bp(e){return e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0?`image/jpeg`:e.search(/\.webp($|\?)/i)>0||e.search(/^data\:image\/webp/)===0?`image/webp`:`image/png`}var xp=new W,Sp=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new kf,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=!1,i=-1;typeof navigator<`u`&&(n=/^((?!chrome|android).)*safari/i.test(navigator.userAgent)===!0,r=navigator.userAgent.indexOf(`Firefox`)>-1,i=r?navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1]:-1),typeof createImageBitmap>`u`||n||r&&i<98?this.textureLoader=new zc(this.options.manager):this.textureLoader=new rl(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Ic(this.options.manager),this.fileLoader.setResponseType(`arraybuffer`),this.options.crossOrigin===`use-credentials`&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,r=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(e){return e._markDefs&&e._markDefs()}),Promise.all(this._invokeAll(function(e){return e.beforeRoot&&e.beforeRoot()})).then(function(){return Promise.all([n.getDependencies(`scene`),n.getDependencies(`animation`),n.getDependencies(`camera`)])}).then(function(t){let a={scene:t[0][r.scene||0],scenes:t[0],animations:t[1],cameras:t[2],asset:r.asset,parser:n,userData:{}};return pp(i,a,r),mp(a,r),Promise.all(n._invokeAll(function(e){return e.afterRoot&&e.afterRoot(a)})).then(function(){e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n].joints;for(let t=0,n=r.length;t<n;t++)e[r[t]].isBone=!0}for(let t=0,r=e.length;t<r;t++){let r=e[t];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let r=n.clone(),i=(e,t)=>{let n=this.associations.get(e);n!=null&&this.associations.set(t,n);for(let[n,r]of e.children.entries())i(r,t.children[n])};return i(n,r),r.name+=`_instance_`+ e.uses[t]++,r}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let r=e(t[n]);if(r)return r}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let r=0;r<t.length;r++){let i=e(t[r]);i&&n.push(i)}return n}getDependency(e,t){let n=e+`:`+t,r=this.cache.get(n);if(!r){switch(e){case`scene`:r=this.loadScene(t);break;case`node`:r=this._invokeOne(function(e){return e.loadNode&&e.loadNode(t)});break;case`mesh`:r=this._invokeOne(function(e){return e.loadMesh&&e.loadMesh(t)});break;case`accessor`:r=this.loadAccessor(t);break;case`bufferView`:r=this._invokeOne(function(e){return e.loadBufferView&&e.loadBufferView(t)});break;case`buffer`:r=this.loadBuffer(t);break;case`material`:r=this._invokeOne(function(e){return e.loadMaterial&&e.loadMaterial(t)});break;case`texture`:r=this._invokeOne(function(e){return e.loadTexture&&e.loadTexture(t)});break;case`skin`:r=this.loadSkin(t);break;case`animation`:r=this._invokeOne(function(e){return e.loadAnimation&&e.loadAnimation(t)});break;case`camera`:r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(n){return n!=this&&n.getDependency&&n.getDependency(e,t)}),!r)throw Error(`Unknown type: `+e);break}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,r=this.json[e+(e===`mesh`?`es`:`s`)]||[];t=Promise.all(r.map(function(t,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!==`arraybuffer`)throw Error(`THREE.GLTFLoader: `+t.type+` buffer type is not supported.`);if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Z.KHR_BINARY_GLTF].body);let r=this.options;return new Promise(function(e,i){n.load(nl.resolveURL(t.uri,r.path),e,void 0,function(){i(Error(`THREE.GLTFLoader: Failed to load buffer "`+t.uri+`".`))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency(`buffer`,t.buffer).then(function(e){let n=t.byteLength||0,r=t.byteOffset||0;return e.slice(r,r+n)})}loadAccessor(e){let t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){let e=sp[r.type],t=ip[r.componentType],n=r.normalized===!0,i=new t(r.count*e);return Promise.resolve(new jn(i,e,n))}let i=[];return r.bufferView===void 0?i.push(null):i.push(this.getDependency(`bufferView`,r.bufferView)),r.sparse!==void 0&&(i.push(this.getDependency(`bufferView`,r.sparse.indices.bufferView)),i.push(this.getDependency(`bufferView`,r.sparse.values.bufferView))),Promise.all(i).then(function(e){let i=e[0],a=sp[r.type],o=ip[r.componentType],s=o.BYTES_PER_ELEMENT,c=s*a,l=r.byteOffset||0,u=r.bufferView===void 0?void 0:n.bufferViews[r.bufferView].byteStride,d=r.normalized===!0,f,p;if(u&&u!==c){let e=Math.floor(l/u),n=`InterleavedBuffer:`+r.bufferView+`:`+r.componentType+`:`+e+`:`+r.count,c=t.cache.get(n);c||(f=new o(i,e*u,r.count*u/s),c=new Io(f,u/s),t.cache.add(n,c)),p=new Ro(c,a,l%u/s,d)}else f=i===null?new o(r.count*a):new o(i,l,r.count*a),p=new jn(f,a,d);if(r.sparse!==void 0){let t=sp.SCALAR,n=ip[r.sparse.indices.componentType],s=r.sparse.indices.byteOffset||0,c=r.sparse.values.byteOffset||0,l=new n(e[1],s,r.sparse.count*t),u=new o(e[2],c,r.sparse.count*a);i!==null&&(p=new jn(p.array.slice(),p.itemSize,p.normalized));for(let e=0,t=l.length;e<t;e++){let t=l[e];if(p.setX(t,u[e*a]),a>=2&&p.setY(t,u[e*a+1]),a>=3&&p.setZ(t,u[e*a+2]),a>=4&&p.setW(t,u[e*a+3]),a>=5)throw Error(`THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.`)}}return p})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,i=t.images[r],a=this.textureLoader;if(i.uri){let e=n.manager.getHandler(i.uri);e!==null&&(a=e)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let r=this,i=this.json,a=i.textures[e],o=i.images[t],s=(o.uri||o.bufferView)+`:`+a.sampler;if(this.textureCache[s])return this.textureCache[s];let c=this.loadImageSource(t,n).then(function(t){t.flipY=!1,t.name=a.name||o.name||``,t.name===``&&typeof o.uri==`string`&&o.uri.startsWith(`data:image/`)===!1&&(t.name=o.uri);let n=(i.samplers||{})[a.sampler]||{};return t.magFilter=ap[n.magFilter]||1006,t.minFilter=ap[n.minFilter]||1008,t.wrapS=op[n.wrapS]||1e3,t.wrapT=op[n.wrapT]||1e3,r.associations.set(t,{textures:e}),t}).catch(function(){return null});return this.textureCache[s]=c,c}loadImageSource(e,t){let n=this,r=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(e=>e.clone());let a=r.images[e],o=self.URL||self.webkitURL,s=a.uri||``,c=!1;if(a.bufferView!==void 0)s=n.getDependency(`bufferView`,a.bufferView).then(function(e){c=!0;let t=new Blob([e],{type:a.mimeType});return s=o.createObjectURL(t),s});else if(a.uri===void 0)throw Error(`THREE.GLTFLoader: Image `+e+` is missing URI and bufferView`);let l=Promise.resolve(s).then(function(e){return new Promise(function(n,r){let a=n;t.isImageBitmapLoader===!0&&(a=function(e){let t=new Xe(e);t.needsUpdate=!0,n(t)}),t.load(nl.resolveURL(e,i.path),a,void 0,r)})}).then(function(e){return c===!0&&o.revokeObjectURL(s),e.userData.mimeType=a.mimeType||bp(a.uri),e}).catch(function(e){throw console.error(`THREE.GLTFLoader: Couldn't load texture`,s),e});return this.sourceCache[e]=l,l}assignTexture(e,t,n,r){let i=this;return this.getDependency(`texture`,n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),i.extensions[Z.KHR_TEXTURE_TRANSFORM]){let e=n.extensions===void 0?void 0:n.extensions[Z.KHR_TEXTURE_TRANSFORM];if(e){let t=i.associations.get(a);a=i.extensions[Z.KHR_TEXTURE_TRANSFORM].extendTexture(a,e),i.associations.set(a,t)}}return r!==void 0&&(a.colorSpace=r),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,r=t.attributes.tangent===void 0,i=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let e=`PointsMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new bs,Sn.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,t.sizeAttenuation=!1,this.cache.add(e,t)),n=t}else if(e.isLine){let e=`LineBasicMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new ls,Sn.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,this.cache.add(e,t)),n=t}if(r||i||a){let e=`ClonedMaterial:`+n.uuid+`:`;r&&(e+=`derivative-tangents:`),i&&(e+=`vertex-colors:`),a&&(e+=`flat-shading:`);let t=this.cache.get(e);t||(t=n.clone(),i&&(t.vertexColors=!0),a&&(t.flatShading=!0),r&&(t.normalScale&&(t.normalScale.y*=-1),t.clearcoatNormalScale&&(t.clearcoatNormalScale.y*=-1)),this.cache.add(e,t),this.associations.set(t,this.associations.get(n))),n=t}e.material=n}getMaterialType(){return lc}loadMaterial(e){let t=this,n=this.json,r=this.extensions,i=n.materials[e],a,o={},s=i.extensions||{},c=[];if(s[Z.KHR_MATERIALS_UNLIT]){let e=r[Z.KHR_MATERIALS_UNLIT];a=e.getMaterialType(),c.push(e.extendParams(o,i,t))}else{let n=i.pbrMetallicRoughness||{};if(o.color=new G(1,1,1),o.opacity=1,Array.isArray(n.baseColorFactor)){let e=n.baseColorFactor;o.color.setRGB(e[0],e[1],e[2],j),o.opacity=e[3]}n.baseColorTexture!==void 0&&c.push(t.assignTexture(o,`map`,n.baseColorTexture,A)),o.metalness=n.metallicFactor===void 0?1:n.metallicFactor,o.roughness=n.roughnessFactor===void 0?1:n.roughnessFactor,n.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,`metalnessMap`,n.metallicRoughnessTexture)),c.push(t.assignTexture(o,`roughnessMap`,n.metallicRoughnessTexture))),a=this._invokeOne(function(t){return t.getMaterialType&&t.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(t){return t.extendMaterialParams&&t.extendMaterialParams(e,o)})))}i.doubleSided===!0&&(o.side=2);let l=i.alphaMode||dp.OPAQUE;if(l===dp.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,l===dp.MASK&&(o.alphaTest=i.alphaCutoff===void 0?.5:i.alphaCutoff)),i.normalTexture!==void 0&&a!==Cn&&(c.push(t.assignTexture(o,`normalMap`,i.normalTexture)),o.normalScale=new B(1,1),i.normalTexture.scale!==void 0)){let e=i.normalTexture.scale;o.normalScale.set(e,e)}if(i.occlusionTexture!==void 0&&a!==Cn&&(c.push(t.assignTexture(o,`aoMap`,i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&a!==Cn){let e=i.emissiveFactor;o.emissive=new G().setRGB(e[0],e[1],e[2],j)}return i.emissiveTexture!==void 0&&a!==Cn&&c.push(t.assignTexture(o,`emissiveMap`,i.emissiveTexture,A)),Promise.all(c).then(function(){let n=new a(o);return i.name&&(n.name=i.name),mp(n,i),t.associations.set(n,{materials:e}),i.extensions&&pp(r,n,i),n})}createUniqueName(e){let t=Al.sanitizeNodeName(e||``);return t in this.nodeNamesUsed?t+`_`+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,r=this.primitiveCache;function i(e){return n[Z.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e,t).then(function(n){return wp(n,e,t)})}let a=[];for(let n=0,o=e.length;n<o;n++){let o=e[n],s=_p(o),c=r[s];if(c)a.push(c.promise);else{let e;e=o.extensions&&o.extensions[Z.KHR_DRACO_MESH_COMPRESSION]?i(o):wp(new Hn,o,t),r[s]={primitive:o,promise:e},a.push(e)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,r=this.extensions,i=n.meshes[e],a=i.primitives,o=[];for(let e=0,t=a.length;e<t;e++){let t=a[e].material===void 0?fp(this.cache):this.getDependency(`material`,a[e].material);o.push(t)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(n){let o=n.slice(0,n.length-1),s=n[n.length-1],c=[];for(let n=0,l=s.length;n<l;n++){let l=s[n],u=a[n],d,f=o[n];if(u.mode===rp.TRIANGLES||u.mode===rp.TRIANGLE_STRIP||u.mode===rp.TRIANGLE_FAN||u.mode===void 0)d=i.isSkinnedMesh===!0?new Jo(l,f):new K(l,f),d.isSkinnedMesh===!0&&d.normalizeSkinWeights(),u.mode===rp.TRIANGLE_STRIP?d.geometry=Ef(d.geometry,1):u.mode===rp.TRIANGLE_FAN&&(d.geometry=Ef(d.geometry,2));else if(u.mode===rp.LINES)d=new vs(l,f);else if(u.mode===rp.LINE_STRIP)d=new hs(l,f);else if(u.mode===rp.LINE_LOOP)d=new ys(l,f);else if(u.mode===rp.POINTS)d=new Ts(l,f);else throw Error(`THREE.GLTFLoader: Primitive mode unsupported: `+u.mode);Object.keys(d.geometry.morphAttributes).length>0&&gp(d,i),d.name=t.createUniqueName(i.name||`mesh_`+e),mp(d,i),u.extensions&&pp(r,d,u),t.assignFinalMaterial(d),c.push(d)}for(let n=0,r=c.length;n<r;n++)t.associations.set(c[n],{meshes:e,primitives:n});if(c.length===1)return i.extensions&&pp(r,c[0],i),c[0];let l=new Eo;i.extensions&&pp(r,l,i),t.associations.set(l,{meshes:e});for(let e=0,t=c.length;e<t;e++)l.add(c[e]);return l})}loadCamera(e){let t,n=this.json.cameras[e],r=n[n.type];if(!r){console.warn(`THREE.GLTFLoader: Missing camera parameters.`);return}return n.type===`perspective`?t=new vr(je.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type===`orthographic`&&(t=new Hr(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),mp(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let e=0,r=t.joints.length;e<r;e++)n.push(this._loadNodeShallow(t.joints[e]));return t.inverseBindMatrices===void 0?n.push(null):n.push(this.getDependency(`accessor`,t.inverseBindMatrices)),Promise.all(n).then(function(e){let n=e.pop(),r=e,i=[],a=[];for(let e=0,o=r.length;e<o;e++){let o=r[e];if(o){i.push(o);let t=new W;n!==null&&t.fromArray(n.array,e*16),a.push(t)}else console.warn(`THREE.GLTFLoader: Joint "%s" could not be found.`,t.joints[e])}return new $o(i,a)})}loadAnimation(e){let t=this.json,n=this,r=t.animations[e],i=r.name?r.name:`animation_`+e,a=[],o=[],s=[],c=[],l=[];for(let e=0,t=r.channels.length;e<t;e++){let t=r.channels[e],n=r.samplers[t.sampler],i=t.target,u=i.node,d=r.parameters===void 0?n.input:r.parameters[n.input],f=r.parameters===void 0?n.output:r.parameters[n.output];i.node!==void 0&&(a.push(this.getDependency(`node`,u)),o.push(this.getDependency(`accessor`,d)),s.push(this.getDependency(`accessor`,f)),c.push(n),l.push(i))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(s),Promise.all(c),Promise.all(l)]).then(function(e){let t=e[0],r=e[1],a=e[2],o=e[3],s=e[4],c=[];for(let e=0,i=t.length;e<i;e++){let i=t[e],l=r[e],u=a[e],d=o[e],f=s[e];if(i===void 0)continue;i.updateMatrix&&i.updateMatrix();let p=n._createAnimationTracks(i,l,u,d,f);if(p)for(let e=0;e<p.length;e++)c.push(p[e])}return new Oc(i,void 0,c)})}createNodeMesh(e){let t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency(`mesh`,r.mesh).then(function(e){let t=n._getNodeRef(n.meshCache,r.mesh,e);return r.weights!==void 0&&t.traverse(function(e){if(e.isMesh)for(let t=0,n=r.weights.length;t<n;t++)e.morphTargetInfluences[t]=r.weights[t]}),t})}loadNode(e){let t=this.json,n=this,r=t.nodes[e],i=n._loadNodeShallow(e),a=[],o=r.children||[];for(let e=0,t=o.length;e<t;e++)a.push(n.getDependency(`node`,o[e]));let s=r.skin===void 0?Promise.resolve(null):n.getDependency(`skin`,r.skin);return Promise.all([i,Promise.all(a),s]).then(function(e){let t=e[0],n=e[1],r=e[2];r!==null&&t.traverse(function(e){e.isSkinnedMesh&&e.bind(r,xp)});for(let e=0,r=n.length;e<r;e++)t.add(n[e]);return t})}_loadNodeShallow(e){let t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let i=t.nodes[e],a=i.name?r.createUniqueName(i.name):``,o=[],s=r._invokeOne(function(t){return t.createNodeMesh&&t.createNodeMesh(e)});return s&&o.push(s),i.camera!==void 0&&o.push(r.getDependency(`camera`,i.camera).then(function(e){return r._getNodeRef(r.cameraCache,i.camera,e)})),r._invokeAll(function(t){return t.createNodeAttachment&&t.createNodeAttachment(e)}).forEach(function(e){o.push(e)}),this.nodeCache[e]=Promise.all(o).then(function(t){let o;if(o=i.isBone===!0?new Yo:t.length>1?new Eo:t.length===1?t[0]:new nn,o!==t[0])for(let e=0,n=t.length;e<n;e++)o.add(t[e]);if(i.name&&(o.userData.name=i.name,o.name=a),mp(o,i),i.extensions&&pp(n,o,i),i.matrix!==void 0){let e=new W;e.fromArray(i.matrix),o.applyMatrix4(e)}else i.translation!==void 0&&o.position.fromArray(i.translation),i.rotation!==void 0&&o.quaternion.fromArray(i.rotation),i.scale!==void 0&&o.scale.fromArray(i.scale);return r.associations.has(o)||r.associations.set(o,{}),r.associations.get(o).nodes=e,o}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],r=this,i=new Eo;n.name&&(i.name=r.createUniqueName(n.name)),mp(i,n),n.extensions&&pp(t,i,n);let a=n.nodes||[],o=[];for(let e=0,t=a.length;e<t;e++)o.push(r.getDependency(`node`,a[e]));return Promise.all(o).then(function(e){for(let t=0,n=e.length;t<n;t++)i.add(e[t]);return r.associations=(e=>{let t=new Map;for(let[e,n]of r.associations)(e instanceof Sn||e instanceof Xe)&&t.set(e,n);return e.traverse(e=>{let n=r.associations.get(e);n!=null&&t.set(e,n)}),t})(i),i})}_createAnimationTracks(e,t,n,r,i){let a=[],o=e.name?e.name:e.uuid,s=[];lp[i.path]===lp.weights?e.traverse(function(e){e.morphTargetInfluences&&s.push(e.name?e.name:e.uuid)}):s.push(o);let c;switch(lp[i.path]){case lp.weights:c=Cc;break;case lp.rotation:c=Tc;break;case lp.position:case lp.scale:c=Dc;break;default:switch(n.itemSize){case 1:c=Cc;break;default:c=Dc;break}break}let l=r.interpolation===void 0?S:up[r.interpolation],u=this._getArrayFromAccessor(n);for(let e=0,n=s.length;e<n;e++){let n=new c(s[e]+`.`+lp[i.path],t.array,u,l);r.interpolation===`CUBICSPLINE`&&this._createCubicSplineTrackInterpolant(n),a.push(n)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let e=yp(t.constructor),n=new Float32Array(t.length);for(let r=0,i=t.length;r<i;r++)n[r]=t[r]*e;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(e){return new(this instanceof Tc?np:ep)(this.times,this.values,this.getValueSize()/3,e)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Cp(e,t,n){let r=t.attributes,i=new at;if(r.POSITION!==void 0){let e=n.json.accessors[r.POSITION],t=e.min,a=e.max;if(t!==void 0&&a!==void 0){if(i.set(new U(t[0],t[1],t[2]),new U(a[0],a[1],a[2])),e.normalized){let t=yp(ip[e.componentType]);i.min.multiplyScalar(t),i.max.multiplyScalar(t)}}else{console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`);return}}else return;let a=t.targets;if(a!==void 0){let e=new U,t=new U;for(let r=0,i=a.length;r<i;r++){let i=a[r];if(i.POSITION!==void 0){let r=n.json.accessors[i.POSITION],a=r.min,o=r.max;if(a!==void 0&&o!==void 0){if(t.setX(Math.max(Math.abs(a[0]),Math.abs(o[0]))),t.setY(Math.max(Math.abs(a[1]),Math.abs(o[1]))),t.setZ(Math.max(Math.abs(a[2]),Math.abs(o[2]))),r.normalized){let e=yp(ip[r.componentType]);t.multiplyScalar(e)}e.max(t)}else console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`)}}i.expandByVector(e)}e.boundingBox=i;let o=new Ct;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,e.boundingSphere=o}function wp(e,t,n){let r=t.attributes,i=[];function a(t,r){return n.getDependency(`accessor`,t).then(function(t){e.setAttribute(r,t)})}for(let t in r){let n=cp[t]||t.toLowerCase();n in e.attributes||i.push(a(r[t],n))}if(t.indices!==void 0&&!e.index){let r=n.getDependency(`accessor`,t.indices).then(function(t){e.setIndex(t)});i.push(r)}return H.workingColorSpace!==`srgb-linear`&&`COLOR_0`in r&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${H.workingColorSpace}" not supported.`),mp(e,t),Cp(e,t,n),Promise.all(i).then(function(){return t.targets===void 0?e:hp(e,t.targets,n)})}var Tp=`/projects/mini-city/assets`,Ep=17.5,Dp=22-Ep;Ep-.65*2;var Op=2.55,kp=3.2,Ap=7.5,jp=11.5,Mp=Ep,Np=12.5,Pp=Ep*.66,Fp=.85,Ip=.76,Lp=11.5;function Rp(e,t,n){let r=t*Math.PI/180,i=Math.tan(r/2)*n,a=e*Math.sin(Gp.polarAngle)*i*2.4,o=Math.ceil(a/22);return Math.max(5,Math.min(9,o+1))}var zp=8.2,Bp=12.8,Vp=2.4;Ep*.38,Dp*.24;var Q={laneOffset:Dp*.26,maxInView:14,spawnPerTick:3,spawnInterval:.5,minLifetimeSec:6,despawnOutViewSec:1.5,speedMin:7,speedMax:12,bobAmp:.07,bobSpeed:3.1,followGap:9,minGap:6,separationRadius:4.6,intersectionRadius:5.5,turnRadius:5,viewRadius:11,nearHideRadius:4,visibilityGraceSec:0,cameraAvoidRadius:0,cameraAvoidMaxOffset:0,cameraAvoidSeparation:0,turnStraight:3,turnTurn:1,coverageMargin:3,avoidHeadOn:!1,headOnGap:0,headOnRouteGap:0,jamEscape:!0,jamStuckSec:2,jamReverseSpeed:.45,jamReverseMaxSec:2.5,smoothFlow:!1,scaleMin:.82,scaleMax:.92},$={laneOffset:0,maxInView:3,spawnPerTick:2,spawnInterval:1.2,minLifetimeSec:8,despawnOutViewSec:2.5,speedMin:6,speedMax:10,bobAmp:0,bobSpeed:2.2,followGap:28,minGap:14,separationRadius:13,intersectionRadius:8,turnRadius:9,viewRadius:14,nearHideRadius:0,visibilityGraceSec:.35,cameraAvoidRadius:14,cameraAvoidMaxOffset:Dp*.32,cameraAvoidSeparation:0,turnStraight:4,turnTurn:2,coverageMargin:3,avoidHeadOn:!1,headOnGap:0,headOnRouteGap:0,jamEscape:!1,jamStuckSec:0,jamReverseSpeed:0,jamReverseMaxSec:0,smoothFlow:!0,scaleMin:1.55,scaleMax:2.05},Hp=.42,Up=.55,Wp=.018,Gp={target:[0,3,0],distance:28,minDistance:18,maxDistance:85,polarAngle:.92,azimuth:.65,panScale:.0018};function Kp(e,t,n){let r=e*.72+t*.53;return Math.sin(n*Up+r)*Hp+Math.sin(n*Up*.62+r*1.37)*Hp*.38}function qp(e,t,n){let r=e*.41+t*.67;return{x:Math.sin(n*.31+r)*Wp,z:Math.cos(n*.27+r*1.1)*Wp}}function Jp(e,t){return{x:e*22,y:0,z:t*22}}var Yp={small_house:`houses`,apartment:`apartment-office`,office:`apartment-office`,landmark:`landmarks`},Xp={houses:`${Tp}/buildings/pools/houses/catalog.json`,"apartment-office":`${Tp}/buildings/pools/apartment-office/catalog.json`,landmarks:`${Tp}/buildings/pools/landmarks/catalog.json`},Zp={houses:`${Tp}/buildings/pools/houses`,"apartment-office":`${Tp}/buildings/pools/apartment-office`,landmarks:`${Tp}/buildings/pools/landmarks`};function Qp(e){let t=e.glb.replace(/\\/g,`/`),n=t.lastIndexOf(`/`);return n>=0?t.slice(n+1):t}function $p(e,t,n=0){let r=n+e*374761393+t*668265263;return r=(r^r>>>13)*1274126177,(r^r>>>16)>>>0}function em(e){return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function tm(e,t){return em($p(e,t,1464816204))}var nm=[{role:`glass`,patterns:[`glass`,`window`,`emiss`,`neon`,`sign`,`lamp`,`beacon`,`led`,`water`]},{role:`roof`,patterns:[`roof`,`awning`]},{role:`trim`,patterns:[`trim`,`frame`,`sill`,`parapet`,`column`,`stone`,`foundation`,`path`]},{role:`metal`,patterns:[`metal`,`iron`,`steel`,`pipe`,`hvac`,`ant`,`dish`,`pole`,`rail`]},{role:`door`,patterns:[`door`,`entry`,`shutter`]},{role:`accent`,patterns:[`accent`,`flag`,`sign`,`menu`,`crate`,`rust`,`chim`]},{role:`ground`,patterns:[`grass`,`ground`,`planter`]},{role:`foliage`,patterns:[`leaf`,`tree`,`shrub`,`flower`]},{role:`wood`,patterns:[`wood`,`bench`,`trunk`,`mail`]},{role:`wall`,patterns:[`wall`,`body`,`base`,`tower`,`hall`,`shop`,`civic`,`body`]}],rm={small_house:[[.78,.62,.72],[.72,.68,.82],[.82,.7,.62],[.65,.78,.72],[.88,.72,.78]],apartment:[[.52,.66,.82],[.48,.58,.75],[.55,.72,.78],[.62,.65,.88]],office:[[.58,.62,.72],[.52,.58,.68],[.65,.68,.78],[.48,.55,.65]],shop:[[.92,.55,.45],[.88,.62,.42],[.95,.48,.52],[.85,.58,.38]],industrial:[[.52,.56,.62],[.48,.52,.58],[.58,.54,.5],[.45,.5,.55]],park:[[.28,.62,.35],[.32,.58,.38],[.25,.65,.32]],civic:[[.82,.72,.55],[.78,.68,.52],[.88,.75,.58],[.75,.65,.48]],landmark:[[.38,.48,.72],[.42,.52,.78],[.35,.45,.68],[.48,.55,.82]]},im={street_light:[[.32,.34,.38]],bench:[[.48,.3,.16]]};function am(e,t){let n=`${e}_${t}`.toLowerCase();for(let{role:e,patterns:t}of nm)if(t.some(e=>n.includes(e)))return e;return`wall`}function om(e,t){return e[Math.floor(t()*e.length)]}function sm(e,t){let[n,r,i]=om(e,t),a=new G(n,r,i);return a.offsetHSL((t()-.5)*.04,(t()-.5)*.08,(t()-.5)*.06),a}function cm(e,t,n,r){let i={h:0,s:0,l:0};switch(n.getHSL(i),t){case`wall`:e.color.copy(n);break;case`roof`:e.color.setHSL(i.h,i.s*.85,i.l*.72);break;case`trim`:e.color.setHSL(i.h,i.s*.35,Math.min(.92,i.l+.28));break;case`door`:e.color.setHSL(i.h,Math.min(.75,i.s+.15),i.l*.45);break;case`metal`:e.color.setHSL(i.h,.12,.42+r()*.12),e.metalness=.55,e.roughness=.38;break;case`accent`:e.color.setHSL((i.h+.08+r()*.06)%1,.65,.52);break;case`glass`:e.color.setHSL((i.h+.45)%1,.55,.55+r()*.1),e.emissive.copy(e.color),e.emissiveIntensity=1.2+r()*.8,e.transparent=!0,e.opacity=.92;break;case`ground`:e.color.setHSL(.32+r()*.06,.55,.38);break;case`foliage`:e.color.setHSL(.28+r()*.08,.58,.32+r()*.08);break;case`wood`:e.color.setHSL(.08,.45,.28+r()*.08);break}}function lm(e,t,n){let r=em(n),i=sm(rm[t],r);e.traverse(e=>{e instanceof K&&dm(e,(e,t)=>{let n=e.clone();if(n instanceof lc){let e=am(t,n.name);cm(n,e,i,r),fm(n,e)}return n})})}function um(e,t,n){if(t!==`street_light`&&t!==`bench`)return;let r=em(n),i=sm(im[t],r);e.traverse(e=>{e instanceof K&&dm(e,(e,t)=>{let n=e.clone();if(n instanceof lc){let e=am(t,n.name);cm(n,e,i,r),fm(n,e)}return n})})}function dm(e,t){Array.isArray(e.material)?e.material=e.material.map(n=>t(n,e.name)):e.material=t(e.material,e.name)}function fm(e,t){t===`glass`?(e.polygonOffset=!0,e.polygonOffsetFactor=-2,e.polygonOffsetUnits=-2,e.depthWrite=!1):(t===`trim`||t===`door`)&&(e.polygonOffset=!0,e.polygonOffsetFactor=1,e.polygonOffsetUnits=1)}function pm(e,t=2){e.traverse(e=>{if(!(e instanceof K))return;let n=e.material,r=(Array.isArray(n)?n[0]:n)?.name?.toLowerCase()??``,i=e.name.toLowerCase();e.renderOrder=r.includes(`glass`)||i.includes(`glass`)?t+2:t})}var mm={houses:yf,"apartment-office":bf,landmarks:bf},hm=null,gm=null;function _m(e){hm||=xf(e,yf),gm||=xf(e,bf)}function vm(e){return Yp[e]!==void 0}function ym(e){return e===`shop`||e===`industrial`||e===`park`||e===`landmark`}function bm(e){return vm(e)||ym(e)}function xm(e){let t=Yp[e];return t?t===`houses`?hm:gm:null}function Sm(e){let t=Yp[e];return(t&&mm[t])??yf}function Cm(e,t){if(!vm(t)&&!ym(t))return;let n=ym(t)?gm:xm(t);if(!n)return;let r=ym(t)?bf:Sm(t);e.traverse(e=>{if(!(e instanceof K))return;let t=Array.isArray(e.material)?e.material:[e.material];for(let e of t)e instanceof lc&&(e.envMap=n,e.envMapIntensity=r.envMapIntensity,e.needsUpdate=!0)})}var wm=/stripe_layer/i,Tm={house_1:[.12,.52,.92],house_2:[.92,.26,.2],house_3:[.18,.7,.36],house_4:[.68,.32,.88]};function Em(e){return wm.test(e)}function Dm(e,t){if(t)return new G(t[0],t[1],t[2]);let n=Tm[e];if(n)return new G(n[0],n[1],n[2]);let r=0;for(let t=0;t<e.length;t++)r=r*31+e.charCodeAt(t)>>>0;let i=r%360/360;return new G().setHSL(i,.62,.48)}function Om(e,t){e.traverse(e=>{if(!(e instanceof K))return;let n=e=>{if(!(e instanceof lc)||!Em(e.name))return e;let n=e.clone();return n.color.copy(t),n.needsUpdate=!0,n};Array.isArray(e.material)?e.material=e.material.map(n):e.material=n(e.material)})}var km=`${Tp}/props/foliage`,Am=[{id:`tree_round`,kind:`tree`,file:`tree_round.glb`,targetHeight:2.6},{id:`tree_tall`,kind:`tree`,file:`tree_tall.glb`,targetHeight:3.6},{id:`tree_broad`,kind:`tree`,file:`tree_broad.glb`,targetHeight:2.3},{id:`tree_small`,kind:`tree`,file:`tree_small.glb`,targetHeight:1.6},{id:`bush_round`,kind:`bush`,file:`bush_round.glb`,targetHeight:.75},{id:`bush_wide`,kind:`bush`,file:`bush_wide.glb`,targetHeight:.6},{id:`bush_tall`,kind:`bush`,file:`bush_tall.glb`,targetHeight:1}],jm={tree:Am.filter(e=>e.kind===`tree`).map(e=>e.id),bush:Am.filter(e=>e.kind===`bush`).map(e=>e.id)};function Mm(e){return e===`tree`||e===`bush`}var Nm=/holo/i,Pm=new G(.04,.92,.12),Fm=new G(.1,.78,.68);function Im(e){return/sign|glow/i.test(e)?`sign`:/beam/i.test(e)?`beam`:/bracket|tick|underline|ring|projector/i.test(e)?`frame`:`accent`}var Lm=`
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`,Rm=`
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uColorSecondary;
  uniform float uKind;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    float scan = sin((vUv.y * 110.0) - uTime * 2.8) * 0.5 + 0.5;
    float fine = sin((vUv.x * 220.0) + uTime * 1.4) * 0.5 + 0.5;
    float flicker = 0.94 + 0.06 * sin(uTime * 11.0 + vWorldPos.z * 3.0);
    float noise = hash(floor(vUv * vec2(90.0, 40.0) + uTime * 0.5)) * 0.08;

    vec3 col = mix(uColor, uColorSecondary, fine * 0.22);
    float alpha = 0.0;

    if (uKind < 0.5) {
      // sign + glow
      float edge = smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);
      alpha = (0.55 + scan * 0.35) * edge * flicker;
      col *= 1.15 + scan * 0.45;
    } else if (uKind < 1.5) {
      // beam cone
      float radial = 1.0 - abs(vUv.x - 0.5) * 2.0;
      alpha = pow(max(radial, 0.0), 2.4) * (0.06 + scan * 0.1) * flicker;
      col = mix(uColor * 0.35, uColorSecondary, radial * 0.5);
    } else if (uKind < 2.5) {
      // frame ticks / brackets
      alpha = 0.75 * flicker;
      col = uColorSecondary;
    } else {
      // emitter caps / ring
      alpha = 0.65 + scan * 0.25;
      col = uColor * (1.1 + fine * 0.2);
    }

    alpha = clamp(alpha + noise, 0.0, 1.0);
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;function zm(e){let t=e===`beam`,n=e===`frame`;return new gr({uniforms:{uTime:{value:0},uColor:{value:Pm.clone()},uColorSecondary:{value:Fm.clone()},uKind:{value:t?1:n?2:e===`sign`?0:3}},vertexShader:Lm,fragmentShader:Rm,transparent:!0,depthWrite:!1,blending:2,side:2,toneMapped:!1})}function Bm(e){return Nm.test(e)}function Vm(e){let t=[];e.traverse(e=>{if(!(e instanceof K)||!Bm(e.name))return;e.renderOrder=14,e.frustumCulled=!1;let n=zm(Im(e.name));n.userData.holoShader=!0;let r=e.material;Array.isArray(r)?r.forEach(e=>e.dispose()):r.dispose(),e.material=n,t.push(n.uniforms)}),e.userData.holoUniforms=t}function Hm(e,t){let n=e.userData.holoUniforms;if(n!==void 0){for(let e of n)e.uTime.value=t;return}e.traverse(e=>{if(!(e instanceof K)||!Bm(e.name))return;let n=Array.isArray(e.material)?e.material:[e.material];for(let e of n)e instanceof gr&&e.userData.holoShader&&(e.uniforms.uTime.value=t)})}function Um(e){return e.y>Math.max(e.x,e.z)*1.05}function Wm(e){e.updateMatrixWorld(!0);let t=new at().setFromObject(e),n=t.getSize(new U).y;return n<.12?!1:t.min.y>=-.06&&t.min.y<=n*.1}var Gm=/door|glass|sign|fascia|canopy|awning|dock_door|hall_glass|neon|shutter/i;function Km(e){let t=[];return e.traverse(e=>{Gm.test(e.name)&&(e instanceof K||(()=>{let t=!1;return e.traverse(e=>{e instanceof K&&(t=!0)}),t})())&&t.push(new at().setFromObject(e).getCenter(new U))}),t}function qm(e){let t=Km(e);if(t.length>0){let n=t.map(e=>e.x),r=Math.max(...n)-Math.min(...n)>1.5?t.filter(e=>e.x<=Math.min(...n)+.35):t,i=r.reduce((e,t)=>e.add(t),new U).multiplyScalar(1/r.length);if(i.x<-.15){e.rotateY(Math.PI/2);return}if(i.x>.15){e.rotateY(-Math.PI/2);return}}e.rotateY(Math.PI/2)}function Jm(e){let t=Km(e);if(t.length===0)return;let n=t.map(e=>e.z),r=Math.max(...n)-Math.min(...n)>1.5?t.filter(e=>e.z>=Math.max(...n)-.35):t,i=r.reduce((e,t)=>e.add(t),new U).multiplyScalar(1/r.length);i.z<-.15?e.rotateY(Math.PI):Math.abs(i.z)<=.15&&i.x>.15?e.rotateY(-Math.PI/2):Math.abs(i.z)<=.15&&i.x<-.15&&e.rotateY(Math.PI/2)}function Ym(e,t){t.updateMatrixWorld(!0);let n=t.rotation.y;Math.abs(n)>1e-4&&(e.rotateY(n),t.rotation.set(0,0,0)),rh(e),rh(t)}function Xm(e){let t=null;return e.traverse(e=>{t||e.name&&/roof/i.test(e.name)&&e.isMesh&&(t=e)}),t}function Zm(e){e.updateMatrixWorld(!0);let t=new at().setFromObject(e).getSize(new U);return t.y<=t.x&&t.y<=t.z?`y`:t.z<=t.x&&t.z<=t.y?`z`:`x`}function Qm(e){for(let t=0;t<6;t++){let t=Xm(e);if(!t)return;let n=Zm(t);if(n===`y`)return;n===`z`?e.rotateX(-Math.PI/2):n===`x`?e.rotateZ(Math.PI/2):e.rotateX(-Math.PI/2),e.updateMatrixWorld(!0)}}function $m(e){e.rotateY(Math.PI)}function eh(e){e.updateMatrixWorld(!0);let t=new at().setFromObject(e),n=t.getSize(new U);if(!(Um(n)&&t.min.y<=Math.max(n.y,.001)*.08)){if(Math.abs(t.min.z)<=Math.max(n.z,.001)*.08&&t.min.y>t.min.z+n.y*.2||n.z>Math.max(n.x,n.y)*1.05){e.rotateX(-Math.PI/2);return}Um(n)||n.x>Math.max(n.y,n.z)*1.05&&e.rotateZ(-Math.PI/2)}}function th(e){if(eh(e),e.updateMatrixWorld(!0),Wm(e)){rh(e);return}nh(e,`upright`)}function nh(e,t=`upright`){if(t!==`groundplate`){if(e.updateMatrixWorld(!0),Wm(e)){rh(e);return}if(t!==`blenderZyFront`&&Qm(e),e.updateMatrixWorld(!0),!Um(new at().setFromObject(e).getSize(new U)))for(let t=0;t<4;t++){e.updateMatrixWorld(!0);let t=new at().setFromObject(e).getSize(new U);if(Um(t))break;if(t.z>Math.max(t.x,t.y)*1.05)e.rotateX(-Math.PI/2);else if(t.x>Math.max(t.y,t.z)*1.05)e.rotateZ(-Math.PI/2);else break;e.updateMatrixWorld(!0)}rh(e)}}function rh(e){e.rotation.order=`YXZ`}function ih(e){e.updateMatrixWorld(!0);let t=new at().setFromObject(e),n=t.getCenter(new U);e.position.x-=n.x,e.position.z-=n.z,e.position.y-=t.min.y}function ah(e,t){oh(e,t),ih(e)}function oh(e,t){e.updateMatrixWorld(!0);let n=new at().setFromObject(e).getSize(new U),r=Math.max(n.x,n.z,.001);e.scale.multiplyScalar(t/r)}function sh(e,t){e.updateMatrixWorld(!0);let n=new at().setFromObject(e),r=Math.max(n.max.y-n.min.y,.001);e.scale.multiplyScalar(t/r),ih(e)}var ch={shop_parking_lot:Lp,fountain_garden:8},lh=`20260625perfopt1`,uh={small_house:`${Tp}/buildings/small_house.glb?v=${lh}`,apartment:`${Tp}/buildings/apartment.glb?v=${lh}`,office:`${Tp}/buildings/office.glb?v=${lh}`,shop:`${Tp}/buildings/shop.glb?v=${lh}`,industrial:`${Tp}/buildings/industrial.glb?v=${lh}`,park:`${Tp}/buildings/park.glb?v=${lh}`,civic:`${Tp}/buildings/civic.glb?v=${lh}`,landmark:`${Tp}/buildings/landmark.glb?v=${lh}`},dh={street_light:`${Tp}/props/street_light.glb?v=${lh}`,bench:`${Tp}/props/bench.glb?v=${lh}`,shop_parking_lot:`${Tp}/props/shop_parking_lot.glb?v=${lh}`,fountain_garden:`${Tp}/props/fountain_garden.glb?v=${lh}`},fh={small_house:Op,apartment:Op,office:Op,shop:Op,industrial:jp,park:Mp,civic:Ap,landmark:Np},ph={street_light:3.8,bench:.55},mh={small_house:`blenderZyFront`,apartment:`blenderZUpZFront`,office:`blenderZUpZFront`,shop:`upright`,industrial:`upright`,park:`groundplate`,civic:`upright`,landmark:`upright`},hh=class{_buildings=new Map;_variants=new Map;_archetypeVariants=new Map;_props=new Map;_foliage=new Map;_loaded=!1;async loadAll(){if(this._loaded)return;let e=new Of;await this._loadVariantPools(e);let t=Object.keys(uh).filter(e=>!Yp[e]),n=await Promise.allSettled([...t.map(async t=>{let n=await e.loadAsync(uh[t]),r=this._wrapBuilding(n.scene,t);this._buildings.set(t,r)}),...Object.entries(dh).map(async([t,n])=>{let r=await e.loadAsync(n),i=this._wrapProp(r.scene,t);this._props.set(t,i)}),...Am.map(async t=>{let n=`${km}/${t.file}?v=${lh}`,r=await e.loadAsync(n),i=this._wrapFoliage(r.scene,t.targetHeight);this._foliage.set(t.id,i)})]);for(let e of n)e.status===`rejected`&&console.warn(`[AssetCatalog] load failed:`,e.reason);this._loaded=!0;let r=this._variants.size,i=[...this._archetypeVariants.entries()].map(([e,t])=>`${e}:${t.length}`).join(`, `);console.info(`[AssetCatalog] loaded ${this._buildings.size} hero buildings, ${r} variants (${i}), ${this._props.size} props`)}cloneBuilding(e,t=0){let n=this._archetypeVariants.get(e);if(n&&n.length>0){let r=n[(t>>>0)%n.length],i=this._cloneVariantTemplate(r,e,t);if(i)return i}let r=this._buildings.get(e);if(!r)return this._fallbackBuilding(e);let i=r.clone(!0);return t!==0&&!bm(e)&&(lm(i,e,t),pm(i,2)),ym(e)&&Cm(i,e),e===`shop`&&Vm(i),i}cloneProp(e,t=0){if(Mm(e))return this._cloneFoliage(e,t);let n=this._props.get(e);if(!n)return null;let r=n.clone(!0);return e===`shop_parking_lot`?Cm(r,`shop`):e===`fountain_garden`?Cm(r,`small_house`):t!==0&&(um(r,e,t),pm(r,3)),r}_cloneFoliage(e,t){let n=jm[e];if(n.length===0)return null;let r=n[(t>>>0)%n.length],i=this._foliage.get(r);if(!i)return null;let a=i.clone(!0);return Cm(a,`small_house`),a}getTemplate(e){return this._buildings.get(e)}getVariantCount(e){return this._archetypeVariants.get(e)?.length??0}listVariantIds(e){return this._archetypeVariants.get(e)??[]}cloneVariantById(e,t=0){let n=this._variants.get(e);if(!n)return null;let r=this._archetypeForPool(n.pool);return this._cloneVariantTemplate(e,r,t)}getHouseStripeColor(e){return this._variants.get(e)?.stripeColor}_archetypeForPool(e){for(let[t,n]of Object.entries(Yp))if(n===e)return t;return`apartment`}_cloneVariantTemplate(e,t,n){let r=this._variants.get(e);if(!r)return null;let i=r.template.clone(!0);return vm(t)?(r.stripeColor&&Om(i,r.stripeColor),Cm(i,t)):ym(t)?Cm(i,t):n!==0&&(lm(i,t,n),pm(i,2)),i}async _loadVariantPools(e){let t=[...new Set(Object.values(Yp))];for(let n of t){let t=await this._fetchCatalog(n),r=Zp[n];await Promise.all(t.buildings.map(async t=>{let i=`${r}/${Qp(t)}?v=${lh}`;try{let r=await e.loadAsync(i),a=this._archetypeForEntry(t,n),o=this._wrapBuilding(r.scene,a),s=n===`houses`?Dm(t.id,t.stripeColor):void 0;this._variants.set(t.id,{id:t.id,pool:n,template:o,stripeColor:s})}catch(e){console.warn(`[AssetCatalog] variant load failed ${t.id}:`,e)}}))}for(let[e,t]of Object.entries(Yp)){let n=[...this._variants.values()].filter(e=>e.pool===t).map(e=>e.id).sort();n.length>0?this._archetypeVariants.set(e,n):t===`houses`&&console.warn(`[AssetCatalog] No house variants loaded — check public/assets/buildings/pools/houses/*.glb`)}}async _fetchCatalog(e){let t=await fetch(`${Xp[e]}?v=${lh}`);if(!t.ok)throw Error(`Failed to load catalog ${e}: ${t.status}`);return t.json()}_archetypeForEntry(e,t){return e.suggestedArchetype===`office`?`office`:e.suggestedArchetype===`apartment`?`apartment`:e.suggestedArchetype===`landmark`||t===`landmarks`?`landmark`:t===`houses`?`small_house`:`apartment`}_wrapBuilding(e,t){let n=new Eo,r=new Eo,i=new Eo;i.add(e),r.add(i),n.add(r);let a=mh[t];return a===`blenderZyFront`?eh(i):a===`blenderZUpZFront`?th(i):nh(i,a),a===`blenderZyFront`?$m(r):t===`shop`?qm(r):Jm(r),Ym(i,r),rh(r),t===`shop`?sh(r,kp):ah(r,fh[t]),this._tagMaterials(e),pm(n,2),n.traverse(e=>{e instanceof K&&(e.castShadow=!0,e.receiveShadow=!0)}),t===`shop`&&Vm(n),n}_wrapProp(e,t){let n=new Eo;n.add(e);let r=ch[t];if(r!==void 0)nh(e,`groundplate`),rh(e),ah(e,r);else{nh(e),rh(e);let n=new at().setFromObject(e),r=Math.max(n.max.y-n.min.y,.001);e.scale.multiplyScalar(ph[t]/r),ih(e)}return this._tagMaterials(e),pm(n,3),n.traverse(e=>{e instanceof K&&(e.castShadow=!0)}),n}_wrapFoliage(e,t){let n=new Eo;n.add(e),nh(e);let r=new at().setFromObject(e),i=Math.max(r.max.y-r.min.y,.001);return e.scale.multiplyScalar(t/i),ih(e),this._tagMaterials(e),pm(n,3),n.traverse(e=>{e instanceof K&&(e.castShadow=!0)}),n}_tagMaterials(e){e.traverse(e=>{if(!(e instanceof K))return;let t=Array.isArray(e.material)?e.material:[e.material];for(let n of t)n instanceof lc&&!n.name&&(n.name=e.name||`Mat_Wall`)})}_fallbackBuilding(e){let t=new Eo,n=new lc({name:`Mat_Wall`,color:{small_house:13143752,apartment:7256288,office:8952251,shop:15763568,industrial:6715272,park:4500070,civic:14727264,landmark:5605597}[e],roughness:.55,metalness:.15}),r=e===`landmark`?8:e===`park`?.3:3,i=e===`landmark`||e===`industrial`||e===`civic`||e===`park`?Ap*.35:Op*.5,a=new K(new cr(i,r,i),n);return a.name=`Body_Wall`,a.position.y=r*.5,t.add(a),t}},gh=`${Tp}/vehicles`,_h=`${gh}/catalog.json`;function vh(e){let t=e.glb.replace(/\\/g,`/`),n=t.lastIndexOf(`/`);return n>=0?t.slice(n+1):t}var yh=`20260625carv4`,bh=class{_cars=new Map;_loaded=!1;async loadAll(){if(this._loaded)return;let e=await this._fetchCatalog(),t=new Of;await Promise.all(e.vehicles.map(async e=>{let n=`${gh}/${vh(e)}?v=${yh}`;try{let r=await t.loadAsync(n),i=this._wrapVehicle(r.scene,e);this._cars.set(e.id,{id:e.id,label:e.label??e.id,targetLength:e.targetLength,template:i})}catch(t){console.warn(`[VehicleCatalog] failed to load ${e.id}:`,t)}})),this._loaded=!0;let n=this.listIds();console.info(`[VehicleCatalog] loaded ${n.length} vehicle(s):`,n.join(`, `))}cloneCar(e,t=0){let n=this._cars.get(e);if(!n)return null;let r=n.template.clone(!0);return r.traverse(e=>{e.frustumCulled=!1}),r}listIds(){return[...this._cars.keys()].sort()}pickRandomId(e){let t=this.listIds();return t.length===0?null:t[Math.floor(e()*t.length)]??t[0]}pickVarietyId(e,t,n){let r=this.listIds();if(r.length===0)return null;let i=[],a=1/0;for(let e of r){let r=(t.get(e)??0)*3+(n.get(e)??0);r<a?(a=r,i=[e]):r===a&&i.push(e)}return i[Math.floor(e()*i.length)]??r[0]}getTemplate(e){return this._cars.get(e)?.template}async _fetchCatalog(){let e=await fetch(`${_h}?v=${yh}`);if(!e.ok)throw Error(`Failed to load vehicle catalog: ${e.status}`);return e.json()}_wrapVehicle(e,t){let n=new Eo,r=new Eo;return r.add(e),n.add(r),nh(r),this._alignVehicleForward(r),oh(r,t.targetLength||4.8),ih(r),rh(r),Cm(r,`shop`),r.traverse(e=>{e instanceof K&&(e.castShadow=!0,e.receiveShadow=!0)}),n}_alignVehicleForward(e){e.updateMatrixWorld(!0);let t=new at().setFromObject(e).getSize(new U);t.x>t.z*1.05&&(e.rotateY(-Math.PI/2),e.updateMatrixWorld(!0),t=new at().setFromObject(e).getSize(new U)),t.z<t.x*.95&&e.rotateY(Math.PI/2),e.rotateY(Math.PI)}};function xh(e,t){return`${e}:${t}`}function Sh(e){return(e+.5)*22}function Ch(e){return(e+.5)*22}function wh(e,t,n,r,i){let a=new Map,o=new Map,s=new Map,c=e,l=t-1,u=n,d=r-1;for(let e=c;e<=l;e++)for(let t=u;t<=d;t++){let n=xh(e,t);a.set(n,{id:n,gx:e,gz:t,x:Sh(e),z:Ch(t)}),s.set(n,[])}let f=(e,t,n)=>{let r=new U(e.x,i,e.z),a=new U(t.x,i,t.z),c=new U().subVectors(a,r).normalize(),l=new U(c.z,0,-c.x),u=n===`x`?t.x>e.x?1:-1:t.z>e.z?1:-1,d=`${e.id}>${t.id}`,f={id:d,fromId:e.id,toId:t.id,axis:n,sign:u,start:r,end:a,forward:c,right:l};o.set(d,f),s.get(e.id).push(f)};for(let e of a.values()){let t=a.get(xh(e.gx+1,e.gz));t&&(f(e,t,`x`),f(t,e,`x`));let n=a.get(xh(e.gx,e.gz+1));n&&(f(e,n,`z`),f(n,e,`z`))}return{nodes:a,edges:o,edgesFrom:s,edgeLength:22}}function Th(e,t,n,r){return r.lerpVectors(e.start,e.end,t),r.x+=e.right.x*n,r.z+=e.right.z*n,r}function Eh(e,t){return(e.edgesFrom.get(t.toId)??[]).filter(e=>e.toId!==t.fromId)}function Dh(e,t,n,r){let i=Eh(e,t);if(i.length===0)return null;let a=[],o=0;for(let e of i){let r=e.axis===t.axis&&e.sign===t.sign?n.straight:n.turn;a.push({edge:e,weight:r}),o+=r}if(a.length===0)return null;let s=r()*o;for(let e of a)if(s-=e.weight,s<=0)return e.edge;return a[a.length-1].edge}function Oh(e){return`${e.toId}>${e.fromId}`}function kh(e,t,n,r){let i=Oh(e),a=1-r/n.edgeLength;for(let e of t)if(!(e.edgeId!==i||e.turn)&&e.t>a)return!0;return!1}function Ah(e,t,n,r,i,a){let o=e.edgesFrom.get(t.toId);if(!o||o.length===0)return null;let s=[],c=0;for(let r of o){if(r.toId===t.fromId)continue;let o=r.axis===t.axis&&r.sign===t.sign?n.straight:n.turn;kh(r,i,e,a)&&(o=0),!(o<=0)&&(s.push({edge:r,weight:o}),c+=o)}if(s.length===0)for(let n of o)n.toId!==t.fromId&&(kh(n,i,e,a)||(s.push({edge:n,weight:1}),c+=1));if(s.length===0)return null;let l=r()*c;for(let e of s)if(l-=e.weight,l<=0)return e.edge;return s[s.length-1].edge}function jh(e,t,n,r,i,a){let o=e.filter(e=>e.toId!==n.fromId&&e.id!==n.id&&!kh(e,r,t,i));if(o.length===0)return null;let s=o.filter(e=>e.axis!==n.axis),c=s.length>0?s:o;return c[Math.floor(a()*c.length)]}var Mh=class{root=new Eo;_cfg;_provideModel;_seedSalt;_graph=null;_agents=[];_reservations=new Map;_activeCounts=new Map;_coverMinTx=-5;_coverMaxTx=5;_coverMinTz=-5;_coverMaxTz=5;_timeSec=0;_spawnTimer=0;_nextId=1;_prefilled=!1;_followedId=null;_frameDt=1/60;_edgeOwner=new Map;_frustum=new Ar;_projScreen=new W;_sphere=new Ct;_camPos=new U;_tmpPos=new U;_tmpPos2=new U;_panRight=new U;_lookTarget=new U;_holdQuat=new nt;_targetQuat=new nt;constructor(e,t,n=1414676806){this._cfg=e,this._provideModel=t,this._seedSalt=n}get agentCount(){return this._agents.length}ensureCoverage(e,t,n=5){let r=e-n,i=e+n,a=t-n,o=t+n,s=this._cfg.coverageMargin;if(e>=this._coverMinTx+s&&e<=this._coverMaxTx-s&&t>=this._coverMinTz+s&&t<=this._coverMaxTz-s){this._graph||this._rebuildGraph();return}let c=Math.min(this._coverMinTx,r),l=Math.max(this._coverMaxTx,i),u=Math.min(this._coverMinTz,a),d=Math.max(this._coverMaxTz,o);c===this._coverMinTx&&l===this._coverMaxTx&&u===this._coverMinTz&&d===this._coverMaxTz&&this._graph||(this._coverMinTx=c,this._coverMaxTx=l,this._coverMinTz=u,this._coverMaxTz=d,this._rebuildGraph())}update(e,t,n){if(this._graph){this._timeSec+=e,this._updateFrustum(t);for(let t of this._agents)t.ageSec+=e;this._collectActiveCounts(),this._stepMovement(e),this._cull(e),this._despawn(),this._prefilled||=(this._fillSpawns(t,n,this._cfg.maxInView),!0),this._spawnTimer+=e,this._spawnTimer>=this._cfg.spawnInterval&&(this._spawnTimer=0,this._fillSpawns(t,n,this._cfg.spawnPerTick)),this._syncFollowedFlag()}}countInView(e){this._updateFrustum(e);let t=0;for(let e of this._agents)this._inView(e.mesh.position)&&(t+=1);return t}dispose(){for(let e of this._agents)e.mesh.removeFromParent();this._agents=[],this._reservations.clear(),this._followedId=null}cycleFollow(e){if(!this._cfg.followable||this._agents.length===0)return null;this._updateFrustum(e);let t=this._agents.filter(e=>this._inView(e.mesh.position)),n=t.length>0?t:[...this._agents];if(this._followedId===null)this._followedId=this._nearestId(n,e.position);else{let e=n.findIndex(e=>e.id===this._followedId);this._followedId=n[(e+1)%n.length]?.id??null}return this._syncFollowedFlag(),this.getFollowPosition()}clearFollow(){this._followedId=null;for(let e of this._agents)e.followed=!1}getFollowPosition(){let e=this._agents.find(e=>e.id===this._followedId);return e?e.mesh.position:null}isFollowing(){return this._followedId!==null}_rebuildGraph(){this._graph=wh(this._coverMinTx,this._coverMaxTx,this._coverMinTz,this._coverMaxTz,this._cfg.cruiseY);let e=[];for(let t of this._agents)this._graph.edges.has(t.edgeId)?e.push(t):this._removeAgent(t);this._agents=e,this._edgeOwner.clear()}_collectActiveCounts(){this._activeCounts.clear();for(let e of this._agents)this._activeCounts.set(e.variantId,(this._activeCounts.get(e.variantId)??0)+1)}_stepMovement(e){if(this._frameDt=e,this._cfg.smoothFlow){this._stepMovementSmooth(e);return}let t=this._graph,n=t.edgeLength,{intersectionRadius:r}=this._cfg,i=Math.min(this._cfg.turnRadius,r),a=1-i/n,o=1-r/n;this._pruneStaleReservations();let s=new Map;for(let e of this._agents){if(e.turn)continue;let t=s.get(e.edgeId);t||s.set(e.edgeId,t=[]),t.push(e)}for(let e of s.values())e.sort((e,t)=>e.t-t.t);for(let c of this._agents){if(c.turn){this._advanceTurn(c,e);continue}let l=t.edges.get(c.edgeId);if(!l)continue;let u=c.baseSpeed;if(this._dualLaneTraffic()){let e=s.get(c.edgeId);if(e){let t=e[e.indexOf(c)+1];if(t){let e=(t.t-c.t)*n;u=this._speedFromClearance(e,u)}}}else{Th(l,c.t,this._cfg.laneOffset,this._tmpPos2);let e=this._tmpPos2.x+l.right.x*c.avoidLateral,t=this._tmpPos2.z+l.right.z*c.avoidLateral,n=this._aheadClearance(c,l.forward,l.right,e,t);u=this._speedFromClearance(n,u)}let d=l.toId,f=(1-c.t)*n,p=1,m=c.reservedNodeId===d;if(f<=r&&!m){let e=this._reservations.get(d);e===void 0?(this._reservations.set(d,c.id),c.reservedNodeId=d,m=!0):e!==c.id&&(p=o,u=0)}if(this._cfg.avoidHeadOn){let e=Oh(l),t=s.get(e);if(t){for(let e of t)if(!e.reversing&&(1-c.t-e.t)*n<this._cfg.headOnGap){u=0;break}}}if(this._cfg.cameraAvoidRadius>0&&!c.followed){Th(l,c.t,this._cfg.laneOffset,this._tmpPos2);let e=this._tmpPos2.x-this._camPos.x,t=this._tmpPos2.z-this._camPos.z,n=this._cfg.cameraAvoidRadius;e*e+t*t<n*n&&Math.abs(c.avoidLateral)<.35&&(u*=.45)}if(u<.01?c.stuckSec+=e:c.stuckSec=0,this._cfg.jamEscape&&!c.followed&&c.stuckSec>=this._cfg.jamStuckSec){if(c.t<=.18)this._rerouteFromJam(c,l,t),c.stuckSec=0;else if(c.t>=a)c.pendingNextId=null,c.reservedNodeId===d&&(this._reservations.delete(d),c.reservedNodeId=null),c.stuckSec=0;else if(c.stuckSec>=this._cfg.jamStuckSec+3.5){this._removeAgent(c);continue}}u=this._smoothSpeed(c,u,e);let h=c.t+u*e/n;if(h>p&&(h=Math.max(c.t,p)),!this._dualLaneTraffic()&&h>c.t&&u>0){Th(l,h,this._cfg.laneOffset,this._tmpPos2);let t=this._tmpPos2.x+l.right.x*c.avoidLateral,n=this._tmpPos2.z+l.right.z*c.avoidLateral;this._isBlockedAt(t,n,c)&&(h=c.t,c.speed=this._smoothSpeed(c,0,e))}if(c.t=h,c.reservedNodeId===l.fromId&&c.t*n>r&&(this._reservations.delete(c.reservedNodeId),c.reservedNodeId=null),m&&c.t>=a){if(c.pendingNextId===null){let e=this._cfg.headOnRouteGap,n=this._cfg.avoidHeadOn?Ah(t,l,this._cfg.turnBias,this._rand(c.id),this._agents,e):Dh(t,l,this._cfg.turnBias,this._rand(c.id));c.pendingNextId=n?n.id:``}if(c.pendingNextId===``){this._removeAgent(c);continue}let r=t.edges.get(c.pendingNextId);if(r){if(!(r.axis===l.axis&&r.sign===l.sign)){this._beginTurn(c,l,r,a,i,n),this._advanceTurn(c,e);continue}if(c.t>=1){let e=(c.t-1)*n;c.edgeId=r.id,c.t=Math.min(.95,e/n),c.pendingNextId=null}}}this._place(c,e)}!this._dualLaneTraffic()&&!this._cfg.smoothFlow&&this._resolveOverlaps(),this._agents=this._agents.filter(e=>e.mesh.parent!==null)}_rerouteFromJam(e,t,n){let r=(n.edgesFrom.get(t.fromId)??[]).filter(e=>e.id!==t.id),i=this._cfg.avoidHeadOn?jh(r,n,t,this._agents,this._cfg.headOnRouteGap,this._rand(e.id)):r[0]??null;i&&(e.edgeId=i.id,e.t=.08,e.pendingNextId=null,e.avoidLateral*=.25)}_beginTurn(e,t,n,r,i,a){let o=this._cfg.laneOffset,s=new U,c=new U;Th(t,r,o,s),Th(n,i/a,o,c);let l=Th(t,1,o,this._tmpPos).clone(),u=Th(n,0,o,this._tmpPos2).clone(),d=Nh(l,t.forward,u,n.forward)??l.lerp(u,.5),f=Ph(s,d,c);e.turn={prevEdgeId:t.id,nextEdgeId:n.id,exitT:i/a,p0:s,p1:d,p2:c,u:0,length:f}}_advanceTurn(e,t,n=!0){let r=e.turn,i=r.u,a=r.u;n&&(a=Math.min(1,r.u+e.baseSpeed*t/Math.max(r.length,.001)));let o=1-a,s=o*o,c=2*o*a,l=a*a,u=s*r.p0.x+c*r.p1.x+l*r.p2.x,d=s*r.p0.z+c*r.p1.z+l*r.p2.z,f=2*o*(r.p1.x-r.p0.x)+2*a*(r.p2.x-r.p1.x),p=2*o*(r.p1.z-r.p0.z)+2*a*(r.p2.z-r.p1.z),m=this._turnRight(f,p),h=this._cameraSidestep(e,u,d,m),g=u+h.x,_=d+h.z;if(!this._cfg.smoothFlow&&!this._dualLaneTraffic()&&n&&a>i&&this._isBlockedAt(g,_,e)){e.speed=0;return}if(n&&(r.u=a),e.speed=e.baseSpeed,r.u>=1){let n=this._graph.edges.get(r.prevEdgeId);n&&!this._cfg.smoothFlow&&this._releaseCorridor(n,e.id),e.edgeId=r.nextEdgeId,e.t=r.exitT,e.turn=null,e.pendingNextId=null;let i=this._graph.edges.get(e.edgeId);i&&!this._cfg.smoothFlow&&this._claimCorridor(i,e.id),i&&this._cfg.smoothFlow&&(e.headingX=i.forward.x,e.headingZ=i.forward.z),this._place(e,t);return}let v=r.p0.y+e.pathLift+Math.sin(this._timeSec*this._cfg.bobSpeed+e.bobPhase)*this._cfg.bobAmp;e.mesh.position.set(g,v,_);let y=Math.hypot(f,p);y>1e-6&&this._orientShip(e,g,v,_,f/y,p/y),this._cfg.smoothFlow&&(e.lastPosX=g,e.lastPosZ=_)}_place(e,t){let n=this._graph.edges.get(e.edgeId);if(!n)return;let r=this._cfg.smoothFlow&&e.speed<.01;Th(n,e.t,this._cfg.laneOffset,this._tmpPos),this._tmpPos.y+=e.pathLift+Math.sin(this._timeSec*this._cfg.bobSpeed+e.bobPhase)*this._cfg.bobAmp;let i=this._cameraSidestep(e,this._tmpPos.x,this._tmpPos.z,n.right);this._tmpPos.x+=i.x,this._tmpPos.z+=i.z,e.mesh.position.copy(this._tmpPos),r||this._orientShip(e,this._tmpPos.x,this._tmpPos.y,this._tmpPos.z,n.forward.x,n.forward.z),this._cfg.smoothFlow&&(e.lastPosX=this._tmpPos.x,e.lastPosZ=this._tmpPos.z)}_orientShip(e,t,n,r,i,a){if(this._cfg.smoothFlow){let o=Math.hypot(i,a);if(o<1e-8)return;let s=i/o,c=a/o,l=.22;e.headingX+=(s-e.headingX)*l,e.headingZ+=(c-e.headingZ)*l;let u=Math.hypot(e.headingX,e.headingZ);u>1e-8&&(e.headingX/=u,e.headingZ/=u),this._orientAlong(e,t-e.headingX,n,r-e.headingZ,0);return}this._orientAlong(e,t-i,n,r-a,this._frameDt)}_orientAlong(e,t,n,r,i){this._lookTarget.set(t,n,r),this._holdQuat.copy(e.mesh.quaternion),e.mesh.lookAt(this._lookTarget),this._targetQuat.copy(e.mesh.quaternion),e.mesh.quaternion.copy(this._holdQuat);let a=i<=0?1:1-Math.exp(-14*i);e.mesh.quaternion.slerp(this._targetQuat,Math.min(1,a))}_cameraSidestep(e,t,n,r){if(this._cfg.smoothFlow)return{x:0,z:0};let i=this._cfg.cameraAvoidRadius,a=0;if(i>0&&!e.followed&&r){let o=t-this._camPos.x,s=n-this._camPos.z,c=o*o+s*s;if(c<i*i){let t=i-Math.sqrt(Math.max(c,1e-4)),n=e.turn?null:this._graph.edges.get(e.edgeId);a=n?t*(o*n.forward.z-s*n.forward.x>=0?1:-1):t*(o*r.z-s*r.x>=0?1:-1)}}let o=this._cfg.cameraAvoidMaxOffset;a=je.clamp(a,-o,o),a=this._resolveSidestepCollisions(e,t,n,r,a);let s=Math.min(1,3*this._frameDt);return e.avoidLateral+=(a-e.avoidLateral)*s,r?{x:r.x*e.avoidLateral,z:r.z*e.avoidLateral}:{x:0,z:0}}_turnRight(e,t){let n=Math.hypot(e,t);return n<1e-5?this._panRight.set(1,0,0):this._panRight.set(t/n,0,-e/n)}_resolveSidestepCollisions(e,t,n,r,i){if(!r||i===0)return 0;let a=Math.max(this._cfg.cameraAvoidSeparation,this._cfg.separationRadius),o=a*a,s=i;for(let i=0;i<8;i++){let i=t+r.x*s,a=n+r.z*s,c=!Fh(i,a),l=this._cfg.smoothFlow||!this._sidestepHitsAgent(e,i,a,o);if(c&&l)return s;s*=.6}return 0}_sidestepHitsAgent(e,t,n,r){for(let i of this._agents){if(i.id===e.id)continue;let a=t-i.mesh.position.x,o=n-i.mesh.position.z;if(a*a+o*o<r)return!0}return!1}_cull(e){let t=this._cfg.nearHideRadius*this._cfg.nearHideRadius,n=this._cfg.visibilityGraceSec;for(let r of this._agents){let i=this._inView(r.mesh.position),a=t>0&&!r.followed&&r.mesh.position.distanceToSquared(this._camPos)<t,o=r.seenInView&&r.outOfViewSec<n,s=this._cfg.smoothFlow&&r.seenInView;r.mesh.visible=(i||r.followed||o||s)&&!a,i?(r.seenInView=!0,r.outOfViewSec=0):r.outOfViewSec+=e}}_despawn(){let e=[];for(let t of this._agents){if(t.followed){e.push(t);continue}if(t.ageSec>this._cfg.minLifetimeSec&&t.outOfViewSec>=this._cfg.despawnOutViewSec){this._removeAgent(t);continue}e.push(t)}this._agents=e}_removeAgent(e){if(e.reservedNodeId!==null&&(this._reservations.get(e.reservedNodeId)===e.id&&this._reservations.delete(e.reservedNodeId),e.reservedNodeId=null),!this._cfg.smoothFlow){let t=this._graph?.edges.get(e.edgeId);if(t&&this._releaseCorridor(t,e.id),this._clearPendingCorridor(e),e.turn){let t=this._graph?.edges.get(e.turn.prevEdgeId);t&&this._releaseCorridor(t,e.id)}}e.mesh.removeFromParent(),this._followedId===e.id&&(this._followedId=null)}_fillSpawns(e,t,n){let r=this._graph;this._updateFrustum(e);let i=0;for(let e of this._agents)(!e.seenInView||this._inView(e.mesh.position))&&(i+=1);if(i>=this._cfg.maxInView)return;let a=[];for(let e of r.edges.values()){if(Th(e,.9,this._cfg.laneOffset,this._tmpPos),!this._inView(this._tmpPos))continue;let n=this._tmpPos.x-t.x,r=this._tmpPos.z-t.z;a.push({edge:e,dist:n*n+r*r})}a.sort((e,t)=>e.dist-t.dist);let o=0,s=this._rand(this._nextId*131+this._agents.length);for(let{edge:e}of a){if(o>=n||i>=this._cfg.maxInView)break;this._trySpawnFeeder(e,s)&&(o+=1,i+=1)}}_trySpawnFeeder(e,t){let{laneOffset:n,intersectionRadius:r}=this._cfg,i=this._graph.edgeLength,a=null,o=null;for(let t=0;t<=.96;t+=.06)if(Th(e,t,n,this._tmpPos),!this._inView(this._tmpPos))o=t;else if(o!==null){a=o;break}if(a===null)return!1;let s=a;if(Th(e,s,n,this._tmpPos),this._cfg.avoidHeadOn){let t=Oh(e);for(let e of this._agents)if(!(e.edgeId!==t||e.turn)&&(1-s-e.t)*i<this._cfg.headOnGap)return!1}if((1-s)*i<=r&&this._reservations.get(e.toId)!==void 0)return!1;if(this._cfg.smoothFlow){if(this._opposingTrafficOn(e,-1))return!1;let t=this._cfg.minGap*this._cfg.minGap;for(let e of this._agents){let n=this._tmpPos.x-e.mesh.position.x,r=this._tmpPos.z-e.mesh.position.z;if(n*n+r*r<t)return!1}}else{let e=this._cfg.separationRadius,t=e*e;for(let e of this._agents){let n=this._tmpPos.x-e.mesh.position.x,r=this._tmpPos.z-e.mesh.position.z;if(n*n+r*r<t)return!1}}let c=this._provideModel(t,this._activeCounts);if(!c)return!1;let l=c.object;l.traverse(e=>{e.frustumCulled=!1}),Th(e,s,n,this._tmpPos2),l.position.copy(this._tmpPos2),l.lookAt(this._tmpPos2.x-e.forward.x,this._tmpPos2.y,this._tmpPos2.z-e.forward.z),l.visible=!0,this.root.add(l);let u=this._cfg.speedMin+t()*(this._cfg.speedMax-this._cfg.speedMin),d=this._nextId++;return this._agents.push({id:d,variantId:c.variantId,mesh:l,edgeId:e.id,t:s,baseSpeed:u,speed:u,bobPhase:t()*Math.PI*2,ageSec:0,outOfViewSec:0,seenInView:!1,followed:!1,reservedNodeId:null,pendingNextId:null,turn:null,avoidLateral:0,stuckSec:0,reversing:!1,reverseSec:0,stuckPosSec:0,lastPosX:l.position.x,lastPosZ:l.position.z,pathLift:this._cfg.smoothFlow?(d%3-1)*1.15:0,waitingForNode:null,headingX:e.forward.x,headingZ:e.forward.z}),this._activeCounts.set(c.variantId,(this._activeCounts.get(c.variantId)??0)+1),!0}_rand(e){return em($p(e,Math.floor(this._timeSec*1e3)&65535,this._seedSalt))}_routeRand(e,t){let n=0;for(let e=0;e<t.length;e++)n=n*31+t.charCodeAt(e)|0;return em($p(e,n,this._seedSalt))}_updateFrustum(e){e.updateMatrixWorld(!1),this._projScreen.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._projScreen),e.getWorldPosition(this._camPos)}_inView(e){return this._sphere.center.copy(e),this._sphere.radius=this._cfg.viewRadius,this._frustum.intersectsSphere(this._sphere)}_nearestId(e,t){let n=null,r=1/0;for(let i of e){let e=i.mesh.position.distanceToSquared(t);e<r&&(r=e,n=i)}return n?.id??null}_syncFollowedFlag(){for(let e of this._agents)e.followed=e.id===this._followedId}_stepMovementSmooth(e){let t=this._graph,n=t.edgeLength,{intersectionRadius:r}=this._cfg,i=Math.min(this._cfg.turnRadius,r),a=1-i/n,o=1-r/n,s=Math.max(.22,a-i*1.4/n),c=this._agents.map((e,t)=>t).sort((e,t)=>this._agents[e].id-this._agents[t].id);for(let l of c){let c=this._agents[l];if(c.turn){c.stuckPosSec=0,this._advanceTurn(c,e);continue}let u=t.edges.get(c.edgeId);if(!u){this._removeAgent(c);continue}let d=u.toId,f=(1-c.t)*n<=r,p=f&&this._nodeOccupied(d,c.id);p&&c.reservedNodeId!==d?c.waitingForNode=d:(c.reservedNodeId===d||!p)&&(c.waitingForNode=null);let m=c.waitingForNode===d&&f;if(this._opposingTrafficOn(u,c.id)){c.t=Math.min(c.t,o-.01),c.speed=this._smoothSpeed(c,0,e),this._place(c,e);continue}c.reservedNodeId===u.fromId&&c.t*n>r&&(this._reservations.get(u.fromId)===c.id&&this._reservations.delete(u.fromId),c.reservedNodeId=null,c.waitingForNode===u.fromId&&(c.waitingForNode=null));let h=c.baseSpeed,g=this._shipAheadT(c,u.id);if(g!==null){let e=(g-c.t)*n;h=this._speedFromClearance(e,h)}let _=c.t+h*e/n;if(m?_=Math.min(_,Math.max(c.t,o-.01)):f&&!p&&(this._reservations.set(d,c.id),c.reservedNodeId=d),c.pendingNextId===null&&_>=s){let e=this._pickFreeEdge(u,c.id,this._routeRand(c.id,u.id));e&&(c.pendingNextId=e.id)}if(c.pendingNextId){let r=t.edges.get(c.pendingNextId);if(r){let t=r.axis===u.axis&&r.sign===u.sign;if(!t&&!m){let t=h*e,o=Math.max(0,(a-c.t)*n),s=Math.min(t,o);c.t+=s/n;let l=t-s;if(c.t>=a-1e-5){c.t=a,this._beginTurn(c,u,r,a,i,n),l>0&&(c.turn.u=Math.min(1,l/Math.max(c.turn.length,.001))),this._reservations.set(d,c.id),c.reservedNodeId=d,c.speed=h,this._advanceTurn(c,e,!1);continue}c.speed=this._smoothSpeed(c,h,e),this._place(c,e);continue}if(t&&_>=1){c.edgeId=r.id,c.t=Math.min(.95,_-1),c.pendingNextId=null,c.headingX=r.forward.x,c.headingZ=r.forward.z,c.speed=m?0:c.baseSpeed,this._place(c,e);continue}c.t=t?_:Math.min(_,a)}else c.pendingNextId=null}else if(_>=1){if(_=Math.min(_,o-.01),!p){let e=this._pickFreeEdge(u,c.id,this._routeRand(c.id,u.id));e&&(c.pendingNextId=e.id)}c.t=_}else c.t=_;let v=m?0:h;c.speed=this._smoothSpeed(c,v,e),this._place(c,e)}this._agents=this._agents.filter(e=>e.mesh.parent!==null)}_pickFreeEdge(e,t,n){let r=this._graph,i=Eh(r,e).filter(e=>!this._opposingTrafficOn(e,t));if(i.length===0)return null;let a=i.filter(t=>t.axis===e.axis&&t.sign===e.sign),o=i.filter(t=>!(t.axis===e.axis&&t.sign===e.sign)),s=this._cfg.turnBias.straight,c=this._cfg.turnBias.turn,l=a.length>0?s:0,u=l+(o.length>0?c:0);if(u===0)return i[0]??null;let d=n(),f=n();return d*u<l&&a.length>0?a[Math.floor(f*a.length)]:o.length>0?o[Math.floor(f*o.length)]:a[0]??null}_aheadClearance(e,t,n,r,i){let a=this._cfg.laneOffset>0?this._cfg.laneOffset*.75:this._cfg.separationRadius*1.2,o=this._cfg.followGap*2;for(let s of this._agents){if(s.id===e.id||this._areOpposingLanePair(e,s))continue;let c=s.mesh.position.x,l=s.mesh.position.z,u=c-r,d=l-i;if(u*t.x+d*t.z<=.15||Math.abs(u*n.x+d*n.z)>a)continue;let f=Math.hypot(u,d);f<o&&(o=f)}return o}_speedFromClearance(e,t){let{minGap:n,followGap:r}=this._cfg;return e<=n?0:e<r?t*Math.max(0,(e-n)/(r-n)):t}_isBlockedAt(e,t,n){let r=this._cfg.separationRadius,i=r*r;for(let r of this._agents){if(r.id===n.id||this._areOpposingLanePair(n,r))continue;let a=e-r.mesh.position.x,o=t-r.mesh.position.z;if(a*a+o*o<i)return!0}return!1}_agentTravelEdge(e,t){let n=e.turn?e.turn.prevEdgeId:e.edgeId;return t.edges.get(n)??null}_areOpposingLanePair(e,t){if(this._cfg.laneOffset<=0)return!1;let n=this._graph;if(!n)return!1;let r=this._agentTravelEdge(e,n),i=this._agentTravelEdge(t,n);return!r||!i?!1:Oh(r)===i.id}_dualLaneTraffic(){return this._cfg.laneOffset>0}_opposingTrafficOn(e,t){let n=Oh(e);for(let e of this._agents)if(e.id!==t){if(e.turn){if(e.turn.nextEdgeId===n)return!0;continue}if(e.edgeId===n||e.pendingNextId===n)return!0}return!1}_shipAheadT(e,t){let n=null;for(let r of this._agents){if(r.id===e.id)continue;let i=null;if(r.turn)if(r.turn.prevEdgeId===t)i=1;else continue;else r.edgeId===t&&(i=r.t);i===null||i<=e.t+.02||(n===null||i<n)&&(n=i)}return n}_claimCorridor(e,t){this._edgeOwner.set(e.id,t),this._edgeOwner.set(Oh(e),t)}_releaseCorridor(e,t){this._edgeOwner.get(e.id)===t&&this._edgeOwner.delete(e.id);let n=Oh(e);this._edgeOwner.get(n)===t&&this._edgeOwner.delete(n)}_clearPendingCorridor(e){e.pendingNextId=null}_nodeOccupied(e,t){let n=this._reservations.get(e);if(n!==void 0&&n!==t)return!0;for(let n of this._agents)if(n.id!==t&&(n.reservedNodeId===e||n.turn&&this._turnUsesNode(n,e)))return!0;return!1}_turnUsesNode(e,t){let n=e.turn;if(!n)return!1;let r=this._graph;if(!r)return!1;let i=r.edges.get(n.prevEdgeId);if(i&&(i.fromId===t||i.toId===t))return!0;let a=r.edges.get(n.nextEdgeId);return!!(a&&(a.fromId===t||a.toId===t))}_smoothSpeed(e,t,n){let r=t>=e.speed?18:12,i=1-Math.exp(-r*n);return e.speed+=(t-e.speed)*i,e.speed}_pruneStaleReservations(){for(let[e,t]of[...this._reservations.entries()]){let n=this._agents.find(e=>e.id===t);if(!n){this._reservations.delete(e);continue}n.stuckSec>2.2&&(this._reservations.delete(e),n.reservedNodeId===e&&(n.reservedNodeId=null))}}_resolveOverlaps(){if(this._dualLaneTraffic()||this._cfg.smoothFlow)return;let e=this._cfg.separationRadius,t=e*e;for(let n=0;n<this._agents.length;n++){let r=this._agents[n];for(let i=n+1;i<this._agents.length;i++){let n=this._agents[i];if(this._areOpposingLanePair(r,n))continue;let a=n.mesh.position.x-r.mesh.position.x,o=n.mesh.position.z-r.mesh.position.z,s=a*a+o*o;if(s>=t)continue;s<1e-8&&(a=1,o=0,s=1);let c=Math.sqrt(s),l=(e-c)*.51,u=a/c,d=o/c;r.mesh.position.x-=u*l,r.mesh.position.z-=d*l,n.mesh.position.x+=u*l,n.mesh.position.z+=d*l}}}};function Nh(e,t,n,r){let i=r.x*t.z-t.x*r.z;if(Math.abs(i)<1e-6)return null;let a=n.x-e.x,o=n.z-e.z,s=(r.x*o-r.z*a)/i;return new U(e.x+t.x*s,e.y,e.z+t.z*s)}function Ph(e,t,n){let r=0,i=e.x,a=e.z;for(let o=1;o<=6;o++){let s=o/6,c=1-s,l=c*c*e.x+2*c*s*t.x+s*s*n.x,u=c*c*e.z+2*c*s*t.z+s*s*n.z,d=l-i,f=u-a;r+=Math.sqrt(d*d+f*f),i=l,a=u}return r}function Fh(e,t){let n=Math.round(e/22),r=Math.round(t/22),i=e-n*22,a=t-r*22,o=Ep*.5;if(Math.abs(i)>o||Math.abs(a)>o)return!1;let s=Ep*.2;return!(Math.abs(i)<s&&Math.abs(a)<s)}var Ih=class{root;_system;_lifetimeCounts=new Map;constructor(e){let t={cruiseY:Vp,laneOffset:Q.laneOffset,maxInView:Q.maxInView,spawnPerTick:Q.spawnPerTick,spawnInterval:Q.spawnInterval,minLifetimeSec:Q.minLifetimeSec,despawnOutViewSec:Q.despawnOutViewSec,speedMin:Q.speedMin,speedMax:Q.speedMax,bobAmp:Q.bobAmp,bobSpeed:Q.bobSpeed,followGap:Q.followGap,minGap:Q.minGap,separationRadius:Q.separationRadius,intersectionRadius:Q.intersectionRadius,turnRadius:Q.turnRadius,viewRadius:Q.viewRadius,nearHideRadius:Q.nearHideRadius,cameraAvoidRadius:Q.cameraAvoidRadius,cameraAvoidMaxOffset:Q.cameraAvoidMaxOffset,cameraAvoidSeparation:Q.cameraAvoidSeparation,visibilityGraceSec:Q.visibilityGraceSec,turnBias:{straight:Q.turnStraight,turn:Q.turnTurn},coverageMargin:Q.coverageMargin,avoidHeadOn:Q.avoidHeadOn,headOnGap:Q.headOnGap,headOnRouteGap:Q.headOnRouteGap,jamEscape:Q.jamEscape,jamStuckSec:Q.jamStuckSec,jamReverseSpeed:Q.jamReverseSpeed,jamReverseMaxSec:Q.jamReverseMaxSec,smoothFlow:Q.smoothFlow,followable:!1};this._system=new Mh(t,(t,n)=>{let r=e.pickVarietyId(t,n,this._lifetimeCounts);if(!r)return null;let i=e.cloneCar(r,Math.floor(t()*1e6));if(!i)return null;let a=Q.scaleMin+t()*(Q.scaleMax-Q.scaleMin);return i.scale.multiplyScalar(a),this._lifetimeCounts.set(r,(this._lifetimeCounts.get(r)??0)+1),{object:i,variantId:r}},1128354388),this.root=this._system.root}get carCount(){return this._system.agentCount}ensureCoverage(e,t,n){this._system.ensureCoverage(e,t,n)}update(e,t,n){this._system.update(e,t,n)}countInView(e){return this._system.countInView(e)}dispose(){this._system.dispose()}},Lh=class{camera;target=new U(...Gp.target);_distance=Gp.distance;_polar=Gp.polarAngle;_azimuth=Gp.azimuth;_dragging=!1;_lastX=0;_lastY=0;_followWorld=null;_followScratch=new U;_panRight=new U;_panForward=new U;_lookDir=new U;onFollowCleared=null;constructor(e){this.camera=new vr(52,1,.1,400),this._bind(e),this._apply()}get distance(){return this._distance}resize(e,t){this.camera.aspect=e/Math.max(t,1),this.camera.updateProjectionMatrix()}setFollowWorld(e){this._followWorld=e}clearFollow(){this._followWorld=null}isFollowing(){return this._followWorld!==null}update(e){if(this._followWorld){this._followScratch.set(this._followWorld.x,Gp.target[1],this._followWorld.z);let t=1-Math.exp(-4.5*e);this.target.lerp(this._followScratch,t)}this._apply()}getAnchorXZ(){return{x:this.target.x,z:this.target.z}}_apply(){let e=Math.sin(this._polar),t=Math.cos(this._polar),n=Math.sin(this._azimuth),r=Math.cos(this._azimuth);this.camera.position.set(this.target.x+this._distance*e*n,this.target.y+this._distance*t,this.target.z+this._distance*e*r),this.camera.lookAt(this.target)}_panTarget(e,t){let n=this._distance*Gp.panScale;this.camera.getWorldDirection(this._lookDir),this._panRight.set(this._lookDir.z,0,-this._lookDir.x).normalize(),this._panForward.set(this._lookDir.x,0,this._lookDir.z).normalize(),this.target.x+=(this._panRight.x*e+this._panForward.x*t)*n,this.target.z+=(this._panRight.z*e+this._panForward.z*t)*n}_bind(e){e.addEventListener(`pointerdown`,t=>{this._dragging=!0,this._lastX=t.clientX,this._lastY=t.clientY,this._followWorld&&(this._followWorld=null,this.onFollowCleared?.()),e.setPointerCapture(t.pointerId)}),e.addEventListener(`pointerup`,()=>{this._dragging=!1}),e.addEventListener(`pointermove`,e=>{if(!this._dragging)return;let t=e.clientX-this._lastX,n=e.clientY-this._lastY;this._lastX=e.clientX,this._lastY=e.clientY,this._panTarget(t,n),this._apply()}),e.addEventListener(`wheel`,e=>{e.preventDefault(),this._distance=je.clamp(this._distance+e.deltaY*.04,Gp.minDistance,Gp.maxDistance),this._apply()},{passive:!1})}},Rh=6.2,zh=class{root;_system;_template=null;constructor(){let e={cruiseY:Bp,laneOffset:$.laneOffset,maxInView:$.maxInView,spawnPerTick:$.spawnPerTick,spawnInterval:$.spawnInterval,minLifetimeSec:$.minLifetimeSec,despawnOutViewSec:$.despawnOutViewSec,speedMin:$.speedMin,speedMax:$.speedMax,bobAmp:$.bobAmp,bobSpeed:$.bobSpeed,followGap:$.followGap,minGap:$.minGap,separationRadius:$.separationRadius,intersectionRadius:$.intersectionRadius,turnRadius:$.turnRadius,viewRadius:$.viewRadius,nearHideRadius:$.nearHideRadius,cameraAvoidRadius:$.cameraAvoidRadius,cameraAvoidMaxOffset:$.cameraAvoidMaxOffset,cameraAvoidSeparation:$.cameraAvoidSeparation,visibilityGraceSec:$.visibilityGraceSec,turnBias:{straight:$.turnStraight,turn:$.turnTurn},coverageMargin:$.coverageMargin,avoidHeadOn:$.avoidHeadOn,headOnGap:$.headOnGap,headOnRouteGap:$.headOnRouteGap,jamEscape:$.jamEscape,jamStuckSec:$.jamStuckSec,jamReverseSpeed:$.jamReverseSpeed,jamReverseMaxSec:$.jamReverseMaxSec,smoothFlow:$.smoothFlow,followable:!0};this._system=new Mh(e,e=>{if(!this._template)return null;let t=this._template.clone(!0),n=$.scaleMin+e()*($.scaleMax-$.scaleMin);return t.scale.multiplyScalar(n),{object:t,variantId:`ship`}},1397246288),this.root=this._system.root}get shipCount(){return this._system.agentCount}async loadShipModel(e){try{let t=await new Of().loadAsync(e),n=new at().setFromObject(t.scene),r=Math.max(n.max.x-n.min.x,.001),i=new Eo;i.add(t.scene),i.scale.setScalar(Rh/r),i.rotation.y=-Math.PI/2;let a=new Eo;a.add(i),this._prepareShipMeshes(a,t.parser),this._template=a}catch{this._template=Bh()}}ensureCoverage(e,t,n){this._system.ensureCoverage(e,t,n)}update(e,t,n){this._system.update(e,t,n)}countInView(e){return this._system.countInView(e)}cycleFollow(e){return this._system.cycleFollow(e)}clearFollow(){this._system.clearFollow()}getFollowPosition(){return this._system.getFollowPosition()}isFollowing(){return this._system.isFollowing()}dispose(){this._system.dispose()}_prepareShipMeshes(e,t){let n=t.json.materials??[],r=new Map;for(let e of n){if(!e.name)continue;let t=e.pbrMetallicRoughness;t&&r.set(e.name,{metallic:t.metallicFactor,roughness:t.roughnessFactor})}e.traverse(e=>{if(!(e instanceof K))return;e.castShadow=!0,e.receiveShadow=!0,e.frustumCulled=!1;let t=Array.isArray(e.material)?e.material:[e.material];for(let e of t){if(!(e instanceof lc))continue;let t=r.get(e.name);t?.metallic!==void 0&&(e.metalness=t.metallic),t?.roughness!==void 0&&(e.roughness=t.roughness),e.map&&(e.map.anisotropy=8,e.map.needsUpdate=!0),e.emissiveMap&&(e.emissiveMap.anisotropy=8,e.emissiveMap.needsUpdate=!0)}})}};function Bh(){let e=new lc({color:8952234,metalness:.4,roughness:.5}),t=new Eo,n=new K(new cr(2.8,.55,.85),e),r=new K(new cr(1,.45,.55),e);r.position.set(1,.22,0);let i=new K(new cr(1.8,.12,1.4),e);i.position.set(-.2,0,0),t.add(n,r,i);let a=new Eo;a.add(t),a.rotation.y=-Math.PI/2;let o=new Eo;return o.add(a),o.traverse(e=>{e.frustumCulled=!1}),o}var Vh=class{root=new Eo;_clouds=[];_stars;_moon;_timeSec=0;constructor(){let e=new K(new sc(180,32,16),new gr({side:1,depthWrite:!1,uniforms:{uHorizon:{value:new G(.08,.12,.22)},uZenith:{value:new G(.02,.03,.09)},uGlow:{value:new G(.25,.35,.65)}},vertexShader:`
        varying vec3 vWorld;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorld = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,fragmentShader:`
        uniform vec3 uHorizon;
        uniform vec3 uZenith;
        uniform vec3 uGlow;
        varying vec3 vWorld;
        void main() {
          float h = normalize(vWorld).y * 0.5 + 0.5;
          vec3 col = mix(uHorizon, uZenith, pow(h, 1.4));
          col += uGlow * pow(max(h - 0.55, 0.0), 2.0) * 0.35;
          gl_FragColor = vec4(col, 1.0);
        }
      `}));e.frustumCulled=!1,this.root.add(e);let t=new Float32Array(900*3),n=em(1398030674);for(let e=0;e<900;e++){let r=n()*Math.PI*2,i=Math.acos(n()*.85+.05);t[e*3]=160*Math.sin(i)*Math.cos(r),t[e*3+1]=160*Math.cos(i),t[e*3+2]=160*Math.sin(i)*Math.sin(r)}let r=new Hn;r.setAttribute(`position`,new jn(t,3));let i=new bs({color:14544639,size:.55,sizeAttenuation:!0,transparent:!0,opacity:.85,depthWrite:!1});this._stars=new Ts(r,i),this.root.add(this._stars);let a=new lc({color:16773341,emissive:16772829,emissiveIntensity:.55,roughness:.95});this._moon=new K(new sc(4.5,24,24),a),this._moon.position.set(55,75,-40),this.root.add(this._moon);for(let e=0;e<22;e++){let t=em($p(e,0,1129074500)),n=8+t()*18,r=new lc({color:8952251,emissive:3359846,emissiveIntensity:.08,transparent:!0,opacity:.22+t()*.18,depthWrite:!1}),i=new K(new sc(n,8,8),r);i.position.set((t()-.5)*120,28+t()*35,(t()-.5)*120),i.scale.set(1.6,.45+t()*.25,1.1),this._clouds.push(i),this.root.add(i)}}update(e,t){this._timeSec+=e,this.root.position.copy(t),this._stars.rotation.y=this._timeSec*.003,this._moon.position.x=55+Math.sin(this._timeSec*.04)*4,this._moon.position.y=75+Math.sin(this._timeSec*.06)*2;for(let t=0;t<this._clouds.length;t++){let n=this._clouds[t];n.position.x+=e*(.6+t%5*.15),n.position.x>90&&(n.position.x=-90),n.position.y+=Math.sin(this._timeSec*.2+t)*e*.08}}dispose(){this.root.traverse(e=>{e instanceof K&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(e=>e.dispose()):e.material.dispose()),e instanceof Ts&&(e.geometry.dispose(),e.material.dispose())})}},Hh=class{root;_flakes=[];_count;_spread=95;_height=55;_positions;constructor(e=350){this._count=e,this._positions=new Float32Array(e*3);let t=em(1397641047);for(let n=0;n<e;n++){let e={x:(t()-.5)*this._spread,y:t()*this._height,z:(t()-.5)*this._spread,vy:1.2+t()*2.8,vx:(t()-.5)*.35,vz:(t()-.5)*.35,wobble:t()*Math.PI*2,phase:t()*Math.PI*2};this._flakes.push(e),this._write(n,e)}let n=new Hn;n.setAttribute(`position`,new jn(this._positions,3)),this.root=new Ts(n,new bs({color:15660287,size:.22,transparent:!0,opacity:.75,depthWrite:!1,sizeAttenuation:!0}))}update(e,t,n,r){this.root.position.set(t,0,n);let i=this.root.geometry.getAttribute(`position`);for(let t=0;t<this._count;t++){let n=this._flakes[t],i=Math.sin(r*.9+n.phase)*.45;if(n.x+=(n.vx+i)*e,n.y-=n.vy*e,n.z+=(n.vz+Math.cos(r*.7+n.wobble)*.25)*e,n.y<-2){let e=em($p(t,Math.floor(r*10),1380275013));n.y=this._height+e()*8,n.x=(e()-.5)*this._spread,n.z=(e()-.5)*this._spread}let a=this._spread*.55;n.x>a&&(n.x=-a),n.x<-a&&(n.x=a),n.z>a&&(n.z=-a),n.z<-a&&(n.z=a),this._write(t,n)}i.needsUpdate=!0}dispose(){this.root.geometry.dispose(),this.root.material.dispose()}_write(e,t){this._positions[e*3]=t.x,this._positions[e*3+1]=t.y,this._positions[e*3+2]=t.z}},Uh=`buildings`,Wh=[`small_house`,`shop`,Uh,`park`,`industrial`,`landmark`];function Gh(e,t){return(e%t+t)%t}function Kh(e,t){return Gh(e-t,2)===0?`apartment`:`office`}function qh(e,t){return Gh(e+t*2,Wh.length)}function Jh(e,t){let n=Wh[qh(e,t)];return n===Uh?Kh(e,t):n}var Yh=Ep*.5,Xh=Pp,Zh=.82,Qh=Op*Zh*.5,$h=.55,eg=Yh-$h-Qh,tg=Qh,ng=Yh-$h-tg,rg=Math.max(2.25,ng-1.35-2.75),ig=rg*2,ag=[`south`,`north`,`east`,`west`],og={south:0,north:Math.PI,east:-Math.PI/2,west:Math.PI/2},sg={south:0,north:Math.PI,east:Math.PI/2,west:-Math.PI/2},cg={south:Math.PI,north:0,east:-Math.PI/2,west:Math.PI/2},lg=ng,ug=Math.max(2.75,lg-1-1.25),dg=ug*2,fg=4,pg=3,mg=new Set([`landmark`,`civic`,`park`,`industrial`]),hg=new Set([`apartment`,`office`]);function gg(e){return{x:0,z:0,rotationY:og[e],scale:1}}var _g=[{x:-7,z:-7,rotationY:0,scale:.85},{x:7,z:-7,rotationY:Math.PI,scale:.85},{x:-7,z:7,rotationY:Math.PI*.5,scale:.85},{x:7,z:7,rotationY:-Math.PI*.5,scale:.85}];function vg(e){return ag[Math.floor(e*ag.length)]}function yg(e,t,n,r,i,a){let o=a[t];switch(t){case`south`:e.push({x:n,z:i,rotationY:o,scale:r});break;case`north`:e.push({x:n,z:-i,rotationY:o,scale:r});break;case`east`:e.push({x:i,z:n,rotationY:o,scale:r});break;case`west`:e.push({x:-i,z:n,rotationY:o,scale:r});break}}function bg(){let e=Zh,t=ig/(pg-1),n=-rg,r=[];for(let i of ag)for(let a=0;a<pg;a++)yg(r,i,n+t*a,e,lg,sg);return r}function xg(){let e=Zh,t=dg/(fg-1),n=-ug,r=[];for(let i of ag)for(let a=0;a<fg;a++)yg(r,i,n+t*a,e,lg,cg);return r}function Sg(e,t){let n=Math.min(Math.max(e,4),5),r=og[t],i=n>1?Xh/(n-1):0,a=-Xh/2,o=Zh,s=[];for(let e=0;e<n;e++){let n=a+i*e;switch(t){case`south`:s.push({x:n,z:eg,rotationY:r,scale:o});break;case`north`:s.push({x:n,z:-eg,rotationY:r,scale:o});break;case`east`:s.push({x:eg,z:n,rotationY:r,scale:o});break;case`west`:s.push({x:-eg,z:n,rotationY:r,scale:o});break}}return s}function Cg(e){return(e>0?e:Pp)*Fp/Op*Ip}function wg(e,t){let n=Math.min(Math.max(e,6),16),r=og[t],i=Math.ceil(Math.sqrt(n)),a=Math.ceil(n/i),o=i>1?Pp/(i-1):0,s=a>1?Pp/(a-1):0,c=i>1&&a>1?Math.min(o,s):i>1?o:a>1?s:0,l=i>1?o*(i-1):0,u=a>1?s*(a-1):0,d=-l/2,f=-u/2,p=Cg(c),m=[],h=0;for(let e=0;e<a&&h<n;e++)for(let t=0;t<i&&h<n;t++)m.push({x:d+t*o,z:f+e*s,rotationY:r,scale:p}),h+=1;return m}function Tg(){return{x:0,z:0,rotationY:0,scale:1}}function Eg(e,t,n,r){if(e===`shop`)return bg();if(e===`small_house`)return xg();let i=r??vg(n());return mg.has(e)?[gg(i)]:hg.has(e)?wg(t,i):Sg(t,i)}function Dg(e,t){return mg.has(e)?1:e===`shop`?pg*4:e===`small_house`?fg*4:hg.has(e)?t>.55?16:t>.3?12:9:t>.35?5:4}var Og={small_house:{trees:2,bushes:2,ring:[4.3,5.7]},apartment:{trees:1,bushes:3,ring:[6.9,7.8]},office:{trees:1,bushes:2,ring:[6.9,7.8]},shop:{trees:0,bushes:0,ring:[0,0]},industrial:{trees:2,bushes:3,ring:[5,7.6]},park:{trees:0,bushes:0,ring:[0,0]},civic:{trees:2,bushes:3,ring:[5,7.6]},landmark:{trees:2,bushes:3,ring:[5.2,7.6]}},kg={tree:[.85,1.15],bush:[.8,1.2]};function Ag(e,t){let n=Og[e],r=[],i=e===`park`,a=(e,a)=>{let[o,s]=kg[e];for(let c=0;c<a;c++){if(!i&&t()>.7)continue;let a=t()*Math.PI*2,c=n.ring[0]+t()*(n.ring[1]-n.ring[0]);r.push({kind:e,slot:{x:Math.cos(a)*c,z:Math.sin(a)*c,rotationY:t()*Math.PI*2,scale:o+t()*(s-o)}})}};return a(`tree`,n.trees),a(`bush`,n.bushes),r}var jg=Ep*.5;function Mg(e,t){let n=tm(e,t),r=Jh(e,t),i=Dg(r,n()),a=Eg(r,i,n),o=[];for(let e=0;e<Math.min(i,a.length);e++){let t=a[e];o.push({archetype:r,slot:{...t}})}let s=[];r===`shop`?s.push({kind:`shop_parking_lot`,slot:Tg()}):r===`small_house`&&s.push({kind:`fountain_garden`,slot:{x:0,z:0,rotationY:0,scale:1}});for(let e of _g)n()>.35&&s.push({kind:`street_light`,slot:{...e}});s.push(...Ag(r,n));let c=jg-1.2;return{archetype:r,buildings:o,props:s,lanes:[{start:new U(-c,zp,0),end:new U(c,zp,0)},{start:new U(0,zp,-c),end:new U(0,zp,c)}],floorTint:new G(.09+n()*.03,.11+n()*.03,.17+n()*.04)}}function Ng(){return new lc({color:new G(.09,.11,.16),metalness:.08,roughness:.88})}function Pg(){return new lc({color:new G(.2,.45,.85),emissive:new G(.12,.28,.65),emissiveIntensity:.55,metalness:.35,roughness:.4})}var Fg=20,Ig=class{root=new Eo;groundMaterial=Ng();edgeMaterial=Pg();_pool=[];_poolSize=19**2;_anchorTx=NaN;_anchorTz=NaN;_activeRadius=5;_catalog;_timeSec=0;_frustum=new Ar;_projScreenMatrix=new W;_cullSphere=new Ct;constructor(e){this._catalog=e;for(let e=0;e<this._poolSize;e++){let e=new K(new cr(Ep,.45,Ep),this.groundMaterial.clone());e.receiveShadow=!0,e.renderOrder=0,e.position.y=.02;let t=new K(new cr(Ep+.35,.12,Ep+.35),this.edgeMaterial);t.position.y=-.28,t.renderOrder=1;let n=new Eo,r=new Eo,i=new Eo;i.add(t,e,n,r),this._pool.push({key:``,tx:0,tz:0,root:i,content:n,ground:e,edge:t,lanes:r,capacity:8,hasHolograms:!1}),i.visible=!1,this.root.add(i)}}get anchorTx(){return this._anchorTx}get anchorTz(){return this._anchorTz}get activeRadius(){return this._activeRadius}get timeSec(){return this._timeSec}updateAnimation(e,t){this._timeSec+=e;let n=!1;t&&(t.updateMatrixWorld(!1),this._projScreenMatrix.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._projScreenMatrix),n=!0);for(let e of this._pool){if(!e.key)continue;let t=Jp(e.tx,e.tz),r=Kp(e.tx,e.tz,this._timeSec),i=qp(e.tx,e.tz,this._timeSec);if(e.root.position.set(t.x,r,t.z),e.root.rotation.set(i.x,0,i.z),n&&(this._cullSphere.center.set(t.x,r+6,t.z),this._cullSphere.radius=Fg,e.root.visible=this._frustum.intersectsSphere(this._cullSphere)),!(!e.root.visible||!e.hasHolograms))for(let t of e.content.children)Hm(t,this._timeSec)}}updateAnchor(e,t,n=5){let r=Math.min(9,Math.max(5,n)),i=Math.floor(e/22),a=Math.floor(t/22);if(i===this._anchorTx&&a===this._anchorTz&&r===this._activeRadius)return;this._anchorTx=i,this._anchorTz=a,this._activeRadius=r;let o=0,s=new Set;for(let e=-r;e<=r;e++)for(let t=-r;t<=r;t++){let n=i+t,r=a+e,c=`${n},${r}`,l=this._pool[o++];if(s.add(c),l.key===c){l.root.visible=!0;continue}l.key=c,l.tx=n,l.tz=r,l.root.visible=!0,this._fillTile(l)}for(let e=0;e<this._pool.length;e++){let t=this._pool[e];(e>=o||!s.has(t.key))&&(t.key=``,t.root.visible=!1)}this.updateAnimation(0)}dispose(){this.groundMaterial.dispose(),this.edgeMaterial.dispose();for(let e of this._pool)e.ground.geometry.dispose(),e.ground.material.dispose(),e.edge.geometry.dispose(),this._clearGroup(e.content),this._disposeGroup(e.lanes)}_fillTile(e){let t=Mg(e.tx,e.tz);e.ground.material.color.copy(t.floorTint),e.hasHolograms=t.archetype===`shop`,this._clearGroup(e.content),this._populateContent(e,t),this._disposeGroup(e.lanes)}_populateContent(e,t){let n=0;for(let r of t.buildings){let t=$p(e.tx,e.tz,n+1112885580),i=this._catalog.cloneBuilding(r.archetype,t);if(!i)continue;let a=.96+(t>>>8)%1e3/1e3*.08;i.rotation.order=`YXZ`,i.rotation.y=r.slot.rotationY,i.scale.multiplyScalar(r.slot.scale*a),i.position.set(r.slot.x,.48,r.slot.z),e.content.add(i),n+=1}let r=0;for(let n of t.props){let t=$p(e.tx,e.tz,r+1347571536),i=this._catalog.cloneProp(n.kind,t);i&&(i.position.set(n.slot.x,.48,n.slot.z),i.rotation.y=n.slot.rotationY,i.scale.setScalar(n.slot.scale),e.content.add(i),r+=1)}}_clearGroup(e){for(;e.children.length>0;){let t=e.children[0];e.remove(t)}}_disposeGroup(e){for(;e.children.length>0;){let t=e.children[0];e.remove(t),t instanceof K&&(t.geometry.dispose(),Array.isArray(t.material)?t.material.forEach(e=>e.dispose()):t.material.dispose())}}};async function Lg(){let e=new Tf;e.setStage(`Starting renderer…`,.04);let t=document.getElementById(`flamecore-canvas`);if(!(t instanceof HTMLCanvasElement))throw Error(`Expected #flamecore-canvas.`);let n=document.getElementById(`hud-fps`),r=Wu.create({canvas:t,antialias:!0,maxPixelRatio:2}),i=new Lh(t);r.setOverrideCamera(i.camera);let a=new Ju(`WorldPortfolio`);Rg(r.context.renderer,a.threeScene),_m(r.context.renderer),e.setStage(`Lighting scene…`,.1);let o=new Ku(`Environment`);o.addComponent(new td(ed())),o.addComponent(new ud(ld({backgroundColor:[.02,.03,.07],fog:{enabled:!0,color:[.04,.06,.12],near:70,far:160}}))),a.add(o);let s=new Ku(`MainCamera`);s.addComponent(new td(ed({position:[0,30,40]}))),s.addComponent(new $l(Ql({fov:52,near:.1,far:400}))),a.add(s);let c=new Ku(`Moonlight`);c.addComponent(new td(ed({position:[30,50,20],rotation:[-1,.35,0]}))),c.addComponent(new cd(sd({kind:`directional`,color:[.75,.82,1],intensity:2}))),a.add(c);let l=new Ku(`Ambient`);l.addComponent(new td(ed())),l.addComponent(new cd(sd({kind:`ambient`,color:[.45,.52,.72],intensity:.75}))),a.add(l);let u=new Ku(`TileWorldRoot`);u.addComponent(new td(ed())),a.add(u);let d=new hh;e.setStage(`Loading buildings…`,.18),await d.loadAll();let f=new bh;e.setStage(`Loading vehicles…`,.52),await f.loadAll();let p=new Ig(d),m=new zh,h=new Ih(f);i.onFollowCleared=()=>m.clearFollow();let g=new Vh,_=new Hh(400);u.object3D.add(g.root),u.object3D.add(_.root),u.object3D.add(p.root),u.object3D.add(h.root),u.object3D.add(m.root),e.setStage(`Loading ships…`,.72),await m.loadShipModel(`${Tp}/flying_ship.glb?v=20260625perfopt1`),e.setStage(`Placing tiles…`,.88),r.loadScene(a),r.start();let v=()=>{i.resize(t.clientWidth,t.clientHeight)};v(),window.addEventListener(`resize`,v);let y=0,b=0,x=0,S=Rp(i.distance,i.camera.fov,i.camera.aspect);m.ensureCoverage(0,0,S),h.ensureCoverage(0,0,S),p.updateAnchor(0,0,S),e.setStage(`Warming up world…`,.96),await new Promise(e=>{requestAnimationFrame(()=>requestAnimationFrame(()=>e()))}),await e.complete(),window.addEventListener(`keydown`,e=>{if(e.key===`f`||e.key===`F`){let e=m.cycleFollow(i.camera);i.setFollowWorld(e)}e.key===`Escape`&&(m.clearFollow(),i.clearFollow())}),r.events.on(`beforeUpdate`,({dt:e})=>{i.update(e),p.updateAnimation(e,i.camera),x+=e,g.update(e,i.camera.position),_.update(e,i.target.x,i.target.z,x);let t=Rp(i.distance,i.camera.fov,i.camera.aspect),{x:n,z:r}=i.getAnchorXZ();p.updateAnchor(n,r,t);let a=Math.floor(n/22),o=Math.floor(r/22);(a!==y||o!==b)&&(y=a,b=o),m.ensureCoverage(y,b,t),h.ensureCoverage(y,b,t),m.isFollowing()&&i.isFollowing()&&i.setFollowWorld(m.getFollowPosition()),m.update(e,i.camera,i.target),h.update(e,i.camera,i.target)});let C=0,w=0;r.events.on(`afterUpdate`,({dt:e})=>{C+=e,w+=1,C>=.5&&n&&(n.textContent=`${Math.round(w/C)} fps · ${m.countInView(i.camera)}/${m.shipCount} ships · ${h.countInView(i.camera)}/${h.carCount} cars`,C=0,w=0)}),window.worldPortfolio={runtime:r,scene:a,tileWorld:p,shipTraffic:m,carTraffic:h,vehicleCatalog:f,sky:g,snow:_,orbit:i}}Lg().catch(e=>{console.error(`[WorldPortfolio] boot failed:`,e);let t=document.getElementById(`load-error`),n=document.getElementById(`load-screen`);t instanceof HTMLElement&&(t.hidden=!1,t.textContent=`Failed to load the world. Refresh the page to try again.`),n instanceof HTMLElement&&(n.classList.add(`load-screen--error`),n.setAttribute(`aria-busy`,`false`));let r=document.getElementById(`load-label`);r instanceof HTMLElement&&(r.textContent=`Load failed`)});function Rg(e,t){let n=new ei(e);n.compileEquirectangularShader();let r=new Fo;r.background=new G(395796);let i=new Vc(8030890,1054760,.5);r.add(i);let a=new el(12110056,1.25);a.position.set(5,9,-3),r.add(a);let o=new el(3820136,.3);o.position.set(-7,2,5),r.add(o),t.environment=n.fromScene(r,.02).texture,n.dispose()}export{u as a,g as i,On as n,j as o,h as r,Rc as t};