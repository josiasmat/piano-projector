var yc=["0","1","2","3","4","5","6","7","8","9"],lh=yc.concat(["A","a","B","b","C","c","D","d","E","e","F","f"]);function*$o(t,e,o=e>t?1:-1){if(o>0&&t<e)for(;t<e;)yield t,t+=o;else if(o<0&&t>e)for(;t>e;)yield t,t+=o}function io(t,e,o){return t<e?e:t>o?o:t}function en(t,e){let o=e.indexOf(t)+1;return o==e.length&&(o=0),e[o]}function on(t,e=""){return new URLSearchParams(window.parent.location.search).get(t)??e}function rn(t){return t*(Math.PI/180)}function sn(t,e={},o=null){let i=t.cloneNode(!0).content.children[0];for(let[r,s]of Object.entries(e))typeof s=="boolean"?i.toggleAttribute(r,s):i.setAttribute(r,s);return o!==null&&(i.children[0].innerText=o),i}function nn(){return navigator.userAgentData?navigator.userAgentData.mobile:/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}function an(){return/^((?!chrome|android).)*safari/i.test(navigator.userAgent)}var Kr=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],Wr=64,jr=66,ln=67,vc=123,J={onKeyPress:null,onKeyRelease:null,onPitchClassOn:null,onPitchClassOff:null,onControlChange:null,onSustainPedal:null,onSostenutoPedal:null,onReset:null,onConnectionChange:null,get browserHasMidiSupport(){return!!navigator.requestMIDIAccess},queryMidiAccess(t=null){return this.browserHasMidiSupport?(navigator.permissions.query({name:"midi",sysex:!1}).then(e=>{switch(e.state){case"granted":t?.("granted");break;case"prompt":t?.("prompt");break;default:t?.("denied")}}),!0):(t?.("unavailable"),!1)},requestMidiAccess(t,e=null){if(!this.browserHasMidiSupport){e?.();return}navigator.requestMIDIAccess({sysex:!1}).then(t,e)},requestInputPortList(t,e){if(!this.browserHasMidiSupport){e?.();return}navigator.requestMIDIAccess({sysex:!1}).then(o=>{let i=[];if(o.inputs.size>0)for(let r of o.inputs.values())i.push(r);t(i)},e)},connect(t,e=null,o=Kr){this.browserHasMidiSupport&&(this.disconnect(),t.open().then(()=>{C.dev=t,t.addEventListener("midimessage",zi),e?.(t),this.onConnectionChange?.(!0,t)}),C.channels=Array.from(o))},connectByPortName(t,e=null,o=Kr){this.browserHasMidiSupport&&this.requestInputPortList(i=>{for(let r of i)r.name==t&&(this.disconnect(),r.open().then(s=>{C.dev=s,s.addEventListener("midimessage",zi),e?.(s),this.onConnectionChange?.(!0,s)}),C.channels=Array.from(o))})},connectByPortId(t,e=null,o=Kr){this.browserHasMidiSupport&&this.requestInputPortList(i=>{for(let r of i)r.id==t&&(this.disconnect(),r.open().then(s=>{C.dev=s,s.addEventListener("midimessage",zi),e?.(s),this.onConnectionChange?.(!0,s)}),C.channels=Array.from(o))})},disconnect(){if(!this.browserHasMidiSupport)return;let t=C.dev;t&&(C.dev.removeEventListener("midimessage",zi),t.removeEventListener("statechange",_c),C.dev.close(),C.dev=null,C.channels=[],C.reset(),this.onConnectionChange(!1,t))},getConnectedPort(){return this.browserHasMidiSupport&&C.dev?.state=="connected"?C.dev:null},isKeyPressed(t){return t<0||t>127?!1:C.keys[t]},isNoteOn(t,e="none"){if(t<0||t>127)return!1;switch(e){case"sustain":return this.isKeyPressed(t)||C.sustain[t];case"sostenuto":return this.isKeyPressed(t)||C.sostenuto[t];case"both":return this.isKeyPressed(t)||C.sustain[t]||C.sostenuto[t];default:return this.isKeyPressed(t)}},isPitchClassOn(t,e="none"){for(let o=t;o<128;o+=12)if(this.isNoteOn(o,e))return!0;return!1},getLastControlValue(t){return C.cc[t]},reset(){C.reset()},setPedalThreshold(t){C.pedals.threshold=t},get sustain_pressed(){return C.pedals.sustain},get sostenuto_pressed(){return C.pedals.sostenuto},get soft_pressed(){return C.pedals.soft},get sustain_pedal_value(){return C.cc[Wr]},get sostenuto_pedal_value(){return C.cc[jr]},get soft_pedal_value(){return C.cc[ln]}};function _c(t){t.port.state=="disconnected"&&C.dev==t.port&&(C.dev=null),J.onConnectionChange?.(t.port.state=="connected",t.port)}var C={dev:null,channels:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],cc:Array(128).fill(0),keys:Array(128).fill(null),pcs:Array(12).fill(0),sustain:Array(128).fill(!1),sostenuto:Array(128).fill(!1),pedals:{threshold:64,get sustain(){return C.cc[Wr]>=this.threshold},get sostenuto(){return C.cc[jr]>=this.threshold},get soft(){return C.cc[ln]>=this.threshold}},last_event_timestamp:0,last_event_time_delta:0,reset(){this.cc=Array(128).fill(0),this.keys=Array(128).fill(!1),this.pcs=Array(12).fill(0),this.sustain=Array(128).fill(!1),this.sostenuto=Array(128).fill(!1)}};function zi(t){C.last_event_time_delta=t.timeStamp-C.last_event_timestamp,C.last_event_timestamp=t.timeStamp;for(let e of C.channels)switch(t.data[0]){case 144+e:wc(t.data[1],t.data[2]);break;case 128+e:cn(t.data[1],t.data[2]);break;case 176+e:Sc(t.data[1],t.data[2])}}function wc(t,e){let o=t%12;C.keys[t]||(C.keys[t]=Date.now(),C.pcs[o]+=1),C.pedals.sustain&&(C.sustain[t]=!0),J.onKeyPress?.(t,e),C.pcs[o]==1&&J.onPitchClassOn?.(o)}function cn(t,e){let o=t%12,i=0;C.keys[t]&&(i=Date.now()-C.keys[t],C.keys[t]=null,C.pcs[o]-=1),J.onKeyRelease?.(t,e,i),C.pcs[o]==0&&J.onPitchClassOff?.(o)}function kc(t){let e=t>=C.pedals.threshold;if(C.pedals.sustain!=e)if(e){for(let o=0;o<128;o++)C.sustain[o]=C.keys[o]||C.sostenuto[o];J.onSustainPedal?.(e,t)}else{for(let o=0;o<128;o++)C.sustain[o]=!1;J.onSustainPedal?.(e,t)}}function xc(t){if(!C.pedals.sostenuto&&t>=C.pedals.threshold){for(let e=0;e<128;e++)C.sostenuto[e]=C.keys[e];J.onSostenutoPedal?.(C.pedals.sostenuto,t)}else if(C.pedals.sostenuto&&t<C.pedals.threshold){for(let e=0;e<128;e++)C.sostenuto[e]=!1;J.onSostenutoPedal?.(C.pedals.sostenuto,t)}}function Sc(t,e){t==jr&&xc(e),t==Wr&&kc(e),t==vc&&Ac(),C.cc[t]=e,J.onControlChange?.(t,e)}function Ac(){for(let t=0;t<128;t++)cn(t)}function Xr(t){let o={c:0,"c#":1,db:1,d:2,"d#":3,eb:3,e:4,fb:4,"e#":5,f:5,"f#":6,gb:6,g:7,"g#":8,ab:8,a:9,"a#":10,bb:10,b:11,"b#":12,cb:-1}[t.slice(0,t.length-1).toLowerCase()],i=parseInt(t.slice(t.length-1));return o+12*(i+1)}function un(t,e=440){return 2**((t-69)/12)*e}var Yr="http://www.w3.org/2000/svg",Cc={createElement(t,e={}){let o=document.createElementNS(Yr,t);for(let[i,r]of Object.entries(e))o.setAttribute(i,r);return o},createRootElement(t={}){let e=document.createElementNS(Yr,"svg");e.setAttribute("version","1.1"),e.setAttribute("xmlns",Yr);for(let[o,i]of Object.entries(t))e.setAttribute(o,i);return e},createGroup(t={}){return this.createElement("g",t)},makeLine(t,e,o,i,r){let s=this.createElement("line",r);return s.setAttribute("x1",t),s.setAttribute("y1",e),s.setAttribute("x2",o),s.setAttribute("y2",i),s},makeCircle(t,e,o,i={}){let r=this.createElement("circle",i);return r.setAttribute("cx",t),r.setAttribute("cy",e),r.setAttribute("r",o),r},makeRect(t,e,o=null,i=null,r=null,s=null,n={}){let a=this.createElement("rect",n);return a.setAttribute("width",t),a.setAttribute("height",e),o&&a.setAttribute("x",o),i&&a.setAttribute("y",i),r&&a.setAttribute("rx",r),s&&a.setAttribute("ry",s),a},makePolygon(t,e={}){let o=t.length,i=this.createElement("path",e),r=["M",t[0].x,t[0].y];if(o>1){for(let s=1;s<o;s++)t[s]&&r.push("L",t[s].x,t[s].y);o>2&&r.push("Z"),i.setAttribute("d",r.join(" "))}return i},makePath(t,e={},o=null,i=null){let r=this.createElement("path",e);return Array.isArray(t)&&(t=t.filter(s=>s!=null).map(s=>Array.isArray(s)?s.join(" "):s).join(" ")),r.setAttribute("d",t),o!=null&&r.setAttribute("x",o.toString()),i!=null&&r.setAttribute("y",i.toString()),r},makeSimpleArrowMarker(t,e,o={}){let i=this.makePath(["M",0,0,"L",10,5,"L",0,10,"Z"],o),r=this.createElement("marker",{id:t,viewbox:[-5,-5,15,15].join(" "),refX:5,refY:5,markerWidth:e,markerHeight:e,orient:"auto-start-reverse"});return r.appendChild(i),r}},N=Cc;var hn=500,Mo=1.3,pn=1.8,Lo=2.5,Ni=.13,si=1.01,Ec=5,dn=3,To=[,-Ni,,+Ni,,,-1.4*Ni,,0,,1.4*Ni];function fn(t,e,o={}){let i=hn,r=o.height_factor??1,s=o.first_key??noteToMidi("a0"),n=o.last_key??noteToMidi("c8"),a=n-s,l=(s+n)/2,d=i*r,f=d*(.14*r+.51),h=Mo/2,b=pn/2,g=i*2.2/15.5,_=i*1.4/15.5,A=g/2,$=g/3,S=_/2,I=g/15,R=_/20,j=2,G=2,lt={top:-4,height:7,get bottom(){return this.top+this.height}},rt=lt.bottom-1,vt=lt.bottom-5,q=lt.bottom+1,dt=vt+(q-vt)/4,y={bottom_height:_/1.8*(Math.max(r-.5,0)/2+.75),bottom_height1:0,side_width_bottom:dn*2,side_width_top:dn,side_width_min:0,side_width_max:0};y.side_width_min=Math.min(y.side_width_top,y.side_width_bottom),y.side_width_max=Math.max(y.side_width_top,y.side_width_bottom),y.bottom_height1=y.bottom_height/2;let bt=d-A*r,$t=bt*si,st=f-y.bottom_height-$*r,Rt=f-y.bottom_height1-$*r,X=g/4/2,Bt=X+$*r,Ut=Bt*.8+y.bottom_height;t.innerHTML="";for(let B=0;B<128;B++)(B<s||B>n)&&(e[B]=null);let me=N.createGroup(),tt=N.createGroup();function Mt(B,wt,ot,k,T,Y){let Q=ot+h+b,ct=ot+k-h-b,Re=Q+(ct-Q)/2,ae=T*si,kt=f+h+Lo,Le=kt*si,le=B>s&&[2,4,7,9,11].includes(wt),L=B<n&&[0,2,5,7,9].includes(wt),w=ot+h+(le?S+_*To[wt-1]+Lo:b),jt=ot+k-h-(L?S-_*To[wt+1]+Lo:b),ii=k*.015,pt=ii*kt/T,Hr=w+(Re-w)/k*pt,Vr=jt-(jt-Re)/k*pt,v={ax:w,ay:rt,bx:jt,by:rt,cx:jt,cy:kt,dx:ct,dy:kt,ex:ct,ey:T,fx:Q,fy:T,gx:Q,gy:kt,hx:w,hy:kt},x={ax:v.ax,ay:v.ay,bx:v.bx,by:v.by,cx:Vr,cy:Le,dx:ct-pt,dy:Le,ex:ct-ii,ey:ae,fx:Q+ii,fy:ae,gx:Q+pt,gy:Le,hx:Hr,hy:Le},yt=Y/4,Be=N.createGroup({id:`key${B}`,class:"key white-key",value:B}),Ur=N.makePath(["M",v.ax,v.ay,"H",v.bx,L?["V",v.cy,"H",v.dx]:null,"V",v.ey,"H",v.fx,le?["V",v.gy,"H",v.hx]:null,"Z"],{class:"key-touch-area invisible",value:B}),Gr=Se(["M",v.ax,v.ay,"H",v.bx,L?["L",v.cx,v.cy,"H",v.dx]:null,"L",v.ex,v.ey-Y,"Q",v.ex-yt,v.ey-yt,v.ex-Y,v.ey,"H",v.fx+Y,"Q",v.fx+yt,v.fy-yt,v.fx,v.fy-Y,le?["L",v.gx,v.gy,"H",v.hx]:null,"Z"],["M",x.ax,x.ay,"H",x.bx,L?["L",x.cx,x.cy,"H",x.dx]:null,"L",x.ex,x.ey-Y,"Q",x.ex-yt,x.ey-yt,x.ex-Y,x.ey,"H",x.fx+Y,"Q",x.fx+yt,x.fy-yt,x.fx,x.fy-Y,le?["L",x.gx,x.gy,"H",x.hx]:null,"Z"],{class:"key-fill"}),z=j,ri=Se(["M",v.ax+z,v.ay-h,"H",v.bx-z,L?["L",v.cx-z,v.cy+z,"H",v.dx-z]:null,"L",v.ex-z,v.ey-z-Y+h,"Q",v.ex-yt-z+h,v.ey-yt-z,v.ex-Y-z+h,v.ey-z,"H",v.fx+z+Y-h,"Q",v.fx+yt+z,v.fy-z-yt+h,v.fx+z,v.fy-z-Y+h,le?["L",v.gx+z,v.gy+z,"H",v.hx+z]:null,"Z"],["M",x.ax+z,x.ay-h,"H",x.bx-z,L?["L",x.cx-z,x.cy+z,"H",x.dx-z]:null,"L",x.ex-z,x.ey-z-Y+h,"Q",x.ex-yt-z+h,x.ey-yt-z,x.ex-Y-z+h,x.ey-z,"H",x.fx+z+Y-h,"Q",x.fx+yt+z,x.fy-z-yt+h,x.fx+z,x.fy-z-Y+h,le?["L",x.gx+z,x.gy+z,"H",x.hx+z]:null,"Z"],{class:"key-highlight"}),hc=Se(["M",v.ax,v.ay+h,le?["L",v.hx,v.hy,"H",v.gx]:null,"L",v.fx,v.fy-Y-h,L?["M",v.cx,v.cy,"H",v.dx]:null],["M",x.ax,x.ay+h,le?["L",x.hx,x.hy,"H",x.gx]:null,"L",x.fx,x.fy-Y-h,L?["M",x.cx,x.cy,"H",x.dx]:null],{class:"key-light-border white-key-border"}),pc=Se(["M",v.fx,v.fy-Y,"Q",v.fx+yt,v.fy-yt,v.fx+Y,v.fy,"H",v.ex-Y,"Q",v.ex-yt,v.ey-yt,v.ex,v.ey-Y,L?["L",v.dx,v.dy,"M",v.cx,v.cy]:null,"L",v.bx,v.by+h],["M",x.fx,x.fy-Y,"Q",x.fx+yt,x.fy-yt,x.fx+Y,x.fy,"H",x.ex-Y,"Q",x.ex-yt,x.ey-yt,x.ex,x.ey-Y,L?["L",x.dx,x.dy,"M",x.cx,x.cy]:null,"L",x.bx,x.by+h],{class:"key-dark-border white-key-border"}),fc=Gt(B,ot),mc=ot+k/2,gc=d-Bt,bc=N.makeCircle(mc,gc,X,{class:"key-sticker white-key-sticker"}),qr=N.createGroup({class:"key-marker-group",press_transform:`translateY(${$t-bt}px)`});return qr.appendChild(fc),qr.appendChild(bc),Be.appendChild(Gr),Be.appendChild(ri),Be.appendChild(pc),Be.appendChild(hc),Be.appendChild(qr),Be.appendChild(Ur),Be}function ht(B){return!o.perspective||Do(B)?0:(B-l)/((88+a)/4)*y.side_width_max}function Pt(B,wt,ot,k,T,Y){let Q=wt,ct=Q+ot,Re=T/2,ae=T/4,kt=ht(B)*1.5,Le=kt/2,le=kt/1.2,L=o.perspective?{left_top:Math.max(0,y.side_width_top+kt),left_bottom:Math.max(0,y.side_width_bottom+kt),right_top:Math.max(0,y.side_width_top-kt),right_bottom:Math.max(0,y.side_width_bottom-kt),left_top1:Math.max(0,y.side_width_top+le),left_bottom1:Math.max(0,y.side_width_bottom+Le),right_top1:Math.max(0,y.side_width_top-le),right_bottom1:Math.max(0,y.side_width_bottom-Le)}:{left_top:y.side_width_top,left_bottom:y.side_width_bottom,right_top:y.side_width_top,right_bottom:y.side_width_bottom,left_top1:y.side_width_top,left_bottom1:y.side_width_bottom,right_top1:y.side_width_top,right_bottom1:y.side_width_bottom},w=o.perspective?{left_top:Math.min(Q,Q+y.side_width_top+kt),left_bottom:Math.min(Q,Q+y.side_width_bottom+kt),right_top:Math.max(ct,ct-y.side_width_top+kt),right_bottom:Math.max(ct,ct-y.side_width_bottom+kt),left_top1:Math.min(Q,Q+y.side_width_top+le),left_bottom1:Math.min(Q,Q+y.side_width_bottom+Le),right_top1:Math.max(ct,ct-y.side_width_top+le),right_bottom1:Math.max(ct,ct-y.side_width_bottom+Le)}:{left_top:Q,left_bottom:Q,right_top:ct,right_bottom:ct,left_top1:Q,left_bottom1:Q,right_top1:ct,right_bottom1:ct},jt=N.createGroup({id:`key${B}`,class:"key black-key",value:B}),tn=N.makePath(["M",w.left_top1,q,"L",w.left_top1+L.left_top1,dt,"H",w.right_top1-L.right_top1,"L",w.right_top1,q,"L",w.right_bottom1,k-y.bottom_height1-T,"L",ct,k,"H",Q,"L",w.left_bottom1,k-y.bottom_height1-T,"Z"],{class:"key-touch-area invisible",value:B}),ii=Se(["M",w.left_top,q,"L",w.left_top+L.left_top,vt,"H",w.right_top-L.right_top,"L",w.right_top,q,"L",w.right_bottom,k-y.bottom_height-T,"L",ct,k,"H",Q,"L",w.left_bottom,k-y.bottom_height-T,"Z"],["M",w.left_top1,q,"L",w.left_top1+L.left_top1,dt,"H",w.right_top1-L.right_top1,"L",w.right_top1,q,"L",w.right_bottom1,k-y.bottom_height1-T,"L",ct,k,"H",Q,"L",w.left_bottom1,k-y.bottom_height1-T,"Z"],{class:"key-fill"}),pt=G,Hr=Se(["M",w.left_top+pt,q,"L",Math.max(w.left_top+pt,w.left_top+L.left_top),vt,"H",Math.min(w.right_top-pt,w.right_top-L.right_top),"L",w.right_top-pt,q,"L",w.right_bottom-pt,k-pt-y.bottom_height-Re,"L",ct-pt,k-pt,"H",Q+pt,"L",w.left_bottom+pt,k-pt-y.bottom_height-Re,"Z"],["M",w.left_top1+pt,q,"L",Math.max(w.left_top1+pt,w.left_top1+L.left_top1),dt,"H",Math.min(w.right_top1-pt,w.right_top1-L.right_top1),"L",w.right_top1-pt,q,"L",w.right_bottom1-pt,k-pt-y.bottom_height1-Re,"L",ct-pt,k-pt,"H",Q+pt,"L",w.left_bottom1+pt,k-pt-y.bottom_height1-Re,"Z"],{class:"key-highlight"});if(jt.appendChild(ii),jt.appendChild(Hr),L.left_bottom>0||L.left_top>0){let ri=Se(["M",w.left_top,q,"L",w.left_bottom,k,"L",w.left_bottom+L.left_bottom,k-y.bottom_height-T,"L",w.left_top+L.left_top,vt,"Z"],["M",w.left_top1,q,"L",w.left_bottom1,k,"L",w.left_bottom1+L.left_bottom1,k-y.bottom_height1-T,"L",w.left_top1+L.left_top1,dt,"Z"],{class:"key-left-bevel black-key-bevel"});jt.appendChild(ri)}if(L.right_bottom>0||L.right_top>0){let ri=Se(["M",w.right_top,q,"L",w.right_bottom,k,"L",w.right_bottom-L.right_bottom,k-y.bottom_height-T,"L",w.right_top-L.right_top,vt,"Z"],["M",w.right_top1,q,"L",w.right_bottom1,k,"L",w.right_bottom1-L.right_bottom1,k-y.bottom_height1-T,"L",w.right_top1-L.right_top1,dt,"Z"],{class:"key-right-bevel black-key-bevel"});jt.appendChild(ri)}let Vr=Se(["M",Q,k,"H",ct,"L",w.right_bottom-L.right_bottom-T,k-y.bottom_height,"H",w.left_bottom+L.left_bottom+T,"Z"],["M",Q,k,"H",ct,"L",w.right_bottom1-L.right_bottom1-T,k-y.bottom_height1,"H",w.left_bottom1+L.left_bottom1+T,"Z"],{class:"key-bottom-bevel black-key-bevel"});jt.appendChild(Vr);let v=Se(["M",Q,k,"L",w.left_bottom+L.left_bottom,k-y.bottom_height-T,"Q",w.left_bottom+L.left_bottom+ae,k-y.bottom_height-ae,w.left_bottom+L.left_bottom+T,k-y.bottom_height,"Z"],["M",Q,k,"L",w.left_bottom1+L.left_bottom1,k-y.bottom_height1-T,"Q",w.left_bottom1+L.left_bottom1+ae,k-y.bottom_height1-ae,w.left_bottom1+L.left_bottom1+T,k-y.bottom_height1,"Z"],{class:"key-left-round-bevel black-key-bevel"});jt.appendChild(v);let x=Se(["M",ct,k,"L",w.right_bottom-L.right_bottom,k-y.bottom_height-T,"Q",w.right_bottom-L.right_bottom-ae,k-y.bottom_height-ae,w.right_bottom-L.right_bottom-T,k-y.bottom_height,"Z"],["M",ct,k,"L",w.right_bottom1-L.right_bottom1,k-y.bottom_height1-T,"Q",w.right_bottom1-L.right_bottom1-ae,k-y.bottom_height1-ae,w.right_bottom1-L.right_bottom1-T,k-y.bottom_height1,"Z"],{class:"key-right-round-bevel black-key-bevel"});jt.appendChild(x);let yt=se(B,wt),Be=wt+ot/2+kt,Ur=f-Ut,Gr=N.makeCircle(Be,Ur,X,{class:"key-sticker black-key-sticker"}),z=N.createGroup({class:"key-marker-group",press_transform:`translateX(${(Le-kt)*.7}px) translateY(${Rt-st}px)`});return z.appendChild(yt),z.appendChild(Gr),jt.appendChild(z),jt.appendChild(tn),jt}function Gt(B,wt){let ot=wt+A,k=N.createElement("text",{x:ot,y:bt,id:`keylabel${B}`,class:"key-label white-key-label"});return k.appendChild(N.createElement("tspan",{x:ot})),k}function se(B,wt){let ot=wt+S+ht(B)/2,k=N.createElement("text",{x:ot,y:st,id:`keylabel${B}`,class:"key-label black-key-label"});return k.appendChild(N.createElement("tspan",{x:ot})),k.appendChild(N.createElement("tspan",{x:ot,dy:"-0.9lh"})),k.appendChild(N.createElement("tspan",{x:ot,dy:"-1.0lh"})),k}let ne=0,ke=0;for(let B=s;B<=n;B++){let wt=B%12;if(Do(wt)){let ot=Mt(B,wt,ke,g,d,I);me.appendChild(ot),e[B]=ot,ne+=g,ke+=g}else{let ot=ke-S+To[wt]*_,k=Pt(B,ot,_,f,R,ke);tt.appendChild(k),e[B]=k}}t.appendChild(me),t.appendChild(N.makeRect(ne,lt.height,0,lt.top,null,null,{id:"top-felt"})),t.appendChild(tt);let Wt={left:-2,top:-4,width:ne+Mo+2,height:d*Math.max(si,1)+Mo+Ec};t.setAttribute("viewBox",`${Wt.left} ${Wt.top} ${Wt.width} ${Wt.height}`);function xe(B,wt,ot=!1,k={}){let T=N.createElement("linearGradient",ot?{id:B,x2:"0%",y2:"100%"}:{id:B});for(let Y of wt)T.appendChild(N.createElement("stop",Y));for(let[Y,Q]of Object.entries(k))T.setAttribute(Y,Q);return T}let ge=N.createElement("defs");ge.appendChild(xe("white-key-gradient",[{offset:"30%","stop-color":"color-mix(in oklch, var(--color-white-key), white 10%)"},{offset:"100%","stop-color":"color-mix(in oklch, var(--color-white-key), black 10%)"}],!1,{gradientTransform:"rotate(45)"})),ge.appendChild(xe("black-key-gradient",[{offset:"30%","stop-color":"color-mix(in oklch, var(--color-black-key), white 15%)"},{offset:"100%","stop-color":"color-mix(in oklch, var(--color-black-key), black 15%)"}],!1,{gradientTransform:"rotate(45)"})),ge.appendChild(xe("pressed-white-key-highlight-gradient",[{offset:"0%","stop-color":"var(--color-highlight-alpha)","stop-opacity":"50%"},{offset:"40%","stop-color":"var(--color-highlight-alpha)"}],!0)),ge.appendChild(xe("pressed-black-key-highlight-gradient",[{offset:"0%","stop-color":"var(--color-highlight-alpha)","stop-opacity":"50%"},{offset:"50%","stop-color":"var(--color-highlight-alpha)"}],!0)),ge.appendChild(xe("top-felt-gradient",[{offset:"50%","stop-color":"var(--color-felt-top)"},{offset:"100%","stop-color":"var(--color-felt-bottom)"}],!0)),t.appendChild(ge)}function mn(t,e,o={}){let i=hn,r=o.height_factor??1,s=o.first_key??noteToMidi("a0"),n=o.last_key??noteToMidi("c8"),a=i*r,l=a*(.14*r+.51),d=Mo/2,f=pn/2,h=i*2.2/15.5,b=i*1.4/15.5,g=h/2,_=h/3,A=b/2,$=h/17,S=2,I=2,R={top:-4,height:7,get bottom(){return this.top+this.height}},j=R.bottom-1,G=R.bottom-5,lt=a-g*r,rt=l-g*r,q=h/4/2,dt=q+_*r,y=dt;t.innerHTML="";for(let tt=0;tt<128;tt++)(tt<s||tt>n)&&(e[tt]=null);let bt=N.createGroup(),$t=N.createGroup();function st(tt,Mt,ht,Pt,Gt,se){let ne=ht+d+f,ke=ht+Pt-d-f,Wt=l+d+Lo,xe=tt>s&&[2,4,7,9,11].includes(Mt),ge=tt<n&&[0,2,5,7,9].includes(Mt),B=ht+d+(xe?A+b*To[Mt-1]+Lo:f),wt=ht+Pt-d-(ge?A-b*To[Mt+1]+Lo:f),ot=N.createGroup({id:`key${tt}`,class:"key white-key lowperf",value:tt}),k=N.makePath(["M",B,j,"H",wt,ge?["V",Wt,"H",ke]:null,"V",Gt-se,"L",ke-se,Gt,"H",ne+se,"L",ne,Gt-se,xe?["V",Wt,"H",B]:null,"Z"],{class:"key-fill key-touch-area lowperf"}),T=S,Y=N.makePath(["M",B+T,j-d,"H",wt-T,ge?["V",Wt+T,"H",ke-T]:null,"V",Gt-T-se+d,"L",ke-se-T+d,Gt-T,"H",ne+T+se-d,"L",ne+T,Gt-T-se+d,xe?["V",Wt+T,"H",B+T]:null,"Z"],{class:"key-highlight lowperf"}),Q=Tt(tt,ht),ct=ht+Pt/2,Re=a-dt,ae=N.makeCircle(ct,Re,q,{class:"key-sticker white-key-sticker lowperf"}),kt=N.createGroup({class:"key-marker-group lowperf"});return kt.appendChild(Q),kt.appendChild(ae),ot.appendChild(k),ot.appendChild(Y),ot.appendChild(kt),ot}function Rt(tt,Mt,ht,Pt){let Gt=Mt,se=Gt+ht,ne=N.createGroup({id:`key${tt}`,class:"key black-key lowperf",value:tt}),ke=N.makePath(["M",Gt,G,"H",se,"V",Pt,"H",Gt,"Z"],{class:"key-fill key-touch-area lowperf"}),Wt=I,xe=N.makePath(["M",Gt+Wt,G+Wt,"H",se-Wt,"V",Pt-Wt,"H",Gt+Wt,"Z"],{class:"key-highlight lowperf"}),ge=X(tt,Mt),B=Mt+ht/2,wt=l-y,ot=N.makeCircle(B,wt,q,{class:"key-sticker black-key-sticker lowperf"}),k=N.createGroup({class:"key-marker-group lowperf"});return k.appendChild(ge),k.appendChild(ot),ne.appendChild(ke),ne.appendChild(xe),ne.appendChild(k),ne}function Tt(tt,Mt){let ht=Mt+g,Pt=N.createElement("text",{x:ht,y:lt,id:`keylabel${tt}`,class:"key-label white-key-label lowperf"});return Pt.appendChild(N.createElement("tspan",{x:ht})),Pt}function X(tt,Mt){let ht=Mt+A,Pt=N.createElement("text",{x:ht,y:rt,id:`keylabel${tt}`,class:"key-label black-key-label lowperf"});return Pt.appendChild(N.createElement("tspan",{x:ht})),Pt.appendChild(N.createElement("tspan",{x:ht,dy:"-0.9lh"})),Pt.appendChild(N.createElement("tspan",{x:ht,dy:"-1.0lh"})),Pt}let Bt=0,Ut=0;for(let tt=s;tt<=n;tt++){let Mt=tt%12;if(Do(Mt)){let ht=st(tt,Mt,Ut,h,a,$);bt.appendChild(ht),e[tt]=ht,Bt+=h,Ut+=h}else{let ht=Ut-A+To[Mt]*b,Pt=Rt(tt,ht,b,l);$t.appendChild(Pt),e[tt]=Pt}}t.appendChild(bt),t.appendChild(N.makeRect(Bt,R.height,0,R.top,null,null,{id:"top-felt",class:"lowperf"})),t.appendChild($t);let me={left:-2,top:-4,width:Bt+Mo+2,height:a*si+Mo+4};t.setAttribute("viewBox",`${me.left} ${me.top} ${me.width} ${me.height}`)}function Se(t,e,o={}){let i=N.createElement("path",o);return t=t.filter(r=>r!=null).map(r=>Array.isArray(r)?r.join(" "):r).join(" "),e=e.filter(r=>r!=null).map(r=>Array.isArray(r)?r.join(" "):r).join(" "),i.setAttribute("d0",t),i.setAttribute("d1",e),i}var Pc=[!0,!1,!0,!1,!0,!0,!1,!0,!1,!0,!1,!0];function Do(t){return Pc[t%12]}var zt={onKeyPress:null,onKeyRelease:null,onSustain:null,onReset:null,get enabled(){return ft.enabled},get velocity(){return ft.velocity},set velocity(t){t<0&&(t=0),t>127&&(t=127),ft.velocity=t},enable(t=null,e=null,o=null,i=null){t&&(this.onKeyPress=t),e&&(this.onKeyRelease=e),o&&(this.onSustain=o),i&&(this.onReset=i),$c()},disable(){Mc()},isNotePressed(t){return ft.pressed_keys.has(t)},isNoteSustained(t){return ft.pressed_keys.has(t)||ft.sustain_keys.has(t)},isSustainActive(){return ft.sustain},resetState(){ft.reset(),this.onReset?.()}},ft={enabled:!1,pressed_keys:new Set([]),sustain_keys:new Set([]),sustain:!1,velocity:88,map:new Map([["KeyZ",48],["KeyS",49],["KeyX",50],["KeyD",51],["KeyC",52],["KeyV",53],["KeyG",54],["KeyB",55],["KeyH",56],["KeyN",57],["KeyJ",58],["KeyM",59],["KeyW",60],["Digit3",61],["KeyE",62],["Digit4",63],["KeyR",64],["KeyT",65],["Digit6",66],["KeyY",67],["Digit7",68],["KeyU",69],["Digit8",70],["KeyI",71],["KeyO",72],["Digit0",73],["KeyP",74],["KeyQ",59],["Digit1",58],["Comma",60],["KeyL",61],["Period",62],["Semicolon",63],["Slash",64],["IntlRo",65],["Backslash",66],["Minus",75],["BracketLeft",76],["BracketRight",77],["IntlBackslash",47]]),reset(){this.pressed_keys.clear(),this.sustain_keys.clear(),this.sustain=!1}};function $c(){ft.enabled||(ft.enabled=!0,window.addEventListener("keydown",bn),window.addEventListener("keyup",yn))}function Mc(){ft.enabled&&(window.removeEventListener("keydown",bn),window.removeEventListener("keyup",yn),ft.enabled=!1,ft.reset())}function Lc(t){ft.pressed_keys.add(t),ft.sustain&&ft.sustain_keys.add(t),zt.onKeyPress?.(t,ft.velocity)}function Tc(t){ft.pressed_keys.delete(t),zt.onKeyRelease?.(t)}function gn(t){if(ft.sustain!=t){if(ft.sustain=t,t)for(let e of ft.pressed_keys)ft.sustain_keys.add(e);else ft.sustain_keys.clear();zt.onSustain(t)}}function bn(t){if(!(t.ctrlKey||t.altKey)){if(t.code.startsWith("Shift"))t.preventDefault(),gn(!0);else if(ft.map.has(t.code)){if(t.preventDefault(),t.repeat)return;let e=ft.map.get(t.code);Lc(e)}}}function yn(t){if(t.code.startsWith("Shift")&&!t.shiftKey&&(t.preventDefault(),gn(!1)),ft.map.has(t.code)){if(t.preventDefault(),t.repeat)return;let e=ft.map.get(t.code);Tc(e)}}var Hi=class{#t=null;#o="";constructor(e,o){switch(e){case"local":this.#t=localStorage;break;case"session":this.#t=sessionStorage;break;default:throw Error(`Invalid storage type: "${e}".`)}o!=""&&(this.#o=o+"_"),this.#o.replace(" ","_")}#e(e){return this.#o+e}isAvailable(){try{let e="__storage_test__";return this.#t.setItem(e,e),this.#t.removeItem(e),!0}catch(e){return e instanceof DOMException&&e.name==="QuotaExceededError"&&this.#t&&this.#t.length!==0}}readString(e,o=""){try{if(!this.isAvailable())throw Error();let i=this.#t.getItem(this.#e(e));return i??o}catch{return o}}writeString(e,o){try{if(!this.isAvailable())throw Error();this.#t.setItem(this.#e(e),o)}catch{return!1}return!0}readNumber(e,o=0){let i=this.readString(e,o);return isNaN(i)?o:Number(i)}writeNumber(e,o){return isNaN(o)?!1:this.writeString(e,o.toString())}readBool(e,o=!1){return this.readString(e,o.toString())==="true"}writeBool(e,o){return o!=!0&&o!=!1?!1:this.writeString(e,o.toString())}remove(e){try{if(!this.isAvailable())throw Error();this.#t.removeItem(this.#e(e))}catch{return!1}return!0}has(e){return this.isAvailable()&&this.#t.getItem(this.#e(e))!==null}keys(){let e=[],o=this.#o.length;for(let i=0;i<this.#t.length;i++){let r=this.#t.key(i);r.startsWith(this.#o)&&e.push(r.substring(o))}return e}clear(){for(let e of this.keys())this.remove(e)}},Vi=class extends Hi{constructor(e){super("local",e)}},Ui=class extends Hi{constructor(e){super("session",e)}};var Gi=class{#t;#o;#e=[];#i=[];#l=[];#s;#n=!1;#r=!1;get visible(){return this.#r}onshow=void 0;onhide=void 0;onmenuenter=void 0;onoptionenter=void 0;constructor(e,o,i="alt"){this.#t=e,this.#o=o,this.#s=i,this.enable()}enable(){this.#n||(this.#n=!0,window.addEventListener("keydown",e=>this.#u(e)),window.addEventListener("keyup",e=>this.#d(e)),window.addEventListener("blur",()=>this.#h()))}disable(){this.#n&&(window.removeEventListener("keydown",e=>this.#u(e)),window.removeEventListener("keyup",e=>this.#d(e)),window.removeEventListener("blur",()=>this.#h()),this.#n=!1)}get container(){return this.#t}replaceStructure(e){this.#o=e,this.#r&&this.#a()}#f(){this.#r==!1&&(this.#r=!0,this.#e=[0],this.onshow?.(),this.#t.hidden=!1,this.#t.focus()),this.#a()}#m(e){this.#e.push(e),this.onmenuenter?.(this.#i[e].text)}#g(){this.#e.length>1&&(this.#e.pop(),this.onmenuenter?.(this.#l.text))}#a(){this.#t.innerHTML="";let e=document.createElement("sl-breadcrumb");this.#t.appendChild(e);let o=this.#o;for(let s of this.#e){let n=document.createElement("sl-breadcrumb-item");n.innerHTML=_n(o[s][0]),o=o[s][1],e.appendChild(n)}this.#i=[];for(let[s,n]of o.entries()){this.#l=this.#i;let a=n[1]===null||n[2]?.noindex?n[0]:`&${s+1}: ${n[0]}`;this.#i.push({html:vn(a),text:_n(n[0]),action:Array.isArray(n[1])?s:n[1],keys:n[2]?.key?wn(a).concat([n[2].key]):wn(a),checkbox:n[2]?Object.hasOwn(n[2],"checked"):!1,checked:n[2]?.checked})}this.#e.length>1&&this.#i.push({html:vn("&0: Back"),text:"Back",action:()=>this.#g(),keys:["0"]});let i=this.#i.map(s=>s.checkbox?`<span check-item${s.checked?" checked":""}><span class="checkbox">${s.checked?"\u{1F5F9}":"\u2610"}</span> ${s.html}</span>`:`<span>${s.html}</span>`).join("|"),r=document.createElement("sl-breadcrumb-item");r.innerHTML=i,e.appendChild(r)}#c(){this.#r&&(this.#r=!1,this.#t.hidden=!0,this.onhide?.())}#u(e){if(!e.repeat){if(this.#p(e))e.preventDefault(),this.#f();else if(this.#b(e)){let o=!1,i=e.key.toLowerCase();for(let r of this.#i)r.keys.includes(i)&&r.action!==null&&(o=!0,typeof r.action=="number"?this.#m(r.action):typeof r.action=="function"&&(r.action(),this.onoptionenter?.()));this.#a(),(o||i.length==1)&&e.preventDefault()}}}#d(e){this.#p(e)&&(e.preventDefault(),this.#c())}#h(){this.#r&&this.#c()}#p(e){return e.key.toLowerCase()==this.#s||e.code.toLowerCase().startsWith(this.#s)}#b(e){return[this.#s=="ctrl"&&e.ctrlKey,this.#s=="alt"&&e.altKey,this.#s=="shift"&&e.shiftKey].filter(o=>o).length==1}};function vn(t){return t.replace(/&(.)/g,"<u>$1</u>")}function _n(t){return t.replaceAll("&","")}function wn(t){return t.match(/(?<=&)./g)?.map(o=>o.toLowerCase())??[]}var Dc=Object.defineProperty,Ic=Object.defineProperties,Rc=Object.getOwnPropertyDescriptors,kn=Object.getOwnPropertySymbols,Bc=Object.prototype.hasOwnProperty,Oc=Object.prototype.propertyIsEnumerable,Cn=t=>{throw TypeError(t)},xn=(t,e,o)=>e in t?Dc(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,Ae=(t,e)=>{for(var o in e||(e={}))Bc.call(e,o)&&xn(t,o,e[o]);if(kn)for(var o of kn(e))Oc.call(e,o)&&xn(t,o,e[o]);return t},Ke=(t,e)=>Ic(t,Rc(e)),Jr=(t,e,o)=>e.has(t)||Cn("Cannot "+o),E=(t,e,o)=>(Jr(t,e,"read from private field"),o?o.call(t):e.get(t)),Lt=(t,e,o)=>e.has(t)?Cn("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),xt=(t,e,o,i)=>(Jr(t,e,"write to private field"),i?i.call(t,o):e.set(t,o),o),lo=(t,e,o)=>(Jr(t,e,"access private method"),o),Xt=(t,e,o)=>new Promise((i,r)=>{var s=l=>{try{a(o.next(l))}catch(d){r(d)}},n=l=>{try{a(o.throw(l))}catch(d){r(d)}},a=l=>l.done?i(l.value):Promise.resolve(l.value).then(s,n);a((o=o.apply(t,e)).next())});function qi(t){let e=t.filter(o=>!!o);return e.reduce((o,i)=>{let r="output"in o?o.output:o,s="input"in i?i.input:i;return r.connect(s),i}),()=>{e.reduce((o,i)=>{let r="output"in o?o.output:o,s="input"in i?i.input:i;return r.disconnect(s),i})}}function En(t){let e=t,o=new Set;function i(n){return o.add(n),n(e),()=>{o.delete(n)}}function r(n){e=n,o.forEach(a=>a(e))}function s(){return e}return{subscribe:i,set:r,get:s}}function Fc(){let t=new Set;function e(i){return t.add(i),()=>{t.delete(i)}}function o(i){t.forEach(r=>r(i))}return{subscribe:e,trigger:o}}function zc(t){let e=!1;return()=>{e||(e=!0,t.forEach(o=>o?.()))}}function ts(t){return t*t/16129}function Nc(t){return Math.pow(10,t/20)}var ro,qe,Ro,Bo,Ki,so,no,Pn=class{constructor(t,e){this.context=t,Lt(this,ro),Lt(this,qe),Lt(this,Ro),Lt(this,Bo),Lt(this,Ki),Lt(this,so),Lt(this,no,!1);var o,i,r;xt(this,so,{destination:(o=e?.destination)!=null?o:t.destination,volume:(i=e?.volume)!=null?i:100,volumeToGain:(r=e?.volumeToGain)!=null?r:ts}),this.input=t.createGain(),xt(this,ro,t.createGain()),xt(this,Bo,qi([this.input,E(this,ro),E(this,so).destination]));let s=En(E(this,so).volume);this.setVolume=s.set,xt(this,Ki,s.subscribe(n=>{E(this,ro).gain.value=E(this,so).volumeToGain(n)}))}addInsert(t){var e;if(E(this,no))throw Error("Can't add insert to disconnected channel");(e=E(this,Ro))!=null||xt(this,Ro,[]),E(this,Ro).push(t),E(this,Bo).call(this),xt(this,Bo,qi([this.input,...E(this,Ro),E(this,ro),E(this,so).destination]))}addEffect(t,e,o){var i;if(E(this,no))throw Error("Can't add effect to disconnected channel");let r=this.context.createGain();r.gain.value=o;let s="input"in e?e.input:e,n=qi([E(this,ro),r,s]);(i=E(this,qe))!=null||xt(this,qe,[]),E(this,qe).push({name:t,mix:r,disconnect:n})}sendEffect(t,e){var o;if(E(this,no))throw Error("Can't send effect to disconnected channel");let i=(o=E(this,qe))==null?void 0:o.find(r=>r.name===t);i&&(i.mix.gain.value=e)}disconnect(){var t;E(this,no)||(xt(this,no,!0),E(this,Bo).call(this),E(this,Ki).call(this),(t=E(this,qe))==null||t.forEach(e=>e.disconnect()),xt(this,qe,void 0))}};ro=new WeakMap;qe=new WeakMap;Ro=new WeakMap;Bo=new WeakMap;Ki=new WeakMap;so=new WeakMap;no=new WeakMap;var ce,Hc=class{constructor(t){this.compare=t,Lt(this,ce,[])}push(t){let e=E(this,ce).length,o=0,i=e-1,r=e;for(;o<=i;){let s=Math.floor((o+i)/2);this.compare(t,E(this,ce)[s])<0?(r=s,i=s-1):o=s+1}E(this,ce).splice(r,0,t)}pop(){return E(this,ce).shift()}peek(){return E(this,ce)[0]}removeAll(t){let e=E(this,ce).length;return xt(this,ce,E(this,ce).filter(o=>!t(o))),E(this,ce).length!==e}clear(){xt(this,ce,[])}size(){return E(this,ce).length}};ce=new WeakMap;function Sn(t,e){return t&&e?o=>{t(o),e(o)}:t??e}function Vc(t){var e,o,i;let r={disableScheduler:(e=t.disableScheduler)!=null?e:!1,scheduleLookaheadMs:(o=t.scheduleLookaheadMs)!=null?o:200,scheduleIntervalMs:(i=t.scheduleIntervalMs)!=null?i:50,onStart:t.onStart,onEnded:t.onEnded};if(r.scheduleLookaheadMs<1)throw Error("scheduleLookaheadMs must be greater than 0");if(r.scheduleIntervalMs<1)throw Error("scheduleIntervalMs must be greater than 0");if(r.scheduleLookaheadMs<r.scheduleIntervalMs)throw Error("scheduleLookaheadMs must be greater than scheduleIntervalMs");return r}var Oe,be,ao,$n=class{constructor(t,e={}){Lt(this,Oe),Lt(this,be),Lt(this,ao),xt(this,Oe,Vc(e)),xt(this,be,new Hc((o,i)=>o.time-i.time)),this.player=t}get context(){return this.player.context}get buffers(){return this.player.buffers}get isRunning(){return E(this,ao)!==void 0}start(t){var e;if(E(this,Oe).disableScheduler)return this.player.start(t);let o=this.player.context,i=o.currentTime,r=(e=t.time)!=null?e:i,s=E(this,Oe).scheduleLookaheadMs/1e3;return t.onStart=Sn(t.onStart,E(this,Oe).onStart),t.onEnded=Sn(t.onEnded,E(this,Oe).onEnded),r<i+s?this.player.start(t):(E(this,be).push(Ke(Ae({},t),{time:r})),E(this,ao)||xt(this,ao,setInterval(()=>{let n=o.currentTime+s;for(;E(this,be).size()&&E(this,be).peek().time<=n;){let a=E(this,be).pop();a&&this.player.start(a)}E(this,be).size()||(clearInterval(E(this,ao)),xt(this,ao,void 0))},E(this,Oe).scheduleIntervalMs)),n=>{!n||n<r?E(this,be).removeAll(a=>a===t)||this.player.stop(Ke(Ae({},t),{time:n})):this.player.stop(Ke(Ae({},t),{time:n}))})}stop(t){var e;if(E(this,Oe).disableScheduler)return this.player.stop(t);if(this.player.stop(t),!t){E(this,be).clear();return}let o=(e=t?.time)!=null?e:0,i=t?.stopId;i?E(this,be).removeAll(r=>r.time>=o&&r.stopId?r.stopId===i:r.note===i):E(this,be).removeAll(r=>r.time>=o)}disconnect(){this.player.disconnect()}};Oe=new WeakMap;be=new WeakMap;ao=new WeakMap;var ni,Oo,ai,Mn=class{constructor(t,e){this.context=t,this.options=e,Lt(this,ni),Lt(this,Oo,!1),Lt(this,ai);var o,i;xt(this,ni,{velocityToGain:(o=e.velocityToGain)!=null?o:ts,destination:(i=e.destination)!=null?i:t.destination}),this.buffers={},xt(this,ai,Fc())}start(t){var e,o,i,r,s,n,a,l,d,f,h,b,g,_;if(E(this,Oo))throw new Error("Can't start a sample on disconnected player");let A=this.context,$=t.name&&this.buffers[t.name]||this.buffers[t.note];if(!$)return()=>{};let S=A.createBufferSource();S.buffer=$;let I=(o=(e=t.detune)!=null?e:this.options.detune)!=null?o:0;S.detune?S.detune.value=I:S.playbackRate&&(S.playbackRate.value=Math.pow(2,I/1200));let R=(i=t.lpfCutoffHz)!=null?i:this.options.lpfCutoffHz,j=R?A.createBiquadFilter():void 0;R&&j&&(j.type="lowpass",j.frequency.value=R);let G=A.createGain(),lt=(s=(r=t.velocity)!=null?r:this.options.velocity)!=null?s:100;G.gain.value=E(this,ni).velocityToGain(lt),((n=t.loop)!=null?n:this.options.loop)&&(S.loop=!0,S.loopStart=(a=t.loopStart)!=null?a:0,S.loopEnd=(l=t.loopEnd)!=null?l:$.duration);let vt=(d=t.decayTime)!=null?d:this.options.decayTime,[q,dt]=Uc(A,vt);function y(X){if(X??(X=A.currentTime),X<=Rt)S.stop(X);else{let Bt=dt(X);S.stop(Bt)}}let bt=t.gainOffset?A.createGain():void 0;bt&&t.gainOffset&&(bt.gain.value=t.gainOffset);let $t=(f=t.stopId)!=null?f:t.note,st=zc([qi([S,j,G,q,bt,E(this,ni).destination]),(h=t.stop)==null?void 0:h.call(t,y),E(this,ai).subscribe(X=>{(!X||X.stopId===void 0||X.stopId===$t)&&y(X?.time)})]);S.onended=()=>{var X;st(),(X=t.onEnded)==null||X.call(t,t)},(b=t.onStart)==null||b.call(t,t);let Rt=Math.max((g=t.time)!=null?g:0,A.currentTime);S.start(t.time);let Tt=(_=t.duration)!=null?_:$.duration;return typeof t.duration=="number"&&y(Rt+Tt),y}stop(t){E(this,ai).trigger(t)}disconnect(){E(this,Oo)||(xt(this,Oo,!0),this.stop(),Object.keys(this.buffers).forEach(t=>{delete this.buffers[t]}))}get connected(){return!E(this,Oo)}};ni=new WeakMap;Oo=new WeakMap;ai=new WeakMap;function Uc(t,e=.2){let o=0,i=t.createGain();i.gain.value=1;function r(s){if(o)return o;i.gain.cancelScheduledValues(s);let n=s||t.currentTime;return o=n+e,i.gain.setValueAtTime(1,n),i.gain.linearRampToValueAtTime(0,o),o}return[i,r]}var Ln=class{constructor(t,e){this.context=t;let o=new Pn(t,e);this.player=new $n(new Mn(t,Ke(Ae({},e),{destination:o.input})),e),this.output=o}get buffers(){return this.player.buffers}start(t){return this.player.start(t)}stop(t){this.player.stop(typeof t=="object"?t:t!==void 0?{stopId:t}:void 0)}disconnect(){this.output.disconnect(),this.player.disconnect()}};function es(t,e,o){return Xt(this,null,function*(){e=e.replace(/#/g,"%23").replace(/([^:]\/)\/+/g,"$1");let i=yield o.fetch(e);if(i.status===200)try{let r=yield i.arrayBuffer();return yield t.decodeAudioData(r)}catch{}})}function os(t){if(typeof document>"u")return null;let e=document.createElement("audio");for(let o=0;o<t.length;o++){let i=t[o],r=e.canPlayType(`audio/${i}`);if(r==="probably"||r==="maybe")return i;if(i==="m4a"){let s=e.canPlayType("audio/aac");if(s==="probably"||s==="maybe")return i}}return null}function Gc(){var t;return"."+((t=os(["ogg","m4a"]))!=null?t:"ogg")}var is={fetch(t){return fetch(t)}},zo,Wi,Tn,Dn,In=class{constructor(t="smplr"){Lt(this,Wi),Lt(this,zo),typeof window>"u"||!("caches"in window)?xt(this,zo,Promise.reject("CacheStorage not supported")):xt(this,zo,caches.open(t))}fetch(t){return Xt(this,null,function*(){let e=new Request(t);try{return yield lo(this,Wi,Tn).call(this,e)}catch{let i=yield fetch(e);return yield lo(this,Wi,Dn).call(this,e,i),i}})}};zo=new WeakMap;Wi=new WeakSet;Tn=function(t){return Xt(this,null,function*(){let o=yield(yield E(this,zo)).match(t);if(o)return o;throw Error("Not found")})};Dn=function(t,e){return Xt(this,null,function*(){try{yield(yield E(this,zo)).put(t,e.clone())}catch{}})};var qc;qc=new WeakMap;function Kc(t){let o=/^([a-gA-G]?)(#{1,}|b{1,}|)(-?\d+)$/.exec(t);if(!o)return;let i=o[1].toUpperCase();if(!i)return;let r=o[2],s=r[0]==="b"?-r.length:r.length,n=o[3]?+o[3]:4,a=(i.charCodeAt(0)+3)%7;return[0,2,4,5,7,9,11][a]+s+12*(n+1)}function No(t){return t===void 0?void 0:typeof t=="number"?t:Kc(t)}function Wc(t,e,o,i){return Xt(this,null,function*(){o.groups.forEach(r=>{let s=Yc(o,r);return Xc(t,e,s,i)})})}function jc(t,e){return Xt(this,null,function*(){var o;let i=s=>"global"in s,r=s=>"websfzUrl"in s;if(typeof t=="string")return An(t,e);if(i(t))return t;if(r(t)){let s=yield An(t.websfzUrl,e);return(o=s.meta)!=null||(s.meta={}),t.name&&(s.meta.name=t.name),t.baseUrl&&(s.meta.baseUrl=t.baseUrl),t.formats&&(s.meta.formats=t.formats),s}else throw new Error("Invalid instrument: "+JSON.stringify(t))})}function Xc(t,e,o,i){return Xt(this,null,function*(){yield Promise.all(Object.keys(o).map(r=>Xt(this,null,function*(){if(e[r])return;let s=yield es(t,o[r],i);return s&&(e[r]=s),e})))})}function An(t,e){return Xt(this,null,function*(){try{return yield(yield fetch(t)).json()}catch{throw new Error(`Can't load SFZ file ${t}`)}})}function Yc(t,e){var o,i,r,s;let n={},a=(o=t.meta.baseUrl)!=null?o:"",l=(r=os((i=t.meta.formats)!=null?i:[]))!=null?r:"ogg",d=(s=t.global.default_path)!=null?s:"";return e?e.regions.reduce((f,h)=>(h.sample&&(f[h.sample]=`${a}/${d}${h.sample}.${l}`),f),n):n}function Io(t,e,o){let i=e===void 0||t!==void 0&&t>=e,r=o===void 0||t!==void 0&&t<=o;return i&&r}function Zc(t,e){let o=[];for(let i of t.groups)if(Io(e.midi,i.lokey,i.hikey)&&Io(e.velocity,i.lovel,i.hivel)&&Io(e.cc64,i.locc64,i.hicc64))for(let r of i.regions)Io(e.midi,r.lokey,r.hikey)&&Io(e.velocity,r.lovel,r.hivel)&&Io(e.cc64,i.locc64,i.hicc64)&&o.push([i,r]);return o}var Qc=Object.freeze({meta:{},global:{},groups:[]}),Fo,Zr,Rn,Jc=class{constructor(t,e){this.context=t,Lt(this,Zr),Lt(this,Fo),this.options=Object.freeze(Object.assign({volume:100,velocity:100,storage:is,detune:0,destination:t.destination},e)),this.player=new Ln(t,e),xt(this,Fo,Qc),this.load=jc(e.instrument,this.options.storage).then(o=>(xt(this,Fo,Object.freeze(o)),Wc(t,this.player.buffers,E(this,Fo),this.options.storage))).then(()=>this)}get output(){return this.player.output}loaded(){return Xt(this,null,function*(){return this.load})}start(t){lo(this,Zr,Rn).call(this,typeof t=="object"?t:{note:t})}stop(t){this.player.stop(t)}disconnect(){this.player.disconnect()}};Fo=new WeakMap;Zr=new WeakSet;Rn=function(t){var e;let o=No(t.note);if(o===void 0)return()=>{};let i=(e=t.velocity)!=null?e:this.options.velocity,r=Zc(E(this,Fo),{midi:o,velocity:i}),s=()=>{var a;(a=t.onEnded)==null||a.call(t,t)},n=r.map(([a,l])=>{var d,f,h;let b=(f=(d=l.pitch_keycenter)!=null?d:l.key)!=null?f:o,g=(o-b)*100;return this.player.start(Ke(Ae({},t),{note:l.sample,decayTime:t.decayTime,detune:g+((h=t.detune)!=null?h:this.options.detune),onEnded:s,stopId:o}))});switch(n.length){case 0:return()=>{};case 1:return n[0];default:return a=>n.forEach(l=>l(a))}};function tu(t,e){let o=t.createGain(),i=t.createGain();o.channelCount=2,o.channelCountMode="explicit";let r=t.createChannelSplitter(2),s=t.createGain(),n=t.createGain(),a=t.createChannelMerger(2),l=t.createOscillator();l.type="sine",l.frequency.value=1,l.start();let d=t.createGain(),f=t.createOscillator();f.type="sine",f.frequency.value=1.1,f.start();let h=t.createGain();o.connect(r),r.connect(s,0),r.connect(n,1),s.connect(a,0,0),n.connect(a,0,1),l.connect(d),d.connect(s.gain),f.connect(h),h.connect(n.gain),a.connect(i);let b=e(g=>{d.gain.value=g,h.gain.value=g});return o.disconnect=()=>{b(),l.stop(),f.stop(),o.disconnect(r),r.disconnect(s,0),r.disconnect(n,1),s.disconnect(a,0,0),n.disconnect(a,0,1),l.disconnect(s),f.disconnect(n),a.disconnect(i)},{input:o,output:i}}var eu={CP80:"https://danigb.github.io/samples/gs-e-pianos/CP80/cp80.websfz.json",PianetT:"https://danigb.github.io/samples/gs-e-pianos/Pianet T/pianet-t.websfz.json",WurlitzerEP200:"https://danigb.github.io/samples/gs-e-pianos/Wurlitzer EP200/wurlitzer-ep200.websfz.json",TX81Z:"https://danigb.github.io/samples/vcsl/TX81Z/tx81z-fm-piano.websfz.json"},Yi=class extends Jc{constructor(t,e){var o;super(t,Ke(Ae({},e),{instrument:(o=eu[e.instrument])!=null?o:e.instrument}));let i=En(0);this.tremolo={level:s=>i.set(ts(s))};let r=tu(t,i.subscribe);this.output.addInsert(r)}};function ou(t={}){return{groups:[],options:t}}function iu(){return{regions:[]}}function ru(t,e,o,i){let r=[],s=No(e.note);if(s===void 0)return r;for(let n of t.regions){let a=su(s,o??0,e,n,i);a&&r.push(a)}return r}function su(t,e,o,i,r){var s,n,a,l,d,f,h,b,g,_,A,$,S,I,R,j,G,lt,rt,vt,q,dt,y,bt,$t,st,Rt,Tt;if(!(t>=((s=i.midiLow)!=null?s:0)&&t<((n=i.midiHigh)!=null?n:127)+1)||!(o.velocity===void 0||o.velocity>=((a=i.velLow)!=null?a:0)&&o.velocity<=((l=i.velHigh)!=null?l:127)))return;if(i.seqLength){let Pt=e%i.seqLength,Gt=((d=i.seqPosition)!=null?d:1)-1;if(Pt!==Gt)return}let Ut=t-i.midiPitch,me=(f=o.velocity)!=null?f:r?.velocity,tt=i.volume?Nc(i.volume):0,Mt=(b=(h=o.gainOffset)!=null?h:r?.gainOffset)!=null?b:0,ht=(g=o.detune)!=null?g:0;return{decayTime:($=(A=o?.decayTime)!=null?A:(_=i.sample)==null?void 0:_.decayTime)!=null?$:r?.decayTime,detune:100*(Ut+((S=i.tune)!=null?S:0))+ht,duration:(j=(R=o?.duration)!=null?R:(I=i.sample)==null?void 0:I.duration)!=null?j:r?.duration,gainOffset:Mt+tt||void 0,loop:(rt=(lt=o?.loop)!=null?lt:(G=i.sample)==null?void 0:G.loop)!=null?rt:r?.loop,loopEnd:(dt=(q=o?.loopEnd)!=null?q:(vt=i.sample)==null?void 0:vt.loopEnd)!=null?dt:r?.loopEnd,loopStart:($t=(bt=o?.loopStart)!=null?bt:(y=i.sample)==null?void 0:y.loopStart)!=null?$t:r?.loopStart,lpfCutoffHz:(Tt=(Rt=o?.lpfCutoffHz)!=null?Rt:(st=i.sample)==null?void 0:st.lpfCutoffHz)!=null?Tt:r?.lpfCutoffHz,name:i.sampleName,note:t,onEnded:o.onEnded,onStart:o.onStart,stopId:o.name,time:o.time,velocity:me??void 0}}var nu=class{constructor(t,e){this.context=t,this.seqNum=0;let o=new Pn(t,e);this.instrument=ou(e),this.player=new $n(new Mn(t,Ke(Ae({},e),{destination:o.input})),e),this.output=o}get buffers(){return this.player.buffers}start(t){let e=[],o=typeof t=="object"?t:{note:t};for(let i of this.instrument.groups){let r=ru(i,o,this.seqNum);this.seqNum++;for(let s of r){let n=this.player.start(s);e.push(n)}}return i=>e.forEach(r=>r(i))}stop(t){if(t==null){this.player.stop();return}let e=typeof t=="object"?t:{stopId:t},o=No(e.stopId);o&&(e.stopId=o,this.player.stop(e))}disconnect(){this.output.disconnect(),this.player.disconnect()}};function au(t,e){let o=Gc();return(i,r)=>Xt(this,null,function*(){let s=yield fetch(t).then(l=>l.text());lu(s,e.group).length;let a=new Set;return e.group.regions.forEach(l=>a.add(l.sampleName)),Promise.all(Array.from(a).map(l=>Xt(this,null,function*(){let d=e.urlFromSampleName(l,o),f=yield es(i,d,r);e.buffers[l]=f}))).then(()=>e.group)})}function lu(t,e){let o="global",i=t.split(`
`).map(pu).filter(a=>!!a),r=new fu,s=[];for(let a of i)switch(a.type){case"mode":s.push(r.closeScope(o,e)),o=a.value;break;case"prop:num":case"prop:str":case"prop:num_arr":r.push(a.key,a.value);break;case"unknown":break}return s.filter(a=>!!a);function n(a,l,d){}}var cu=/^<([^>]+)>$/,uu=/^([^=]+)=([-\.\d]+)$/,du=/^([^=]+)=(.+)$/,hu=/^([^=]+)_(\d+)=(\d+)$/;function pu(t){if(t=t.trim(),t===""||t.startsWith("//"))return;let e=t.match(cu);if(e)return{type:"mode",value:e[1]};let o=t.match(hu);if(o)return{type:"prop:num_arr",key:o[1],value:[Number(o[2]),Number(o[3])]};let i=t.match(uu);if(i)return{type:"prop:num",key:i[1],value:Number(i[2])};let r=t.match(du);return r?{type:"prop:str",key:r[1],value:r[2]}:{type:"unknown",value:t}}var li,ji,fu=class{constructor(){Lt(this,li),this.values={},this.global={},this.group={}}closeScope(t,e){if(t==="global")lo(this,li,ji).call(this,this.global);else if(t==="group")this.group=lo(this,li,ji).call(this,{});else if(t==="region"){let o=lo(this,li,ji).call(this,Ae(Ae({sampleName:"",midiPitch:-1},this.global),this.group));if(o.sampleName==="")return"Missing sample name";if(o.midiPitch===-1)if(o.midiLow!==void 0)o.midiPitch=o.midiLow;else return"Missing pitch_keycenter";o.seqLength&&o.seqPosition===void 0&&(o.seqPosition=1),o.ampRelease&&(o.sample={decayTime:o.ampRelease},delete o.ampRelease),e.regions.push(o)}}get empty(){return Object.keys(this.values).length===0}get keys(){return Object.keys(this.values)}push(t,e){this.values[t]=e}popNum(t,e,o){return typeof this.values[t]!="number"?!1:(e[o]=this.values[t],delete this.values[t],!0)}popStr(t,e,o){return typeof this.values[t]!="string"?!1:(e[o]=this.values[t],delete this.values[t],!0)}popNumArr(t,e,o){return Array.isArray(this.values[t])?(e[o]=this.values[t],delete this.values[t],!0):!1}};li=new WeakSet;ji=function(t){return this.popStr("sample",t,"sampleName"),this.popNum("pitch_keycenter",t,"midiPitch"),this.popNum("ampeg_attack",t,"ampAttack"),this.popNum("ampeg_release",t,"ampRelease"),this.popNum("bend_down",t,"bendDown"),this.popNum("bend_up",t,"bendUp"),this.popNum("group",t,"group"),this.popNum("hikey",t,"midiHigh"),this.popNum("hivel",t,"velHigh"),this.popNum("lokey",t,"midiLow"),this.popNum("offset",t,"offset"),this.popNum("lovel",t,"velLow"),this.popNum("off_by",t,"groupOffBy"),this.popNum("pitch_keytrack",t,"ignore"),this.popNum("seq_length",t,"seqLength"),this.popNum("seq_position",t,"seqPosition"),this.popNum("tune",t,"tune"),this.popNum("volume",t,"volume"),this.popNumArr("amp_velcurve",t,"ampVelCurve"),this.values={},t};var mu="https://smpldsnds.github.io/sgossner-vcsl/";function gu(t){return mu+t+".sfz"}function bu(t,e){let o=gu(t),r=`https://smpldsnds.github.io/sgossner-vcsl/${t.slice(0,t.lastIndexOf("/")+1)}`,s=iu();return au(o,{buffers:e,group:s,urlFromSampleName:(n,a)=>r+"/"+n.replace(".wav",a)})}var Bn=class{constructor(t,e={}){var o,i;this.config={instrument:(o=e.instrument)!=null?o:"Arco",storage:(i=e.storage)!=null?i:is},this.player=new nu(t,e);let r=bu(this.config.instrument,this.player.buffers);this.load=r(t,this.config.storage).then(s=>(this.player.instrument.groups.push(s),this))}get output(){return this.player.output}get buffers(){return this.player.buffers}get context(){return this.player.context}start(t){return this.player.start(t)}stop(t){return this.player.stop(t)}disconnect(){this.player.disconnect()}};var yu,vu,_u;yu=new WeakMap;vu=new WeakMap;_u=new WeakMap;var wu;wu=new WeakMap;var ku;ku=new WeakMap;var xu;xu=new WeakMap;var Su="https://danigb.github.io/samples/splendid-grand-piano",Qr,On,Fn=class{constructor(t,e){this.context=t,Lt(this,Qr),this.options=Object.assign({baseUrl:Su,storage:is,detune:0,volume:100,velocity:100,decayTime:.5},e),this.player=new Ln(t,this.options);let o=Cu(this.options.baseUrl,this.options.storage,this.options.notesToLoad);this.load=o(t,this.player.buffers).then(()=>this)}get output(){return this.player.output}get buffers(){return this.player.buffers}loaded(){return Xt(this,null,function*(){return this.load})}start(t){var e,o;let i=typeof t=="object"?Ae({},t):{note:t},r=lo(this,Qr,On).call(this,i);return r?(i.note=r[0],i.stopId=(e=i.stopId)!=null?e:r[1],i.detune=r[2]+((o=i.detune)!=null?o:this.options.detune),this.player.start(i)):()=>{}}stop(t){var e;if(typeof t=="string")return this.player.stop((e=No(t))!=null?e:t);if(typeof t=="object"){let o=No(t.stopId);return this.player.stop(o!==void 0?Ke(Ae({},t),{stopId:o}):t)}else return this.player.stop(t)}};Qr=new WeakSet;On=function(t){var e;let o=No(t.note);if(!o)return;let i=(e=t.velocity)!=null?e:this.options.velocity,r=Xi.findIndex(n=>i>=n.vel_range[0]&&i<=n.vel_range[1]),s=Xi[r];if(s)return Au(s.name,o,this.player.buffers)};function Au(t,e,o){let i=0;for(;o[t+(e+i)]===void 0&&i<128;)i>0?i=-i:i=-i+1;return i===127?[t+e,e,0]:[t+(e+i),e,-i*100]}function Cu(t,e,o){var i;let r=(i=os(["ogg","m4a"]))!=null?i:"ogg",s=o?Xi.filter(n=>n.vel_range[0]<=o.velocityRange[1]&&n.vel_range[1]>=o.velocityRange[0]):Xi;return(n,a)=>Xt(this,null,function*(){for(let l of s){let d=o?l.samples.filter(f=>o.notes.includes(f[0])):l.samples;yield Promise.all(d.map(f=>Xt(this,[f],function*([h,b]){let g=`${t}/${b}.${r}`,_=yield es(n,g,e);_&&(a[l.name+h]=_)})))}})}var Xi=[{name:"PPP",vel_range:[1,40],cutoff:1e3,samples:[[23,"PP-B-1"],[27,"PP-D#0"],[29,"PP-F0"],[31,"PP-G0"],[33,"PP-A0"],[35,"PP-B0"],[37,"PP-C#1"],[38,"PP-D1"],[40,"PP-E1"],[41,"PP-F1"],[43,"PP-G1"],[45,"PP-A1"],[47,"PP-B1"],[48,"PP-C2"],[50,"PP-D2"],[52,"PP-E2"],[53,"PP-F2"],[55,"PP-G2"],[56,"PP-G#2"],[57,"PP-A2"],[58,"PP-A#2"],[59,"PP-B2"],[60,"PP-C3"],[62,"PP-D3"],[64,"PP-E3"],[65,"PP-F3"],[67,"PP-G3"],[69,"PP-A3"],[71,"PP-B3"],[72,"PP-C4"],[74,"PP-D4"],[76,"PP-E4"],[77,"PP-F4"],[79,"PP-G4"],[80,"PP-G#4"],[81,"PP-A4"],[82,"PP-A#4"],[83,"PP-B4"],[85,"PP-C#5"],[86,"PP-D5"],[87,"PP-D#5"],[89,"PP-F5"],[90,"PP-F#5"],[91,"PP-G5"],[92,"PP-G#5"],[93,"PP-A5"],[94,"PP-A#5"],[95,"PP-B5"],[96,"PP-C6"],[97,"PP-C#6"],[98,"PP-D6"],[99,"PP-D#6"],[100,"PP-E6"],[101,"PP-F6"],[102,"PP-F#6"],[103,"PP-G6"],[104,"PP-G#6"],[105,"PP-A6"],[106,"PP-A#6"],[107,"PP-B6"],[108,"PP-C7"]]},{name:"PP",vel_range:[41,67],samples:[[23,"PP-B-1"],[27,"PP-D#0"],[29,"PP-F0"],[31,"PP-G0"],[33,"PP-A0"],[35,"PP-B0"],[37,"PP-C#1"],[38,"PP-D1"],[40,"PP-E1"],[41,"PP-F1"],[43,"PP-G1"],[45,"PP-A1"],[47,"PP-B1"],[48,"PP-C2"],[50,"PP-D2"],[52,"PP-E2"],[53,"PP-F2"],[55,"PP-G2"],[56,"PP-G#2"],[57,"PP-A2"],[58,"PP-A#2"],[59,"PP-B2"],[60,"PP-C3"],[62,"PP-D3"],[64,"PP-E3"],[65,"PP-F3"],[67,"PP-G3"],[69,"PP-A3"],[71,"PP-B3"],[72,"PP-C4"],[74,"PP-D4"],[76,"PP-E4"],[77,"PP-F4"],[79,"PP-G4"],[80,"PP-G#4"],[81,"PP-A4"],[82,"PP-A#4"],[83,"PP-B4"],[85,"PP-C#5"],[86,"PP-D5"],[87,"PP-D#5"],[89,"PP-F5"],[90,"PP-F#5"],[91,"PP-G5"],[92,"PP-G#5"],[93,"PP-A5"],[94,"PP-A#5"],[95,"PP-B5"],[96,"PP-C6"],[97,"PP-C#6"],[98,"PP-D6"],[99,"PP-D#6"],[100,"PP-E6"],[101,"PP-F6"],[102,"PP-F#6"],[103,"PP-G6"],[104,"PP-G#6"],[105,"PP-A6"],[106,"PP-A#6"],[107,"PP-B6"],[108,"PP-C7"]]},{name:"MP",vel_range:[68,84],samples:[[23,"Mp-B-1"],[27,"Mp-D#0"],[29,"Mp-F0"],[31,"Mp-G0"],[33,"Mp-A0"],[35,"Mp-B0"],[37,"Mp-C#1"],[38,"Mp-D1"],[40,"Mp-E1"],[41,"Mp-F1"],[43,"Mp-G1"],[45,"Mp-A1"],[47,"Mp-B1"],[48,"Mp-C2"],[50,"Mp-D2"],[52,"Mp-E2"],[53,"Mp-F2"],[55,"Mp-G2"],[56,"Mp-G#2"],[57,"Mp-A2"],[58,"Mp-A#2"],[59,"Mp-B2"],[60,"Mp-C3"],[62,"Mp-D3"],[64,"Mp-E3"],[65,"Mp-F3"],[67,"Mp-G3"],[69,"Mp-A3"],[71,"Mp-B3"],[72,"Mp-C4"],[74,"Mp-D4"],[76,"Mp-E4"],[77,"Mp-F4"],[79,"Mp-G4"],[80,"Mp-G#4"],[81,"Mp-A4"],[82,"Mp-A#4"],[83,"Mp-B4"],[85,"Mp-C#5"],[86,"Mp-D5"],[87,"Mp-D#5"],[88,"Mp-E5"],[89,"Mp-F5"],[90,"Mp-F#5"],[91,"Mp-G5"],[92,"Mp-G#5"],[93,"Mp-A5"],[94,"Mp-A#5"],[95,"Mp-B5"],[96,"Mp-C6"],[97,"Mp-C#6"],[98,"Mp-D6"],[99,"Mp-D#6"],[100,"PP-E6"],[101,"Mp-F6"],[102,"Mp-F#6"],[103,"Mp-G6"],[104,"Mp-G#6"],[105,"Mp-A6"],[106,"Mp-A#6"],[107,"PP-B6"],[108,"PP-C7"]]},{name:"MF",vel_range:[85,100],samples:[[23,"Mf-B-1"],[27,"Mf-D#0"],[29,"Mf-F0"],[31,"Mf-G0"],[33,"Mf-A0"],[35,"Mf-B0"],[37,"Mf-C#1"],[38,"Mf-D1"],[40,"Mf-E1"],[41,"Mf-F1"],[43,"Mf-G1"],[45,"Mf-A1"],[47,"Mf-B1"],[48,"Mf-C2"],[50,"Mf-D2"],[52,"Mf-E2"],[53,"Mf-F2"],[55,"Mf-G2"],[56,"Mf-G#2"],[57,"Mf-A2"],[58,"Mf-A#2"],[59,"Mf-B2"],[60,"Mf-C3"],[62,"Mf-D3"],[64,"Mf-E3"],[65,"Mf-F3"],[67,"Mf-G3"],[69,"Mf-A3"],[71,"Mf-B3"],[72,"Mf-C4"],[74,"Mf-D4"],[76,"Mf-E4"],[77,"Mf-F4"],[79,"Mf-G4"],[80,"Mf-G#4"],[81,"Mf-A4"],[82,"Mf-A#4"],[83,"Mf-B4"],[85,"Mf-C#5"],[86,"Mf-D5"],[87,"Mf-D#5"],[88,"Mf-E5"],[89,"Mf-F5"],[90,"Mf-F#5"],[91,"Mf-G5"],[92,"Mf-G#5"],[93,"Mf-A5"],[94,"Mf-A#5"],[95,"Mf-B5"],[96,"Mf-C6"],[97,"Mf-C#6"],[98,"Mf-D6"],[99,"Mf-D#6"],[100,"Mf-E6"],[101,"Mf-F6"],[102,"Mf-F#6"],[103,"Mf-G6"],[104,"Mf-G#6"],[105,"Mf-A6"],[106,"Mf-A#6"],[107,"Mf-B6"],[108,"PP-C7"]]},{name:"FF",vel_range:[101,127],samples:[[23,"FF-B-1"],[27,"FF-D#0"],[29,"FF-F0"],[31,"FF-G0"],[33,"FF-A0"],[35,"FF-B0"],[37,"FF-C#1"],[38,"FF-D1"],[40,"FF-E1"],[41,"FF-F1"],[43,"FF-G1"],[45,"FF-A1"],[47,"FF-B1"],[48,"FF-C2"],[50,"FF-D2"],[52,"FF-E2"],[53,"FF-F2"],[55,"FF-G2"],[56,"FF-G#2"],[57,"FF-A2"],[58,"FF-A#2"],[59,"FF-B2"],[60,"FF-C3"],[62,"FF-D3"],[64,"FF-E3"],[65,"FF-F3"],[67,"FF-G3"],[69,"FF-A3"],[71,"FF-B3"],[72,"FF-C4"],[74,"FF-D4"],[76,"FF-E4"],[77,"FF-F4"],[79,"FF-G4"],[80,"FF-G#4"],[81,"FF-A4"],[82,"FF-A#4"],[83,"FF-B4"],[85,"FF-C#5"],[86,"FF-D5"],[88,"FF-E5"],[89,"FF-F5"],[91,"FF-G5"],[93,"FF-A5"],[95,"Mf-B5"],[96,"Mf-C6"],[97,"Mf-C#6"],[98,"Mf-D6"],[99,"Mf-D#6"],[100,"Mf-E6"],[102,"Mf-F#6"],[103,"Mf-G6"],[104,"Mf-G#6"],[105,"Mf-A6"],[106,"Mf-A#6"],[107,"Mf-B6"],[108,"Mf-C7"]]}];var Zi=null,rs=class{loaded=!1;name="";default_vel=100;load(e,o=null,i=null){}unload(){}play(e,o=this.default_vel){}stop(e){}stopAll(){}},Qi=class extends rs{player=null;instruments={apiano:{loader:Fn,options:{volume:90}},epiano1:{loader:Yi,options:{instrument:"TX81Z",volume:127}},epiano2:{loader:Yi,options:{instrument:"WurlitzerEP200",volume:70}},epiano3:{loader:Yi,options:{instrument:"CP80",volume:70}},harpsi:{loader:Bn,options:{instrument:"Chordophones/Zithers/Harpsichord, Unk",volume:100}}};cache=new In("sound_v1");play(e,o=this.default_vel){this.name=="epiano1"?e+=12:this.name=="harpsi"&&(o=127),this.player?.start({note:e,velocity:o})}stop(e){this.name=="epiano1"&&(e+=12),this.player?.stop(e)}stopAll(){this.player?.stop()}unload(){this.stopAll(),this.player=null,this.name="",this.loaded=!1}load(e,o=null,i=null){if(this.stopAll(),!e)this.unload(),o("");else{if(!Object.hasOwn(this.instruments,e)){i(`Instrument ${e} not found.`);return}Zi||(Zi=new AudioContext);let r=this.instruments[e];r.storage=this.cache,this.player=new r.loader(Zi,r.options),this.loaded=!1,this.name=e,this.player.load.then(()=>{this.loaded=!0,Zi.resume(),o(e)},s=>{this.player=null,this.name="",i(s)})}}};var Ji=t=>{var e;let{activeElement:o}=document;o&&t.contains(o)&&((e=document.activeElement)==null||e.blur())};var tr=globalThis,er=tr.ShadowRoot&&(tr.ShadyCSS===void 0||tr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ss=Symbol(),zn=new WeakMap,ci=class{constructor(e,o,i){if(this._$cssResult$=!0,i!==ss)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=o}get styleSheet(){let e=this.o,o=this.t;if(er&&e===void 0){let i=o!==void 0&&o.length===1;i&&(e=zn.get(o)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&zn.set(o,e))}return e}toString(){return this.cssText}},Nn=t=>new ci(typeof t=="string"?t:t+"",void 0,ss),H=(t,...e)=>{let o=t.length===1?t[0]:e.reduce((i,r,s)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[s+1],t[0]);return new ci(o,t,ss)},ns=(t,e)=>{if(er)t.adoptedStyleSheets=e.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(let o of e){let i=document.createElement("style"),r=tr.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=o.cssText,t.appendChild(i)}},or=er?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let o="";for(let i of e.cssRules)o+=i.cssText;return Nn(o)})(t):t;var{is:Eu,defineProperty:Pu,getOwnPropertyDescriptor:$u,getOwnPropertyNames:Mu,getOwnPropertySymbols:Lu,getPrototypeOf:Tu}=Object,ir=globalThis,Hn=ir.trustedTypes,Du=Hn?Hn.emptyScript:"",Iu=ir.reactiveElementPolyfillSupport,ui=(t,e)=>t,We={toAttribute(t,e){switch(e){case Boolean:t=t?Du:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=t!==null;break;case Number:o=t===null?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch{o=null}}return o}},rr=(t,e)=>!Eu(t,e),Vn={attribute:!0,type:String,converter:We,reflect:!1,hasChanged:rr};Symbol.metadata??=Symbol("metadata"),ir.litPropertyMetadata??=new WeakMap;var Fe=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,o=Vn){if(o.state&&(o.attribute=!1),this._$Ei(),this.elementProperties.set(e,o),!o.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(e,i,o);r!==void 0&&Pu(this.prototype,e,r)}}static getPropertyDescriptor(e,o,i){let{get:r,set:s}=$u(this.prototype,e)??{get(){return this[o]},set(n){this[o]=n}};return{get(){return r?.call(this)},set(n){let a=r?.call(this);s.call(this,n),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Vn}static _$Ei(){if(this.hasOwnProperty(ui("elementProperties")))return;let e=Tu(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ui("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ui("properties"))){let o=this.properties,i=[...Mu(o),...Lu(o)];for(let r of i)this.createProperty(r,o[r])}let e=this[Symbol.metadata];if(e!==null){let o=litPropertyMetadata.get(e);if(o!==void 0)for(let[i,r]of o)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[o,i]of this.elementProperties){let r=this._$Eu(o,i);r!==void 0&&this._$Eh.set(r,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let o=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let r of i)o.unshift(or(r))}else e!==void 0&&o.push(or(e));return o}static _$Eu(e,o){let i=o.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,o=this.constructor.elementProperties;for(let i of o.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ns(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,o,i){this._$AK(e,i)}_$EC(e,o){let i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(r!==void 0&&i.reflect===!0){let s=(i.converter?.toAttribute!==void 0?i.converter:We).toAttribute(o,i.type);this._$Em=e,s==null?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(e,o){let i=this.constructor,r=i._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let s=i.getPropertyOptions(r),n=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:We;this._$Em=r,this[r]=n.fromAttribute(o,s.type),this._$Em=null}}requestUpdate(e,o,i){if(e!==void 0){if(i??=this.constructor.getPropertyOptions(e),!(i.hasChanged??rr)(this[e],o))return;this.P(e,o,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,o,i){this._$AL.has(e)||this._$AL.set(e,o),i.reflect===!0&&this._$Em!==e&&(this._$Ej??=new Set).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,s]of this._$Ep)this[r]=s;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,s]of i)s.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],s)}let e=!1,o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(o)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(o)}willUpdate(e){}_$AE(e){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&=this._$Ej.forEach(o=>this._$EC(o,this[o])),this._$EU()}updated(e){}firstUpdated(e){}};Fe.elementStyles=[],Fe.shadowRootOptions={mode:"open"},Fe[ui("elementProperties")]=new Map,Fe[ui("finalized")]=new Map,Iu?.({ReactiveElement:Fe}),(ir.reactiveElementVersions??=[]).push("2.0.4");var ls=globalThis,sr=ls.trustedTypes,Un=sr?sr.createPolicy("lit-html",{createHTML:t=>t}):void 0,cs="$lit$",ze=`lit$${Math.random().toFixed(9).slice(2)}$`,us="?"+ze,Ru=`<${us}>`,ho=document,hi=()=>ho.createComment(""),pi=t=>t===null||typeof t!="object"&&typeof t!="function",ds=Array.isArray,Xn=t=>ds(t)||typeof t?.[Symbol.iterator]=="function",as=`[ 	
\f\r]`,di=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Gn=/-->/g,qn=/>/g,co=RegExp(`>|${as}(?:([^\\s"'>=/]+)(${as}*=${as}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Kn=/'/g,Wn=/"/g,Yn=/^(?:script|style|textarea|title)$/i,hs=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),M=hs(1),Zn=hs(2),Qn=hs(3),qt=Symbol.for("lit-noChange"),_t=Symbol.for("lit-nothing"),jn=new WeakMap,uo=ho.createTreeWalker(ho,129);function Jn(t,e){if(!ds(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Un!==void 0?Un.createHTML(e):e}var ta=(t,e)=>{let o=t.length-1,i=[],r,s=e===2?"<svg>":e===3?"<math>":"",n=di;for(let a=0;a<o;a++){let l=t[a],d,f,h=-1,b=0;for(;b<l.length&&(n.lastIndex=b,f=n.exec(l),f!==null);)b=n.lastIndex,n===di?f[1]==="!--"?n=Gn:f[1]!==void 0?n=qn:f[2]!==void 0?(Yn.test(f[2])&&(r=RegExp("</"+f[2],"g")),n=co):f[3]!==void 0&&(n=co):n===co?f[0]===">"?(n=r??di,h=-1):f[1]===void 0?h=-2:(h=n.lastIndex-f[2].length,d=f[1],n=f[3]===void 0?co:f[3]==='"'?Wn:Kn):n===Wn||n===Kn?n=co:n===Gn||n===qn?n=di:(n=co,r=void 0);let g=n===co&&t[a+1].startsWith("/>")?" ":"";s+=n===di?l+Ru:h>=0?(i.push(d),l.slice(0,h)+cs+l.slice(h)+ze+g):l+ze+(h===-2?a:g)}return[Jn(t,s+(t[o]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},fi=class t{constructor({strings:e,_$litType$:o},i){let r;this.parts=[];let s=0,n=0,a=e.length-1,l=this.parts,[d,f]=ta(e,o);if(this.el=t.createElement(d,i),uo.currentNode=this.el.content,o===2||o===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=uo.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(let h of r.getAttributeNames())if(h.endsWith(cs)){let b=f[n++],g=r.getAttribute(h).split(ze),_=/([.?@])?(.*)/.exec(b);l.push({type:1,index:s,name:_[2],strings:g,ctor:_[1]==="."?ar:_[1]==="?"?lr:_[1]==="@"?cr:fo}),r.removeAttribute(h)}else h.startsWith(ze)&&(l.push({type:6,index:s}),r.removeAttribute(h));if(Yn.test(r.tagName)){let h=r.textContent.split(ze),b=h.length-1;if(b>0){r.textContent=sr?sr.emptyScript:"";for(let g=0;g<b;g++)r.append(h[g],hi()),uo.nextNode(),l.push({type:2,index:++s});r.append(h[b],hi())}}}else if(r.nodeType===8)if(r.data===us)l.push({type:2,index:s});else{let h=-1;for(;(h=r.data.indexOf(ze,h+1))!==-1;)l.push({type:7,index:s}),h+=ze.length-1}s++}}static createElement(e,o){let i=ho.createElement("template");return i.innerHTML=e,i}};function po(t,e,o=t,i){if(e===qt)return e;let r=i!==void 0?o._$Co?.[i]:o._$Cl,s=pi(e)?void 0:e._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),s===void 0?r=void 0:(r=new s(t),r._$AT(t,o,i)),i!==void 0?(o._$Co??=[])[i]=r:o._$Cl=r),r!==void 0&&(e=po(t,r._$AS(t,e.values),r,i)),e}var nr=class{constructor(e,o){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:o},parts:i}=this._$AD,r=(e?.creationScope??ho).importNode(o,!0);uo.currentNode=r;let s=uo.nextNode(),n=0,a=0,l=i[0];for(;l!==void 0;){if(n===l.index){let d;l.type===2?d=new Ho(s,s.nextSibling,this,e):l.type===1?d=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(d=new ur(s,this,e)),this._$AV.push(d),l=i[++a]}n!==l?.index&&(s=uo.nextNode(),n++)}return uo.currentNode=ho,r}p(e){let o=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,o),o+=i.strings.length-2):i._$AI(e[o])),o++}},Ho=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,o,i,r){this.type=2,this._$AH=_t,this._$AN=void 0,this._$AA=e,this._$AB=o,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,o=this._$AM;return o!==void 0&&e?.nodeType===11&&(e=o.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,o=this){e=po(this,e,o),pi(e)?e===_t||e==null||e===""?(this._$AH!==_t&&this._$AR(),this._$AH=_t):e!==this._$AH&&e!==qt&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Xn(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_t&&pi(this._$AH)?this._$AA.nextSibling.data=e:this.T(ho.createTextNode(e)),this._$AH=e}$(e){let{values:o,_$litType$:i}=e,r=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=fi.createElement(Jn(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(o);else{let s=new nr(r,this),n=s.u(this.options);s.p(o),this.T(n),this._$AH=s}}_$AC(e){let o=jn.get(e.strings);return o===void 0&&jn.set(e.strings,o=new fi(e)),o}k(e){ds(this._$AH)||(this._$AH=[],this._$AR());let o=this._$AH,i,r=0;for(let s of e)r===o.length?o.push(i=new t(this.O(hi()),this.O(hi()),this,this.options)):i=o[r],i._$AI(s),r++;r<o.length&&(this._$AR(i&&i._$AB.nextSibling,r),o.length=r)}_$AR(e=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);e&&e!==this._$AB;){let i=e.nextSibling;e.remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},fo=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,o,i,r,s){this.type=1,this._$AH=_t,this._$AN=void 0,this.element=e,this.name=o,this._$AM=r,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=_t}_$AI(e,o=this,i,r){let s=this.strings,n=!1;if(s===void 0)e=po(this,e,o,0),n=!pi(e)||e!==this._$AH&&e!==qt,n&&(this._$AH=e);else{let a=e,l,d;for(e=s[0],l=0;l<s.length-1;l++)d=po(this,a[i+l],o,l),d===qt&&(d=this._$AH[l]),n||=!pi(d)||d!==this._$AH[l],d===_t?e=_t:e!==_t&&(e+=(d??"")+s[l+1]),this._$AH[l]=d}n&&!r&&this.j(e)}j(e){e===_t?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ar=class extends fo{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_t?void 0:e}},lr=class extends fo{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_t)}},cr=class extends fo{constructor(e,o,i,r,s){super(e,o,i,r,s),this.type=5}_$AI(e,o=this){if((e=po(this,e,o,0)??_t)===qt)return;let i=this._$AH,r=e===_t&&i!==_t||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==_t&&(i===_t||r);r&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ur=class{constructor(e,o,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=o,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){po(this,e)}},ea={M:cs,P:ze,A:us,C:1,L:ta,R:nr,D:Xn,V:po,I:Ho,H:fo,N:lr,U:cr,B:ar,F:ur},Bu=ls.litHtmlPolyfillSupport;Bu?.(fi,Ho),(ls.litHtmlVersions??=[]).push("3.2.1");var oa=(t,e,o)=>{let i=o?.renderBefore??e,r=i._$litPart$;if(r===void 0){let s=o?.renderBefore??null;i._$litPart$=r=new Ho(e.insertBefore(hi(),s),s,void 0,o??{})}return r._$AI(t),r};var je=class extends Fe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=oa(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return qt}};je._$litElement$=!0,je.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:je});var Ou=globalThis.litElementPolyfillSupport;Ou?.({LitElement:je});(globalThis.litElementVersions??=[]).push("4.1.1");var ia=H`
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
`;var ps="";function mi(t){ps=t}function fs(t=""){if(!ps){let e=[...document.getElementsByTagName("script")],o=e.find(i=>i.hasAttribute("data-shoelace"));if(o)mi(o.getAttribute("data-shoelace"));else{let i=e.find(s=>/shoelace(\.min)?\.js($|\?)/.test(s.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(s.src)),r="";i&&(r=i.getAttribute("src")),mi(r.split("/").slice(0,-1).join("/"))}}return ps.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var Fu={name:"default",resolver:t=>fs(`assets/icons/${t}.svg`)},ra=Fu;var sa={caret:`
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
  `},zu={name:"system",resolver:t=>t in sa?`data:image/svg+xml,${encodeURIComponent(sa[t])}`:""},na=zu;var Nu=[ra,na],ms=[];function aa(t){ms.push(t)}function la(t){ms=ms.filter(e=>e!==t)}function gs(t){return Nu.find(e=>e.name===t)}var ca=H`
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
`;var ha=Object.defineProperty,Hu=Object.defineProperties,Vu=Object.getOwnPropertyDescriptor,Uu=Object.getOwnPropertyDescriptors,ua=Object.getOwnPropertySymbols,Gu=Object.prototype.hasOwnProperty,qu=Object.prototype.propertyIsEnumerable,bs=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),ys=t=>{throw TypeError(t)},da=(t,e,o)=>e in t?ha(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,ue=(t,e)=>{for(var o in e||(e={}))Gu.call(e,o)&&da(t,o,e[o]);if(ua)for(var o of ua(e))qu.call(e,o)&&da(t,o,e[o]);return t},Xe=(t,e)=>Hu(t,Uu(e)),u=(t,e,o,i)=>{for(var r=i>1?void 0:i?Vu(e,o):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(r=(i?n(e,o,r):n(r))||r);return i&&r&&ha(e,o,r),r},pa=(t,e,o)=>e.has(t)||ys("Cannot "+o),fa=(t,e,o)=>(pa(t,e,"read from private field"),o?o.call(t):e.get(t)),ma=(t,e,o)=>e.has(t)?ys("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),ga=(t,e,o,i)=>(pa(t,e,"write to private field"),i?i.call(t,o):e.set(t,o),o),Ku=function(t,e){this[0]=t,this[1]=e},ba=t=>{var e=t[bs("asyncIterator")],o=!1,i,r={};return e==null?(e=t[bs("iterator")](),i=s=>r[s]=n=>e[s](n)):(e=e.call(t),i=s=>r[s]=n=>{if(o){if(o=!1,s==="throw")throw n;return n}return o=!0,{done:!1,value:new Ku(new Promise(a=>{var l=e[s](n);l instanceof Object||ys("Object expected"),a(l)}),1)}}),r[bs("iterator")]=()=>r,i("next"),"throw"in e?i("throw"):r.throw=s=>{throw s},"return"in e&&i("return"),r};function nt(t,e){let o=ue({waitUntilFirstUpdate:!1},e);return(i,r)=>{let{update:s}=i,n=Array.isArray(t)?t:[t];i.update=function(a){n.forEach(l=>{let d=l;if(a.has(d)){let f=a.get(d),h=this[d];f!==h&&(!o.waitUntilFirstUpdate||this.hasUpdated)&&this[r](f,h)}}),s.call(this,a)}}}var K=H`
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
`;var Wu={attribute:!0,type:String,converter:We,reflect:!1,hasChanged:rr},ju=(t=Wu,e,o)=>{let{kind:i,metadata:r}=o,s=globalThis.litPropertyMetadata.get(r);if(s===void 0&&globalThis.litPropertyMetadata.set(r,s=new Map),s.set(o.name,t),i==="accessor"){let{name:n}=o;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,t)},init(a){return a!==void 0&&this.P(n,void 0,t),a}}}if(i==="setter"){let{name:n}=o;return function(a){let l=this[n];e.call(this,a),this.requestUpdate(n,l,t)}}throw Error("Unsupported decorator location: "+i)};function p(t){return(e,o)=>typeof o=="object"?ju(t,e,o):((i,r,s)=>{let n=r.hasOwnProperty(s);return r.constructor.createProperty(s,n?{...i,wrapped:!0}:i),n?Object.getOwnPropertyDescriptor(r,s):void 0})(t,e,o)}function St(t){return p({...t,state:!0,attribute:!1})}function ya(t){return(e,o)=>{let i=typeof e=="function"?e:e[o];Object.assign(i,t)}}var mo=(t,e,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,o),o);function V(t,e){return(o,i,r)=>{let s=n=>n.renderRoot?.querySelector(t)??null;if(e){let{get:n,set:a}=typeof i=="object"?o:r??(()=>{let l=Symbol();return{get(){return this[l]},set(d){this[l]=d}}})();return mo(o,i,{get(){let l=n.call(this);return l===void 0&&(l=s(this),(l!==null||this.hasUpdated)&&a.call(this,l)),l}})}return mo(o,i,{get(){return s(this)}})}}var dr,U=class extends je{constructor(){super(),ma(this,dr,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){let o=new CustomEvent(t,ue({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(o),o}static define(t,e=this,o={}){let i=customElements.get(t);if(!i){try{customElements.define(t,e,o)}catch{customElements.define(t,class extends e{},o)}return}let r=" (unknown version)",s=r;"version"in e&&e.version&&(r=" v"+e.version),"version"in i&&i.version&&(s=" v"+i.version)}attributeChangedCallback(t,e,o){fa(this,dr)||(this.constructor.elementProperties.forEach((i,r)=>{i.reflect&&this[r]!=null&&this.initialReflectedProperties.set(r,this[r])}),ga(this,dr,!0)),super.attributeChangedCallback(t,e,o)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,o)=>{t.has(o)&&this[o]==null&&(this[o]=e)})}};dr=new WeakMap;U.version="2.20.1";U.dependencies={};u([p()],U.prototype,"dir",2);u([p()],U.prototype,"lang",2);var{I:qp}=ea;var va=(t,e)=>e===void 0?t?._$litType$!==void 0:t?._$litType$===e;var hr=t=>t.strings===void 0;var Xu={},_a=(t,e=Xu)=>t._$AH=e;var gi=Symbol(),pr=Symbol(),vs,_s=new Map,At=class extends U{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var o;let i;if(e?.spriteSheet)return this.svg=M`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(i=await fetch(t,{mode:"cors"}),!i.ok)return i.status===410?gi:pr}catch{return pr}try{let r=document.createElement("div");r.innerHTML=await i.text();let s=r.firstElementChild;if(((o=s?.tagName)==null?void 0:o.toLowerCase())!=="svg")return gi;vs||(vs=new DOMParser);let a=vs.parseFromString(s.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):gi}catch{return gi}}connectedCallback(){super.connectedCallback(),aa(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),la(this)}getIconSource(){let t=gs(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;let{url:e,fromLibrary:o}=this.getIconSource(),i=o?gs(this.library):void 0;if(!e){this.svg=null;return}let r=_s.get(e);if(r||(r=this.resolveIcon(e,i),_s.set(e,r)),!this.initialRender)return;let s=await r;if(s===pr&&_s.delete(e),e===this.getIconSource().url){if(va(s)){if(this.svg=s,i){await this.updateComplete;let n=this.shadowRoot.querySelector("[part='svg']");typeof i.mutator=="function"&&n&&i.mutator(n)}return}switch(s){case pr:case gi:this.svg=null,this.emit("sl-error");break;default:this.svg=s.cloneNode(!0),(t=i?.mutator)==null||t.call(i,this.svg),this.emit("sl-load")}}}render(){return this.svg}};At.styles=[K,ca];u([St()],At.prototype,"svg",2);u([p({reflect:!0})],At.prototype,"name",2);u([p()],At.prototype,"src",2);u([p()],At.prototype,"label",2);u([p({reflect:!0})],At.prototype,"library",2);u([nt("label")],At.prototype,"handleLabelChange",1);u([nt(["name","src","library"])],At.prototype,"setIcon",1);var de={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ne=t=>(...e)=>({_$litDirective$:t,values:e}),Te=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,o,i){this._$Ct=e,this._$AM=o,this._$Ci=i}_$AS(e,o){return this.update(e,o)}update(e,o){return this.render(...o)}};var mt=Ne(class extends Te{constructor(t){if(super(t),t.type!==de.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(let i in e)e[i]&&!this.nt?.has(i)&&this.st.add(i);return this.render(e)}let o=t.element.classList;for(let i of this.st)i in e||(o.remove(i),this.st.delete(i));for(let i in e){let r=!!e[i];r===this.st.has(i)||this.nt?.has(i)||(r?(o.add(i),this.st.add(i)):(o.remove(i),this.st.delete(i)))}return qt}});var ka=Symbol.for(""),Yu=t=>{if(t?.r===ka)return t?._$litStatic$};var Vo=(t,...e)=>({_$litStatic$:e.reduce((o,i,r)=>o+(s=>{if(s._$litStatic$!==void 0)return s._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(i)+t[r+1],t[0]),r:ka}),wa=new Map,ws=t=>(e,...o)=>{let i=o.length,r,s,n=[],a=[],l,d=0,f=!1;for(;d<i;){for(l=e[d];d<i&&(s=o[d],(r=Yu(s))!==void 0);)l+=r+e[++d],f=!0;d!==i&&a.push(s),n.push(l),d++}if(d===i&&n.push(e[i]),f){let h=n.join("$$lit$$");(e=wa.get(h))===void 0&&(n.raw=n,wa.set(h,e=n)),o=a}return t(e,...o)},Uo=ws(M),mf=ws(Zn),gf=ws(Qn);var D=t=>t??_t;var Kt=class extends U{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}render(){let t=!!this.href,e=t?Vo`a`:Vo`button`;return Uo`
      <${e}
        part="base"
        class=${mt({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${D(t?void 0:this.disabled)}
        type=${D(t?void 0:"button")}
        href=${D(t?this.href:void 0)}
        target=${D(t?this.target:void 0)}
        download=${D(t?this.download:void 0)}
        rel=${D(t&&this.target?"noreferrer noopener":void 0)}
        role=${D(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${D(this.name)}
          library=${D(this.library)}
          src=${D(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${e}>
    `}};Kt.styles=[K,ia];Kt.dependencies={"sl-icon":At};u([V(".icon-button")],Kt.prototype,"button",2);u([St()],Kt.prototype,"hasFocus",2);u([p()],Kt.prototype,"name",2);u([p()],Kt.prototype,"library",2);u([p()],Kt.prototype,"src",2);u([p()],Kt.prototype,"href",2);u([p()],Kt.prototype,"target",2);u([p()],Kt.prototype,"download",2);u([p()],Kt.prototype,"label",2);u([p({type:Boolean,reflect:!0})],Kt.prototype,"disabled",2);var Sa=new Map,Zu=new WeakMap;function Qu(t){return t??{keyframes:[],options:{duration:0}}}function xa(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function Yt(t,e){Sa.set(t,Qu(e))}function Zt(t,e,o){let i=Zu.get(t);if(i?.[e])return xa(i[e],o.dir);let r=Sa.get(e);return r?xa(r,o.dir):{keyframes:[],options:{duration:0}}}function ye(t,e){return new Promise(o=>{function i(r){r.target===t&&(t.removeEventListener(e,i),o())}t.addEventListener(e,i)})}function Qt(t,e,o){return new Promise(i=>{if(o?.duration===1/0)throw new Error("Promise-based animations must be finite.");let r=t.animate(e,Xe(ue({},o),{duration:Ju()?0:o.duration}));r.addEventListener("cancel",i,{once:!0}),r.addEventListener("finish",i,{once:!0})})}function ks(t){return t=t.toString().toLowerCase(),t.indexOf("ms")>-1?parseFloat(t):t.indexOf("s")>-1?parseFloat(t)*1e3:parseFloat(t)}function Ju(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function te(t){return Promise.all(t.getAnimations().map(e=>new Promise(o=>{e.cancel(),requestAnimationFrame(o)})))}var De=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=o=>{let i=o.target;(this.slotNames.includes("[default]")&&!i.name||i.name&&this.slotNames.includes(i.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){let e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};function Aa(t){if(!t)return"";let e=t.assignedNodes({flatten:!0}),o="";return[...e].forEach(i=>{i.nodeType===Node.TEXT_NODE&&(o+=i.textContent)}),o}var xs=new Set,Go=new Map,go,Ss="ltr",As="en",Ca=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Ca){let t=new MutationObserver(Ea);Ss=document.documentElement.dir||"ltr",As=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function bi(...t){t.map(e=>{let o=e.$code.toLowerCase();Go.has(o)?Go.set(o,Object.assign(Object.assign({},Go.get(o)),e)):Go.set(o,e),go||(go=e)}),Ea()}function Ea(){Ca&&(Ss=document.documentElement.dir||"ltr",As=document.documentElement.lang||navigator.language),[...xs.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}var fr=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){xs.add(this.host)}hostDisconnected(){xs.delete(this.host)}dir(){return`${this.host.dir||Ss}`.toLowerCase()}lang(){return`${this.host.lang||As}`.toLowerCase()}getTranslationData(e){var o,i;let r=new Intl.Locale(e.replace(/_/g,"-")),s=r?.language.toLowerCase(),n=(i=(o=r?.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&i!==void 0?i:"",a=Go.get(`${s}-${n}`),l=Go.get(s);return{locale:r,language:s,region:n,primary:a,secondary:l}}exists(e,o){var i;let{primary:r,secondary:s}=this.getTranslationData((i=o.lang)!==null&&i!==void 0?i:this.lang());return o=Object.assign({includeFallback:!1},o),!!(r&&r[e]||s&&s[e]||o.includeFallback&&go&&go[e])}term(e,...o){let{primary:i,secondary:r}=this.getTranslationData(this.lang()),s;if(i&&i[e])s=i[e];else if(r&&r[e])s=r[e];else if(go&&go[e])s=go[e];else return String(e);return typeof s=="function"?s(...o):s}date(e,o){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),o).format(e)}number(e,o){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),o).format(e)}relativeTime(e,o,i){return new Intl.RelativeTimeFormat(this.lang(),i).format(e,o)}};var Pa={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};bi(Pa);var $a=Pa;var Ct=class extends fr{};bi($a);var Ma=H`
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
`;var he=class bo extends U{constructor(){super(...arguments),this.hasSlotController=new De(this,"icon","suffix"),this.localize=new Ct(this),this.open=!1,this.closable=!1,this.variant="primary",this.duration=1/0,this.remainingTime=this.duration}static get toastStack(){return this.currentToastStack||(this.currentToastStack=Object.assign(document.createElement("div"),{className:"sl-toast-stack"})),this.currentToastStack}firstUpdated(){this.base.hidden=!this.open}restartAutoHide(){this.handleCountdownChange(),clearTimeout(this.autoHideTimeout),clearInterval(this.remainingTimeInterval),this.open&&this.duration<1/0&&(this.autoHideTimeout=window.setTimeout(()=>this.hide(),this.duration),this.remainingTime=this.duration,this.remainingTimeInterval=window.setInterval(()=>{this.remainingTime-=100},100))}pauseAutoHide(){var e;(e=this.countdownAnimation)==null||e.pause(),clearTimeout(this.autoHideTimeout),clearInterval(this.remainingTimeInterval)}resumeAutoHide(){var e;this.duration<1/0&&(this.autoHideTimeout=window.setTimeout(()=>this.hide(),this.remainingTime),this.remainingTimeInterval=window.setInterval(()=>{this.remainingTime-=100},100),(e=this.countdownAnimation)==null||e.play())}handleCountdownChange(){if(this.open&&this.duration<1/0&&this.countdown){let{countdownElement:e}=this,o="100%",i="0";this.countdownAnimation=e.animate([{width:o},{width:i}],{duration:this.duration,easing:"linear"})}}handleCloseClick(){this.hide()}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.duration<1/0&&this.restartAutoHide(),await te(this.base),this.base.hidden=!1;let{keyframes:e,options:o}=Zt(this,"alert.show",{dir:this.localize.dir()});await Qt(this.base,e,o),this.emit("sl-after-show")}else{Ji(this),this.emit("sl-hide"),clearTimeout(this.autoHideTimeout),clearInterval(this.remainingTimeInterval),await te(this.base);let{keyframes:e,options:o}=Zt(this,"alert.hide",{dir:this.localize.dir()});await Qt(this.base,e,o),this.base.hidden=!0,this.emit("sl-after-hide")}}handleDurationChange(){this.restartAutoHide()}async show(){if(!this.open)return this.open=!0,ye(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ye(this,"sl-after-hide")}async toast(){return new Promise(e=>{this.handleCountdownChange(),bo.toastStack.parentElement===null&&document.body.append(bo.toastStack),bo.toastStack.appendChild(this),requestAnimationFrame(()=>{this.clientWidth,this.show()}),this.addEventListener("sl-after-hide",()=>{bo.toastStack.removeChild(this),e(),bo.toastStack.querySelector("sl-alert")===null&&bo.toastStack.remove()},{once:!0})})}render(){return M`
      <div
        part="base"
        class=${mt({alert:!0,"alert--open":this.open,"alert--closable":this.closable,"alert--has-countdown":!!this.countdown,"alert--has-icon":this.hasSlotController.test("icon"),"alert--primary":this.variant==="primary","alert--success":this.variant==="success","alert--neutral":this.variant==="neutral","alert--warning":this.variant==="warning","alert--danger":this.variant==="danger"})}
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

        ${this.closable?M`
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

        ${this.countdown?M`
              <div
                class=${mt({alert__countdown:!0,"alert__countdown--ltr":this.countdown==="ltr"})}
              >
                <div class="alert__countdown-elapsed"></div>
              </div>
            `:""}
      </div>
    `}};he.styles=[K,Ma];he.dependencies={"sl-icon-button":Kt};u([V('[part~="base"]')],he.prototype,"base",2);u([V(".alert__countdown-elapsed")],he.prototype,"countdownElement",2);u([p({type:Boolean,reflect:!0})],he.prototype,"open",2);u([p({type:Boolean,reflect:!0})],he.prototype,"closable",2);u([p({reflect:!0})],he.prototype,"variant",2);u([p({type:Number})],he.prototype,"duration",2);u([p({type:String,reflect:!0})],he.prototype,"countdown",2);u([St()],he.prototype,"remainingTime",2);u([nt("open",{waitUntilFirstUpdate:!0})],he.prototype,"handleOpenChange",1);u([nt("duration")],he.prototype,"handleDurationChange",1);var La=he;Yt("alert.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:"ease"}});Yt("alert.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:"ease"}});La.define("sl-alert");var Ta=H`
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
`;var qo=class extends U{constructor(){super(...arguments),this.variant="primary",this.pill=!1,this.pulse=!1}render(){return M`
      <span
        part="base"
        class=${mt({badge:!0,"badge--primary":this.variant==="primary","badge--success":this.variant==="success","badge--neutral":this.variant==="neutral","badge--warning":this.variant==="warning","badge--danger":this.variant==="danger","badge--pill":this.pill,"badge--pulse":this.pulse})}
        role="status"
      >
        <slot></slot>
      </span>
    `}};qo.styles=[K,Ta];u([p({reflect:!0})],qo.prototype,"variant",2);u([p({type:Boolean,reflect:!0})],qo.prototype,"pill",2);u([p({type:Boolean,reflect:!0})],qo.prototype,"pulse",2);qo.define("sl-badge");var Da=H`
  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
`;var yo=class extends U{constructor(){super(...arguments),this.localize=new Ct(this),this.separatorDir=this.localize.dir(),this.label=""}getSeparator(){let e=this.separatorSlot.assignedElements({flatten:!0})[0].cloneNode(!0);return[e,...e.querySelectorAll("[id]")].forEach(o=>o.removeAttribute("id")),e.setAttribute("data-default",""),e.slot="separator",e}handleSlotChange(){let t=[...this.defaultSlot.assignedElements({flatten:!0})].filter(e=>e.tagName.toLowerCase()==="sl-breadcrumb-item");t.forEach((e,o)=>{let i=e.querySelector('[slot="separator"]');i===null?e.append(this.getSeparator()):i.hasAttribute("data-default")&&i.replaceWith(this.getSeparator()),o===t.length-1?e.setAttribute("aria-current","page"):e.removeAttribute("aria-current")})}render(){return this.separatorDir!==this.localize.dir()&&(this.separatorDir=this.localize.dir(),this.updateComplete.then(()=>this.handleSlotChange())),M`
      <nav part="base" class="breadcrumb" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </nav>

      <span hidden aria-hidden="true">
        <slot name="separator">
          <sl-icon name=${this.localize.dir()==="rtl"?"chevron-left":"chevron-right"} library="system"></sl-icon>
        </slot>
      </span>
    `}};yo.styles=[K,Da];yo.dependencies={"sl-icon":At};u([V("slot")],yo.prototype,"defaultSlot",2);u([V('slot[name="separator"]')],yo.prototype,"separatorSlot",2);u([p()],yo.prototype,"label",2);yo.define("sl-breadcrumb");var Ia=H`
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
`;var yi=class extends U{constructor(){super(...arguments),this.localize=new Ct(this)}render(){return M`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};yi.styles=[K,Ia];var vi=new WeakMap,_i=new WeakMap,wi=new WeakMap,Cs=new WeakSet,mr=new WeakMap,Ko=class{constructor(t,e){this.handleFormData=o=>{let i=this.options.disabled(this.host),r=this.options.name(this.host),s=this.options.value(this.host),n=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!i&&!n&&typeof r=="string"&&r.length>0&&typeof s<"u"&&(Array.isArray(s)?s.forEach(a=>{o.formData.append(r,a.toString())}):o.formData.append(r,s.toString()))},this.handleFormSubmit=o=>{var i;let r=this.options.disabled(this.host),s=this.options.reportValidity;this.form&&!this.form.noValidate&&((i=vi.get(this.form))==null||i.forEach(n=>{this.setUserInteracted(n,!0)})),this.form&&!this.form.noValidate&&!r&&!s(this.host)&&(o.preventDefault(),o.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),mr.set(this.host,[])},this.handleInteraction=o=>{let i=mr.get(this.host);i.includes(o.type)||i.push(o.type),i.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let i of o)if(typeof i.checkValidity=="function"&&!i.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){let o=this.form.querySelectorAll("*");for(let i of o)if(typeof i.reportValidity=="function"&&!i.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=ue({form:o=>{let i=o.form;if(i){let s=o.getRootNode().querySelector(`#${i}`);if(s)return s}return o.closest("form")},name:o=>o.name,value:o=>o.value,defaultValue:o=>o.defaultValue,disabled:o=>{var i;return(i=o.disabled)!=null?i:!1},reportValidity:o=>typeof o.reportValidity=="function"?o.reportValidity():!0,checkValidity:o=>typeof o.checkValidity=="function"?o.checkValidity():!0,setValue:(o,i)=>o.value=i,assumeInteractionOn:["sl-input"]},e)}hostConnected(){let t=this.options.form(this.host);t&&this.attachForm(t),mr.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),mr.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){let t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,vi.has(this.form)?vi.get(this.form).add(this.host):vi.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),_i.has(this.form)||(_i.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),wi.has(this.form)||(wi.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;let t=vi.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),_i.has(this.form)&&(this.form.reportValidity=_i.get(this.form),_i.delete(this.form)),wi.has(this.form)&&(this.form.checkValidity=wi.get(this.form),wi.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?Cs.add(t):Cs.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){let o=document.createElement("button");o.type=t,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",e&&(o.name=e.name,o.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(i=>{e.hasAttribute(i)&&o.setAttribute(i,e.getAttribute(i))})),this.form.append(o),o.click(),o.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){let e=this.host,o=!!Cs.has(e),i=!!e.required;e.toggleAttribute("data-required",i),e.toggleAttribute("data-optional",!i),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&o),e.toggleAttribute("data-user-valid",t&&o)}updateValidity(){let t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){let e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t?.preventDefault()}},gr=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1}),jg=Object.freeze(Xe(ue({},gr),{valid:!1,valueMissing:!0})),Xg=Object.freeze(Xe(ue({},gr),{valid:!1,customError:!0}));var Ra=H`
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
`;var et=class extends U{constructor(){super(...arguments),this.formControlController=new Ko(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new De(this,"[default]","prefix","suffix"),this.localize=new Ct(this),this.hasFocus=!1,this.invalid=!1,this.title="",this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get validity(){return this.isButton()?this.button.validity:gr}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(){this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(t){this.isButton()&&(this.button.setCustomValidity(t),this.formControlController.updateValidity())}render(){let t=this.isLink(),e=t?Vo`a`:Vo`button`;return Uo`
      <${e}
        part="base"
        class=${mt({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${D(t?void 0:this.disabled)}
        type=${D(t?void 0:this.type)}
        title=${this.title}
        name=${D(t?void 0:this.name)}
        value=${D(t?void 0:this.value)}
        href=${D(t&&!this.disabled?this.href:void 0)}
        target=${D(t?this.target:void 0)}
        download=${D(t?this.download:void 0)}
        rel=${D(t?this.rel:void 0)}
        role=${D(t?void 0:"button")}
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
    `}};et.styles=[K,Ra];et.dependencies={"sl-icon":At,"sl-spinner":yi};u([V(".button")],et.prototype,"button",2);u([St()],et.prototype,"hasFocus",2);u([St()],et.prototype,"invalid",2);u([p()],et.prototype,"title",2);u([p({reflect:!0})],et.prototype,"variant",2);u([p({reflect:!0})],et.prototype,"size",2);u([p({type:Boolean,reflect:!0})],et.prototype,"caret",2);u([p({type:Boolean,reflect:!0})],et.prototype,"disabled",2);u([p({type:Boolean,reflect:!0})],et.prototype,"loading",2);u([p({type:Boolean,reflect:!0})],et.prototype,"outline",2);u([p({type:Boolean,reflect:!0})],et.prototype,"pill",2);u([p({type:Boolean,reflect:!0})],et.prototype,"circle",2);u([p()],et.prototype,"type",2);u([p()],et.prototype,"name",2);u([p()],et.prototype,"value",2);u([p()],et.prototype,"href",2);u([p()],et.prototype,"target",2);u([p()],et.prototype,"rel",2);u([p()],et.prototype,"download",2);u([p()],et.prototype,"form",2);u([p({attribute:"formaction"})],et.prototype,"formAction",2);u([p({attribute:"formenctype"})],et.prototype,"formEnctype",2);u([p({attribute:"formmethod"})],et.prototype,"formMethod",2);u([p({attribute:"formnovalidate",type:Boolean})],et.prototype,"formNoValidate",2);u([p({attribute:"formtarget"})],et.prototype,"formTarget",2);u([nt("disabled",{waitUntilFirstUpdate:!0})],et.prototype,"handleDisabledChange",1);et.define("sl-button");var Ba=H`
  :host {
    display: inline-block;
  }

  .button-group {
    display: flex;
    flex-wrap: nowrap;
  }
`;var Ye=class extends U{constructor(){super(...arguments),this.disableRole=!1,this.label=""}handleFocus(t){let e=ki(t.target);e?.toggleAttribute("data-sl-button-group__button--focus",!0)}handleBlur(t){let e=ki(t.target);e?.toggleAttribute("data-sl-button-group__button--focus",!1)}handleMouseOver(t){let e=ki(t.target);e?.toggleAttribute("data-sl-button-group__button--hover",!0)}handleMouseOut(t){let e=ki(t.target);e?.toggleAttribute("data-sl-button-group__button--hover",!1)}handleSlotChange(){let t=[...this.defaultSlot.assignedElements({flatten:!0})];t.forEach(e=>{let o=t.indexOf(e),i=ki(e);i&&(i.toggleAttribute("data-sl-button-group__button",!0),i.toggleAttribute("data-sl-button-group__button--first",o===0),i.toggleAttribute("data-sl-button-group__button--inner",o>0&&o<t.length-1),i.toggleAttribute("data-sl-button-group__button--last",o===t.length-1),i.toggleAttribute("data-sl-button-group__button--radio",i.tagName.toLowerCase()==="sl-radio-button"))})}render(){return M`
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
    `}};Ye.styles=[K,Ba];u([V("slot")],Ye.prototype,"defaultSlot",2);u([St()],Ye.prototype,"disableRole",2);u([p()],Ye.prototype,"label",2);function ki(t){var e;let o="sl-button, sl-radio-button";return(e=t.closest(o))!=null?e:t.querySelector(o)}Ye.define("sl-button-group");var Oa=H`
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
`;var xi=class extends U{render(){return M` <slot></slot> `}};xi.styles=[K,Oa];var Fa=H`
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
`;var br=(t="value")=>(e,o)=>{let i=e.constructor,r=i.prototype.attributeChangedCallback;i.prototype.attributeChangedCallback=function(s,n,a){var l;let d=i.getPropertyOptions(t),f=typeof d.attribute=="string"?d.attribute:t;if(s===f){let h=d.converter||We,g=(typeof h=="function"?h:(l=h?.fromAttribute)!=null?l:We.fromAttribute)(a,d.type);this[t]!==g&&(this[o]=g)}r.call(this,s,n,a)}};var za=H`
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
`;var Na=Ne(class extends Te{constructor(t){if(super(t),t.type!==de.PROPERTY&&t.type!==de.ATTRIBUTE&&t.type!==de.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!hr(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===qt||e===_t)return e;let o=t.element,i=t.name;if(t.type===de.PROPERTY){if(e===o[i])return qt}else if(t.type===de.BOOLEAN_ATTRIBUTE){if(!!e===o.hasAttribute(i))return qt}else if(t.type===de.ATTRIBUTE&&o.getAttribute(i)===e+"")return qt;return _a(t),e}});var F=class extends U{constructor(){super(...arguments),this.formControlController=new Ko(this,{assumeInteractionOn:["sl-blur","sl-input"]}),this.hasSlotController=new De(this,"help-text","label"),this.localize=new Ct(this),this.hasFocus=!1,this.title="",this.__numberInput=Object.assign(document.createElement("input"),{type:"number"}),this.__dateInput=Object.assign(document.createElement("input"),{type:"date"}),this.type="text",this.name="",this.value="",this.defaultValue="",this.size="medium",this.filled=!1,this.pill=!1,this.label="",this.helpText="",this.clearable=!1,this.disabled=!1,this.placeholder="",this.readonly=!1,this.passwordToggle=!1,this.passwordVisible=!1,this.noSpinButtons=!1,this.form="",this.required=!1,this.spellcheck=!0}get valueAsDate(){var t;return this.__dateInput.type=this.type,this.__dateInput.value=this.value,((t=this.input)==null?void 0:t.valueAsDate)||this.__dateInput.valueAsDate}set valueAsDate(t){this.__dateInput.type=this.type,this.__dateInput.valueAsDate=t,this.value=this.__dateInput.value}get valueAsNumber(){var t;return this.__numberInput.value=this.value,((t=this.input)==null?void 0:t.valueAsNumber)||this.__numberInput.valueAsNumber}set valueAsNumber(t){this.__numberInput.valueAsNumber=t,this.value=this.__numberInput.value}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.emit("sl-change")}handleClearClick(t){t.preventDefault(),this.value!==""&&(this.value="",this.emit("sl-clear"),this.emit("sl-input"),this.emit("sl-change")),this.input.focus()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.formControlController.updateValidity(),this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleKeyDown(t){let e=t.metaKey||t.ctrlKey||t.shiftKey||t.altKey;t.key==="Enter"&&!e&&setTimeout(()=>{!t.defaultPrevented&&!t.isComposing&&this.formControlController.submit()})}handlePasswordToggle(){this.passwordVisible=!this.passwordVisible}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStepChange(){this.input.step=String(this.step),this.formControlController.updateValidity()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity()}focus(t){this.input.focus(t)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(t,e,o="none"){this.input.setSelectionRange(t,e,o)}setRangeText(t,e,o,i="preserve"){let r=e??this.input.selectionStart,s=o??this.input.selectionEnd;this.input.setRangeText(t,r,s,i),this.value!==this.input.value&&(this.value=this.input.value)}showPicker(){"showPicker"in HTMLInputElement.prototype&&this.input.showPicker()}stepUp(){this.input.stepUp(),this.value!==this.input.value&&(this.value=this.input.value)}stepDown(){this.input.stepDown(),this.value!==this.input.value&&(this.value=this.input.value)}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,i=this.helpText?!0:!!e,s=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value=="number"||this.value.length>0);return M`
      <div
        part="form-control"
        class=${mt({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":o,"form-control--has-help-text":i})}
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
            class=${mt({input:!0,"input--small":this.size==="small","input--medium":this.size==="medium","input--large":this.size==="large","input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--no-spin-buttons":this.noSpinButtons})}
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
              name=${D(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${D(this.placeholder)}
              minlength=${D(this.minlength)}
              maxlength=${D(this.maxlength)}
              min=${D(this.min)}
              max=${D(this.max)}
              step=${D(this.step)}
              .value=${Na(this.value)}
              autocapitalize=${D(this.autocapitalize)}
              autocomplete=${D(this.autocomplete)}
              autocorrect=${D(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${D(this.pattern)}
              enterkeyhint=${D(this.enterkeyhint)}
              inputmode=${D(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${s?M`
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
            ${this.passwordToggle&&!this.disabled?M`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.passwordVisible?"hidePassword":"showPassword")}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.passwordVisible?M`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        `:M`
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
          aria-hidden=${i?"false":"true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};F.styles=[K,za,Fa];F.dependencies={"sl-icon":At};u([V(".input__control")],F.prototype,"input",2);u([St()],F.prototype,"hasFocus",2);u([p()],F.prototype,"title",2);u([p({reflect:!0})],F.prototype,"type",2);u([p()],F.prototype,"name",2);u([p()],F.prototype,"value",2);u([br()],F.prototype,"defaultValue",2);u([p({reflect:!0})],F.prototype,"size",2);u([p({type:Boolean,reflect:!0})],F.prototype,"filled",2);u([p({type:Boolean,reflect:!0})],F.prototype,"pill",2);u([p()],F.prototype,"label",2);u([p({attribute:"help-text"})],F.prototype,"helpText",2);u([p({type:Boolean})],F.prototype,"clearable",2);u([p({type:Boolean,reflect:!0})],F.prototype,"disabled",2);u([p()],F.prototype,"placeholder",2);u([p({type:Boolean,reflect:!0})],F.prototype,"readonly",2);u([p({attribute:"password-toggle",type:Boolean})],F.prototype,"passwordToggle",2);u([p({attribute:"password-visible",type:Boolean})],F.prototype,"passwordVisible",2);u([p({attribute:"no-spin-buttons",type:Boolean})],F.prototype,"noSpinButtons",2);u([p({reflect:!0})],F.prototype,"form",2);u([p({type:Boolean,reflect:!0})],F.prototype,"required",2);u([p()],F.prototype,"pattern",2);u([p({type:Number})],F.prototype,"minlength",2);u([p({type:Number})],F.prototype,"maxlength",2);u([p()],F.prototype,"min",2);u([p()],F.prototype,"max",2);u([p()],F.prototype,"step",2);u([p()],F.prototype,"autocapitalize",2);u([p()],F.prototype,"autocorrect",2);u([p()],F.prototype,"autocomplete",2);u([p({type:Boolean})],F.prototype,"autofocus",2);u([p()],F.prototype,"enterkeyhint",2);u([p({type:Boolean,converter:{fromAttribute:t=>!(!t||t==="false"),toAttribute:t=>t?"true":"false"}})],F.prototype,"spellcheck",2);u([p()],F.prototype,"inputmode",2);u([nt("disabled",{waitUntilFirstUpdate:!0})],F.prototype,"handleDisabledChange",1);u([nt("step",{waitUntilFirstUpdate:!0})],F.prototype,"handleStepChange",1);u([nt("value",{waitUntilFirstUpdate:!0})],F.prototype,"handleValueChange",1);function yr(t,e){function o(r){let s=t.getBoundingClientRect(),n=t.ownerDocument.defaultView,a=s.left+n.scrollX,l=s.top+n.scrollY,d=r.pageX-a,f=r.pageY-l;e?.onMove&&e.onMove(d,f)}function i(){document.removeEventListener("pointermove",o),document.removeEventListener("pointerup",i),e?.onStop&&e.onStop()}document.addEventListener("pointermove",o,{passive:!0}),document.addEventListener("pointerup",i),e?.initialEvent instanceof PointerEvent&&o(e.initialEvent)}var Ha=H`
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
`;function*vr(t=document.activeElement){t!=null&&(yield t,"shadowRoot"in t&&t.shadowRoot&&t.shadowRoot.mode!=="closed"&&(yield*ba(vr(t.shadowRoot.activeElement))))}function _r(){return[...vr()].pop()}var Va=new WeakMap;function Ua(t){let e=Va.get(t);return e||(e=window.getComputedStyle(t,null),Va.set(t,e)),e}function td(t){if(typeof t.checkVisibility=="function")return t.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});let e=Ua(t);return e.visibility!=="hidden"&&e.display!=="none"}function ed(t){let e=Ua(t),{overflowY:o,overflowX:i}=e;return o==="scroll"||i==="scroll"?!0:o!=="auto"||i!=="auto"?!1:t.scrollHeight>t.clientHeight&&o==="auto"||t.scrollWidth>t.clientWidth&&i==="auto"}function od(t){let e=t.tagName.toLowerCase(),o=Number(t.getAttribute("tabindex"));if(t.hasAttribute("tabindex")&&(isNaN(o)||o<=-1)||t.hasAttribute("disabled")||t.closest("[inert]"))return!1;if(e==="input"&&t.getAttribute("type")==="radio"){let s=t.getRootNode(),n=`input[type='radio'][name="${t.getAttribute("name")}"]`,a=s.querySelector(`${n}:checked`);return a?a===t:s.querySelector(n)===t}return td(t)?(e==="audio"||e==="video")&&t.hasAttribute("controls")||t.hasAttribute("tabindex")||t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(e)?!0:ed(t):!1}function Ga(t){var e,o;let i=wr(t),r=(e=i[0])!=null?e:null,s=(o=i[i.length-1])!=null?o:null;return{start:r,end:s}}function id(t,e){var o;return((o=t.getRootNode({composed:!0}))==null?void 0:o.host)!==e}function wr(t){let e=new WeakMap,o=[];function i(r){if(r instanceof Element){if(r.hasAttribute("inert")||r.closest("[inert]")||e.has(r))return;e.set(r,!0),!o.includes(r)&&od(r)&&o.push(r),r instanceof HTMLSlotElement&&id(r,t)&&r.assignedElements({flatten:!0}).forEach(s=>{i(s)}),r.shadowRoot!==null&&r.shadowRoot.mode==="open"&&i(r.shadowRoot)}for(let s of r.children)i(s)}return i(t),o.sort((r,s)=>{let n=Number(r.getAttribute("tabindex"))||0;return(Number(s.getAttribute("tabindex"))||0)-n})}var qa=H`
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
`;var Ie=Math.min,Jt=Math.max,Ai=Math.round,Ci=Math.floor,Ce=t=>({x:t,y:t}),rd={left:"right",right:"left",bottom:"top",top:"bottom"},sd={start:"end",end:"start"};function xr(t,e,o){return Jt(t,Ie(e,o))}function vo(t,e){return typeof t=="function"?t(e):t}function He(t){return t.split("-")[0]}function _o(t){return t.split("-")[1]}function Es(t){return t==="x"?"y":"x"}function Sr(t){return t==="y"?"height":"width"}function Ze(t){return["top","bottom"].includes(He(t))?"y":"x"}function Ar(t){return Es(Ze(t))}function Ka(t,e,o){o===void 0&&(o=!1);let i=_o(t),r=Ar(t),s=Sr(r),n=r==="x"?i===(o?"end":"start")?"right":"left":i==="start"?"bottom":"top";return e.reference[s]>e.floating[s]&&(n=Si(n)),[n,Si(n)]}function Wa(t){let e=Si(t);return[kr(t),e,kr(e)]}function kr(t){return t.replace(/start|end/g,e=>sd[e])}function nd(t,e,o){let i=["left","right"],r=["right","left"],s=["top","bottom"],n=["bottom","top"];switch(t){case"top":case"bottom":return o?e?r:i:e?i:r;case"left":case"right":return e?s:n;default:return[]}}function ja(t,e,o,i){let r=_o(t),s=nd(He(t),o==="start",i);return r&&(s=s.map(n=>n+"-"+r),e&&(s=s.concat(s.map(kr)))),s}function Si(t){return t.replace(/left|right|bottom|top/g,e=>rd[e])}function ad(t){return{top:0,right:0,bottom:0,left:0,...t}}function Ps(t){return typeof t!="number"?ad(t):{top:t,right:t,bottom:t,left:t}}function wo(t){let{x:e,y:o,width:i,height:r}=t;return{width:i,height:r,top:o,left:e,right:e+i,bottom:o+r,x:e,y:o}}function Xa(t,e,o){let{reference:i,floating:r}=t,s=Ze(e),n=Ar(e),a=Sr(n),l=He(e),d=s==="y",f=i.x+i.width/2-r.width/2,h=i.y+i.height/2-r.height/2,b=i[a]/2-r[a]/2,g;switch(l){case"top":g={x:f,y:i.y-r.height};break;case"bottom":g={x:f,y:i.y+i.height};break;case"right":g={x:i.x+i.width,y:h};break;case"left":g={x:i.x-r.width,y:h};break;default:g={x:i.x,y:i.y}}switch(_o(e)){case"start":g[n]-=b*(o&&d?-1:1);break;case"end":g[n]+=b*(o&&d?-1:1);break}return g}var Ya=async(t,e,o)=>{let{placement:i="bottom",strategy:r="absolute",middleware:s=[],platform:n}=o,a=s.filter(Boolean),l=await(n.isRTL==null?void 0:n.isRTL(e)),d=await n.getElementRects({reference:t,floating:e,strategy:r}),{x:f,y:h}=Xa(d,i,l),b=i,g={},_=0;for(let A=0;A<a.length;A++){let{name:$,fn:S}=a[A],{x:I,y:R,data:j,reset:G}=await S({x:f,y:h,initialPlacement:i,placement:b,strategy:r,middlewareData:g,rects:d,platform:n,elements:{reference:t,floating:e}});f=I??f,h=R??h,g={...g,[$]:{...g[$],...j}},G&&_<=50&&(_++,typeof G=="object"&&(G.placement&&(b=G.placement),G.rects&&(d=G.rects===!0?await n.getElementRects({reference:t,floating:e,strategy:r}):G.rects),{x:f,y:h}=Xa(d,b,l)),A=-1)}return{x:f,y:h,placement:b,strategy:r,middlewareData:g}};async function Cr(t,e){var o;e===void 0&&(e={});let{x:i,y:r,platform:s,rects:n,elements:a,strategy:l}=t,{boundary:d="clippingAncestors",rootBoundary:f="viewport",elementContext:h="floating",altBoundary:b=!1,padding:g=0}=vo(e,t),_=Ps(g),$=a[b?h==="floating"?"reference":"floating":h],S=wo(await s.getClippingRect({element:(o=await(s.isElement==null?void 0:s.isElement($)))==null||o?$:$.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(a.floating)),boundary:d,rootBoundary:f,strategy:l})),I=h==="floating"?{x:i,y:r,width:n.floating.width,height:n.floating.height}:n.reference,R=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a.floating)),j=await(s.isElement==null?void 0:s.isElement(R))?await(s.getScale==null?void 0:s.getScale(R))||{x:1,y:1}:{x:1,y:1},G=wo(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:I,offsetParent:R,strategy:l}):I);return{top:(S.top-G.top+_.top)/j.y,bottom:(G.bottom-S.bottom+_.bottom)/j.y,left:(S.left-G.left+_.left)/j.x,right:(G.right-S.right+_.right)/j.x}}var Za=t=>({name:"arrow",options:t,async fn(e){let{x:o,y:i,placement:r,rects:s,platform:n,elements:a,middlewareData:l}=e,{element:d,padding:f=0}=vo(t,e)||{};if(d==null)return{};let h=Ps(f),b={x:o,y:i},g=Ar(r),_=Sr(g),A=await n.getDimensions(d),$=g==="y",S=$?"top":"left",I=$?"bottom":"right",R=$?"clientHeight":"clientWidth",j=s.reference[_]+s.reference[g]-b[g]-s.floating[_],G=b[g]-s.reference[g],lt=await(n.getOffsetParent==null?void 0:n.getOffsetParent(d)),rt=lt?lt[R]:0;(!rt||!await(n.isElement==null?void 0:n.isElement(lt)))&&(rt=a.floating[R]||s.floating[_]);let vt=j/2-G/2,q=rt/2-A[_]/2-1,dt=Ie(h[S],q),y=Ie(h[I],q),bt=dt,$t=rt-A[_]-y,st=rt/2-A[_]/2+vt,Rt=xr(bt,st,$t),Tt=!l.arrow&&_o(r)!=null&&st!==Rt&&s.reference[_]/2-(st<bt?dt:y)-A[_]/2<0,X=Tt?st<bt?st-bt:st-$t:0;return{[g]:b[g]+X,data:{[g]:Rt,centerOffset:st-Rt-X,...Tt&&{alignmentOffset:X}},reset:Tt}}});var Qa=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var o,i;let{placement:r,middlewareData:s,rects:n,initialPlacement:a,platform:l,elements:d}=e,{mainAxis:f=!0,crossAxis:h=!0,fallbackPlacements:b,fallbackStrategy:g="bestFit",fallbackAxisSideDirection:_="none",flipAlignment:A=!0,...$}=vo(t,e);if((o=s.arrow)!=null&&o.alignmentOffset)return{};let S=He(r),I=Ze(a),R=He(a)===a,j=await(l.isRTL==null?void 0:l.isRTL(d.floating)),G=b||(R||!A?[Si(a)]:Wa(a)),lt=_!=="none";!b&&lt&&G.push(...ja(a,A,_,j));let rt=[a,...G],vt=await Cr(e,$),q=[],dt=((i=s.flip)==null?void 0:i.overflows)||[];if(f&&q.push(vt[S]),h){let st=Ka(r,n,j);q.push(vt[st[0]],vt[st[1]])}if(dt=[...dt,{placement:r,overflows:q}],!q.every(st=>st<=0)){var y,bt;let st=(((y=s.flip)==null?void 0:y.index)||0)+1,Rt=rt[st];if(Rt)return{data:{index:st,overflows:dt},reset:{placement:Rt}};let Tt=(bt=dt.filter(X=>X.overflows[0]<=0).sort((X,Bt)=>X.overflows[1]-Bt.overflows[1])[0])==null?void 0:bt.placement;if(!Tt)switch(g){case"bestFit":{var $t;let X=($t=dt.filter(Bt=>{if(lt){let Ut=Ze(Bt.placement);return Ut===I||Ut==="y"}return!0}).map(Bt=>[Bt.placement,Bt.overflows.filter(Ut=>Ut>0).reduce((Ut,me)=>Ut+me,0)]).sort((Bt,Ut)=>Bt[1]-Ut[1])[0])==null?void 0:$t[0];X&&(Tt=X);break}case"initialPlacement":Tt=a;break}if(r!==Tt)return{reset:{placement:Tt}}}return{}}}};async function ld(t,e){let{placement:o,platform:i,elements:r}=t,s=await(i.isRTL==null?void 0:i.isRTL(r.floating)),n=He(o),a=_o(o),l=Ze(o)==="y",d=["left","top"].includes(n)?-1:1,f=s&&l?-1:1,h=vo(e,t),{mainAxis:b,crossAxis:g,alignmentAxis:_}=typeof h=="number"?{mainAxis:h,crossAxis:0,alignmentAxis:null}:{mainAxis:h.mainAxis||0,crossAxis:h.crossAxis||0,alignmentAxis:h.alignmentAxis};return a&&typeof _=="number"&&(g=a==="end"?_*-1:_),l?{x:g*f,y:b*d}:{x:b*d,y:g*f}}var Ja=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var o,i;let{x:r,y:s,placement:n,middlewareData:a}=e,l=await ld(e,t);return n===((o=a.offset)==null?void 0:o.placement)&&(i=a.arrow)!=null&&i.alignmentOffset?{}:{x:r+l.x,y:s+l.y,data:{...l,placement:n}}}}},tl=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){let{x:o,y:i,placement:r}=e,{mainAxis:s=!0,crossAxis:n=!1,limiter:a={fn:$=>{let{x:S,y:I}=$;return{x:S,y:I}}},...l}=vo(t,e),d={x:o,y:i},f=await Cr(e,l),h=Ze(He(r)),b=Es(h),g=d[b],_=d[h];if(s){let $=b==="y"?"top":"left",S=b==="y"?"bottom":"right",I=g+f[$],R=g-f[S];g=xr(I,g,R)}if(n){let $=h==="y"?"top":"left",S=h==="y"?"bottom":"right",I=_+f[$],R=_-f[S];_=xr(I,_,R)}let A=a.fn({...e,[b]:g,[h]:_});return{...A,data:{x:A.x-o,y:A.y-i,enabled:{[b]:s,[h]:n}}}}}};var el=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){var o,i;let{placement:r,rects:s,platform:n,elements:a}=e,{apply:l=()=>{},...d}=vo(t,e),f=await Cr(e,d),h=He(r),b=_o(r),g=Ze(r)==="y",{width:_,height:A}=s.floating,$,S;h==="top"||h==="bottom"?($=h,S=b===(await(n.isRTL==null?void 0:n.isRTL(a.floating))?"start":"end")?"left":"right"):(S=h,$=b==="end"?"top":"bottom");let I=A-f.top-f.bottom,R=_-f.left-f.right,j=Ie(A-f[$],I),G=Ie(_-f[S],R),lt=!e.middlewareData.shift,rt=j,vt=G;if((o=e.middlewareData.shift)!=null&&o.enabled.x&&(vt=R),(i=e.middlewareData.shift)!=null&&i.enabled.y&&(rt=I),lt&&!b){let dt=Jt(f.left,0),y=Jt(f.right,0),bt=Jt(f.top,0),$t=Jt(f.bottom,0);g?vt=_-2*(dt!==0||y!==0?dt+y:Jt(f.left,f.right)):rt=A-2*(bt!==0||$t!==0?bt+$t:Jt(f.top,f.bottom))}await l({...e,availableWidth:vt,availableHeight:rt});let q=await n.getDimensions(a.floating);return _!==q.width||A!==q.height?{reset:{rects:!0}}:{}}}};function Er(){return typeof window<"u"}function ko(t){return il(t)?(t.nodeName||"").toLowerCase():"#document"}function ee(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function Ee(t){var e;return(e=(il(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function il(t){return Er()?t instanceof Node||t instanceof ee(t).Node:!1}function ve(t){return Er()?t instanceof Element||t instanceof ee(t).Element:!1}function Pe(t){return Er()?t instanceof HTMLElement||t instanceof ee(t).HTMLElement:!1}function ol(t){return!Er()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof ee(t).ShadowRoot}function jo(t){let{overflow:e,overflowX:o,overflowY:i,display:r}=_e(t);return/auto|scroll|overlay|hidden|clip/.test(e+i+o)&&!["inline","contents"].includes(r)}function rl(t){return["table","td","th"].includes(ko(t))}function Ei(t){return[":popover-open",":modal"].some(e=>{try{return t.matches(e)}catch{return!1}})}function Xo(t){let e=Pr(),o=ve(t)?_e(t):t;return["transform","translate","scale","rotate","perspective"].some(i=>o[i]?o[i]!=="none":!1)||(o.containerType?o.containerType!=="normal":!1)||!e&&(o.backdropFilter?o.backdropFilter!=="none":!1)||!e&&(o.filter?o.filter!=="none":!1)||["transform","translate","scale","rotate","perspective","filter"].some(i=>(o.willChange||"").includes(i))||["paint","layout","strict","content"].some(i=>(o.contain||"").includes(i))}function sl(t){let e=Ve(t);for(;Pe(e)&&!xo(e);){if(Xo(e))return e;if(Ei(e))return null;e=Ve(e)}return null}function Pr(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function xo(t){return["html","body","#document"].includes(ko(t))}function _e(t){return ee(t).getComputedStyle(t)}function Pi(t){return ve(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function Ve(t){if(ko(t)==="html")return t;let e=t.assignedSlot||t.parentNode||ol(t)&&t.host||Ee(t);return ol(e)?e.host:e}function nl(t){let e=Ve(t);return xo(e)?t.ownerDocument?t.ownerDocument.body:t.body:Pe(e)&&jo(e)?e:nl(e)}function Wo(t,e,o){var i;e===void 0&&(e=[]),o===void 0&&(o=!0);let r=nl(t),s=r===((i=t.ownerDocument)==null?void 0:i.body),n=ee(r);if(s){let a=$r(n);return e.concat(n,n.visualViewport||[],jo(r)?r:[],a&&o?Wo(a):[])}return e.concat(r,Wo(r,[],o))}function $r(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function cl(t){let e=_e(t),o=parseFloat(e.width)||0,i=parseFloat(e.height)||0,r=Pe(t),s=r?t.offsetWidth:o,n=r?t.offsetHeight:i,a=Ai(o)!==s||Ai(i)!==n;return a&&(o=s,i=n),{width:o,height:i,$:a}}function Ms(t){return ve(t)?t:t.contextElement}function Yo(t){let e=Ms(t);if(!Pe(e))return Ce(1);let o=e.getBoundingClientRect(),{width:i,height:r,$:s}=cl(e),n=(s?Ai(o.width):o.width)/i,a=(s?Ai(o.height):o.height)/r;return(!n||!Number.isFinite(n))&&(n=1),(!a||!Number.isFinite(a))&&(a=1),{x:n,y:a}}var cd=Ce(0);function ul(t){let e=ee(t);return!Pr()||!e.visualViewport?cd:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function ud(t,e,o){return e===void 0&&(e=!1),!o||e&&o!==ee(t)?!1:e}function So(t,e,o,i){e===void 0&&(e=!1),o===void 0&&(o=!1);let r=t.getBoundingClientRect(),s=Ms(t),n=Ce(1);e&&(i?ve(i)&&(n=Yo(i)):n=Yo(t));let a=ud(s,o,i)?ul(s):Ce(0),l=(r.left+a.x)/n.x,d=(r.top+a.y)/n.y,f=r.width/n.x,h=r.height/n.y;if(s){let b=ee(s),g=i&&ve(i)?ee(i):i,_=b,A=$r(_);for(;A&&i&&g!==_;){let $=Yo(A),S=A.getBoundingClientRect(),I=_e(A),R=S.left+(A.clientLeft+parseFloat(I.paddingLeft))*$.x,j=S.top+(A.clientTop+parseFloat(I.paddingTop))*$.y;l*=$.x,d*=$.y,f*=$.x,h*=$.y,l+=R,d+=j,_=ee(A),A=$r(_)}}return wo({width:f,height:h,x:l,y:d})}function Ls(t,e){let o=Pi(t).scrollLeft;return e?e.left+o:So(Ee(t)).left+o}function dl(t,e,o){o===void 0&&(o=!1);let i=t.getBoundingClientRect(),r=i.left+e.scrollLeft-(o?0:Ls(t,i)),s=i.top+e.scrollTop;return{x:r,y:s}}function dd(t){let{elements:e,rect:o,offsetParent:i,strategy:r}=t,s=r==="fixed",n=Ee(i),a=e?Ei(e.floating):!1;if(i===n||a&&s)return o;let l={scrollLeft:0,scrollTop:0},d=Ce(1),f=Ce(0),h=Pe(i);if((h||!h&&!s)&&((ko(i)!=="body"||jo(n))&&(l=Pi(i)),Pe(i))){let g=So(i);d=Yo(i),f.x=g.x+i.clientLeft,f.y=g.y+i.clientTop}let b=n&&!h&&!s?dl(n,l,!0):Ce(0);return{width:o.width*d.x,height:o.height*d.y,x:o.x*d.x-l.scrollLeft*d.x+f.x+b.x,y:o.y*d.y-l.scrollTop*d.y+f.y+b.y}}function hd(t){return Array.from(t.getClientRects())}function pd(t){let e=Ee(t),o=Pi(t),i=t.ownerDocument.body,r=Jt(e.scrollWidth,e.clientWidth,i.scrollWidth,i.clientWidth),s=Jt(e.scrollHeight,e.clientHeight,i.scrollHeight,i.clientHeight),n=-o.scrollLeft+Ls(t),a=-o.scrollTop;return _e(i).direction==="rtl"&&(n+=Jt(e.clientWidth,i.clientWidth)-r),{width:r,height:s,x:n,y:a}}function fd(t,e){let o=ee(t),i=Ee(t),r=o.visualViewport,s=i.clientWidth,n=i.clientHeight,a=0,l=0;if(r){s=r.width,n=r.height;let d=Pr();(!d||d&&e==="fixed")&&(a=r.offsetLeft,l=r.offsetTop)}return{width:s,height:n,x:a,y:l}}function md(t,e){let o=So(t,!0,e==="fixed"),i=o.top+t.clientTop,r=o.left+t.clientLeft,s=Pe(t)?Yo(t):Ce(1),n=t.clientWidth*s.x,a=t.clientHeight*s.y,l=r*s.x,d=i*s.y;return{width:n,height:a,x:l,y:d}}function al(t,e,o){let i;if(e==="viewport")i=fd(t,o);else if(e==="document")i=pd(Ee(t));else if(ve(e))i=md(e,o);else{let r=ul(t);i={x:e.x-r.x,y:e.y-r.y,width:e.width,height:e.height}}return wo(i)}function hl(t,e){let o=Ve(t);return o===e||!ve(o)||xo(o)?!1:_e(o).position==="fixed"||hl(o,e)}function gd(t,e){let o=e.get(t);if(o)return o;let i=Wo(t,[],!1).filter(a=>ve(a)&&ko(a)!=="body"),r=null,s=_e(t).position==="fixed",n=s?Ve(t):t;for(;ve(n)&&!xo(n);){let a=_e(n),l=Xo(n);!l&&a.position==="fixed"&&(r=null),(s?!l&&!r:!l&&a.position==="static"&&!!r&&["absolute","fixed"].includes(r.position)||jo(n)&&!l&&hl(t,n))?i=i.filter(f=>f!==n):r=a,n=Ve(n)}return e.set(t,i),i}function bd(t){let{element:e,boundary:o,rootBoundary:i,strategy:r}=t,n=[...o==="clippingAncestors"?Ei(e)?[]:gd(e,this._c):[].concat(o),i],a=n[0],l=n.reduce((d,f)=>{let h=al(e,f,r);return d.top=Jt(h.top,d.top),d.right=Ie(h.right,d.right),d.bottom=Ie(h.bottom,d.bottom),d.left=Jt(h.left,d.left),d},al(e,a,r));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}}function yd(t){let{width:e,height:o}=cl(t);return{width:e,height:o}}function vd(t,e,o){let i=Pe(e),r=Ee(e),s=o==="fixed",n=So(t,!0,s,e),a={scrollLeft:0,scrollTop:0},l=Ce(0);if(i||!i&&!s)if((ko(e)!=="body"||jo(r))&&(a=Pi(e)),i){let b=So(e,!0,s,e);l.x=b.x+e.clientLeft,l.y=b.y+e.clientTop}else r&&(l.x=Ls(r));let d=r&&!i&&!s?dl(r,a):Ce(0),f=n.left+a.scrollLeft-l.x-d.x,h=n.top+a.scrollTop-l.y-d.y;return{x:f,y:h,width:n.width,height:n.height}}function $s(t){return _e(t).position==="static"}function ll(t,e){if(!Pe(t)||_e(t).position==="fixed")return null;if(e)return e(t);let o=t.offsetParent;return Ee(t)===o&&(o=o.ownerDocument.body),o}function pl(t,e){let o=ee(t);if(Ei(t))return o;if(!Pe(t)){let r=Ve(t);for(;r&&!xo(r);){if(ve(r)&&!$s(r))return r;r=Ve(r)}return o}let i=ll(t,e);for(;i&&rl(i)&&$s(i);)i=ll(i,e);return i&&xo(i)&&$s(i)&&!Xo(i)?o:i||sl(t)||o}var _d=async function(t){let e=this.getOffsetParent||pl,o=this.getDimensions,i=await o(t.floating);return{reference:vd(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}};function wd(t){return _e(t).direction==="rtl"}var $i={convertOffsetParentRelativeRectToViewportRelativeRect:dd,getDocumentElement:Ee,getClippingRect:bd,getOffsetParent:pl,getElementRects:_d,getClientRects:hd,getDimensions:yd,getScale:Yo,isElement:ve,isRTL:wd};function fl(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function kd(t,e){let o=null,i,r=Ee(t);function s(){var a;clearTimeout(i),(a=o)==null||a.disconnect(),o=null}function n(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),s();let d=t.getBoundingClientRect(),{left:f,top:h,width:b,height:g}=d;if(a||e(),!b||!g)return;let _=Ci(h),A=Ci(r.clientWidth-(f+b)),$=Ci(r.clientHeight-(h+g)),S=Ci(f),R={rootMargin:-_+"px "+-A+"px "+-$+"px "+-S+"px",threshold:Jt(0,Ie(1,l))||1},j=!0;function G(lt){let rt=lt[0].intersectionRatio;if(rt!==l){if(!j)return n();rt?n(!1,rt):i=setTimeout(()=>{n(!1,1e-7)},1e3)}rt===1&&!fl(d,t.getBoundingClientRect())&&n(),j=!1}try{o=new IntersectionObserver(G,{...R,root:r.ownerDocument})}catch{o=new IntersectionObserver(G,R)}o.observe(t)}return n(!0),s}function ml(t,e,o,i){i===void 0&&(i={});let{ancestorScroll:r=!0,ancestorResize:s=!0,elementResize:n=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=i,d=Ms(t),f=r||s?[...d?Wo(d):[],...Wo(e)]:[];f.forEach(S=>{r&&S.addEventListener("scroll",o,{passive:!0}),s&&S.addEventListener("resize",o)});let h=d&&a?kd(d,o):null,b=-1,g=null;n&&(g=new ResizeObserver(S=>{let[I]=S;I&&I.target===d&&g&&(g.unobserve(e),cancelAnimationFrame(b),b=requestAnimationFrame(()=>{var R;(R=g)==null||R.observe(e)})),o()}),d&&!l&&g.observe(d),g.observe(e));let _,A=l?So(t):null;l&&$();function $(){let S=So(t);A&&!fl(A,S)&&o(),A=S,_=requestAnimationFrame($)}return o(),()=>{var S;f.forEach(I=>{r&&I.removeEventListener("scroll",o),s&&I.removeEventListener("resize",o)}),h?.(),(S=g)==null||S.disconnect(),g=null,l&&cancelAnimationFrame(_)}}var gl=Ja;var bl=tl,yl=Qa,Ts=el;var vl=Za;var _l=(t,e,o)=>{let i=new Map,r={platform:$i,...o},s={...r.platform,_c:i};return Ya(t,e,{...r,platform:s})};function wl(t){return xd(t)}function Ds(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function xd(t){for(let e=t;e;e=Ds(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=Ds(t);e;e=Ds(e)){if(!(e instanceof Element))continue;let o=getComputedStyle(e);if(o.display!=="contents"&&(o.position!=="static"||Xo(o)||e.tagName==="BODY"))return e}return null}function Sd(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var it=class extends U{constructor(){super(...arguments),this.localize=new Ct(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){let t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),o=this.placement.includes("top")||this.placement.includes("bottom"),i=0,r=0,s=0,n=0,a=0,l=0,d=0,f=0;o?t.top<e.top?(i=t.left,r=t.bottom,s=t.right,n=t.bottom,a=e.left,l=e.top,d=e.right,f=e.top):(i=e.left,r=e.bottom,s=e.right,n=e.bottom,a=t.left,l=t.top,d=t.right,f=t.top):t.left<e.left?(i=t.right,r=t.top,s=e.left,n=e.top,a=t.right,l=t.bottom,d=e.left,f=e.bottom):(i=e.right,r=e.top,s=t.left,n=t.top,a=e.right,l=e.bottom,d=t.left,f=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${i}px`),this.style.setProperty("--hover-bridge-top-left-y",`${r}px`),this.style.setProperty("--hover-bridge-top-right-x",`${s}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${d}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${f}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){let t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||Sd(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=ml(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;let t=[gl({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Ts({apply:({rects:o})=>{let i=this.sync==="width"||this.sync==="both",r=this.sync==="height"||this.sync==="both";this.popup.style.width=i?`${o.reference.width}px`:"",this.popup.style.height=r?`${o.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(yl({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(bl({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Ts({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:o,availableHeight:i})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${i}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${o}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(vl({element:this.arrowEl,padding:this.arrowPadding}));let e=this.strategy==="absolute"?o=>$i.getOffsetParent(o,wl):$i.getOffsetParent;_l(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:Xe(ue({},$i),{getOffsetParent:e})}).then(({x:o,y:i,middlewareData:r,placement:s})=>{let n=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[s.split("-")[0]];if(this.setAttribute("data-current-placement",s),Object.assign(this.popup.style,{left:`${o}px`,top:`${i}px`}),this.arrow){let l=r.arrow.x,d=r.arrow.y,f="",h="",b="",g="";if(this.arrowPlacement==="start"){let _=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";f=typeof d=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",h=n?_:"",g=n?"":_}else if(this.arrowPlacement==="end"){let _=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";h=n?"":_,g=n?_:"",b=typeof d=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(g=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",f=typeof d=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(g=typeof l=="number"?`${l}px`:"",f=typeof d=="number"?`${d}px`:"");Object.assign(this.arrowEl.style,{top:f,right:h,bottom:b,left:g,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return M`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${mt({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${mt({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?M`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};it.styles=[K,qa];u([V(".popup")],it.prototype,"popup",2);u([V(".popup__arrow")],it.prototype,"arrowEl",2);u([p()],it.prototype,"anchor",2);u([p({type:Boolean,reflect:!0})],it.prototype,"active",2);u([p({reflect:!0})],it.prototype,"placement",2);u([p({reflect:!0})],it.prototype,"strategy",2);u([p({type:Number})],it.prototype,"distance",2);u([p({type:Number})],it.prototype,"skidding",2);u([p({type:Boolean})],it.prototype,"arrow",2);u([p({attribute:"arrow-placement"})],it.prototype,"arrowPlacement",2);u([p({attribute:"arrow-padding",type:Number})],it.prototype,"arrowPadding",2);u([p({type:Boolean})],it.prototype,"flip",2);u([p({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],it.prototype,"flipFallbackPlacements",2);u([p({attribute:"flip-fallback-strategy"})],it.prototype,"flipFallbackStrategy",2);u([p({type:Object})],it.prototype,"flipBoundary",2);u([p({attribute:"flip-padding",type:Number})],it.prototype,"flipPadding",2);u([p({type:Boolean})],it.prototype,"shift",2);u([p({type:Object})],it.prototype,"shiftBoundary",2);u([p({attribute:"shift-padding",type:Number})],it.prototype,"shiftPadding",2);u([p({attribute:"auto-size"})],it.prototype,"autoSize",2);u([p()],it.prototype,"sync",2);u([p({type:Object})],it.prototype,"autoSizeBoundary",2);u([p({attribute:"auto-size-padding",type:Number})],it.prototype,"autoSizePadding",2);u([p({attribute:"hover-bridge",type:Boolean})],it.prototype,"hoverBridge",2);var Dt=class extends U{constructor(){super(...arguments),this.localize=new Ct(this),this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=t=>{this.open&&t.key==="Escape"&&(t.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=t=>{var e;if(t.key==="Escape"&&this.open&&!this.closeWatcher){t.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(t.key==="Tab"){if(this.open&&((e=document.activeElement)==null?void 0:e.tagName.toLowerCase())==="sl-menu-item"){t.preventDefault(),this.hide(),this.focusOnTrigger();return}let o=(i,r)=>{if(!i)return null;let s=i.closest(r);if(s)return s;let n=i.getRootNode();return n instanceof ShadowRoot?o(n.host,r):null};setTimeout(()=>{var i;let r=((i=this.containingElement)==null?void 0:i.getRootNode())instanceof ShadowRoot?_r():document.activeElement;(!this.containingElement||o(r,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=t=>{let e=t.composedPath();this.containingElement&&!e.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=t=>{let e=t.target;!this.stayOpenOnSelect&&e.tagName.toLowerCase()==="sl-menu"&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||(this.containingElement=this)}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){let t=this.trigger.assignedElements({flatten:!0})[0];typeof t?.focus=="function"&&t.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(t=>t.tagName.toLowerCase()==="sl-menu")}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(t){if([" ","Enter"].includes(t.key)){t.preventDefault(),this.handleTriggerClick();return}let e=this.getMenu();if(e){let o=e.getAllItems(),i=o[0],r=o[o.length-1];["ArrowDown","ArrowUp","Home","End"].includes(t.key)&&(t.preventDefault(),this.open||(this.show(),await this.updateComplete),o.length>0&&this.updateComplete.then(()=>{(t.key==="ArrowDown"||t.key==="Home")&&(e.setCurrentItem(i),i.focus()),(t.key==="ArrowUp"||t.key==="End")&&(e.setCurrentItem(r),r.focus())}))}}handleTriggerKeyUp(t){t.key===" "&&t.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){let e=this.trigger.assignedElements({flatten:!0}).find(i=>Ga(i).start),o;if(e){switch(e.tagName.toLowerCase()){case"sl-button":case"sl-icon-button":o=e.button;break;default:o=e}o.setAttribute("aria-haspopup","true"),o.setAttribute("aria-expanded",this.open?"true":"false")}}async show(){if(!this.open)return this.open=!0,ye(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ye(this,"sl-after-hide")}reposition(){this.popup.reposition()}addOpenListeners(){var t;this.panel.addEventListener("sl-select",this.handlePanelSelect),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){var t;this.panel&&(this.panel.removeEventListener("sl-select",this.handlePanelSelect),this.panel.removeEventListener("keydown",this.handleKeyDown)),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),(t=this.closeWatcher)==null||t.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit("sl-show"),this.addOpenListeners(),await te(this),this.panel.hidden=!1,this.popup.active=!0;let{keyframes:t,options:e}=Zt(this,"dropdown.show",{dir:this.localize.dir()});await Qt(this.popup.popup,t,e),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await te(this);let{keyframes:t,options:e}=Zt(this,"dropdown.hide",{dir:this.localize.dir()});await Qt(this.popup.popup,t,e),this.panel.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}render(){return M`
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
        sync=${D(this.sync?this.sync:void 0)}
        class=${mt({dropdown:!0,"dropdown--open":this.open})}
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
    `}};Dt.styles=[K,Ha];Dt.dependencies={"sl-popup":it};u([V(".dropdown")],Dt.prototype,"popup",2);u([V(".dropdown__trigger")],Dt.prototype,"trigger",2);u([V(".dropdown__panel")],Dt.prototype,"panel",2);u([p({type:Boolean,reflect:!0})],Dt.prototype,"open",2);u([p({reflect:!0})],Dt.prototype,"placement",2);u([p({type:Boolean,reflect:!0})],Dt.prototype,"disabled",2);u([p({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],Dt.prototype,"stayOpenOnSelect",2);u([p({attribute:!1})],Dt.prototype,"containingElement",2);u([p({type:Number})],Dt.prototype,"distance",2);u([p({type:Number})],Dt.prototype,"skidding",2);u([p({type:Boolean})],Dt.prototype,"hoist",2);u([p({reflect:!0})],Dt.prototype,"sync",2);u([nt("open",{waitUntilFirstUpdate:!0})],Dt.prototype,"handleOpenChange",1);Yt("dropdown.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}});Yt("dropdown.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}});var kl=H`
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
`;function pe(t,e,o){let i=r=>Object.is(r,-0)?0:r;return t<e?i(e):t>o?i(o):i(t)}var xl="important",Ad=" !"+xl,Ue=Ne(class extends Te{constructor(t){if(super(t),t.type!==de.ATTRIBUTE||t.name!=="style"||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,o)=>{let i=t[o];return i==null?e:e+`${o=o.includes("-")?o:o.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(t,[e]){let{style:o}=t.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(e)),this.render(e);for(let i of this.ft)e[i]==null&&(this.ft.delete(i),i.includes("-")?o.removeProperty(i):o[i]=null);for(let i in e){let r=e[i];if(r!=null){this.ft.add(i);let s=typeof r=="string"&&r.endsWith(Ad);i.includes("-")||s?o.setProperty(i,s?r.slice(0,-11):r,s?xl:""):o[i]=r}}return qt}});function It(t,e){Cd(t)&&(t="100%");let o=Ed(t);return t=e===360?t:Math.min(e,Math.max(0,parseFloat(t))),o&&(t=parseInt(String(t*e),10)/100),Math.abs(t-e)<1e-6?1:(e===360?t=(t<0?t%e+e:t%e)/parseFloat(String(e)):t=t%e/parseFloat(String(e)),t)}function Mi(t){return Math.min(1,Math.max(0,t))}function Cd(t){return typeof t=="string"&&t.indexOf(".")!==-1&&parseFloat(t)===1}function Ed(t){return typeof t=="string"&&t.indexOf("%")!==-1}function Mr(t){return t=parseFloat(t),(isNaN(t)||t<0||t>1)&&(t=1),t}function Li(t){return Number(t)<=1?`${Number(t)*100}%`:t}function Qe(t){return t.length===1?"0"+t:String(t)}function Sl(t,e,o){return{r:It(t,255)*255,g:It(e,255)*255,b:It(o,255)*255}}function Rs(t,e,o){t=It(t,255),e=It(e,255),o=It(o,255);let i=Math.max(t,e,o),r=Math.min(t,e,o),s=0,n=0,a=(i+r)/2;if(i===r)n=0,s=0;else{let l=i-r;switch(n=a>.5?l/(2-i-r):l/(i+r),i){case t:s=(e-o)/l+(e<o?6:0);break;case e:s=(o-t)/l+2;break;case o:s=(t-e)/l+4;break;default:break}s/=6}return{h:s,s:n,l:a}}function Is(t,e,o){return o<0&&(o+=1),o>1&&(o-=1),o<1/6?t+(e-t)*(6*o):o<1/2?e:o<2/3?t+(e-t)*(2/3-o)*6:t}function Al(t,e,o){let i,r,s;if(t=It(t,360),e=It(e,100),o=It(o,100),e===0)r=o,s=o,i=o;else{let n=o<.5?o*(1+e):o+e-o*e,a=2*o-n;i=Is(a,n,t+1/3),r=Is(a,n,t),s=Is(a,n,t-1/3)}return{r:i*255,g:r*255,b:s*255}}function Bs(t,e,o){t=It(t,255),e=It(e,255),o=It(o,255);let i=Math.max(t,e,o),r=Math.min(t,e,o),s=0,n=i,a=i-r,l=i===0?0:a/i;if(i===r)s=0;else{switch(i){case t:s=(e-o)/a+(e<o?6:0);break;case e:s=(o-t)/a+2;break;case o:s=(t-e)/a+4;break;default:break}s/=6}return{h:s,s:l,v:n}}function Cl(t,e,o){t=It(t,360)*6,e=It(e,100),o=It(o,100);let i=Math.floor(t),r=t-i,s=o*(1-e),n=o*(1-r*e),a=o*(1-(1-r)*e),l=i%6,d=[o,n,s,s,a,o][l],f=[a,o,o,n,s,s][l],h=[s,s,a,o,o,n][l];return{r:d*255,g:f*255,b:h*255}}function Os(t,e,o,i){let r=[Qe(Math.round(t).toString(16)),Qe(Math.round(e).toString(16)),Qe(Math.round(o).toString(16))];return i&&r[0].startsWith(r[0].charAt(1))&&r[1].startsWith(r[1].charAt(1))&&r[2].startsWith(r[2].charAt(1))?r[0].charAt(0)+r[1].charAt(0)+r[2].charAt(0):r.join("")}function El(t,e,o,i,r){let s=[Qe(Math.round(t).toString(16)),Qe(Math.round(e).toString(16)),Qe(Math.round(o).toString(16)),Qe(Pd(i))];return r&&s[0].startsWith(s[0].charAt(1))&&s[1].startsWith(s[1].charAt(1))&&s[2].startsWith(s[2].charAt(1))&&s[3].startsWith(s[3].charAt(1))?s[0].charAt(0)+s[1].charAt(0)+s[2].charAt(0)+s[3].charAt(0):s.join("")}function Pl(t,e,o,i){let r=t/100,s=e/100,n=o/100,a=i/100,l=255*(1-r)*(1-a),d=255*(1-s)*(1-a),f=255*(1-n)*(1-a);return{r:l,g:d,b:f}}function Fs(t,e,o){let i=1-t/255,r=1-e/255,s=1-o/255,n=Math.min(i,r,s);return n===1?(i=0,r=0,s=0):(i=(i-n)/(1-n)*100,r=(r-n)/(1-n)*100,s=(s-n)/(1-n)*100),n*=100,{c:Math.round(i),m:Math.round(r),y:Math.round(s),k:Math.round(n)}}function Pd(t){return Math.round(parseFloat(t)*255).toString(16)}function zs(t){return oe(t)/255}function oe(t){return parseInt(t,16)}function $l(t){return{r:t>>16,g:(t&65280)>>8,b:t&255}}var Ti={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",goldenrod:"#daa520",gold:"#ffd700",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavenderblush:"#fff0f5",lavender:"#e6e6fa",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};function Ml(t){let e={r:0,g:0,b:0},o=1,i=null,r=null,s=null,n=!1,a=!1;return typeof t=="string"&&(t=Ld(t)),typeof t=="object"&&(fe(t.r)&&fe(t.g)&&fe(t.b)?(e=Sl(t.r,t.g,t.b),n=!0,a=String(t.r).substr(-1)==="%"?"prgb":"rgb"):fe(t.h)&&fe(t.s)&&fe(t.v)?(i=Li(t.s),r=Li(t.v),e=Cl(t.h,i,r),n=!0,a="hsv"):fe(t.h)&&fe(t.s)&&fe(t.l)?(i=Li(t.s),s=Li(t.l),e=Al(t.h,i,s),n=!0,a="hsl"):fe(t.c)&&fe(t.m)&&fe(t.y)&&fe(t.k)&&(e=Pl(t.c,t.m,t.y,t.k),n=!0,a="cmyk"),Object.prototype.hasOwnProperty.call(t,"a")&&(o=t.a)),o=Mr(o),{ok:n,format:t.format||a,r:Math.min(255,Math.max(e.r,0)),g:Math.min(255,Math.max(e.g,0)),b:Math.min(255,Math.max(e.b,0)),a:o}}var $d="[-\\+]?\\d+%?",Md="[-\\+]?\\d*\\.\\d+%?",Je="(?:"+Md+")|(?:"+$d+")",Ns="[\\s|\\(]+("+Je+")[,|\\s]+("+Je+")[,|\\s]+("+Je+")\\s*\\)?",Lr="[\\s|\\(]+("+Je+")[,|\\s]+("+Je+")[,|\\s]+("+Je+")[,|\\s]+("+Je+")\\s*\\)?",we={CSS_UNIT:new RegExp(Je),rgb:new RegExp("rgb"+Ns),rgba:new RegExp("rgba"+Lr),hsl:new RegExp("hsl"+Ns),hsla:new RegExp("hsla"+Lr),hsv:new RegExp("hsv"+Ns),hsva:new RegExp("hsva"+Lr),cmyk:new RegExp("cmyk"+Lr),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/};function Ld(t){if(t=t.trim().toLowerCase(),t.length===0)return!1;let e=!1;if(Ti[t])t=Ti[t],e=!0;else if(t==="transparent")return{r:0,g:0,b:0,a:0,format:"name"};let o=we.rgb.exec(t);return o?{r:o[1],g:o[2],b:o[3]}:(o=we.rgba.exec(t),o?{r:o[1],g:o[2],b:o[3],a:o[4]}:(o=we.hsl.exec(t),o?{h:o[1],s:o[2],l:o[3]}:(o=we.hsla.exec(t),o?{h:o[1],s:o[2],l:o[3],a:o[4]}:(o=we.hsv.exec(t),o?{h:o[1],s:o[2],v:o[3]}:(o=we.hsva.exec(t),o?{h:o[1],s:o[2],v:o[3],a:o[4]}:(o=we.cmyk.exec(t),o?{c:o[1],m:o[2],y:o[3],k:o[4]}:(o=we.hex8.exec(t),o?{r:oe(o[1]),g:oe(o[2]),b:oe(o[3]),a:zs(o[4]),format:e?"name":"hex8"}:(o=we.hex6.exec(t),o?{r:oe(o[1]),g:oe(o[2]),b:oe(o[3]),format:e?"name":"hex"}:(o=we.hex4.exec(t),o?{r:oe(o[1]+o[1]),g:oe(o[2]+o[2]),b:oe(o[3]+o[3]),a:zs(o[4]+o[4]),format:e?"name":"hex8"}:(o=we.hex3.exec(t),o?{r:oe(o[1]+o[1]),g:oe(o[2]+o[2]),b:oe(o[3]+o[3]),format:e?"name":"hex"}:!1))))))))))}function fe(t){return typeof t=="number"?!Number.isNaN(t):we.CSS_UNIT.test(t)}var Di=class t{constructor(e="",o={}){if(e instanceof t)return e;typeof e=="number"&&(e=$l(e)),this.originalInput=e;let i=Ml(e);this.originalInput=e,this.r=i.r,this.g=i.g,this.b=i.b,this.a=i.a,this.roundA=Math.round(100*this.a)/100,this.format=o.format??i.format,this.gradientType=o.gradientType,this.r<1&&(this.r=Math.round(this.r)),this.g<1&&(this.g=Math.round(this.g)),this.b<1&&(this.b=Math.round(this.b)),this.isValid=i.ok}isDark(){return this.getBrightness()<128}isLight(){return!this.isDark()}getBrightness(){let e=this.toRgb();return(e.r*299+e.g*587+e.b*114)/1e3}getLuminance(){let e=this.toRgb(),o,i,r,s=e.r/255,n=e.g/255,a=e.b/255;return s<=.03928?o=s/12.92:o=Math.pow((s+.055)/1.055,2.4),n<=.03928?i=n/12.92:i=Math.pow((n+.055)/1.055,2.4),a<=.03928?r=a/12.92:r=Math.pow((a+.055)/1.055,2.4),.2126*o+.7152*i+.0722*r}getAlpha(){return this.a}setAlpha(e){return this.a=Mr(e),this.roundA=Math.round(100*this.a)/100,this}isMonochrome(){let{s:e}=this.toHsl();return e===0}toHsv(){let e=Bs(this.r,this.g,this.b);return{h:e.h*360,s:e.s,v:e.v,a:this.a}}toHsvString(){let e=Bs(this.r,this.g,this.b),o=Math.round(e.h*360),i=Math.round(e.s*100),r=Math.round(e.v*100);return this.a===1?`hsv(${o}, ${i}%, ${r}%)`:`hsva(${o}, ${i}%, ${r}%, ${this.roundA})`}toHsl(){let e=Rs(this.r,this.g,this.b);return{h:e.h*360,s:e.s,l:e.l,a:this.a}}toHslString(){let e=Rs(this.r,this.g,this.b),o=Math.round(e.h*360),i=Math.round(e.s*100),r=Math.round(e.l*100);return this.a===1?`hsl(${o}, ${i}%, ${r}%)`:`hsla(${o}, ${i}%, ${r}%, ${this.roundA})`}toHex(e=!1){return Os(this.r,this.g,this.b,e)}toHexString(e=!1){return"#"+this.toHex(e)}toHex8(e=!1){return El(this.r,this.g,this.b,this.a,e)}toHex8String(e=!1){return"#"+this.toHex8(e)}toHexShortString(e=!1){return this.a===1?this.toHexString(e):this.toHex8String(e)}toRgb(){return{r:Math.round(this.r),g:Math.round(this.g),b:Math.round(this.b),a:this.a}}toRgbString(){let e=Math.round(this.r),o=Math.round(this.g),i=Math.round(this.b);return this.a===1?`rgb(${e}, ${o}, ${i})`:`rgba(${e}, ${o}, ${i}, ${this.roundA})`}toPercentageRgb(){let e=o=>`${Math.round(It(o,255)*100)}%`;return{r:e(this.r),g:e(this.g),b:e(this.b),a:this.a}}toPercentageRgbString(){let e=o=>Math.round(It(o,255)*100);return this.a===1?`rgb(${e(this.r)}%, ${e(this.g)}%, ${e(this.b)}%)`:`rgba(${e(this.r)}%, ${e(this.g)}%, ${e(this.b)}%, ${this.roundA})`}toCmyk(){return{...Fs(this.r,this.g,this.b)}}toCmykString(){let{c:e,m:o,y:i,k:r}=Fs(this.r,this.g,this.b);return`cmyk(${e}, ${o}, ${i}, ${r})`}toName(){if(this.a===0)return"transparent";if(this.a<1)return!1;let e="#"+Os(this.r,this.g,this.b,!1);for(let[o,i]of Object.entries(Ti))if(e===i)return o;return!1}toString(e){let o=!!e;e=e??this.format;let i=!1,r=this.a<1&&this.a>=0;return!o&&r&&(e.startsWith("hex")||e==="name")?e==="name"&&this.a===0?this.toName():this.toRgbString():(e==="rgb"&&(i=this.toRgbString()),e==="prgb"&&(i=this.toPercentageRgbString()),(e==="hex"||e==="hex6")&&(i=this.toHexString()),e==="hex3"&&(i=this.toHexString(!0)),e==="hex4"&&(i=this.toHex8String(!0)),e==="hex8"&&(i=this.toHex8String()),e==="name"&&(i=this.toName()),e==="hsl"&&(i=this.toHslString()),e==="hsv"&&(i=this.toHsvString()),e==="cmyk"&&(i=this.toCmykString()),i||this.toHexString())}toNumber(){return(Math.round(this.r)<<16)+(Math.round(this.g)<<8)+Math.round(this.b)}clone(){return new t(this.toString())}lighten(e=10){let o=this.toHsl();return o.l+=e/100,o.l=Mi(o.l),new t(o)}brighten(e=10){let o=this.toRgb();return o.r=Math.max(0,Math.min(255,o.r-Math.round(255*-(e/100)))),o.g=Math.max(0,Math.min(255,o.g-Math.round(255*-(e/100)))),o.b=Math.max(0,Math.min(255,o.b-Math.round(255*-(e/100)))),new t(o)}darken(e=10){let o=this.toHsl();return o.l-=e/100,o.l=Mi(o.l),new t(o)}tint(e=10){return this.mix("white",e)}shade(e=10){return this.mix("black",e)}desaturate(e=10){let o=this.toHsl();return o.s-=e/100,o.s=Mi(o.s),new t(o)}saturate(e=10){let o=this.toHsl();return o.s+=e/100,o.s=Mi(o.s),new t(o)}greyscale(){return this.desaturate(100)}spin(e){let o=this.toHsl(),i=(o.h+e)%360;return o.h=i<0?360+i:i,new t(o)}mix(e,o=50){let i=this.toRgb(),r=new t(e).toRgb(),s=o/100,n={r:(r.r-i.r)*s+i.r,g:(r.g-i.g)*s+i.g,b:(r.b-i.b)*s+i.b,a:(r.a-i.a)*s+i.a};return new t(n)}analogous(e=6,o=30){let i=this.toHsl(),r=360/o,s=[this];for(i.h=(i.h-(r*e>>1)+720)%360;--e;)i.h=(i.h+r)%360,s.push(new t(i));return s}complement(){let e=this.toHsl();return e.h=(e.h+180)%360,new t(e)}monochromatic(e=6){let o=this.toHsv(),{h:i}=o,{s:r}=o,{v:s}=o,n=[],a=1/e;for(;e--;)n.push(new t({h:i,s:r,v:s})),s=(s+a)%1;return n}splitcomplement(){let e=this.toHsl(),{h:o}=e;return[this,new t({h:(o+72)%360,s:e.s,l:e.l}),new t({h:(o+216)%360,s:e.s,l:e.l})]}onBackground(e){let o=this.toRgb(),i=new t(e).toRgb(),r=o.a+i.a*(1-o.a);return new t({r:(o.r*o.a+i.r*i.a*(1-o.a))/r,g:(o.g*o.a+i.g*i.a*(1-o.a))/r,b:(o.b*o.a+i.b*i.a*(1-o.a))/r,a:r})}triad(){return this.polyad(3)}tetrad(){return this.polyad(4)}polyad(e){let o=this.toHsl(),{h:i}=o,r=[this],s=360/e;for(let n=1;n<e;n++)r.push(new t({h:(i+n*s)%360,s:o.s,l:o.l}));return r}equals(e){let o=new t(e);return this.format==="cmyk"||o.format==="cmyk"?this.toCmykString()===o.toCmykString():this.toRgbString()===o.toRgbString()}};var Ll="EyeDropper"in window,W=class extends U{constructor(){super(),this.formControlController=new Ko(this),this.isSafeValue=!1,this.localize=new Ct(this),this.hasFocus=!1,this.isDraggingGridHandle=!1,this.isEmpty=!1,this.inputValue="",this.hue=0,this.saturation=100,this.brightness=100,this.alpha=100,this.value="",this.defaultValue="",this.label="",this.format="hex",this.inline=!1,this.size="medium",this.noFormatToggle=!1,this.name="",this.disabled=!1,this.hoist=!1,this.opacity=!1,this.uppercase=!1,this.swatches="",this.form="",this.required=!1,this.handleFocusIn=()=>{this.hasFocus=!0,this.emit("sl-focus")},this.handleFocusOut=()=>{this.hasFocus=!1,this.emit("sl-blur")},this.addEventListener("focusin",this.handleFocusIn),this.addEventListener("focusout",this.handleFocusOut)}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.input.updateComplete.then(()=>{this.formControlController.updateValidity()})}handleCopy(){this.input.select(),document.execCommand("copy"),this.previewButton.focus(),this.previewButton.classList.add("color-picker__preview-color--copied"),this.previewButton.addEventListener("animationend",()=>{this.previewButton.classList.remove("color-picker__preview-color--copied")})}handleFormatToggle(){let t=["hex","rgb","hsl","hsv"],e=(t.indexOf(this.format)+1)%t.length;this.format=t[e],this.setColor(this.value),this.emit("sl-change"),this.emit("sl-input")}handleAlphaDrag(t){let e=this.shadowRoot.querySelector(".color-picker__slider.color-picker__alpha"),o=e.querySelector(".color-picker__slider-handle"),{width:i}=e.getBoundingClientRect(),r=this.value,s=this.value;o.focus(),t.preventDefault(),yr(e,{onMove:n=>{this.alpha=pe(n/i*100,0,100),this.syncValues(),this.value!==s&&(s=this.value,this.emit("sl-input"))},onStop:()=>{this.value!==r&&(r=this.value,this.emit("sl-change"))},initialEvent:t})}handleHueDrag(t){let e=this.shadowRoot.querySelector(".color-picker__slider.color-picker__hue"),o=e.querySelector(".color-picker__slider-handle"),{width:i}=e.getBoundingClientRect(),r=this.value,s=this.value;o.focus(),t.preventDefault(),yr(e,{onMove:n=>{this.hue=pe(n/i*360,0,360),this.syncValues(),this.value!==s&&(s=this.value,this.emit("sl-input"))},onStop:()=>{this.value!==r&&(r=this.value,this.emit("sl-change"))},initialEvent:t})}handleGridDrag(t){let e=this.shadowRoot.querySelector(".color-picker__grid"),o=e.querySelector(".color-picker__grid-handle"),{width:i,height:r}=e.getBoundingClientRect(),s=this.value,n=this.value;o.focus(),t.preventDefault(),this.isDraggingGridHandle=!0,yr(e,{onMove:(a,l)=>{this.saturation=pe(a/i*100,0,100),this.brightness=pe(100-l/r*100,0,100),this.syncValues(),this.value!==n&&(n=this.value,this.emit("sl-input"))},onStop:()=>{this.isDraggingGridHandle=!1,this.value!==s&&(s=this.value,this.emit("sl-change"))},initialEvent:t})}handleAlphaKeyDown(t){let e=t.shiftKey?10:1,o=this.value;t.key==="ArrowLeft"&&(t.preventDefault(),this.alpha=pe(this.alpha-e,0,100),this.syncValues()),t.key==="ArrowRight"&&(t.preventDefault(),this.alpha=pe(this.alpha+e,0,100),this.syncValues()),t.key==="Home"&&(t.preventDefault(),this.alpha=0,this.syncValues()),t.key==="End"&&(t.preventDefault(),this.alpha=100,this.syncValues()),this.value!==o&&(this.emit("sl-change"),this.emit("sl-input"))}handleHueKeyDown(t){let e=t.shiftKey?10:1,o=this.value;t.key==="ArrowLeft"&&(t.preventDefault(),this.hue=pe(this.hue-e,0,360),this.syncValues()),t.key==="ArrowRight"&&(t.preventDefault(),this.hue=pe(this.hue+e,0,360),this.syncValues()),t.key==="Home"&&(t.preventDefault(),this.hue=0,this.syncValues()),t.key==="End"&&(t.preventDefault(),this.hue=360,this.syncValues()),this.value!==o&&(this.emit("sl-change"),this.emit("sl-input"))}handleGridKeyDown(t){let e=t.shiftKey?10:1,o=this.value;t.key==="ArrowLeft"&&(t.preventDefault(),this.saturation=pe(this.saturation-e,0,100),this.syncValues()),t.key==="ArrowRight"&&(t.preventDefault(),this.saturation=pe(this.saturation+e,0,100),this.syncValues()),t.key==="ArrowUp"&&(t.preventDefault(),this.brightness=pe(this.brightness+e,0,100),this.syncValues()),t.key==="ArrowDown"&&(t.preventDefault(),this.brightness=pe(this.brightness-e,0,100),this.syncValues()),this.value!==o&&(this.emit("sl-change"),this.emit("sl-input"))}handleInputChange(t){let e=t.target,o=this.value;t.stopPropagation(),this.input.value?(this.setColor(e.value),e.value=this.value):this.value="",this.value!==o&&(this.emit("sl-change"),this.emit("sl-input"))}handleInputInput(t){this.formControlController.updateValidity(),t.stopPropagation()}handleInputKeyDown(t){if(t.key==="Enter"){let e=this.value;this.input.value?(this.setColor(this.input.value),this.input.value=this.value,this.value!==e&&(this.emit("sl-change"),this.emit("sl-input")),setTimeout(()=>this.input.select())):this.hue=0}}handleInputInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleTouchMove(t){t.preventDefault()}parseColor(t){let e=new Di(t);if(!e.isValid)return null;let o=e.toHsl(),i={h:o.h,s:o.s*100,l:o.l*100,a:o.a},r=e.toRgb(),s=e.toHexString(),n=e.toHex8String(),a=e.toHsv(),l={h:a.h,s:a.s*100,v:a.v*100,a:a.a};return{hsl:{h:i.h,s:i.s,l:i.l,string:this.setLetterCase(`hsl(${Math.round(i.h)}, ${Math.round(i.s)}%, ${Math.round(i.l)}%)`)},hsla:{h:i.h,s:i.s,l:i.l,a:i.a,string:this.setLetterCase(`hsla(${Math.round(i.h)}, ${Math.round(i.s)}%, ${Math.round(i.l)}%, ${i.a.toFixed(2).toString()})`)},hsv:{h:l.h,s:l.s,v:l.v,string:this.setLetterCase(`hsv(${Math.round(l.h)}, ${Math.round(l.s)}%, ${Math.round(l.v)}%)`)},hsva:{h:l.h,s:l.s,v:l.v,a:l.a,string:this.setLetterCase(`hsva(${Math.round(l.h)}, ${Math.round(l.s)}%, ${Math.round(l.v)}%, ${l.a.toFixed(2).toString()})`)},rgb:{r:r.r,g:r.g,b:r.b,string:this.setLetterCase(`rgb(${Math.round(r.r)}, ${Math.round(r.g)}, ${Math.round(r.b)})`)},rgba:{r:r.r,g:r.g,b:r.b,a:r.a,string:this.setLetterCase(`rgba(${Math.round(r.r)}, ${Math.round(r.g)}, ${Math.round(r.b)}, ${r.a.toFixed(2).toString()})`)},hex:this.setLetterCase(s),hexa:this.setLetterCase(n)}}setColor(t){let e=this.parseColor(t);return e===null?!1:(this.hue=e.hsva.h,this.saturation=e.hsva.s,this.brightness=e.hsva.v,this.alpha=this.opacity?e.hsva.a*100:100,this.syncValues(),!0)}setLetterCase(t){return typeof t!="string"?"":this.uppercase?t.toUpperCase():t.toLowerCase()}async syncValues(){let t=this.parseColor(`hsva(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha/100})`);t!==null&&(this.format==="hsl"?this.inputValue=this.opacity?t.hsla.string:t.hsl.string:this.format==="rgb"?this.inputValue=this.opacity?t.rgba.string:t.rgb.string:this.format==="hsv"?this.inputValue=this.opacity?t.hsva.string:t.hsv.string:this.inputValue=this.opacity?t.hexa:t.hex,this.isSafeValue=!0,this.value=this.inputValue,await this.updateComplete,this.isSafeValue=!1)}handleAfterHide(){this.previewButton.classList.remove("color-picker__preview-color--copied")}handleEyeDropper(){if(!Ll)return;new EyeDropper().open().then(e=>{let o=this.value;this.setColor(e.sRGBHex),this.value!==o&&(this.emit("sl-change"),this.emit("sl-input"))}).catch(()=>{})}selectSwatch(t){let e=this.value;this.disabled||(this.setColor(t),this.value!==e&&(this.emit("sl-change"),this.emit("sl-input")))}getHexString(t,e,o,i=100){let r=new Di(`hsva(${t}, ${e}%, ${o}%, ${i/100})`);return r.isValid?r.toHex8String():""}stopNestedEventPropagation(t){t.stopImmediatePropagation()}handleFormatChange(){this.syncValues()}handleOpacityChange(){this.alpha=100}handleValueChange(t,e){if(this.isEmpty=!e,e||(this.hue=0,this.saturation=0,this.brightness=100,this.alpha=100),!this.isSafeValue){let o=this.parseColor(e);o!==null?(this.inputValue=this.value,this.hue=o.hsva.h,this.saturation=o.hsva.s,this.brightness=o.hsva.v,this.alpha=o.hsva.a*100,this.syncValues()):this.inputValue=t??""}}focus(t){this.inline?this.base.focus(t):this.trigger.focus(t)}blur(){var t;let e=this.inline?this.base:this.trigger;this.hasFocus&&(e.focus({preventScroll:!0}),e.blur()),(t=this.dropdown)!=null&&t.open&&this.dropdown.hide()}getFormattedValue(t="hex"){let e=this.parseColor(`hsva(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha/100})`);if(e===null)return"";switch(t){case"hex":return e.hex;case"hexa":return e.hexa;case"rgb":return e.rgb.string;case"rgba":return e.rgba.string;case"hsl":return e.hsl.string;case"hsla":return e.hsla.string;case"hsv":return e.hsv.string;case"hsva":return e.hsva.string;default:return""}}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return!this.inline&&!this.validity.valid?(this.dropdown.show(),this.addEventListener("sl-after-show",()=>this.input.reportValidity(),{once:!0}),this.disabled||this.formControlController.emitInvalidEvent(),!1):this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.saturation,e=100-this.brightness,o=Array.isArray(this.swatches)?this.swatches:this.swatches.split(";").filter(r=>r.trim()!==""),i=M`
      <div
        part="base"
        class=${mt({"color-picker":!0,"color-picker--inline":this.inline,"color-picker--disabled":this.disabled,"color-picker--focused":this.hasFocus})}
        aria-disabled=${this.disabled?"true":"false"}
        aria-labelledby="label"
        tabindex=${this.inline?"0":"-1"}
      >
        ${this.inline?M`
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
            class=${mt({"color-picker__grid-handle":!0,"color-picker__grid-handle--dragging":this.isDraggingGridHandle})}
            style=${Ue({top:`${e}%`,left:`${t}%`,backgroundColor:this.getHexString(this.hue,this.saturation,this.brightness,this.alpha)})}
            role="application"
            aria-label="HSV"
            tabindex=${D(this.disabled?void 0:"0")}
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
                tabindex=${D(this.disabled?void 0:"0")}
                @keydown=${this.handleHueKeyDown}
              ></span>
            </div>

            ${this.opacity?M`
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
                      tabindex=${D(this.disabled?void 0:"0")}
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
            ${this.noFormatToggle?"":M`
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
            ${Ll?M`
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

        ${o.length>0?M`
              <div part="swatches" class="color-picker__swatches">
                ${o.map(r=>{let s=this.parseColor(r);return s?M`
                    <div
                      part="swatch"
                      class="color-picker__swatch color-picker__transparent-bg"
                      tabindex=${D(this.disabled?void 0:"0")}
                      role="button"
                      aria-label=${r}
                      @click=${()=>this.selectSwatch(r)}
                      @keydown=${n=>!this.disabled&&n.key==="Enter"&&this.setColor(s.hexa)}
                    >
                      <div
                        class="color-picker__swatch-color"
                        style=${Ue({backgroundColor:s.hexa})}
                      ></div>
                    </div>
                  `:""})}
              </div>
            `:""}
      </div>
    `;return this.inline?i:M`
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
          class=${mt({"color-dropdown__trigger":!0,"color-dropdown__trigger--disabled":this.disabled,"color-dropdown__trigger--small":this.size==="small","color-dropdown__trigger--medium":this.size==="medium","color-dropdown__trigger--large":this.size==="large","color-dropdown__trigger--empty":this.isEmpty,"color-dropdown__trigger--focused":this.hasFocus,"color-picker__transparent-bg":!0})}
          style=${Ue({color:this.getHexString(this.hue,this.saturation,this.brightness,this.alpha)})}
          type="button"
        >
          <sl-visually-hidden>
            <slot name="label">${this.label}</slot>
          </sl-visually-hidden>
        </button>
        ${i}
      </sl-dropdown>
    `}};W.styles=[K,kl];W.dependencies={"sl-button-group":Ye,"sl-button":et,"sl-dropdown":Dt,"sl-icon":At,"sl-input":F,"sl-visually-hidden":xi};u([V('[part~="base"]')],W.prototype,"base",2);u([V('[part~="input"]')],W.prototype,"input",2);u([V(".color-dropdown")],W.prototype,"dropdown",2);u([V('[part~="preview"]')],W.prototype,"previewButton",2);u([V('[part~="trigger"]')],W.prototype,"trigger",2);u([St()],W.prototype,"hasFocus",2);u([St()],W.prototype,"isDraggingGridHandle",2);u([St()],W.prototype,"isEmpty",2);u([St()],W.prototype,"inputValue",2);u([St()],W.prototype,"hue",2);u([St()],W.prototype,"saturation",2);u([St()],W.prototype,"brightness",2);u([St()],W.prototype,"alpha",2);u([p()],W.prototype,"value",2);u([br()],W.prototype,"defaultValue",2);u([p()],W.prototype,"label",2);u([p()],W.prototype,"format",2);u([p({type:Boolean,reflect:!0})],W.prototype,"inline",2);u([p({reflect:!0})],W.prototype,"size",2);u([p({attribute:"no-format-toggle",type:Boolean})],W.prototype,"noFormatToggle",2);u([p()],W.prototype,"name",2);u([p({type:Boolean,reflect:!0})],W.prototype,"disabled",2);u([p({type:Boolean})],W.prototype,"hoist",2);u([p({type:Boolean})],W.prototype,"opacity",2);u([p({type:Boolean})],W.prototype,"uppercase",2);u([p()],W.prototype,"swatches",2);u([p({reflect:!0})],W.prototype,"form",2);u([p({type:Boolean,reflect:!0})],W.prototype,"required",2);u([ya({passive:!1})],W.prototype,"handleTouchMove",1);u([nt("format",{waitUntilFirstUpdate:!0})],W.prototype,"handleFormatChange",1);u([nt("opacity",{waitUntilFirstUpdate:!0})],W.prototype,"handleOpacityChange",1);u([nt("value")],W.prototype,"handleValueChange",1);W.define("sl-color-picker");var Ii=[],Tl=class{constructor(t){this.tabDirection="forward",this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=e=>{var o;if(e.key!=="Tab"||this.isExternalActivated||!this.isActive())return;let i=_r();if(this.previousFocus=i,this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;e.shiftKey?this.tabDirection="backward":this.tabDirection="forward";let r=wr(this.element),s=r.findIndex(a=>a===i);this.previousFocus=this.currentFocus;let n=this.tabDirection==="forward"?1:-1;for(;;){s+n>=r.length?s=0:s+n<0?s=r.length-1:s+=n,this.previousFocus=this.currentFocus;let a=r[s];if(this.tabDirection==="backward"&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus)||a&&this.possiblyHasTabbableChildren(a))return;e.preventDefault(),this.currentFocus=a,(o=this.currentFocus)==null||o.focus({preventScroll:!1});let l=[...vr()];if(l.includes(this.currentFocus)||!l.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())},this.handleKeyUp=()=>{this.tabDirection="forward"},this.element=t,this.elementsWithTabbableControls=["iframe"]}activate(){Ii.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){Ii=Ii.filter(t=>t!==this.element),this.currentFocus=null,document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return Ii[Ii.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){if(this.isActive()&&!this.isExternalActivated){let t=wr(this.element);if(!this.element.matches(":focus-within")){let e=t[0],o=t[t.length-1],i=this.tabDirection==="forward"?e:o;typeof i?.focus=="function"&&(this.currentFocus=i,i.focus({preventScroll:!1}))}}}possiblyHasTabbableChildren(t){return this.elementsWithTabbableControls.includes(t.tagName.toLowerCase())||t.hasAttribute("controls")}};var Hs=new Set;function Td(){let t=document.documentElement.clientWidth;return Math.abs(window.innerWidth-t)}function Dd(){let t=Number(getComputedStyle(document.body).paddingRight.replace(/px/,""));return isNaN(t)||!t?0:t}function Vs(t){if(Hs.add(t),!document.documentElement.classList.contains("sl-scroll-lock")){let e=Td()+Dd(),o=getComputedStyle(document.documentElement).scrollbarGutter;(!o||o==="auto")&&(o="stable"),e<2&&(o=""),document.documentElement.style.setProperty("--sl-scroll-lock-gutter",o),document.documentElement.classList.add("sl-scroll-lock"),document.documentElement.style.setProperty("--sl-scroll-lock-size",`${e}px`)}}function Us(t){Hs.delete(t),Hs.size===0&&(document.documentElement.classList.remove("sl-scroll-lock"),document.documentElement.style.removeProperty("--sl-scroll-lock-size"))}var Dl=H`
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
`;var $e=class extends U{constructor(){super(...arguments),this.hasSlotController=new De(this,"footer"),this.localize=new Ct(this),this.modal=new Tl(this),this.open=!1,this.label="",this.noHeader=!1,this.handleDocumentKeyDown=t=>{t.key==="Escape"&&this.modal.isActive()&&this.open&&(t.stopPropagation(),this.requestClose("keyboard"))}}firstUpdated(){this.dialog.hidden=!this.open,this.open&&(this.addOpenListeners(),this.modal.activate(),Vs(this))}disconnectedCallback(){super.disconnectedCallback(),this.modal.deactivate(),Us(this),this.removeOpenListeners()}requestClose(t){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:t}}).defaultPrevented){let o=Zt(this,"dialog.denyClose",{dir:this.localize.dir()});Qt(this.panel,o.keyframes,o.options);return}this.hide()}addOpenListeners(){var t;"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose("keyboard")):document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){var t;(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.modal.activate(),Vs(this);let t=this.querySelector("[autofocus]");t&&t.removeAttribute("autofocus"),await Promise.all([te(this.dialog),te(this.overlay)]),this.dialog.hidden=!1,requestAnimationFrame(()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(t?t.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),t&&t.setAttribute("autofocus","")});let e=Zt(this,"dialog.show",{dir:this.localize.dir()}),o=Zt(this,"dialog.overlay.show",{dir:this.localize.dir()});await Promise.all([Qt(this.panel,e.keyframes,e.options),Qt(this.overlay,o.keyframes,o.options)]),this.emit("sl-after-show")}else{Ji(this),this.emit("sl-hide"),this.removeOpenListeners(),this.modal.deactivate(),await Promise.all([te(this.dialog),te(this.overlay)]);let t=Zt(this,"dialog.hide",{dir:this.localize.dir()}),e=Zt(this,"dialog.overlay.hide",{dir:this.localize.dir()});await Promise.all([Qt(this.overlay,e.keyframes,e.options).then(()=>{this.overlay.hidden=!0}),Qt(this.panel,t.keyframes,t.options).then(()=>{this.panel.hidden=!0})]),this.dialog.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1,Us(this);let o=this.originalTrigger;typeof o?.focus=="function"&&setTimeout(()=>o.focus()),this.emit("sl-after-hide")}}async show(){if(!this.open)return this.open=!0,ye(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ye(this,"sl-after-hide")}render(){return M`
      <div
        part="base"
        class=${mt({dialog:!0,"dialog--open":this.open,"dialog--has-footer":this.hasSlotController.test("footer")})}
      >
        <div part="overlay" class="dialog__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${D(this.noHeader?this.label:void 0)}
          aria-labelledby=${D(this.noHeader?void 0:"title")}
          tabindex="-1"
        >
          ${this.noHeader?"":M`
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
    `}};$e.styles=[K,Dl];$e.dependencies={"sl-icon-button":Kt};u([V(".dialog")],$e.prototype,"dialog",2);u([V(".dialog__panel")],$e.prototype,"panel",2);u([V(".dialog__overlay")],$e.prototype,"overlay",2);u([p({type:Boolean,reflect:!0})],$e.prototype,"open",2);u([p({reflect:!0})],$e.prototype,"label",2);u([p({attribute:"no-header",type:Boolean,reflect:!0})],$e.prototype,"noHeader",2);u([nt("open",{waitUntilFirstUpdate:!0})],$e.prototype,"handleOpenChange",1);Yt("dialog.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:"ease"}});Yt("dialog.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:"ease"}});Yt("dialog.denyClose",{keyframes:[{scale:1},{scale:1.02},{scale:1}],options:{duration:250}});Yt("dialog.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}});Yt("dialog.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}});$e.define("sl-dialog");var Il=H`
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
`;var Ri=class extends U{constructor(){super(...arguments),this.vertical=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","separator")}handleVerticalChange(){this.setAttribute("aria-orientation",this.vertical?"vertical":"horizontal")}};Ri.styles=[K,Il];u([p({type:Boolean,reflect:!0})],Ri.prototype,"vertical",2);u([nt("vertical")],Ri.prototype,"handleVerticalChange",1);Ri.define("sl-divider");Dt.define("sl-dropdown");At.define("sl-icon");F.define("sl-input");var Rl=H`
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
`;var Tr=class extends U{connectedCallback(){super.connectedCallback(),this.setAttribute("role","menu")}handleClick(t){let e=["menuitem","menuitemcheckbox"],o=t.composedPath(),i=o.find(a=>{var l;return e.includes(((l=a?.getAttribute)==null?void 0:l.call(a,"role"))||"")});if(!i||o.find(a=>{var l;return((l=a?.getAttribute)==null?void 0:l.call(a,"role"))==="menu"})!==this)return;let n=i;n.type==="checkbox"&&(n.checked=!n.checked),this.emit("sl-select",{detail:{item:n}})}handleKeyDown(t){if(t.key==="Enter"||t.key===" "){let e=this.getCurrentItem();t.preventDefault(),t.stopPropagation(),e?.click()}else if(["ArrowDown","ArrowUp","Home","End"].includes(t.key)){let e=this.getAllItems(),o=this.getCurrentItem(),i=o?e.indexOf(o):0;e.length>0&&(t.preventDefault(),t.stopPropagation(),t.key==="ArrowDown"?i++:t.key==="ArrowUp"?i--:t.key==="Home"?i=0:t.key==="End"&&(i=e.length-1),i<0&&(i=e.length-1),i>e.length-1&&(i=0),this.setCurrentItem(e[i]),e[i].focus())}}handleMouseDown(t){let e=t.target;this.isMenuItem(e)&&this.setCurrentItem(e)}handleSlotChange(){let t=this.getAllItems();t.length>0&&this.setCurrentItem(t[0])}isMenuItem(t){var e;return t.tagName.toLowerCase()==="sl-menu-item"||["menuitem","menuitemcheckbox","menuitemradio"].includes((e=t.getAttribute("role"))!=null?e:"")}getAllItems(){return[...this.defaultSlot.assignedElements({flatten:!0})].filter(t=>!(t.inert||!this.isMenuItem(t)))}getCurrentItem(){return this.getAllItems().find(t=>t.getAttribute("tabindex")==="0")}setCurrentItem(t){this.getAllItems().forEach(o=>{o.setAttribute("tabindex",o===t?"0":"-1")})}render(){return M`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `}};Tr.styles=[K,Rl];u([V("slot")],Tr.prototype,"defaultSlot",2);Tr.define("sl-menu");var Bl=H`
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
`;var Bi=(t,e)=>{let o=t._$AN;if(o===void 0)return!1;for(let i of o)i._$AO?.(e,!1),Bi(i,e);return!0},Dr=t=>{let e,o;do{if((e=t._$AM)===void 0)break;o=e._$AN,o.delete(t),t=e}while(o?.size===0)},Ol=t=>{for(let e;e=t._$AM;t=e){let o=e._$AN;if(o===void 0)e._$AN=o=new Set;else if(o.has(t))break;o.add(t),Bd(e)}};function Id(t){this._$AN!==void 0?(Dr(this),this._$AM=t,Ol(this)):this._$AM=t}function Rd(t,e=!1,o=0){let i=this._$AH,r=this._$AN;if(r!==void 0&&r.size!==0)if(e)if(Array.isArray(i))for(let s=o;s<i.length;s++)Bi(i[s],!1),Dr(i[s]);else i!=null&&(Bi(i,!1),Dr(i));else Bi(this,t)}var Bd=t=>{t.type==de.CHILD&&(t._$AP??=Rd,t._$AQ??=Id)},Ir=class extends Te{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,o,i){super._$AT(e,o,i),Ol(this),this.isConnected=e._$AU}_$AO(e,o=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),o&&(Bi(this,e),Dr(this))}setValue(e){if(hr(this._$Ct))this._$Ct._$AI(e,this);else{let o=[...this._$Ct._$AH];o[this._$Ci]=e,this._$Ct._$AI(o,this,0)}}disconnected(){}reconnected(){}};var Fl=()=>new qs,qs=class{},Gs=new WeakMap,zl=Ne(class extends Ir{render(t){return _t}update(t,[e]){let o=e!==this.Y;return o&&this.Y!==void 0&&this.rt(void 0),(o||this.lt!==this.ct)&&(this.Y=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),_t}rt(t){if(this.isConnected||(t=void 0),typeof this.Y=="function"){let e=this.ht??globalThis,o=Gs.get(e);o===void 0&&(o=new WeakMap,Gs.set(e,o)),o.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),o.set(this.Y,t),t!==void 0&&this.Y.call(this.ht,t)}else this.Y.value=t}get lt(){return typeof this.Y=="function"?Gs.get(this.ht??globalThis)?.get(this.Y):this.Y?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var Nl=class{constructor(t,e){this.popupRef=Fl(),this.enableSubmenuTimer=-1,this.isConnected=!1,this.isPopupConnected=!1,this.skidding=0,this.submenuOpenDelay=100,this.handleMouseMove=o=>{this.host.style.setProperty("--safe-triangle-cursor-x",`${o.clientX}px`),this.host.style.setProperty("--safe-triangle-cursor-y",`${o.clientY}px`)},this.handleMouseOver=()=>{this.hasSlotController.test("submenu")&&this.enableSubmenu()},this.handleKeyDown=o=>{switch(o.key){case"Escape":case"Tab":this.disableSubmenu();break;case"ArrowLeft":o.target!==this.host&&(o.preventDefault(),o.stopPropagation(),this.host.focus(),this.disableSubmenu());break;case"ArrowRight":case"Enter":case" ":this.handleSubmenuEntry(o);break;default:break}},this.handleClick=o=>{var i;o.target===this.host?(o.preventDefault(),o.stopPropagation()):o.target instanceof Element&&(o.target.tagName==="sl-menu-item"||(i=o.target.role)!=null&&i.startsWith("menuitem"))&&this.disableSubmenu()},this.handleFocusOut=o=>{o.relatedTarget&&o.relatedTarget instanceof Element&&this.host.contains(o.relatedTarget)||this.disableSubmenu()},this.handlePopupMouseover=o=>{o.stopPropagation()},this.handlePopupReposition=()=>{let o=this.host.renderRoot.querySelector("slot[name='submenu']"),i=o?.assignedElements({flatten:!0}).filter(d=>d.localName==="sl-menu")[0],r=getComputedStyle(this.host).direction==="rtl";if(!i)return;let{left:s,top:n,width:a,height:l}=i.getBoundingClientRect();this.host.style.setProperty("--safe-triangle-submenu-start-x",`${r?s+a:s}px`),this.host.style.setProperty("--safe-triangle-submenu-start-y",`${n}px`),this.host.style.setProperty("--safe-triangle-submenu-end-x",`${r?s+a:s}px`),this.host.style.setProperty("--safe-triangle-submenu-end-y",`${n+l}px`)},(this.host=t).addController(this),this.hasSlotController=e}hostConnected(){this.hasSlotController.test("submenu")&&!this.host.disabled&&this.addListeners()}hostDisconnected(){this.removeListeners()}hostUpdated(){this.hasSlotController.test("submenu")&&!this.host.disabled?(this.addListeners(),this.updateSkidding()):this.removeListeners()}addListeners(){this.isConnected||(this.host.addEventListener("mousemove",this.handleMouseMove),this.host.addEventListener("mouseover",this.handleMouseOver),this.host.addEventListener("keydown",this.handleKeyDown),this.host.addEventListener("click",this.handleClick),this.host.addEventListener("focusout",this.handleFocusOut),this.isConnected=!0),this.isPopupConnected||this.popupRef.value&&(this.popupRef.value.addEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.addEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!0)}removeListeners(){this.isConnected&&(this.host.removeEventListener("mousemove",this.handleMouseMove),this.host.removeEventListener("mouseover",this.handleMouseOver),this.host.removeEventListener("keydown",this.handleKeyDown),this.host.removeEventListener("click",this.handleClick),this.host.removeEventListener("focusout",this.handleFocusOut),this.isConnected=!1),this.isPopupConnected&&this.popupRef.value&&(this.popupRef.value.removeEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.removeEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!1)}handleSubmenuEntry(t){let e=this.host.renderRoot.querySelector("slot[name='submenu']");if(!e)return;let o=null;for(let i of e.assignedElements())if(o=i.querySelectorAll("sl-menu-item, [role^='menuitem']"),o.length!==0)break;if(!(!o||o.length===0)){o[0].setAttribute("tabindex","0");for(let i=1;i!==o.length;++i)o[i].setAttribute("tabindex","-1");this.popupRef.value&&(t.preventDefault(),t.stopPropagation(),this.popupRef.value.active?o[0]instanceof HTMLElement&&o[0].focus():(this.enableSubmenu(!1),this.host.updateComplete.then(()=>{o[0]instanceof HTMLElement&&o[0].focus()}),this.host.requestUpdate()))}}setSubmenuState(t){this.popupRef.value&&this.popupRef.value.active!==t&&(this.popupRef.value.active=t,this.host.requestUpdate())}enableSubmenu(t=!0){t?(window.clearTimeout(this.enableSubmenuTimer),this.enableSubmenuTimer=window.setTimeout(()=>{this.setSubmenuState(!0)},this.submenuOpenDelay)):this.setSubmenuState(!0)}disableSubmenu(){window.clearTimeout(this.enableSubmenuTimer),this.setSubmenuState(!1)}updateSkidding(){var t;if(!((t=this.host.parentElement)!=null&&t.computedStyleMap))return;let e=this.host.parentElement.computedStyleMap(),i=["padding-top","border-top-width","margin-top"].reduce((r,s)=>{var n;let a=(n=e.get(s))!=null?n:new CSSUnitValue(0,"px"),d=(a instanceof CSSUnitValue?a:new CSSUnitValue(0,"px")).to("px");return r-d.value},0);this.skidding=i}isExpanded(){return this.popupRef.value?this.popupRef.value.active:!1}renderSubmenu(){let t=getComputedStyle(this.host).direction==="rtl";return this.isConnected?M`
      <sl-popup
        ${zl(this.popupRef)}
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
    `:M` <slot name="submenu" hidden></slot> `}};var ie=class extends U{constructor(){super(...arguments),this.localize=new Ct(this),this.type="normal",this.checked=!1,this.value="",this.loading=!1,this.disabled=!1,this.hasSlotController=new De(this,"submenu"),this.submenuController=new Nl(this,this.hasSlotController),this.handleHostClick=t=>{this.disabled&&(t.preventDefault(),t.stopImmediatePropagation())},this.handleMouseOver=t=>{this.focus(),t.stopPropagation()}}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleHostClick),this.addEventListener("mouseover",this.handleMouseOver)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleHostClick),this.removeEventListener("mouseover",this.handleMouseOver)}handleDefaultSlotChange(){let t=this.getTextLabel();if(typeof this.cachedTextLabel>"u"){this.cachedTextLabel=t;return}t!==this.cachedTextLabel&&(this.cachedTextLabel=t,this.emit("slotchange",{bubbles:!0,composed:!1,cancelable:!1}))}handleCheckedChange(){if(this.checked&&this.type!=="checkbox"){this.checked=!1;return}this.type==="checkbox"?this.setAttribute("aria-checked",this.checked?"true":"false"):this.removeAttribute("aria-checked")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleTypeChange(){this.type==="checkbox"?(this.setAttribute("role","menuitemcheckbox"),this.setAttribute("aria-checked",this.checked?"true":"false")):(this.setAttribute("role","menuitem"),this.removeAttribute("aria-checked"))}getTextLabel(){return Aa(this.defaultSlot)}isSubmenu(){return this.hasSlotController.test("submenu")}render(){let t=this.localize.dir()==="rtl",e=this.submenuController.isExpanded();return M`
      <div
        id="anchor"
        part="base"
        class=${mt({"menu-item":!0,"menu-item--rtl":t,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled,"menu-item--loading":this.loading,"menu-item--has-submenu":this.isSubmenu(),"menu-item--submenu-expanded":e})}
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
        ${this.loading?M` <sl-spinner part="spinner" exportparts="base:spinner__base"></sl-spinner> `:""}
      </div>
    `}};ie.styles=[K,Bl];ie.dependencies={"sl-icon":At,"sl-popup":it,"sl-spinner":yi};u([V("slot:not([name])")],ie.prototype,"defaultSlot",2);u([V(".menu-item")],ie.prototype,"menuItem",2);u([p()],ie.prototype,"type",2);u([p({type:Boolean,reflect:!0})],ie.prototype,"checked",2);u([p()],ie.prototype,"value",2);u([p({type:Boolean,reflect:!0})],ie.prototype,"loading",2);u([p({type:Boolean,reflect:!0})],ie.prototype,"disabled",2);u([nt("checked")],ie.prototype,"handleCheckedChange",1);u([nt("disabled")],ie.prototype,"handleDisabledChange",1);u([nt("type")],ie.prototype,"handleTypeChange",1);ie.define("sl-menu-item");var Hl=H`
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
`;var Ot=class extends U{constructor(){super(),this.localize=new Ct(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=t=>{t.key==="Escape"&&(t.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){let t=ks(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),t)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){let t=ks(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),t)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(t){return this.trigger.split(" ").includes(t)}async handleOpenChange(){var t,e;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await te(this.body),this.body.hidden=!1,this.popup.active=!0;let{keyframes:o,options:i}=Zt(this,"tooltip.show",{dir:this.localize.dir()});await Qt(this.popup.popup,o,i),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await te(this.body);let{keyframes:o,options:i}=Zt(this,"tooltip.hide",{dir:this.localize.dir()});await Qt(this.popup.popup,o,i),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,ye(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ye(this,"sl-after-hide")}render(){return M`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${mt({tooltip:!0,"tooltip--open":this.open})}
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
    `}};Ot.styles=[K,Hl];Ot.dependencies={"sl-popup":it};u([V("slot:not([name])")],Ot.prototype,"defaultSlot",2);u([V(".tooltip__body")],Ot.prototype,"body",2);u([V("sl-popup")],Ot.prototype,"popup",2);u([p()],Ot.prototype,"content",2);u([p()],Ot.prototype,"placement",2);u([p({type:Boolean,reflect:!0})],Ot.prototype,"disabled",2);u([p({type:Number})],Ot.prototype,"distance",2);u([p({type:Boolean,reflect:!0})],Ot.prototype,"open",2);u([p({type:Number})],Ot.prototype,"skidding",2);u([p()],Ot.prototype,"trigger",2);u([p({type:Boolean})],Ot.prototype,"hoist",2);u([nt("open",{waitUntilFirstUpdate:!0})],Ot.prototype,"handleOpenChange",1);u([nt(["content","distance","hoist","placement","skidding"])],Ot.prototype,"handleOptionsChange",1);u([nt("disabled")],Ot.prototype,"handleDisabledChange",1);Yt("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}});Yt("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}});Ot.define("sl-tooltip");xi.define("sl-visually-hidden");mi("/assets/shoelace");var O=new Vi("piano-projector"),Jo=new Ui("piano-projector-session"),Ht=nn(),Kl=an(),c={first_time:!0,lowperf:!1,number_of_keys:88,height_factor:1,device_name:null,sound:null,offset:{x:.5,y:.5},labels:{type:"english",octave:!0,played:!1,keys:new Set,toggle(t,e=void 0){e=e??!this.keys.has(t),e?this.keys.add(t):this.keys.delete(t),oo(t),at()},keysToStr(){return[...this.keys].join(",")},strToKeys(t){if(this.keys.clear(),t)for(let e of t.split(",")){let o=parseInt(e);Number.isInteger(o)&&this.keys.add(o)}},get type_badge(){return{english:"English",german:"German",italian:"Italian",pc:"Pitch-class",midi:"MIDI",freq:"Frequency"}[this.type]}},stickers:{color:"red",keys:new Map,toggle(t,e=void 0){e=e??!this.keys.has(t),e?this.keys.set(t,this.color):this.keys.delete(t),oo(t),at()},keysToStr(){let t=[];for(let[e,o]of this.keys.entries())t.push(`${e}:${o}`);return t.join(",")},strToKeys(t){if(this.keys.clear(),t)for(let e of t.split(",")){let[o,i]=e.split(":"),r=parseInt(o);Number.isInteger(r)&&this.keys.set(r,i)}}},zoom:1,pedals:!0,pedal_dim:!0,perspective:!0,top_felt:!0,toolbar:!0,semitones:0,octaves:0,get transpose(){return this.semitones+this.octaves*12},get highlight_opacity(){return getComputedStyle(document.documentElement).getPropertyValue("--highlight-opacity")},set highlight_opacity(t){document.documentElement.style.setProperty("--highlight-opacity",t)},get color_highlight(){return getComputedStyle(document.documentElement).getPropertyValue("--color-highlight")},set color_highlight(t){document.documentElement.style.setProperty("--color-highlight",t)},get color_white(){return getComputedStyle(document.documentElement).getPropertyValue("--color-white-key")},set color_white(t){document.documentElement.style.setProperty("--color-white-key",t)},get color_black(){return getComputedStyle(document.documentElement).getPropertyValue("--color-black-key")},set color_black(t){document.documentElement.style.setProperty("--color-black-key",t)},get color_top_felt(){return getComputedStyle(document.documentElement).getPropertyValue("--color-felt-top")},set color_top_felt(t){document.documentElement.style.setProperty("--color-felt-top",t)},get pc_keyboard_connected(){return this.device_name==="pckbd"}},gt={ports:[],get menu_items(){return Array.from(m.menus.connect.querySelectorAll(".menu-connect-item-midi-input"))},get connected_port(){return J.getConnectedPort()},access:"unavailable",queryAccess(t=null){J.queryMidiAccess(e=>{this.access=e,t?.(this.access)})},requestAccess(t=null){J.requestMidiAccess(()=>{this.access="granted",t?.(!0)},()=>{this.access="denied",t?.(!1)})},requestPorts(t=null){J.requestInputPortList(e=>{this.ports=e,t?.(e)},()=>{this.ports=null,t?.(null)})},clearMenuItems(){for(let t of this.menu_items)t.remove()},watchdog_id:null,setWatchdog(t){this.watchdog_id&&clearInterval(this.watchdog_id),this.watchdog_id=setInterval(dc,t)}},ut={player:new Qi,led:null,fail_alert:document.getElementById("alert-sound-connection-fail"),get type(){return this.player.name},get loaded(){return this.player.loaded},get loading(){return this.type&&!this.loaded},play(t,e=100){this.player.play(t+c.transpose,e)},stop(t,e){(e||!(J.isNoteOn(t,c.pedals?"both":"none")||zt.isNoteSustained(t))&&!(this.type=="apiano"&&t+c.transpose>88))&&this.player.stop(t+c.transpose)},stopAll(t){if(t)this.player.stopAll();else for(let e=0;e<128;e++)this.stop(e,!1)}},Ft={state:0,origin:{x:0,y:0},previous_offset:{x:0,y:0}},Z={enabled:!1,points:new Map,started(t=null){return t!==null?this.points.has(t):this.points.size>0},has_note(t){for(let e of this.points.values())if(e.has(t))return!0;return!1},add(t,e){this.points.has(t)&&(e=this.points.get(t).union(e)),this.points.set(t,e);for(let o of e.values())ut.play(o),oo(o)},change(t,e){let o=0,i=new Set().union(this.points.get(t));this.points.set(t,e);for(let r of i.values())e.has(r)||(ut.stop(r),oo(r),o=-1);for(let r of e.values())i.has(r)||(ut.play(r),oo(r),o=1);return o},remove(t){let e=this.points.get(t);this.points.delete(t);for(let o of e.values())this.has_note(o)||ut.stop(o),oo(o)},reset(){this.points.clear(),ut.stopAll()},enable(){this.enabled=!0,Eo()},disable(){this.reset(),this.enabled=!1,Eo()},last_vibration_time:0},m={self:document.getElementById("top-toolbar"),title:document.getElementById("toolbar-title"),dropdowns:{connect:document.getElementById("dropdown-connect"),sound:document.getElementById("dropdown-sound"),transpose:document.getElementById("dropdown-transpose"),size:document.getElementById("dropdown-size"),colors:document.getElementById("dropdown-colors"),pedals:document.getElementById("dropdown-pedals"),labels:document.getElementById("dropdown-labels"),stickers:document.getElementById("dropdown-stickers"),get all(){return[this.connect,this.sound,this.transpose,this.size,this.colors,this.pedals,this.labels,this.stickers]},closeAll(){for(let t of this.all)t.hide()},getOpen(){return this.all.find(t=>t.open)??null}},buttons:{connect:document.getElementById("btn-connect"),sound:document.getElementById("btn-sound"),transpose:document.getElementById("btn-transpose"),size:document.getElementById("btn-size"),colors:document.getElementById("btn-colors"),pedals:document.getElementById("btn-pedals"),labels_group:document.getElementById("btn-labels-group"),labels_left:document.getElementById("btn-labels-switch"),labels_right:document.getElementById("btn-labels-dropdown"),stickers_group:document.getElementById("btn-labels-group"),stickers_left:document.getElementById("btn-stickers-switch"),stickers_right:document.getElementById("btn-stickers-dropdown"),panic:document.getElementById("btn-panic"),hide_toolbar:document.getElementById("btn-hide-toolbar"),show_toolbar:document.getElementById("btn-show-toolbar")},menus:{connect:document.getElementById("midi-connection-menu"),sound:document.getElementById("menu-sound"),transpose:{top:document.getElementById("menu-transpose"),semitones:{input:document.getElementById("input-semitones"),btn_minus:document.getElementById("btn-semitone-minus"),btn_plus:document.getElementById("btn-semitone-plus")},octaves:{input:document.getElementById("input-octaves"),btn_minus:document.getElementById("btn-octave-minus"),btn_plus:document.getElementById("btn-octave-plus")},item_reset:document.getElementById("reset-transpose")},size:document.getElementById("menu-size"),colors:{top:document.getElementById("menu-colors"),highlight_opacity:document.getElementById("menu-highlight-opacity"),picker_color_white:document.getElementById("color-white"),picker_color_black:document.getElementById("color-black"),picker_color_pressed:document.getElementById("color-pressed"),item_perspective:document.getElementById("menu-perspective"),item_top_felt:document.getElementById("menu-top-felt")},labels:{top:document.getElementById("menu-labels-top"),labeling_mode:document.getElementById("menu-labeling-mode"),played:document.getElementById("menu-labels-played-keys"),presets:document.getElementById("menu-labels-which"),type:document.getElementById("menu-labels-type"),octave:document.getElementById("menu-item-labels-octave")},stickers:{top:document.getElementById("menu-stickers-top"),clear:document.getElementById("menu-stickers-clear")},pedals:{top:document.getElementById("pedal-menu"),item_follow:document.getElementById("menu-pedal-follow"),item_dim:document.getElementById("menu-pedal-dim")}},resize:{observer:null,timeout:null}},Vl=[{elm:m.title,action:"hide-elm"},{elm:m.buttons.sound,action:"hide-label"},{elm:m.buttons.connect,action:"hide-label"},{elm:m.buttons.pedals,action:"hide-label"},{elm:m.buttons.transpose,action:"hide-label"},{elm:m.buttons.stickers_left,action:"hide-label"},{elm:m.buttons.labels_left,action:"hide-label"},{elm:m.dropdowns.colors,action:"hide-elm"},{elm:m.dropdowns.size,action:"hide-elm"},{elm:m.dropdowns.sound,action:"hide-elm"},{elm:m.dropdowns.pedals,action:"hide-elm"},{elm:m.buttons.stickers_group,action:"hide-elm"},{elm:m.buttons.labels_group,action:"hide-elm"},{elm:m.buttons.panic,action:"hide-elm"},{elm:m.self,action:"hide-elm"}],P={svg:document.querySelector("svg#piano"),container:document.getElementById("main-area"),first_key:null,last_key:null,keys:Array(128).fill(null),labels:Array(128).fill(null),marking_groups:Array(128).fill(null),loaded:!1,resize:{timeout:null,observer:null}},Et=null,Ws=500,Fr=2e3,Od=["\u208B\u2081","\u2080","\u2081","\u2082","\u2083","\u2084","\u2085","\u2086","\u2087","\u2088","\u2089"],Fd=["\u207B\xB2","\u207B\xB9","\xB9","\xB2","\xB3","\u2074","\u2075","\u2076","\u2077","\u2078","\u2079","\xB9\u2070"],zd=["\u208B\u2082","\u208B\u2081","\u2081","\u2082","\u2083","\u2084","\u2085","\u2086","\u2087","\u2088","\u2089","\u2081\u2080"],Ul=["C","C\u266F","D","D\u266F","E","F","F\u266F","G","G\u266F","A","A\u266F","B"],Nd=[,"D\u266D",,"E\u266D",,,"G\u266D",,"A\u266D",,"B\u266D"],Rr=["C","Ces","D","Des","E","F","Fes","G","Ges","A","Aes","H"],Gl=[,"Dis",,"Eis",,,"Gis",,"Ais",,"B"],ql=["do","do\u266F","re","re\u266F","mi","fa","fa\u266F","sol","sol\u266F","la","la\u266F","si"],Hd=[,"re\u266D",,"mi\u266D",,,"sol\u266D",,"la\u266D",,"si\u266D"];function Wl(t){let e=new Set;switch(t){case"mc":e.add(60);break;case"cs":for(let o of $o(0,128,12))e.add(o);break;case"white":for(let o of $o(0,128))Do(o)&&e.add(o);break;case"all":for(let o of $o(0,128))e.add(o);break}return e}function jl(){for(let t of["none","mc","cs","white","all"]){let e=Wl(t);if(c.labels.keys.symmetricDifference(e).size==0)return t}return"custom"}function Oi(){let t=new Map([[88,["a0","c8"]],[61,["c2","c7"]],[49,["c2","c6"]],[37,["c3","c6"]],[25,["c3","c5"]],[20,["f3","c5"]]]).get(c.number_of_keys);P.first_key=Xr(t[0]),P.last_key=Xr(t[1]);let e={height_factor:c.height_factor,perspective:c.perspective,top_felt:c.top_felt,first_key:P.first_key,last_key:P.last_key};c.lowperf?mn(P.svg,P.keys,e):fn(P.svg,P.keys,e);for(let[o,i]of P.keys.entries())P.marking_groups[o]=i?.querySelector(".key-marker-group"),P.labels[o]=i?.querySelector(".key-label");P.loaded=!0,Yl()}function Xl(){document.getElementById("top-felt")?.toggleAttribute("hidden",!c.top_felt)}function oo(t){let e=P.keys[t];if(e){let o=t-c.transpose,r=Z.has_note(t)||J.isKeyPressed(o)||zt.isNotePressed(o),s=r||J.isNoteOn(o,c.pedals?"both":"none")||zt.isNoteSustained(o);e.classList.toggle("active",s),e.classList.toggle("pressed",r),e.classList.toggle("dim",c.pedal_dim&&s&&!r);let n=r?"d1":"d0";for(let a of e.children)a.hasAttribute(n)&&a.setAttribute("d",a.getAttribute(n));Vd(t,s,r)}}function Vt(t=$o(0,128)){for(let e of t)oo(e)}function Vd(t,e,o){let i=P.keys[t],r=P.marking_groups[t],s=P.labels[t];function n(){let a=t%12,l=Math.trunc(t/12),d=Do(a),f="";switch(c.labels.type){case"pc":f=`${a}`;break;case"english":let b=c.labels.octave?Od[l]:"";f=d?`${Ul[a]}${b}`:`${Nd[a]}
${Ul[a]}
${b}`;break;case"german":if(l>=4){let A=c.labels.octave?"\u2019".repeat(l-4):"";f=d?`${Rr[a].toLowerCase()}${A}`:`${Gl[a].toLowerCase()}
${Rr[a].toLowerCase()}`}else{let A=c.labels.octave?",".repeat(Math.abs(l-3)):"";f=d?`${Rr[a]}${A}`:`${Gl[a]}
${Rr[a]}`}break;case"italian":let g=c.labels.octave?d?Fd[l-1]:zd[l-1]:"";f=d?`${ql[a]}${g}`:`${Hd[a]}
${ql[a]}
${g}`;break;case"freq":let _=un(Z.enabled?t+c.transpose:t);f=`${_.toFixed(_<1e3?1:0)}`;break;default:f=`${t}`}let h=f.split(`
`);for(let[b,g]of Array.from(s.children).entries())g.textContent=h[b]??""}if(i){let a=c.labels.keys.has(t),l=a||c.labels.played&&e,d=c.labels.played&&!a;n(),i.classList.toggle("label-visible",l),i.classList.toggle("has-fixed-label",a),i.classList.toggle("has-temporary-label",d),s.classList.toggle("rotated",c.labels.type=="freq");let f=c.stickers.keys.has(t),h=f?c.stickers.keys.get(t):null;i.classList.toggle("has-sticker",f),i.classList.toggle("has-sticker-red",h=="red"),i.classList.toggle("has-sticker-yellow",h=="yellow"),i.classList.toggle("has-sticker-green",h=="green"),i.classList.toggle("has-sticker-blue",h=="blue"),i.classList.toggle("has-sticker-violet",h=="violet"),o&&r.hasAttribute("press_transform")?r.style.setProperty("transform",r.getAttribute("press_transform")):r.style.removeProperty("transform")}}function Eo(){P.svg.classList.toggle("touch-input",Z.enabled),P.svg.classList.toggle("grabbing",[1,2].includes(Ft.state)),P.svg.classList.toggle("marking-mode",Et),P.svg.classList.toggle("labeling-mode",Et=="label"),P.svg.classList.toggle("sticker-mode",Et=="sticker")}function Yl(){Vt(),Xl(),Po(),Eo()}function ei(){Ge("pedr",zt.isSustainActive()||J.sustain_pedal_value/127),Ge("pedm",J.sostenuto_pedal_value/127),Ge("pedl",J.soft_pedal_value/127)}function Nt(){Ge("connection-power-icon",c.pc_keyboard_connected||Z.enabled||c.device_name&&J.getConnectedPort()),Ge("transpose-power-icon",c.transpose!=0),Ge("sound-power-icon",ut.led,ut.led==1?"red":null),Ge("labels-power-icon",Et=="label"),Ge("stickers-power-icon",Et=="sticker",{red:"red",yellow:"yellow",green:"#0b0",blue:"blue",violet:"violet"}[c.stickers.color]),m.self.toggleAttribute("hidden",!c.toolbar),m.buttons.show_toolbar.toggleAttribute("hidden",c.toolbar),m.dropdowns.pedals.toggleAttribute("hidden",Z.enabled),ei()}function Zl(){for(let t of Vl)t.action=="hide-elm"?t.elm.classList.toggle("condensed-toolbar-hidden-elm",!1):t.action=="hide-label"&&t.elm.classList.toggle("condensed-toolbar-hidden-label",!1);for(let t of Vl){if(m.self.scrollWidth<=m.self.clientWidth)break;t.action=="hide-elm"?t.elm.classList.toggle("condensed-toolbar-hidden-elm",!0):t.action=="hide-label"&&t.elm.classList.toggle("condensed-toolbar-hidden-label",!0)}}function Ql(){if(ut.type&&!ut.loaded)for(let t of m.menus.sound.querySelectorAll(".menu-sound-item"))t.toggleAttribute("disabled",!t.hasAttribute("loading")),t.checked=!1;else for(let t of m.menus.sound.querySelectorAll(".menu-sound-item"))t.toggleAttribute("disabled",!1),t.checked=t.value==ut.type&&!t.hasAttribute("loading")}function js(){for(let t of m.dropdowns.size.querySelectorAll(".btn-number-of-keys")){let e=parseInt(t.value)==c.number_of_keys;t.variant=e?"neutral":null}for(let t of m.dropdowns.size.querySelectorAll(".btn-key-depth")){let e=parseFloat(t.value)==c.height_factor;t.variant=e?"neutral":null}}function Jl(){m.menus.colors.picker_color_white.value=c.color_white,m.menus.colors.picker_color_black.value=c.color_black,m.menus.colors.picker_color_pressed.value=c.color_highlight,m.menus.colors.item_perspective.checked=c.perspective,m.menus.colors.item_perspective.hidden=c.lowperf,m.menus.colors.item_top_felt.checked=c.top_felt;for(let t of m.menus.colors.highlight_opacity.children)t.checked=t.value==c.highlight_opacity.toString()}function Xs(){m.menus.pedals.item_follow.checked=c.pedals,m.menus.pedals.item_dim.checked=c.pedal_dim,m.menus.pedals.item_dim.toggleAttribute("disabled",!c.pedals)}function oi(){m.menus.labels.labeling_mode.checked=Et=="label",m.menus.labels.played.checked=c.labels.played;let t=jl();for(let e of m.menus.labels.presets.children)e.checked=e.value===t;m.menus.labels.presets.nextElementSibling.innerText={none:"None",mc:"Middle-C",cs:"C's",white:"White",all:"All",custom:"Custom"}[t];for(let e of m.menus.labels.type.children)e.value!="octave"&&(e.checked=e.value===c.labels.type);m.menus.labels.type.nextElementSibling.innerText=c.labels.type_badge,m.menus.labels.octave.disabled=["pc","midi","freq"].includes(c.labels.type),m.menus.labels.octave.checked=c.labels.octave}function Ys(){let t=Et=="sticker";for(let e of m.menus.stickers.top.children)if(e.getAttribute("type")=="checkbox"){let o=e.value==c.stickers.color;e.checked=t&&o,e.querySelector(".menu-keyboard-shortcut").classList.toggle("invisible",!o)}m.menus.stickers.clear.disabled=c.stickers.keys.size==0}function tc(){m.menus.transpose.semitones.input.value=c.semitones,m.menus.transpose.octaves.input.value=c.octaves,m.menus.transpose.item_reset.toggleAttribute("disabled",c.transpose==0),Ge("transpose-power-icon",c.transpose!=0)}function Po(){let t=P.container.clientHeight/P.svg.clientHeight;c.zoom>1?(c.zoom>t&&(c.zoom=t),P.svg.style.transform=`scale(${c.zoom}, ${c.zoom})`):P.svg.style.removeProperty("transform");let e=P.svg.getBoundingClientRect(),o=P.container.getBoundingClientRect(),i=(o.height-e.height)*c.offset.y;P.svg.style.top=`${i}px`;let r=Math.round((e.width-o.width)*c.offset.x);P.container.scroll(r,0),Me.container.toggleAttribute("position-top",c.offset.y>.5)}function Ks(t){let e=t+c.transpose;e>=0&&e<128&&oo(e)}function zr(){c.toolbar=!c.toolbar,Nt(),Po(),at()}function Zs(){ut.stopAll(!0),J.reset(),Z.reset(),zt.resetState(),Oi(),ei(),m.buttons.panic.setAttribute("variant","danger"),setTimeout(()=>{m.buttons.panic.removeAttribute("variant")},1e3)}function re(t={}){let e=c.transpose;t.reset&&(c.semitones=0,c.octaves=0),t.set?(Object.hasOwn(t,"semitones")&&(c.semitones=t.semitones),Object.hasOwn(t,"octaves")&&(c.octaves=t.octaves)):(Object.hasOwn(t,"semitones")&&(c.semitones=io(c.semitones+t.semitones,-11,11)),Object.hasOwn(t,"octaves")&&(c.octaves=io(c.octaves+t.octaves,-2,2))),e!=c.transpose&&ut.stopAll(!0),tc(),Vt(),at()}function Zo(t){c.number_of_keys=t,c.zoom=1,js(),Oi(),at()}function ec(t){c.height_factor=t,js(),Oi(),at()}function Ud(){ec(en(c.height_factor,[1,.75,.5]))}function Qo(t){c.labels.keys=Wl(t),oi(),Vt(),at()}function Ao(t){c.labels.type=t,oi(),Vt(),at()}function Qs(t){Et=t||null,Eo(),Nt()}function Nr(t=void 0){t===void 0&&(t=Et!="label"),Qs(t?"label":null),oi()}function to(t=void 0,e=c.stickers.color){t===void 0&&(t=Et!="sticker"||e!=c.stickers.color),c.stickers.color=e,Qs(t?"sticker":null),Ys()}function oc(){c.stickers.keys.clear(),Vt(),Ys(),at()}function ic(t=void 0){c.labels.played=t===void 0?!c.labels.played:t,oi(),Vt(),at()}function rc(t=void 0){c.labels.octave=t===void 0?!c.labels.octave:t,oi(),Vt(),at()}function Gd(t=void 0){c.pedals=t===void 0?!c.pedals:t,Xs(),Vt(),at()}function qd(t=void 0){c.pedal_dim=t===void 0?!c.pedal_dim:t,Xs(),Vt(),at()}function at(){O.writeBool("first-time",!1),O.writeNumber("height-factor",c.height_factor),O.writeNumber("number-of-keys",c.number_of_keys),O.writeString("color-pressed",c.color_highlight),O.writeString("color-white",c.color_white),O.writeString("color-black",c.color_black),O.writeString("labels-type",c.labels.type),O.writeBool("labels-octave",c.labels.octave),O.writeBool("labels-played",c.labels.played),O.writeString("labels-keys",c.labels.keysToStr()),O.writeString("sticker-color",c.stickers.color),O.writeString("stickers-keys",c.stickers.keysToStr()),O.writeBool("perspective",c.perspective),O.writeBool("top-felt",c.top_felt),O.writeString("highlight-opacity",c.highlight_opacity),O.writeBool("pedals",c.pedals),O.writeBool("pedal-dim",c.pedal_dim),O.writeNumber("offset-y",c.offset.y),c.device_name?O.writeString("device",c.device_name):O.remove("device"),O.writeString("sound",ut.type),Jo.writeNumber("semitones",c.semitones),Jo.writeNumber("octaves",c.octaves),Jo.writeBool("toolbar",c.toolbar)}function Kd(){c.first_time=O.readBool("first-time",!0),c.lowperf=O.readBool("lowperf",c.lowperf),c.height_factor=O.readNumber("height-factor",Ht?.75:c.height_factor),c.number_of_keys=O.readNumber("number-of-keys",Ht?20:c.number_of_keys),c.color_white=O.readString("color-white",c.color_white),c.color_black=O.readString("color-black",c.color_black),c.color_highlight=O.readString("color-pressed",c.color_highlight),c.labels.type=O.readString("labels-type",c.labels.type),c.labels.octave=O.readBool("labels-octave",c.labels.octave),c.labels.played=O.readBool("labels-played",c.labels.played),c.labels.strToKeys(O.readString("labels-keys","")),c.stickers.color=O.readString("sticker-color",c.stickers.color),c.stickers.strToKeys(O.readString("stickers-keys","")),c.perspective=O.readBool("perspective",c.perspective),c.top_felt=O.readBool("top-felt",c.top_felt),c.highlight_opacity=O.readString("highlight-opacity",c.highlight_opacity),c.pedals=O.readBool("pedals",c.pedals),c.pedal_dim=O.readBool("pedal-dim",c.pedal_dim),c.offset.y=O.readNumber("offset-y",c.offset.y),c.device_name=O.readString("device",null),c.sound=O.readString("sound",""),c.semitones=Jo.readNumber("semitones",0),c.octaves=Jo.readNumber("octaves",0),c.toolbar=Jo.readBool("toolbar",c.toolbar)}function Wd(){let t=on("mode").toLowerCase();["lp","lowperf"].includes(t)?(c.lowperf=!0,O.writeBool("lowperf",!0)):["hp","highperf"].includes(t)&&(c.lowperf=!1,O.writeBool("lowperf",!1))}function Ge(t,e,o=null){let i=document.getElementById(t);i.classList.toggle("active",e),e&&o?i.style.color=o:i.style.removeProperty("color"),i.style.setProperty("--led-intensity",`${e*100}%`)}function jd(t=null){t===null&&(t=!c.pc_keyboard_connected),t?ti("pckbd"):Js()}function Xd(t=null){t===null&&(t=!Z.enabled),t?ti("touch"):Js()}function ti(t,e=!1){switch(J.disconnect(),ut.stopAll(),t){case"pckbd":zt.enable(),Z.disable(),c.device_name="pckbd",Nt(),Yl(),e&&at();break;case"touch":zt.disable(),Z.enable(),c.device_name="touch",Nt(),Vt(),e&&at();break;default:zt.disable(),Z.disable(),c.device_name=null,Nt(),Vt(),J.connectByPortName(t,()=>{c.device_name=t,Nt(),Me.visible&&Me.replaceStructure(Fi()),e&&at()})}}function Js(t=!1){J.disconnect(),zt.disable(),Z.disable(),c.device_name=null,Nt(),Vt(),t&&at()}function Or(t,e=!1){t&&c.device_name!=t?ti(c.device_name==t?"":t,e):Js(e)}function Co(){let t=m.menus.connect.querySelector("sl-divider");if(document.getElementById("menu-connect-item-midi-denied").toggleAttribute("hidden",gt.access!="denied"),document.getElementById("menu-connect-item-midi-unavailable").toggleAttribute("hidden",Ht||gt.access!="unavailable"),document.getElementById("menu-connect-item-midi-prompt").toggleAttribute("hidden",gt.access!="prompt"),t.toggleAttribute("hidden",gt.access=="granted"&&!gt.ports?.length||Ht&&gt.access=="unavailable"),document.getElementById("menu-connect-item-computer-keyboard").toggleAttribute("checked",c.pc_keyboard_connected),document.getElementById("menu-connect-item-touch").toggleAttribute("checked",Z.enabled),gt.access!="granted"){gt.clearMenuItems();return}let e=document.getElementById("menu-connect-item-midi-port-template");for(let o of gt.ports??[])if(!gt.menu_items.some(i=>o.name==i.value)){let i=sn(e,{value:o.name},o.name);i.addEventListener("click",r=>{Or(r.currentTarget.value,!0)}),m.menus.connect.insertBefore(i,t)}for(let o of gt.menu_items??[])gt.ports.some(i=>o.value==i.name)?o.toggleAttribute("checked",o.value==gt.connected_port?.name):o.remove()}m.dropdowns.connect.addEventListener("sl-show",()=>{Co(),gt.setWatchdog(Ws),gt.queryAccess(t=>{t!="granted"&&Co(),["granted","prompt"].includes(t)&&gt.requestAccess(e=>{Co(),e&&gt.requestPorts(Co)})})});m.dropdowns.connect.addEventListener("sl-hide",()=>{gt.setWatchdog(Fr),Nt()});m.dropdowns.sound.addEventListener("sl-show",Ql);m.dropdowns.size.addEventListener("sl-show",js);m.dropdowns.colors.addEventListener("sl-show",Jl);m.dropdowns.pedals.addEventListener("sl-show",Xs);m.dropdowns.labels.addEventListener("sl-show",oi);m.dropdowns.stickers.addEventListener("sl-show",Ys);m.dropdowns.transpose.addEventListener("sl-show",tc);for(let t of m.dropdowns.all)t.addEventListener("sl-show",e=>{e.currentTarget.querySelector("sl-button").setAttribute("variant","neutral")}),t.addEventListener("sl-hide",e=>{let o=e.currentTarget.querySelector("sl-button");o.setAttribute("variant","default"),o.blur()});document.getElementById("menu-connect-item-computer-keyboard").addEventListener("click",()=>{jd(),at()});document.getElementById("menu-connect-item-touch").addEventListener("click",()=>{Xd(),at()});function sc(t=null,e=null){if(!t)ut.player.unload(),ut.led=0,Nt();else{ut.led=1,e.toggleAttribute("loading",!0);let o=setInterval(()=>{ut.led=ut.led==0?1:0,Nt()},400),i=r=>{clearInterval(o),ut.led=r?2:0,e.toggleAttribute("loading",!1),Nt(),Ql()};ut.player.load(t,()=>{i(!0),at()},r=>{i(!1),ut.fail_alert.children[1].innerText=`Reason: ${r}`,ut.fail_alert.toast()}),Nt()}}m.menus.sound.addEventListener("sl-select",t=>{sc(t.detail.item.value,t.detail.item),at()});m.dropdowns.size.querySelectorAll(".btn-number-of-keys").forEach(t=>{t.addEventListener("click",e=>{Zo(parseInt(e.currentTarget.value)),Ht&&m.dropdowns.size.hide()})});m.dropdowns.size.querySelectorAll(".btn-key-depth").forEach(t=>{t.addEventListener("click",e=>{ec(parseFloat(e.currentTarget.value)),Ht&&m.dropdowns.size.hide()})});m.menus.colors.highlight_opacity.addEventListener("sl-select",t=>{c.highlight_opacity=t.detail.item.value,at(),Jl()});m.menus.colors.item_perspective.addEventListener("click",()=>{c.perspective=!c.perspective,Oi(),at(),Ht&&m.dropdowns.colors.hide()});m.menus.colors.item_top_felt.addEventListener("click",()=>{c.top_felt=!c.top_felt,Xl(),at(),Ht&&m.dropdowns.colors.hide()});m.menus.colors.picker_color_white.addEventListener("sl-change",t=>{c.color_white=t.target.value,at()});m.menus.colors.picker_color_black.addEventListener("sl-change",t=>{c.color_black=t.target.value,at()});m.menus.colors.picker_color_pressed.addEventListener("sl-change",t=>{c.color_highlight=t.target.value,at()});m.menus.labels.presets.addEventListener("sl-select",t=>{Qo(t.detail.item.value),Ht&&m.dropdowns.labels.hide()});m.menus.labels.type.addEventListener("sl-select",t=>{t.detail.item.value==m.menus.labels.octave.value?rc(t.detail.item.checked):Ao(t.detail.item.value),Ht&&m.dropdowns.labels.hide()});m.menus.labels.top.addEventListener("sl-select",t=>{t.detail.item.id==m.menus.labels.labeling_mode.id?(Nr(t.detail.item.checked),m.dropdowns.labels.hide()):t.detail.item.id==m.menus.labels.played.id&&(ic(t.detail.item.checked),Ht&&m.dropdowns.labels.hide())});m.buttons.labels_left.addEventListener("click",()=>{Nr()});m.menus.stickers.top.addEventListener("sl-select",t=>{t.detail.item.getAttribute("type")=="checkbox"&&(to(void 0,t.detail.item.value),m.dropdowns.stickers.hide()),at()});m.buttons.stickers_left.addEventListener("click",()=>{to()});m.menus.stickers.clear.addEventListener("click",t=>{oc()});m.menus.pedals.top.addEventListener("sl-select",t=>{let e=t.detail.item;switch(e.id){case"menu-pedal-follow":c.pedals=e.checked;break;case"menu-pedal-dim":c.pedal_dim=e.checked;break}m.menus.pedals.item_dim.toggleAttribute("disabled",!c.pedals),ei(),Vt(),at(),Ht&&m.dropdowns.pedals.hide()});m.menus.transpose.semitones.btn_plus.onclick=()=>{re({semitones:1})};m.menus.transpose.semitones.btn_minus.onclick=()=>{re({semitones:-1})};m.menus.transpose.octaves.btn_plus.onclick=()=>{re({octaves:1})};m.menus.transpose.octaves.btn_minus.onclick=()=>{re({octaves:-1})};m.menus.transpose.item_reset.onclick=()=>{re({reset:!0}),Ht&&m.dropdowns.transpose.hide()};m.buttons.panic.onclick=Zs;m.buttons.hide_toolbar.onclick=zr;m.buttons.show_toolbar.onclick=zr;m.title.onclick=()=>{document.getElementById("dialog-about").show()};window.addEventListener("keydown",rh);function Fi(){function t(){let r=gt.ports.map((s,n)=>[s.name,()=>Or(s.name,!0),{checked:c.device_name==s.name}]);return r.push(["Computer keyboard",()=>Or("pckbd",!0),{checked:c.pc_keyboard_connected}]),r.push(["Touch or mouse",()=>Or("touch",!0),{checked:Z.enabled}]),r}function e(){if(!c.transpose)return"not transposed";let r=`${c.semitones} semitone${c.semitones!=1?"s":""}`,s=`${c.octaves} octave${c.octaves!=1?"s":""}`;return`${r}, ${s}`}function o(){return c.height_factor==1?"Full":c.height_factor==.5?"1/2":"3/4"}let i=jl();return[["",[["&Control",t()],["&Transpose",[["[\u2191] Semitone up",()=>re({semitones:1}),{noindex:!0,key:"arrowup"}],["[\u2193] Semitone down",()=>re({semitones:-1}),{noindex:!0,key:"arrowdown"}],["[\u2192] Octave up",()=>re({octaves:1}),{noindex:!0,key:"arrowright"}],["[\u2190] Octave down",()=>re({octaves:-1}),{noindex:!0,key:"arrowleft"}],["&Reset",()=>re({reset:!0}),{noindex:!0}],[`State: ${e()}`,null]]],["&Size",[["&88 keys",()=>Zo(88),{noindex:!0,checked:c.number_of_keys==88}],["&61 keys",()=>Zo(61),{noindex:!0,checked:c.number_of_keys==61}],["&49 keys",()=>Zo(49),{noindex:!0,checked:c.number_of_keys==49}],["&37 keys",()=>Zo(37),{noindex:!0,checked:c.number_of_keys==37}],["&25 keys",()=>Zo(25),{noindex:!0,checked:c.number_of_keys==25}],[`Change key &depth (current: ${o()})`,()=>Ud(),{noindex:!0}]]],["&Pedals",[["&Follow pedals",()=>Gd(),{checked:c.pedals}],["&Dim pedalized notes",()=>qd(),{checked:c.pedal_dim}]]],["&Labels",[["&Toggle Labeling mode (F2)",()=>Nr(),{checked:Et=="label"}],["&Show on played keys",()=>ic(),{checked:c.labels.played}],["&Presets",[["&None",()=>Qo("none"),{checked:i=="none"}],["&Middle-C",()=>Qo("mc"),{checked:i=="mc"}],["&C-keys",()=>Qo("cs"),{checked:i=="cs"}],["&White keys",()=>Qo("white"),{checked:i=="white"}],["&All keys",()=>Qo("all"),{checked:i=="all"}]]],["&Format",[["&English",()=>Ao("english"),{checked:c.labels.type=="english"}],["&German",()=>Ao("german"),{checked:c.labels.type=="german"}],["&Italian",()=>Ao("italian"),{checked:c.labels.type=="italian"}],["&Pitch-class",()=>Ao("pc"),{checked:c.labels.type=="pc"}],["&MIDI value",()=>Ao("midi"),{checked:c.labels.type=="midi"}],["&Frequency",()=>Ao("freq"),{checked:c.labels.type=="freq"}],["Show &octave",()=>rc(),{checked:c.labels.octave}]]]]],["Stic&kers",[["&Red",()=>to(void 0,"red"),{checked:Et=="sticker"&&c.stickers.color=="red"}],["&Yellow",()=>to(void 0,"yellow"),{checked:Et=="sticker"&&c.stickers.color=="yellow"}],["&Green",()=>to(void 0,"green"),{checked:Et=="sticker"&&c.stickers.color=="green"}],["&Blue",()=>to(void 0,"blue"),{checked:Et=="sticker"&&c.stickers.color=="blue"}],["&Violet",()=>to(void 0,"violet"),{checked:Et=="sticker"&&c.stickers.color=="violet"}],["&Clear",()=>oc()]]],["Panic!",Zs],[`${c.toolbar?"Hide":"Show"} toolbar [<u>F9</u>]`,zr,{key:"f9"}]]]]}var Me=new Gi(document.getElementById("keyboard-navigator"),Fi());Me.onmenuenter=t=>{gt.setWatchdog(t=="Control"?Ws:Fr),Me.replaceStructure(Fi())};Me.onoptionenter=()=>Me.replaceStructure(Fi());Me.onshow=()=>gt.setWatchdog(Ws);Me.onhide=()=>gt.setWatchdog(Fr);P.svg.oncontextmenu=t=>{Ft.state>0&&t.preventDefault(),Ft.state=0};P.svg.addEventListener("pointerdown",t=>{m.dropdowns.closeAll(),(t.pointerType!="touch"&&t.button!=0||!Z.enabled)&&(!Et||t.button!=0)&&(Ft.state=1,Ft.origin.x=t.screenX,Ft.origin.y=t.screenY,Ft.previous_offset.x=c.offset.x,Ft.previous_offset.y=c.offset.y,P.svg.setPointerCapture(t.pointerId),Eo())},{capture:!0,passive:!1});P.svg.addEventListener("pointerup",t=>{t.pointerType!="touch"&&Ft.state&&(Ft.state=Ft.state==2&&t.button==2?3:0,P.svg.releasePointerCapture(t.pointerId),Po(),Eo(),at())},{capture:!0,passive:!1});P.svg.addEventListener("pointermove",t=>{if(t.pointerType!="touch"&&Ft.state){let o=P.svg.getBoundingClientRect(),i=P.container.getBoundingClientRect();Ft.state=2;let s=(t.screenX-Ft.origin.x)/(o.width-i.width);c.offset.x=io(Ft.previous_offset.x-s,0,1);let n=P.container.clientHeight/P.svg.clientHeight;if(c.zoom<n-(n-1)/10){let l=(t.screenY-Ft.origin.y)/(i.height-o.height);c.offset.y=io(Ft.previous_offset.y+l,0,1),t.ctrlKey||(c.offset.y<.06&&(c.offset.y=0),c.offset.y>1-.06&&(c.offset.y=1),Math.abs(.5-c.offset.y)<.06&&(c.offset.y=.5))}Po(),Eo()}},{capture:!1,passive:!0});P.container.addEventListener("wheel",t=>{if(!Ft.state&&!Z.started()&&!t.ctrlKey){let e=-t.deltaY/(t.deltaY<=0?1e3:500),o=P.container.clientHeight/P.svg.clientHeight,i=io(c.zoom+e,1,o);if(c.zoom!=i){let s=P.svg.getBoundingClientRect(),n=P.container.getBoundingClientRect(),a=Math.round(n.width*i);c.offset.x=(t.clientX-(t.clientX-s.left)/s.width*a-n.left)/(n.width-a),c.zoom=i}let r=t.deltaX/1e3;r&&(c.offset.x=io(c.offset.x-r,0,1)),Po()}t.preventDefault()},{capture:!1,passive:!1});Ht||(Br=null,P.container.addEventListener("pointermove",t=>{t.pointerType!="touch"&&(Br&&clearTimeout(Br),m.buttons.show_toolbar.toggleAttribute("visible",!0),P.container.toggleAttribute("cursor-hidden",!1),P.svg.toggleAttribute("cursor-hidden",!1),Br=setTimeout(()=>{m.buttons.show_toolbar.toggleAttribute("visible",!1),Z.enabled||(P.container.toggleAttribute("cursor-hidden",!0),P.svg.toggleAttribute("cursor-hidden",!0))},4e3))},{capture:!1,passive:!0}));var Br;function eo(t,e){let o=document.elementFromPoint(t,e)?.parentElement;return o?.classList.contains("key")?parseInt(o.getAttribute("value")):null}function nc(t,e,o,i,r){let s=rn(r),n=Math.sin(s),a=Math.cos(s);Kl&&(o/=10,i/=10);let[l,d]=o>=i?[t+o*a,e+o*n]:[t-i*n,e+i*a],[f,h]=o>=i?[t-o*a,e-o*n]:[t+i*n,e-i*a],[b,g]=o>=i?[t-i*n,e+i*a]:[t+o*a,e+o*n],[_,A]=o>=i?[t+i*n,e-i*a]:[t-o*a,e-o*n],$=eo(l,d),S=eo(f,h),I=eo(b,g),R=eo(_,A),j=new Set([$,S,I,R]),G=Math.min($,S,I,R),lt=Math.max($,S,I,R),rt=lt-G;if(rt>1){let[vt,q]=G==$?[l,d]:G==S?[f,h]:G==I?[b,g]:[_,A],[dt,y]=lt==$?[l,d]:lt==S?[f,h]:lt==I?[b,g]:[_,A],bt=(dt-vt)/rt,$t=(y-q)/rt;for(let st=.5;st<rt;st+=.5){let[Rt,Tt]=[vt+bt*st,q+$t*st],X=eo(Rt,Tt);j.add(X)}}return j.delete(null),j}function Yd(t){if(m.dropdowns.closeAll(),t.pointerType!="touch"&&Z.enabled&&!Et&&t.button===0&&!Z.started(t.pointerId)){let e=eo(t.clientX,t.clientY);e&&(Z.add(t.pointerId,new Set([e])),t.preventDefault())}}function ac(t){t.pointerType!="touch"&&Z.started(t.pointerId)&&t.button===0&&(t.preventDefault(),Z.remove(t.pointerId))}function Zd(t){if(t.pointerType!="touch"&&Z.started(t.pointerId)){let e=eo(t.clientX,t.clientY);Z.change(t.pointerId,new Set([e])),t.preventDefault()}}function Qd(t){if(Z.enabled&&!Et){for(let e of t.changedTouches)if(!Z.started(e.identifier)){let o=nc(e.clientX,e.clientY,e.radiusX,e.radiusY,e.rotationAngle);o.size&&(Z.add(e.identifier,o),t.timeStamp-Z.last_vibration_time>40&&(navigator.vibrate(40),Z.last_vibration_time=t.timeStamp),t.preventDefault())}}}function lc(t){for(let e of t.changedTouches)Z.started(e.identifier)&&(Z.remove(e.identifier),t.preventDefault())}function Jd(t){for(let e of t.changedTouches)if(Z.started(e.identifier)){let o=nc(e.clientX,e.clientY,e.radiusX,e.radiusY,e.rotationAngle);Z.change(e.identifier,o)==1&&t.timeStamp-Z.last_vibration_time>40&&(navigator.vibrate(40),Z.last_vibration_time=t.timeStamp),t.preventDefault()}}P.svg.addEventListener("pointerdown",Yd,{capture:!0,passive:!1});P.svg.addEventListener("touchstart",Qd,{capture:!0,passive:!1});window.addEventListener("pointerup",ac,{capture:!1,passive:!1});window.addEventListener("pointercancel",ac,{capture:!1,passive:!1});window.addEventListener("touchend",lc,{capture:!1,passive:!1});window.addEventListener("touchcancel",lc,{capture:!1,passive:!1});window.addEventListener("pointermove",Zd,{capture:!1,passive:!1});window.addEventListener("touchmove",Jd,{capture:!1,passive:!1});function th(t){if(t.button===0){let e=eo(t.clientX,t.clientY);if(e){let o=t.ctrlKey?Array.from($o(e%12,128,12)):[e];if(Et=="label"){let i=!c.labels.keys.has(e);for(let r of o)c.labels.toggle(r,i)}else if(Et=="sticker"){let i=!c.stickers.keys.has(e);for(let r of o)c.stickers.toggle(r,i)}}}}P.svg.addEventListener("click",th,{capture:!1,passive:!0});function cc(t,e){Ks(t),ut.play(t,e)}function uc(t,e,o){o&&o<100?setTimeout(()=>Ks(t),100-o):Ks(t),ut.stop(t,!1)}function eh(){Vt(),ut.stopAll(!1),ei()}function oh(t){t>63&&t<68&&(Vt(),ut.stopAll(!1),ei())}function ih(){Vt(),ut.stopAll(!0),ei()}J.onConnectionChange=()=>{Vt(),Nt()};J.onKeyPress=cc;J.onKeyRelease=uc;J.onControlChange=oh;zt.onKeyPress=cc;zt.onKeyRelease=uc;zt.onSustain=eh;zt.onReset=ih;function dc(){let t=m.dropdowns.connect.open;gt.queryAccess(e=>{e=="granted"?(Me.visible&&Me.replaceStructure(Fi()),gt.requestPorts(o=>{if(gt.ports=o,c.device_name&&c.device_name!="pckbd"&&c.device_name!="touch"){if(!J.getConnectedPort()){let r=o.find(s=>s.name==c.device_name);r&&J.connect(r,()=>{Nt(),t&&Co()})}Nt()}t&&Co()})):(J.disconnect(),Nt(),t&&Co())})}function rh(t){if(t.repeat)return;if(t.key=="Alt"){let r=m.dropdowns.getOpen();r&&(r.hide(),r.querySelector("sl-button[slot=trigger]").blur())}let e=new Map([["f2",Nr],["f3",to],["f9",zr],["escape",()=>{let r=m.dropdowns.getOpen();r?(r.hide(),r.querySelector("sl-button[slot=trigger]").blur()):Et?Qs(null):Zs()}],["pageup",()=>re({semitones:1})],["pagedown",()=>re({semitones:-1})],["shift+pageup",()=>re({octaves:1})],["shift+pagedown",()=>re({octaves:-1})]]),o=[];t.ctrlKey&&o.push("ctrl"),t.altKey&&o.push("alt"),t.shiftKey&&o.push("shift"),o.push(t.key.toLowerCase());let i=o.join("+");e.has(i)&&(t.preventDefault(),e.get(i)())}function sh(){m.resize.timeout&&clearTimeout(m.resize.timeout),m.resize_timeout=setTimeout(()=>{Zl(),m.resize.timeout=null},c.lowperf?50:5)}function nh(){P.resize.timeout&&clearTimeout(P.resize.timeout),P.resize_timeout=setTimeout(()=>{Po(),P.resize.timeout=null},c.lowperf?50:5)}function ah(){if(Kd(),Wd(),document.body.classList.add("ready"),Ht&&(document.documentElement.classList.add("mobile"),m.buttons.show_toolbar.classList.add("mobile"),m.buttons.panic.parentElement.toggleAttribute("disabled",!0),m.buttons.hide_toolbar.parentElement.toggleAttribute("disabled",!0),m.buttons.show_toolbar.parentElement.toggleAttribute("disabled",!0),m.menus.size.querySelector('.btn-number-of-keys[value="20"]').toggleAttribute("hidden",!1)),Kl?m.dropdowns.sound.toggleAttribute("hidden",!0):(document.getElementById("menu-sound-item-unavailable").hidden=!0,m.menus.sound.querySelectorAll(".menu-sound-item").forEach(e=>{e.hidden=!1}),Ht&&c.sound&&sc(c.sound)),Nt(),Oi(),c.device_name)["pckbd","touch"].includes(c.device_name)?ti(c.device_name):gt.queryAccess(e=>{e=="granted"&&ti(c.device_name)});else{let e=document.getElementById("dropdown-connect-tooltip");Ht?(ti("touch",!0),e.setAttribute("content","Play your keyboard using your fingers! Or change the input method by tapping this button.")):e.setAttribute("content","Click on this button to select an input method."),e.open=!0,window.addEventListener("click",()=>{e.open=!1},{once:!0})}function t(){Zl(),m.resize.observer=new ResizeObserver(sh),m.resize.observer.observe(m.self),Po(),P.resize.observer=new ResizeObserver(nh),P.resize.observer.observe(P.container)}document.readyState!="complete"?window.addEventListener("load",t,{once:!0}):t(),dc(),gt.setWatchdog(Fr)}Promise.allSettled([customElements.whenDefined("sl-dropdown"),customElements.whenDefined("sl-button"),customElements.whenDefined("sl-button-group"),customElements.whenDefined("sl-icon"),customElements.whenDefined("sl-menu"),customElements.whenDefined("sl-menu-item")]).finally(ah);
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
