import{c as w,r as t,M as $,j as v,n as z,P as b,p as S,q as V,v as A}from"./index-Fy51RtrD.js";/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=w("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=w("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);class D extends t.Component{getSnapshotBeforeUpdate(l){const e=this.props.childRef.current;if(e&&l.isPresent&&!this.props.isPresent){const n=this.props.sizeRef.current;n.height=e.offsetHeight||0,n.width=e.offsetWidth||0,n.top=e.offsetTop,n.left=e.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function H({children:i,isPresent:l}){const e=t.useId(),n=t.useRef(null),x=t.useRef({width:0,height:0,top:0,left:0}),{nonce:a}=t.useContext($);return t.useInsertionEffect(()=>{const{width:u,height:o,top:h,left:s}=x.current;if(l||!n.current||!u||!o)return;n.current.dataset.motionPopId=e;const c=document.createElement("style");return a&&(c.nonce=a),document.head.appendChild(c),c.sheet&&c.sheet.insertRule(`
          [data-motion-pop-id="${e}"] {
            position: absolute !important;
            width: ${u}px !important;
            height: ${o}px !important;
            top: ${h}px !important;
            left: ${s}px !important;
          }
        `),()=>{document.head.removeChild(c)}},[l]),v.jsx(D,{isPresent:l,childRef:n,sizeRef:x,children:t.cloneElement(i,{ref:n})})}const K=({children:i,initial:l,isPresent:e,onExitComplete:n,custom:x,presenceAffectsLayout:a,mode:u})=>{const o=z(U),h=t.useId(),s=t.useCallback(f=>{o.set(f,!0);for(const C of o.values())if(!C)return;n&&n()},[o,n]),c=t.useMemo(()=>({id:h,initial:l,isPresent:e,custom:x,onExitComplete:s,register:f=>(o.set(f,!1),()=>o.delete(f))}),a?[Math.random(),s]:[e,s]);return t.useMemo(()=>{o.forEach((f,C)=>o.set(C,!1))},[e]),t.useEffect(()=>{!e&&!o.size&&n&&n()},[e]),u==="popLayout"&&(i=v.jsx(H,{isPresent:e,children:i})),v.jsx(b.Provider,{value:c,children:i})};function U(){return new Map}const g=i=>i.key||"";function j(i){const l=[];return t.Children.forEach(i,e=>{t.isValidElement(e)&&l.push(e)}),l}const F=({children:i,custom:l,initial:e=!0,onExitComplete:n,presenceAffectsLayout:x=!0,mode:a="sync",propagate:u=!1})=>{const[o,h]=S(u),s=t.useMemo(()=>j(i),[i]),c=u&&!o?[]:s.map(g),f=t.useRef(!0),C=t.useRef(s),y=z(()=>new Map),[I,L]=t.useState(s),[p,E]=t.useState(s);V(()=>{f.current=!1,C.current=s;for(let d=0;d<p.length;d++){const r=g(p[d]);c.includes(r)?y.delete(r):y.get(r)!==!0&&y.set(r,!1)}},[p,c.length,c.join("-")]);const k=[];if(s!==I){let d=[...s];for(let r=0;r<p.length;r++){const m=p[r],R=g(m);c.includes(R)||(d.splice(r,0,m),k.push(m))}a==="wait"&&k.length&&(d=k),E(j(d)),L(s);return}const{forceRender:M}=t.useContext(A);return v.jsx(v.Fragment,{children:p.map(d=>{const r=g(d),m=u&&!o?!1:s===p||c.includes(r),R=()=>{if(y.has(r))y.set(r,!0);else return;let P=!0;y.forEach(T=>{T||(P=!1)}),P&&(M?.(),E(C.current),u&&h?.(),n&&n())};return v.jsx(K,{isPresent:m,initial:!f.current||e?void 0:!1,custom:m?void 0:l,presenceAffectsLayout:x,mode:a,onExitComplete:m?void 0:R,children:d},r)})})};export{F as A,q as T,B as X};
