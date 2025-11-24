var Ec=Object.create;var ls=Object.defineProperty;var Cc=Object.getOwnPropertyDescriptor;var Ac=Object.getOwnPropertyNames;var Pc=Object.getPrototypeOf,Mc=Object.prototype.hasOwnProperty;var Tc=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var $c=(t,e,o,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Ac(e))!Mc.call(t,i)&&i!==o&&ls(t,i,{get:()=>e[i],enumerable:!(r=Cc(e,i))||r.enumerable});return t};var Lc=(t,e,o)=>(o=t!=null?Ec(Pc(t)):{},$c(e||!t||!t.__esModule?ls(o,"default",{value:t,enumerable:!0}):o,t));var qs=Tc((ti,cn)=>{(function(t,e){typeof ti=="object"&&typeof cn=="object"?cn.exports=e():typeof define=="function"&&define.amd?define("SoundFont2",[],e):typeof ti=="object"?ti.SoundFont2=e():t.SoundFont2=e()})(window,function(){return function(t){var e={};function o(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,o),i.l=!0,i.exports}return o.m=t,o.c=e,o.d=function(r,i,n){o.o(r,i)||Object.defineProperty(r,i,{enumerable:!0,get:n})},o.r=function(r){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},o.t=function(r,i){if(1&i&&(r=o(r)),8&i||4&i&&typeof r=="object"&&r&&r.__esModule)return r;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:r}),2&i&&typeof r!="string")for(var a in r)o.d(n,a,function(s){return r[s]}.bind(null,a));return n},o.n=function(r){var i=r&&r.__esModule?function(){return r.default}:function(){return r};return o.d(i,"a",i),i},o.o=function(r,i){return Object.prototype.hasOwnProperty.call(r,i)},o.p="",o(o.s="./src/index.ts")}({"./src/chunk.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"SF2Chunk",function(){return c});var r=o("./src/riff/index.ts"),i=o("./src/constants.ts"),n=o("./src/chunks/index.ts");function a(f){return(a=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(h){return typeof h}:function(h){return h&&typeof Symbol=="function"&&h.constructor===Symbol&&h!==Symbol.prototype?"symbol":typeof h})(f)}function s(f,h){for(var g=0;g<h.length;g++){var b=h[g];b.enumerable=b.enumerable||!1,b.configurable=!0,"value"in b&&(b.writable=!0),Object.defineProperty(f,b.key,b)}}function l(f){return(l=Object.setPrototypeOf?Object.getPrototypeOf:function(h){return h.__proto__||Object.getPrototypeOf(h)})(f)}function u(f,h){return(u=Object.setPrototypeOf||function(g,b){return g.__proto__=b,g})(f,h)}function m(f){if(f===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return f}var c=function(f){function h(_){var S,E,L,D,W,j;return function(X,O){if(!(X instanceof O))throw new TypeError("Cannot call a class as a function")}(this,h),E=this,S=!(L=l(h).call(this,_.id,_.length,_.buffer,_.subChunks))||a(L)!=="object"&&typeof L!="function"?m(E):L,D=m(m(S)),j=void 0,(W="subChunks")in D?Object.defineProperty(D,W,{value:j,enumerable:!0,configurable:!0,writable:!0}):D[W]=j,S.subChunks=_.subChunks.map(function(X){return new h(X)}),S}var g,b,w;return function(_,S){if(typeof S!="function"&&S!==null)throw new TypeError("Super expression must either be null or a function");_.prototype=Object.create(S&&S.prototype,{constructor:{value:_,writable:!0,configurable:!0}}),S&&u(_,S)}(h,f),g=h,(b=[{key:"getMetaData",value:function(){if(this.id!=="LIST")throw new r.ParseError("Unexpected chunk ID","'LIST'","'".concat(this.id,"'"));var _=this.subChunks.reduce(function(S,E){if(E.id==="ifil"||E.id==="iver"){if(E.length!==i.SF_VERSION_LENGTH)throw new r.ParseError("Invalid size for the '".concat(E.id,"' sub-chunk"));S[E.id]="".concat(E.getInt16(),".").concat(E.getInt16(2))}else S[E.id]=E.getString();return S},{});if(!_.ifil)throw new r.ParseError("Missing required 'ifil' sub-chunk");if(!_.INAM)throw new r.ParseError("Missing required 'INAM' sub-chunk");return{version:_.ifil,soundEngine:_.isng||"EMU8000",name:_.INAM,rom:_.irom,romVersion:_.iver,creationDate:_.ICRD,author:_.IENG,product:_.IPRD,copyright:_.ICOP,comments:_.ICMT,createdBy:_.ISFT}}},{key:"getSampleData",value:function(){if(this.id!=="LIST")throw new r.ParseError("Unexpected chunk ID","'LIST'","'".concat(this.id,"'"));var _=this.subChunks[0];if(_.id!=="smpl")throw new r.ParseError("Invalid chunk signature","'smpl'","'".concat(_.id,"'"));return _.buffer}},{key:"getPresetData",value:function(){if(this.id!=="LIST")throw new r.ParseError("Unexpected chunk ID","'LIST'","'".concat(this.id,"'"));return{presetHeaders:Object(n.getPresetHeaders)(this.subChunks[0]),presetZones:Object(n.getZones)(this.subChunks[1],"pbag"),presetModulators:Object(n.getModulators)(this.subChunks[2],"pmod"),presetGenerators:Object(n.getGenerators)(this.subChunks[3],"pgen"),instrumentHeaders:Object(n.getInstrumentHeaders)(this.subChunks[4]),instrumentZones:Object(n.getZones)(this.subChunks[5],"ibag"),instrumentModulators:Object(n.getModulators)(this.subChunks[6],"imod"),instrumentGenerators:Object(n.getGenerators)(this.subChunks[7],"igen"),sampleHeaders:Object(n.getSampleHeaders)(this.subChunks[8])}}}])&&s(g.prototype,b),w&&s(g,w),h}(r.RIFFChunk)},"./src/chunks/generators.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"getGenerators",function(){return u});var r=o("./src/riff/index.ts"),i=o("./src/types/index.ts"),n=o("./src/constants.ts"),a=[i.GeneratorType.StartAddrsOffset,i.GeneratorType.EndAddrsOffset,i.GeneratorType.StartLoopAddrsOffset,i.GeneratorType.EndLoopAddrsOffset,i.GeneratorType.StartAddrsCoarseOffset,i.GeneratorType.EndAddrsCoarseOffset,i.GeneratorType.StartLoopAddrsCoarseOffset,i.GeneratorType.KeyNum,i.GeneratorType.Velocity,i.GeneratorType.EndLoopAddrsCoarseOffset,i.GeneratorType.SampleModes,i.GeneratorType.ExclusiveClass,i.GeneratorType.OverridingRootKey],s=[i.GeneratorType.Unused1,i.GeneratorType.Unused2,i.GeneratorType.Unused3,i.GeneratorType.Unused4,i.GeneratorType.Reserved1,i.GeneratorType.Reserved2,i.GeneratorType.Reserved3],l=[i.GeneratorType.KeyRange,i.GeneratorType.VelRange],u=function(m,c){if(m.id!==c)throw new r.ParseError("Unexpected chunk ID","'".concat(c,"'"),"'".concat(m.id,"'"));if(m.length%n.SF_GENERATOR_SIZE)throw new r.ParseError("Invalid size for the '".concat(c,"' sub-chunk"));return m.iterate(function(f){var h=f.getInt16();return i.GeneratorType[h]?c==="pgen"&&a.includes(h)||c==="igen"&&s.includes(h)?null:l.includes(h)?{id:h,range:{lo:f.getByte(),hi:f.getByte()}}:{id:h,value:f.getInt16BE()}:null})}},"./src/chunks/index.ts":function(t,e,o){"use strict";o.r(e);var r=o("./src/chunks/instruments/index.ts");o.d(e,"getInstrumentHeaders",function(){return r.getInstrumentHeaders});var i=o("./src/chunks/presets/index.ts");o.d(e,"getPresetHeaders",function(){return i.getPresetHeaders});var n=o("./src/chunks/samples/index.ts");o.d(e,"getSampleHeaders",function(){return n.getSampleHeaders});var a=o("./src/chunks/generators.ts");o.d(e,"getGenerators",function(){return a.getGenerators});var s=o("./src/chunks/modulators.ts");o.d(e,"getModulators",function(){return s.getModulators});var l=o("./src/chunks/zones.ts");o.d(e,"getZones",function(){return l.getZones}),o.d(e,"getItemsInZone",function(){return l.getItemsInZone})},"./src/chunks/instruments/headers.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"getInstrumentHeaders",function(){return n});var r=o("./src/riff/index.ts"),i=o("./src/constants.ts"),n=function(a){if(a.id!=="inst")throw new r.ParseError("Unexpected chunk ID","'inst'","'".concat(a.id,"'"));if(a.length%i.SF_INSTRUMENT_HEADER_SIZE)throw new r.ParseError("Invalid size for the 'inst' sub-chunk");return a.iterate(function(s){return{name:s.getString(),bagIndex:s.getInt16()}})}},"./src/chunks/instruments/index.ts":function(t,e,o){"use strict";o.r(e);var r=o("./src/chunks/instruments/headers.ts");o.d(e,"getInstrumentHeaders",function(){return r.getInstrumentHeaders})},"./src/chunks/modulators.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"getModulators",function(){return a});var r=o("./src/riff/index.ts"),i=o("./src/constants.ts"),n=function(s){return{type:s>>10&63,polarity:s>>9&1,direction:s>>8&1,palette:s>>7&1,index:127&s}},a=function(s,l){if(s.id!==l)throw new r.ParseError("Unexpected chunk ID","'".concat(l,"'"),"'".concat(s.id,"'"));if(s.length%i.SF_MODULATOR_SIZE)throw new r.ParseError("Invalid size for the '".concat(l,"' sub-chunk"));return s.iterate(function(u){return{source:n(u.getInt16BE()),id:u.getInt16BE(),value:u.getInt16BE(),valueSource:n(u.getInt16BE()),transform:u.getInt16BE()}})}},"./src/chunks/presets/headers.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"getPresetHeaders",function(){return n});var r=o("./src/riff/index.ts"),i=o("./src/constants.ts"),n=function(a){if(a.id!=="phdr")throw new r.ParseError("Invalid chunk ID","'phdr'","'".concat(a.id,"'"));if(a.length%i.SF_PRESET_HEADER_SIZE)throw new r.ParseError("Invalid size for the 'phdr' sub-chunk");return a.iterate(function(s){return{name:s.getString(),preset:s.getInt16(),bank:s.getInt16(),bagIndex:s.getInt16(),library:s.getUInt32(),genre:s.getUInt32(),morphology:s.getUInt32()}})}},"./src/chunks/presets/index.ts":function(t,e,o){"use strict";o.r(e);var r=o("./src/chunks/presets/headers.ts");o.d(e,"getPresetHeaders",function(){return r.getPresetHeaders})},"./src/chunks/samples/headers.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"getSampleHeaders",function(){return n});var r=o("./src/riff/index.ts"),i=o("./src/constants.ts"),n=function(a){if(a.id!=="shdr")throw new r.ParseError("Unexpected chunk ID","'shdr'","'".concat(a.id,"'"));if(a.length%i.SF_SAMPLE_HEADER_SIZE)throw new r.ParseError("Invalid size for the 'shdr' sub-chunk");return a.iterate(function(s){return{name:s.getString(),start:s.getUInt32(),end:s.getUInt32(),startLoop:s.getUInt32(),endLoop:s.getUInt32(),sampleRate:s.getUInt32(),originalPitch:s.getByte(),pitchCorrection:s.getChar(),link:s.getInt16(),type:s.getInt16()}})}},"./src/chunks/samples/index.ts":function(t,e,o){"use strict";o.r(e);var r=o("./src/chunks/samples/headers.ts");o.d(e,"getSampleHeaders",function(){return r.getSampleHeaders})},"./src/chunks/zones.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"getZones",function(){return a}),o.d(e,"getItemsInZone",function(){return s});var r=o("./src/riff/index.ts"),i=o("./src/constants.ts"),n=o("./src/types/index.ts"),a=function(c,f){if(c.id!==f)throw new r.ParseError("Unexpected chunk ID","'".concat(f,"'"),"'".concat(c.id,"'"));if(c.length%i.SF_BAG_SIZE)throw new r.ParseError("Invalid size for the '".concat(f,"' sub-chunk"));return c.iterate(function(h){return{generatorIndex:h.getInt16(),modulatorIndex:h.getInt16()}})},s=function(c,f,h,g,b,w){for(var _=[],S=0;S<c.length;S++){for(var E=c[S],L=c[S+1],D=E.bagIndex,W=L?L.bagIndex:f.length,j=[],X=void 0,O=D;O<W;O++){var rt=l(O,f,h),k=u(O,f,g),it=k[n.GeneratorType.KeyRange]&&k[n.GeneratorType.KeyRange].range,ft=k[w];if(ft){var Y=b[ft.value];Y&&j.push({keyRange:it,modulators:rt,generators:k,reference:Y})}else O-D==0&&(X={keyRange:it,modulators:rt,generators:k})}_.push({header:E,globalZone:X,zones:j})}return _},l=function(c,f,h){var g=f[c],b=f[c+1],w=g.modulatorIndex,_=b?b.modulatorIndex:f.length;return m(w,_,h)},u=function(c,f,h){var g=f[c],b=f[c+1],w=g.generatorIndex,_=b?b.generatorIndex:f.length;return m(w,_,h)},m=function(c,f,h){for(var g={},b=c;b<f;b++){var w=h[b];w&&(g[w.id]=w)}return g}},"./src/constants.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"SF_VERSION_LENGTH",function(){return r}),o.d(e,"SF_PRESET_HEADER_SIZE",function(){return i}),o.d(e,"SF_BAG_SIZE",function(){return n}),o.d(e,"SF_MODULATOR_SIZE",function(){return a}),o.d(e,"SF_GENERATOR_SIZE",function(){return s}),o.d(e,"SF_INSTRUMENT_HEADER_SIZE",function(){return l}),o.d(e,"SF_SAMPLE_HEADER_SIZE",function(){return u}),o.d(e,"DEFAULT_SAMPLE_RATE",function(){return m});var r=4,i=38,n=4,a=10,s=4,l=22,u=46,m=22050},"./src/index.ts":function(t,e,o){"use strict";o.r(e);var r=o("./src/types/index.ts");for(var i in r)["default"].indexOf(i)<0&&function(l){o.d(e,l,function(){return r[l]})}(i);var n=o("./src/chunk.ts");o.d(e,"SF2Chunk",function(){return n.SF2Chunk});var a=o("./src/constants.ts");o.d(e,"SF_VERSION_LENGTH",function(){return a.SF_VERSION_LENGTH}),o.d(e,"SF_PRESET_HEADER_SIZE",function(){return a.SF_PRESET_HEADER_SIZE}),o.d(e,"SF_BAG_SIZE",function(){return a.SF_BAG_SIZE}),o.d(e,"SF_MODULATOR_SIZE",function(){return a.SF_MODULATOR_SIZE}),o.d(e,"SF_GENERATOR_SIZE",function(){return a.SF_GENERATOR_SIZE}),o.d(e,"SF_INSTRUMENT_HEADER_SIZE",function(){return a.SF_INSTRUMENT_HEADER_SIZE}),o.d(e,"SF_SAMPLE_HEADER_SIZE",function(){return a.SF_SAMPLE_HEADER_SIZE}),o.d(e,"DEFAULT_SAMPLE_RATE",function(){return a.DEFAULT_SAMPLE_RATE});var s=o("./src/soundFont2.ts");o.d(e,"SoundFont2",function(){return s.SoundFont2})},"./src/riff/chunkIterator.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"ChunkIterator",function(){return s});var r=o("./src/utils/index.ts");function i(l,u){if(!(l instanceof u))throw new TypeError("Cannot call a class as a function")}function n(l,u){for(var m=0;m<u.length;m++){var c=u[m];c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(l,c.key,c)}}function a(l,u,m){return u in l?Object.defineProperty(l,u,{value:m,enumerable:!0,configurable:!0,writable:!0}):l[u]=m,l}var s=function(){function l(f){var h=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0;i(this,l),a(this,"target",[]),a(this,"chunk",void 0),a(this,"position",0),this.chunk=f,this.position=h}var u,m,c;return u=l,(m=[{key:"iterate",value:function(f){for(;this.position<this.chunk.length;){var h=f(this);h&&this.target.push(h)}}},{key:"getString",value:function(){var f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:20,h=Object(r.getStringFromBuffer)(this.getBuffer(this.position,f));return this.position+=f,h}},{key:"getInt16",value:function(){return this.chunk.buffer[this.position++]|this.chunk.buffer[this.position++]<<8}},{key:"getInt16BE",value:function(){return this.getInt16()<<16>>16}},{key:"getUInt32",value:function(){return(this.chunk.buffer[this.position++]|this.chunk.buffer[this.position++]<<8|this.chunk.buffer[this.position++]<<16|this.chunk.buffer[this.position++]<<24)>>>0}},{key:"getByte",value:function(){return this.chunk.buffer[this.position++]}},{key:"getChar",value:function(){return this.chunk.buffer[this.position++]<<24>>24}},{key:"skip",value:function(f){this.position+=f}},{key:"getBuffer",value:function(f,h){return this.chunk.buffer.subarray(f,f+h)}},{key:"currentPosition",get:function(){return this.position}}])&&n(u.prototype,m),c&&n(u,c),l}()},"./src/riff/index.ts":function(t,e,o){"use strict";o.r(e);var r=o("./src/riff/chunkIterator.ts");o.d(e,"ChunkIterator",function(){return r.ChunkIterator});var i=o("./src/riff/parseError.ts");o.d(e,"ParseError",function(){return i.ParseError});var n=o("./src/riff/parser.ts");o.d(e,"parseBuffer",function(){return n.parseBuffer}),o.d(e,"getChunk",function(){return n.getChunk}),o.d(e,"getChunkLength",function(){return n.getChunkLength}),o.d(e,"getSubChunks",function(){return n.getSubChunks}),o.d(e,"getChunkId",function(){return n.getChunkId});var a=o("./src/riff/riffChunk.ts");o.d(e,"RIFFChunk",function(){return a.RIFFChunk})},"./src/riff/parseError.ts":function(t,e,o){"use strict";function r(c){return(r=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(f){return typeof f}:function(f){return f&&typeof Symbol=="function"&&f.constructor===Symbol&&f!==Symbol.prototype?"symbol":typeof f})(c)}function i(c,f){return!f||r(f)!=="object"&&typeof f!="function"?function(h){if(h===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return h}(c):f}function n(c){var f=typeof Map=="function"?new Map:void 0;return(n=function(h){if(h===null||(g=h,Function.toString.call(g).indexOf("[native code]")===-1))return h;var g;if(typeof h!="function")throw new TypeError("Super expression must either be null or a function");if(f!==void 0){if(f.has(h))return f.get(h);f.set(h,b)}function b(){return s(h,arguments,u(this).constructor)}return b.prototype=Object.create(h.prototype,{constructor:{value:b,enumerable:!1,writable:!0,configurable:!0}}),l(b,h)})(c)}function a(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch{return!1}}function s(c,f,h){return(s=a()?Reflect.construct:function(g,b,w){var _=[null];_.push.apply(_,b);var S=new(Function.bind.apply(g,_));return w&&l(S,w.prototype),S}).apply(null,arguments)}function l(c,f){return(l=Object.setPrototypeOf||function(h,g){return h.__proto__=g,h})(c,f)}function u(c){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(f){return f.__proto__||Object.getPrototypeOf(f)})(c)}o.r(e),o.d(e,"ParseError",function(){return m});var m=function(c){function f(h,g,b){return function(w,_){if(!(w instanceof _))throw new TypeError("Cannot call a class as a function")}(this,f),i(this,u(f).call(this,"".concat(h).concat(g&&b?", expected ".concat(g,", received ").concat(b):"")))}return function(h,g){if(typeof g!="function"&&g!==null)throw new TypeError("Super expression must either be null or a function");h.prototype=Object.create(g&&g.prototype,{constructor:{value:h,writable:!0,configurable:!0}}),g&&l(h,g)}(f,c),f}(n(Error))},"./src/riff/parser.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"parseBuffer",function(){return a}),o.d(e,"getChunk",function(){return s}),o.d(e,"getChunkLength",function(){return l}),o.d(e,"getSubChunks",function(){return u}),o.d(e,"getChunkId",function(){return m});var r=o("./src/riff/parseError.ts"),i=o("./src/utils/buffer.ts"),n=o("./src/riff/riffChunk.ts"),a=function(c){var f=m(c);if(f!=="RIFF")throw new r.ParseError("Invalid file format","RIFF",f);var h=m(c,8);if(h!=="sfbk")throw new r.ParseError("Invalid signature","sfbk",h);var g=c.subarray(8),b=u(g.subarray(4));return new n.RIFFChunk(f,g.length,g,b)},s=function(c,f){var h=m(c,f),g=l(c,f+4),b=[];return h!=="RIFF"&&h!=="LIST"||(b=u(c.subarray(f+12))),new n.RIFFChunk(h,g,c.subarray(f+8),b)},l=function(c,f){return((c=c.subarray(f,f+4))[0]|c[1]<<8|c[2]<<16|c[3]<<24)>>>0},u=function(c){for(var f=[],h=0;h<=c.length-8;){var g=s(c,h);f.push(g),h=(h+=8+g.length)%2?h+1:h}return f},m=function(c){var f=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0;return Object(i.getStringFromBuffer)(c.subarray(f,f+4))}},"./src/riff/riffChunk.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"RIFFChunk",function(){return s});var r=o("./src/riff/chunkIterator.ts"),i=o("./src/utils/index.ts");function n(l,u){for(var m=0;m<u.length;m++){var c=u[m];c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(l,c.key,c)}}function a(l,u,m){return u in l?Object.defineProperty(l,u,{value:m,enumerable:!0,configurable:!0,writable:!0}):l[u]=m,l}var s=function(){function l(f,h,g,b){(function(w,_){if(!(w instanceof _))throw new TypeError("Cannot call a class as a function")})(this,l),a(this,"id",void 0),a(this,"length",void 0),a(this,"buffer",void 0),a(this,"subChunks",void 0),this.id=f,this.length=h,this.buffer=g,this.subChunks=b}var u,m,c;return u=l,(m=[{key:"getString",value:function(){var f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0,h=arguments.length>1?arguments[1]:void 0;return Object(i.getStringFromBuffer)(this.getBuffer(f,h||this.length-f))}},{key:"getInt16",value:function(){var f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;return this.buffer[f++]|this.buffer[f]<<8}},{key:"getUInt32",value:function(){var f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;return(this.buffer[f++]|this.buffer[f++]<<8|this.buffer[f++]<<16|this.buffer[f]<<24)>>>0}},{key:"getByte",value:function(){var f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;return this.buffer[f]}},{key:"getChar",value:function(){var f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;return this.buffer[f]<<24>>24}},{key:"iterator",value:function(){var f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;return new r.ChunkIterator(this,f)}},{key:"iterate",value:function(f){var h=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,g=new r.ChunkIterator(this,h);return g.iterate(f),g.target}},{key:"getBuffer",value:function(f,h){return this.buffer.subarray(f,f+h)}}])&&n(u.prototype,m),c&&n(u,c),l}()},"./src/soundFont2.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"SoundFont2",function(){return f});var r=o("./src/types/index.ts"),i=o("./src/chunk.ts"),n=o("./src/riff/index.ts"),a=o("./src/chunks/index.ts"),s=o("./src/utils/index.ts");function l(h){for(var g=1;g<arguments.length;g++){var b=arguments[g]!=null?arguments[g]:{},w=Object.keys(b);typeof Object.getOwnPropertySymbols=="function"&&(w=w.concat(Object.getOwnPropertySymbols(b).filter(function(_){return Object.getOwnPropertyDescriptor(b,_).enumerable}))),w.forEach(function(_){c(h,_,b[_])})}return h}function u(h,g){for(var b=0;b<g.length;b++){var w=g[b];w.enumerable=w.enumerable||!1,w.configurable=!0,"value"in w&&(w.writable=!0),Object.defineProperty(h,w.key,w)}}function m(h,g,b){return g&&u(h.prototype,g),b&&u(h,b),h}function c(h,g,b){return g in h?Object.defineProperty(h,g,{value:b,enumerable:!0,configurable:!0,writable:!0}):h[g]=b,h}var f=function(){function h(g){if(function(w,_){if(!(w instanceof _))throw new TypeError("Cannot call a class as a function")}(this,h),c(this,"chunk",void 0),c(this,"metaData",void 0),c(this,"sampleData",void 0),c(this,"samples",void 0),c(this,"presetData",void 0),c(this,"instruments",void 0),c(this,"presets",void 0),c(this,"banks",void 0),!(g instanceof i.SF2Chunk)){var b=Object(n.parseBuffer)(g);g=new i.SF2Chunk(b)}if(g.subChunks.length!==3)throw new n.ParseError("Invalid sfbk structure","3 chunks","".concat(g.subChunks.length," chunks"));this.chunk=g,this.metaData=g.subChunks[0].getMetaData(),this.sampleData=g.subChunks[1].getSampleData(),this.presetData=g.subChunks[2].getPresetData(),this.samples=this.getSamples(),this.instruments=this.getInstruments(),this.presets=this.getPresets(),this.banks=this.getBanks()}return m(h,null,[{key:"from",value:function(g){return new h(g)}}]),m(h,[{key:"getKeyData",value:function(g){var b=this,w=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,_=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0;return Object(s.memoize)(function(S,E,L){var D=b.banks[E];if(D){var W=D.presets[L];if(W){var j=W.zones.filter(function(wt){return b.isKeyInRange(wt,S)});if(j.length>0){var X=!0,O=!1,rt=void 0;try{for(var k,it=j[Symbol.iterator]();!(X=(k=it.next()).done);X=!0){var ft=k.value,Y=ft.instrument,Lt=Y.zones.filter(function(wt){return b.isKeyInRange(wt,S)});if(Lt.length>0){var xt=!0,Z=!1,It=void 0;try{for(var Rt,Gt=Lt[Symbol.iterator]();!(xt=(Rt=Gt.next()).done);xt=!0){var Q=Rt.value,At=Q.sample,ht=l({},ft.generators,Q.generators),St=l({},ft.modulators,Q.modulators);return{keyNumber:S,preset:W,instrument:Y,sample:At,generators:ht,modulators:St}}}catch(wt){Z=!0,It=wt}finally{try{xt||Gt.return==null||Gt.return()}finally{if(Z)throw It}}}}}catch(wt){O=!0,rt=wt}finally{try{X||it.return==null||it.return()}finally{if(O)throw rt}}}}}return null})(g,w,_)}},{key:"isKeyInRange",value:function(g,b){return g.keyRange===void 0||g.keyRange.lo<=b&&g.keyRange.hi>=b}},{key:"getBanks",value:function(){return this.presets.reduce(function(g,b){var w=b.header.bank;return g[w]||(g[w]={presets:[]}),g[w].presets[b.header.preset]=b,g},[])}},{key:"getPresets",value:function(){var g=this.presetData,b=g.presetHeaders,w=g.presetZones,_=g.presetGenerators,S=g.presetModulators;return Object(a.getItemsInZone)(b,w,S,_,this.instruments,r.GeneratorType.Instrument).filter(function(E){return E.header.name!=="EOP"}).map(function(E){return{header:E.header,globalZone:E.globalZone,zones:E.zones.map(function(L){return{keyRange:L.keyRange,generators:L.generators,modulators:L.modulators,instrument:L.reference}})}})}},{key:"getInstruments",value:function(){var g=this.presetData,b=g.instrumentHeaders,w=g.instrumentZones,_=g.instrumentModulators,S=g.instrumentGenerators;return Object(a.getItemsInZone)(b,w,_,S,this.samples,r.GeneratorType.SampleId).filter(function(E){return E.header.name!=="EOI"}).map(function(E){return{header:E.header,globalZone:E.globalZone,zones:E.zones.map(function(L){return{keyRange:L.keyRange,generators:L.generators,modulators:L.modulators,sample:L.reference}})}})}},{key:"getSamples",value:function(){var g=this;return this.presetData.sampleHeaders.filter(function(b){return b.name!=="EOS"}).map(function(b){if(b.name!=="EOS"&&b.sampleRate<=0)throw new Error("Illegal sample rate of ".concat(b.sampleRate," hz in sample '").concat(b.name,"'"));return b.originalPitch>=128&&b.originalPitch<=254&&(b.originalPitch=60),b.startLoop-=b.start,b.endLoop-=b.start,{header:b,data:new Int16Array(new Uint8Array(g.sampleData.subarray(2*b.start,2*b.end)).buffer)}})}}]),h}()},"./src/types/bank.ts":function(t,e){},"./src/types/generator.ts":function(t,e,o){"use strict";var r,i;function n(s,l,u){return l in s?Object.defineProperty(s,l,{value:u,enumerable:!0,configurable:!0,writable:!0}):s[l]=u,s}o.r(e),o.d(e,"GeneratorType",function(){return i}),o.d(e,"DEFAULT_GENERATOR_VALUES",function(){return a}),function(s){s[s.StartAddrsOffset=0]="StartAddrsOffset",s[s.EndAddrsOffset=1]="EndAddrsOffset",s[s.StartLoopAddrsOffset=2]="StartLoopAddrsOffset",s[s.EndLoopAddrsOffset=3]="EndLoopAddrsOffset",s[s.StartAddrsCoarseOffset=4]="StartAddrsCoarseOffset",s[s.ModLFOToPitch=5]="ModLFOToPitch",s[s.VibLFOToPitch=6]="VibLFOToPitch",s[s.ModEnvToPitch=7]="ModEnvToPitch",s[s.InitialFilterFc=8]="InitialFilterFc",s[s.InitialFilterQ=9]="InitialFilterQ",s[s.ModLFOToFilterFc=10]="ModLFOToFilterFc",s[s.ModEnvToFilterFc=11]="ModEnvToFilterFc",s[s.EndAddrsCoarseOffset=12]="EndAddrsCoarseOffset",s[s.ModLFOToVolume=13]="ModLFOToVolume",s[s.Unused1=14]="Unused1",s[s.ChorusEffectsSend=15]="ChorusEffectsSend",s[s.ReverbEffectsSend=16]="ReverbEffectsSend",s[s.Pan=17]="Pan",s[s.Unused2=18]="Unused2",s[s.Unused3=19]="Unused3",s[s.Unused4=20]="Unused4",s[s.DelayModLFO=21]="DelayModLFO",s[s.FreqModLFO=22]="FreqModLFO",s[s.DelayVibLFO=23]="DelayVibLFO",s[s.FreqVibLFO=24]="FreqVibLFO",s[s.DelayModEnv=25]="DelayModEnv",s[s.AttackModEnv=26]="AttackModEnv",s[s.HoldModEnv=27]="HoldModEnv",s[s.DecayModEnv=28]="DecayModEnv",s[s.SustainModEnv=29]="SustainModEnv",s[s.ReleaseModEnv=30]="ReleaseModEnv",s[s.KeyNumToModEnvHold=31]="KeyNumToModEnvHold",s[s.KeyNumToModEnvDecay=32]="KeyNumToModEnvDecay",s[s.DelayVolEnv=33]="DelayVolEnv",s[s.AttackVolEnv=34]="AttackVolEnv",s[s.HoldVolEnv=35]="HoldVolEnv",s[s.DecayVolEnv=36]="DecayVolEnv",s[s.SustainVolEnv=37]="SustainVolEnv",s[s.ReleaseVolEnv=38]="ReleaseVolEnv",s[s.KeyNumToVolEnvHold=39]="KeyNumToVolEnvHold",s[s.KeyNumToVolEnvDecay=40]="KeyNumToVolEnvDecay",s[s.Instrument=41]="Instrument",s[s.Reserved1=42]="Reserved1",s[s.KeyRange=43]="KeyRange",s[s.VelRange=44]="VelRange",s[s.StartLoopAddrsCoarseOffset=45]="StartLoopAddrsCoarseOffset",s[s.KeyNum=46]="KeyNum",s[s.Velocity=47]="Velocity",s[s.InitialAttenuation=48]="InitialAttenuation",s[s.Reserved2=49]="Reserved2",s[s.EndLoopAddrsCoarseOffset=50]="EndLoopAddrsCoarseOffset",s[s.CoarseTune=51]="CoarseTune",s[s.FineTune=52]="FineTune",s[s.SampleId=53]="SampleId",s[s.SampleModes=54]="SampleModes",s[s.Reserved3=55]="Reserved3",s[s.ScaleTuning=56]="ScaleTuning",s[s.ExclusiveClass=57]="ExclusiveClass",s[s.OverridingRootKey=58]="OverridingRootKey",s[s.Unused5=59]="Unused5",s[s.EndOper=60]="EndOper"}(i||(i={}));var a=(n(r={},i.StartAddrsOffset,0),n(r,i.EndAddrsOffset,0),n(r,i.StartLoopAddrsOffset,0),n(r,i.EndLoopAddrsOffset,0),n(r,i.StartAddrsCoarseOffset,0),n(r,i.ModLFOToPitch,0),n(r,i.VibLFOToPitch,0),n(r,i.ModEnvToPitch,0),n(r,i.InitialFilterFc,13500),n(r,i.InitialFilterQ,0),n(r,i.ModLFOToFilterFc,0),n(r,i.ModEnvToFilterFc,0),n(r,i.EndAddrsCoarseOffset,0),n(r,i.ModLFOToVolume,0),n(r,i.ChorusEffectsSend,0),n(r,i.ReverbEffectsSend,0),n(r,i.Pan,0),n(r,i.DelayModLFO,-12e3),n(r,i.FreqModLFO,0),n(r,i.DelayVibLFO,-12e3),n(r,i.FreqVibLFO,0),n(r,i.DelayModEnv,-12e3),n(r,i.AttackModEnv,-12e3),n(r,i.HoldModEnv,-12e3),n(r,i.DecayModEnv,-12e3),n(r,i.SustainModEnv,0),n(r,i.ReleaseModEnv,-12e3),n(r,i.KeyNumToModEnvHold,0),n(r,i.KeyNumToModEnvDecay,0),n(r,i.DelayVolEnv,-12e3),n(r,i.AttackVolEnv,-12e3),n(r,i.HoldVolEnv,-12e3),n(r,i.DecayVolEnv,-12e3),n(r,i.SustainVolEnv,0),n(r,i.ReleaseVolEnv,-12e3),n(r,i.KeyNumToVolEnvHold,0),n(r,i.KeyNumToVolEnvDecay,0),n(r,i.StartLoopAddrsCoarseOffset,0),n(r,i.KeyNum,-1),n(r,i.Velocity,-1),n(r,i.InitialAttenuation,0),n(r,i.EndLoopAddrsCoarseOffset,0),n(r,i.CoarseTune,0),n(r,i.FineTune,0),n(r,i.SampleModes,0),n(r,i.ScaleTuning,100),n(r,i.ExclusiveClass,0),n(r,i.OverridingRootKey,-1),r)},"./src/types/index.ts":function(t,e,o){"use strict";o.r(e);var r=o("./src/types/bank.ts");for(var i in r)["default"].indexOf(i)<0&&function(g){o.d(e,g,function(){return r[g]})}(i);var n=o("./src/types/generator.ts");o.d(e,"GeneratorType",function(){return n.GeneratorType}),o.d(e,"DEFAULT_GENERATOR_VALUES",function(){return n.DEFAULT_GENERATOR_VALUES});var a=o("./src/types/instrument.ts");for(var i in a)["default","GeneratorType","DEFAULT_GENERATOR_VALUES"].indexOf(i)<0&&function(b){o.d(e,b,function(){return a[b]})}(i);var s=o("./src/types/key.ts");for(var i in s)["default","GeneratorType","DEFAULT_GENERATOR_VALUES"].indexOf(i)<0&&function(b){o.d(e,b,function(){return s[b]})}(i);var l=o("./src/types/metaData.ts");for(var i in l)["default","GeneratorType","DEFAULT_GENERATOR_VALUES"].indexOf(i)<0&&function(b){o.d(e,b,function(){return l[b]})}(i);var u=o("./src/types/modulator.ts");o.d(e,"ControllerType",function(){return u.ControllerType}),o.d(e,"ControllerPolarity",function(){return u.ControllerPolarity}),o.d(e,"ControllerDirection",function(){return u.ControllerDirection}),o.d(e,"ControllerPalette",function(){return u.ControllerPalette}),o.d(e,"Controller",function(){return u.Controller}),o.d(e,"TransformType",function(){return u.TransformType}),o.d(e,"DEFAULT_INSTRUMENT_MODULATORS",function(){return u.DEFAULT_INSTRUMENT_MODULATORS});var m=o("./src/types/preset.ts");for(var i in m)["default","GeneratorType","DEFAULT_GENERATOR_VALUES","ControllerType","ControllerPolarity","ControllerDirection","ControllerPalette","Controller","TransformType","DEFAULT_INSTRUMENT_MODULATORS"].indexOf(i)<0&&function(b){o.d(e,b,function(){return m[b]})}(i);var c=o("./src/types/presetData.ts");for(var i in c)["default","GeneratorType","DEFAULT_GENERATOR_VALUES","ControllerType","ControllerPolarity","ControllerDirection","ControllerPalette","Controller","TransformType","DEFAULT_INSTRUMENT_MODULATORS"].indexOf(i)<0&&function(b){o.d(e,b,function(){return c[b]})}(i);var f=o("./src/types/sample.ts");o.d(e,"SampleType",function(){return f.SampleType});var h=o("./src/types/zone.ts");for(var i in h)["default","GeneratorType","DEFAULT_GENERATOR_VALUES","ControllerType","ControllerPolarity","ControllerDirection","ControllerPalette","Controller","TransformType","DEFAULT_INSTRUMENT_MODULATORS","SampleType"].indexOf(i)<0&&function(b){o.d(e,b,function(){return h[b]})}(i)},"./src/types/instrument.ts":function(t,e){},"./src/types/key.ts":function(t,e){},"./src/types/metaData.ts":function(t,e){},"./src/types/modulator.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"ControllerType",function(){return r}),o.d(e,"ControllerPolarity",function(){return i}),o.d(e,"ControllerDirection",function(){return n}),o.d(e,"ControllerPalette",function(){return a}),o.d(e,"Controller",function(){return s}),o.d(e,"TransformType",function(){return l}),o.d(e,"DEFAULT_INSTRUMENT_MODULATORS",function(){return m});var r,i,n,a,s,l,u=o("./src/types/generator.ts");(function(c){c[c.Linear=0]="Linear",c[c.Concave=1]="Concave",c[c.Convex=2]="Convex",c[c.Switch=3]="Switch"})(r||(r={})),function(c){c[c.Unipolar=0]="Unipolar",c[c.Bipolar=1]="Bipolar"}(i||(i={})),function(c){c[c.Increasing=0]="Increasing",c[c.Decreasing=1]="Decreasing"}(n||(n={})),function(c){c[c.GeneralController=0]="GeneralController",c[c.MidiController=1]="MidiController"}(a||(a={})),function(c){c[c.NoController=0]="NoController",c[c.NoteOnVelocity=2]="NoteOnVelocity",c[c.NoteOnKeyNumber=3]="NoteOnKeyNumber",c[c.PolyPressure=10]="PolyPressure",c[c.ChannelPressure=13]="ChannelPressure",c[c.PitchWheel=14]="PitchWheel",c[c.PitchWheelSensitivity=16]="PitchWheelSensitivity",c[c.Link=127]="Link"}(s||(s={})),function(c){c[c.Linear=0]="Linear",c[c.Absolute=2]="Absolute"}(l||(l={}));var m=[{id:u.GeneratorType.InitialAttenuation,source:{type:r.Concave,polarity:i.Unipolar,direction:n.Decreasing,palette:a.GeneralController,index:s.NoteOnVelocity},value:960,valueSource:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.GeneralController,index:s.NoController},transform:l.Linear},{id:u.GeneratorType.InitialFilterFc,source:{type:r.Linear,polarity:i.Unipolar,direction:n.Decreasing,palette:a.GeneralController,index:s.NoteOnVelocity},value:-2400,valueSource:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.GeneralController,index:s.NoController},transform:l.Linear},{id:u.GeneratorType.VibLFOToPitch,source:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.GeneralController,index:s.ChannelPressure},value:50,valueSource:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.GeneralController,index:s.NoController},transform:l.Linear},{id:u.GeneratorType.VibLFOToPitch,source:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.MidiController,index:1},value:50,valueSource:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.GeneralController,index:s.NoController},transform:l.Linear},{id:u.GeneratorType.InitialAttenuation,source:{type:r.Concave,polarity:i.Unipolar,direction:n.Decreasing,palette:a.MidiController,index:7},value:960,valueSource:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.GeneralController,index:s.NoController},transform:l.Linear},{id:u.GeneratorType.InitialAttenuation,source:{type:r.Linear,polarity:i.Bipolar,direction:n.Increasing,palette:a.MidiController,index:10},value:1e3,valueSource:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.GeneralController,index:s.NoController},transform:l.Linear},{id:u.GeneratorType.InitialAttenuation,source:{type:r.Concave,polarity:i.Unipolar,direction:n.Decreasing,palette:a.MidiController,index:11},value:960,valueSource:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.GeneralController,index:s.NoController},transform:l.Linear},{id:u.GeneratorType.ReverbEffectsSend,source:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.MidiController,index:91},value:200,valueSource:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.GeneralController,index:s.NoController},transform:l.Linear},{id:u.GeneratorType.ChorusEffectsSend,source:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.MidiController,index:93},value:200,valueSource:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.GeneralController,index:s.NoController},transform:l.Linear},{id:u.GeneratorType.CoarseTune,source:{type:r.Linear,polarity:i.Bipolar,direction:n.Increasing,palette:a.GeneralController,index:s.PitchWheel},value:12700,valueSource:{type:r.Linear,polarity:i.Unipolar,direction:n.Increasing,palette:a.GeneralController,index:s.PitchWheelSensitivity},transform:l.Linear}]},"./src/types/preset.ts":function(t,e){},"./src/types/presetData.ts":function(t,e){},"./src/types/sample.ts":function(t,e,o){"use strict";var r;o.r(e),o.d(e,"SampleType",function(){return r}),function(i){i[i.EOS=0]="EOS",i[i.Mono=1]="Mono",i[i.Right=2]="Right",i[i.Left=4]="Left",i[i.Linked=8]="Linked",i[i.RomMono=32769]="RomMono",i[i.RomRight=32770]="RomRight",i[i.RomLeft=32772]="RomLeft",i[i.RomLinked=32776]="RomLinked"}(r||(r={}))},"./src/types/zone.ts":function(t,e){},"./src/utils/buffer.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"getStringFromBuffer",function(){return r});var r=function(i){var n=new TextDecoder("utf8").decode(i),a=n.indexOf("\0");return(a===-1?n:n.slice(0,a)).trim()}},"./src/utils/index.ts":function(t,e,o){"use strict";o.r(e);var r=o("./src/utils/buffer.ts");o.d(e,"getStringFromBuffer",function(){return r.getStringFromBuffer});var i=o("./src/utils/memoize.ts");o.d(e,"memoize",function(){return i.memoize})},"./src/utils/memoize.ts":function(t,e,o){"use strict";o.r(e),o.d(e,"memoize",function(){return r});var r=function(i){var n={};return function(){for(var a=arguments.length,s=new Array(a),l=0;l<a;l++)s[l]=arguments[l];var u=JSON.stringify(s);if(u in n)return n[u];var m=i.apply(void 0,s);return n[u]=m,m}}}})})});var Ic=["0","1","2","3","4","5","6","7","8","9"],Sh=Ic.concat(["A","a","B","b","C","c","D","d","E","e","F","f"]);function*Mo(t,e,o=e>t?1:-1){if(o>0&&t<e)for(;t<e;)yield t,t+=o;else if(o<0&&t>e)for(;t>e;)yield t,t+=o}function ro(t,e,o){return t<e?e:t>o?o:t}function cs(t,e){let o=e.indexOf(t)+1;return o==e.length&&(o=0),e[o]}function us(t,e=""){return new URLSearchParams(window.parent.location.search).get(t)??e}function ds(t){return t*(Math.PI/180)}function hs(t,e={},o=null){let r=t.cloneNode(!0).content.children[0];for(let[i,n]of Object.entries(e))typeof n=="boolean"?r.toggleAttribute(i,n):r.setAttribute(i,n);return o!==null&&(r.children[0].innerText=o),r}function ps(){return navigator.userAgentData?navigator.userAgentData.mobile:/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}function fs(){return/^((?!chrome|android).)*safari/i.test(navigator.userAgent)}var Xi=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],Yi=64,Qi=66,ms=67,Dc=123,st={onKeyPress:null,onKeyRelease:null,onPitchClassOn:null,onPitchClassOff:null,onControlChange:null,onSustainPedal:null,onSostenutoPedal:null,onReset:null,onConnectionChange:null,get browserHasMidiSupport(){return!!navigator.requestMIDIAccess},queryMidiAccess(t=null){return this.browserHasMidiSupport?(navigator.permissions.query({name:"midi",sysex:!1}).then(e=>{switch(e.state){case"granted":t?.("granted");break;case"prompt":t?.("prompt");break;default:t?.("denied")}}),!0):(t?.("unavailable"),!1)},requestMidiAccess(t,e=null){if(!this.browserHasMidiSupport){e?.();return}navigator.requestMIDIAccess({sysex:!1}).then(t,e)},requestInputPortList(t,e){if(!this.browserHasMidiSupport){e?.();return}navigator.requestMIDIAccess({sysex:!1}).then(o=>{let r=[];if(o.inputs.size>0)for(let i of o.inputs.values())r.push(i);t(r)},e)},connect(t,e=null,o=Xi){this.browserHasMidiSupport&&(this.disconnect(),t.open().then(()=>{M.dev=t,t.addEventListener("midimessage",zr),e?.(t),this.onConnectionChange?.(!0,t)}),M.channels=Array.from(o))},connectByPortName(t,e=null,o=Xi){this.browserHasMidiSupport&&this.requestInputPortList(r=>{for(let i of r)i.name==t&&(this.disconnect(),i.open().then(n=>{M.dev=n,n.addEventListener("midimessage",zr),e?.(n),this.onConnectionChange?.(!0,n)}),M.channels=Array.from(o))})},connectByPortId(t,e=null,o=Xi){this.browserHasMidiSupport&&this.requestInputPortList(r=>{for(let i of r)i.id==t&&(this.disconnect(),i.open().then(n=>{M.dev=n,n.addEventListener("midimessage",zr),e?.(n),this.onConnectionChange?.(!0,n)}),M.channels=Array.from(o))})},disconnect(){if(!this.browserHasMidiSupport)return;let t=M.dev;t&&(M.dev.removeEventListener("midimessage",zr),t.removeEventListener("statechange",Oc),M.dev.close(),M.dev=null,M.channels=[],M.reset(),this.onConnectionChange(!1,t))},getConnectedPort(){return this.browserHasMidiSupport&&M.dev?.state=="connected"?M.dev:null},isKeyPressed(t){return t<0||t>127?!1:M.keys[t]},isNoteOn(t,e="none"){if(t<0||t>127)return!1;switch(e){case"sustain":return this.isKeyPressed(t)||M.sustain[t];case"sostenuto":return this.isKeyPressed(t)||M.sostenuto[t];case"both":return this.isKeyPressed(t)||M.sustain[t]||M.sostenuto[t];default:return this.isKeyPressed(t)}},isPitchClassOn(t,e="none"){for(let o=t;o<128;o+=12)if(this.isNoteOn(o,e))return!0;return!1},getLastControlValue(t){return M.cc[t]},reset(){M.reset()},setPedalThreshold(t){M.pedals.threshold=t},get sustain_pressed(){return M.pedals.sustain},get sostenuto_pressed(){return M.pedals.sostenuto},get soft_pressed(){return M.pedals.soft},get sustain_pedal_value(){return M.cc[Yi]},get sostenuto_pedal_value(){return M.cc[Qi]},get soft_pedal_value(){return M.cc[ms]}};function Oc(t){t.port.state=="disconnected"&&M.dev==t.port&&(M.dev=null),st.onConnectionChange?.(t.port.state=="connected",t.port)}var M={dev:null,channels:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],cc:Array(128).fill(0),keys:Array(128).fill(null),pcs:Array(12).fill(0),sustain:Array(128).fill(!1),sostenuto:Array(128).fill(!1),pedals:{threshold:64,get sustain(){return M.cc[Yi]>=this.threshold},get sostenuto(){return M.cc[Qi]>=this.threshold},get soft(){return M.cc[ms]>=this.threshold}},last_event_timestamp:0,last_event_time_delta:0,reset(){this.cc=Array(128).fill(0),this.keys=Array(128).fill(!1),this.pcs=Array(12).fill(0),this.sustain=Array(128).fill(!1),this.sostenuto=Array(128).fill(!1)}};function zr(t){M.last_event_time_delta=t.timeStamp-M.last_event_timestamp,M.last_event_timestamp=t.timeStamp;for(let e of M.channels)switch(t.data[0]){case 144+e:Rc(t.data[1],t.data[2]);break;case 128+e:gs(t.data[1],t.data[2]);break;case 176+e:Nc(t.data[1],t.data[2])}}function Rc(t,e){let o=t%12;M.keys[t]||(M.keys[t]=Date.now(),M.pcs[o]+=1),M.pedals.sustain&&(M.sustain[t]=!0),st.onKeyPress?.(t,e),M.pcs[o]==1&&st.onPitchClassOn?.(o)}function gs(t,e){let o=t%12,r=0;M.keys[t]&&(r=Date.now()-M.keys[t],M.keys[t]=null,M.pcs[o]-=1),st.onKeyRelease?.(t,e,r),M.pcs[o]==0&&st.onPitchClassOff?.(o)}function Fc(t){let e=t>=M.pedals.threshold;if(M.pedals.sustain!=e)if(e){for(let o=0;o<128;o++)M.sustain[o]=M.keys[o]||M.sostenuto[o];st.onSustainPedal?.(e,t)}else{for(let o=0;o<128;o++)M.sustain[o]=!1;st.onSustainPedal?.(e,t)}}function Bc(t){if(!M.pedals.sostenuto&&t>=M.pedals.threshold){for(let e=0;e<128;e++)M.sostenuto[e]=M.keys[e];st.onSostenutoPedal?.(M.pedals.sostenuto,t)}else if(M.pedals.sostenuto&&t<M.pedals.threshold){for(let e=0;e<128;e++)M.sostenuto[e]=!1;st.onSostenutoPedal?.(M.pedals.sostenuto,t)}}function Nc(t,e){t==Qi&&Bc(e),t==Yi&&Fc(e),t==Dc&&zc(),M.cc[t]=e,st.onControlChange?.(t,e)}function zc(){for(let t=0;t<128;t++)gs(t)}function Ji(t){let o={c:0,"c#":1,db:1,d:2,"d#":3,eb:3,e:4,fb:4,"e#":5,f:5,"f#":6,gb:6,g:7,"g#":8,ab:8,a:9,"a#":10,bb:10,b:11,"b#":12,cb:-1}[t.slice(0,t.length-1).toLowerCase()],r=parseInt(t.slice(t.length-1));return o+12*(r+1)}function bs(t,e=440){return 2**((t-69)/12)*e}var tn="http://www.w3.org/2000/svg",Hc={createElement(t,e={}){let o=document.createElementNS(tn,t);for(let[r,i]of Object.entries(e))o.setAttribute(r,i);return o},createRootElement(t={}){let e=document.createElementNS(tn,"svg");e.setAttribute("version","1.1"),e.setAttribute("xmlns",tn);for(let[o,r]of Object.entries(t))e.setAttribute(o,r);return e},createGroup(t={}){return this.createElement("g",t)},makeLine(t,e,o,r,i){let n=this.createElement("line",i);return n.setAttribute("x1",t),n.setAttribute("y1",e),n.setAttribute("x2",o),n.setAttribute("y2",r),n},makeCircle(t,e,o,r={}){let i=this.createElement("circle",r);return i.setAttribute("cx",t),i.setAttribute("cy",e),i.setAttribute("r",o),i},makeRect(t,e,o=null,r=null,i=null,n=null,a={}){let s=this.createElement("rect",a);return s.setAttribute("width",t),s.setAttribute("height",e),o&&s.setAttribute("x",o),r&&s.setAttribute("y",r),i&&s.setAttribute("rx",i),n&&s.setAttribute("ry",n),s},makePolygon(t,e={}){let o=t.length,r=this.createElement("path",e),i=["M",t[0].x,t[0].y];if(o>1){for(let n=1;n<o;n++)t[n]&&i.push("L",t[n].x,t[n].y);o>2&&i.push("Z"),r.setAttribute("d",i.join(" "))}return r},makePath(t,e={},o=null,r=null){let i=this.createElement("path",e);return Array.isArray(t)&&(t=t.filter(n=>n!=null).map(n=>Array.isArray(n)?n.join(" "):n).join(" ")),i.setAttribute("d",t),o!=null&&i.setAttribute("x",o.toString()),r!=null&&i.setAttribute("y",r.toString()),i},makeSimpleArrowMarker(t,e,o={}){let r=this.makePath(["M",0,0,"L",10,5,"L",0,10,"Z"],o),i=this.createElement("marker",{id:t,viewbox:[-5,-5,15,15].join(" "),refX:5,refY:5,markerWidth:e,markerHeight:e,orient:"auto-start-reverse"});return i.appendChild(r),i}},U=Hc;var vs=500,To=1.3,_s=1.8,$o=2.5,Hr=.13,nr=1.01,Vc=5,ys=3,Lo=[,-Hr,,+Hr,,,-1.4*Hr,,0,,1.4*Hr];function ws(t,e,o={}){let r=vs,i=o.height_factor??1,n=o.first_key??noteToMidi("a0"),a=o.last_key??noteToMidi("c8"),s=a-n,l=(n+a)/2,u=r*i,m=u*(.14*i+.51),c=To/2,f=_s/2,h=r*2.2/15.5,g=r*1.4/15.5,b=h/2,w=h/3,_=g/2,S=h/15,E=g/20,L=2,D=2,W={top:-4,height:7,get bottom(){return this.top+this.height}},j=W.bottom-1,X=W.bottom-5,O=W.bottom+1,rt=X+(O-X)/4,k={bottom_height:g/1.8*(Math.max(i-.5,0)/2+.75),bottom_height1:0,side_width_bottom:ys*2,side_width_top:ys,side_width_min:0,side_width_max:0};k.side_width_min=Math.min(k.side_width_top,k.side_width_bottom),k.side_width_max=Math.max(k.side_width_top,k.side_width_bottom),k.bottom_height1=k.bottom_height/2;let it=u-b*i,ft=it*nr,Y=m-k.bottom_height-w*i,Lt=m-k.bottom_height1-w*i,Z=h/4/2,It=Z+w*i,Rt=It*.8+k.bottom_height;t.innerHTML="";for(let N=0;N<128;N++)(N<n||N>a)&&(e[N]=null);let Gt=U.createGroup(),Q=U.createGroup();function At(N,kt,lt,A,F,et){let nt=lt+c+f,pt=lt+A-c-f,Oe=nt+(pt-nt)/2,le=F*nr,Et=m+c+$o,$e=Et*nr,ce=N>n&&[2,4,7,9,11].includes(kt),R=N<a&&[0,2,5,7,9].includes(kt),C=lt+c+(ce?_+g*Lo[kt-1]+$o:f),Xt=lt+A-c-(R?_-g*Lo[kt+1]+$o:f),rr=A*.015,mt=rr*Et/F,ji=C+(Oe-C)/A*mt,Ki=Xt-(Xt-Oe)/A*mt,x={ax:C,ay:j,bx:Xt,by:j,cx:Xt,cy:Et,dx:pt,dy:Et,ex:pt,ey:F,fx:nt,fy:F,gx:nt,gy:Et,hx:C,hy:Et},P={ax:x.ax,ay:x.ay,bx:x.bx,by:x.by,cx:Ki,cy:$e,dx:pt-mt,dy:$e,ex:pt-rr,ey:le,fx:nt+rr,fy:le,gx:nt+mt,gy:$e,hx:ji,hy:$e},vt=et/4,Re=U.createGroup({id:`key${N}`,class:"key white-key",value:N}),qi=U.makePath(["M",x.ax,x.ay,"H",x.bx,R?["V",x.cy,"H",x.dx]:null,"V",x.ey,"H",x.fx,ce?["V",x.gy,"H",x.hx]:null,"Z"],{class:"key-touch-area invisible",value:N}),Wi=Se(["M",x.ax,x.ay,"H",x.bx,R?["L",x.cx,x.cy,"H",x.dx]:null,"L",x.ex,x.ey-et,"Q",x.ex-vt,x.ey-vt,x.ex-et,x.ey,"H",x.fx+et,"Q",x.fx+vt,x.fy-vt,x.fx,x.fy-et,ce?["L",x.gx,x.gy,"H",x.hx]:null,"Z"],["M",P.ax,P.ay,"H",P.bx,R?["L",P.cx,P.cy,"H",P.dx]:null,"L",P.ex,P.ey-et,"Q",P.ex-vt,P.ey-vt,P.ex-et,P.ey,"H",P.fx+et,"Q",P.fx+vt,P.fy-vt,P.fx,P.fy-et,ce?["L",P.gx,P.gy,"H",P.hx]:null,"Z"],{class:"key-fill"}),V=L,ir=Se(["M",x.ax+V,x.ay-c,"H",x.bx-V,R?["L",x.cx-V,x.cy+V,"H",x.dx-V]:null,"L",x.ex-V,x.ey-V-et+c,"Q",x.ex-vt-V+c,x.ey-vt-V,x.ex-et-V+c,x.ey-V,"H",x.fx+V+et-c,"Q",x.fx+vt+V,x.fy-V-vt+c,x.fx+V,x.fy-V-et+c,ce?["L",x.gx+V,x.gy+V,"H",x.hx+V]:null,"Z"],["M",P.ax+V,P.ay-c,"H",P.bx-V,R?["L",P.cx-V,P.cy+V,"H",P.dx-V]:null,"L",P.ex-V,P.ey-V-et+c,"Q",P.ex-vt-V+c,P.ey-vt-V,P.ex-et-V+c,P.ey-V,"H",P.fx+V+et-c,"Q",P.fx+vt+V,P.fy-V-vt+c,P.fx+V,P.fy-V-et+c,ce?["L",P.gx+V,P.gy+V,"H",P.hx+V]:null,"Z"],{class:"key-highlight"}),vc=Se(["M",x.ax,x.ay+c,ce?["L",x.hx,x.hy,"H",x.gx]:null,"L",x.fx,x.fy-et-c,R?["M",x.cx,x.cy,"H",x.dx]:null],["M",P.ax,P.ay+c,ce?["L",P.hx,P.hy,"H",P.gx]:null,"L",P.fx,P.fy-et-c,R?["M",P.cx,P.cy,"H",P.dx]:null],{class:"key-light-border white-key-border"}),_c=Se(["M",x.fx,x.fy-et,"Q",x.fx+vt,x.fy-vt,x.fx+et,x.fy,"H",x.ex-et,"Q",x.ex-vt,x.ey-vt,x.ex,x.ey-et,R?["L",x.dx,x.dy,"M",x.cx,x.cy]:null,"L",x.bx,x.by+c],["M",P.fx,P.fy-et,"Q",P.fx+vt,P.fy-vt,P.fx+et,P.fy,"H",P.ex-et,"Q",P.ex-vt,P.ey-vt,P.ex,P.ey-et,R?["L",P.dx,P.dy,"M",P.cx,P.cy]:null,"L",P.bx,P.by+c],{class:"key-dark-border white-key-border"}),wc=wt(N,lt),kc=lt+A/2,xc=u-It,Sc=U.makeCircle(kc,xc,Z,{class:"key-sticker white-key-sticker"}),Zi=U.createGroup({class:"key-marker-group",press_transform:`translateY(${ft-it}px)`});return Zi.appendChild(wc),Zi.appendChild(Sc),Re.appendChild(Wi),Re.appendChild(ir),Re.appendChild(_c),Re.appendChild(vc),Re.appendChild(Zi),Re.appendChild(qi),Re}function ht(N){return!o.perspective||Io(N)?0:(N-l)/((88+s)/4)*k.side_width_max}function St(N,kt,lt,A,F,et){let nt=kt,pt=nt+lt,Oe=F/2,le=F/4,Et=ht(N)*1.5,$e=Et/2,ce=Et/1.2,R=o.perspective?{left_top:Math.max(0,k.side_width_top+Et),left_bottom:Math.max(0,k.side_width_bottom+Et),right_top:Math.max(0,k.side_width_top-Et),right_bottom:Math.max(0,k.side_width_bottom-Et),left_top1:Math.max(0,k.side_width_top+ce),left_bottom1:Math.max(0,k.side_width_bottom+$e),right_top1:Math.max(0,k.side_width_top-ce),right_bottom1:Math.max(0,k.side_width_bottom-$e)}:{left_top:k.side_width_top,left_bottom:k.side_width_bottom,right_top:k.side_width_top,right_bottom:k.side_width_bottom,left_top1:k.side_width_top,left_bottom1:k.side_width_bottom,right_top1:k.side_width_top,right_bottom1:k.side_width_bottom},C=o.perspective?{left_top:Math.min(nt,nt+k.side_width_top+Et),left_bottom:Math.min(nt,nt+k.side_width_bottom+Et),right_top:Math.max(pt,pt-k.side_width_top+Et),right_bottom:Math.max(pt,pt-k.side_width_bottom+Et),left_top1:Math.min(nt,nt+k.side_width_top+ce),left_bottom1:Math.min(nt,nt+k.side_width_bottom+$e),right_top1:Math.max(pt,pt-k.side_width_top+ce),right_bottom1:Math.max(pt,pt-k.side_width_bottom+$e)}:{left_top:nt,left_bottom:nt,right_top:pt,right_bottom:pt,left_top1:nt,left_bottom1:nt,right_top1:pt,right_bottom1:pt},Xt=U.createGroup({id:`key${N}`,class:"key black-key",value:N}),as=U.makePath(["M",C.left_top1,O,"L",C.left_top1+R.left_top1,rt,"H",C.right_top1-R.right_top1,"L",C.right_top1,O,"L",C.right_bottom1,A-k.bottom_height1-F,"L",pt,A,"H",nt,"L",C.left_bottom1,A-k.bottom_height1-F,"Z"],{class:"key-touch-area invisible",value:N}),rr=Se(["M",C.left_top,O,"L",C.left_top+R.left_top,X,"H",C.right_top-R.right_top,"L",C.right_top,O,"L",C.right_bottom,A-k.bottom_height-F,"L",pt,A,"H",nt,"L",C.left_bottom,A-k.bottom_height-F,"Z"],["M",C.left_top1,O,"L",C.left_top1+R.left_top1,rt,"H",C.right_top1-R.right_top1,"L",C.right_top1,O,"L",C.right_bottom1,A-k.bottom_height1-F,"L",pt,A,"H",nt,"L",C.left_bottom1,A-k.bottom_height1-F,"Z"],{class:"key-fill"}),mt=D,ji=Se(["M",C.left_top+mt,O,"L",Math.max(C.left_top+mt,C.left_top+R.left_top),X,"H",Math.min(C.right_top-mt,C.right_top-R.right_top),"L",C.right_top-mt,O,"L",C.right_bottom-mt,A-mt-k.bottom_height-Oe,"L",pt-mt,A-mt,"H",nt+mt,"L",C.left_bottom+mt,A-mt-k.bottom_height-Oe,"Z"],["M",C.left_top1+mt,O,"L",Math.max(C.left_top1+mt,C.left_top1+R.left_top1),rt,"H",Math.min(C.right_top1-mt,C.right_top1-R.right_top1),"L",C.right_top1-mt,O,"L",C.right_bottom1-mt,A-mt-k.bottom_height1-Oe,"L",pt-mt,A-mt,"H",nt+mt,"L",C.left_bottom1+mt,A-mt-k.bottom_height1-Oe,"Z"],{class:"key-highlight"});if(Xt.appendChild(rr),Xt.appendChild(ji),R.left_bottom>0||R.left_top>0){let ir=Se(["M",C.left_top,O,"L",C.left_bottom,A,"L",C.left_bottom+R.left_bottom,A-k.bottom_height-F,"L",C.left_top+R.left_top,X,"Z"],["M",C.left_top1,O,"L",C.left_bottom1,A,"L",C.left_bottom1+R.left_bottom1,A-k.bottom_height1-F,"L",C.left_top1+R.left_top1,rt,"Z"],{class:"key-left-bevel black-key-bevel"});Xt.appendChild(ir)}if(R.right_bottom>0||R.right_top>0){let ir=Se(["M",C.right_top,O,"L",C.right_bottom,A,"L",C.right_bottom-R.right_bottom,A-k.bottom_height-F,"L",C.right_top-R.right_top,X,"Z"],["M",C.right_top1,O,"L",C.right_bottom1,A,"L",C.right_bottom1-R.right_bottom1,A-k.bottom_height1-F,"L",C.right_top1-R.right_top1,rt,"Z"],{class:"key-right-bevel black-key-bevel"});Xt.appendChild(ir)}let Ki=Se(["M",nt,A,"H",pt,"L",C.right_bottom-R.right_bottom-F,A-k.bottom_height,"H",C.left_bottom+R.left_bottom+F,"Z"],["M",nt,A,"H",pt,"L",C.right_bottom1-R.right_bottom1-F,A-k.bottom_height1,"H",C.left_bottom1+R.left_bottom1+F,"Z"],{class:"key-bottom-bevel black-key-bevel"});Xt.appendChild(Ki);let x=Se(["M",nt,A,"L",C.left_bottom+R.left_bottom,A-k.bottom_height-F,"Q",C.left_bottom+R.left_bottom+le,A-k.bottom_height-le,C.left_bottom+R.left_bottom+F,A-k.bottom_height,"Z"],["M",nt,A,"L",C.left_bottom1+R.left_bottom1,A-k.bottom_height1-F,"Q",C.left_bottom1+R.left_bottom1+le,A-k.bottom_height1-le,C.left_bottom1+R.left_bottom1+F,A-k.bottom_height1,"Z"],{class:"key-left-round-bevel black-key-bevel"});Xt.appendChild(x);let P=Se(["M",pt,A,"L",C.right_bottom-R.right_bottom,A-k.bottom_height-F,"Q",C.right_bottom-R.right_bottom-le,A-k.bottom_height-le,C.right_bottom-R.right_bottom-F,A-k.bottom_height,"Z"],["M",pt,A,"L",C.right_bottom1-R.right_bottom1,A-k.bottom_height1-F,"Q",C.right_bottom1-R.right_bottom1-le,A-k.bottom_height1-le,C.right_bottom1-R.right_bottom1-F,A-k.bottom_height1,"Z"],{class:"key-right-round-bevel black-key-bevel"});Xt.appendChild(P);let vt=se(N,kt),Re=kt+lt/2+Et,qi=m-Rt,Wi=U.makeCircle(Re,qi,Z,{class:"key-sticker black-key-sticker"}),V=U.createGroup({class:"key-marker-group",press_transform:`translateX(${($e-Et)*.7}px) translateY(${Lt-Y}px)`});return V.appendChild(vt),V.appendChild(Wi),Xt.appendChild(V),Xt.appendChild(as),Xt}function wt(N,kt){let lt=kt+b,A=U.createElement("text",{x:lt,y:it,id:`keylabel${N}`,class:"key-label white-key-label"});return A.appendChild(U.createElement("tspan",{x:lt})),A}function se(N,kt){let lt=kt+_+ht(N)/2,A=U.createElement("text",{x:lt,y:Y,id:`keylabel${N}`,class:"key-label black-key-label"});return A.appendChild(U.createElement("tspan",{x:lt})),A.appendChild(U.createElement("tspan",{x:lt,dy:"-0.9lh"})),A.appendChild(U.createElement("tspan",{x:lt,dy:"-1.0lh"})),A}let ae=0,ke=0;for(let N=n;N<=a;N++){let kt=N%12;if(Io(kt)){let lt=At(N,kt,ke,h,u,S);Gt.appendChild(lt),e[N]=lt,ae+=h,ke+=h}else{let lt=ke-_+Lo[kt]*g,A=St(N,lt,g,m,E,ke);Q.appendChild(A),e[N]=A}}t.appendChild(Gt),t.appendChild(U.makeRect(ae,W.height,0,W.top,null,null,{id:"top-felt"})),t.appendChild(Q);let Zt={left:-2,top:-4,width:ae+To+2,height:u*Math.max(nr,1)+To+Vc};t.setAttribute("viewBox",`${Zt.left} ${Zt.top} ${Zt.width} ${Zt.height}`);function xe(N,kt,lt=!1,A={}){let F=U.createElement("linearGradient",lt?{id:N,x2:"0%",y2:"100%"}:{id:N});for(let et of kt)F.appendChild(U.createElement("stop",et));for(let[et,nt]of Object.entries(A))F.setAttribute(et,nt);return F}let ge=U.createElement("defs");ge.appendChild(xe("white-key-gradient",[{offset:"30%","stop-color":"color-mix(in oklch, var(--color-white-key), white 10%)"},{offset:"100%","stop-color":"color-mix(in oklch, var(--color-white-key), black 10%)"}],!1,{gradientTransform:"rotate(45)"})),ge.appendChild(xe("black-key-gradient",[{offset:"30%","stop-color":"color-mix(in oklch, var(--color-black-key), white 15%)"},{offset:"100%","stop-color":"color-mix(in oklch, var(--color-black-key), black 15%)"}],!1,{gradientTransform:"rotate(45)"})),ge.appendChild(xe("pressed-white-key-highlight-gradient",[{offset:"0%","stop-color":"var(--color-highlight-alpha)","stop-opacity":"50%"},{offset:"40%","stop-color":"var(--color-highlight-alpha)"}],!0)),ge.appendChild(xe("pressed-black-key-highlight-gradient",[{offset:"0%","stop-color":"var(--color-highlight-alpha)","stop-opacity":"50%"},{offset:"50%","stop-color":"var(--color-highlight-alpha)"}],!0)),ge.appendChild(xe("top-felt-gradient",[{offset:"50%","stop-color":"var(--color-felt-top)"},{offset:"100%","stop-color":"var(--color-felt-bottom)"}],!0)),t.appendChild(ge)}function ks(t,e,o={}){let r=vs,i=o.height_factor??1,n=o.first_key??noteToMidi("a0"),a=o.last_key??noteToMidi("c8"),s=r*i,l=s*(.14*i+.51),u=To/2,m=_s/2,c=r*2.2/15.5,f=r*1.4/15.5,h=c/2,g=c/3,b=f/2,w=c/17,_=2,S=2,E={top:-4,height:7,get bottom(){return this.top+this.height}},L=E.bottom-1,D=E.bottom-5,W=s-h*i,j=l-h*i,O=c/4/2,rt=O+g*i,k=rt;t.innerHTML="";for(let Q=0;Q<128;Q++)(Q<n||Q>a)&&(e[Q]=null);let it=U.createGroup(),ft=U.createGroup();function Y(Q,At,ht,St,wt,se){let ae=ht+u+m,ke=ht+St-u-m,Zt=l+u+$o,xe=Q>n&&[2,4,7,9,11].includes(At),ge=Q<a&&[0,2,5,7,9].includes(At),N=ht+u+(xe?b+f*Lo[At-1]+$o:m),kt=ht+St-u-(ge?b-f*Lo[At+1]+$o:m),lt=U.createGroup({id:`key${Q}`,class:"key white-key lowperf",value:Q}),A=U.makePath(["M",N,L,"H",kt,ge?["V",Zt,"H",ke]:null,"V",wt-se,"L",ke-se,wt,"H",ae+se,"L",ae,wt-se,xe?["V",Zt,"H",N]:null,"Z"],{class:"key-fill key-touch-area lowperf"}),F=_,et=U.makePath(["M",N+F,L-u,"H",kt-F,ge?["V",Zt+F,"H",ke-F]:null,"V",wt-F-se+u,"L",ke-se-F+u,wt-F,"H",ae+F+se-u,"L",ae+F,wt-F-se+u,xe?["V",Zt+F,"H",N+F]:null,"Z"],{class:"key-highlight lowperf"}),nt=xt(Q,ht),pt=ht+St/2,Oe=s-rt,le=U.makeCircle(pt,Oe,O,{class:"key-sticker white-key-sticker lowperf"}),Et=U.createGroup({class:"key-marker-group lowperf"});return Et.appendChild(nt),Et.appendChild(le),lt.appendChild(A),lt.appendChild(et),lt.appendChild(Et),lt}function Lt(Q,At,ht,St){let wt=At,se=wt+ht,ae=U.createGroup({id:`key${Q}`,class:"key black-key lowperf",value:Q}),ke=U.makePath(["M",wt,D,"H",se,"V",St,"H",wt,"Z"],{class:"key-fill key-touch-area lowperf"}),Zt=S,xe=U.makePath(["M",wt+Zt,D+Zt,"H",se-Zt,"V",St-Zt,"H",wt+Zt,"Z"],{class:"key-highlight lowperf"}),ge=Z(Q,At),N=At+ht/2,kt=l-k,lt=U.makeCircle(N,kt,O,{class:"key-sticker black-key-sticker lowperf"}),A=U.createGroup({class:"key-marker-group lowperf"});return A.appendChild(ge),A.appendChild(lt),ae.appendChild(ke),ae.appendChild(xe),ae.appendChild(A),ae}function xt(Q,At){let ht=At+h,St=U.createElement("text",{x:ht,y:W,id:`keylabel${Q}`,class:"key-label white-key-label lowperf"});return St.appendChild(U.createElement("tspan",{x:ht})),St}function Z(Q,At){let ht=At+b,St=U.createElement("text",{x:ht,y:j,id:`keylabel${Q}`,class:"key-label black-key-label lowperf"});return St.appendChild(U.createElement("tspan",{x:ht})),St.appendChild(U.createElement("tspan",{x:ht,dy:"-0.9lh"})),St.appendChild(U.createElement("tspan",{x:ht,dy:"-1.0lh"})),St}let It=0,Rt=0;for(let Q=n;Q<=a;Q++){let At=Q%12;if(Io(At)){let ht=Y(Q,At,Rt,c,s,w);it.appendChild(ht),e[Q]=ht,It+=c,Rt+=c}else{let ht=Rt-b+Lo[At]*f,St=Lt(Q,ht,f,l);ft.appendChild(St),e[Q]=St}}t.appendChild(it),t.appendChild(U.makeRect(It,E.height,0,E.top,null,null,{id:"top-felt",class:"lowperf"})),t.appendChild(ft);let Gt={left:-2,top:-4,width:It+To+2,height:s*nr+To+4};t.setAttribute("viewBox",`${Gt.left} ${Gt.top} ${Gt.width} ${Gt.height}`)}function Se(t,e,o={}){let r=U.createElement("path",o);return t=t.filter(i=>i!=null).map(i=>Array.isArray(i)?i.join(" "):i).join(" "),e=e.filter(i=>i!=null).map(i=>Array.isArray(i)?i.join(" "):i).join(" "),r.setAttribute("d0",t),r.setAttribute("d1",e),r}var Uc=[!0,!1,!0,!1,!0,!0,!1,!0,!1,!0,!1,!0];function Io(t){return Uc[t%12]}var Ht={onKeyPress:null,onKeyRelease:null,onSustain:null,onReset:null,get enabled(){return gt.enabled},get velocity(){return gt.velocity},set velocity(t){t<0&&(t=0),t>127&&(t=127),gt.velocity=t},enable(t=null,e=null,o=null,r=null){t&&(this.onKeyPress=t),e&&(this.onKeyRelease=e),o&&(this.onSustain=o),r&&(this.onReset=r),Gc()},disable(){jc()},isNotePressed(t){return gt.pressed_keys.has(t)},isNoteSustained(t){return gt.pressed_keys.has(t)||gt.sustain_keys.has(t)},isSustainActive(){return gt.sustain},resetState(){gt.reset(),this.onReset?.()}},gt={enabled:!1,pressed_keys:new Set([]),sustain_keys:new Set([]),sustain:!1,velocity:88,map:new Map([["KeyZ",48],["KeyS",49],["KeyX",50],["KeyD",51],["KeyC",52],["KeyV",53],["KeyG",54],["KeyB",55],["KeyH",56],["KeyN",57],["KeyJ",58],["KeyM",59],["KeyW",60],["Digit3",61],["KeyE",62],["Digit4",63],["KeyR",64],["KeyT",65],["Digit6",66],["KeyY",67],["Digit7",68],["KeyU",69],["Digit8",70],["KeyI",71],["KeyO",72],["Digit0",73],["KeyP",74],["KeyQ",59],["Digit1",58],["Comma",60],["KeyL",61],["Period",62],["Semicolon",63],["Slash",64],["IntlRo",65],["Backslash",66],["Minus",75],["BracketLeft",76],["BracketRight",77],["IntlBackslash",47]]),reset(){this.pressed_keys.clear(),this.sustain_keys.clear(),this.sustain=!1}};function Gc(){gt.enabled||(gt.enabled=!0,window.addEventListener("keydown",Ss),window.addEventListener("keyup",Es))}function jc(){gt.enabled&&(window.removeEventListener("keydown",Ss),window.removeEventListener("keyup",Es),gt.enabled=!1,gt.reset())}function Kc(t){gt.pressed_keys.add(t),gt.sustain&&gt.sustain_keys.add(t),Ht.onKeyPress?.(t,gt.velocity)}function qc(t){gt.pressed_keys.delete(t),Ht.onKeyRelease?.(t)}function xs(t){if(gt.sustain!=t){if(gt.sustain=t,t)for(let e of gt.pressed_keys)gt.sustain_keys.add(e);else gt.sustain_keys.clear();Ht.onSustain(t)}}function Ss(t){if(!(t.ctrlKey||t.altKey)){if(t.code.startsWith("Shift"))t.preventDefault(),xs(!0);else if(gt.map.has(t.code)){if(t.preventDefault(),t.repeat)return;let e=gt.map.get(t.code);Kc(e)}}}function Es(t){if(t.code.startsWith("Shift")&&!t.shiftKey&&(t.preventDefault(),xs(!1)),gt.map.has(t.code)){if(t.preventDefault(),t.repeat)return;let e=gt.map.get(t.code);qc(e)}}var Vr=class{#t=null;#o="";constructor(e,o){switch(e){case"local":this.#t=localStorage;break;case"session":this.#t=sessionStorage;break;default:throw Error(`Invalid storage type: "${e}".`)}o!=""&&(this.#o=o+"_"),this.#o.replace(" ","_")}#e(e){return this.#o+e}isAvailable(){try{let e="__storage_test__";return this.#t.setItem(e,e),this.#t.removeItem(e),!0}catch(e){return e instanceof DOMException&&e.name==="QuotaExceededError"&&this.#t&&this.#t.length!==0}}readString(e,o=""){try{if(!this.isAvailable())throw Error();let r=this.#t.getItem(this.#e(e));return r??o}catch{return o}}writeString(e,o){try{if(!this.isAvailable())throw Error();this.#t.setItem(this.#e(e),o)}catch{return!1}return!0}readNumber(e,o=0){let r=this.readString(e,o);return isNaN(r)?o:Number(r)}writeNumber(e,o){return isNaN(o)?!1:this.writeString(e,o.toString())}readBool(e,o=!1){return this.readString(e,o.toString())==="true"}writeBool(e,o){return o!=!0&&o!=!1?!1:this.writeString(e,o.toString())}remove(e){try{if(!this.isAvailable())throw Error();this.#t.removeItem(this.#e(e))}catch{return!1}return!0}has(e){return this.isAvailable()&&this.#t.getItem(this.#e(e))!==null}keys(){let e=[],o=this.#o.length;for(let r=0;r<this.#t.length;r++){let i=this.#t.key(r);i.startsWith(this.#o)&&e.push(i.substring(o))}return e}clear(){for(let e of this.keys())this.remove(e)}},Ur=class extends Vr{constructor(e){super("local",e)}},Gr=class extends Vr{constructor(e){super("session",e)}};var jr=class{#t;#o;#e=[];#r=[];#l=[];#n;#s=!1;#i=!1;get visible(){return this.#i}onshow=void 0;onhide=void 0;onmenuenter=void 0;onoptionenter=void 0;constructor(e,o,r="alt"){this.#t=e,this.#o=o,this.#n=r,this.enable()}enable(){this.#s||(this.#s=!0,window.addEventListener("keydown",e=>this.#u(e)),window.addEventListener("keyup",e=>this.#d(e)),window.addEventListener("blur",()=>this.#h()))}disable(){this.#s&&(window.removeEventListener("keydown",e=>this.#u(e)),window.removeEventListener("keyup",e=>this.#d(e)),window.removeEventListener("blur",()=>this.#h()),this.#s=!1)}get container(){return this.#t}replaceStructure(e){this.#o=e,this.#i&&this.#a()}#f(){this.#i==!1&&(this.#i=!0,this.#e=[0],this.onshow?.(),this.#t.hidden=!1,this.#t.focus()),this.#a()}#m(e){this.#e.push(e),this.onmenuenter?.(this.#r[e].text)}#g(){this.#e.length>1&&(this.#e.pop(),this.onmenuenter?.(this.#l.text))}#a(){this.#t.innerHTML="";let e=document.createElement("sl-breadcrumb");this.#t.appendChild(e);let o=this.#o;for(let n of this.#e){let a=document.createElement("sl-breadcrumb-item");a.innerHTML=As(o[n][0]),o=o[n][1],e.appendChild(a)}this.#r=[];for(let[n,a]of o.entries()){this.#l=this.#r;let s=a[1]===null||a[2]?.noindex?a[0]:`&${n+1}: ${a[0]}`;this.#r.push({html:Cs(s),text:As(a[0]),action:Array.isArray(a[1])?n:a[1],keys:a[2]?.key?Ps(s).concat([a[2].key]):Ps(s),checkbox:a[2]?Object.hasOwn(a[2],"checked"):!1,checked:a[2]?.checked})}this.#e.length>1&&this.#r.push({html:Cs("&0: Back"),text:"Back",action:()=>this.#g(),keys:["0"]});let r=this.#r.map(n=>n.checkbox?`<span check-item${n.checked?" checked":""}><span class="checkbox">${n.checked?"\u{1F5F9}":"\u2610"}</span> ${n.html}</span>`:`<span>${n.html}</span>`).join("|"),i=document.createElement("sl-breadcrumb-item");i.innerHTML="&nbsp;"+r,e.appendChild(i)}#c(){this.#i&&(this.#i=!1,this.#t.hidden=!0,this.onhide?.())}#u(e){if(!e.repeat){if(this.#p(e))e.preventDefault(),this.#f();else if(this.#b(e)){let o=!1,r=e.key.toLowerCase();for(let i of this.#r)i.keys.includes(r)&&i.action!==null&&(o=!0,typeof i.action=="number"?this.#m(i.action):typeof i.action=="function"&&(i.action(),this.onoptionenter?.()));this.#a(),(o||r.length==1)&&e.preventDefault()}}}#d(e){this.#p(e)&&(e.preventDefault(),this.#c())}#h(){this.#i&&this.#c()}#p(e){return e.key.toLowerCase()==this.#n||e.code.toLowerCase().startsWith(this.#n)}#b(e){return[this.#n=="ctrl"&&e.ctrlKey,this.#n=="alt"&&e.altKey,this.#n=="shift"&&e.shiftKey].filter(o=>o).length==1}};function Cs(t){return t.replace(/&(.)/g,"<u>$1</u>")}function As(t){return t.replaceAll("&","")}function Ps(t){return t.match(/(?<=&)./g)?.map(o=>o.toLowerCase())??[]}var Wc=Object.defineProperty,Zc=Object.defineProperties,Xc=Object.getOwnPropertyDescriptors,Ms=Object.getOwnPropertySymbols,Yc=Object.prototype.hasOwnProperty,Qc=Object.prototype.propertyIsEnumerable,Is=t=>{throw TypeError(t)},Ts=(t,e,o)=>e in t?Wc(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,Ee=(t,e)=>{for(var o in e||(e={}))Yc.call(e,o)&&Ts(t,o,e[o]);if(Ms)for(var o of Ms(e))Qc.call(e,o)&&Ts(t,o,e[o]);return t},Ke=(t,e)=>Zc(t,Xc(e)),rn=(t,e,o)=>e.has(t)||Is("Cannot "+o),T=(t,e,o)=>(rn(t,e,"read from private field"),o?o.call(t):e.get(t)),Dt=(t,e,o)=>e.has(t)?Is("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),Ct=(t,e,o,r)=>(rn(t,e,"write to private field"),r?r.call(t,o):e.set(t,o),o),lo=(t,e,o)=>(rn(t,e,"access private method"),o),jt=(t,e,o)=>new Promise((r,i)=>{var n=l=>{try{s(o.next(l))}catch(u){i(u)}},a=l=>{try{s(o.throw(l))}catch(u){i(u)}},s=l=>l.done?r(l.value):Promise.resolve(l.value).then(n,a);s((o=o.apply(t,e)).next())});function Kr(t){let e=t.filter(o=>!!o);return e.reduce((o,r)=>{let i="output"in o?o.output:o,n="input"in r?r.input:r;return i.connect(n),r}),()=>{e.reduce((o,r)=>{let i="output"in o?o.output:o,n="input"in r?r.input:r;return i.disconnect(n),r})}}function Ds(t){let e=t,o=new Set;function r(a){return o.add(a),a(e),()=>{o.delete(a)}}function i(a){e=a,o.forEach(s=>s(e))}function n(){return e}return{subscribe:r,set:i,get:n}}function Jc(){let t=new Set;function e(r){return t.add(r),()=>{t.delete(r)}}function o(r){t.forEach(i=>i(r))}return{subscribe:e,trigger:o}}function tu(t){let e=!1;return()=>{e||(e=!0,t.forEach(o=>o?.()))}}function nn(t){return t*t/16129}function eu(t){return Math.pow(10,t/20)}var io,je,Oo,Ro,qr,no,so,Os=class{constructor(t,e){this.context=t,Dt(this,io),Dt(this,je),Dt(this,Oo),Dt(this,Ro),Dt(this,qr),Dt(this,no),Dt(this,so,!1);var o,r,i;Ct(this,no,{destination:(o=e?.destination)!=null?o:t.destination,volume:(r=e?.volume)!=null?r:100,volumeToGain:(i=e?.volumeToGain)!=null?i:nn}),this.input=t.createGain(),Ct(this,io,t.createGain()),Ct(this,Ro,Kr([this.input,T(this,io),T(this,no).destination]));let n=Ds(T(this,no).volume);this.setVolume=n.set,Ct(this,qr,n.subscribe(a=>{T(this,io).gain.value=T(this,no).volumeToGain(a)}))}addInsert(t){var e;if(T(this,so))throw Error("Can't add insert to disconnected channel");(e=T(this,Oo))!=null||Ct(this,Oo,[]),T(this,Oo).push(t),T(this,Ro).call(this),Ct(this,Ro,Kr([this.input,...T(this,Oo),T(this,io),T(this,no).destination]))}addEffect(t,e,o){var r;if(T(this,so))throw Error("Can't add effect to disconnected channel");let i=this.context.createGain();i.gain.value=o;let n="input"in e?e.input:e,a=Kr([T(this,io),i,n]);(r=T(this,je))!=null||Ct(this,je,[]),T(this,je).push({name:t,mix:i,disconnect:a})}sendEffect(t,e){var o;if(T(this,so))throw Error("Can't send effect to disconnected channel");let r=(o=T(this,je))==null?void 0:o.find(i=>i.name===t);r&&(r.mix.gain.value=e)}disconnect(){var t;T(this,so)||(Ct(this,so,!0),T(this,Ro).call(this),T(this,qr).call(this),(t=T(this,je))==null||t.forEach(e=>e.disconnect()),Ct(this,je,void 0))}};io=new WeakMap;je=new WeakMap;Oo=new WeakMap;Ro=new WeakMap;qr=new WeakMap;no=new WeakMap;so=new WeakMap;var ue,ou=class{constructor(t){this.compare=t,Dt(this,ue,[])}push(t){let e=T(this,ue).length,o=0,r=e-1,i=e;for(;o<=r;){let n=Math.floor((o+r)/2);this.compare(t,T(this,ue)[n])<0?(i=n,r=n-1):o=n+1}T(this,ue).splice(i,0,t)}pop(){return T(this,ue).shift()}peek(){return T(this,ue)[0]}removeAll(t){let e=T(this,ue).length;return Ct(this,ue,T(this,ue).filter(o=>!t(o))),T(this,ue).length!==e}clear(){Ct(this,ue,[])}size(){return T(this,ue).length}};ue=new WeakMap;function $s(t,e){return t&&e?o=>{t(o),e(o)}:t??e}function ru(t){var e,o,r;let i={disableScheduler:(e=t.disableScheduler)!=null?e:!1,scheduleLookaheadMs:(o=t.scheduleLookaheadMs)!=null?o:200,scheduleIntervalMs:(r=t.scheduleIntervalMs)!=null?r:50,onStart:t.onStart,onEnded:t.onEnded};if(i.scheduleLookaheadMs<1)throw Error("scheduleLookaheadMs must be greater than 0");if(i.scheduleIntervalMs<1)throw Error("scheduleIntervalMs must be greater than 0");if(i.scheduleLookaheadMs<i.scheduleIntervalMs)throw Error("scheduleLookaheadMs must be greater than scheduleIntervalMs");return i}var Fe,be,ao,Rs=class{constructor(t,e={}){Dt(this,Fe),Dt(this,be),Dt(this,ao),Ct(this,Fe,ru(e)),Ct(this,be,new ou((o,r)=>o.time-r.time)),this.player=t}get context(){return this.player.context}get buffers(){return this.player.buffers}get isRunning(){return T(this,ao)!==void 0}start(t){var e;if(T(this,Fe).disableScheduler)return this.player.start(t);let o=this.player.context,r=o.currentTime,i=(e=t.time)!=null?e:r,n=T(this,Fe).scheduleLookaheadMs/1e3;return t.onStart=$s(t.onStart,T(this,Fe).onStart),t.onEnded=$s(t.onEnded,T(this,Fe).onEnded),i<r+n?this.player.start(t):(T(this,be).push(Ke(Ee({},t),{time:i})),T(this,ao)||Ct(this,ao,setInterval(()=>{let a=o.currentTime+n;for(;T(this,be).size()&&T(this,be).peek().time<=a;){let s=T(this,be).pop();s&&this.player.start(s)}T(this,be).size()||(clearInterval(T(this,ao)),Ct(this,ao,void 0))},T(this,Fe).scheduleIntervalMs)),a=>{!a||a<i?T(this,be).removeAll(s=>s===t)||this.player.stop(Ke(Ee({},t),{time:a})):this.player.stop(Ke(Ee({},t),{time:a}))})}stop(t){var e;if(T(this,Fe).disableScheduler)return this.player.stop(t);if(this.player.stop(t),!t){T(this,be).clear();return}let o=(e=t?.time)!=null?e:0,r=t?.stopId;r?T(this,be).removeAll(i=>i.time>=o&&i.stopId?i.stopId===r:i.note===r):T(this,be).removeAll(i=>i.time>=o)}disconnect(){this.player.disconnect()}};Fe=new WeakMap;be=new WeakMap;ao=new WeakMap;var sr,Fo,ar,Fs=class{constructor(t,e){this.context=t,this.options=e,Dt(this,sr),Dt(this,Fo,!1),Dt(this,ar);var o,r;Ct(this,sr,{velocityToGain:(o=e.velocityToGain)!=null?o:nn,destination:(r=e.destination)!=null?r:t.destination}),this.buffers={},Ct(this,ar,Jc())}start(t){var e,o,r,i,n,a,s,l,u,m,c,f,h,g;if(T(this,Fo))throw new Error("Can't start a sample on disconnected player");let b=this.context,w=t.name&&this.buffers[t.name]||this.buffers[t.note];if(!w)return()=>{};let _=b.createBufferSource();_.buffer=w;let S=(o=(e=t.detune)!=null?e:this.options.detune)!=null?o:0;_.detune?_.detune.value=S:_.playbackRate&&(_.playbackRate.value=Math.pow(2,S/1200));let E=(r=t.lpfCutoffHz)!=null?r:this.options.lpfCutoffHz,L=E?b.createBiquadFilter():void 0;E&&L&&(L.type="lowpass",L.frequency.value=E);let D=b.createGain(),W=(n=(i=t.velocity)!=null?i:this.options.velocity)!=null?n:100;D.gain.value=T(this,sr).velocityToGain(W),((a=t.loop)!=null?a:this.options.loop)&&(_.loop=!0,_.loopStart=(s=t.loopStart)!=null?s:0,_.loopEnd=(l=t.loopEnd)!=null?l:w.duration);let X=(u=t.decayTime)!=null?u:this.options.decayTime,[O,rt]=iu(b,X);function k(Z){if(Z??(Z=b.currentTime),Z<=Lt)_.stop(Z);else{let It=rt(Z);_.stop(It)}}let it=t.gainOffset?b.createGain():void 0;it&&t.gainOffset&&(it.gain.value=t.gainOffset);let ft=(m=t.stopId)!=null?m:t.note,Y=tu([Kr([_,L,D,O,it,T(this,sr).destination]),(c=t.stop)==null?void 0:c.call(t,k),T(this,ar).subscribe(Z=>{(!Z||Z.stopId===void 0||Z.stopId===ft)&&k(Z?.time)})]);_.onended=()=>{var Z;Y(),(Z=t.onEnded)==null||Z.call(t,t)},(f=t.onStart)==null||f.call(t,t);let Lt=Math.max((h=t.time)!=null?h:0,b.currentTime);_.start(t.time);let xt=(g=t.duration)!=null?g:w.duration;return typeof t.duration=="number"&&k(Lt+xt),k}stop(t){T(this,ar).trigger(t)}disconnect(){T(this,Fo)||(Ct(this,Fo,!0),this.stop(),Object.keys(this.buffers).forEach(t=>{delete this.buffers[t]}))}get connected(){return!T(this,Fo)}};sr=new WeakMap;Fo=new WeakMap;ar=new WeakMap;function iu(t,e=.2){let o=0,r=t.createGain();r.gain.value=1;function i(n){if(o)return o;r.gain.cancelScheduledValues(n);let a=n||t.currentTime;return o=a+e,r.gain.setValueAtTime(1,a),r.gain.linearRampToValueAtTime(0,o),o}return[r,i]}var Bs=class{constructor(t,e){this.context=t;let o=new Os(t,e);this.player=new Rs(new Fs(t,Ke(Ee({},e),{destination:o.input})),e),this.output=o}get buffers(){return this.player.buffers}start(t){return this.player.start(t)}stop(t){this.player.stop(typeof t=="object"?t:t!==void 0?{stopId:t}:void 0)}disconnect(){this.output.disconnect(),this.player.disconnect()}};function sn(t,e,o){return jt(this,null,function*(){e=e.replace(/#/g,"%23").replace(/([^:]\/)\/+/g,"$1");let r=yield o.fetch(e);if(r.status===200)try{let i=yield r.arrayBuffer();return yield t.decodeAudioData(i)}catch{}})}function an(t){if(typeof document>"u")return null;let e=document.createElement("audio");for(let o=0;o<t.length;o++){let r=t[o],i=e.canPlayType(`audio/${r}`);if(i==="probably"||i==="maybe")return r;if(r==="m4a"){let n=e.canPlayType("audio/aac");if(n==="probably"||n==="maybe")return r}}return null}function nu(){var t;return"."+((t=an(["ogg","m4a"]))!=null?t:"ogg")}var ln={fetch(t){return fetch(t)}},No,Wr,Ns,zs,Hs=class{constructor(t="smplr"){Dt(this,Wr),Dt(this,No),typeof window>"u"||!("caches"in window)?Ct(this,No,Promise.reject("CacheStorage not supported")):Ct(this,No,caches.open(t))}fetch(t){return jt(this,null,function*(){let e=new Request(t);try{return yield lo(this,Wr,Ns).call(this,e)}catch{let r=yield fetch(e);return yield lo(this,Wr,zs).call(this,e,r),r}})}};No=new WeakMap;Wr=new WeakSet;Ns=function(t){return jt(this,null,function*(){let o=yield(yield T(this,No)).match(t);if(o)return o;throw Error("Not found")})};zs=function(t,e){return jt(this,null,function*(){try{yield(yield T(this,No)).put(t,e.clone())}catch{}})};var su;su=new WeakMap;function au(t){let o=/^([a-gA-G]?)(#{1,}|b{1,}|)(-?\d+)$/.exec(t);if(!o)return;let r=o[1].toUpperCase();if(!r)return;let i=o[2],n=i[0]==="b"?-i.length:i.length,a=o[3]?+o[3]:4,s=(r.charCodeAt(0)+3)%7;return[0,2,4,5,7,9,11][s]+n+12*(a+1)}function zo(t){return t===void 0?void 0:typeof t=="number"?t:au(t)}function lu(t,e,o,r){return jt(this,null,function*(){o.groups.forEach(i=>{let n=du(o,i);return uu(t,e,n,r)})})}function cu(t,e){return jt(this,null,function*(){var o;let r=n=>"global"in n,i=n=>"websfzUrl"in n;if(typeof t=="string")return Ls(t,e);if(r(t))return t;if(i(t)){let n=yield Ls(t.websfzUrl,e);return(o=n.meta)!=null||(n.meta={}),t.name&&(n.meta.name=t.name),t.baseUrl&&(n.meta.baseUrl=t.baseUrl),t.formats&&(n.meta.formats=t.formats),n}else throw new Error("Invalid instrument: "+JSON.stringify(t))})}function uu(t,e,o,r){return jt(this,null,function*(){yield Promise.all(Object.keys(o).map(i=>jt(this,null,function*(){if(e[i])return;let n=yield sn(t,o[i],r);return n&&(e[i]=n),e})))})}function Ls(t,e){return jt(this,null,function*(){try{return yield(yield fetch(t)).json()}catch{throw new Error(`Can't load SFZ file ${t}`)}})}function du(t,e){var o,r,i,n;let a={},s=(o=t.meta.baseUrl)!=null?o:"",l=(i=an((r=t.meta.formats)!=null?r:[]))!=null?i:"ogg",u=(n=t.global.default_path)!=null?n:"";return e?e.regions.reduce((m,c)=>(c.sample&&(m[c.sample]=`${s}/${u}${c.sample}.${l}`),m),a):a}function Do(t,e,o){let r=e===void 0||t!==void 0&&t>=e,i=o===void 0||t!==void 0&&t<=o;return r&&i}function hu(t,e){let o=[];for(let r of t.groups)if(Do(e.midi,r.lokey,r.hikey)&&Do(e.velocity,r.lovel,r.hivel)&&Do(e.cc64,r.locc64,r.hicc64))for(let i of r.regions)Do(e.midi,i.lokey,i.hikey)&&Do(e.velocity,i.lovel,i.hivel)&&Do(e.cc64,r.locc64,r.hicc64)&&o.push([r,i]);return o}var pu=Object.freeze({meta:{},global:{},groups:[]}),Bo,en,Vs,fu=class{constructor(t,e){this.context=t,Dt(this,en),Dt(this,Bo),this.options=Object.freeze(Object.assign({volume:100,velocity:100,storage:ln,detune:0,destination:t.destination},e)),this.player=new Bs(t,e),Ct(this,Bo,pu),this.load=cu(e.instrument,this.options.storage).then(o=>(Ct(this,Bo,Object.freeze(o)),lu(t,this.player.buffers,T(this,Bo),this.options.storage))).then(()=>this)}get output(){return this.player.output}loaded(){return jt(this,null,function*(){return this.load})}start(t){lo(this,en,Vs).call(this,typeof t=="object"?t:{note:t})}stop(t){this.player.stop(t)}disconnect(){this.player.disconnect()}};Bo=new WeakMap;en=new WeakSet;Vs=function(t){var e;let o=zo(t.note);if(o===void 0)return()=>{};let r=(e=t.velocity)!=null?e:this.options.velocity,i=hu(T(this,Bo),{midi:o,velocity:r}),n=()=>{var s;(s=t.onEnded)==null||s.call(t,t)},a=i.map(([s,l])=>{var u,m,c;let f=(m=(u=l.pitch_keycenter)!=null?u:l.key)!=null?m:o,h=(o-f)*100;return this.player.start(Ke(Ee({},t),{note:l.sample,decayTime:t.decayTime,detune:h+((c=t.detune)!=null?c:this.options.detune),onEnded:n,stopId:o}))});switch(a.length){case 0:return()=>{};case 1:return a[0];default:return s=>a.forEach(l=>l(s))}};function mu(t,e){let o=t.createGain(),r=t.createGain();o.channelCount=2,o.channelCountMode="explicit";let i=t.createChannelSplitter(2),n=t.createGain(),a=t.createGain(),s=t.createChannelMerger(2),l=t.createOscillator();l.type="sine",l.frequency.value=1,l.start();let u=t.createGain(),m=t.createOscillator();m.type="sine",m.frequency.value=1.1,m.start();let c=t.createGain();o.connect(i),i.connect(n,0),i.connect(a,1),n.connect(s,0,0),a.connect(s,0,1),l.connect(u),u.connect(n.gain),m.connect(c),c.connect(a.gain),s.connect(r);let f=e(h=>{u.gain.value=h,c.gain.value=h});return o.disconnect=()=>{f(),l.stop(),m.stop(),o.disconnect(i),i.disconnect(n,0),i.disconnect(a,1),n.disconnect(s,0,0),a.disconnect(s,0,1),l.disconnect(n),m.disconnect(a),s.disconnect(r)},{input:o,output:r}}var gu={CP80:"https://danigb.github.io/samples/gs-e-pianos/CP80/cp80.websfz.json",PianetT:"https://danigb.github.io/samples/gs-e-pianos/Pianet T/pianet-t.websfz.json",WurlitzerEP200:"https://danigb.github.io/samples/gs-e-pianos/Wurlitzer EP200/wurlitzer-ep200.websfz.json",TX81Z:"https://danigb.github.io/samples/vcsl/TX81Z/tx81z-fm-piano.websfz.json"},Qr=class extends fu{constructor(t,e){var o;super(t,Ke(Ee({},e),{instrument:(o=gu[e.instrument])!=null?o:e.instrument}));let r=Ds(0);this.tremolo={level:n=>r.set(nn(n))};let i=mu(t,r.subscribe);this.output.addInsert(i)}};function bu(t={}){return{groups:[],options:t}}function yu(){return{regions:[]}}function vu(t,e,o,r){let i=[],n=zo(e.note);if(n===void 0)return i;for(let a of t.regions){let s=_u(n,o??0,e,a,r);s&&i.push(s)}return i}function _u(t,e,o,r,i){var n,a,s,l,u,m,c,f,h,g,b,w,_,S,E,L,D,W,j,X,O,rt,k,it,ft,Y,Lt,xt;if(!(t>=((n=r.midiLow)!=null?n:0)&&t<((a=r.midiHigh)!=null?a:127)+1)||!(o.velocity===void 0||o.velocity>=((s=r.velLow)!=null?s:0)&&o.velocity<=((l=r.velHigh)!=null?l:127)))return;if(r.seqLength){let St=e%r.seqLength,wt=((u=r.seqPosition)!=null?u:1)-1;if(St!==wt)return}let Rt=t-r.midiPitch,Gt=(m=o.velocity)!=null?m:i?.velocity,Q=r.volume?eu(r.volume):0,At=(f=(c=o.gainOffset)!=null?c:i?.gainOffset)!=null?f:0,ht=(h=o.detune)!=null?h:0;return{decayTime:(w=(b=o?.decayTime)!=null?b:(g=r.sample)==null?void 0:g.decayTime)!=null?w:i?.decayTime,detune:100*(Rt+((_=r.tune)!=null?_:0))+ht,duration:(L=(E=o?.duration)!=null?E:(S=r.sample)==null?void 0:S.duration)!=null?L:i?.duration,gainOffset:At+Q||void 0,loop:(j=(W=o?.loop)!=null?W:(D=r.sample)==null?void 0:D.loop)!=null?j:i?.loop,loopEnd:(rt=(O=o?.loopEnd)!=null?O:(X=r.sample)==null?void 0:X.loopEnd)!=null?rt:i?.loopEnd,loopStart:(ft=(it=o?.loopStart)!=null?it:(k=r.sample)==null?void 0:k.loopStart)!=null?ft:i?.loopStart,lpfCutoffHz:(xt=(Lt=o?.lpfCutoffHz)!=null?Lt:(Y=r.sample)==null?void 0:Y.lpfCutoffHz)!=null?xt:i?.lpfCutoffHz,name:r.sampleName,note:t,onEnded:o.onEnded,onStart:o.onStart,stopId:o.name,time:o.time,velocity:Gt??void 0}}var Us=class{constructor(t,e){this.context=t,this.seqNum=0;let o=new Os(t,e);this.instrument=bu(e),this.player=new Rs(new Fs(t,Ke(Ee({},e),{destination:o.input})),e),this.output=o}get buffers(){return this.player.buffers}start(t){let e=[],o=typeof t=="object"?t:{note:t};for(let r of this.instrument.groups){let i=vu(r,o,this.seqNum);this.seqNum++;for(let n of i){let a=this.player.start(n);e.push(a)}}return r=>e.forEach(i=>i(r))}stop(t){if(t==null){this.player.stop();return}let e=typeof t=="object"?t:{stopId:t},o=zo(e.stopId);o&&(e.stopId=o,this.player.stop(e))}disconnect(){this.output.disconnect(),this.player.disconnect()}};function wu(t,e){let o=nu();return(r,i)=>jt(this,null,function*(){let n=yield fetch(t).then(l=>l.text());ku(n,e.group).length;let s=new Set;return e.group.regions.forEach(l=>s.add(l.sampleName)),Promise.all(Array.from(s).map(l=>jt(this,null,function*(){let u=e.urlFromSampleName(l,o),m=yield sn(r,u,i);e.buffers[l]=m}))).then(()=>e.group)})}function ku(t,e){let o="global",r=t.split(`
`).map(Au).filter(s=>!!s),i=new Pu,n=[];for(let s of r)switch(s.type){case"mode":n.push(i.closeScope(o,e)),o=s.value;break;case"prop:num":case"prop:str":case"prop:num_arr":i.push(s.key,s.value);break;case"unknown":break}return n.filter(s=>!!s);function a(s,l,u){}}var xu=/^<([^>]+)>$/,Su=/^([^=]+)=([-\.\d]+)$/,Eu=/^([^=]+)=(.+)$/,Cu=/^([^=]+)_(\d+)=(\d+)$/;function Au(t){if(t=t.trim(),t===""||t.startsWith("//"))return;let e=t.match(xu);if(e)return{type:"mode",value:e[1]};let o=t.match(Cu);if(o)return{type:"prop:num_arr",key:o[1],value:[Number(o[2]),Number(o[3])]};let r=t.match(Su);if(r)return{type:"prop:num",key:r[1],value:Number(r[2])};let i=t.match(Eu);return i?{type:"prop:str",key:i[1],value:i[2]}:{type:"unknown",value:t}}var lr,Zr,Pu=class{constructor(){Dt(this,lr),this.values={},this.global={},this.group={}}closeScope(t,e){if(t==="global")lo(this,lr,Zr).call(this,this.global);else if(t==="group")this.group=lo(this,lr,Zr).call(this,{});else if(t==="region"){let o=lo(this,lr,Zr).call(this,Ee(Ee({sampleName:"",midiPitch:-1},this.global),this.group));if(o.sampleName==="")return"Missing sample name";if(o.midiPitch===-1)if(o.midiLow!==void 0)o.midiPitch=o.midiLow;else return"Missing pitch_keycenter";o.seqLength&&o.seqPosition===void 0&&(o.seqPosition=1),o.ampRelease&&(o.sample={decayTime:o.ampRelease},delete o.ampRelease),e.regions.push(o)}}get empty(){return Object.keys(this.values).length===0}get keys(){return Object.keys(this.values)}push(t,e){this.values[t]=e}popNum(t,e,o){return typeof this.values[t]!="number"?!1:(e[o]=this.values[t],delete this.values[t],!0)}popStr(t,e,o){return typeof this.values[t]!="string"?!1:(e[o]=this.values[t],delete this.values[t],!0)}popNumArr(t,e,o){return Array.isArray(this.values[t])?(e[o]=this.values[t],delete this.values[t],!0):!1}};lr=new WeakSet;Zr=function(t){return this.popStr("sample",t,"sampleName"),this.popNum("pitch_keycenter",t,"midiPitch"),this.popNum("ampeg_attack",t,"ampAttack"),this.popNum("ampeg_release",t,"ampRelease"),this.popNum("bend_down",t,"bendDown"),this.popNum("bend_up",t,"bendUp"),this.popNum("group",t,"group"),this.popNum("hikey",t,"midiHigh"),this.popNum("hivel",t,"velHigh"),this.popNum("lokey",t,"midiLow"),this.popNum("offset",t,"offset"),this.popNum("lovel",t,"velLow"),this.popNum("off_by",t,"groupOffBy"),this.popNum("pitch_keytrack",t,"ignore"),this.popNum("seq_length",t,"seqLength"),this.popNum("seq_position",t,"seqPosition"),this.popNum("tune",t,"tune"),this.popNum("volume",t,"volume"),this.popNumArr("amp_velcurve",t,"ampVelCurve"),this.values={},t};var Mu="https://smpldsnds.github.io/sgossner-vcsl/";function Tu(t){return Mu+t+".sfz"}function $u(t,e){let o=Tu(t),i=`https://smpldsnds.github.io/sgossner-vcsl/${t.slice(0,t.lastIndexOf("/")+1)}`,n=yu();return wu(o,{buffers:e,group:n,urlFromSampleName:(a,s)=>i+"/"+a.replace(".wav",s)})}var Gs=class{constructor(t,e={}){var o,r;this.config={instrument:(o=e.instrument)!=null?o:"Arco",storage:(r=e.storage)!=null?r:ln},this.player=new Us(t,e);let i=$u(this.config.instrument,this.player.buffers);this.load=i(t,this.config.storage).then(n=>(this.player.instrument.groups.push(n),this))}get output(){return this.player.output}get buffers(){return this.player.buffers}get context(){return this.player.context}start(t){return this.player.start(t)}stop(t){return this.player.stop(t)}disconnect(){this.player.disconnect()}};var Lu,Iu,Du;Lu=new WeakMap;Iu=new WeakMap;Du=new WeakMap;var Ou;Ou=new WeakMap;var Ru;Ru=new WeakMap;var Xr,Jr=class{constructor(t,e){this.context=t,this.options=e,Dt(this,Xr,[]),this.player=new Us(t,e),this.load=Bu(e).then(o=>{this.soundfont=o,Ct(this,Xr,o.instruments.map(r=>r.header.name))}).then(()=>this)}get instrumentNames(){return T(this,Xr)}loadInstrument(t){var e,o,r;let i=(e=this.soundfont)==null?void 0:e.instruments.find(l=>l.header.name===t);if(!i)return;let n=this.player.buffers,a={regions:[]};for(let l of i.zones){let u=l.sample,m=u.header,c=Fu(this.context,u),f={sampleName:u.header.name,midiPitch:u.header.originalPitch,midiLow:(o=l.keyRange)==null?void 0:o.lo,midiHigh:(r=l.keyRange)==null?void 0:r.hi,sample:{loop:m.startLoop>=0&&m.endLoop>m.startLoop,loopStart:m.startLoop/m.sampleRate,loopEnd:m.endLoop/m.sampleRate}};a.regions.push(f),n[f.sampleName]=c}let s={groups:[a],options:this.options};return this.player.instrument=s,[s,n]}get output(){return this.player.output}start(t){return this.player.start(t)}stop(t){return this.player.stop(t)}disconnect(){this.player.disconnect()}};Xr=new WeakMap;function Fu(t,e){let{header:o,data:r}=e,i=new Float32Array(r.length);for(let s=0;s<r.length;s++)i[s]=r[s]/32768;let n=t.createBuffer(1,i.length,o.sampleRate);return n.getChannelData(0).set(i),n}function Bu(t){return jt(this,null,function*(){let e=yield fetch(t.url).then(r=>r.arrayBuffer()),o=new Uint8Array(e);return t.createSoundfont(o)})}var Nu="https://danigb.github.io/samples/splendid-grand-piano",on,js,Ks=class{constructor(t,e){this.context=t,Dt(this,on),this.options=Object.assign({baseUrl:Nu,storage:ln,detune:0,volume:100,velocity:100,decayTime:.5},e),this.player=new Bs(t,this.options);let o=Hu(this.options.baseUrl,this.options.storage,this.options.notesToLoad);this.load=o(t,this.player.buffers).then(()=>this)}get output(){return this.player.output}get buffers(){return this.player.buffers}loaded(){return jt(this,null,function*(){return this.load})}start(t){var e,o;let r=typeof t=="object"?Ee({},t):{note:t},i=lo(this,on,js).call(this,r);return i?(r.note=i[0],r.stopId=(e=r.stopId)!=null?e:i[1],r.detune=i[2]+((o=r.detune)!=null?o:this.options.detune),this.player.start(r)):()=>{}}stop(t){var e;if(typeof t=="string")return this.player.stop((e=zo(t))!=null?e:t);if(typeof t=="object"){let o=zo(t.stopId);return this.player.stop(o!==void 0?Ke(Ee({},t),{stopId:o}):t)}else return this.player.stop(t)}};on=new WeakSet;js=function(t){var e;let o=zo(t.note);if(!o)return;let r=(e=t.velocity)!=null?e:this.options.velocity,i=Yr.findIndex(a=>r>=a.vel_range[0]&&r<=a.vel_range[1]),n=Yr[i];if(n)return zu(n.name,o,this.player.buffers)};function zu(t,e,o){let r=0;for(;o[t+(e+r)]===void 0&&r<128;)r>0?r=-r:r=-r+1;return r===127?[t+e,e,0]:[t+(e+r),e,-r*100]}function Hu(t,e,o){var r;let i=(r=an(["ogg","m4a"]))!=null?r:"ogg",n=o?Yr.filter(a=>a.vel_range[0]<=o.velocityRange[1]&&a.vel_range[1]>=o.velocityRange[0]):Yr;return(a,s)=>jt(this,null,function*(){for(let l of n){let u=o?l.samples.filter(m=>o.notes.includes(m[0])):l.samples;yield Promise.all(u.map(m=>jt(this,[m],function*([c,f]){let h=`${t}/${f}.${i}`,g=yield sn(a,h,e);g&&(s[l.name+c]=g)})))}})}var Yr=[{name:"PPP",vel_range:[1,40],cutoff:1e3,samples:[[23,"PP-B-1"],[27,"PP-D#0"],[29,"PP-F0"],[31,"PP-G0"],[33,"PP-A0"],[35,"PP-B0"],[37,"PP-C#1"],[38,"PP-D1"],[40,"PP-E1"],[41,"PP-F1"],[43,"PP-G1"],[45,"PP-A1"],[47,"PP-B1"],[48,"PP-C2"],[50,"PP-D2"],[52,"PP-E2"],[53,"PP-F2"],[55,"PP-G2"],[56,"PP-G#2"],[57,"PP-A2"],[58,"PP-A#2"],[59,"PP-B2"],[60,"PP-C3"],[62,"PP-D3"],[64,"PP-E3"],[65,"PP-F3"],[67,"PP-G3"],[69,"PP-A3"],[71,"PP-B3"],[72,"PP-C4"],[74,"PP-D4"],[76,"PP-E4"],[77,"PP-F4"],[79,"PP-G4"],[80,"PP-G#4"],[81,"PP-A4"],[82,"PP-A#4"],[83,"PP-B4"],[85,"PP-C#5"],[86,"PP-D5"],[87,"PP-D#5"],[89,"PP-F5"],[90,"PP-F#5"],[91,"PP-G5"],[92,"PP-G#5"],[93,"PP-A5"],[94,"PP-A#5"],[95,"PP-B5"],[96,"PP-C6"],[97,"PP-C#6"],[98,"PP-D6"],[99,"PP-D#6"],[100,"PP-E6"],[101,"PP-F6"],[102,"PP-F#6"],[103,"PP-G6"],[104,"PP-G#6"],[105,"PP-A6"],[106,"PP-A#6"],[107,"PP-B6"],[108,"PP-C7"]]},{name:"PP",vel_range:[41,67],samples:[[23,"PP-B-1"],[27,"PP-D#0"],[29,"PP-F0"],[31,"PP-G0"],[33,"PP-A0"],[35,"PP-B0"],[37,"PP-C#1"],[38,"PP-D1"],[40,"PP-E1"],[41,"PP-F1"],[43,"PP-G1"],[45,"PP-A1"],[47,"PP-B1"],[48,"PP-C2"],[50,"PP-D2"],[52,"PP-E2"],[53,"PP-F2"],[55,"PP-G2"],[56,"PP-G#2"],[57,"PP-A2"],[58,"PP-A#2"],[59,"PP-B2"],[60,"PP-C3"],[62,"PP-D3"],[64,"PP-E3"],[65,"PP-F3"],[67,"PP-G3"],[69,"PP-A3"],[71,"PP-B3"],[72,"PP-C4"],[74,"PP-D4"],[76,"PP-E4"],[77,"PP-F4"],[79,"PP-G4"],[80,"PP-G#4"],[81,"PP-A4"],[82,"PP-A#4"],[83,"PP-B4"],[85,"PP-C#5"],[86,"PP-D5"],[87,"PP-D#5"],[89,"PP-F5"],[90,"PP-F#5"],[91,"PP-G5"],[92,"PP-G#5"],[93,"PP-A5"],[94,"PP-A#5"],[95,"PP-B5"],[96,"PP-C6"],[97,"PP-C#6"],[98,"PP-D6"],[99,"PP-D#6"],[100,"PP-E6"],[101,"PP-F6"],[102,"PP-F#6"],[103,"PP-G6"],[104,"PP-G#6"],[105,"PP-A6"],[106,"PP-A#6"],[107,"PP-B6"],[108,"PP-C7"]]},{name:"MP",vel_range:[68,84],samples:[[23,"Mp-B-1"],[27,"Mp-D#0"],[29,"Mp-F0"],[31,"Mp-G0"],[33,"Mp-A0"],[35,"Mp-B0"],[37,"Mp-C#1"],[38,"Mp-D1"],[40,"Mp-E1"],[41,"Mp-F1"],[43,"Mp-G1"],[45,"Mp-A1"],[47,"Mp-B1"],[48,"Mp-C2"],[50,"Mp-D2"],[52,"Mp-E2"],[53,"Mp-F2"],[55,"Mp-G2"],[56,"Mp-G#2"],[57,"Mp-A2"],[58,"Mp-A#2"],[59,"Mp-B2"],[60,"Mp-C3"],[62,"Mp-D3"],[64,"Mp-E3"],[65,"Mp-F3"],[67,"Mp-G3"],[69,"Mp-A3"],[71,"Mp-B3"],[72,"Mp-C4"],[74,"Mp-D4"],[76,"Mp-E4"],[77,"Mp-F4"],[79,"Mp-G4"],[80,"Mp-G#4"],[81,"Mp-A4"],[82,"Mp-A#4"],[83,"Mp-B4"],[85,"Mp-C#5"],[86,"Mp-D5"],[87,"Mp-D#5"],[88,"Mp-E5"],[89,"Mp-F5"],[90,"Mp-F#5"],[91,"Mp-G5"],[92,"Mp-G#5"],[93,"Mp-A5"],[94,"Mp-A#5"],[95,"Mp-B5"],[96,"Mp-C6"],[97,"Mp-C#6"],[98,"Mp-D6"],[99,"Mp-D#6"],[100,"PP-E6"],[101,"Mp-F6"],[102,"Mp-F#6"],[103,"Mp-G6"],[104,"Mp-G#6"],[105,"Mp-A6"],[106,"Mp-A#6"],[107,"PP-B6"],[108,"PP-C7"]]},{name:"MF",vel_range:[85,100],samples:[[23,"Mf-B-1"],[27,"Mf-D#0"],[29,"Mf-F0"],[31,"Mf-G0"],[33,"Mf-A0"],[35,"Mf-B0"],[37,"Mf-C#1"],[38,"Mf-D1"],[40,"Mf-E1"],[41,"Mf-F1"],[43,"Mf-G1"],[45,"Mf-A1"],[47,"Mf-B1"],[48,"Mf-C2"],[50,"Mf-D2"],[52,"Mf-E2"],[53,"Mf-F2"],[55,"Mf-G2"],[56,"Mf-G#2"],[57,"Mf-A2"],[58,"Mf-A#2"],[59,"Mf-B2"],[60,"Mf-C3"],[62,"Mf-D3"],[64,"Mf-E3"],[65,"Mf-F3"],[67,"Mf-G3"],[69,"Mf-A3"],[71,"Mf-B3"],[72,"Mf-C4"],[74,"Mf-D4"],[76,"Mf-E4"],[77,"Mf-F4"],[79,"Mf-G4"],[80,"Mf-G#4"],[81,"Mf-A4"],[82,"Mf-A#4"],[83,"Mf-B4"],[85,"Mf-C#5"],[86,"Mf-D5"],[87,"Mf-D#5"],[88,"Mf-E5"],[89,"Mf-F5"],[90,"Mf-F#5"],[91,"Mf-G5"],[92,"Mf-G#5"],[93,"Mf-A5"],[94,"Mf-A#5"],[95,"Mf-B5"],[96,"Mf-C6"],[97,"Mf-C#6"],[98,"Mf-D6"],[99,"Mf-D#6"],[100,"Mf-E6"],[101,"Mf-F6"],[102,"Mf-F#6"],[103,"Mf-G6"],[104,"Mf-G#6"],[105,"Mf-A6"],[106,"Mf-A#6"],[107,"Mf-B6"],[108,"PP-C7"]]},{name:"FF",vel_range:[101,127],samples:[[23,"FF-B-1"],[27,"FF-D#0"],[29,"FF-F0"],[31,"FF-G0"],[33,"FF-A0"],[35,"FF-B0"],[37,"FF-C#1"],[38,"FF-D1"],[40,"FF-E1"],[41,"FF-F1"],[43,"FF-G1"],[45,"FF-A1"],[47,"FF-B1"],[48,"FF-C2"],[50,"FF-D2"],[52,"FF-E2"],[53,"FF-F2"],[55,"FF-G2"],[56,"FF-G#2"],[57,"FF-A2"],[58,"FF-A#2"],[59,"FF-B2"],[60,"FF-C3"],[62,"FF-D3"],[64,"FF-E3"],[65,"FF-F3"],[67,"FF-G3"],[69,"FF-A3"],[71,"FF-B3"],[72,"FF-C4"],[74,"FF-D4"],[76,"FF-E4"],[77,"FF-F4"],[79,"FF-G4"],[80,"FF-G#4"],[81,"FF-A4"],[82,"FF-A#4"],[83,"FF-B4"],[85,"FF-C#5"],[86,"FF-D5"],[88,"FF-E5"],[89,"FF-F5"],[91,"FF-G5"],[93,"FF-A5"],[95,"Mf-B5"],[96,"Mf-C6"],[97,"Mf-C#6"],[98,"Mf-D6"],[99,"Mf-D#6"],[100,"Mf-E6"],[102,"Mf-F#6"],[103,"Mf-G6"],[104,"Mf-G#6"],[105,"Mf-A6"],[106,"Mf-A#6"],[107,"Mf-B6"],[108,"Mf-C7"]]}];var cr=Lc(qs(),1),ei=null,un=class{loaded=!1;name="";default_vel=100;load(e,o=null,r=null){}unload(){}play(e,o=this.default_vel){}stop(e){}stopAll(){}},oi=class extends un{player=null;sfCreator=()=>{};instruments={apiano:{loader:Ks,options:{volume:90}},epiano1:{loader:Qr,options:{instrument:"TX81Z",volume:127}},epiano2:{loader:Qr,options:{instrument:"WurlitzerEP200",volume:70}},epiano3:{loader:Qr,options:{instrument:"CP80",volume:70}},harpsi:{loader:Gs,options:{instrument:"Chordophones/Zithers/Harpsichord, Unk",volume:100}},organ1:{loader:Jr,options:{createSoundfont:e=>new cr.SoundFont2(e),url:"assets/sf/organ.sf2",patch:"b3slow",volume:70}},organ2:{loader:Jr,options:{createSoundfont:e=>new cr.SoundFont2(e),url:"assets/sf/organ.sf2",patch:"b3fast",volume:70}},organ3:{loader:Jr,options:{createSoundfont:e=>new cr.SoundFont2(e),url:"assets/sf/organ.sf2",patch:"percorg",volume:60}}};cache=new Hs("sound_v1");play(e,o=this.default_vel){this.name=="epiano1"?e+=12:(this.name=="harpsi"||this.name.startsWith("organ"))&&(o=127),this.player?.start({note:e,velocity:o})}stop(e){this.name=="epiano1"&&(e+=12),this.player?.stop(e)}stopAll(){this.player?.stop()}unload(){this.stopAll(),this.player=null,this.name="",this.loaded=!1}load(e,o=null,r=null){if(this.stopAll(),!e)this.unload(),o("");else{if(!Object.hasOwn(this.instruments,e)){r(`Instrument ${e} not found.`);return}ei||(ei=new AudioContext);let i=this.instruments[e];i.storage=this.cache,this.loaded=!1,this.name=e,this.player=new i.loader(ei,i.options),this.player.load.then(()=>{Object.hasOwn(i.options,"patch")&&this.player.loadInstrument(i.options.patch),this.loaded=!0,ei.resume(),o(e)},n=>{this.player=null,this.name="",r(n)})}}};var ri=t=>{var e;let{activeElement:o}=document;o&&t.contains(o)&&((e=document.activeElement)==null||e.blur())};var ii=globalThis,ni=ii.ShadowRoot&&(ii.ShadyCSS===void 0||ii.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,dn=Symbol(),Ws=new WeakMap,ur=class{constructor(e,o,r){if(this._$cssResult$=!0,r!==dn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=o}get styleSheet(){let e=this.o,o=this.t;if(ni&&e===void 0){let r=o!==void 0&&o.length===1;r&&(e=Ws.get(o)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Ws.set(o,e))}return e}toString(){return this.cssText}},Zs=t=>new ur(typeof t=="string"?t:t+"",void 0,dn),G=(t,...e)=>{let o=t.length===1?t[0]:e.reduce((r,i,n)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new ur(o,t,dn)},hn=(t,e)=>{if(ni)t.adoptedStyleSheets=e.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(let o of e){let r=document.createElement("style"),i=ii.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=o.cssText,t.appendChild(r)}},si=ni?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let o="";for(let r of e.cssRules)o+=r.cssText;return Zs(o)})(t):t;var{is:Vu,defineProperty:Uu,getOwnPropertyDescriptor:Gu,getOwnPropertyNames:ju,getOwnPropertySymbols:Ku,getPrototypeOf:qu}=Object,ai=globalThis,Xs=ai.trustedTypes,Wu=Xs?Xs.emptyScript:"",Zu=ai.reactiveElementPolyfillSupport,dr=(t,e)=>t,qe={toAttribute(t,e){switch(e){case Boolean:t=t?Wu:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=t!==null;break;case Number:o=t===null?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch{o=null}}return o}},li=(t,e)=>!Vu(t,e),Ys={attribute:!0,type:String,converter:qe,reflect:!1,hasChanged:li};Symbol.metadata??=Symbol("metadata"),ai.litPropertyMetadata??=new WeakMap;var Be=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,o=Ys){if(o.state&&(o.attribute=!1),this._$Ei(),this.elementProperties.set(e,o),!o.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(e,r,o);i!==void 0&&Uu(this.prototype,e,i)}}static getPropertyDescriptor(e,o,r){let{get:i,set:n}=Gu(this.prototype,e)??{get(){return this[o]},set(a){this[o]=a}};return{get(){return i?.call(this)},set(a){let s=i?.call(this);n.call(this,a),this.requestUpdate(e,s,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ys}static _$Ei(){if(this.hasOwnProperty(dr("elementProperties")))return;let e=qu(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(dr("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dr("properties"))){let o=this.properties,r=[...ju(o),...Ku(o)];for(let i of r)this.createProperty(i,o[i])}let e=this[Symbol.metadata];if(e!==null){let o=litPropertyMetadata.get(e);if(o!==void 0)for(let[r,i]of o)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[o,r]of this.elementProperties){let i=this._$Eu(o,r);i!==void 0&&this._$Eh.set(i,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let o=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let i of r)o.unshift(si(i))}else e!==void 0&&o.push(si(e));return o}static _$Eu(e,o){let r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,o=this.constructor.elementProperties;for(let r of o.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return hn(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,o,r){this._$AK(e,r)}_$EC(e,o){let r=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,r);if(i!==void 0&&r.reflect===!0){let n=(r.converter?.toAttribute!==void 0?r.converter:qe).toAttribute(o,r.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,o){let r=this.constructor,i=r._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=r.getPropertyOptions(i),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:qe;this._$Em=i,this[i]=a.fromAttribute(o,n.type),this._$Em=null}}requestUpdate(e,o,r){if(e!==void 0){if(r??=this.constructor.getPropertyOptions(e),!(r.hasChanged??li)(this[e],o))return;this.P(e,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,o,r){this._$AL.has(e)||this._$AL.set(e,o),r.reflect===!0&&this._$Em!==e&&(this._$Ej??=new Set).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,n]of r)n.wrapped!==!0||this._$AL.has(i)||this[i]===void 0||this.P(i,this[i],n)}let e=!1,o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(o)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(o)}willUpdate(e){}_$AE(e){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&=this._$Ej.forEach(o=>this._$EC(o,this[o])),this._$EU()}updated(e){}firstUpdated(e){}};Be.elementStyles=[],Be.shadowRootOptions={mode:"open"},Be[dr("elementProperties")]=new Map,Be[dr("finalized")]=new Map,Zu?.({ReactiveElement:Be}),(ai.reactiveElementVersions??=[]).push("2.0.4");var fn=globalThis,ci=fn.trustedTypes,Qs=ci?ci.createPolicy("lit-html",{createHTML:t=>t}):void 0,mn="$lit$",Ne=`lit$${Math.random().toFixed(9).slice(2)}$`,gn="?"+Ne,Xu=`<${gn}>`,ho=document,pr=()=>ho.createComment(""),fr=t=>t===null||typeof t!="object"&&typeof t!="function",bn=Array.isArray,ia=t=>bn(t)||typeof t?.[Symbol.iterator]=="function",pn=`[ 	
\f\r]`,hr=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Js=/-->/g,ta=/>/g,co=RegExp(`>|${pn}(?:([^\\s"'>=/]+)(${pn}*=${pn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ea=/'/g,oa=/"/g,na=/^(?:script|style|textarea|title)$/i,yn=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),I=yn(1),sa=yn(2),aa=yn(3),Kt=Symbol.for("lit-noChange"),_t=Symbol.for("lit-nothing"),ra=new WeakMap,uo=ho.createTreeWalker(ho,129);function la(t,e){if(!bn(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Qs!==void 0?Qs.createHTML(e):e}var ca=(t,e)=>{let o=t.length-1,r=[],i,n=e===2?"<svg>":e===3?"<math>":"",a=hr;for(let s=0;s<o;s++){let l=t[s],u,m,c=-1,f=0;for(;f<l.length&&(a.lastIndex=f,m=a.exec(l),m!==null);)f=a.lastIndex,a===hr?m[1]==="!--"?a=Js:m[1]!==void 0?a=ta:m[2]!==void 0?(na.test(m[2])&&(i=RegExp("</"+m[2],"g")),a=co):m[3]!==void 0&&(a=co):a===co?m[0]===">"?(a=i??hr,c=-1):m[1]===void 0?c=-2:(c=a.lastIndex-m[2].length,u=m[1],a=m[3]===void 0?co:m[3]==='"'?oa:ea):a===oa||a===ea?a=co:a===Js||a===ta?a=hr:(a=co,i=void 0);let h=a===co&&t[s+1].startsWith("/>")?" ":"";n+=a===hr?l+Xu:c>=0?(r.push(u),l.slice(0,c)+mn+l.slice(c)+Ne+h):l+Ne+(c===-2?s:h)}return[la(t,n+(t[o]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},mr=class t{constructor({strings:e,_$litType$:o},r){let i;this.parts=[];let n=0,a=0,s=e.length-1,l=this.parts,[u,m]=ca(e,o);if(this.el=t.createElement(u,r),uo.currentNode=this.el.content,o===2||o===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=uo.nextNode())!==null&&l.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(mn)){let f=m[a++],h=i.getAttribute(c).split(Ne),g=/([.?@])?(.*)/.exec(f);l.push({type:1,index:n,name:g[2],strings:h,ctor:g[1]==="."?di:g[1]==="?"?hi:g[1]==="@"?pi:fo}),i.removeAttribute(c)}else c.startsWith(Ne)&&(l.push({type:6,index:n}),i.removeAttribute(c));if(na.test(i.tagName)){let c=i.textContent.split(Ne),f=c.length-1;if(f>0){i.textContent=ci?ci.emptyScript:"";for(let h=0;h<f;h++)i.append(c[h],pr()),uo.nextNode(),l.push({type:2,index:++n});i.append(c[f],pr())}}}else if(i.nodeType===8)if(i.data===gn)l.push({type:2,index:n});else{let c=-1;for(;(c=i.data.indexOf(Ne,c+1))!==-1;)l.push({type:7,index:n}),c+=Ne.length-1}n++}}static createElement(e,o){let r=ho.createElement("template");return r.innerHTML=e,r}};function po(t,e,o=t,r){if(e===Kt)return e;let i=r!==void 0?o._$Co?.[r]:o._$Cl,n=fr(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(t),i._$AT(t,o,r)),r!==void 0?(o._$Co??=[])[r]=i:o._$Cl=i),i!==void 0&&(e=po(t,i._$AS(t,e.values),i,r)),e}var ui=class{constructor(e,o){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:o},parts:r}=this._$AD,i=(e?.creationScope??ho).importNode(o,!0);uo.currentNode=i;let n=uo.nextNode(),a=0,s=0,l=r[0];for(;l!==void 0;){if(a===l.index){let u;l.type===2?u=new Ho(n,n.nextSibling,this,e):l.type===1?u=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(u=new fi(n,this,e)),this._$AV.push(u),l=r[++s]}a!==l?.index&&(n=uo.nextNode(),a++)}return uo.currentNode=ho,i}p(e){let o=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,o),o+=r.strings.length-2):r._$AI(e[o])),o++}},Ho=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,o,r,i){this.type=2,this._$AH=_t,this._$AN=void 0,this._$AA=e,this._$AB=o,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,o=this._$AM;return o!==void 0&&e?.nodeType===11&&(e=o.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,o=this){e=po(this,e,o),fr(e)?e===_t||e==null||e===""?(this._$AH!==_t&&this._$AR(),this._$AH=_t):e!==this._$AH&&e!==Kt&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ia(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_t&&fr(this._$AH)?this._$AA.nextSibling.data=e:this.T(ho.createTextNode(e)),this._$AH=e}$(e){let{values:o,_$litType$:r}=e,i=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=mr.createElement(la(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(o);else{let n=new ui(i,this),a=n.u(this.options);n.p(o),this.T(a),this._$AH=n}}_$AC(e){let o=ra.get(e.strings);return o===void 0&&ra.set(e.strings,o=new mr(e)),o}k(e){bn(this._$AH)||(this._$AH=[],this._$AR());let o=this._$AH,r,i=0;for(let n of e)i===o.length?o.push(r=new t(this.O(pr()),this.O(pr()),this,this.options)):r=o[i],r._$AI(n),i++;i<o.length&&(this._$AR(r&&r._$AB.nextSibling,i),o.length=i)}_$AR(e=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);e&&e!==this._$AB;){let r=e.nextSibling;e.remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},fo=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,o,r,i,n){this.type=1,this._$AH=_t,this._$AN=void 0,this.element=e,this.name=o,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=_t}_$AI(e,o=this,r,i){let n=this.strings,a=!1;if(n===void 0)e=po(this,e,o,0),a=!fr(e)||e!==this._$AH&&e!==Kt,a&&(this._$AH=e);else{let s=e,l,u;for(e=n[0],l=0;l<n.length-1;l++)u=po(this,s[r+l],o,l),u===Kt&&(u=this._$AH[l]),a||=!fr(u)||u!==this._$AH[l],u===_t?e=_t:e!==_t&&(e+=(u??"")+n[l+1]),this._$AH[l]=u}a&&!i&&this.j(e)}j(e){e===_t?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},di=class extends fo{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_t?void 0:e}},hi=class extends fo{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_t)}},pi=class extends fo{constructor(e,o,r,i,n){super(e,o,r,i,n),this.type=5}_$AI(e,o=this){if((e=po(this,e,o,0)??_t)===Kt)return;let r=this._$AH,i=e===_t&&r!==_t||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,n=e!==_t&&(r===_t||i);i&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},fi=class{constructor(e,o,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){po(this,e)}},ua={M:mn,P:Ne,A:gn,C:1,L:ca,R:ui,D:ia,V:po,I:Ho,H:fo,N:hi,U:pi,B:di,F:fi},Yu=fn.litHtmlPolyfillSupport;Yu?.(mr,Ho),(fn.litHtmlVersions??=[]).push("3.2.1");var da=(t,e,o)=>{let r=o?.renderBefore??e,i=r._$litPart$;if(i===void 0){let n=o?.renderBefore??null;r._$litPart$=i=new Ho(e.insertBefore(pr(),n),n,void 0,o??{})}return i._$AI(t),i};var We=class extends Be{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=da(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Kt}};We._$litElement$=!0,We.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:We});var Qu=globalThis.litElementPolyfillSupport;Qu?.({LitElement:We});(globalThis.litElementVersions??=[]).push("4.1.1");var ha=G`
  :host {
    display: inline-block;
    color: var(--sl-color-neutral-600);
  }

  .icon-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition: var(--sl-transition-x-fast) color;
    -webkit-appearance: none;
  }

  .icon-button:hover:not(.icon-button--disabled),
  .icon-button:focus-visible:not(.icon-button--disabled) {
    color: var(--sl-color-primary-600);
  }

  .icon-button:active:not(.icon-button--disabled) {
    color: var(--sl-color-primary-700);
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .icon-button__icon {
    pointer-events: none;
  }
`;var vn="";function gr(t){vn=t}function _n(t=""){if(!vn){let e=[...document.getElementsByTagName("script")],o=e.find(r=>r.hasAttribute("data-shoelace"));if(o)gr(o.getAttribute("data-shoelace"));else{let r=e.find(n=>/shoelace(\.min)?\.js($|\?)/.test(n.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(n.src)),i="";r&&(i=r.getAttribute("src")),gr(i.split("/").slice(0,-1).join("/"))}}return vn.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var Ju={name:"default",resolver:t=>_n(`assets/icons/${t}.svg`)},pa=Ju;var fa={caret:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,check:`
    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor">
          <g transform="translate(3.428571, 3.428571)">
            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,"chevron-down":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,"chevron-left":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  `,"chevron-right":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,copy:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
    </svg>
  `,eye:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  `,"eye-slash":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
  `,eyedropper:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">
      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>
    </svg>
  `,"grip-vertical":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    </svg>
  `,indeterminate:`
    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor" stroke-width="2">
          <g transform="translate(2.285714, 6.857143)">
            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,"person-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `,"play-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
    </svg>
  `,"pause-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
    </svg>
  `,radio:`
    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="currentColor">
          <circle cx="8" cy="8" r="3.42857143"></circle>
        </g>
      </g>
    </svg>
  `,"star-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  `,"x-lg":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  `,"x-circle-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
    </svg>
  `},td={name:"system",resolver:t=>t in fa?`data:image/svg+xml,${encodeURIComponent(fa[t])}`:""},ma=td;var ed=[pa,ma],wn=[];function ga(t){wn.push(t)}function ba(t){wn=wn.filter(e=>e!==t)}function kn(t){return ed.find(e=>e.name===t)}var ya=G`
  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`;var wa=Object.defineProperty,od=Object.defineProperties,rd=Object.getOwnPropertyDescriptor,id=Object.getOwnPropertyDescriptors,va=Object.getOwnPropertySymbols,nd=Object.prototype.hasOwnProperty,sd=Object.prototype.propertyIsEnumerable,xn=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),Sn=t=>{throw TypeError(t)},_a=(t,e,o)=>e in t?wa(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,de=(t,e)=>{for(var o in e||(e={}))nd.call(e,o)&&_a(t,o,e[o]);if(va)for(var o of va(e))sd.call(e,o)&&_a(t,o,e[o]);return t},Ze=(t,e)=>od(t,id(e)),p=(t,e,o,r)=>{for(var i=r>1?void 0:r?rd(e,o):e,n=t.length-1,a;n>=0;n--)(a=t[n])&&(i=(r?a(e,o,i):a(i))||i);return r&&i&&wa(e,o,i),i},ka=(t,e,o)=>e.has(t)||Sn("Cannot "+o),xa=(t,e,o)=>(ka(t,e,"read from private field"),o?o.call(t):e.get(t)),Sa=(t,e,o)=>e.has(t)?Sn("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),Ea=(t,e,o,r)=>(ka(t,e,"write to private field"),r?r.call(t,o):e.set(t,o),o),ad=function(t,e){this[0]=t,this[1]=e},Ca=t=>{var e=t[xn("asyncIterator")],o=!1,r,i={};return e==null?(e=t[xn("iterator")](),r=n=>i[n]=a=>e[n](a)):(e=e.call(t),r=n=>i[n]=a=>{if(o){if(o=!1,n==="throw")throw a;return a}return o=!0,{done:!1,value:new ad(new Promise(s=>{var l=e[n](a);l instanceof Object||Sn("Object expected"),s(l)}),1)}}),i[xn("iterator")]=()=>i,r("next"),"throw"in e?r("throw"):i.throw=n=>{throw n},"return"in e&&r("return"),i};function ut(t,e){let o=de({waitUntilFirstUpdate:!1},e);return(r,i)=>{let{update:n}=r,a=Array.isArray(t)?t:[t];r.update=function(s){a.forEach(l=>{let u=l;if(s.has(u)){let m=s.get(u),c=this[u];m!==c&&(!o.waitUntilFirstUpdate||this.hasUpdated)&&this[i](m,c)}}),n.call(this,s)}}}var J=G`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`;var ld={attribute:!0,type:String,converter:qe,reflect:!1,hasChanged:li},cd=(t=ld,e,o)=>{let{kind:r,metadata:i}=o,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(o.name,t),r==="accessor"){let{name:a}=o;return{set(s){let l=e.get.call(this);e.set.call(this,s),this.requestUpdate(a,l,t)},init(s){return s!==void 0&&this.P(a,void 0,t),s}}}if(r==="setter"){let{name:a}=o;return function(s){let l=this[a];e.call(this,s),this.requestUpdate(a,l,t)}}throw Error("Unsupported decorator location: "+r)};function y(t){return(e,o)=>typeof o=="object"?cd(t,e,o):((r,i,n)=>{let a=i.hasOwnProperty(n);return i.constructor.createProperty(n,a?{...r,wrapped:!0}:r),a?Object.getOwnPropertyDescriptor(i,n):void 0})(t,e,o)}function Pt(t){return y({...t,state:!0,attribute:!1})}function Aa(t){return(e,o)=>{let r=typeof e=="function"?e:e[o];Object.assign(r,t)}}var mo=(t,e,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,o),o);function K(t,e){return(o,r,i)=>{let n=a=>a.renderRoot?.querySelector(t)??null;if(e){let{get:a,set:s}=typeof r=="object"?o:i??(()=>{let l=Symbol();return{get(){return this[l]},set(u){this[l]=u}}})();return mo(o,r,{get(){let l=a.call(this);return l===void 0&&(l=n(this),(l!==null||this.hasUpdated)&&s.call(this,l)),l}})}return mo(o,r,{get(){return n(this)}})}}var mi,q=class extends We{constructor(){super(),Sa(this,mi,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){let o=new CustomEvent(t,de({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(o),o}static define(t,e=this,o={}){let r=customElements.get(t);if(!r){try{customElements.define(t,e,o)}catch{customElements.define(t,class extends e{},o)}return}let i=" (unknown version)",n=i;"version"in e&&e.version&&(i=" v"+e.version),"version"in r&&r.version&&(n=" v"+r.version)}attributeChangedCallback(t,e,o){xa(this,mi)||(this.constructor.elementProperties.forEach((r,i)=>{r.reflect&&this[i]!=null&&this.initialReflectedProperties.set(i,this[i])}),Ea(this,mi,!0)),super.attributeChangedCallback(t,e,o)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,o)=>{t.has(o)&&this[o]==null&&(this[o]=e)})}};mi=new WeakMap;q.version="2.20.1";q.dependencies={};p([y()],q.prototype,"dir",2);p([y()],q.prototype,"lang",2);var{I:cf}=ua;var Pa=(t,e)=>e===void 0?t?._$litType$!==void 0:t?._$litType$===e;var gi=t=>t.strings===void 0;var ud={},Ma=(t,e=ud)=>t._$AH=e;var br=Symbol(),bi=Symbol(),En,Cn=new Map,Mt=class extends q{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var o;let r;if(e?.spriteSheet)return this.svg=I`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(r=await fetch(t,{mode:"cors"}),!r.ok)return r.status===410?br:bi}catch{return bi}try{let i=document.createElement("div");i.innerHTML=await r.text();let n=i.firstElementChild;if(((o=n?.tagName)==null?void 0:o.toLowerCase())!=="svg")return br;En||(En=new DOMParser);let s=En.parseFromString(n.outerHTML,"text/html").body.querySelector("svg");return s?(s.part.add("svg"),document.adoptNode(s)):br}catch{return br}}connectedCallback(){super.connectedCallback(),ga(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),ba(this)}getIconSource(){let t=kn(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;let{url:e,fromLibrary:o}=this.getIconSource(),r=o?kn(this.library):void 0;if(!e){this.svg=null;return}let i=Cn.get(e);if(i||(i=this.resolveIcon(e,r),Cn.set(e,i)),!this.initialRender)return;let n=await i;if(n===bi&&Cn.delete(e),e===this.getIconSource().url){if(Pa(n)){if(this.svg=n,r){await this.updateComplete;let a=this.shadowRoot.querySelector("[part='svg']");typeof r.mutator=="function"&&a&&r.mutator(a)}return}switch(n){case bi:case br:this.svg=null,this.emit("sl-error");break;default:this.svg=n.cloneNode(!0),(t=r?.mutator)==null||t.call(r,this.svg),this.emit("sl-load")}}}render(){return this.svg}};Mt.styles=[J,ya];p([Pt()],Mt.prototype,"svg",2);p([y({reflect:!0})],Mt.prototype,"name",2);p([y()],Mt.prototype,"src",2);p([y()],Mt.prototype,"label",2);p([y({reflect:!0})],Mt.prototype,"library",2);p([ut("label")],Mt.prototype,"handleLabelChange",1);p([ut(["name","src","library"])],Mt.prototype,"setIcon",1);var he={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ze=t=>(...e)=>({_$litDirective$:t,values:e}),Le=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,o,r){this._$Ct=e,this._$AM=o,this._$Ci=r}_$AS(e,o){return this.update(e,o)}update(e,o){return this.render(...o)}};var bt=ze(class extends Le{constructor(t){if(super(t),t.type!==he.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(r=>r!=="")));for(let r in e)e[r]&&!this.nt?.has(r)&&this.st.add(r);return this.render(e)}let o=t.element.classList;for(let r of this.st)r in e||(o.remove(r),this.st.delete(r));for(let r in e){let i=!!e[r];i===this.st.has(r)||this.nt?.has(r)||(i?(o.add(r),this.st.add(r)):(o.remove(r),this.st.delete(r)))}return Kt}});var $a=Symbol.for(""),dd=t=>{if(t?.r===$a)return t?._$litStatic$};var Vo=(t,...e)=>({_$litStatic$:e.reduce((o,r,i)=>o+(n=>{if(n._$litStatic$!==void 0)return n._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${n}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(r)+t[i+1],t[0]),r:$a}),Ta=new Map,An=t=>(e,...o)=>{let r=o.length,i,n,a=[],s=[],l,u=0,m=!1;for(;u<r;){for(l=e[u];u<r&&(n=o[u],(i=dd(n))!==void 0);)l+=i+e[++u],m=!0;u!==r&&s.push(n),a.push(l),u++}if(u===r&&a.push(e[r]),m){let c=a.join("$$lit$$");(e=Ta.get(c))===void 0&&(a.raw=a,Ta.set(c,e=a)),o=s}return t(e,...o)},Uo=An(I),Lf=An(sa),If=An(aa);var B=t=>t??_t;var qt=class extends q{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}render(){let t=!!this.href,e=t?Vo`a`:Vo`button`;return Uo`
      <${e}
        part="base"
        class=${bt({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${B(t?void 0:this.disabled)}
        type=${B(t?void 0:"button")}
        href=${B(t?this.href:void 0)}
        target=${B(t?this.target:void 0)}
        download=${B(t?this.download:void 0)}
        rel=${B(t&&this.target?"noreferrer noopener":void 0)}
        role=${B(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${B(this.name)}
          library=${B(this.library)}
          src=${B(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${e}>
    `}};qt.styles=[J,ha];qt.dependencies={"sl-icon":Mt};p([K(".icon-button")],qt.prototype,"button",2);p([Pt()],qt.prototype,"hasFocus",2);p([y()],qt.prototype,"name",2);p([y()],qt.prototype,"library",2);p([y()],qt.prototype,"src",2);p([y()],qt.prototype,"href",2);p([y()],qt.prototype,"target",2);p([y()],qt.prototype,"download",2);p([y()],qt.prototype,"label",2);p([y({type:Boolean,reflect:!0})],qt.prototype,"disabled",2);var Ia=new Map,hd=new WeakMap;function pd(t){return t??{keyframes:[],options:{duration:0}}}function La(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function Yt(t,e){Ia.set(t,pd(e))}function Qt(t,e,o){let r=hd.get(t);if(r?.[e])return La(r[e],o.dir);let i=Ia.get(e);return i?La(i,o.dir):{keyframes:[],options:{duration:0}}}function ye(t,e){return new Promise(o=>{function r(i){i.target===t&&(t.removeEventListener(e,r),o())}t.addEventListener(e,r)})}function Jt(t,e,o){return new Promise(r=>{if(o?.duration===1/0)throw new Error("Promise-based animations must be finite.");let i=t.animate(e,Ze(de({},o),{duration:fd()?0:o.duration}));i.addEventListener("cancel",r,{once:!0}),i.addEventListener("finish",r,{once:!0})})}function Pn(t){return t=t.toString().toLowerCase(),t.indexOf("ms")>-1?parseFloat(t):t.indexOf("s")>-1?parseFloat(t)*1e3:parseFloat(t)}function fd(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function ee(t){return Promise.all(t.getAnimations().map(e=>new Promise(o=>{e.cancel(),requestAnimationFrame(o)})))}var Ie=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=o=>{let r=o.target;(this.slotNames.includes("[default]")&&!r.name||r.name&&this.slotNames.includes(r.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){let e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};function Da(t){if(!t)return"";let e=t.assignedNodes({flatten:!0}),o="";return[...e].forEach(r=>{r.nodeType===Node.TEXT_NODE&&(o+=r.textContent)}),o}var Mn=new Set,Go=new Map,go,Tn="ltr",$n="en",Oa=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Oa){let t=new MutationObserver(Ra);Tn=document.documentElement.dir||"ltr",$n=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function yr(...t){t.map(e=>{let o=e.$code.toLowerCase();Go.has(o)?Go.set(o,Object.assign(Object.assign({},Go.get(o)),e)):Go.set(o,e),go||(go=e)}),Ra()}function Ra(){Oa&&(Tn=document.documentElement.dir||"ltr",$n=document.documentElement.lang||navigator.language),[...Mn.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}var yi=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){Mn.add(this.host)}hostDisconnected(){Mn.delete(this.host)}dir(){return`${this.host.dir||Tn}`.toLowerCase()}lang(){return`${this.host.lang||$n}`.toLowerCase()}getTranslationData(e){var o,r;let i=new Intl.Locale(e.replace(/_/g,"-")),n=i?.language.toLowerCase(),a=(r=(o=i?.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&r!==void 0?r:"",s=Go.get(`${n}-${a}`),l=Go.get(n);return{locale:i,language:n,region:a,primary:s,secondary:l}}exists(e,o){var r;let{primary:i,secondary:n}=this.getTranslationData((r=o.lang)!==null&&r!==void 0?r:this.lang());return o=Object.assign({includeFallback:!1},o),!!(i&&i[e]||n&&n[e]||o.includeFallback&&go&&go[e])}term(e,...o){let{primary:r,secondary:i}=this.getTranslationData(this.lang()),n;if(r&&r[e])n=r[e];else if(i&&i[e])n=i[e];else if(go&&go[e])n=go[e];else return String(e);return typeof n=="function"?n(...o):n}date(e,o){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),o).format(e)}number(e,o){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),o).format(e)}relativeTime(e,o,r){return new Intl.RelativeTimeFormat(this.lang(),r).format(e,o)}};var Fa={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};yr(Fa);var Ba=Fa;var Tt=class extends yi{};yr(Ba);var Na=G`
  :host {
    display: contents;

    /* For better DX, we'll reset the margin here so the base part can inherit it */
    margin: 0;
  }

  .alert {
    position: relative;
    display: flex;
    align-items: stretch;
    background-color: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-top-width: calc(var(--sl-panel-border-width) * 3);
    border-radius: var(--sl-border-radius-medium);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-normal);
    line-height: 1.6;
    color: var(--sl-color-neutral-700);
    margin: inherit;
    overflow: hidden;
  }

  .alert:not(.alert--has-icon) .alert__icon,
  .alert:not(.alert--closable) .alert__close-button {
    display: none;
  }

  .alert__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-large);
    padding-inline-start: var(--sl-spacing-large);
  }

  .alert--has-countdown {
    border-bottom: none;
  }

  .alert--primary {
    border-top-color: var(--sl-color-primary-600);
  }

  .alert--primary .alert__icon {
    color: var(--sl-color-primary-600);
  }

  .alert--success {
    border-top-color: var(--sl-color-success-600);
  }

  .alert--success .alert__icon {
    color: var(--sl-color-success-600);
  }

  .alert--neutral {
    border-top-color: var(--sl-color-neutral-600);
  }

  .alert--neutral .alert__icon {
    color: var(--sl-color-neutral-600);
  }

  .alert--warning {
    border-top-color: var(--sl-color-warning-600);
  }

  .alert--warning .alert__icon {
    color: var(--sl-color-warning-600);
  }

  .alert--danger {
    border-top-color: var(--sl-color-danger-600);
  }

  .alert--danger .alert__icon {
    color: var(--sl-color-danger-600);
  }

  .alert__message {
    flex: 1 1 auto;
    display: block;
    padding: var(--sl-spacing-large);
    overflow: hidden;
  }

  .alert__close-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-medium);
    margin-inline-end: var(--sl-spacing-medium);
    align-self: center;
  }

  .alert__countdown {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(var(--sl-panel-border-width) * 3);
    background-color: var(--sl-panel-border-color);
    display: flex;
  }

  .alert__countdown--ltr {
    justify-content: flex-end;
  }

  .alert__countdown .alert__countdown-elapsed {
    height: 100%;
    width: 0;
  }

  .alert--primary .alert__countdown-elapsed {
    background-color: var(--sl-color-primary-600);
  }

  .alert--success .alert__countdown-elapsed {
    background-color: var(--sl-color-success-600);
  }

  .alert--neutral .alert__countdown-elapsed {
    background-color: var(--sl-color-neutral-600);
  }

  .alert--warning .alert__countdown-elapsed {
    background-color: var(--sl-color-warning-600);
  }

  .alert--danger .alert__countdown-elapsed {
    background-color: var(--sl-color-danger-600);
  }

  .alert__timer {
    display: none;
  }
`;var pe=class bo extends q{constructor(){super(...arguments),this.hasSlotController=new Ie(this,"icon","suffix"),this.localize=new Tt(this),this.open=!1,this.closable=!1,this.variant="primary",this.duration=1/0,this.remainingTime=this.duration}static get toastStack(){return this.currentToastStack||(this.currentToastStack=Object.assign(document.createElement("div"),{className:"sl-toast-stack"})),this.currentToastStack}firstUpdated(){this.base.hidden=!this.open}restartAutoHide(){this.handleCountdownChange(),clearTimeout(this.autoHideTimeout),clearInterval(this.remainingTimeInterval),this.open&&this.duration<1/0&&(this.autoHideTimeout=window.setTimeout(()=>this.hide(),this.duration),this.remainingTime=this.duration,this.remainingTimeInterval=window.setInterval(()=>{this.remainingTime-=100},100))}pauseAutoHide(){var e;(e=this.countdownAnimation)==null||e.pause(),clearTimeout(this.autoHideTimeout),clearInterval(this.remainingTimeInterval)}resumeAutoHide(){var e;this.duration<1/0&&(this.autoHideTimeout=window.setTimeout(()=>this.hide(),this.remainingTime),this.remainingTimeInterval=window.setInterval(()=>{this.remainingTime-=100},100),(e=this.countdownAnimation)==null||e.play())}handleCountdownChange(){if(this.open&&this.duration<1/0&&this.countdown){let{countdownElement:e}=this,o="100%",r="0";this.countdownAnimation=e.animate([{width:o},{width:r}],{duration:this.duration,easing:"linear"})}}handleCloseClick(){this.hide()}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.duration<1/0&&this.restartAutoHide(),await ee(this.base),this.base.hidden=!1;let{keyframes:e,options:o}=Qt(this,"alert.show",{dir:this.localize.dir()});await Jt(this.base,e,o),this.emit("sl-after-show")}else{ri(this),this.emit("sl-hide"),clearTimeout(this.autoHideTimeout),clearInterval(this.remainingTimeInterval),await ee(this.base);let{keyframes:e,options:o}=Qt(this,"alert.hide",{dir:this.localize.dir()});await Jt(this.base,e,o),this.base.hidden=!0,this.emit("sl-after-hide")}}handleDurationChange(){this.restartAutoHide()}async show(){if(!this.open)return this.open=!0,ye(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ye(this,"sl-after-hide")}async toast(){return new Promise(e=>{this.handleCountdownChange(),bo.toastStack.parentElement===null&&document.body.append(bo.toastStack),bo.toastStack.appendChild(this),requestAnimationFrame(()=>{this.clientWidth,this.show()}),this.addEventListener("sl-after-hide",()=>{bo.toastStack.removeChild(this),e(),bo.toastStack.querySelector("sl-alert")===null&&bo.toastStack.remove()},{once:!0})})}render(){return I`
      <div
        part="base"
        class=${bt({alert:!0,"alert--open":this.open,"alert--closable":this.closable,"alert--has-countdown":!!this.countdown,"alert--has-icon":this.hasSlotController.test("icon"),"alert--primary":this.variant==="primary","alert--success":this.variant==="success","alert--neutral":this.variant==="neutral","alert--warning":this.variant==="warning","alert--danger":this.variant==="danger"})}
        role="alert"
        aria-hidden=${this.open?"false":"true"}
        @mouseenter=${this.pauseAutoHide}
        @mouseleave=${this.resumeAutoHide}
      >
        <div part="icon" class="alert__icon">
          <slot name="icon"></slot>
        </div>

        <div part="message" class="alert__message" aria-live="polite">
          <slot></slot>
        </div>

        ${this.closable?I`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                class="alert__close-button"
                name="x-lg"
                library="system"
                label=${this.localize.term("close")}
                @click=${this.handleCloseClick}
              ></sl-icon-button>
            `:""}

        <div role="timer" class="alert__timer">${this.remainingTime}</div>

        ${this.countdown?I`
              <div
                class=${bt({alert__countdown:!0,"alert__countdown--ltr":this.countdown==="ltr"})}
              >
                <div class="alert__countdown-elapsed"></div>
              </div>
            `:""}
      </div>
    `}};pe.styles=[J,Na];pe.dependencies={"sl-icon-button":qt};p([K('[part~="base"]')],pe.prototype,"base",2);p([K(".alert__countdown-elapsed")],pe.prototype,"countdownElement",2);p([y({type:Boolean,reflect:!0})],pe.prototype,"open",2);p([y({type:Boolean,reflect:!0})],pe.prototype,"closable",2);p([y({reflect:!0})],pe.prototype,"variant",2);p([y({type:Number})],pe.prototype,"duration",2);p([y({type:String,reflect:!0})],pe.prototype,"countdown",2);p([Pt()],pe.prototype,"remainingTime",2);p([ut("open",{waitUntilFirstUpdate:!0})],pe.prototype,"handleOpenChange",1);p([ut("duration")],pe.prototype,"handleDurationChange",1);var za=pe;Yt("alert.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:"ease"}});Yt("alert.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:"ease"}});za.define("sl-alert");var Ha=G`
  :host {
    display: inline-flex;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: max(12px, 0.75em);
    font-weight: var(--sl-font-weight-semibold);
    letter-spacing: var(--sl-letter-spacing-normal);
    line-height: 1;
    border-radius: var(--sl-border-radius-small);
    border: solid 1px var(--sl-color-neutral-0);
    white-space: nowrap;
    padding: 0.35em 0.6em;
    user-select: none;
    -webkit-user-select: none;
    cursor: inherit;
  }

  /* Variant modifiers */
  .badge--primary {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--success {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--neutral {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--warning {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--danger {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  /* Pill modifier */
  .badge--pill {
    border-radius: var(--sl-border-radius-pill);
  }

  /* Pulse modifier */
  .badge--pulse {
    animation: pulse 1.5s infinite;
  }

  .badge--pulse.badge--primary {
    --pulse-color: var(--sl-color-primary-600);
  }

  .badge--pulse.badge--success {
    --pulse-color: var(--sl-color-success-600);
  }

  .badge--pulse.badge--neutral {
    --pulse-color: var(--sl-color-neutral-600);
  }

  .badge--pulse.badge--warning {
    --pulse-color: var(--sl-color-warning-600);
  }

  .badge--pulse.badge--danger {
    --pulse-color: var(--sl-color-danger-600);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--pulse-color);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }
`;var jo=class extends q{constructor(){super(...arguments),this.variant="primary",this.pill=!1,this.pulse=!1}render(){return I`
      <span
        part="base"
        class=${bt({badge:!0,"badge--primary":this.variant==="primary","badge--success":this.variant==="success","badge--neutral":this.variant==="neutral","badge--warning":this.variant==="warning","badge--danger":this.variant==="danger","badge--pill":this.pill,"badge--pulse":this.pulse})}
        role="status"
      >
        <slot></slot>
      </span>
    `}};jo.styles=[J,Ha];p([y({reflect:!0})],jo.prototype,"variant",2);p([y({type:Boolean,reflect:!0})],jo.prototype,"pill",2);p([y({type:Boolean,reflect:!0})],jo.prototype,"pulse",2);jo.define("sl-badge");var Va=G`
  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
`;var yo=class extends q{constructor(){super(...arguments),this.localize=new Tt(this),this.separatorDir=this.localize.dir(),this.label=""}getSeparator(){let e=this.separatorSlot.assignedElements({flatten:!0})[0].cloneNode(!0);return[e,...e.querySelectorAll("[id]")].forEach(o=>o.removeAttribute("id")),e.setAttribute("data-default",""),e.slot="separator",e}handleSlotChange(){let t=[...this.defaultSlot.assignedElements({flatten:!0})].filter(e=>e.tagName.toLowerCase()==="sl-breadcrumb-item");t.forEach((e,o)=>{let r=e.querySelector('[slot="separator"]');r===null?e.append(this.getSeparator()):r.hasAttribute("data-default")&&r.replaceWith(this.getSeparator()),o===t.length-1?e.setAttribute("aria-current","page"):e.removeAttribute("aria-current")})}render(){return this.separatorDir!==this.localize.dir()&&(this.separatorDir=this.localize.dir(),this.updateComplete.then(()=>this.handleSlotChange())),I`
      <nav part="base" class="breadcrumb" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </nav>

      <span hidden aria-hidden="true">
        <slot name="separator">
          <sl-icon name=${this.localize.dir()==="rtl"?"chevron-left":"chevron-right"} library="system"></sl-icon>
        </slot>
      </span>
    `}};yo.styles=[J,Va];yo.dependencies={"sl-icon":Mt};p([K("slot")],yo.prototype,"defaultSlot",2);p([K('slot[name="separator"]')],yo.prototype,"separatorSlot",2);p([y()],yo.prototype,"label",2);yo.define("sl-breadcrumb");var Ua=G`
  :host {
    --track-width: 2px;
    --track-color: rgb(128 128 128 / 25%);
    --indicator-color: var(--sl-color-primary-600);
    --speed: 2s;

    display: inline-flex;
    width: 1em;
    height: 1em;
    flex: none;
  }

  .spinner {
    flex: 1 1 auto;
    height: 100%;
    width: 100%;
  }

  .spinner__track,
  .spinner__indicator {
    fill: none;
    stroke-width: var(--track-width);
    r: calc(0.5em - var(--track-width) / 2);
    cx: 0.5em;
    cy: 0.5em;
    transform-origin: 50% 50%;
  }

  .spinner__track {
    stroke: var(--track-color);
    transform-origin: 0% 0%;
  }

  .spinner__indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: 150% 75%;
    animation: spin var(--speed) linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      stroke-dasharray: 0.05em, 3em;
    }

    50% {
      transform: rotate(450deg);
      stroke-dasharray: 1.375em, 1.375em;
    }

    100% {
      transform: rotate(1080deg);
      stroke-dasharray: 0.05em, 3em;
    }
  }
`;var vr=class extends q{constructor(){super(...arguments),this.localize=new Tt(this)}render(){return I`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};vr.styles=[J,Ua];var _r=new WeakMap,wr=new WeakMap,kr=new WeakMap,Ln=new WeakSet,vi=new WeakMap,Ko=class{constructor(t,e){this.handleFormData=o=>{let r=this.options.disabled(this.host),i=this.options.name(this.host),n=this.options.value(this.host),a=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!r&&!a&&typeof i=="string"&&i.length>0&&typeof n<"u"&&(Array.isArray(n)?n.forEach(s=>{o.formData.append(i,s.toString())}):o.formData.append(i,n.toString()))},this.handleFormSubmit=o=>{var r;let i=this.options.disabled(this.host),n=this.options.reportValidity;this.form&&!this.form.noValidate&&((r=_r.get(this.form))==null||r.forEach(a=>{this.setUserInteracted(a,!0)})),this.form&&!this.form.noValidate&&!i&&!n(this.host)&&(o.preventDefault(),o.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),vi.set(this.host,[])},this.handleInteraction=o=>{let r=vi.get(this.host);r.includes(o.type)||r.push(o.type),r.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let r of o)if(typeof r.checkValidity=="function"&&!r.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let r of o)if(typeof r.reportValidity=="function"&&!r.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=de({form:o=>{let r=o.form;if(r){let n=o.getRootNode().querySelector(`#${r}`);if(n)return n}return o.closest("form")},name:o=>o.name,value:o=>o.value,defaultValue:o=>o.defaultValue,disabled:o=>{var r;return(r=o.disabled)!=null?r:!1},reportValidity:o=>typeof o.reportValidity=="function"?o.reportValidity():!0,checkValidity:o=>typeof o.checkValidity=="function"?o.checkValidity():!0,setValue:(o,r)=>o.value=r,assumeInteractionOn:["sl-input"]},e)}hostConnected(){let t=this.options.form(this.host);t&&this.attachForm(t),vi.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),vi.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){let t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,_r.has(this.form)?_r.get(this.form).add(this.host):_r.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),wr.has(this.form)||(wr.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),kr.has(this.form)||(kr.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;let t=_r.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),wr.has(this.form)&&(this.form.reportValidity=wr.get(this.form),wr.delete(this.form)),kr.has(this.form)&&(this.form.checkValidity=kr.get(this.form),kr.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?Ln.add(t):Ln.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){let o=document.createElement("button");o.type=t,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",e&&(o.name=e.name,o.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(r=>{e.hasAttribute(r)&&o.setAttribute(r,e.getAttribute(r))})),this.form.append(o),o.click(),o.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){let e=this.host,o=!!Ln.has(e),r=!!e.required;e.toggleAttribute("data-required",r),e.toggleAttribute("data-optional",!r),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&o),e.toggleAttribute("data-user-valid",t&&o)}updateValidity(){let t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){let e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t?.preventDefault()}},_i=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1}),db=Object.freeze(Ze(de({},_i),{valid:!1,valueMissing:!0})),hb=Object.freeze(Ze(de({},_i),{valid:!1,customError:!0}));var Ga=G`
  :host {
    display: inline-block;
    position: relative;
    width: auto;
    cursor: pointer;
  }

  .button {
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    border-style: solid;
    border-width: var(--sl-input-border-width);
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-font-weight-semibold);
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    padding: 0;
    transition:
      var(--sl-transition-x-fast) background-color,
      var(--sl-transition-x-fast) color,
      var(--sl-transition-x-fast) border,
      var(--sl-transition-x-fast) box-shadow;
    cursor: inherit;
  }

  .button::-moz-focus-inner {
    border: 0;
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* When disabled, prevent mouse events from bubbling up from children */
  .button--disabled * {
    pointer-events: none;
  }

  .button__prefix,
  .button__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .button__label {
    display: inline-block;
  }

  .button__label::slotted(sl-icon) {
    vertical-align: -2px;
  }

  /*
   * Standard buttons
   */

  /* Default */
  .button--standard.button--default {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-input-border-color);
    color: var(--sl-color-neutral-700);
  }

  .button--standard.button--default:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-300);
    color: var(--sl-color-primary-700);
  }

  .button--standard.button--default:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-100);
    border-color: var(--sl-color-primary-400);
    color: var(--sl-color-primary-700);
  }

  /* Primary */
  .button--standard.button--primary {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--standard.button--success {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:hover:not(.button--disabled) {
    background-color: var(--sl-color-success-500);
    border-color: var(--sl-color-success-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:active:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--standard.button--neutral {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:hover:not(.button--disabled) {
    background-color: var(--sl-color-neutral-500);
    border-color: var(--sl-color-neutral-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:active:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--standard.button--warning {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }
  .button--standard.button--warning:hover:not(.button--disabled) {
    background-color: var(--sl-color-warning-500);
    border-color: var(--sl-color-warning-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--warning:active:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--standard.button--danger {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:hover:not(.button--disabled) {
    background-color: var(--sl-color-danger-500);
    border-color: var(--sl-color-danger-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:active:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  /*
   * Outline buttons
   */

  .button--outline {
    background: none;
    border: solid 1px;
  }

  /* Default */
  .button--outline.button--default {
    border-color: var(--sl-input-border-color);
    color: var(--sl-color-neutral-700);
  }

  .button--outline.button--default:hover:not(.button--disabled),
  .button--outline.button--default.button--checked:not(.button--disabled) {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--default:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Primary */
  .button--outline.button--primary {
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-primary-600);
  }

  .button--outline.button--primary:hover:not(.button--disabled),
  .button--outline.button--primary.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--primary:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--outline.button--success {
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-success-600);
  }

  .button--outline.button--success:hover:not(.button--disabled),
  .button--outline.button--success.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--success:active:not(.button--disabled) {
    border-color: var(--sl-color-success-700);
    background-color: var(--sl-color-success-700);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--outline.button--neutral {
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-600);
  }

  .button--outline.button--neutral:hover:not(.button--disabled),
  .button--outline.button--neutral.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--neutral:active:not(.button--disabled) {
    border-color: var(--sl-color-neutral-700);
    background-color: var(--sl-color-neutral-700);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--outline.button--warning {
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-warning-600);
  }

  .button--outline.button--warning:hover:not(.button--disabled),
  .button--outline.button--warning.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--warning:active:not(.button--disabled) {
    border-color: var(--sl-color-warning-700);
    background-color: var(--sl-color-warning-700);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--outline.button--danger {
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-danger-600);
  }

  .button--outline.button--danger:hover:not(.button--disabled),
  .button--outline.button--danger.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--danger:active:not(.button--disabled) {
    border-color: var(--sl-color-danger-700);
    background-color: var(--sl-color-danger-700);
    color: var(--sl-color-neutral-0);
  }

  @media (forced-colors: active) {
    .button.button--outline.button--checked:not(.button--disabled) {
      outline: solid 2px transparent;
    }
  }

  /*
   * Text buttons
   */

  .button--text {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-600);
  }

  .button--text:hover:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:focus-visible:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:active:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-700);
  }

  /*
   * Size modifiers
   */

  .button--small {
    height: auto;
    min-height: var(--sl-input-height-small);
    font-size: var(--sl-button-font-size-small);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
  }

  .button--medium {
    height: auto;
    min-height: var(--sl-input-height-medium);
    font-size: var(--sl-button-font-size-medium);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
  }

  .button--large {
    height: auto;
    min-height: var(--sl-input-height-large);
    font-size: var(--sl-button-font-size-large);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
  }

  /*
   * Pill modifier
   */

  .button--pill.button--small {
    border-radius: var(--sl-input-height-small);
  }

  .button--pill.button--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .button--pill.button--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Circle modifier
   */

  .button--circle {
    padding-left: 0;
    padding-right: 0;
  }

  .button--circle.button--small {
    width: var(--sl-input-height-small);
    border-radius: 50%;
  }

  .button--circle.button--medium {
    width: var(--sl-input-height-medium);
    border-radius: 50%;
  }

  .button--circle.button--large {
    width: var(--sl-input-height-large);
    border-radius: 50%;
  }

  .button--circle .button__prefix,
  .button--circle .button__suffix,
  .button--circle .button__caret {
    display: none;
  }

  /*
   * Caret modifier
   */

  .button--caret .button__suffix {
    display: none;
  }

  .button--caret .button__caret {
    height: auto;
  }

  /*
   * Loading modifier
   */

  .button--loading {
    position: relative;
    cursor: wait;
  }

  .button--loading .button__prefix,
  .button--loading .button__label,
  .button--loading .button__suffix,
  .button--loading .button__caret {
    visibility: hidden;
  }

  .button--loading sl-spinner {
    --indicator-color: currentColor;
    position: absolute;
    font-size: 1em;
    height: 1em;
    width: 1em;
    top: calc(50% - 0.5em);
    left: calc(50% - 0.5em);
  }

  /*
   * Badges
   */

  .button ::slotted(sl-badge) {
    position: absolute;
    top: 0;
    right: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  .button--rtl ::slotted(sl-badge) {
    right: auto;
    left: 0;
    translate: -50% -50%;
  }

  /*
   * Button spacing
   */

  .button--has-label.button--small .button__label {
    padding: 0 var(--sl-spacing-small);
  }

  .button--has-label.button--medium .button__label {
    padding: 0 var(--sl-spacing-medium);
  }

  .button--has-label.button--large .button__label {
    padding: 0 var(--sl-spacing-large);
  }

  .button--has-prefix.button--small {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--small .button__label {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--medium {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--medium .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-suffix.button--small,
  .button--caret.button--small {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--small .button__label,
  .button--caret.button--small .button__label {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--medium,
  .button--caret.button--medium {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--medium .button__label,
  .button--caret.button--medium .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large,
  .button--caret.button--large {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large .button__label,
  .button--caret.button--large .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  /*
   * Button groups support a variety of button types (e.g. buttons with tooltips, buttons as dropdown triggers, etc.).
   * This means buttons aren't always direct descendants of the button group, thus we can't target them with the
   * ::slotted selector. To work around this, the button group component does some magic to add these special classes to
   * buttons and we style them here instead.
   */

  :host([data-sl-button-group__button--first]:not([data-sl-button-group__button--last])) .button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-sl-button-group__button--inner]) .button {
    border-radius: 0;
  }

  :host([data-sl-button-group__button--last]:not([data-sl-button-group__button--first])) .button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host([data-sl-button-group__button]:not([data-sl-button-group__button--first])) {
    margin-inline-start: calc(-1 * var(--sl-input-border-width));
  }

  /* Add a visual separator between solid buttons */
  :host(
      [data-sl-button-group__button]:not(
          [data-sl-button-group__button--first],
          [data-sl-button-group__button--radio],
          [variant='default']
        ):not(:hover)
    )
    .button:after {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    border-left: solid 1px rgb(128 128 128 / 33%);
    mix-blend-mode: multiply;
  }

  /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
  :host([data-sl-button-group__button--hover]) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host([data-sl-button-group__button--focus]),
  :host([data-sl-button-group__button][checked]) {
    z-index: 2;
  }
`;var at=class extends q{constructor(){super(...arguments),this.formControlController=new Ko(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new Ie(this,"[default]","prefix","suffix"),this.localize=new Tt(this),this.hasFocus=!1,this.invalid=!1,this.title="",this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get validity(){return this.isButton()?this.button.validity:_i}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(){this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(t){this.isButton()&&(this.button.setCustomValidity(t),this.formControlController.updateValidity())}render(){let t=this.isLink(),e=t?Vo`a`:Vo`button`;return Uo`
      <${e}
        part="base"
        class=${bt({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${B(t?void 0:this.disabled)}
        type=${B(t?void 0:this.type)}
        title=${this.title}
        name=${B(t?void 0:this.name)}
        value=${B(t?void 0:this.value)}
        href=${B(t&&!this.disabled?this.href:void 0)}
        target=${B(t?this.target:void 0)}
        download=${B(t?this.download:void 0)}
        rel=${B(t?this.rel:void 0)}
        role=${B(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton()?this.handleInvalid:null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret?Uo` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?Uo`<sl-spinner part="spinner"></sl-spinner>`:""}
      </${e}>
    `}};at.styles=[J,Ga];at.dependencies={"sl-icon":Mt,"sl-spinner":vr};p([K(".button")],at.prototype,"button",2);p([Pt()],at.prototype,"hasFocus",2);p([Pt()],at.prototype,"invalid",2);p([y()],at.prototype,"title",2);p([y({reflect:!0})],at.prototype,"variant",2);p([y({reflect:!0})],at.prototype,"size",2);p([y({type:Boolean,reflect:!0})],at.prototype,"caret",2);p([y({type:Boolean,reflect:!0})],at.prototype,"disabled",2);p([y({type:Boolean,reflect:!0})],at.prototype,"loading",2);p([y({type:Boolean,reflect:!0})],at.prototype,"outline",2);p([y({type:Boolean,reflect:!0})],at.prototype,"pill",2);p([y({type:Boolean,reflect:!0})],at.prototype,"circle",2);p([y()],at.prototype,"type",2);p([y()],at.prototype,"name",2);p([y()],at.prototype,"value",2);p([y()],at.prototype,"href",2);p([y()],at.prototype,"target",2);p([y()],at.prototype,"rel",2);p([y()],at.prototype,"download",2);p([y()],at.prototype,"form",2);p([y({attribute:"formaction"})],at.prototype,"formAction",2);p([y({attribute:"formenctype"})],at.prototype,"formEnctype",2);p([y({attribute:"formmethod"})],at.prototype,"formMethod",2);p([y({attribute:"formnovalidate",type:Boolean})],at.prototype,"formNoValidate",2);p([y({attribute:"formtarget"})],at.prototype,"formTarget",2);p([ut("disabled",{waitUntilFirstUpdate:!0})],at.prototype,"handleDisabledChange",1);at.define("sl-button");var ja=G`
  :host {
    display: inline-block;
  }

  .button-group {
    display: flex;
    flex-wrap: nowrap;
  }
`;var Xe=class extends q{constructor(){super(...arguments),this.disableRole=!1,this.label=""}handleFocus(t){let e=xr(t.target);e?.toggleAttribute("data-sl-button-group__button--focus",!0)}handleBlur(t){let e=xr(t.target);e?.toggleAttribute("data-sl-button-group__button--focus",!1)}handleMouseOver(t){let e=xr(t.target);e?.toggleAttribute("data-sl-button-group__button--hover",!0)}handleMouseOut(t){let e=xr(t.target);e?.toggleAttribute("data-sl-button-group__button--hover",!1)}handleSlotChange(){let t=[...this.defaultSlot.assignedElements({flatten:!0})];t.forEach(e=>{let o=t.indexOf(e),r=xr(e);r&&(r.toggleAttribute("data-sl-button-group__button",!0),r.toggleAttribute("data-sl-button-group__button--first",o===0),r.toggleAttribute("data-sl-button-group__button--inner",o>0&&o<t.length-1),r.toggleAttribute("data-sl-button-group__button--last",o===t.length-1),r.toggleAttribute("data-sl-button-group__button--radio",r.tagName.toLowerCase()==="sl-radio-button"))})}render(){return I`
      <div
        part="base"
        class="button-group"
        role="${this.disableRole?"presentation":"group"}"
        aria-label=${this.label}
        @focusout=${this.handleBlur}
        @focusin=${this.handleFocus}
        @mouseover=${this.handleMouseOver}
        @mouseout=${this.handleMouseOut}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `}};Xe.styles=[J,ja];p([K("slot")],Xe.prototype,"defaultSlot",2);p([Pt()],Xe.prototype,"disableRole",2);p([y()],Xe.prototype,"label",2);function xr(t){var e;let o="sl-button, sl-radio-button";return(e=t.closest(o))!=null?e:t.querySelector(o)}Xe.define("sl-button-group");var Ka=G`
  :host(:not(:focus-within)) {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    clip: rect(0 0 0 0) !important;
    clip-path: inset(50%) !important;
    border: none !important;
    overflow: hidden !important;
    white-space: nowrap !important;
    padding: 0 !important;
  }
`;var Sr=class extends q{render(){return I` <slot></slot> `}};Sr.styles=[J,Ka];var qa=G`
  :host {
    display: block;
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) border,
      var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
  }

  /* Standard inputs */
  .input--standard {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .input--standard:hover:not(.input--disabled) {
    background-color: var(--sl-input-background-color-hover);
    border-color: var(--sl-input-border-color-hover);
  }

  .input--standard.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  .input--standard.input--focused:not(.input--disabled) .input__control {
    color: var(--sl-input-color-focus);
  }

  .input--standard.input--disabled {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input--standard.input--disabled .input__control {
    color: var(--sl-input-color-disabled);
  }

  .input--standard.input--disabled .input__control::placeholder {
    color: var(--sl-input-placeholder-color-disabled);
  }

  /* Filled inputs */
  .input--filled {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .input--filled:hover:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .input--filled.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .input--filled.input--disabled {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    min-width: 0;
    height: 100%;
    color: var(--sl-input-color);
    border: none;
    background: inherit;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .input__control::-webkit-search-decoration,
  .input__control::-webkit-search-cancel-button,
  .input__control::-webkit-search-results-button,
  .input__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .input__control:-webkit-autofill,
  .input__control:-webkit-autofill:hover,
  .input__control:-webkit-autofill:focus,
  .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-background-color-hover) inset !important;
    -webkit-text-fill-color: var(--sl-color-primary-500);
    caret-color: var(--sl-input-color);
  }

  .input--filled .input__control:-webkit-autofill,
  .input--filled .input__control:-webkit-autofill:hover,
  .input--filled .input__control:-webkit-autofill:focus,
  .input--filled .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-filled-background-color) inset !important;
  }

  .input__control::placeholder {
    color: var(--sl-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .input:hover:not(.input--disabled) .input__control {
    color: var(--sl-input-color-hover);
  }

  .input__control:focus {
    outline: none;
  }

  .input__prefix,
  .input__suffix {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    cursor: default;
  }

  .input__prefix ::slotted(sl-icon),
  .input__suffix ::slotted(sl-icon) {
    color: var(--sl-input-icon-color);
  }

  /*
   * Size modifiers
   */

  .input--small {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
    height: var(--sl-input-height-small);
  }

  .input--small .input__control {
    height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-small);
  }

  .input--small .input__clear,
  .input--small .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-small) * 2);
  }

  .input--small .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-small);
  }

  .input--small .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-small);
  }

  .input--medium {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    height: var(--sl-input-height-medium);
  }

  .input--medium .input__control {
    height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-medium);
  }

  .input--medium .input__clear,
  .input--medium .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-medium) * 2);
  }

  .input--medium .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-medium);
  }

  .input--medium .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-medium);
  }

  .input--large {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
    height: var(--sl-input-height-large);
  }

  .input--large .input__control {
    height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-large);
  }

  .input--large .input__clear,
  .input--large .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-large) * 2);
  }

  .input--large .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-large);
  }

  .input--large .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-large);
  }

  /*
   * Pill modifier
   */

  .input--pill.input--small {
    border-radius: var(--sl-input-height-small);
  }

  .input--pill.input--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .input--pill.input--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Clearable + Password Toggle
   */

  .input__clear,
  .input__password-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--sl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--sl-transition-fast) color;
    cursor: pointer;
  }

  .input__clear:hover,
  .input__password-toggle:hover {
    color: var(--sl-input-icon-color-hover);
  }

  .input__clear:focus,
  .input__password-toggle:focus {
    outline: none;
  }

  /* Don't show the browser's password toggle in Edge */
  ::-ms-reveal {
    display: none;
  }

  /* Hide the built-in number spinner */
  .input--no-spin-buttons input[type='number']::-webkit-outer-spin-button,
  .input--no-spin-buttons input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
  }

  .input--no-spin-buttons input[type='number'] {
    -moz-appearance: textfield;
  }
`;var wi=(t="value")=>(e,o)=>{let r=e.constructor,i=r.prototype.attributeChangedCallback;r.prototype.attributeChangedCallback=function(n,a,s){var l;let u=r.getPropertyOptions(t),m=typeof u.attribute=="string"?u.attribute:t;if(n===m){let c=u.converter||qe,h=(typeof c=="function"?c:(l=c?.fromAttribute)!=null?l:qe.fromAttribute)(s,u.type);this[t]!==h&&(this[o]=h)}i.call(this,n,a,s)}};var Wa=G`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    margin-bottom: var(--sl-spacing-3x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--sl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
    color: var(--sl-input-required-content-color);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
    margin-top: var(--sl-spacing-3x-small);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group .form-control__help-text {
    margin-top: var(--sl-spacing-2x-small);
  }
`;var Za=ze(class extends Le{constructor(t){if(super(t),t.type!==he.PROPERTY&&t.type!==he.ATTRIBUTE&&t.type!==he.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!gi(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===Kt||e===_t)return e;let o=t.element,r=t.name;if(t.type===he.PROPERTY){if(e===o[r])return Kt}else if(t.type===he.BOOLEAN_ATTRIBUTE){if(!!e===o.hasAttribute(r))return Kt}else if(t.type===he.ATTRIBUTE&&o.getAttribute(r)===e+"")return Kt;return Ma(t),e}});var H=class extends q{constructor(){super(...arguments),this.formControlController=new Ko(this,{assumeInteractionOn:["sl-blur","sl-input"]}),this.hasSlotController=new Ie(this,"help-text","label"),this.localize=new Tt(this),this.hasFocus=!1,this.title="",this.__numberInput=Object.assign(document.createElement("input"),{type:"number"}),this.__dateInput=Object.assign(document.createElement("input"),{type:"date"}),this.type="text",this.name="",this.value="",this.defaultValue="",this.size="medium",this.filled=!1,this.pill=!1,this.label="",this.helpText="",this.clearable=!1,this.disabled=!1,this.placeholder="",this.readonly=!1,this.passwordToggle=!1,this.passwordVisible=!1,this.noSpinButtons=!1,this.form="",this.required=!1,this.spellcheck=!0}get valueAsDate(){var t;return this.__dateInput.type=this.type,this.__dateInput.value=this.value,((t=this.input)==null?void 0:t.valueAsDate)||this.__dateInput.valueAsDate}set valueAsDate(t){this.__dateInput.type=this.type,this.__dateInput.valueAsDate=t,this.value=this.__dateInput.value}get valueAsNumber(){var t;return this.__numberInput.value=this.value,((t=this.input)==null?void 0:t.valueAsNumber)||this.__numberInput.valueAsNumber}set valueAsNumber(t){this.__numberInput.valueAsNumber=t,this.value=this.__numberInput.value}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.emit("sl-change")}handleClearClick(t){t.preventDefault(),this.value!==""&&(this.value="",this.emit("sl-clear"),this.emit("sl-input"),this.emit("sl-change")),this.input.focus()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.formControlController.updateValidity(),this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleKeyDown(t){let e=t.metaKey||t.ctrlKey||t.shiftKey||t.altKey;t.key==="Enter"&&!e&&setTimeout(()=>{!t.defaultPrevented&&!t.isComposing&&this.formControlController.submit()})}handlePasswordToggle(){this.passwordVisible=!this.passwordVisible}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStepChange(){this.input.step=String(this.step),this.formControlController.updateValidity()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity()}focus(t){this.input.focus(t)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(t,e,o="none"){this.input.setSelectionRange(t,e,o)}setRangeText(t,e,o,r="preserve"){let i=e??this.input.selectionStart,n=o??this.input.selectionEnd;this.input.setRangeText(t,i,n,r),this.value!==this.input.value&&(this.value=this.input.value)}showPicker(){"showPicker"in HTMLInputElement.prototype&&this.input.showPicker()}stepUp(){this.input.stepUp(),this.value!==this.input.value&&(this.value=this.input.value)}stepDown(){this.input.stepDown(),this.value!==this.input.value&&(this.value=this.input.value)}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,r=this.helpText?!0:!!e,n=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value=="number"||this.value.length>0);return I`
      <div
        part="form-control"
        class=${bt({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":o,"form-control--has-help-text":r})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${o?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${bt({input:!0,"input--small":this.size==="small","input--medium":this.size==="medium","input--large":this.size==="large","input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--no-spin-buttons":this.noSpinButtons})}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix"></slot>
            </span>

            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type==="password"&&this.passwordVisible?"text":this.type}
              title=${this.title}
              name=${B(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${B(this.placeholder)}
              minlength=${B(this.minlength)}
              maxlength=${B(this.maxlength)}
              min=${B(this.min)}
              max=${B(this.max)}
              step=${B(this.step)}
              .value=${Za(this.value)}
              autocapitalize=${B(this.autocapitalize)}
              autocomplete=${B(this.autocomplete)}
              autocorrect=${B(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${B(this.pattern)}
              enterkeyhint=${B(this.enterkeyhint)}
              inputmode=${B(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${n?I`
                  <button
                    part="clear-button"
                    class="input__clear"
                    type="button"
                    aria-label=${this.localize.term("clearEntry")}
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  >
                    <slot name="clear-icon">
                      <sl-icon name="x-circle-fill" library="system"></sl-icon>
                    </slot>
                  </button>
                `:""}
            ${this.passwordToggle&&!this.disabled?I`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.passwordVisible?"hidePassword":"showPassword")}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.passwordVisible?I`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        `:I`
                          <slot name="hide-password-icon">
                            <sl-icon name="eye" library="system"></sl-icon>
                          </slot>
                        `}
                  </button>
                `:""}

            <span part="suffix" class="input__suffix">
              <slot name="suffix"></slot>
            </span>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${r?"false":"true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};H.styles=[J,Wa,qa];H.dependencies={"sl-icon":Mt};p([K(".input__control")],H.prototype,"input",2);p([Pt()],H.prototype,"hasFocus",2);p([y()],H.prototype,"title",2);p([y({reflect:!0})],H.prototype,"type",2);p([y()],H.prototype,"name",2);p([y()],H.prototype,"value",2);p([wi()],H.prototype,"defaultValue",2);p([y({reflect:!0})],H.prototype,"size",2);p([y({type:Boolean,reflect:!0})],H.prototype,"filled",2);p([y({type:Boolean,reflect:!0})],H.prototype,"pill",2);p([y()],H.prototype,"label",2);p([y({attribute:"help-text"})],H.prototype,"helpText",2);p([y({type:Boolean})],H.prototype,"clearable",2);p([y({type:Boolean,reflect:!0})],H.prototype,"disabled",2);p([y()],H.prototype,"placeholder",2);p([y({type:Boolean,reflect:!0})],H.prototype,"readonly",2);p([y({attribute:"password-toggle",type:Boolean})],H.prototype,"passwordToggle",2);p([y({attribute:"password-visible",type:Boolean})],H.prototype,"passwordVisible",2);p([y({attribute:"no-spin-buttons",type:Boolean})],H.prototype,"noSpinButtons",2);p([y({reflect:!0})],H.prototype,"form",2);p([y({type:Boolean,reflect:!0})],H.prototype,"required",2);p([y()],H.prototype,"pattern",2);p([y({type:Number})],H.prototype,"minlength",2);p([y({type:Number})],H.prototype,"maxlength",2);p([y()],H.prototype,"min",2);p([y()],H.prototype,"max",2);p([y()],H.prototype,"step",2);p([y()],H.prototype,"autocapitalize",2);p([y()],H.prototype,"autocorrect",2);p([y()],H.prototype,"autocomplete",2);p([y({type:Boolean})],H.prototype,"autofocus",2);p([y()],H.prototype,"enterkeyhint",2);p([y({type:Boolean,converter:{fromAttribute:t=>!(!t||t==="false"),toAttribute:t=>t?"true":"false"}})],H.prototype,"spellcheck",2);p([y()],H.prototype,"inputmode",2);p([ut("disabled",{waitUntilFirstUpdate:!0})],H.prototype,"handleDisabledChange",1);p([ut("step",{waitUntilFirstUpdate:!0})],H.prototype,"handleStepChange",1);p([ut("value",{waitUntilFirstUpdate:!0})],H.prototype,"handleValueChange",1);function ki(t,e){function o(i){let n=t.getBoundingClientRect(),a=t.ownerDocument.defaultView,s=n.left+a.scrollX,l=n.top+a.scrollY,u=i.pageX-s,m=i.pageY-l;e?.onMove&&e.onMove(u,m)}function r(){document.removeEventListener("pointermove",o),document.removeEventListener("pointerup",r),e?.onStop&&e.onStop()}document.addEventListener("pointermove",o,{passive:!0}),document.addEventListener("pointerup",r),e?.initialEvent instanceof PointerEvent&&o(e.initialEvent)}var Xa=G`
  :host {
    display: inline-block;
  }

  .dropdown::part(popup) {
    z-index: var(--sl-z-index-dropdown);
  }

  .dropdown[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .dropdown[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .dropdown[data-current-placement^='left']::part(popup) {
    transform-origin: right;
  }

  .dropdown[data-current-placement^='right']::part(popup) {
    transform-origin: left;
  }

  .dropdown__trigger {
    display: block;
  }

  .dropdown__panel {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    box-shadow: var(--sl-shadow-large);
    border-radius: var(--sl-border-radius-medium);
    pointer-events: none;
  }

  .dropdown--open .dropdown__panel {
    display: block;
    pointer-events: all;
  }

  /* When users slot a menu, make sure it conforms to the popup's auto-size */
  ::slotted(sl-menu) {
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;
  }
`;function*xi(t=document.activeElement){t!=null&&(yield t,"shadowRoot"in t&&t.shadowRoot&&t.shadowRoot.mode!=="closed"&&(yield*Ca(xi(t.shadowRoot.activeElement))))}function Si(){return[...xi()].pop()}var Ya=new WeakMap;function Qa(t){let e=Ya.get(t);return e||(e=window.getComputedStyle(t,null),Ya.set(t,e)),e}function md(t){if(typeof t.checkVisibility=="function")return t.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});let e=Qa(t);return e.visibility!=="hidden"&&e.display!=="none"}function gd(t){let e=Qa(t),{overflowY:o,overflowX:r}=e;return o==="scroll"||r==="scroll"?!0:o!=="auto"||r!=="auto"?!1:t.scrollHeight>t.clientHeight&&o==="auto"||t.scrollWidth>t.clientWidth&&r==="auto"}function bd(t){let e=t.tagName.toLowerCase(),o=Number(t.getAttribute("tabindex"));if(t.hasAttribute("tabindex")&&(isNaN(o)||o<=-1)||t.hasAttribute("disabled")||t.closest("[inert]"))return!1;if(e==="input"&&t.getAttribute("type")==="radio"){let n=t.getRootNode(),a=`input[type='radio'][name="${t.getAttribute("name")}"]`,s=n.querySelector(`${a}:checked`);return s?s===t:n.querySelector(a)===t}return md(t)?(e==="audio"||e==="video")&&t.hasAttribute("controls")||t.hasAttribute("tabindex")||t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(e)?!0:gd(t):!1}function Ja(t){var e,o;let r=Ei(t),i=(e=r[0])!=null?e:null,n=(o=r[r.length-1])!=null?o:null;return{start:i,end:n}}function yd(t,e){var o;return((o=t.getRootNode({composed:!0}))==null?void 0:o.host)!==e}function Ei(t){let e=new WeakMap,o=[];function r(i){if(i instanceof Element){if(i.hasAttribute("inert")||i.closest("[inert]")||e.has(i))return;e.set(i,!0),!o.includes(i)&&bd(i)&&o.push(i),i instanceof HTMLSlotElement&&yd(i,t)&&i.assignedElements({flatten:!0}).forEach(n=>{r(n)}),i.shadowRoot!==null&&i.shadowRoot.mode==="open"&&r(i.shadowRoot)}for(let n of i.children)r(n)}return r(t),o.sort((i,n)=>{let a=Number(i.getAttribute("tabindex"))||0;return(Number(n.getAttribute("tabindex"))||0)-a})}var tl=G`
  :host {
    --arrow-color: var(--sl-color-neutral-1000);
    --arrow-size: 6px;

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45), which is the diagonal size of the arrow's container after rotating.
     */
    --arrow-size-diagonal: calc(var(--arrow-size) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);
  }

  .popup--fixed {
    position: fixed;
  }

  .popup:not(.popup--active) {
    display: none;
  }

  .popup__arrow {
    position: absolute;
    width: calc(var(--arrow-size-diagonal) * 2);
    height: calc(var(--arrow-size-diagonal) * 2);
    rotate: 45deg;
    background: var(--arrow-color);
    z-index: -1;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge--visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: calc(var(--sl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }
`;var De=Math.min,te=Math.max,Cr=Math.round,Ar=Math.floor,Ce=t=>({x:t,y:t}),vd={left:"right",right:"left",bottom:"top",top:"bottom"},_d={start:"end",end:"start"};function Ai(t,e,o){return te(t,De(e,o))}function vo(t,e){return typeof t=="function"?t(e):t}function He(t){return t.split("-")[0]}function _o(t){return t.split("-")[1]}function In(t){return t==="x"?"y":"x"}function Pi(t){return t==="y"?"height":"width"}function Ye(t){return["top","bottom"].includes(He(t))?"y":"x"}function Mi(t){return In(Ye(t))}function el(t,e,o){o===void 0&&(o=!1);let r=_o(t),i=Mi(t),n=Pi(i),a=i==="x"?r===(o?"end":"start")?"right":"left":r==="start"?"bottom":"top";return e.reference[n]>e.floating[n]&&(a=Er(a)),[a,Er(a)]}function ol(t){let e=Er(t);return[Ci(t),e,Ci(e)]}function Ci(t){return t.replace(/start|end/g,e=>_d[e])}function wd(t,e,o){let r=["left","right"],i=["right","left"],n=["top","bottom"],a=["bottom","top"];switch(t){case"top":case"bottom":return o?e?i:r:e?r:i;case"left":case"right":return e?n:a;default:return[]}}function rl(t,e,o,r){let i=_o(t),n=wd(He(t),o==="start",r);return i&&(n=n.map(a=>a+"-"+i),e&&(n=n.concat(n.map(Ci)))),n}function Er(t){return t.replace(/left|right|bottom|top/g,e=>vd[e])}function kd(t){return{top:0,right:0,bottom:0,left:0,...t}}function Dn(t){return typeof t!="number"?kd(t):{top:t,right:t,bottom:t,left:t}}function wo(t){let{x:e,y:o,width:r,height:i}=t;return{width:r,height:i,top:o,left:e,right:e+r,bottom:o+i,x:e,y:o}}function il(t,e,o){let{reference:r,floating:i}=t,n=Ye(e),a=Mi(e),s=Pi(a),l=He(e),u=n==="y",m=r.x+r.width/2-i.width/2,c=r.y+r.height/2-i.height/2,f=r[s]/2-i[s]/2,h;switch(l){case"top":h={x:m,y:r.y-i.height};break;case"bottom":h={x:m,y:r.y+r.height};break;case"right":h={x:r.x+r.width,y:c};break;case"left":h={x:r.x-i.width,y:c};break;default:h={x:r.x,y:r.y}}switch(_o(e)){case"start":h[a]-=f*(o&&u?-1:1);break;case"end":h[a]+=f*(o&&u?-1:1);break}return h}var nl=async(t,e,o)=>{let{placement:r="bottom",strategy:i="absolute",middleware:n=[],platform:a}=o,s=n.filter(Boolean),l=await(a.isRTL==null?void 0:a.isRTL(e)),u=await a.getElementRects({reference:t,floating:e,strategy:i}),{x:m,y:c}=il(u,r,l),f=r,h={},g=0;for(let b=0;b<s.length;b++){let{name:w,fn:_}=s[b],{x:S,y:E,data:L,reset:D}=await _({x:m,y:c,initialPlacement:r,placement:f,strategy:i,middlewareData:h,rects:u,platform:a,elements:{reference:t,floating:e}});m=S??m,c=E??c,h={...h,[w]:{...h[w],...L}},D&&g<=50&&(g++,typeof D=="object"&&(D.placement&&(f=D.placement),D.rects&&(u=D.rects===!0?await a.getElementRects({reference:t,floating:e,strategy:i}):D.rects),{x:m,y:c}=il(u,f,l)),b=-1)}return{x:m,y:c,placement:f,strategy:i,middlewareData:h}};async function Ti(t,e){var o;e===void 0&&(e={});let{x:r,y:i,platform:n,rects:a,elements:s,strategy:l}=t,{boundary:u="clippingAncestors",rootBoundary:m="viewport",elementContext:c="floating",altBoundary:f=!1,padding:h=0}=vo(e,t),g=Dn(h),w=s[f?c==="floating"?"reference":"floating":c],_=wo(await n.getClippingRect({element:(o=await(n.isElement==null?void 0:n.isElement(w)))==null||o?w:w.contextElement||await(n.getDocumentElement==null?void 0:n.getDocumentElement(s.floating)),boundary:u,rootBoundary:m,strategy:l})),S=c==="floating"?{x:r,y:i,width:a.floating.width,height:a.floating.height}:a.reference,E=await(n.getOffsetParent==null?void 0:n.getOffsetParent(s.floating)),L=await(n.isElement==null?void 0:n.isElement(E))?await(n.getScale==null?void 0:n.getScale(E))||{x:1,y:1}:{x:1,y:1},D=wo(n.convertOffsetParentRelativeRectToViewportRelativeRect?await n.convertOffsetParentRelativeRectToViewportRelativeRect({elements:s,rect:S,offsetParent:E,strategy:l}):S);return{top:(_.top-D.top+g.top)/L.y,bottom:(D.bottom-_.bottom+g.bottom)/L.y,left:(_.left-D.left+g.left)/L.x,right:(D.right-_.right+g.right)/L.x}}var sl=t=>({name:"arrow",options:t,async fn(e){let{x:o,y:r,placement:i,rects:n,platform:a,elements:s,middlewareData:l}=e,{element:u,padding:m=0}=vo(t,e)||{};if(u==null)return{};let c=Dn(m),f={x:o,y:r},h=Mi(i),g=Pi(h),b=await a.getDimensions(u),w=h==="y",_=w?"top":"left",S=w?"bottom":"right",E=w?"clientHeight":"clientWidth",L=n.reference[g]+n.reference[h]-f[h]-n.floating[g],D=f[h]-n.reference[h],W=await(a.getOffsetParent==null?void 0:a.getOffsetParent(u)),j=W?W[E]:0;(!j||!await(a.isElement==null?void 0:a.isElement(W)))&&(j=s.floating[E]||n.floating[g]);let X=L/2-D/2,O=j/2-b[g]/2-1,rt=De(c[_],O),k=De(c[S],O),it=rt,ft=j-b[g]-k,Y=j/2-b[g]/2+X,Lt=Ai(it,Y,ft),xt=!l.arrow&&_o(i)!=null&&Y!==Lt&&n.reference[g]/2-(Y<it?rt:k)-b[g]/2<0,Z=xt?Y<it?Y-it:Y-ft:0;return{[h]:f[h]+Z,data:{[h]:Lt,centerOffset:Y-Lt-Z,...xt&&{alignmentOffset:Z}},reset:xt}}});var al=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var o,r;let{placement:i,middlewareData:n,rects:a,initialPlacement:s,platform:l,elements:u}=e,{mainAxis:m=!0,crossAxis:c=!0,fallbackPlacements:f,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:g="none",flipAlignment:b=!0,...w}=vo(t,e);if((o=n.arrow)!=null&&o.alignmentOffset)return{};let _=He(i),S=Ye(s),E=He(s)===s,L=await(l.isRTL==null?void 0:l.isRTL(u.floating)),D=f||(E||!b?[Er(s)]:ol(s)),W=g!=="none";!f&&W&&D.push(...rl(s,b,g,L));let j=[s,...D],X=await Ti(e,w),O=[],rt=((r=n.flip)==null?void 0:r.overflows)||[];if(m&&O.push(X[_]),c){let Y=el(i,a,L);O.push(X[Y[0]],X[Y[1]])}if(rt=[...rt,{placement:i,overflows:O}],!O.every(Y=>Y<=0)){var k,it;let Y=(((k=n.flip)==null?void 0:k.index)||0)+1,Lt=j[Y];if(Lt)return{data:{index:Y,overflows:rt},reset:{placement:Lt}};let xt=(it=rt.filter(Z=>Z.overflows[0]<=0).sort((Z,It)=>Z.overflows[1]-It.overflows[1])[0])==null?void 0:it.placement;if(!xt)switch(h){case"bestFit":{var ft;let Z=(ft=rt.filter(It=>{if(W){let Rt=Ye(It.placement);return Rt===S||Rt==="y"}return!0}).map(It=>[It.placement,It.overflows.filter(Rt=>Rt>0).reduce((Rt,Gt)=>Rt+Gt,0)]).sort((It,Rt)=>It[1]-Rt[1])[0])==null?void 0:ft[0];Z&&(xt=Z);break}case"initialPlacement":xt=s;break}if(i!==xt)return{reset:{placement:xt}}}return{}}}};async function xd(t,e){let{placement:o,platform:r,elements:i}=t,n=await(r.isRTL==null?void 0:r.isRTL(i.floating)),a=He(o),s=_o(o),l=Ye(o)==="y",u=["left","top"].includes(a)?-1:1,m=n&&l?-1:1,c=vo(e,t),{mainAxis:f,crossAxis:h,alignmentAxis:g}=typeof c=="number"?{mainAxis:c,crossAxis:0,alignmentAxis:null}:{mainAxis:c.mainAxis||0,crossAxis:c.crossAxis||0,alignmentAxis:c.alignmentAxis};return s&&typeof g=="number"&&(h=s==="end"?g*-1:g),l?{x:h*m,y:f*u}:{x:f*u,y:h*m}}var ll=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var o,r;let{x:i,y:n,placement:a,middlewareData:s}=e,l=await xd(e,t);return a===((o=s.offset)==null?void 0:o.placement)&&(r=s.arrow)!=null&&r.alignmentOffset?{}:{x:i+l.x,y:n+l.y,data:{...l,placement:a}}}}},cl=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){let{x:o,y:r,placement:i}=e,{mainAxis:n=!0,crossAxis:a=!1,limiter:s={fn:w=>{let{x:_,y:S}=w;return{x:_,y:S}}},...l}=vo(t,e),u={x:o,y:r},m=await Ti(e,l),c=Ye(He(i)),f=In(c),h=u[f],g=u[c];if(n){let w=f==="y"?"top":"left",_=f==="y"?"bottom":"right",S=h+m[w],E=h-m[_];h=Ai(S,h,E)}if(a){let w=c==="y"?"top":"left",_=c==="y"?"bottom":"right",S=g+m[w],E=g-m[_];g=Ai(S,g,E)}let b=s.fn({...e,[f]:h,[c]:g});return{...b,data:{x:b.x-o,y:b.y-r,enabled:{[f]:n,[c]:a}}}}}};var ul=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){var o,r;let{placement:i,rects:n,platform:a,elements:s}=e,{apply:l=()=>{},...u}=vo(t,e),m=await Ti(e,u),c=He(i),f=_o(i),h=Ye(i)==="y",{width:g,height:b}=n.floating,w,_;c==="top"||c==="bottom"?(w=c,_=f===(await(a.isRTL==null?void 0:a.isRTL(s.floating))?"start":"end")?"left":"right"):(_=c,w=f==="end"?"top":"bottom");let S=b-m.top-m.bottom,E=g-m.left-m.right,L=De(b-m[w],S),D=De(g-m[_],E),W=!e.middlewareData.shift,j=L,X=D;if((o=e.middlewareData.shift)!=null&&o.enabled.x&&(X=E),(r=e.middlewareData.shift)!=null&&r.enabled.y&&(j=S),W&&!f){let rt=te(m.left,0),k=te(m.right,0),it=te(m.top,0),ft=te(m.bottom,0);h?X=g-2*(rt!==0||k!==0?rt+k:te(m.left,m.right)):j=b-2*(it!==0||ft!==0?it+ft:te(m.top,m.bottom))}await l({...e,availableWidth:X,availableHeight:j});let O=await a.getDimensions(s.floating);return g!==O.width||b!==O.height?{reset:{rects:!0}}:{}}}};function $i(){return typeof window<"u"}function ko(t){return hl(t)?(t.nodeName||"").toLowerCase():"#document"}function oe(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function Ae(t){var e;return(e=(hl(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function hl(t){return $i()?t instanceof Node||t instanceof oe(t).Node:!1}function ve(t){return $i()?t instanceof Element||t instanceof oe(t).Element:!1}function Pe(t){return $i()?t instanceof HTMLElement||t instanceof oe(t).HTMLElement:!1}function dl(t){return!$i()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof oe(t).ShadowRoot}function Wo(t){let{overflow:e,overflowX:o,overflowY:r,display:i}=_e(t);return/auto|scroll|overlay|hidden|clip/.test(e+r+o)&&!["inline","contents"].includes(i)}function pl(t){return["table","td","th"].includes(ko(t))}function Pr(t){return[":popover-open",":modal"].some(e=>{try{return t.matches(e)}catch{return!1}})}function Zo(t){let e=Li(),o=ve(t)?_e(t):t;return["transform","translate","scale","rotate","perspective"].some(r=>o[r]?o[r]!=="none":!1)||(o.containerType?o.containerType!=="normal":!1)||!e&&(o.backdropFilter?o.backdropFilter!=="none":!1)||!e&&(o.filter?o.filter!=="none":!1)||["transform","translate","scale","rotate","perspective","filter"].some(r=>(o.willChange||"").includes(r))||["paint","layout","strict","content"].some(r=>(o.contain||"").includes(r))}function fl(t){let e=Ve(t);for(;Pe(e)&&!xo(e);){if(Zo(e))return e;if(Pr(e))return null;e=Ve(e)}return null}function Li(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function xo(t){return["html","body","#document"].includes(ko(t))}function _e(t){return oe(t).getComputedStyle(t)}function Mr(t){return ve(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function Ve(t){if(ko(t)==="html")return t;let e=t.assignedSlot||t.parentNode||dl(t)&&t.host||Ae(t);return dl(e)?e.host:e}function ml(t){let e=Ve(t);return xo(e)?t.ownerDocument?t.ownerDocument.body:t.body:Pe(e)&&Wo(e)?e:ml(e)}function qo(t,e,o){var r;e===void 0&&(e=[]),o===void 0&&(o=!0);let i=ml(t),n=i===((r=t.ownerDocument)==null?void 0:r.body),a=oe(i);if(n){let s=Ii(a);return e.concat(a,a.visualViewport||[],Wo(i)?i:[],s&&o?qo(s):[])}return e.concat(i,qo(i,[],o))}function Ii(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function yl(t){let e=_e(t),o=parseFloat(e.width)||0,r=parseFloat(e.height)||0,i=Pe(t),n=i?t.offsetWidth:o,a=i?t.offsetHeight:r,s=Cr(o)!==n||Cr(r)!==a;return s&&(o=n,r=a),{width:o,height:r,$:s}}function Rn(t){return ve(t)?t:t.contextElement}function Xo(t){let e=Rn(t);if(!Pe(e))return Ce(1);let o=e.getBoundingClientRect(),{width:r,height:i,$:n}=yl(e),a=(n?Cr(o.width):o.width)/r,s=(n?Cr(o.height):o.height)/i;return(!a||!Number.isFinite(a))&&(a=1),(!s||!Number.isFinite(s))&&(s=1),{x:a,y:s}}var Sd=Ce(0);function vl(t){let e=oe(t);return!Li()||!e.visualViewport?Sd:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function Ed(t,e,o){return e===void 0&&(e=!1),!o||e&&o!==oe(t)?!1:e}function So(t,e,o,r){e===void 0&&(e=!1),o===void 0&&(o=!1);let i=t.getBoundingClientRect(),n=Rn(t),a=Ce(1);e&&(r?ve(r)&&(a=Xo(r)):a=Xo(t));let s=Ed(n,o,r)?vl(n):Ce(0),l=(i.left+s.x)/a.x,u=(i.top+s.y)/a.y,m=i.width/a.x,c=i.height/a.y;if(n){let f=oe(n),h=r&&ve(r)?oe(r):r,g=f,b=Ii(g);for(;b&&r&&h!==g;){let w=Xo(b),_=b.getBoundingClientRect(),S=_e(b),E=_.left+(b.clientLeft+parseFloat(S.paddingLeft))*w.x,L=_.top+(b.clientTop+parseFloat(S.paddingTop))*w.y;l*=w.x,u*=w.y,m*=w.x,c*=w.y,l+=E,u+=L,g=oe(b),b=Ii(g)}}return wo({width:m,height:c,x:l,y:u})}function Fn(t,e){let o=Mr(t).scrollLeft;return e?e.left+o:So(Ae(t)).left+o}function _l(t,e,o){o===void 0&&(o=!1);let r=t.getBoundingClientRect(),i=r.left+e.scrollLeft-(o?0:Fn(t,r)),n=r.top+e.scrollTop;return{x:i,y:n}}function Cd(t){let{elements:e,rect:o,offsetParent:r,strategy:i}=t,n=i==="fixed",a=Ae(r),s=e?Pr(e.floating):!1;if(r===a||s&&n)return o;let l={scrollLeft:0,scrollTop:0},u=Ce(1),m=Ce(0),c=Pe(r);if((c||!c&&!n)&&((ko(r)!=="body"||Wo(a))&&(l=Mr(r)),Pe(r))){let h=So(r);u=Xo(r),m.x=h.x+r.clientLeft,m.y=h.y+r.clientTop}let f=a&&!c&&!n?_l(a,l,!0):Ce(0);return{width:o.width*u.x,height:o.height*u.y,x:o.x*u.x-l.scrollLeft*u.x+m.x+f.x,y:o.y*u.y-l.scrollTop*u.y+m.y+f.y}}function Ad(t){return Array.from(t.getClientRects())}function Pd(t){let e=Ae(t),o=Mr(t),r=t.ownerDocument.body,i=te(e.scrollWidth,e.clientWidth,r.scrollWidth,r.clientWidth),n=te(e.scrollHeight,e.clientHeight,r.scrollHeight,r.clientHeight),a=-o.scrollLeft+Fn(t),s=-o.scrollTop;return _e(r).direction==="rtl"&&(a+=te(e.clientWidth,r.clientWidth)-i),{width:i,height:n,x:a,y:s}}function Md(t,e){let o=oe(t),r=Ae(t),i=o.visualViewport,n=r.clientWidth,a=r.clientHeight,s=0,l=0;if(i){n=i.width,a=i.height;let u=Li();(!u||u&&e==="fixed")&&(s=i.offsetLeft,l=i.offsetTop)}return{width:n,height:a,x:s,y:l}}function Td(t,e){let o=So(t,!0,e==="fixed"),r=o.top+t.clientTop,i=o.left+t.clientLeft,n=Pe(t)?Xo(t):Ce(1),a=t.clientWidth*n.x,s=t.clientHeight*n.y,l=i*n.x,u=r*n.y;return{width:a,height:s,x:l,y:u}}function gl(t,e,o){let r;if(e==="viewport")r=Md(t,o);else if(e==="document")r=Pd(Ae(t));else if(ve(e))r=Td(e,o);else{let i=vl(t);r={x:e.x-i.x,y:e.y-i.y,width:e.width,height:e.height}}return wo(r)}function wl(t,e){let o=Ve(t);return o===e||!ve(o)||xo(o)?!1:_e(o).position==="fixed"||wl(o,e)}function $d(t,e){let o=e.get(t);if(o)return o;let r=qo(t,[],!1).filter(s=>ve(s)&&ko(s)!=="body"),i=null,n=_e(t).position==="fixed",a=n?Ve(t):t;for(;ve(a)&&!xo(a);){let s=_e(a),l=Zo(a);!l&&s.position==="fixed"&&(i=null),(n?!l&&!i:!l&&s.position==="static"&&!!i&&["absolute","fixed"].includes(i.position)||Wo(a)&&!l&&wl(t,a))?r=r.filter(m=>m!==a):i=s,a=Ve(a)}return e.set(t,r),r}function Ld(t){let{element:e,boundary:o,rootBoundary:r,strategy:i}=t,a=[...o==="clippingAncestors"?Pr(e)?[]:$d(e,this._c):[].concat(o),r],s=a[0],l=a.reduce((u,m)=>{let c=gl(e,m,i);return u.top=te(c.top,u.top),u.right=De(c.right,u.right),u.bottom=De(c.bottom,u.bottom),u.left=te(c.left,u.left),u},gl(e,s,i));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function Id(t){let{width:e,height:o}=yl(t);return{width:e,height:o}}function Dd(t,e,o){let r=Pe(e),i=Ae(e),n=o==="fixed",a=So(t,!0,n,e),s={scrollLeft:0,scrollTop:0},l=Ce(0);if(r||!r&&!n)if((ko(e)!=="body"||Wo(i))&&(s=Mr(e)),r){let f=So(e,!0,n,e);l.x=f.x+e.clientLeft,l.y=f.y+e.clientTop}else i&&(l.x=Fn(i));let u=i&&!r&&!n?_l(i,s):Ce(0),m=a.left+s.scrollLeft-l.x-u.x,c=a.top+s.scrollTop-l.y-u.y;return{x:m,y:c,width:a.width,height:a.height}}function On(t){return _e(t).position==="static"}function bl(t,e){if(!Pe(t)||_e(t).position==="fixed")return null;if(e)return e(t);let o=t.offsetParent;return Ae(t)===o&&(o=o.ownerDocument.body),o}function kl(t,e){let o=oe(t);if(Pr(t))return o;if(!Pe(t)){let i=Ve(t);for(;i&&!xo(i);){if(ve(i)&&!On(i))return i;i=Ve(i)}return o}let r=bl(t,e);for(;r&&pl(r)&&On(r);)r=bl(r,e);return r&&xo(r)&&On(r)&&!Zo(r)?o:r||fl(t)||o}var Od=async function(t){let e=this.getOffsetParent||kl,o=this.getDimensions,r=await o(t.floating);return{reference:Dd(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function Rd(t){return _e(t).direction==="rtl"}var Tr={convertOffsetParentRelativeRectToViewportRelativeRect:Cd,getDocumentElement:Ae,getClippingRect:Ld,getOffsetParent:kl,getElementRects:Od,getClientRects:Ad,getDimensions:Id,getScale:Xo,isElement:ve,isRTL:Rd};function xl(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function Fd(t,e){let o=null,r,i=Ae(t);function n(){var s;clearTimeout(r),(s=o)==null||s.disconnect(),o=null}function a(s,l){s===void 0&&(s=!1),l===void 0&&(l=1),n();let u=t.getBoundingClientRect(),{left:m,top:c,width:f,height:h}=u;if(s||e(),!f||!h)return;let g=Ar(c),b=Ar(i.clientWidth-(m+f)),w=Ar(i.clientHeight-(c+h)),_=Ar(m),E={rootMargin:-g+"px "+-b+"px "+-w+"px "+-_+"px",threshold:te(0,De(1,l))||1},L=!0;function D(W){let j=W[0].intersectionRatio;if(j!==l){if(!L)return a();j?a(!1,j):r=setTimeout(()=>{a(!1,1e-7)},1e3)}j===1&&!xl(u,t.getBoundingClientRect())&&a(),L=!1}try{o=new IntersectionObserver(D,{...E,root:i.ownerDocument})}catch{o=new IntersectionObserver(D,E)}o.observe(t)}return a(!0),n}function Sl(t,e,o,r){r===void 0&&(r={});let{ancestorScroll:i=!0,ancestorResize:n=!0,elementResize:a=typeof ResizeObserver=="function",layoutShift:s=typeof IntersectionObserver=="function",animationFrame:l=!1}=r,u=Rn(t),m=i||n?[...u?qo(u):[],...qo(e)]:[];m.forEach(_=>{i&&_.addEventListener("scroll",o,{passive:!0}),n&&_.addEventListener("resize",o)});let c=u&&s?Fd(u,o):null,f=-1,h=null;a&&(h=new ResizeObserver(_=>{let[S]=_;S&&S.target===u&&h&&(h.unobserve(e),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var E;(E=h)==null||E.observe(e)})),o()}),u&&!l&&h.observe(u),h.observe(e));let g,b=l?So(t):null;l&&w();function w(){let _=So(t);b&&!xl(b,_)&&o(),b=_,g=requestAnimationFrame(w)}return o(),()=>{var _;m.forEach(S=>{i&&S.removeEventListener("scroll",o),n&&S.removeEventListener("resize",o)}),c?.(),(_=h)==null||_.disconnect(),h=null,l&&cancelAnimationFrame(g)}}var El=ll;var Cl=cl,Al=al,Bn=ul;var Pl=sl;var Ml=(t,e,o)=>{let r=new Map,i={platform:Tr,...o},n={...i.platform,_c:r};return nl(t,e,{...i,platform:n})};function Tl(t){return Bd(t)}function Nn(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function Bd(t){for(let e=t;e;e=Nn(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=Nn(t);e;e=Nn(e)){if(!(e instanceof Element))continue;let o=getComputedStyle(e);if(o.display!=="contents"&&(o.position!=="static"||Zo(o)||e.tagName==="BODY"))return e}return null}function Nd(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var ct=class extends q{constructor(){super(...arguments),this.localize=new Tt(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){let t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),o=this.placement.includes("top")||this.placement.includes("bottom"),r=0,i=0,n=0,a=0,s=0,l=0,u=0,m=0;o?t.top<e.top?(r=t.left,i=t.bottom,n=t.right,a=t.bottom,s=e.left,l=e.top,u=e.right,m=e.top):(r=e.left,i=e.bottom,n=e.right,a=e.bottom,s=t.left,l=t.top,u=t.right,m=t.top):t.left<e.left?(r=t.right,i=t.top,n=e.left,a=e.top,s=t.right,l=t.bottom,u=e.left,m=e.bottom):(r=e.right,i=e.top,n=t.left,a=t.top,s=e.right,l=e.bottom,u=t.left,m=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${r}px`),this.style.setProperty("--hover-bridge-top-left-y",`${i}px`),this.style.setProperty("--hover-bridge-top-right-x",`${n}px`),this.style.setProperty("--hover-bridge-top-right-y",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${s}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${u}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${m}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){let t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||Nd(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Sl(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;let t=[El({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Bn({apply:({rects:o})=>{let r=this.sync==="width"||this.sync==="both",i=this.sync==="height"||this.sync==="both";this.popup.style.width=r?`${o.reference.width}px`:"",this.popup.style.height=i?`${o.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(Al({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(Cl({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Bn({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:o,availableHeight:r})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${r}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${o}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(Pl({element:this.arrowEl,padding:this.arrowPadding}));let e=this.strategy==="absolute"?o=>Tr.getOffsetParent(o,Tl):Tr.getOffsetParent;Ml(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:Ze(de({},Tr),{getOffsetParent:e})}).then(({x:o,y:r,middlewareData:i,placement:n})=>{let a=this.localize.dir()==="rtl",s={top:"bottom",right:"left",bottom:"top",left:"right"}[n.split("-")[0]];if(this.setAttribute("data-current-placement",n),Object.assign(this.popup.style,{left:`${o}px`,top:`${r}px`}),this.arrow){let l=i.arrow.x,u=i.arrow.y,m="",c="",f="",h="";if(this.arrowPlacement==="start"){let g=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";m=typeof u=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",c=a?g:"",h=a?"":g}else if(this.arrowPlacement==="end"){let g=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";c=a?"":g,h=a?g:"",f=typeof u=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(h=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",m=typeof u=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(h=typeof l=="number"?`${l}px`:"",m=typeof u=="number"?`${u}px`:"");Object.assign(this.arrowEl.style,{top:m,right:c,bottom:f,left:h,[s]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return I`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${bt({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${bt({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?I`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};ct.styles=[J,tl];p([K(".popup")],ct.prototype,"popup",2);p([K(".popup__arrow")],ct.prototype,"arrowEl",2);p([y()],ct.prototype,"anchor",2);p([y({type:Boolean,reflect:!0})],ct.prototype,"active",2);p([y({reflect:!0})],ct.prototype,"placement",2);p([y({reflect:!0})],ct.prototype,"strategy",2);p([y({type:Number})],ct.prototype,"distance",2);p([y({type:Number})],ct.prototype,"skidding",2);p([y({type:Boolean})],ct.prototype,"arrow",2);p([y({attribute:"arrow-placement"})],ct.prototype,"arrowPlacement",2);p([y({attribute:"arrow-padding",type:Number})],ct.prototype,"arrowPadding",2);p([y({type:Boolean})],ct.prototype,"flip",2);p([y({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],ct.prototype,"flipFallbackPlacements",2);p([y({attribute:"flip-fallback-strategy"})],ct.prototype,"flipFallbackStrategy",2);p([y({type:Object})],ct.prototype,"flipBoundary",2);p([y({attribute:"flip-padding",type:Number})],ct.prototype,"flipPadding",2);p([y({type:Boolean})],ct.prototype,"shift",2);p([y({type:Object})],ct.prototype,"shiftBoundary",2);p([y({attribute:"shift-padding",type:Number})],ct.prototype,"shiftPadding",2);p([y({attribute:"auto-size"})],ct.prototype,"autoSize",2);p([y()],ct.prototype,"sync",2);p([y({type:Object})],ct.prototype,"autoSizeBoundary",2);p([y({attribute:"auto-size-padding",type:Number})],ct.prototype,"autoSizePadding",2);p([y({attribute:"hover-bridge",type:Boolean})],ct.prototype,"hoverBridge",2);var Ft=class extends q{constructor(){super(...arguments),this.localize=new Tt(this),this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=t=>{this.open&&t.key==="Escape"&&(t.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=t=>{var e;if(t.key==="Escape"&&this.open&&!this.closeWatcher){t.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(t.key==="Tab"){if(this.open&&((e=document.activeElement)==null?void 0:e.tagName.toLowerCase())==="sl-menu-item"){t.preventDefault(),this.hide(),this.focusOnTrigger();return}let o=(r,i)=>{if(!r)return null;let n=r.closest(i);if(n)return n;let a=r.getRootNode();return a instanceof ShadowRoot?o(a.host,i):null};setTimeout(()=>{var r;let i=((r=this.containingElement)==null?void 0:r.getRootNode())instanceof ShadowRoot?Si():document.activeElement;(!this.containingElement||o(i,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=t=>{let e=t.composedPath();this.containingElement&&!e.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=t=>{let e=t.target;!this.stayOpenOnSelect&&e.tagName.toLowerCase()==="sl-menu"&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||(this.containingElement=this)}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){let t=this.trigger.assignedElements({flatten:!0})[0];typeof t?.focus=="function"&&t.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(t=>t.tagName.toLowerCase()==="sl-menu")}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(t){if([" ","Enter"].includes(t.key)){t.preventDefault(),this.handleTriggerClick();return}let e=this.getMenu();if(e){let o=e.getAllItems(),r=o[0],i=o[o.length-1];["ArrowDown","ArrowUp","Home","End"].includes(t.key)&&(t.preventDefault(),this.open||(this.show(),await this.updateComplete),o.length>0&&this.updateComplete.then(()=>{(t.key==="ArrowDown"||t.key==="Home")&&(e.setCurrentItem(r),r.focus()),(t.key==="ArrowUp"||t.key==="End")&&(e.setCurrentItem(i),i.focus())}))}}handleTriggerKeyUp(t){t.key===" "&&t.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){let e=this.trigger.assignedElements({flatten:!0}).find(r=>Ja(r).start),o;if(e){switch(e.tagName.toLowerCase()){case"sl-button":case"sl-icon-button":o=e.button;break;default:o=e}o.setAttribute("aria-haspopup","true"),o.setAttribute("aria-expanded",this.open?"true":"false")}}async show(){if(!this.open)return this.open=!0,ye(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ye(this,"sl-after-hide")}reposition(){this.popup.reposition()}addOpenListeners(){var t;this.panel.addEventListener("sl-select",this.handlePanelSelect),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){var t;this.panel&&(this.panel.removeEventListener("sl-select",this.handlePanelSelect),this.panel.removeEventListener("keydown",this.handleKeyDown)),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),(t=this.closeWatcher)==null||t.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit("sl-show"),this.addOpenListeners(),await ee(this),this.panel.hidden=!1,this.popup.active=!0;let{keyframes:t,options:e}=Qt(this,"dropdown.show",{dir:this.localize.dir()});await Jt(this.popup.popup,t,e),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await ee(this);let{keyframes:t,options:e}=Qt(this,"dropdown.hide",{dir:this.localize.dir()});await Jt(this.popup.popup,t,e),this.panel.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}render(){return I`
      <sl-popup
        part="base"
        exportparts="popup:base__popup"
        id="dropdown"
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        sync=${B(this.sync?this.sync:void 0)}
        class=${bt({dropdown:!0,"dropdown--open":this.open})}
      >
        <slot
          name="trigger"
          slot="anchor"
          part="trigger"
          class="dropdown__trigger"
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeyDown}
          @keyup=${this.handleTriggerKeyUp}
          @slotchange=${this.handleTriggerSlotChange}
        ></slot>

        <div aria-hidden=${this.open?"false":"true"} aria-labelledby="dropdown">
          <slot part="panel" class="dropdown__panel"></slot>
        </div>
      </sl-popup>
    `}};Ft.styles=[J,Xa];Ft.dependencies={"sl-popup":ct};p([K(".dropdown")],Ft.prototype,"popup",2);p([K(".dropdown__trigger")],Ft.prototype,"trigger",2);p([K(".dropdown__panel")],Ft.prototype,"panel",2);p([y({type:Boolean,reflect:!0})],Ft.prototype,"open",2);p([y({reflect:!0})],Ft.prototype,"placement",2);p([y({type:Boolean,reflect:!0})],Ft.prototype,"disabled",2);p([y({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],Ft.prototype,"stayOpenOnSelect",2);p([y({attribute:!1})],Ft.prototype,"containingElement",2);p([y({type:Number})],Ft.prototype,"distance",2);p([y({type:Number})],Ft.prototype,"skidding",2);p([y({type:Boolean})],Ft.prototype,"hoist",2);p([y({reflect:!0})],Ft.prototype,"sync",2);p([ut("open",{waitUntilFirstUpdate:!0})],Ft.prototype,"handleOpenChange",1);Yt("dropdown.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}});Yt("dropdown.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}});var $l=G`
  :host {
    --grid-width: 280px;
    --grid-height: 200px;
    --grid-handle-size: 16px;
    --slider-height: 15px;
    --slider-handle-size: 17px;
    --swatch-size: 25px;

    display: inline-block;
  }

  .color-picker {
    width: var(--grid-width);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    color: var(--color);
    background-color: var(--sl-panel-background-color);
    border-radius: var(--sl-border-radius-medium);
    user-select: none;
    -webkit-user-select: none;
  }

  .color-picker--inline {
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
  }

  .color-picker--inline:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .color-picker__grid {
    position: relative;
    height: var(--grid-height);
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%),
      linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);
    border-top-left-radius: var(--sl-border-radius-medium);
    border-top-right-radius: var(--sl-border-radius-medium);
    cursor: crosshair;
    forced-color-adjust: none;
  }

  .color-picker__grid-handle {
    position: absolute;
    width: var(--grid-handle-size);
    height: var(--grid-handle-size);
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    border: solid 2px white;
    margin-top: calc(var(--grid-handle-size) / -2);
    margin-left: calc(var(--grid-handle-size) / -2);
    transition: var(--sl-transition-fast) scale;
  }

  .color-picker__grid-handle--dragging {
    cursor: none;
    scale: 1.5;
  }

  .color-picker__grid-handle:focus-visible {
    outline: var(--sl-focus-ring);
  }

  .color-picker__controls {
    padding: var(--sl-spacing-small);
    display: flex;
    align-items: center;
  }

  .color-picker__sliders {
    flex: 1 1 auto;
  }

  .color-picker__slider {
    position: relative;
    height: var(--slider-height);
    border-radius: var(--sl-border-radius-pill);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
    forced-color-adjust: none;
  }

  .color-picker__slider:not(:last-of-type) {
    margin-bottom: var(--sl-spacing-small);
  }

  .color-picker__slider-handle {
    position: absolute;
    top: calc(50% - var(--slider-handle-size) / 2);
    width: var(--slider-handle-size);
    height: var(--slider-handle-size);
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
    margin-left: calc(var(--slider-handle-size) / -2);
  }

  .color-picker__slider-handle:focus-visible {
    outline: var(--sl-focus-ring);
  }

  .color-picker__hue {
    background-image: linear-gradient(
      to right,
      rgb(255, 0, 0) 0%,
      rgb(255, 255, 0) 17%,
      rgb(0, 255, 0) 33%,
      rgb(0, 255, 255) 50%,
      rgb(0, 0, 255) 67%,
      rgb(255, 0, 255) 83%,
      rgb(255, 0, 0) 100%
    );
  }

  .color-picker__alpha .color-picker__alpha-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  .color-picker__preview {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 2.25rem;
    height: 2.25rem;
    border: none;
    border-radius: var(--sl-border-radius-circle);
    background: none;
    margin-left: var(--sl-spacing-small);
    cursor: copy;
    forced-color-adjust: none;
  }

  .color-picker__preview:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);

    /* We use a custom property in lieu of currentColor because of https://bugs.webkit.org/show_bug.cgi?id=216780 */
    background-color: var(--preview-color);
  }

  .color-picker__preview:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .color-picker__preview-color {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: solid 1px rgba(0, 0, 0, 0.125);
  }

  .color-picker__preview-color--copied {
    animation: pulse 0.75s;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--sl-color-primary-500);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }

  .color-picker__user-input {
    display: flex;
    padding: 0 var(--sl-spacing-small) var(--sl-spacing-small) var(--sl-spacing-small);
  }

  .color-picker__user-input sl-input {
    min-width: 0; /* fix input width in Safari */
    flex: 1 1 auto;
  }

  .color-picker__user-input sl-button-group {
    margin-left: var(--sl-spacing-small);
  }

  .color-picker__user-input sl-button {
    min-width: 3.25rem;
    max-width: 3.25rem;
    font-size: 1rem;
  }

  .color-picker__swatches {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 0.5rem;
    justify-items: center;
    border-top: solid 1px var(--sl-color-neutral-200);
    padding: var(--sl-spacing-small);
    forced-color-adjust: none;
  }

  .color-picker__swatch {
    position: relative;
    width: var(--swatch-size);
    height: var(--swatch-size);
    border-radius: var(--sl-border-radius-small);
  }

  .color-picker__swatch .color-picker__swatch-color {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: solid 1px rgba(0, 0, 0, 0.125);
    border-radius: inherit;
    cursor: pointer;
  }

  .color-picker__swatch:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .color-picker__transparent-bg {
    background-image: linear-gradient(45deg, var(--sl-color-neutral-300) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--sl-color-neutral-300) 75%),
      linear-gradient(45deg, transparent 75%, var(--sl-color-neutral-300) 75%),
      linear-gradient(45deg, var(--sl-color-neutral-300) 25%, transparent 25%);
    background-size: 10px 10px;
    background-position:
      0 0,
      0 0,
      -5px -5px,
      5px 5px;
  }

  .color-picker--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .color-picker--disabled .color-picker__grid,
  .color-picker--disabled .color-picker__grid-handle,
  .color-picker--disabled .color-picker__slider,
  .color-picker--disabled .color-picker__slider-handle,
  .color-picker--disabled .color-picker__preview,
  .color-picker--disabled .color-picker__swatch,
  .color-picker--disabled .color-picker__swatch-color {
    pointer-events: none;
  }

  /*
   * Color dropdown
   */

  .color-dropdown::part(panel) {
    max-height: none;
    background-color: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    overflow: visible;
  }

  .color-dropdown__trigger {
    display: inline-block;
    position: relative;
    background-color: transparent;
    border: none;
    cursor: pointer;
    forced-color-adjust: none;
  }

  .color-dropdown__trigger.color-dropdown__trigger--small {
    width: var(--sl-input-height-small);
    height: var(--sl-input-height-small);
    border-radius: var(--sl-border-radius-circle);
  }

  .color-dropdown__trigger.color-dropdown__trigger--medium {
    width: var(--sl-input-height-medium);
    height: var(--sl-input-height-medium);
    border-radius: var(--sl-border-radius-circle);
  }

  .color-dropdown__trigger.color-dropdown__trigger--large {
    width: var(--sl-input-height-large);
    height: var(--sl-input-height-large);
    border-radius: var(--sl-border-radius-circle);
  }

  .color-dropdown__trigger:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background-color: currentColor;
    box-shadow:
      inset 0 0 0 2px var(--sl-input-border-color),
      inset 0 0 0 4px var(--sl-color-neutral-0);
  }

  .color-dropdown__trigger--empty:before {
    background-color: transparent;
  }

  .color-dropdown__trigger:focus-visible {
    outline: none;
  }

  .color-dropdown__trigger:focus-visible:not(.color-dropdown__trigger--disabled) {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .color-dropdown__trigger.color-dropdown__trigger--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;function fe(t,e,o){let r=i=>Object.is(i,-0)?0:i;return t<e?r(e):t>o?r(o):r(t)}var Ll="important",zd=" !"+Ll,Ue=ze(class extends Le{constructor(t){if(super(t),t.type!==he.ATTRIBUTE||t.name!=="style"||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,o)=>{let r=t[o];return r==null?e:e+`${o=o.includes("-")?o:o.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${r};`},"")}update(t,[e]){let{style:o}=t.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(e)),this.render(e);for(let r of this.ft)e[r]==null&&(this.ft.delete(r),r.includes("-")?o.removeProperty(r):o[r]=null);for(let r in e){let i=e[r];if(i!=null){this.ft.add(r);let n=typeof i=="string"&&i.endsWith(zd);r.includes("-")||n?o.setProperty(r,n?i.slice(0,-11):i,n?Ll:""):o[r]=i}}return Kt}});function Bt(t,e){Hd(t)&&(t="100%");let o=Vd(t);return t=e===360?t:Math.min(e,Math.max(0,parseFloat(t))),o&&(t=parseInt(String(t*e),10)/100),Math.abs(t-e)<1e-6?1:(e===360?t=(t<0?t%e+e:t%e)/parseFloat(String(e)):t=t%e/parseFloat(String(e)),t)}function $r(t){return Math.min(1,Math.max(0,t))}function Hd(t){return typeof t=="string"&&t.indexOf(".")!==-1&&parseFloat(t)===1}function Vd(t){return typeof t=="string"&&t.indexOf("%")!==-1}function Di(t){return t=parseFloat(t),(isNaN(t)||t<0||t>1)&&(t=1),t}function Lr(t){return Number(t)<=1?`${Number(t)*100}%`:t}function Qe(t){return t.length===1?"0"+t:String(t)}function Il(t,e,o){return{r:Bt(t,255)*255,g:Bt(e,255)*255,b:Bt(o,255)*255}}function Hn(t,e,o){t=Bt(t,255),e=Bt(e,255),o=Bt(o,255);let r=Math.max(t,e,o),i=Math.min(t,e,o),n=0,a=0,s=(r+i)/2;if(r===i)a=0,n=0;else{let l=r-i;switch(a=s>.5?l/(2-r-i):l/(r+i),r){case t:n=(e-o)/l+(e<o?6:0);break;case e:n=(o-t)/l+2;break;case o:n=(t-e)/l+4;break;default:break}n/=6}return{h:n,s:a,l:s}}function zn(t,e,o){return o<0&&(o+=1),o>1&&(o-=1),o<1/6?t+(e-t)*(6*o):o<1/2?e:o<2/3?t+(e-t)*(2/3-o)*6:t}function Dl(t,e,o){let r,i,n;if(t=Bt(t,360),e=Bt(e,100),o=Bt(o,100),e===0)i=o,n=o,r=o;else{let a=o<.5?o*(1+e):o+e-o*e,s=2*o-a;r=zn(s,a,t+1/3),i=zn(s,a,t),n=zn(s,a,t-1/3)}return{r:r*255,g:i*255,b:n*255}}function Vn(t,e,o){t=Bt(t,255),e=Bt(e,255),o=Bt(o,255);let r=Math.max(t,e,o),i=Math.min(t,e,o),n=0,a=r,s=r-i,l=r===0?0:s/r;if(r===i)n=0;else{switch(r){case t:n=(e-o)/s+(e<o?6:0);break;case e:n=(o-t)/s+2;break;case o:n=(t-e)/s+4;break;default:break}n/=6}return{h:n,s:l,v:a}}function Ol(t,e,o){t=Bt(t,360)*6,e=Bt(e,100),o=Bt(o,100);let r=Math.floor(t),i=t-r,n=o*(1-e),a=o*(1-i*e),s=o*(1-(1-i)*e),l=r%6,u=[o,a,n,n,s,o][l],m=[s,o,o,a,n,n][l],c=[n,n,s,o,o,a][l];return{r:u*255,g:m*255,b:c*255}}function Un(t,e,o,r){let i=[Qe(Math.round(t).toString(16)),Qe(Math.round(e).toString(16)),Qe(Math.round(o).toString(16))];return r&&i[0].startsWith(i[0].charAt(1))&&i[1].startsWith(i[1].charAt(1))&&i[2].startsWith(i[2].charAt(1))?i[0].charAt(0)+i[1].charAt(0)+i[2].charAt(0):i.join("")}function Rl(t,e,o,r,i){let n=[Qe(Math.round(t).toString(16)),Qe(Math.round(e).toString(16)),Qe(Math.round(o).toString(16)),Qe(Ud(r))];return i&&n[0].startsWith(n[0].charAt(1))&&n[1].startsWith(n[1].charAt(1))&&n[2].startsWith(n[2].charAt(1))&&n[3].startsWith(n[3].charAt(1))?n[0].charAt(0)+n[1].charAt(0)+n[2].charAt(0)+n[3].charAt(0):n.join("")}function Fl(t,e,o,r){let i=t/100,n=e/100,a=o/100,s=r/100,l=255*(1-i)*(1-s),u=255*(1-n)*(1-s),m=255*(1-a)*(1-s);return{r:l,g:u,b:m}}function Gn(t,e,o){let r=1-t/255,i=1-e/255,n=1-o/255,a=Math.min(r,i,n);return a===1?(r=0,i=0,n=0):(r=(r-a)/(1-a)*100,i=(i-a)/(1-a)*100,n=(n-a)/(1-a)*100),a*=100,{c:Math.round(r),m:Math.round(i),y:Math.round(n),k:Math.round(a)}}function Ud(t){return Math.round(parseFloat(t)*255).toString(16)}function jn(t){return re(t)/255}function re(t){return parseInt(t,16)}function Bl(t){return{r:t>>16,g:(t&65280)>>8,b:t&255}}var Ir={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",goldenrod:"#daa520",gold:"#ffd700",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavenderblush:"#fff0f5",lavender:"#e6e6fa",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};function Nl(t){let e={r:0,g:0,b:0},o=1,r=null,i=null,n=null,a=!1,s=!1;return typeof t=="string"&&(t=Kd(t)),typeof t=="object"&&(me(t.r)&&me(t.g)&&me(t.b)?(e=Il(t.r,t.g,t.b),a=!0,s=String(t.r).substr(-1)==="%"?"prgb":"rgb"):me(t.h)&&me(t.s)&&me(t.v)?(r=Lr(t.s),i=Lr(t.v),e=Ol(t.h,r,i),a=!0,s="hsv"):me(t.h)&&me(t.s)&&me(t.l)?(r=Lr(t.s),n=Lr(t.l),e=Dl(t.h,r,n),a=!0,s="hsl"):me(t.c)&&me(t.m)&&me(t.y)&&me(t.k)&&(e=Fl(t.c,t.m,t.y,t.k),a=!0,s="cmyk"),Object.prototype.hasOwnProperty.call(t,"a")&&(o=t.a)),o=Di(o),{ok:a,format:t.format||s,r:Math.min(255,Math.max(e.r,0)),g:Math.min(255,Math.max(e.g,0)),b:Math.min(255,Math.max(e.b,0)),a:o}}var Gd="[-\\+]?\\d+%?",jd="[-\\+]?\\d*\\.\\d+%?",Je="(?:"+jd+")|(?:"+Gd+")",Kn="[\\s|\\(]+("+Je+")[,|\\s]+("+Je+")[,|\\s]+("+Je+")\\s*\\)?",Oi="[\\s|\\(]+("+Je+")[,|\\s]+("+Je+")[,|\\s]+("+Je+")[,|\\s]+("+Je+")\\s*\\)?",we={CSS_UNIT:new RegExp(Je),rgb:new RegExp("rgb"+Kn),rgba:new RegExp("rgba"+Oi),hsl:new RegExp("hsl"+Kn),hsla:new RegExp("hsla"+Oi),hsv:new RegExp("hsv"+Kn),hsva:new RegExp("hsva"+Oi),cmyk:new RegExp("cmyk"+Oi),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/};function Kd(t){if(t=t.trim().toLowerCase(),t.length===0)return!1;let e=!1;if(Ir[t])t=Ir[t],e=!0;else if(t==="transparent")return{r:0,g:0,b:0,a:0,format:"name"};let o=we.rgb.exec(t);return o?{r:o[1],g:o[2],b:o[3]}:(o=we.rgba.exec(t),o?{r:o[1],g:o[2],b:o[3],a:o[4]}:(o=we.hsl.exec(t),o?{h:o[1],s:o[2],l:o[3]}:(o=we.hsla.exec(t),o?{h:o[1],s:o[2],l:o[3],a:o[4]}:(o=we.hsv.exec(t),o?{h:o[1],s:o[2],v:o[3]}:(o=we.hsva.exec(t),o?{h:o[1],s:o[2],v:o[3],a:o[4]}:(o=we.cmyk.exec(t),o?{c:o[1],m:o[2],y:o[3],k:o[4]}:(o=we.hex8.exec(t),o?{r:re(o[1]),g:re(o[2]),b:re(o[3]),a:jn(o[4]),format:e?"name":"hex8"}:(o=we.hex6.exec(t),o?{r:re(o[1]),g:re(o[2]),b:re(o[3]),format:e?"name":"hex"}:(o=we.hex4.exec(t),o?{r:re(o[1]+o[1]),g:re(o[2]+o[2]),b:re(o[3]+o[3]),a:jn(o[4]+o[4]),format:e?"name":"hex8"}:(o=we.hex3.exec(t),o?{r:re(o[1]+o[1]),g:re(o[2]+o[2]),b:re(o[3]+o[3]),format:e?"name":"hex"}:!1))))))))))}function me(t){return typeof t=="number"?!Number.isNaN(t):we.CSS_UNIT.test(t)}var Dr=class t{constructor(e="",o={}){if(e instanceof t)return e;typeof e=="number"&&(e=Bl(e)),this.originalInput=e;let r=Nl(e);this.originalInput=e,this.r=r.r,this.g=r.g,this.b=r.b,this.a=r.a,this.roundA=Math.round(100*this.a)/100,this.format=o.format??r.format,this.gradientType=o.gradientType,this.r<1&&(this.r=Math.round(this.r)),this.g<1&&(this.g=Math.round(this.g)),this.b<1&&(this.b=Math.round(this.b)),this.isValid=r.ok}isDark(){return this.getBrightness()<128}isLight(){return!this.isDark()}getBrightness(){let e=this.toRgb();return(e.r*299+e.g*587+e.b*114)/1e3}getLuminance(){let e=this.toRgb(),o,r,i,n=e.r/255,a=e.g/255,s=e.b/255;return n<=.03928?o=n/12.92:o=Math.pow((n+.055)/1.055,2.4),a<=.03928?r=a/12.92:r=Math.pow((a+.055)/1.055,2.4),s<=.03928?i=s/12.92:i=Math.pow((s+.055)/1.055,2.4),.2126*o+.7152*r+.0722*i}getAlpha(){return this.a}setAlpha(e){return this.a=Di(e),this.roundA=Math.round(100*this.a)/100,this}isMonochrome(){let{s:e}=this.toHsl();return e===0}toHsv(){let e=Vn(this.r,this.g,this.b);return{h:e.h*360,s:e.s,v:e.v,a:this.a}}toHsvString(){let e=Vn(this.r,this.g,this.b),o=Math.round(e.h*360),r=Math.round(e.s*100),i=Math.round(e.v*100);return this.a===1?`hsv(${o}, ${r}%, ${i}%)`:`hsva(${o}, ${r}%, ${i}%, ${this.roundA})`}toHsl(){let e=Hn(this.r,this.g,this.b);return{h:e.h*360,s:e.s,l:e.l,a:this.a}}toHslString(){let e=Hn(this.r,this.g,this.b),o=Math.round(e.h*360),r=Math.round(e.s*100),i=Math.round(e.l*100);return this.a===1?`hsl(${o}, ${r}%, ${i}%)`:`hsla(${o}, ${r}%, ${i}%, ${this.roundA})`}toHex(e=!1){return Un(this.r,this.g,this.b,e)}toHexString(e=!1){return"#"+this.toHex(e)}toHex8(e=!1){return Rl(this.r,this.g,this.b,this.a,e)}toHex8String(e=!1){return"#"+this.toHex8(e)}toHexShortString(e=!1){return this.a===1?this.toHexString(e):this.toHex8String(e)}toRgb(){return{r:Math.round(this.r),g:Math.round(this.g),b:Math.round(this.b),a:this.a}}toRgbString(){let e=Math.round(this.r),o=Math.round(this.g),r=Math.round(this.b);return this.a===1?`rgb(${e}, ${o}, ${r})`:`rgba(${e}, ${o}, ${r}, ${this.roundA})`}toPercentageRgb(){let e=o=>`${Math.round(Bt(o,255)*100)}%`;return{r:e(this.r),g:e(this.g),b:e(this.b),a:this.a}}toPercentageRgbString(){let e=o=>Math.round(Bt(o,255)*100);return this.a===1?`rgb(${e(this.r)}%, ${e(this.g)}%, ${e(this.b)}%)`:`rgba(${e(this.r)}%, ${e(this.g)}%, ${e(this.b)}%, ${this.roundA})`}toCmyk(){return{...Gn(this.r,this.g,this.b)}}toCmykString(){let{c:e,m:o,y:r,k:i}=Gn(this.r,this.g,this.b);return`cmyk(${e}, ${o}, ${r}, ${i})`}toName(){if(this.a===0)return"transparent";if(this.a<1)return!1;let e="#"+Un(this.r,this.g,this.b,!1);for(let[o,r]of Object.entries(Ir))if(e===r)return o;return!1}toString(e){let o=!!e;e=e??this.format;let r=!1,i=this.a<1&&this.a>=0;return!o&&i&&(e.startsWith("hex")||e==="name")?e==="name"&&this.a===0?this.toName():this.toRgbString():(e==="rgb"&&(r=this.toRgbString()),e==="prgb"&&(r=this.toPercentageRgbString()),(e==="hex"||e==="hex6")&&(r=this.toHexString()),e==="hex3"&&(r=this.toHexString(!0)),e==="hex4"&&(r=this.toHex8String(!0)),e==="hex8"&&(r=this.toHex8String()),e==="name"&&(r=this.toName()),e==="hsl"&&(r=this.toHslString()),e==="hsv"&&(r=this.toHsvString()),e==="cmyk"&&(r=this.toCmykString()),r||this.toHexString())}toNumber(){return(Math.round(this.r)<<16)+(Math.round(this.g)<<8)+Math.round(this.b)}clone(){return new t(this.toString())}lighten(e=10){let o=this.toHsl();return o.l+=e/100,o.l=$r(o.l),new t(o)}brighten(e=10){let o=this.toRgb();return o.r=Math.max(0,Math.min(255,o.r-Math.round(255*-(e/100)))),o.g=Math.max(0,Math.min(255,o.g-Math.round(255*-(e/100)))),o.b=Math.max(0,Math.min(255,o.b-Math.round(255*-(e/100)))),new t(o)}darken(e=10){let o=this.toHsl();return o.l-=e/100,o.l=$r(o.l),new t(o)}tint(e=10){return this.mix("white",e)}shade(e=10){return this.mix("black",e)}desaturate(e=10){let o=this.toHsl();return o.s-=e/100,o.s=$r(o.s),new t(o)}saturate(e=10){let o=this.toHsl();return o.s+=e/100,o.s=$r(o.s),new t(o)}greyscale(){return this.desaturate(100)}spin(e){let o=this.toHsl(),r=(o.h+e)%360;return o.h=r<0?360+r:r,new t(o)}mix(e,o=50){let r=this.toRgb(),i=new t(e).toRgb(),n=o/100,a={r:(i.r-r.r)*n+r.r,g:(i.g-r.g)*n+r.g,b:(i.b-r.b)*n+r.b,a:(i.a-r.a)*n+r.a};return new t(a)}analogous(e=6,o=30){let r=this.toHsl(),i=360/o,n=[this];for(r.h=(r.h-(i*e>>1)+720)%360;--e;)r.h=(r.h+i)%360,n.push(new t(r));return n}complement(){let e=this.toHsl();return e.h=(e.h+180)%360,new t(e)}monochromatic(e=6){let o=this.toHsv(),{h:r}=o,{s:i}=o,{v:n}=o,a=[],s=1/e;for(;e--;)a.push(new t({h:r,s:i,v:n})),n=(n+s)%1;return a}splitcomplement(){let e=this.toHsl(),{h:o}=e;return[this,new t({h:(o+72)%360,s:e.s,l:e.l}),new t({h:(o+216)%360,s:e.s,l:e.l})]}onBackground(e){let o=this.toRgb(),r=new t(e).toRgb(),i=o.a+r.a*(1-o.a);return new t({r:(o.r*o.a+r.r*r.a*(1-o.a))/i,g:(o.g*o.a+r.g*r.a*(1-o.a))/i,b:(o.b*o.a+r.b*r.a*(1-o.a))/i,a:i})}triad(){return this.polyad(3)}tetrad(){return this.polyad(4)}polyad(e){let o=this.toHsl(),{h:r}=o,i=[this],n=360/e;for(let a=1;a<e;a++)i.push(new t({h:(r+a*n)%360,s:o.s,l:o.l}));return i}equals(e){let o=new t(e);return this.format==="cmyk"||o.format==="cmyk"?this.toCmykString()===o.toCmykString():this.toRgbString()===o.toRgbString()}};var zl="EyeDropper"in window,tt=class extends q{constructor(){super(),this.formControlController=new Ko(this),this.isSafeValue=!1,this.localize=new Tt(this),this.hasFocus=!1,this.isDraggingGridHandle=!1,this.isEmpty=!1,this.inputValue="",this.hue=0,this.saturation=100,this.brightness=100,this.alpha=100,this.value="",this.defaultValue="",this.label="",this.format="hex",this.inline=!1,this.size="medium",this.noFormatToggle=!1,this.name="",this.disabled=!1,this.hoist=!1,this.opacity=!1,this.uppercase=!1,this.swatches="",this.form="",this.required=!1,this.handleFocusIn=()=>{this.hasFocus=!0,this.emit("sl-focus")},this.handleFocusOut=()=>{this.hasFocus=!1,this.emit("sl-blur")},this.addEventListener("focusin",this.handleFocusIn),this.addEventListener("focusout",this.handleFocusOut)}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.input.updateComplete.then(()=>{this.formControlController.updateValidity()})}handleCopy(){this.input.select(),document.execCommand("copy"),this.previewButton.focus(),this.previewButton.classList.add("color-picker__preview-color--copied"),this.previewButton.addEventListener("animationend",()=>{this.previewButton.classList.remove("color-picker__preview-color--copied")})}handleFormatToggle(){let t=["hex","rgb","hsl","hsv"],e=(t.indexOf(this.format)+1)%t.length;this.format=t[e],this.setColor(this.value),this.emit("sl-change"),this.emit("sl-input")}handleAlphaDrag(t){let e=this.shadowRoot.querySelector(".color-picker__slider.color-picker__alpha"),o=e.querySelector(".color-picker__slider-handle"),{width:r}=e.getBoundingClientRect(),i=this.value,n=this.value;o.focus(),t.preventDefault(),ki(e,{onMove:a=>{this.alpha=fe(a/r*100,0,100),this.syncValues(),this.value!==n&&(n=this.value,this.emit("sl-input"))},onStop:()=>{this.value!==i&&(i=this.value,this.emit("sl-change"))},initialEvent:t})}handleHueDrag(t){let e=this.shadowRoot.querySelector(".color-picker__slider.color-picker__hue"),o=e.querySelector(".color-picker__slider-handle"),{width:r}=e.getBoundingClientRect(),i=this.value,n=this.value;o.focus(),t.preventDefault(),ki(e,{onMove:a=>{this.hue=fe(a/r*360,0,360),this.syncValues(),this.value!==n&&(n=this.value,this.emit("sl-input"))},onStop:()=>{this.value!==i&&(i=this.value,this.emit("sl-change"))},initialEvent:t})}handleGridDrag(t){let e=this.shadowRoot.querySelector(".color-picker__grid"),o=e.querySelector(".color-picker__grid-handle"),{width:r,height:i}=e.getBoundingClientRect(),n=this.value,a=this.value;o.focus(),t.preventDefault(),this.isDraggingGridHandle=!0,ki(e,{onMove:(s,l)=>{this.saturation=fe(s/r*100,0,100),this.brightness=fe(100-l/i*100,0,100),this.syncValues(),this.value!==a&&(a=this.value,this.emit("sl-input"))},onStop:()=>{this.isDraggingGridHandle=!1,this.value!==n&&(n=this.value,this.emit("sl-change"))},initialEvent:t})}handleAlphaKeyDown(t){let e=t.shiftKey?10:1,o=this.value;t.key==="ArrowLeft"&&(t.preventDefault(),this.alpha=fe(this.alpha-e,0,100),this.syncValues()),t.key==="ArrowRight"&&(t.preventDefault(),this.alpha=fe(this.alpha+e,0,100),this.syncValues()),t.key==="Home"&&(t.preventDefault(),this.alpha=0,this.syncValues()),t.key==="End"&&(t.preventDefault(),this.alpha=100,this.syncValues()),this.value!==o&&(this.emit("sl-change"),this.emit("sl-input"))}handleHueKeyDown(t){let e=t.shiftKey?10:1,o=this.value;t.key==="ArrowLeft"&&(t.preventDefault(),this.hue=fe(this.hue-e,0,360),this.syncValues()),t.key==="ArrowRight"&&(t.preventDefault(),this.hue=fe(this.hue+e,0,360),this.syncValues()),t.key==="Home"&&(t.preventDefault(),this.hue=0,this.syncValues()),t.key==="End"&&(t.preventDefault(),this.hue=360,this.syncValues()),this.value!==o&&(this.emit("sl-change"),this.emit("sl-input"))}handleGridKeyDown(t){let e=t.shiftKey?10:1,o=this.value;t.key==="ArrowLeft"&&(t.preventDefault(),this.saturation=fe(this.saturation-e,0,100),this.syncValues()),t.key==="ArrowRight"&&(t.preventDefault(),this.saturation=fe(this.saturation+e,0,100),this.syncValues()),t.key==="ArrowUp"&&(t.preventDefault(),this.brightness=fe(this.brightness+e,0,100),this.syncValues()),t.key==="ArrowDown"&&(t.preventDefault(),this.brightness=fe(this.brightness-e,0,100),this.syncValues()),this.value!==o&&(this.emit("sl-change"),this.emit("sl-input"))}handleInputChange(t){let e=t.target,o=this.value;t.stopPropagation(),this.input.value?(this.setColor(e.value),e.value=this.value):this.value="",this.value!==o&&(this.emit("sl-change"),this.emit("sl-input"))}handleInputInput(t){this.formControlController.updateValidity(),t.stopPropagation()}handleInputKeyDown(t){if(t.key==="Enter"){let e=this.value;this.input.value?(this.setColor(this.input.value),this.input.value=this.value,this.value!==e&&(this.emit("sl-change"),this.emit("sl-input")),setTimeout(()=>this.input.select())):this.hue=0}}handleInputInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleTouchMove(t){t.preventDefault()}parseColor(t){let e=new Dr(t);if(!e.isValid)return null;let o=e.toHsl(),r={h:o.h,s:o.s*100,l:o.l*100,a:o.a},i=e.toRgb(),n=e.toHexString(),a=e.toHex8String(),s=e.toHsv(),l={h:s.h,s:s.s*100,v:s.v*100,a:s.a};return{hsl:{h:r.h,s:r.s,l:r.l,string:this.setLetterCase(`hsl(${Math.round(r.h)}, ${Math.round(r.s)}%, ${Math.round(r.l)}%)`)},hsla:{h:r.h,s:r.s,l:r.l,a:r.a,string:this.setLetterCase(`hsla(${Math.round(r.h)}, ${Math.round(r.s)}%, ${Math.round(r.l)}%, ${r.a.toFixed(2).toString()})`)},hsv:{h:l.h,s:l.s,v:l.v,string:this.setLetterCase(`hsv(${Math.round(l.h)}, ${Math.round(l.s)}%, ${Math.round(l.v)}%)`)},hsva:{h:l.h,s:l.s,v:l.v,a:l.a,string:this.setLetterCase(`hsva(${Math.round(l.h)}, ${Math.round(l.s)}%, ${Math.round(l.v)}%, ${l.a.toFixed(2).toString()})`)},rgb:{r:i.r,g:i.g,b:i.b,string:this.setLetterCase(`rgb(${Math.round(i.r)}, ${Math.round(i.g)}, ${Math.round(i.b)})`)},rgba:{r:i.r,g:i.g,b:i.b,a:i.a,string:this.setLetterCase(`rgba(${Math.round(i.r)}, ${Math.round(i.g)}, ${Math.round(i.b)}, ${i.a.toFixed(2).toString()})`)},hex:this.setLetterCase(n),hexa:this.setLetterCase(a)}}setColor(t){let e=this.parseColor(t);return e===null?!1:(this.hue=e.hsva.h,this.saturation=e.hsva.s,this.brightness=e.hsva.v,this.alpha=this.opacity?e.hsva.a*100:100,this.syncValues(),!0)}setLetterCase(t){return typeof t!="string"?"":this.uppercase?t.toUpperCase():t.toLowerCase()}async syncValues(){let t=this.parseColor(`hsva(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha/100})`);t!==null&&(this.format==="hsl"?this.inputValue=this.opacity?t.hsla.string:t.hsl.string:this.format==="rgb"?this.inputValue=this.opacity?t.rgba.string:t.rgb.string:this.format==="hsv"?this.inputValue=this.opacity?t.hsva.string:t.hsv.string:this.inputValue=this.opacity?t.hexa:t.hex,this.isSafeValue=!0,this.value=this.inputValue,await this.updateComplete,this.isSafeValue=!1)}handleAfterHide(){this.previewButton.classList.remove("color-picker__preview-color--copied")}handleEyeDropper(){if(!zl)return;new EyeDropper().open().then(e=>{let o=this.value;this.setColor(e.sRGBHex),this.value!==o&&(this.emit("sl-change"),this.emit("sl-input"))}).catch(()=>{})}selectSwatch(t){let e=this.value;this.disabled||(this.setColor(t),this.value!==e&&(this.emit("sl-change"),this.emit("sl-input")))}getHexString(t,e,o,r=100){let i=new Dr(`hsva(${t}, ${e}%, ${o}%, ${r/100})`);return i.isValid?i.toHex8String():""}stopNestedEventPropagation(t){t.stopImmediatePropagation()}handleFormatChange(){this.syncValues()}handleOpacityChange(){this.alpha=100}handleValueChange(t,e){if(this.isEmpty=!e,e||(this.hue=0,this.saturation=0,this.brightness=100,this.alpha=100),!this.isSafeValue){let o=this.parseColor(e);o!==null?(this.inputValue=this.value,this.hue=o.hsva.h,this.saturation=o.hsva.s,this.brightness=o.hsva.v,this.alpha=o.hsva.a*100,this.syncValues()):this.inputValue=t??""}}focus(t){this.inline?this.base.focus(t):this.trigger.focus(t)}blur(){var t;let e=this.inline?this.base:this.trigger;this.hasFocus&&(e.focus({preventScroll:!0}),e.blur()),(t=this.dropdown)!=null&&t.open&&this.dropdown.hide()}getFormattedValue(t="hex"){let e=this.parseColor(`hsva(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha/100})`);if(e===null)return"";switch(t){case"hex":return e.hex;case"hexa":return e.hexa;case"rgb":return e.rgb.string;case"rgba":return e.rgba.string;case"hsl":return e.hsl.string;case"hsla":return e.hsla.string;case"hsv":return e.hsv.string;case"hsva":return e.hsva.string;default:return""}}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return!this.inline&&!this.validity.valid?(this.dropdown.show(),this.addEventListener("sl-after-show",()=>this.input.reportValidity(),{once:!0}),this.disabled||this.formControlController.emitInvalidEvent(),!1):this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.saturation,e=100-this.brightness,o=Array.isArray(this.swatches)?this.swatches:this.swatches.split(";").filter(i=>i.trim()!==""),r=I`
      <div
        part="base"
        class=${bt({"color-picker":!0,"color-picker--inline":this.inline,"color-picker--disabled":this.disabled,"color-picker--focused":this.hasFocus})}
        aria-disabled=${this.disabled?"true":"false"}
        aria-labelledby="label"
        tabindex=${this.inline?"0":"-1"}
      >
        ${this.inline?I`
              <sl-visually-hidden id="label">
                <slot name="label">${this.label}</slot>
              </sl-visually-hidden>
            `:null}

        <div
          part="grid"
          class="color-picker__grid"
          style=${Ue({backgroundColor:this.getHexString(this.hue,100,100)})}
          @pointerdown=${this.handleGridDrag}
          @touchmove=${this.handleTouchMove}
        >
          <span
            part="grid-handle"
            class=${bt({"color-picker__grid-handle":!0,"color-picker__grid-handle--dragging":this.isDraggingGridHandle})}
            style=${Ue({top:`${e}%`,left:`${t}%`,backgroundColor:this.getHexString(this.hue,this.saturation,this.brightness,this.alpha)})}
            role="application"
            aria-label="HSV"
            tabindex=${B(this.disabled?void 0:"0")}
            @keydown=${this.handleGridKeyDown}
          ></span>
        </div>

        <div class="color-picker__controls">
          <div class="color-picker__sliders">
            <div
              part="slider hue-slider"
              class="color-picker__hue color-picker__slider"
              @pointerdown=${this.handleHueDrag}
              @touchmove=${this.handleTouchMove}
            >
              <span
                part="slider-handle hue-slider-handle"
                class="color-picker__slider-handle"
                style=${Ue({left:`${this.hue===0?0:100/(360/this.hue)}%`})}
                role="slider"
                aria-label="hue"
                aria-orientation="horizontal"
                aria-valuemin="0"
                aria-valuemax="360"
                aria-valuenow=${`${Math.round(this.hue)}`}
                tabindex=${B(this.disabled?void 0:"0")}
                @keydown=${this.handleHueKeyDown}
              ></span>
            </div>

            ${this.opacity?I`
                  <div
                    part="slider opacity-slider"
                    class="color-picker__alpha color-picker__slider color-picker__transparent-bg"
                    @pointerdown="${this.handleAlphaDrag}"
                    @touchmove=${this.handleTouchMove}
                  >
                    <div
                      class="color-picker__alpha-gradient"
                      style=${Ue({backgroundImage:`linear-gradient(
                          to right,
                          ${this.getHexString(this.hue,this.saturation,this.brightness,0)} 0%,
                          ${this.getHexString(this.hue,this.saturation,this.brightness,100)} 100%
                        )`})}
                    ></div>
                    <span
                      part="slider-handle opacity-slider-handle"
                      class="color-picker__slider-handle"
                      style=${Ue({left:`${this.alpha}%`})}
                      role="slider"
                      aria-label="alpha"
                      aria-orientation="horizontal"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow=${Math.round(this.alpha)}
                      tabindex=${B(this.disabled?void 0:"0")}
                      @keydown=${this.handleAlphaKeyDown}
                    ></span>
                  </div>
                `:""}
          </div>

          <button
            type="button"
            part="preview"
            class="color-picker__preview color-picker__transparent-bg"
            aria-label=${this.localize.term("copy")}
            style=${Ue({"--preview-color":this.getHexString(this.hue,this.saturation,this.brightness,this.alpha)})}
            @click=${this.handleCopy}
          ></button>
        </div>

        <div class="color-picker__user-input" aria-live="polite">
          <sl-input
            part="input"
            type="text"
            name=${this.name}
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            value=${this.isEmpty?"":this.inputValue}
            ?required=${this.required}
            ?disabled=${this.disabled}
            aria-label=${this.localize.term("currentValue")}
            @keydown=${this.handleInputKeyDown}
            @sl-change=${this.handleInputChange}
            @sl-input=${this.handleInputInput}
            @sl-invalid=${this.handleInputInvalid}
            @sl-blur=${this.stopNestedEventPropagation}
            @sl-focus=${this.stopNestedEventPropagation}
          ></sl-input>

          <sl-button-group>
            ${this.noFormatToggle?"":I`
                  <sl-button
                    part="format-button"
                    aria-label=${this.localize.term("toggleColorFormat")}
                    exportparts="
                      base:format-button__base,
                      prefix:format-button__prefix,
                      label:format-button__label,
                      suffix:format-button__suffix,
                      caret:format-button__caret
                    "
                    @click=${this.handleFormatToggle}
                    @sl-blur=${this.stopNestedEventPropagation}
                    @sl-focus=${this.stopNestedEventPropagation}
                  >
                    ${this.setLetterCase(this.format)}
                  </sl-button>
                `}
            ${zl?I`
                  <sl-button
                    part="eye-dropper-button"
                    exportparts="
                      base:eye-dropper-button__base,
                      prefix:eye-dropper-button__prefix,
                      label:eye-dropper-button__label,
                      suffix:eye-dropper-button__suffix,
                      caret:eye-dropper-button__caret
                    "
                    @click=${this.handleEyeDropper}
                    @sl-blur=${this.stopNestedEventPropagation}
                    @sl-focus=${this.stopNestedEventPropagation}
                  >
                    <sl-icon
                      library="system"
                      name="eyedropper"
                      label=${this.localize.term("selectAColorFromTheScreen")}
                    ></sl-icon>
                  </sl-button>
                `:""}
          </sl-button-group>
        </div>

        ${o.length>0?I`
              <div part="swatches" class="color-picker__swatches">
                ${o.map(i=>{let n=this.parseColor(i);return n?I`
                    <div
                      part="swatch"
                      class="color-picker__swatch color-picker__transparent-bg"
                      tabindex=${B(this.disabled?void 0:"0")}
                      role="button"
                      aria-label=${i}
                      @click=${()=>this.selectSwatch(i)}
                      @keydown=${a=>!this.disabled&&a.key==="Enter"&&this.setColor(n.hexa)}
                    >
                      <div
                        class="color-picker__swatch-color"
                        style=${Ue({backgroundColor:n.hexa})}
                      ></div>
                    </div>
                  `:""})}
              </div>
            `:""}
      </div>
    `;return this.inline?r:I`
      <sl-dropdown
        class="color-dropdown"
        aria-disabled=${this.disabled?"true":"false"}
        .containingElement=${this}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        @sl-after-hide=${this.handleAfterHide}
      >
        <button
          part="trigger"
          slot="trigger"
          class=${bt({"color-dropdown__trigger":!0,"color-dropdown__trigger--disabled":this.disabled,"color-dropdown__trigger--small":this.size==="small","color-dropdown__trigger--medium":this.size==="medium","color-dropdown__trigger--large":this.size==="large","color-dropdown__trigger--empty":this.isEmpty,"color-dropdown__trigger--focused":this.hasFocus,"color-picker__transparent-bg":!0})}
          style=${Ue({color:this.getHexString(this.hue,this.saturation,this.brightness,this.alpha)})}
          type="button"
        >
          <sl-visually-hidden>
            <slot name="label">${this.label}</slot>
          </sl-visually-hidden>
        </button>
        ${r}
      </sl-dropdown>
    `}};tt.styles=[J,$l];tt.dependencies={"sl-button-group":Xe,"sl-button":at,"sl-dropdown":Ft,"sl-icon":Mt,"sl-input":H,"sl-visually-hidden":Sr};p([K('[part~="base"]')],tt.prototype,"base",2);p([K('[part~="input"]')],tt.prototype,"input",2);p([K(".color-dropdown")],tt.prototype,"dropdown",2);p([K('[part~="preview"]')],tt.prototype,"previewButton",2);p([K('[part~="trigger"]')],tt.prototype,"trigger",2);p([Pt()],tt.prototype,"hasFocus",2);p([Pt()],tt.prototype,"isDraggingGridHandle",2);p([Pt()],tt.prototype,"isEmpty",2);p([Pt()],tt.prototype,"inputValue",2);p([Pt()],tt.prototype,"hue",2);p([Pt()],tt.prototype,"saturation",2);p([Pt()],tt.prototype,"brightness",2);p([Pt()],tt.prototype,"alpha",2);p([y()],tt.prototype,"value",2);p([wi()],tt.prototype,"defaultValue",2);p([y()],tt.prototype,"label",2);p([y()],tt.prototype,"format",2);p([y({type:Boolean,reflect:!0})],tt.prototype,"inline",2);p([y({reflect:!0})],tt.prototype,"size",2);p([y({attribute:"no-format-toggle",type:Boolean})],tt.prototype,"noFormatToggle",2);p([y()],tt.prototype,"name",2);p([y({type:Boolean,reflect:!0})],tt.prototype,"disabled",2);p([y({type:Boolean})],tt.prototype,"hoist",2);p([y({type:Boolean})],tt.prototype,"opacity",2);p([y({type:Boolean})],tt.prototype,"uppercase",2);p([y()],tt.prototype,"swatches",2);p([y({reflect:!0})],tt.prototype,"form",2);p([y({type:Boolean,reflect:!0})],tt.prototype,"required",2);p([Aa({passive:!1})],tt.prototype,"handleTouchMove",1);p([ut("format",{waitUntilFirstUpdate:!0})],tt.prototype,"handleFormatChange",1);p([ut("opacity",{waitUntilFirstUpdate:!0})],tt.prototype,"handleOpacityChange",1);p([ut("value")],tt.prototype,"handleValueChange",1);tt.define("sl-color-picker");var Or=[],Hl=class{constructor(t){this.tabDirection="forward",this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=e=>{var o;if(e.key!=="Tab"||this.isExternalActivated||!this.isActive())return;let r=Si();if(this.previousFocus=r,this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;e.shiftKey?this.tabDirection="backward":this.tabDirection="forward";let i=Ei(this.element),n=i.findIndex(s=>s===r);this.previousFocus=this.currentFocus;let a=this.tabDirection==="forward"?1:-1;for(;;){n+a>=i.length?n=0:n+a<0?n=i.length-1:n+=a,this.previousFocus=this.currentFocus;let s=i[n];if(this.tabDirection==="backward"&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus)||s&&this.possiblyHasTabbableChildren(s))return;e.preventDefault(),this.currentFocus=s,(o=this.currentFocus)==null||o.focus({preventScroll:!1});let l=[...xi()];if(l.includes(this.currentFocus)||!l.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())},this.handleKeyUp=()=>{this.tabDirection="forward"},this.element=t,this.elementsWithTabbableControls=["iframe"]}activate(){Or.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){Or=Or.filter(t=>t!==this.element),this.currentFocus=null,document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return Or[Or.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){if(this.isActive()&&!this.isExternalActivated){let t=Ei(this.element);if(!this.element.matches(":focus-within")){let e=t[0],o=t[t.length-1],r=this.tabDirection==="forward"?e:o;typeof r?.focus=="function"&&(this.currentFocus=r,r.focus({preventScroll:!1}))}}}possiblyHasTabbableChildren(t){return this.elementsWithTabbableControls.includes(t.tagName.toLowerCase())||t.hasAttribute("controls")}};var qn=new Set;function qd(){let t=document.documentElement.clientWidth;return Math.abs(window.innerWidth-t)}function Wd(){let t=Number(getComputedStyle(document.body).paddingRight.replace(/px/,""));return isNaN(t)||!t?0:t}function Wn(t){if(qn.add(t),!document.documentElement.classList.contains("sl-scroll-lock")){let e=qd()+Wd(),o=getComputedStyle(document.documentElement).scrollbarGutter;(!o||o==="auto")&&(o="stable"),e<2&&(o=""),document.documentElement.style.setProperty("--sl-scroll-lock-gutter",o),document.documentElement.classList.add("sl-scroll-lock"),document.documentElement.style.setProperty("--sl-scroll-lock-size",`${e}px`)}}function Zn(t){qn.delete(t),qn.size===0&&(document.documentElement.classList.remove("sl-scroll-lock"),document.documentElement.style.removeProperty("--sl-scroll-lock-size"))}var Vl=G`
  :host {
    --width: 31rem;
    --header-spacing: var(--sl-spacing-large);
    --body-spacing: var(--sl-spacing-large);
    --footer-spacing: var(--sl-spacing-large);

    display: contents;
  }

  .dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--sl-z-index-dialog);
  }

  .dialog__panel {
    display: flex;
    flex-direction: column;
    z-index: 2;
    width: var(--width);
    max-width: calc(100% - var(--sl-spacing-2x-large));
    max-height: calc(100% - var(--sl-spacing-2x-large));
    background-color: var(--sl-panel-background-color);
    border-radius: var(--sl-border-radius-medium);
    box-shadow: var(--sl-shadow-x-large);
  }

  .dialog__panel:focus {
    outline: none;
  }

  /* Ensure there's enough vertical padding for phones that don't update vh when chrome appears (e.g. iPhone) */
  @media screen and (max-width: 420px) {
    .dialog__panel {
      max-height: 80vh;
    }
  }

  .dialog--open .dialog__panel {
    display: flex;
    opacity: 1;
  }

  .dialog__header {
    flex: 0 0 auto;
    display: flex;
  }

  .dialog__title {
    flex: 1 1 auto;
    font: inherit;
    font-size: var(--sl-font-size-large);
    line-height: var(--sl-line-height-dense);
    padding: var(--header-spacing);
    margin: 0;
  }

  .dialog__header-actions {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--sl-spacing-2x-small);
    padding: 0 var(--header-spacing);
  }

  .dialog__header-actions sl-icon-button,
  .dialog__header-actions ::slotted(sl-icon-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-medium);
  }

  .dialog__body {
    flex: 1 1 auto;
    display: block;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .dialog__footer {
    flex: 0 0 auto;
    text-align: right;
    padding: var(--footer-spacing);
  }

  .dialog__footer ::slotted(sl-button:not(:first-of-type)) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  .dialog:not(.dialog--has-footer) .dialog__footer {
    display: none;
  }

  .dialog__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--sl-overlay-background-color);
  }

  @media (forced-colors: active) {
    .dialog__panel {
      border: solid 1px var(--sl-color-neutral-0);
    }
  }
`;var Me=class extends q{constructor(){super(...arguments),this.hasSlotController=new Ie(this,"footer"),this.localize=new Tt(this),this.modal=new Hl(this),this.open=!1,this.label="",this.noHeader=!1,this.handleDocumentKeyDown=t=>{t.key==="Escape"&&this.modal.isActive()&&this.open&&(t.stopPropagation(),this.requestClose("keyboard"))}}firstUpdated(){this.dialog.hidden=!this.open,this.open&&(this.addOpenListeners(),this.modal.activate(),Wn(this))}disconnectedCallback(){super.disconnectedCallback(),this.modal.deactivate(),Zn(this),this.removeOpenListeners()}requestClose(t){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:t}}).defaultPrevented){let o=Qt(this,"dialog.denyClose",{dir:this.localize.dir()});Jt(this.panel,o.keyframes,o.options);return}this.hide()}addOpenListeners(){var t;"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose("keyboard")):document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){var t;(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.modal.activate(),Wn(this);let t=this.querySelector("[autofocus]");t&&t.removeAttribute("autofocus"),await Promise.all([ee(this.dialog),ee(this.overlay)]),this.dialog.hidden=!1,requestAnimationFrame(()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(t?t.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),t&&t.setAttribute("autofocus","")});let e=Qt(this,"dialog.show",{dir:this.localize.dir()}),o=Qt(this,"dialog.overlay.show",{dir:this.localize.dir()});await Promise.all([Jt(this.panel,e.keyframes,e.options),Jt(this.overlay,o.keyframes,o.options)]),this.emit("sl-after-show")}else{ri(this),this.emit("sl-hide"),this.removeOpenListeners(),this.modal.deactivate(),await Promise.all([ee(this.dialog),ee(this.overlay)]);let t=Qt(this,"dialog.hide",{dir:this.localize.dir()}),e=Qt(this,"dialog.overlay.hide",{dir:this.localize.dir()});await Promise.all([Jt(this.overlay,e.keyframes,e.options).then(()=>{this.overlay.hidden=!0}),Jt(this.panel,t.keyframes,t.options).then(()=>{this.panel.hidden=!0})]),this.dialog.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1,Zn(this);let o=this.originalTrigger;typeof o?.focus=="function"&&setTimeout(()=>o.focus()),this.emit("sl-after-hide")}}async show(){if(!this.open)return this.open=!0,ye(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ye(this,"sl-after-hide")}render(){return I`
      <div
        part="base"
        class=${bt({dialog:!0,"dialog--open":this.open,"dialog--has-footer":this.hasSlotController.test("footer")})}
      >
        <div part="overlay" class="dialog__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${B(this.noHeader?this.label:void 0)}
          aria-labelledby=${B(this.noHeader?void 0:"title")}
          tabindex="-1"
        >
          ${this.noHeader?"":I`
                <header part="header" class="dialog__header">
                  <h2 part="title" class="dialog__title" id="title">
                    <slot name="label"> ${this.label.length>0?this.label:"\uFEFF"} </slot>
                  </h2>
                  <div part="header-actions" class="dialog__header-actions">
                    <slot name="header-actions"></slot>
                    <sl-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="dialog__close"
                      name="x-lg"
                      label=${this.localize.term("close")}
                      library="system"
                      @click="${()=>this.requestClose("close-button")}"
                    ></sl-icon-button>
                  </div>
                </header>
              `}
          ${""}
          <div part="body" class="dialog__body" tabindex="-1"><slot></slot></div>

          <footer part="footer" class="dialog__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `}};Me.styles=[J,Vl];Me.dependencies={"sl-icon-button":qt};p([K(".dialog")],Me.prototype,"dialog",2);p([K(".dialog__panel")],Me.prototype,"panel",2);p([K(".dialog__overlay")],Me.prototype,"overlay",2);p([y({type:Boolean,reflect:!0})],Me.prototype,"open",2);p([y({reflect:!0})],Me.prototype,"label",2);p([y({attribute:"no-header",type:Boolean,reflect:!0})],Me.prototype,"noHeader",2);p([ut("open",{waitUntilFirstUpdate:!0})],Me.prototype,"handleOpenChange",1);Yt("dialog.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:"ease"}});Yt("dialog.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:"ease"}});Yt("dialog.denyClose",{keyframes:[{scale:1},{scale:1.02},{scale:1}],options:{duration:250}});Yt("dialog.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}});Yt("dialog.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}});Me.define("sl-dialog");var Ul=G`
  :host {
    --color: var(--sl-panel-border-color);
    --width: var(--sl-panel-border-width);
    --spacing: var(--sl-spacing-medium);
  }

  :host(:not([vertical])) {
    display: block;
    border-top: solid var(--width) var(--color);
    margin: var(--spacing) 0;
  }

  :host([vertical]) {
    display: inline-block;
    height: 100%;
    border-left: solid var(--width) var(--color);
    margin: 0 var(--spacing);
  }
`;var Rr=class extends q{constructor(){super(...arguments),this.vertical=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","separator")}handleVerticalChange(){this.setAttribute("aria-orientation",this.vertical?"vertical":"horizontal")}};Rr.styles=[J,Ul];p([y({type:Boolean,reflect:!0})],Rr.prototype,"vertical",2);p([ut("vertical")],Rr.prototype,"handleVerticalChange",1);Rr.define("sl-divider");Ft.define("sl-dropdown");Mt.define("sl-icon");H.define("sl-input");var Gl=G`
  :host {
    display: block;
    position: relative;
    background: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    padding: var(--sl-spacing-x-small) 0;
    overflow: auto;
    overscroll-behavior: none;
  }

  ::slotted(sl-divider) {
    --spacing: var(--sl-spacing-x-small);
  }
`;var Ri=class extends q{connectedCallback(){super.connectedCallback(),this.setAttribute("role","menu")}handleClick(t){let e=["menuitem","menuitemcheckbox"],o=t.composedPath(),r=o.find(s=>{var l;return e.includes(((l=s?.getAttribute)==null?void 0:l.call(s,"role"))||"")});if(!r||o.find(s=>{var l;return((l=s?.getAttribute)==null?void 0:l.call(s,"role"))==="menu"})!==this)return;let a=r;a.type==="checkbox"&&(a.checked=!a.checked),this.emit("sl-select",{detail:{item:a}})}handleKeyDown(t){if(t.key==="Enter"||t.key===" "){let e=this.getCurrentItem();t.preventDefault(),t.stopPropagation(),e?.click()}else if(["ArrowDown","ArrowUp","Home","End"].includes(t.key)){let e=this.getAllItems(),o=this.getCurrentItem(),r=o?e.indexOf(o):0;e.length>0&&(t.preventDefault(),t.stopPropagation(),t.key==="ArrowDown"?r++:t.key==="ArrowUp"?r--:t.key==="Home"?r=0:t.key==="End"&&(r=e.length-1),r<0&&(r=e.length-1),r>e.length-1&&(r=0),this.setCurrentItem(e[r]),e[r].focus())}}handleMouseDown(t){let e=t.target;this.isMenuItem(e)&&this.setCurrentItem(e)}handleSlotChange(){let t=this.getAllItems();t.length>0&&this.setCurrentItem(t[0])}isMenuItem(t){var e;return t.tagName.toLowerCase()==="sl-menu-item"||["menuitem","menuitemcheckbox","menuitemradio"].includes((e=t.getAttribute("role"))!=null?e:"")}getAllItems(){return[...this.defaultSlot.assignedElements({flatten:!0})].filter(t=>!(t.inert||!this.isMenuItem(t)))}getCurrentItem(){return this.getAllItems().find(t=>t.getAttribute("tabindex")==="0")}setCurrentItem(t){this.getAllItems().forEach(o=>{o.setAttribute("tabindex",o===t?"0":"-1")})}render(){return I`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `}};Ri.styles=[J,Gl];p([K("slot")],Ri.prototype,"defaultSlot",2);Ri.define("sl-menu");var jl=G`
  :host {
    --submenu-offset: -2px;

    display: block;
  }

  :host([inert]) {
    display: none;
  }

  .menu-item {
    position: relative;
    display: flex;
    align-items: stretch;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: var(--sl-color-neutral-700);
    padding: var(--sl-spacing-2x-small) var(--sl-spacing-2x-small);
    transition: var(--sl-transition-fast) fill;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    cursor: pointer;
  }

  .menu-item.menu-item--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .menu-item.menu-item--loading {
    outline: none;
    cursor: wait;
  }

  .menu-item.menu-item--loading *:not(sl-spinner) {
    opacity: 0.5;
  }

  .menu-item--loading sl-spinner {
    --indicator-color: currentColor;
    --track-width: 1px;
    position: absolute;
    font-size: 0.75em;
    top: calc(50% - 0.5em);
    left: 0.65rem;
    opacity: 1;
  }

  .menu-item .menu-item__label {
    flex: 1 1 auto;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .menu-item .menu-item__prefix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__prefix::slotted(*) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .menu-item .menu-item__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__suffix::slotted(*) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  /* Safe triangle */
  .menu-item--submenu-expanded::after {
    content: '';
    position: fixed;
    z-index: calc(var(--sl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--safe-triangle-cursor-x, 0) var(--safe-triangle-cursor-y, 0),
      var(--safe-triangle-submenu-start-x, 0) var(--safe-triangle-submenu-start-y, 0),
      var(--safe-triangle-submenu-end-x, 0) var(--safe-triangle-submenu-end-y, 0)
    );
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host(:hover:not([aria-disabled='true'], :focus-visible)) .menu-item,
  .menu-item--submenu-expanded {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-1000);
  }

  :host(:focus-visible) .menu-item {
    outline: none;
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    opacity: 1;
  }

  .menu-item .menu-item__check,
  .menu-item .menu-item__chevron {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    visibility: hidden;
  }

  .menu-item--checked .menu-item__check,
  .menu-item--has-submenu .menu-item__chevron {
    visibility: visible;
  }

  /* Add elevation and z-index to submenus */
  sl-popup::part(popup) {
    box-shadow: var(--sl-shadow-large);
    z-index: var(--sl-z-index-dropdown);
    margin-left: var(--submenu-offset);
  }

  .menu-item--rtl sl-popup::part(popup) {
    margin-left: calc(-1 * var(--submenu-offset));
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .menu-item,
    :host(:focus-visible) .menu-item {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }

  ::slotted(sl-menu) {
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;
  }
`;var Fr=(t,e)=>{let o=t._$AN;if(o===void 0)return!1;for(let r of o)r._$AO?.(e,!1),Fr(r,e);return!0},Fi=t=>{let e,o;do{if((e=t._$AM)===void 0)break;o=e._$AN,o.delete(t),t=e}while(o?.size===0)},Kl=t=>{for(let e;e=t._$AM;t=e){let o=e._$AN;if(o===void 0)e._$AN=o=new Set;else if(o.has(t))break;o.add(t),Yd(e)}};function Zd(t){this._$AN!==void 0?(Fi(this),this._$AM=t,Kl(this)):this._$AM=t}function Xd(t,e=!1,o=0){let r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(e)if(Array.isArray(r))for(let n=o;n<r.length;n++)Fr(r[n],!1),Fi(r[n]);else r!=null&&(Fr(r,!1),Fi(r));else Fr(this,t)}var Yd=t=>{t.type==he.CHILD&&(t._$AP??=Xd,t._$AQ??=Zd)},Bi=class extends Le{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,o,r){super._$AT(e,o,r),Kl(this),this.isConnected=e._$AU}_$AO(e,o=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),o&&(Fr(this,e),Fi(this))}setValue(e){if(gi(this._$Ct))this._$Ct._$AI(e,this);else{let o=[...this._$Ct._$AH];o[this._$Ci]=e,this._$Ct._$AI(o,this,0)}}disconnected(){}reconnected(){}};var ql=()=>new Yn,Yn=class{},Xn=new WeakMap,Wl=ze(class extends Bi{render(t){return _t}update(t,[e]){let o=e!==this.Y;return o&&this.Y!==void 0&&this.rt(void 0),(o||this.lt!==this.ct)&&(this.Y=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),_t}rt(t){if(this.isConnected||(t=void 0),typeof this.Y=="function"){let e=this.ht??globalThis,o=Xn.get(e);o===void 0&&(o=new WeakMap,Xn.set(e,o)),o.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),o.set(this.Y,t),t!==void 0&&this.Y.call(this.ht,t)}else this.Y.value=t}get lt(){return typeof this.Y=="function"?Xn.get(this.ht??globalThis)?.get(this.Y):this.Y?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var Zl=class{constructor(t,e){this.popupRef=ql(),this.enableSubmenuTimer=-1,this.isConnected=!1,this.isPopupConnected=!1,this.skidding=0,this.submenuOpenDelay=100,this.handleMouseMove=o=>{this.host.style.setProperty("--safe-triangle-cursor-x",`${o.clientX}px`),this.host.style.setProperty("--safe-triangle-cursor-y",`${o.clientY}px`)},this.handleMouseOver=()=>{this.hasSlotController.test("submenu")&&this.enableSubmenu()},this.handleKeyDown=o=>{switch(o.key){case"Escape":case"Tab":this.disableSubmenu();break;case"ArrowLeft":o.target!==this.host&&(o.preventDefault(),o.stopPropagation(),this.host.focus(),this.disableSubmenu());break;case"ArrowRight":case"Enter":case" ":this.handleSubmenuEntry(o);break;default:break}},this.handleClick=o=>{var r;o.target===this.host?(o.preventDefault(),o.stopPropagation()):o.target instanceof Element&&(o.target.tagName==="sl-menu-item"||(r=o.target.role)!=null&&r.startsWith("menuitem"))&&this.disableSubmenu()},this.handleFocusOut=o=>{o.relatedTarget&&o.relatedTarget instanceof Element&&this.host.contains(o.relatedTarget)||this.disableSubmenu()},this.handlePopupMouseover=o=>{o.stopPropagation()},this.handlePopupReposition=()=>{let o=this.host.renderRoot.querySelector("slot[name='submenu']"),r=o?.assignedElements({flatten:!0}).filter(u=>u.localName==="sl-menu")[0],i=getComputedStyle(this.host).direction==="rtl";if(!r)return;let{left:n,top:a,width:s,height:l}=r.getBoundingClientRect();this.host.style.setProperty("--safe-triangle-submenu-start-x",`${i?n+s:n}px`),this.host.style.setProperty("--safe-triangle-submenu-start-y",`${a}px`),this.host.style.setProperty("--safe-triangle-submenu-end-x",`${i?n+s:n}px`),this.host.style.setProperty("--safe-triangle-submenu-end-y",`${a+l}px`)},(this.host=t).addController(this),this.hasSlotController=e}hostConnected(){this.hasSlotController.test("submenu")&&!this.host.disabled&&this.addListeners()}hostDisconnected(){this.removeListeners()}hostUpdated(){this.hasSlotController.test("submenu")&&!this.host.disabled?(this.addListeners(),this.updateSkidding()):this.removeListeners()}addListeners(){this.isConnected||(this.host.addEventListener("mousemove",this.handleMouseMove),this.host.addEventListener("mouseover",this.handleMouseOver),this.host.addEventListener("keydown",this.handleKeyDown),this.host.addEventListener("click",this.handleClick),this.host.addEventListener("focusout",this.handleFocusOut),this.isConnected=!0),this.isPopupConnected||this.popupRef.value&&(this.popupRef.value.addEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.addEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!0)}removeListeners(){this.isConnected&&(this.host.removeEventListener("mousemove",this.handleMouseMove),this.host.removeEventListener("mouseover",this.handleMouseOver),this.host.removeEventListener("keydown",this.handleKeyDown),this.host.removeEventListener("click",this.handleClick),this.host.removeEventListener("focusout",this.handleFocusOut),this.isConnected=!1),this.isPopupConnected&&this.popupRef.value&&(this.popupRef.value.removeEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.removeEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!1)}handleSubmenuEntry(t){let e=this.host.renderRoot.querySelector("slot[name='submenu']");if(!e)return;let o=null;for(let r of e.assignedElements())if(o=r.querySelectorAll("sl-menu-item, [role^='menuitem']"),o.length!==0)break;if(!(!o||o.length===0)){o[0].setAttribute("tabindex","0");for(let r=1;r!==o.length;++r)o[r].setAttribute("tabindex","-1");this.popupRef.value&&(t.preventDefault(),t.stopPropagation(),this.popupRef.value.active?o[0]instanceof HTMLElement&&o[0].focus():(this.enableSubmenu(!1),this.host.updateComplete.then(()=>{o[0]instanceof HTMLElement&&o[0].focus()}),this.host.requestUpdate()))}}setSubmenuState(t){this.popupRef.value&&this.popupRef.value.active!==t&&(this.popupRef.value.active=t,this.host.requestUpdate())}enableSubmenu(t=!0){t?(window.clearTimeout(this.enableSubmenuTimer),this.enableSubmenuTimer=window.setTimeout(()=>{this.setSubmenuState(!0)},this.submenuOpenDelay)):this.setSubmenuState(!0)}disableSubmenu(){window.clearTimeout(this.enableSubmenuTimer),this.setSubmenuState(!1)}updateSkidding(){var t;if(!((t=this.host.parentElement)!=null&&t.computedStyleMap))return;let e=this.host.parentElement.computedStyleMap(),r=["padding-top","border-top-width","margin-top"].reduce((i,n)=>{var a;let s=(a=e.get(n))!=null?a:new CSSUnitValue(0,"px"),u=(s instanceof CSSUnitValue?s:new CSSUnitValue(0,"px")).to("px");return i-u.value},0);this.skidding=r}isExpanded(){return this.popupRef.value?this.popupRef.value.active:!1}renderSubmenu(){let t=getComputedStyle(this.host).direction==="rtl";return this.isConnected?I`
      <sl-popup
        ${Wl(this.popupRef)}
        placement=${t?"left-start":"right-start"}
        anchor="anchor"
        flip
        flip-fallback-strategy="best-fit"
        skidding="${this.skidding}"
        strategy="fixed"
        auto-size="vertical"
        auto-size-padding="10"
      >
        <slot name="submenu"></slot>
      </sl-popup>
    `:I` <slot name="submenu" hidden></slot> `}};var ie=class extends q{constructor(){super(...arguments),this.localize=new Tt(this),this.type="normal",this.checked=!1,this.value="",this.loading=!1,this.disabled=!1,this.hasSlotController=new Ie(this,"submenu"),this.submenuController=new Zl(this,this.hasSlotController),this.handleHostClick=t=>{this.disabled&&(t.preventDefault(),t.stopImmediatePropagation())},this.handleMouseOver=t=>{this.focus(),t.stopPropagation()}}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleHostClick),this.addEventListener("mouseover",this.handleMouseOver)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleHostClick),this.removeEventListener("mouseover",this.handleMouseOver)}handleDefaultSlotChange(){let t=this.getTextLabel();if(typeof this.cachedTextLabel>"u"){this.cachedTextLabel=t;return}t!==this.cachedTextLabel&&(this.cachedTextLabel=t,this.emit("slotchange",{bubbles:!0,composed:!1,cancelable:!1}))}handleCheckedChange(){if(this.checked&&this.type!=="checkbox"){this.checked=!1;return}this.type==="checkbox"?this.setAttribute("aria-checked",this.checked?"true":"false"):this.removeAttribute("aria-checked")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleTypeChange(){this.type==="checkbox"?(this.setAttribute("role","menuitemcheckbox"),this.setAttribute("aria-checked",this.checked?"true":"false")):(this.setAttribute("role","menuitem"),this.removeAttribute("aria-checked"))}getTextLabel(){return Da(this.defaultSlot)}isSubmenu(){return this.hasSlotController.test("submenu")}render(){let t=this.localize.dir()==="rtl",e=this.submenuController.isExpanded();return I`
      <div
        id="anchor"
        part="base"
        class=${bt({"menu-item":!0,"menu-item--rtl":t,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled,"menu-item--loading":this.loading,"menu-item--has-submenu":this.isSubmenu(),"menu-item--submenu-expanded":e})}
        ?aria-haspopup="${this.isSubmenu()}"
        ?aria-expanded="${!!e}"
      >
        <span part="checked-icon" class="menu-item__check">
          <sl-icon name="check" library="system" aria-hidden="true"></sl-icon>
        </span>

        <slot name="prefix" part="prefix" class="menu-item__prefix"></slot>

        <slot part="label" class="menu-item__label" @slotchange=${this.handleDefaultSlotChange}></slot>

        <slot name="suffix" part="suffix" class="menu-item__suffix"></slot>

        <span part="submenu-icon" class="menu-item__chevron">
          <sl-icon name=${t?"chevron-left":"chevron-right"} library="system" aria-hidden="true"></sl-icon>
        </span>

        ${this.submenuController.renderSubmenu()}
        ${this.loading?I` <sl-spinner part="spinner" exportparts="base:spinner__base"></sl-spinner> `:""}
      </div>
    `}};ie.styles=[J,jl];ie.dependencies={"sl-icon":Mt,"sl-popup":ct,"sl-spinner":vr};p([K("slot:not([name])")],ie.prototype,"defaultSlot",2);p([K(".menu-item")],ie.prototype,"menuItem",2);p([y()],ie.prototype,"type",2);p([y({type:Boolean,reflect:!0})],ie.prototype,"checked",2);p([y()],ie.prototype,"value",2);p([y({type:Boolean,reflect:!0})],ie.prototype,"loading",2);p([y({type:Boolean,reflect:!0})],ie.prototype,"disabled",2);p([ut("checked")],ie.prototype,"handleCheckedChange",1);p([ut("disabled")],ie.prototype,"handleDisabledChange",1);p([ut("type")],ie.prototype,"handleTypeChange",1);ie.define("sl-menu-item");var Xl=G`
  :host {
    --max-width: 20rem;
    --hide-delay: 0ms;
    --show-delay: 150ms;

    display: contents;
  }

  .tooltip {
    --arrow-size: var(--sl-tooltip-arrow-size);
    --arrow-color: var(--sl-tooltip-background-color);
  }

  .tooltip::part(popup) {
    z-index: var(--sl-z-index-tooltip);
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .tooltip__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--sl-tooltip-border-radius);
    background-color: var(--sl-tooltip-background-color);
    font-family: var(--sl-tooltip-font-family);
    font-size: var(--sl-tooltip-font-size);
    font-weight: var(--sl-tooltip-font-weight);
    line-height: var(--sl-tooltip-line-height);
    text-align: start;
    white-space: normal;
    color: var(--sl-tooltip-color);
    padding: var(--sl-tooltip-padding);
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }
`;var Nt=class extends q{constructor(){super(),this.localize=new Tt(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=t=>{t.key==="Escape"&&(t.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){let t=Pn(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),t)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){let t=Pn(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),t)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(t){return this.trigger.split(" ").includes(t)}async handleOpenChange(){var t,e;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await ee(this.body),this.body.hidden=!1,this.popup.active=!0;let{keyframes:o,options:r}=Qt(this,"tooltip.show",{dir:this.localize.dir()});await Jt(this.popup.popup,o,r),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await ee(this.body);let{keyframes:o,options:r}=Qt(this,"tooltip.hide",{dir:this.localize.dir()});await Jt(this.popup.popup,o,r),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,ye(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ye(this,"sl-after-hide")}render(){return I`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${bt({tooltip:!0,"tooltip--open":this.open})}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        arrow
        hover-bridge
      >
        ${""}
        <slot slot="anchor" aria-describedby="tooltip"></slot>

        ${""}
        <div part="body" id="tooltip" class="tooltip__body" role="tooltip" aria-live=${this.open?"polite":"off"}>
          <slot name="content">${this.content}</slot>
        </div>
      </sl-popup>
    `}};Nt.styles=[J,Xl];Nt.dependencies={"sl-popup":ct};p([K("slot:not([name])")],Nt.prototype,"defaultSlot",2);p([K(".tooltip__body")],Nt.prototype,"body",2);p([K("sl-popup")],Nt.prototype,"popup",2);p([y()],Nt.prototype,"content",2);p([y()],Nt.prototype,"placement",2);p([y({type:Boolean,reflect:!0})],Nt.prototype,"disabled",2);p([y({type:Number})],Nt.prototype,"distance",2);p([y({type:Boolean,reflect:!0})],Nt.prototype,"open",2);p([y({type:Number})],Nt.prototype,"skidding",2);p([y()],Nt.prototype,"trigger",2);p([y({type:Boolean})],Nt.prototype,"hoist",2);p([ut("open",{waitUntilFirstUpdate:!0})],Nt.prototype,"handleOpenChange",1);p([ut(["content","distance","hoist","placement","skidding"])],Nt.prototype,"handleOptionsChange",1);p([ut("disabled")],Nt.prototype,"handleDisabledChange",1);Yt("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}});Yt("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}});Nt.define("sl-tooltip");Sr.define("sl-visually-hidden");gr("assets/shoelace");var z=new Ur("piano-projector"),Jo=new Gr("piano-projector-session"),Vt=ps(),ec=fs(),d={first_time:!0,lowperf:!1,number_of_keys:88,height_factor:1,device_name:null,sound:null,offset:{x:.5,y:.5},labels:{type:"english",octave:!0,played:!1,keys:new Set,toggle(t,e=void 0){e=e??!this.keys.has(t),e?this.keys.add(t):this.keys.delete(t),oo(t),dt()},keysToStr(){return[...this.keys].join(",")},strToKeys(t){if(this.keys.clear(),t)for(let e of t.split(",")){let o=parseInt(e);Number.isInteger(o)&&this.keys.add(o)}},get type_badge(){return{english:"English",german:"German",italian:"Italian",pc:"Pitch-class",midi:"MIDI",freq:"Frequency"}[this.type]}},stickers:{color:"red",keys:new Map,toggle(t,e=void 0){e=e??!this.keys.has(t),e?this.keys.set(t,this.color):this.keys.delete(t),oo(t),dt()},keysToStr(){let t=[];for(let[e,o]of this.keys.entries())t.push(`${e}:${o}`);return t.join(",")},strToKeys(t){if(this.keys.clear(),t)for(let e of t.split(",")){let[o,r]=e.split(":"),i=parseInt(o);Number.isInteger(i)&&this.keys.set(i,r)}}},zoom:1,pedals:!0,pedal_dim:!0,perspective:!0,top_felt:!0,toolbar:!0,semitones:0,octaves:0,get transpose(){return this.semitones+this.octaves*12},get highlight_opacity(){return getComputedStyle(document.documentElement).getPropertyValue("--highlight-opacity")},set highlight_opacity(t){document.documentElement.style.setProperty("--highlight-opacity",t)},get color_highlight(){return getComputedStyle(document.documentElement).getPropertyValue("--color-highlight")},set color_highlight(t){document.documentElement.style.setProperty("--color-highlight",t)},get color_white(){return getComputedStyle(document.documentElement).getPropertyValue("--color-white-key")},set color_white(t){document.documentElement.style.setProperty("--color-white-key",t)},get color_black(){return getComputedStyle(document.documentElement).getPropertyValue("--color-black-key")},set color_black(t){document.documentElement.style.setProperty("--color-black-key",t)},get color_top_felt(){return getComputedStyle(document.documentElement).getPropertyValue("--color-felt-top")},set color_top_felt(t){document.documentElement.style.setProperty("--color-felt-top",t)},get pc_keyboard_connected(){return this.device_name==="pckbd"}},yt={ports:[],get menu_items(){return Array.from(v.menus.connect.querySelectorAll(".menu-connect-item-midi-input"))},get connected_port(){return st.getConnectedPort()},access:"unavailable",queryAccess(t=null){st.queryMidiAccess(e=>{this.access=e,t?.(this.access)})},requestAccess(t=null){st.requestMidiAccess(()=>{this.access="granted",t?.(!0)},()=>{this.access="denied",t?.(!1)})},requestPorts(t=null){st.requestInputPortList(e=>{this.ports=e,t?.(e)},()=>{this.ports=null,t?.(null)})},clearMenuItems(){for(let t of this.menu_items)t.remove()},watchdog_id:null,setWatchdog(t){this.watchdog_id&&clearInterval(this.watchdog_id),this.watchdog_id=setInterval(yc,t)}},Ot={player:new oi,led:null,fail_alert:document.getElementById("alert-sound-connection-fail"),get type(){return this.player.name},get loaded(){return this.player.loaded},get loading(){return this.type&&!this.loaded},play(t,e=100){this.player.play(t+d.transpose,e)},stop(t,e){(e||!(st.isNoteOn(t,d.pedals?"both":"none")||Ht.isNoteSustained(t))&&!(this.type=="apiano"&&t+d.transpose>88))&&this.player.stop(t+d.transpose)},stopAll(t){if(t)this.player.stopAll();else for(let e=0;e<128;e++)this.stop(e,!1)},load(t,e=null){if(!t)this.player.unload(),this.led=0;else{this.led=1;let o=setInterval(()=>{this.led=this.led==0?1:0,Wt()},400),r=i=>{clearInterval(o),this.led=i?2:0,Wt(),Qn()};this.player.load(t,()=>{r(!0),dt()},i=>{r(!1),this.fail_alert.children[1].innerText=`Reason: ${i}`,this.fail_alert.toast()})}Wt(),Qn()}},zt={state:0,origin:{x:0,y:0},previous_offset:{x:0,y:0}},ot={enabled:!1,points:new Map,started(t=null){return t!==null?this.points.has(t):this.points.size>0},has_note(t){for(let e of this.points.values())if(e.has(t))return!0;return!1},add(t,e){this.points.has(t)&&(e=this.points.get(t).union(e)),this.points.set(t,e);for(let o of e.values())Ot.play(o),oo(o)},change(t,e){let o=0,r=new Set().union(this.points.get(t));this.points.set(t,e);for(let i of r.values())e.has(i)||(Ot.stop(i),oo(i),o=-1);for(let i of e.values())r.has(i)||(Ot.play(i),oo(i),o=1);return o},remove(t){let e=this.points.get(t);this.points.delete(t);for(let o of e.values())this.has_note(o)||Ot.stop(o),oo(o)},reset(){this.points.clear(),Ot.stopAll()},enable(){this.enabled=!0,Ao()},disable(){this.reset(),this.enabled=!1,Ao()},last_vibration_time:0},v={self:document.getElementById("top-toolbar"),title:document.getElementById("toolbar-title"),dropdowns:{connect:document.getElementById("dropdown-connect"),sound:document.getElementById("dropdown-sound"),transpose:document.getElementById("dropdown-transpose"),size:document.getElementById("dropdown-size"),colors:document.getElementById("dropdown-colors"),pedals:document.getElementById("dropdown-pedals"),labels:document.getElementById("dropdown-labels"),stickers:document.getElementById("dropdown-stickers"),get all(){return[this.connect,this.sound,this.transpose,this.size,this.colors,this.pedals,this.labels,this.stickers]},closeAll(){for(let t of this.all)t.hide()},getOpen(){return this.all.find(t=>t.open)??null}},buttons:{connect:document.getElementById("btn-connect"),sound:document.getElementById("btn-sound"),transpose:document.getElementById("btn-transpose"),size:document.getElementById("btn-size"),colors:document.getElementById("btn-colors"),pedals:document.getElementById("btn-pedals"),labels_group:document.getElementById("btn-labels-group"),labels_left:document.getElementById("btn-labels-switch"),labels_right:document.getElementById("btn-labels-dropdown"),stickers_group:document.getElementById("btn-labels-group"),stickers_left:document.getElementById("btn-stickers-switch"),stickers_right:document.getElementById("btn-stickers-dropdown"),panic:document.getElementById("btn-panic"),hide_toolbar:document.getElementById("btn-hide-toolbar"),show_toolbar:document.getElementById("btn-show-toolbar")},menus:{connect:document.getElementById("midi-connection-menu"),sound:document.getElementById("menu-sound"),transpose:{top:document.getElementById("menu-transpose"),semitones:{input:document.getElementById("input-semitones"),btn_minus:document.getElementById("btn-semitone-minus"),btn_plus:document.getElementById("btn-semitone-plus")},octaves:{input:document.getElementById("input-octaves"),btn_minus:document.getElementById("btn-octave-minus"),btn_plus:document.getElementById("btn-octave-plus")},item_reset:document.getElementById("reset-transpose")},size:document.getElementById("menu-size"),colors:{top:document.getElementById("menu-colors"),highlight_opacity:document.getElementById("menu-highlight-opacity"),picker_color_white:document.getElementById("color-white"),picker_color_black:document.getElementById("color-black"),picker_color_pressed:document.getElementById("color-pressed"),item_perspective:document.getElementById("menu-perspective"),item_top_felt:document.getElementById("menu-top-felt")},labels:{top:document.getElementById("menu-labels-top"),labeling_mode:document.getElementById("menu-labeling-mode"),played:document.getElementById("menu-labels-played-keys"),presets:document.getElementById("menu-labels-which"),type:document.getElementById("menu-labels-type"),octave:document.getElementById("menu-item-labels-octave")},stickers:{top:document.getElementById("menu-stickers-top"),clear:document.getElementById("menu-stickers-clear")},pedals:{top:document.getElementById("pedal-menu"),item_follow:document.getElementById("menu-pedal-follow"),item_dim:document.getElementById("menu-pedal-dim")}},resize:{observer:null,timeout:null}},Yl=[{elm:v.title,action:"hide-elm"},{elm:v.buttons.sound,action:"hide-label"},{elm:v.buttons.connect,action:"hide-label"},{elm:v.buttons.pedals,action:"hide-label"},{elm:v.buttons.transpose,action:"hide-label"},{elm:v.buttons.stickers_left,action:"hide-label"},{elm:v.buttons.labels_left,action:"hide-label"},{elm:v.dropdowns.colors,action:"hide-elm"},{elm:v.dropdowns.size,action:"hide-elm"},{elm:v.dropdowns.sound,action:"hide-elm"},{elm:v.dropdowns.pedals,action:"hide-elm"},{elm:v.buttons.stickers_group,action:"hide-elm"},{elm:v.buttons.labels_group,action:"hide-elm"},{elm:v.buttons.panic,action:"hide-elm"},{elm:v.self,action:"hide-elm"}],$={svg:document.querySelector("svg#piano"),container:document.getElementById("main-area"),first_key:null,last_key:null,keys:Array(128).fill(null),labels:Array(128).fill(null),marking_groups:Array(128).fill(null),loaded:!1,resize:{timeout:null,observer:null}},$t=null,ts=500,Vi=2e3,Qd=["\u208B\u2081","\u2080","\u2081","\u2082","\u2083","\u2084","\u2085","\u2086","\u2087","\u2088","\u2089"],Jd=["\u207B\xB2","\u207B\xB9","\xB9","\xB2","\xB3","\u2074","\u2075","\u2076","\u2077","\u2078","\u2079","\xB9\u2070"],th=["\u208B\u2082","\u208B\u2081","\u2081","\u2082","\u2083","\u2084","\u2085","\u2086","\u2087","\u2088","\u2089","\u2081\u2080"],Ql=["C","C\u266F","D","D\u266F","E","F","F\u266F","G","G\u266F","A","A\u266F","B"],eh=[,"D\u266D",,"E\u266D",,,"G\u266D",,"A\u266D",,"B\u266D"],Ni=["C","Ces","D","Des","E","F","Fes","G","Ges","A","Aes","H"],Jl=[,"Dis",,"Eis",,,"Gis",,"Ais",,"B"],tc=["do","do\u266F","re","re\u266F","mi","fa","fa\u266F","sol","sol\u266F","la","la\u266F","si"],oh=[,"re\u266D",,"mi\u266D",,,"sol\u266D",,"la\u266D",,"si\u266D"];function oc(t){let e=new Set;switch(t){case"mc":e.add(60);break;case"cs":for(let o of Mo(0,128,12))e.add(o);break;case"white":for(let o of Mo(0,128))Io(o)&&e.add(o);break;case"all":for(let o of Mo(0,128))e.add(o);break}return e}function rc(){for(let t of["none","mc","cs","white","all"]){let e=oc(t);if(d.labels.keys.symmetricDifference(e).size==0)return t}return"custom"}function Br(){let t=new Map([[88,["a0","c8"]],[61,["c2","c7"]],[49,["c2","c6"]],[37,["c3","c6"]],[25,["c3","c5"]],[20,["f3","c5"]]]).get(d.number_of_keys);$.first_key=Ji(t[0]),$.last_key=Ji(t[1]);let e={height_factor:d.height_factor,perspective:d.perspective,top_felt:d.top_felt,first_key:$.first_key,last_key:$.last_key};d.lowperf?ks($.svg,$.keys,e):ws($.svg,$.keys,e);for(let[o,r]of $.keys.entries())$.marking_groups[o]=r?.querySelector(".key-marker-group"),$.labels[o]=r?.querySelector(".key-label");$.loaded=!0,nc()}function ic(){document.getElementById("top-felt")?.toggleAttribute("hidden",!d.top_felt)}function oo(t){let e=$.keys[t];if(e){let o=t-d.transpose,i=ot.has_note(t)||st.isKeyPressed(o)||Ht.isNotePressed(o),n=i||st.isNoteOn(o,d.pedals?"both":"none")||Ht.isNoteSustained(o);e.classList.toggle("active",n),e.classList.toggle("pressed",i),e.classList.toggle("dim",d.pedal_dim&&n&&!i);let a=i?"d1":"d0";for(let s of e.children)s.hasAttribute(a)&&s.setAttribute("d",s.getAttribute(a));rh(t,n,i)}}function Ut(t=Mo(0,128)){for(let e of t)oo(e)}function rh(t,e,o){let r=$.keys[t],i=$.marking_groups[t],n=$.labels[t];function a(){let s=t%12,l=Math.trunc(t/12),u=Io(s),m="";switch(d.labels.type){case"pc":m=`${s}`;break;case"english":let f=d.labels.octave?Qd[l]:"";m=u?`${Ql[s]}${f}`:`${eh[s]}
${Ql[s]}
${f}`;break;case"german":if(l>=4){let b=d.labels.octave?"\u2019".repeat(l-4):"";m=u?`${Ni[s].toLowerCase()}${b}`:`${Jl[s].toLowerCase()}
${Ni[s].toLowerCase()}`}else{let b=d.labels.octave?",".repeat(Math.abs(l-3)):"";m=u?`${Ni[s]}${b}`:`${Jl[s]}
${Ni[s]}`}break;case"italian":let h=d.labels.octave?u?Jd[l-1]:th[l-1]:"";m=u?`${tc[s]}${h}`:`${oh[s]}
${tc[s]}
${h}`;break;case"freq":let g=bs(ot.enabled?t+d.transpose:t);m=`${g.toFixed(g<1e3?1:0)}`;break;default:m=`${t}`}let c=m.split(`
`);for(let[f,h]of Array.from(n.children).entries())h.textContent=c[f]??""}if(r){let s=d.labels.keys.has(t),l=s||d.labels.played&&e,u=d.labels.played&&!s;a(),r.classList.toggle("label-visible",l),r.classList.toggle("has-fixed-label",s),r.classList.toggle("has-temporary-label",u),n.classList.toggle("rotated",d.labels.type=="freq");let m=d.stickers.keys.has(t),c=m?d.stickers.keys.get(t):null;r.classList.toggle("has-sticker",m),r.classList.toggle("has-sticker-red",c=="red"),r.classList.toggle("has-sticker-yellow",c=="yellow"),r.classList.toggle("has-sticker-green",c=="green"),r.classList.toggle("has-sticker-blue",c=="blue"),r.classList.toggle("has-sticker-violet",c=="violet"),o&&i.hasAttribute("press_transform")?i.style.setProperty("transform",i.getAttribute("press_transform")):i.style.removeProperty("transform")}}function Ao(){$.svg.classList.toggle("touch-input",ot.enabled),$.svg.classList.toggle("grabbing",[1,2].includes(zt.state)),$.svg.classList.toggle("marking-mode",$t),$.svg.classList.toggle("labeling-mode",$t=="label"),$.svg.classList.toggle("sticker-mode",$t=="sticker")}function nc(){Ut(),ic(),Po(),Ao()}function er(){Ge("pedr",Ht.isSustainActive()||st.sustain_pedal_value/127),Ge("pedm",st.sostenuto_pedal_value/127),Ge("pedl",st.soft_pedal_value/127)}function Wt(){Ge("connection-power-icon",d.pc_keyboard_connected||ot.enabled||d.device_name&&st.getConnectedPort()),Ge("transpose-power-icon",d.transpose!=0),Ge("sound-power-icon",Ot.led,Ot.led==1?"red":null),Ge("labels-power-icon",$t=="label"),Ge("stickers-power-icon",$t=="sticker",{red:"red",yellow:"yellow",green:"#0b0",blue:"blue",violet:"violet"}[d.stickers.color]),v.self.toggleAttribute("hidden",!d.toolbar),v.buttons.show_toolbar.toggleAttribute("hidden",d.toolbar),v.dropdowns.pedals.toggleAttribute("hidden",ot.enabled),er()}function sc(){for(let t of Yl)t.action=="hide-elm"?t.elm.classList.toggle("condensed-toolbar-hidden-elm",!1):t.action=="hide-label"&&t.elm.classList.toggle("condensed-toolbar-hidden-label",!1);for(let t of Yl){if(v.self.scrollWidth<=v.self.clientWidth)break;t.action=="hide-elm"?t.elm.classList.toggle("condensed-toolbar-hidden-elm",!0):t.action=="hide-label"&&t.elm.classList.toggle("condensed-toolbar-hidden-label",!0)}}function Qn(){if(Ot.loading)for(let t of v.menus.sound.querySelectorAll(".menu-sound-item")){let e=t.getAttribute("value")==Ot.type;t.toggleAttribute("loading",e),t.toggleAttribute("disabled",!e),t.checked=!1}else for(let t of v.menus.sound.querySelectorAll(".menu-sound-item")){let e=t.getAttribute("value")==Ot.type;t.checked=e,t.toggleAttribute("loading",!1),t.toggleAttribute("disabled",!1)}}function es(){for(let t of v.dropdowns.size.querySelectorAll(".btn-number-of-keys")){let e=parseInt(t.value)==d.number_of_keys;t.variant=e?"neutral":null}for(let t of v.dropdowns.size.querySelectorAll(".btn-key-depth")){let e=parseFloat(t.value)==d.height_factor;t.variant=e?"neutral":null}}function ac(){v.menus.colors.picker_color_white.value=d.color_white,v.menus.colors.picker_color_black.value=d.color_black,v.menus.colors.picker_color_pressed.value=d.color_highlight,v.menus.colors.item_perspective.checked=d.perspective,v.menus.colors.item_perspective.hidden=d.lowperf,v.menus.colors.item_top_felt.checked=d.top_felt;for(let t of v.menus.colors.highlight_opacity.children)t.checked=t.value==d.highlight_opacity.toString()}function os(){v.menus.pedals.item_follow.checked=d.pedals,v.menus.pedals.item_dim.checked=d.pedal_dim,v.menus.pedals.item_dim.toggleAttribute("disabled",!d.pedals)}function or(){v.menus.labels.labeling_mode.checked=$t=="label",v.menus.labels.played.checked=d.labels.played;let t=rc();for(let e of v.menus.labels.presets.children)e.checked=e.value===t;v.menus.labels.presets.nextElementSibling.innerText={none:"None",mc:"Middle-C",cs:"C's",white:"White",all:"All",custom:"Custom"}[t];for(let e of v.menus.labels.type.children)e.value!="octave"&&(e.checked=e.value===d.labels.type);v.menus.labels.type.nextElementSibling.innerText=d.labels.type_badge,v.menus.labels.octave.disabled=["pc","midi","freq"].includes(d.labels.type),v.menus.labels.octave.checked=d.labels.octave}function rs(){let t=$t=="sticker";for(let e of v.menus.stickers.top.children)if(e.getAttribute("type")=="checkbox"){let o=e.value==d.stickers.color;e.checked=t&&o,e.querySelector(".menu-keyboard-shortcut").classList.toggle("invisible",!o)}v.menus.stickers.clear.disabled=d.stickers.keys.size==0}function lc(){v.menus.transpose.semitones.input.value=d.semitones,v.menus.transpose.octaves.input.value=d.octaves,v.menus.transpose.item_reset.toggleAttribute("disabled",d.transpose==0),Ge("transpose-power-icon",d.transpose!=0)}function Po(){let t=$.container.clientHeight/$.svg.clientHeight;d.zoom>1?(d.zoom>t&&(d.zoom=t),$.svg.style.transform=`scale(${d.zoom}, ${d.zoom})`):$.svg.style.removeProperty("transform");let e=$.svg.getBoundingClientRect(),o=$.container.getBoundingClientRect(),r=(o.height-e.height)*d.offset.y;$.svg.style.top=`${r}px`;let i=Math.round((e.width-o.width)*d.offset.x);$.container.scroll(i,0),Te.container.toggleAttribute("position-top",d.offset.y>.5)}function Jn(t){let e=t+d.transpose;e>=0&&e<128&&oo(e)}function Ui(){d.toolbar=!d.toolbar,Wt(),Po(),dt()}function is(){Ot.stopAll(!0),st.reset(),ot.reset(),Ht.resetState(),Br(),er(),v.buttons.panic.setAttribute("variant","danger"),setTimeout(()=>{v.buttons.panic.removeAttribute("variant")},1e3)}function ne(t={}){let e=d.transpose;t.reset&&(d.semitones=0,d.octaves=0),t.set?(Object.hasOwn(t,"semitones")&&(d.semitones=t.semitones),Object.hasOwn(t,"octaves")&&(d.octaves=t.octaves)):(Object.hasOwn(t,"semitones")&&(d.semitones=ro(d.semitones+t.semitones,-11,11)),Object.hasOwn(t,"octaves")&&(d.octaves=ro(d.octaves+t.octaves,-2,2))),e!=d.transpose&&Ot.stopAll(!0),lc(),Ut(),dt()}function Yo(t){d.number_of_keys=t,d.zoom=1,es(),Br(),dt()}function cc(t){d.height_factor=t,es(),Br(),dt()}function ih(){cc(cs(d.height_factor,[1,.75,.5]))}function Qo(t){d.labels.keys=oc(t),or(),Ut(),dt()}function Eo(t){d.labels.type=t,or(),Ut(),dt()}function ns(t){$t=t||null,Ao(),Wt()}function Gi(t=void 0){t===void 0&&(t=$t!="label"),ns(t?"label":null),or()}function to(t=void 0,e=d.stickers.color){t===void 0&&(t=$t!="sticker"||e!=d.stickers.color),d.stickers.color=e,ns(t?"sticker":null),rs()}function uc(){d.stickers.keys.clear(),Ut(),rs(),dt()}function dc(t=void 0){d.labels.played=t===void 0?!d.labels.played:t,or(),Ut(),dt()}function hc(t=void 0){d.labels.octave=t===void 0?!d.labels.octave:t,or(),Ut(),dt()}function nh(t=void 0){d.pedals=t===void 0?!d.pedals:t,os(),Ut(),dt()}function sh(t=void 0){d.pedal_dim=t===void 0?!d.pedal_dim:t,os(),Ut(),dt()}function dt(){z.writeBool("first-time",!1),z.writeNumber("height-factor",d.height_factor),z.writeNumber("number-of-keys",d.number_of_keys),z.writeString("color-pressed",d.color_highlight),z.writeString("color-white",d.color_white),z.writeString("color-black",d.color_black),z.writeString("labels-type",d.labels.type),z.writeBool("labels-octave",d.labels.octave),z.writeBool("labels-played",d.labels.played),z.writeString("labels-keys",d.labels.keysToStr()),z.writeString("sticker-color",d.stickers.color),z.writeString("stickers-keys",d.stickers.keysToStr()),z.writeBool("perspective",d.perspective),z.writeBool("top-felt",d.top_felt),z.writeString("highlight-opacity",d.highlight_opacity),z.writeBool("pedals",d.pedals),z.writeBool("pedal-dim",d.pedal_dim),z.writeNumber("offset-y",d.offset.y),d.device_name?z.writeString("device",d.device_name):z.remove("device"),z.writeString("sound",Ot.type),Jo.writeNumber("semitones",d.semitones),Jo.writeNumber("octaves",d.octaves),Jo.writeBool("toolbar",d.toolbar)}function ah(){d.first_time=z.readBool("first-time",!0),d.lowperf=z.readBool("lowperf",d.lowperf),d.height_factor=z.readNumber("height-factor",Vt?.75:d.height_factor),d.number_of_keys=z.readNumber("number-of-keys",Vt?20:d.number_of_keys),d.color_white=z.readString("color-white",d.color_white),d.color_black=z.readString("color-black",d.color_black),d.color_highlight=z.readString("color-pressed",d.color_highlight),d.labels.type=z.readString("labels-type",d.labels.type),d.labels.octave=z.readBool("labels-octave",d.labels.octave),d.labels.played=z.readBool("labels-played",d.labels.played),d.labels.strToKeys(z.readString("labels-keys","")),d.stickers.color=z.readString("sticker-color",d.stickers.color),d.stickers.strToKeys(z.readString("stickers-keys","")),d.perspective=z.readBool("perspective",d.perspective),d.top_felt=z.readBool("top-felt",d.top_felt),d.highlight_opacity=z.readString("highlight-opacity",d.highlight_opacity),d.pedals=z.readBool("pedals",d.pedals),d.pedal_dim=z.readBool("pedal-dim",d.pedal_dim),d.offset.y=z.readNumber("offset-y",d.offset.y),d.device_name=z.readString("device",null),d.sound=z.readString("sound",""),d.semitones=Jo.readNumber("semitones",0),d.octaves=Jo.readNumber("octaves",0),d.toolbar=Jo.readBool("toolbar",d.toolbar)}function lh(){let t=us("mode").toLowerCase();["lp","lowperf"].includes(t)?(d.lowperf=!0,z.writeBool("lowperf",!0)):["hp","highperf"].includes(t)&&(d.lowperf=!1,z.writeBool("lowperf",!1))}function Ge(t,e,o=null){let r=document.getElementById(t);r.classList.toggle("active",e),e&&o?r.style.color=o:r.style.removeProperty("color"),r.style.setProperty("--led-intensity",`${e*100}%`)}function ch(t=null){t===null&&(t=!d.pc_keyboard_connected),t?tr("pckbd"):ss()}function uh(t=null){t===null&&(t=!ot.enabled),t?tr("touch"):ss()}function tr(t,e=!1){switch(st.disconnect(),Ot.stopAll(),t){case"pckbd":Ht.enable(),ot.disable(),d.device_name="pckbd",Wt(),nc(),e&&dt();break;case"touch":Ht.disable(),ot.enable(),d.device_name="touch",Wt(),Ut(),e&&dt();break;default:Ht.disable(),ot.disable(),d.device_name=null,Wt(),Ut(),st.connectByPortName(t,()=>{d.device_name=t,Wt(),Te.visible&&Te.replaceStructure(Nr()),e&&dt()})}}function ss(t=!1){st.disconnect(),Ht.disable(),ot.disable(),d.device_name=null,Wt(),Ut(),t&&dt()}function Hi(t,e=!1){t&&d.device_name!=t?tr(d.device_name==t?"":t,e):ss(e)}function Co(){let t=v.menus.connect.querySelector("sl-divider");if(document.getElementById("menu-connect-item-midi-denied").toggleAttribute("hidden",yt.access!="denied"),document.getElementById("menu-connect-item-midi-unavailable").toggleAttribute("hidden",Vt||yt.access!="unavailable"),document.getElementById("menu-connect-item-midi-prompt").toggleAttribute("hidden",yt.access!="prompt"),t.toggleAttribute("hidden",yt.access=="granted"&&!yt.ports?.length||Vt&&yt.access=="unavailable"),document.getElementById("menu-connect-item-computer-keyboard").toggleAttribute("checked",d.pc_keyboard_connected),document.getElementById("menu-connect-item-touch").toggleAttribute("checked",ot.enabled),yt.access!="granted"){yt.clearMenuItems();return}let e=document.getElementById("menu-connect-item-midi-port-template");for(let o of yt.ports??[])if(!yt.menu_items.some(r=>o.name==r.value)){let r=hs(e,{value:o.name},o.name);r.addEventListener("click",i=>{Hi(i.currentTarget.value,!0)}),v.menus.connect.insertBefore(r,t)}for(let o of yt.menu_items??[])yt.ports.some(r=>o.value==r.name)?o.toggleAttribute("checked",o.value==yt.connected_port?.name):o.remove()}v.dropdowns.connect.addEventListener("sl-show",()=>{Co(),yt.setWatchdog(ts),yt.queryAccess(t=>{t!="granted"&&Co(),["granted","prompt"].includes(t)&&yt.requestAccess(e=>{Co(),e&&yt.requestPorts(Co)})})});v.dropdowns.connect.addEventListener("sl-hide",()=>{yt.setWatchdog(Vi),Wt()});v.dropdowns.sound.addEventListener("sl-show",Qn);v.dropdowns.size.addEventListener("sl-show",es);v.dropdowns.colors.addEventListener("sl-show",ac);v.dropdowns.pedals.addEventListener("sl-show",os);v.dropdowns.labels.addEventListener("sl-show",or);v.dropdowns.stickers.addEventListener("sl-show",rs);v.dropdowns.transpose.addEventListener("sl-show",lc);for(let t of v.dropdowns.all)t.addEventListener("sl-show",e=>{e.currentTarget.querySelector("sl-button").setAttribute("variant","neutral")}),t.addEventListener("sl-hide",e=>{let o=e.currentTarget.querySelector("sl-button");o.setAttribute("variant","default"),o.blur()});document.getElementById("menu-connect-item-computer-keyboard").addEventListener("click",()=>{ch(),dt()});document.getElementById("menu-connect-item-touch").addEventListener("click",()=>{uh(),dt()});v.menus.sound.addEventListener("sl-select",t=>{Ot.load(t.detail.item.value),dt()});v.dropdowns.size.querySelectorAll(".btn-number-of-keys").forEach(t=>{t.addEventListener("click",e=>{Yo(parseInt(e.currentTarget.value)),Vt&&v.dropdowns.size.hide()})});v.dropdowns.size.querySelectorAll(".btn-key-depth").forEach(t=>{t.addEventListener("click",e=>{cc(parseFloat(e.currentTarget.value)),Vt&&v.dropdowns.size.hide()})});v.menus.colors.highlight_opacity.addEventListener("sl-select",t=>{d.highlight_opacity=t.detail.item.value,dt(),ac()});v.menus.colors.item_perspective.addEventListener("click",()=>{d.perspective=!d.perspective,Br(),dt(),Vt&&v.dropdowns.colors.hide()});v.menus.colors.item_top_felt.addEventListener("click",()=>{d.top_felt=!d.top_felt,ic(),dt(),Vt&&v.dropdowns.colors.hide()});v.menus.colors.picker_color_white.addEventListener("sl-change",t=>{d.color_white=t.target.value,dt()});v.menus.colors.picker_color_black.addEventListener("sl-change",t=>{d.color_black=t.target.value,dt()});v.menus.colors.picker_color_pressed.addEventListener("sl-change",t=>{d.color_highlight=t.target.value,dt()});v.menus.labels.presets.addEventListener("sl-select",t=>{Qo(t.detail.item.value),Vt&&v.dropdowns.labels.hide()});v.menus.labels.type.addEventListener("sl-select",t=>{t.detail.item.value==v.menus.labels.octave.value?hc(t.detail.item.checked):Eo(t.detail.item.value),Vt&&v.dropdowns.labels.hide()});v.menus.labels.top.addEventListener("sl-select",t=>{t.detail.item.id==v.menus.labels.labeling_mode.id?(Gi(t.detail.item.checked),v.dropdowns.labels.hide()):t.detail.item.id==v.menus.labels.played.id&&(dc(t.detail.item.checked),Vt&&v.dropdowns.labels.hide())});v.buttons.labels_left.addEventListener("click",()=>{Gi()});v.menus.stickers.top.addEventListener("sl-select",t=>{t.detail.item.getAttribute("type")=="checkbox"&&(to(void 0,t.detail.item.value),v.dropdowns.stickers.hide()),dt()});v.buttons.stickers_left.addEventListener("click",()=>{to()});v.menus.stickers.clear.addEventListener("click",t=>{uc()});v.menus.pedals.top.addEventListener("sl-select",t=>{let e=t.detail.item;switch(e.id){case"menu-pedal-follow":d.pedals=e.checked;break;case"menu-pedal-dim":d.pedal_dim=e.checked;break}v.menus.pedals.item_dim.toggleAttribute("disabled",!d.pedals),er(),Ut(),dt(),Vt&&v.dropdowns.pedals.hide()});v.menus.transpose.semitones.btn_plus.onclick=()=>{ne({semitones:1})};v.menus.transpose.semitones.btn_minus.onclick=()=>{ne({semitones:-1})};v.menus.transpose.octaves.btn_plus.onclick=()=>{ne({octaves:1})};v.menus.transpose.octaves.btn_minus.onclick=()=>{ne({octaves:-1})};v.menus.transpose.item_reset.onclick=()=>{ne({reset:!0}),Vt&&v.dropdowns.transpose.hide()};v.buttons.panic.onclick=is;v.buttons.hide_toolbar.onclick=Ui;v.buttons.show_toolbar.onclick=Ui;v.title.onclick=()=>{document.getElementById("dialog-about").show()};window.addEventListener("keydown",vh);function Nr(){function t(){let i=yt.ports.map((n,a)=>[n.name,()=>Hi(n.name,!0),{checked:d.device_name==n.name}]);return i.push(["Computer keyboard",()=>Hi("pckbd",!0),{checked:d.pc_keyboard_connected}]),i.push(["Touch or mouse",()=>Hi("touch",!0),{checked:ot.enabled}]),i}function e(){if(!d.transpose)return"not transposed";let i=`${d.semitones} semitone${d.semitones!=1?"s":""}`,n=`${d.octaves} octave${d.octaves!=1?"s":""}`;return`${i}, ${n}`}function o(){return d.height_factor==1?"Full":d.height_factor==.5?"1/2":"3/4"}let r=rc();return[["",[["&Control",t()],["&Transpose",[["[\u2191] Semitone up",()=>ne({semitones:1}),{noindex:!0,key:"arrowup"}],["[\u2193] Semitone down",()=>ne({semitones:-1}),{noindex:!0,key:"arrowdown"}],["[\u2192] Octave up",()=>ne({octaves:1}),{noindex:!0,key:"arrowright"}],["[\u2190] Octave down",()=>ne({octaves:-1}),{noindex:!0,key:"arrowleft"}],["&Reset",()=>ne({reset:!0}),{noindex:!0}],[`State: ${e()}`,null]]],["&Size",[["&88 keys",()=>Yo(88),{noindex:!0,checked:d.number_of_keys==88}],["&61 keys",()=>Yo(61),{noindex:!0,checked:d.number_of_keys==61}],["&49 keys",()=>Yo(49),{noindex:!0,checked:d.number_of_keys==49}],["&37 keys",()=>Yo(37),{noindex:!0,checked:d.number_of_keys==37}],["&25 keys",()=>Yo(25),{noindex:!0,checked:d.number_of_keys==25}],[`Change key &depth (current: ${o()})`,()=>ih(),{noindex:!0}]]],["&Pedals",[["&Follow pedals",()=>nh(),{checked:d.pedals}],["&Dim pedalized notes",()=>sh(),{checked:d.pedal_dim}]]],["&Labels",[["&Toggle Labeling mode (F2)",()=>Gi(),{checked:$t=="label"}],["&Show on played keys",()=>dc(),{checked:d.labels.played}],["&Presets",[["&None",()=>Qo("none"),{checked:r=="none"}],["&Middle-C",()=>Qo("mc"),{checked:r=="mc"}],["&C-keys",()=>Qo("cs"),{checked:r=="cs"}],["&White keys",()=>Qo("white"),{checked:r=="white"}],["&All keys",()=>Qo("all"),{checked:r=="all"}]]],["&Format",[["&English",()=>Eo("english"),{checked:d.labels.type=="english"}],["&German",()=>Eo("german"),{checked:d.labels.type=="german"}],["&Italian",()=>Eo("italian"),{checked:d.labels.type=="italian"}],["&Pitch-class",()=>Eo("pc"),{checked:d.labels.type=="pc"}],["&MIDI value",()=>Eo("midi"),{checked:d.labels.type=="midi"}],["&Frequency",()=>Eo("freq"),{checked:d.labels.type=="freq"}],["Show &octave",()=>hc(),{checked:d.labels.octave}]]]]],["Stic&kers",[["&Red",()=>to(void 0,"red"),{checked:$t=="sticker"&&d.stickers.color=="red"}],["&Yellow",()=>to(void 0,"yellow"),{checked:$t=="sticker"&&d.stickers.color=="yellow"}],["&Green",()=>to(void 0,"green"),{checked:$t=="sticker"&&d.stickers.color=="green"}],["&Blue",()=>to(void 0,"blue"),{checked:$t=="sticker"&&d.stickers.color=="blue"}],["&Violet",()=>to(void 0,"violet"),{checked:$t=="sticker"&&d.stickers.color=="violet"}],["&Clear",()=>uc()]]],["Panic!",is],[`${d.toolbar?"Hide":"Show"} toolbar [<u>F9</u>]`,Ui,{key:"f9"}]]]]}var Te=new jr(document.getElementById("keyboard-navigator"),Nr());Te.onmenuenter=t=>{yt.setWatchdog(t=="Control"?ts:Vi),Te.replaceStructure(Nr())};Te.onoptionenter=()=>Te.replaceStructure(Nr());Te.onshow=()=>yt.setWatchdog(ts);Te.onhide=()=>yt.setWatchdog(Vi);$.svg.oncontextmenu=t=>{zt.state>0&&t.preventDefault(),zt.state=0};$.svg.addEventListener("pointerdown",t=>{v.dropdowns.closeAll(),(t.pointerType!="touch"&&t.button!=0||!ot.enabled)&&(!$t||t.button!=0)&&(zt.state=1,zt.origin.x=t.screenX,zt.origin.y=t.screenY,zt.previous_offset.x=d.offset.x,zt.previous_offset.y=d.offset.y,$.svg.setPointerCapture(t.pointerId),Ao())},{capture:!0,passive:!1});$.svg.addEventListener("pointerup",t=>{t.pointerType!="touch"&&zt.state&&(zt.state=zt.state==2&&t.button==2?3:0,$.svg.releasePointerCapture(t.pointerId),Po(),Ao(),dt())},{capture:!0,passive:!1});$.svg.addEventListener("pointermove",t=>{if(t.pointerType!="touch"&&zt.state){let o=$.svg.getBoundingClientRect(),r=$.container.getBoundingClientRect();zt.state=2;let n=(t.screenX-zt.origin.x)/(o.width-r.width);d.offset.x=ro(zt.previous_offset.x-n,0,1);let a=$.container.clientHeight/$.svg.clientHeight;if(d.zoom<a-(a-1)/10){let l=(t.screenY-zt.origin.y)/(r.height-o.height);d.offset.y=ro(zt.previous_offset.y+l,0,1),t.ctrlKey||(d.offset.y<.06&&(d.offset.y=0),d.offset.y>1-.06&&(d.offset.y=1),Math.abs(.5-d.offset.y)<.06&&(d.offset.y=.5))}Po(),Ao()}},{capture:!1,passive:!0});$.container.addEventListener("wheel",t=>{if(!zt.state&&!ot.started()&&!t.ctrlKey){let e=-t.deltaY/(t.deltaY<=0?1e3:500),o=$.container.clientHeight/$.svg.clientHeight,r=ro(d.zoom+e,1,o);if(d.zoom!=r){let n=$.svg.getBoundingClientRect(),a=$.container.getBoundingClientRect(),s=Math.round(a.width*r);d.offset.x=(t.clientX-(t.clientX-n.left)/n.width*s-a.left)/(a.width-s),d.zoom=r}let i=t.deltaX/1e3;i&&(d.offset.x=ro(d.offset.x-i,0,1)),Po()}t.preventDefault()},{capture:!1,passive:!1});Vt||(zi=null,$.container.addEventListener("pointermove",t=>{t.pointerType!="touch"&&(zi&&clearTimeout(zi),v.buttons.show_toolbar.toggleAttribute("visible",!0),$.container.toggleAttribute("cursor-hidden",!1),$.svg.toggleAttribute("cursor-hidden",!1),zi=setTimeout(()=>{v.buttons.show_toolbar.toggleAttribute("visible",!1),ot.enabled||($.container.toggleAttribute("cursor-hidden",!0),$.svg.toggleAttribute("cursor-hidden",!0))},4e3))},{capture:!1,passive:!0}));var zi;function eo(t,e){let o=document.elementFromPoint(t,e)?.parentElement;return o?.classList.contains("key")?parseInt(o.getAttribute("value")):null}function pc(t,e,o,r,i){let n=ds(i),a=Math.sin(n),s=Math.cos(n);ec&&(o/=10,r/=10);let[l,u]=o>=r?[t+o*s,e+o*a]:[t-r*a,e+r*s],[m,c]=o>=r?[t-o*s,e-o*a]:[t+r*a,e-r*s],[f,h]=o>=r?[t-r*a,e+r*s]:[t+o*s,e+o*a],[g,b]=o>=r?[t+r*a,e-r*s]:[t-o*s,e-o*a],w=eo(l,u),_=eo(m,c),S=eo(f,h),E=eo(g,b),L=new Set([w,_,S,E]),D=Math.min(w,_,S,E),W=Math.max(w,_,S,E),j=W-D;if(j>1){let[X,O]=D==w?[l,u]:D==_?[m,c]:D==S?[f,h]:[g,b],[rt,k]=W==w?[l,u]:W==_?[m,c]:W==S?[f,h]:[g,b],it=(rt-X)/j,ft=(k-O)/j;for(let Y=.5;Y<j;Y+=.5){let[Lt,xt]=[X+it*Y,O+ft*Y],Z=eo(Lt,xt);L.add(Z)}}return L.delete(null),L}function dh(t){if(v.dropdowns.closeAll(),t.pointerType!="touch"&&ot.enabled&&!$t&&t.button===0&&!ot.started(t.pointerId)){let e=eo(t.clientX,t.clientY);e&&(ot.add(t.pointerId,new Set([e])),t.preventDefault())}}function fc(t){t.pointerType!="touch"&&ot.started(t.pointerId)&&t.button===0&&(t.preventDefault(),ot.remove(t.pointerId))}function hh(t){if(t.pointerType!="touch"&&ot.started(t.pointerId)){let e=eo(t.clientX,t.clientY);ot.change(t.pointerId,new Set([e])),t.preventDefault()}}function ph(t){if(ot.enabled&&!$t){for(let e of t.changedTouches)if(!ot.started(e.identifier)){let o=pc(e.clientX,e.clientY,e.radiusX,e.radiusY,e.rotationAngle);o.size&&(ot.add(e.identifier,o),t.timeStamp-ot.last_vibration_time>40&&(navigator.vibrate(40),ot.last_vibration_time=t.timeStamp),t.preventDefault())}}}function mc(t){for(let e of t.changedTouches)ot.started(e.identifier)&&(ot.remove(e.identifier),t.preventDefault())}function fh(t){for(let e of t.changedTouches)if(ot.started(e.identifier)){let o=pc(e.clientX,e.clientY,e.radiusX,e.radiusY,e.rotationAngle);ot.change(e.identifier,o)==1&&t.timeStamp-ot.last_vibration_time>40&&(navigator.vibrate(40),ot.last_vibration_time=t.timeStamp),t.preventDefault()}}$.svg.addEventListener("pointerdown",dh,{capture:!0,passive:!1});$.svg.addEventListener("touchstart",ph,{capture:!0,passive:!1});window.addEventListener("pointerup",fc,{capture:!1,passive:!1});window.addEventListener("pointercancel",fc,{capture:!1,passive:!1});window.addEventListener("touchend",mc,{capture:!1,passive:!1});window.addEventListener("touchcancel",mc,{capture:!1,passive:!1});window.addEventListener("pointermove",hh,{capture:!1,passive:!1});window.addEventListener("touchmove",fh,{capture:!1,passive:!1});function mh(t){if(t.button===0){let e=eo(t.clientX,t.clientY);if(e){let o=t.ctrlKey?Array.from(Mo(e%12,128,12)):[e];if($t=="label"){let r=o.some(i=>!d.labels.keys.has(i));for(let i of o)d.labels.toggle(i,r)}else if($t=="sticker"){let r=o.some(i=>!d.stickers.keys.has(i));for(let i of o)d.stickers.toggle(i,r)}}}}$.svg.addEventListener("click",mh,{capture:!1,passive:!0});function gc(t,e){Jn(t),Ot.play(t,e)}function bc(t,e,o){o&&o<100?setTimeout(()=>Jn(t),100-o):Jn(t),Ot.stop(t,!1)}function gh(){Ut(),Ot.stopAll(!1),er()}function bh(t){t>63&&t<68&&(Ut(),Ot.stopAll(!1),er())}function yh(){Ut(),Ot.stopAll(!0),er()}st.onConnectionChange=()=>{Ut(),Wt()};st.onKeyPress=gc;st.onKeyRelease=bc;st.onControlChange=bh;Ht.onKeyPress=gc;Ht.onKeyRelease=bc;Ht.onSustain=gh;Ht.onReset=yh;function yc(){let t=v.dropdowns.connect.open;yt.queryAccess(e=>{e=="granted"?(Te.visible&&Te.replaceStructure(Nr()),yt.requestPorts(o=>{if(yt.ports=o,d.device_name&&d.device_name!="pckbd"&&d.device_name!="touch"){if(!st.getConnectedPort()){let i=o.find(n=>n.name==d.device_name);i&&st.connect(i,()=>{Wt(),t&&Co()})}Wt()}t&&Co()})):(st.disconnect(),Wt(),t&&Co())})}function vh(t){if(t.repeat)return;if(t.key=="Alt"){let i=v.dropdowns.getOpen();i&&(i.hide(),i.querySelector("sl-button[slot=trigger]").blur())}let e=new Map([["f2",Gi],["f3",to],["f9",Ui],["escape",()=>{let i=v.dropdowns.getOpen();i?(i.hide(),i.querySelector("sl-button[slot=trigger]").blur()):$t?ns(null):is()}],["pageup",()=>ne({semitones:1})],["pagedown",()=>ne({semitones:-1})],["shift+pageup",()=>ne({octaves:1})],["shift+pagedown",()=>ne({octaves:-1})]]),o=[];t.ctrlKey&&o.push("ctrl"),t.altKey&&o.push("alt"),t.shiftKey&&o.push("shift"),o.push(t.key.toLowerCase());let r=o.join("+");e.has(r)&&(t.preventDefault(),e.get(r)())}function _h(){v.resize.timeout&&clearTimeout(v.resize.timeout),v.resize_timeout=setTimeout(()=>{sc(),v.resize.timeout=null},d.lowperf?50:5)}function wh(){$.resize.timeout&&clearTimeout($.resize.timeout),$.resize_timeout=setTimeout(()=>{Po(),$.resize.timeout=null},d.lowperf?50:5)}function kh(){if(ah(),lh(),document.body.classList.add("ready"),Vt&&(document.documentElement.classList.add("mobile"),v.buttons.show_toolbar.classList.add("mobile"),v.buttons.panic.parentElement.toggleAttribute("disabled",!0),v.buttons.hide_toolbar.parentElement.toggleAttribute("disabled",!0),v.buttons.show_toolbar.parentElement.toggleAttribute("disabled",!0),v.menus.size.querySelector('.btn-number-of-keys[value="20"]').toggleAttribute("hidden",!1)),ec?v.dropdowns.sound.toggleAttribute("hidden",!0):(document.getElementById("menu-sound-item-unavailable").hidden=!0,v.menus.sound.querySelectorAll(".menu-sound-item").forEach(e=>{e.hidden=!1}),Vt&&d.sound&&Ot.load(d.sound)),Wt(),Br(),d.device_name)["pckbd","touch"].includes(d.device_name)?tr(d.device_name):yt.queryAccess(e=>{e=="granted"&&tr(d.device_name)});else{let e=document.getElementById("dropdown-connect-tooltip");Vt?(tr("touch",!0),e.setAttribute("content","Play your keyboard using your fingers! Or change the input method by tapping this button.")):e.setAttribute("content","Click on this button to select an input method."),e.open=!0,window.addEventListener("click",()=>{e.open=!1},{once:!0})}function t(){sc(),v.resize.observer=new ResizeObserver(_h),v.resize.observer.observe(v.self),Po(),$.resize.observer=new ResizeObserver(wh),$.resize.observer.observe($.container)}document.readyState!="complete"?window.addEventListener("load",t,{once:!0}):t(),yc(),yt.setWatchdog(Vi)}Promise.allSettled([customElements.whenDefined("sl-dropdown"),customElements.whenDefined("sl-button"),customElements.whenDefined("sl-button-group"),customElements.whenDefined("sl-icon"),customElements.whenDefined("sl-menu"),customElements.whenDefined("sl-menu-item")]).finally(kh);
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/static.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/if-defined.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/style-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
