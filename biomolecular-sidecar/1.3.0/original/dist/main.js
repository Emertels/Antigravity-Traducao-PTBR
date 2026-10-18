var Ln=Object.defineProperty;var Nn=Object.getOwnPropertyDescriptor;var C=(o,t,e,n)=>{for(var i=n>1?void 0:n?Nn(t,e):t,r=o.length-1,s;r>=0;r--)(s=o[r])&&(i=(n?s(t,e,i):s(i))||i);return n&&i&&Ln(t,e,i),i};import{css as it,html as O,LitElement as ot,nothing as rt,render as ce}from"lit";var j=class o extends Event{constructor(e,n){super(o.TYPE,{bubbles:!0,composed:!0});this.errorMessage=e;this.details=n}errorMessage;details;static TYPE="viewer-error"},ue="dismiss-error";var Me=class extends ot{static properties={message:{type:String},details:{type:String}};constructor(){super(),this.message="An error occurred",this.details=""}static styles=it`
    :host {
      display: block;
      pointer-events: auto;
      padding: 16px;
      background: var(--canvas-error-bg, rgba(239, 68, 68, 0.15));
      color: var(--canvas-error-text, #fca5a5);
      border: 1px solid var(--canvas-error-border, rgba(239, 68, 68, 0.4));
      position: relative;
    }
    .title {
      font-weight: bold;
      padding-right: 24px;
    }
    .details {
      font-family: monospace;
      margin-top: 8px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    .close-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      color: var(--canvas-error-text, #fca5a5);
      font-size: 16px;
      cursor: pointer;
      opacity: 0.7;
    }
    .close-btn:hover {
      opacity: 1;
    }
  `;onDismiss(){this.dispatchEvent(new Event(ue,{bubbles:!0,composed:!0}))}render(){return O`
      <button type="button" class="close-btn" @click=${this.onDismiss} aria-label="Dismiss">✕</button>
      <div role="alert" aria-live="assertive">
        <div class="title">${this.message}</div>
        ${this.details?O`<div class="details">${this.details}</div>`:rt}
      </div>
    `}};customElements.get("sidecar-error")||customElements.define("sidecar-error",Me);function ee(o,t){let e=window.sidecar;if(typeof e?.fetch=="function")return e.fetch(o,t);if(typeof o=="string"||o instanceof URL){let n=new URL(o,window.location.href);if(n.origin===window.location.origin){let i=new URLSearchParams(window.location.search).get("token");return i&&n.searchParams.set("token",i),fetch(n.toString(),t)}}return fetch(o,t)}var $n="./api/events",st=1e3,In=3e4,Ae=window.location.href;function at(o){return typeof o=="object"&&o!==null&&!Array.isArray(o)}function lt(o,t){let e=null,n=!1;function i(a,c){let u=new URL(a,Ae);for(let[d,m]of Object.entries(c))u.searchParams.set(d,m);let p=t?.();return p&&u.searchParams.set("conversationId",p),u.href}async function r(){if(!n){n=!0;try{for(;e!=null;){let a=e;e=null;try{await o(a)}catch(c){console.error("[Sidecar UI] Error applying state update:",c)}}}finally{n=!1}}}let s=st;function l(){let a=new URLSearchParams(window.location.search).get("token"),c=new EventSource(i($n,a?{token:a}:{})),u=!1;c.onopen=()=>{s=st},c.onmessage=p=>{let d;try{d=JSON.parse(p.data)}catch(m){console.error("[Sidecar UI] Error parsing SSE state event:",m);return}at(d)&&typeof d.version=="number"&&at(d.state)&&(e={...d.state},r())},c.onerror=()=>{!u&&c.readyState===EventSource.CLOSED&&(u=!0,c.close(),console.warn(`[Sidecar UI] SSE connection lost, retrying in ${s}ms`),setTimeout(()=>{s=Math.min(s*2,In),l()},s))}}l()}async function ct(o){let t=await ee(new URL("./api/mutate",Ae).href,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(t&&!t.ok)throw new Error(`Failed to post state: HTTP ${t.status}`)}async function ut(o,t){let e=await ee(new URL("./api/notify",Ae).href,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t?{message:o,conversationId:t}:{message:o})});if(e&&!e.ok)throw new Error(`Failed to notify agent: HTTP ${e.status}`)}function dt(o,t,e){let n=document.createElement(o);return n.className=t,e!==void 0&&(n.textContent=e),n}function pt(o,t={}){let{canvasId:e="canvas",overlayId:n="ui-overlay",logPrefix:i="Sidecar"}=t,r=document.getElementById(e);if(!r)throw new Error(`Missing canvas container element (#${e}) in ui.html`);let s=r,l=s.querySelector(".canvas-placeholder"),a=dt("div","viewer-host");s.appendChild(a);let c=document.getElementById(n);if(!c)throw new Error(`Missing overlay container element (#${n}) in ui.html`);let u=c;function p(b,v=""){let x=document.createElement("sidecar-error");x.message=b,x.details=v,u.replaceChildren(x)}u.addEventListener(ue,b=>{b.target instanceof HTMLElement&&b.target.remove()}),s.addEventListener(j.TYPE,b=>{b instanceof j&&b.errorMessage&&p(b.errorMessage,b.details)});function d(b){return JSON.stringify(Object.keys(b).sort().map(v=>[v,b[v]]))}let m=null,h=null,g=null,f=window.location.href;async function w(b){let v=E.getConversationId(),x=v&&b.conversationId==null?{...b,conversationId:v}:b;await ct(x)}function S(b){ut(b,E.getConversationId()||void 0).catch(v=>{console.warn(`[${i}] Failed to notify agent:`,v)})}let E={getConversationId:()=>{let b=window.sidecar&&window.sidecar.conversationId||"";if(b)return b;let v=new URLSearchParams(window.location.search);return v.get("conversationId")||v.get("convId")||""},baseUrl:f,postState:w,notify:S};function T(){if(m)return Promise.resolve(m);if(h)return h;a.replaceChildren(),g=null;let b=o.factory(E);return h=b.init(a).then(()=>(m=b,b),v=>{let x=v instanceof Error?v.message:String(v);return console.error(`[${i}] Viewer init failed:`,v),p("Viewer initialisation failed",x),S(`${i}: viewer initialisation failed: ${x}`),null}).finally(()=>{h=null,l?.remove()}),h}async function y(b){let v=await T();if(!v)return;let x=v.getStateKey?.(b)??d(b);if(x===g)return;u.replaceChildren();let P;try{P=await v.reconcile(b,E)}catch(R){let I=R instanceof Error?R.message:String(R);console.error(`[${i}] Reconciliation error:`,R),p(I,R instanceof Error?R.stack:void 0),P={status:"failed",message:I}}P.status==="rendered"?g=x:(g=null,S(`${i}: ${P.message}`))}window.__sidecarReady=!0,T(),lt(y,E.getConversationId),console.log(`[${i}] Core controller initialised.`)}function mt(o,t,e=15e3){if(t())return Promise.resolve();let n=document.getElementById(o);return n instanceof HTMLScriptElement?new Promise((i,r)=>{let s=window.setTimeout(()=>{r(new Error(`Timed out after ${e}ms waiting for <script id="${o}">.`))},e);n.addEventListener("load",()=>{window.clearTimeout(s),i()},{once:!0}),n.addEventListener("error",()=>{window.clearTimeout(s),r(new Error(`Failed to load ${n.src||`<script id="${o}">`}.`))},{once:!0})}):Promise.reject(new Error(`Missing <script id="${o}"> in ui.html.`))}function ht(o){return(o.r&255)<<16|(o.g&255)<<8|o.b&255}var Hn=.4;function On(o){let t=e=>{let n=e/255;return n<=.03928?n/12.92:((n+.055)/1.055)**2.4};return .2126*t(o.r)+.7152*t(o.g)+.0722*t(o.b)}function de(){if(typeof document<"u"){let o=document.documentElement,t=pe(getComputedStyle(o).getPropertyValue("--background"));if(t)return On(t)<Hn;if(o.classList.contains("dark")||o.getAttribute("data-theme")==="dark")return!0;if(o.classList.contains("light")||o.getAttribute("data-theme")==="light")return!1}return typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)").matches:!1}function pe(o){if(!o)return null;let t=o.trim(),e=t.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);if(e)return{r:+`0x${e[1]}`,g:+`0x${e[2]}`,b:+`0x${e[3]}`,a:Math.round(+`0x${e[4]}`/255*100)/100};let n=t.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);if(n)return{r:+`0x${n[1]}`,g:+`0x${n[2]}`,b:+`0x${n[3]}`};let i=t.match(/^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i);if(i)return{r:+`0x${i[1]}${i[1]}`,g:+`0x${i[2]}${i[2]}`,b:+`0x${i[3]}${i[3]}`,a:Math.round(+`0x${i[4]}${i[4]}`/255*100)/100};let r=t.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);if(r)return{r:+`0x${r[1]}${r[1]}`,g:+`0x${r[2]}${r[2]}`,b:+`0x${r[3]}${r[3]}`};let s=t.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+(?:\.\d+)?|\.\d+))?\s*\)$/i);if(s){let l={r:Number(s[1]),g:Number(s[2]),b:Number(s[3])};return s[4]!==void 0&&(l.a=Number(s[4])),l}return Dn(t)}function Dn(o){if(typeof document>"u"||typeof CSS>"u"||!CSS.supports("color",o))return null;let t=document.createElement("canvas");t.width=1,t.height=1;let e=t.getContext("2d",{willReadFrequently:!0});if(!e)return null;e.fillStyle=o,e.fillRect(0,0,1,1);let[n,i,r,s]=e.getImageData(0,0,1,1).data;return{r:n,g:i,b:r,a:s/255}}function gt(o){o.toggleAttribute("data-follow-host",!0),o.dataset.theme=de()?"dark":"light"}var qn={r:16,g:16,b:16},Fn={r:250,g:250,b:250};function te(o=qn,t=Fn){if(typeof document<"u"){let e=getComputedStyle(document.documentElement),n=e.getPropertyValue("--background").trim()||e.getPropertyValue("--canvas-bg").trim()||e.getPropertyValue("--card").trim();if(n){let i=pe(n);if(i)return i}}return de()?o:t}function ft(o){let t=null,e=null,n=null,i=null,r=()=>{i===null&&(typeof requestAnimationFrame<"u"?i=requestAnimationFrame(()=>{i=null,o(de(),te())}):o(de(),te()))};return typeof window<"u"&&window.matchMedia&&(t=window.matchMedia("(prefers-color-scheme: dark)"),e=()=>r(),t.addEventListener("change",e)),typeof MutationObserver<"u"&&typeof document<"u"&&(n=new MutationObserver(()=>r()),n.observe(document.documentElement,{attributes:!0,attributeFilter:["class","data-theme","style"]})),()=>{i!==null&&typeof cancelAnimationFrame<"u"&&(cancelAnimationFrame(i),i=null),t&&e&&(t.removeEventListener("change",e),t=null,e=null),n&&(n.disconnect(),n=null)}}var Un=.95;function bt(o,t){let e=o[0]-t[0],n=o[1]-t[1],i=o[2]-t[2];return Math.sqrt(e*e+n*n+i*i)}function yt(o,t,e){if(!(t.radius>0)||!(e>0))return null;let n=t.radius+bt(o.target,t.center);return o.radius>=n*(1-.001)||bt(o.position,o.target)<e*Un?null:n}function wt(o){let t=o>>16&255,e=o>>8&255,n=o&255;return`#${t.toString(16).padStart(2,"0")}${e.toString(16).padStart(2,"0")}${n.toString(16).padStart(2,"0")}`}function ne(o){let t=new Map;for(let n of o){let i=n.color.toLowerCase(),r=t.get(i);r||(r=new Map,t.set(i,r));for(let s of n.residues){let l=(s.chain||"").toUpperCase(),a=[Math.min(s.start,s.end),Math.max(s.start,s.end)],c=r.get(l);c?c.push(a):r.set(l,[a])}}let e=[];for(let n of[...t.keys()].sort()){let i=t.get(n),r=[];for(let s of[...i.keys()].sort()){let l=i.get(s);l.sort((u,p)=>u[0]-p[0]||u[1]-p[1]);let[a,c]=l[0];for(let u=1;u<l.length;u++){let[p,d]=l[u];p<=c+1?c=Math.max(c,d):(r.push({chain:s||void 0,start:a,end:c}),a=p,c=d)}r.push({chain:s||void 0,start:a,end:c})}r.length>0&&e.push({residues:r,color:n})}return e}function ie(o){return ne(o.map(t=>({color:t.color,residues:t.residues.map(e=>({...e,chain:(e.chain||"A").toUpperCase()}))})))}function xt(o){let t=[];for(let e of o)for(let n of ie([e]))t=he(t,n);return t}function me(o,t){if(t.length===0||o.length===0)return ne(o);let e=new Map;for(let i of t){let r=(i.chain||"").toUpperCase(),s=[Math.min(i.start,i.end),Math.max(i.start,i.end)],l=e.get(r);l?l.push(s):e.set(r,[s])}let n=[];for(let i of o){let r=[];for(let s of i.residues){let l=(s.chain||"").toUpperCase(),a=e.get(l),c=[[Math.min(s.start,s.end),Math.max(s.start,s.end)]];if(a)for(let[u,p]of a){let d=[];for(let[m,h]of c)p<m||u>h?d.push([m,h]):(u>m&&d.push([m,u-1]),p<h&&d.push([p+1,h]));if(c=d,c.length===0)break}for(let[u,p]of c)r.push({chain:s.chain,start:u,end:p})}r.length>0&&n.push({color:i.color,residues:r})}return ne(n)}function he(o,t){return ne([...me(o,t.residues),t])}function vt(o,t){let e=[];for(let n of o){let i=(n.chain||"").toUpperCase(),r=Math.min(n.start,n.end),s=Math.max(n.start,n.end);for(let l of t){if((l.chain||"").toUpperCase()!==i)continue;let a=Math.max(r,Math.min(l.start,l.end)),c=Math.min(s,Math.max(l.start,l.end));a<=c&&e.push({chain:n.chain,start:a,end:c})}}return e}function St(o,t,e){let n=ne(o),i=[];for(let r of t){let s=r.color.toLowerCase();for(let l of n)l.color===s&&i.push(...vt(l.residues,r.residues))}if(i.length===0)return n;n=me(n,i);for(let r of e){let s=vt(r.residues,i);s.length>0&&(n=he(n,{color:r.color.toLowerCase(),residues:s}))}return n}var Rt=new Map([["water",["water","ion","ions","solvent","hoh"]],["carbohydrate",["carb","carbohydrate","sugar","branch","branched","snfg","glycan","saccharide"]],["ligand",["ligand","ligands","het","hetatm","non-standard"]],["sidechain",["sidechain","side-chain","side_chain"]]]);function Vn(o){return o.replace(/https?:\/\/[^\s]+/gi,"").replace(/\?[^\s]+/gi,"")}function kt(o){let t=o.key||"",e=o.cell?.obj?.label||"",n=o.cell?.transform?.params?.label||o.cell?.params?.values?.label||"",i=typeof o.cell?.obj?.description=="string"?Vn(o.cell.obj.description):"",r=o.cell?.obj?.data?.type?.name||"",s=Array.isArray(o.cell?.obj?.tags)?o.cell.obj.tags.join(" "):"";return`${t} ${e} ${n} ${i} ${r} ${s}`.toLowerCase()}function oe(o){let t=kt(o);for(let[e,n]of Rt.entries())if(n.some(i=>new RegExp(`\\b${i}\\b`,"i").test(t)))return e;return null}function Le(o){let t=oe(o);return t===null||t==="sidechain"}function Ct(o){return oe(o)===null}var Bn="carbohydrate",Et="carbohydrate-symbol";function Ne(o){return oe(o)==="carbohydrate"}async function Pt(o,t,e){if(!o)return!1;let n=o?.managers?.structure?.hierarchy?.current?.structures;if(!n||n.length===0)return!1;let r={water:"ball-and-stick",carbohydrate:Bn,ligand:"ball-and-stick",sidechain:"ball-and-stick"}[t]||"ball-and-stick",s=a=>oe(a)===t,l=async()=>{for(let a of n){let u=(a.components||[]).filter(p=>s(p));if(u.length>0)try{if(e){await o.managers.structure.hierarchy.toggleVisibility(u,"show");for(let p of u)(!p.representations||p.representations.length===0)&&await o.builders.structure.representation.addRepresentation(p.cell,{type:r})}else{await o.managers.structure.hierarchy.toggleVisibility(u,"hide");try{await o.managers.structure.component.removeRepresentations(u)}catch{}}}catch(p){console.warn(`[MolstarControls] Failed to toggle visibility for ${t}:`,p)}if(e){if(e&&u.length===0)try{let p=t;t==="carbohydrate"&&(p="carbohydrate");let d=await o.builders.structure.tryCreateComponentStatic(a.cell,p,t.charAt(0).toUpperCase()+t.slice(1));d?.cell&&await o.builders.structure.representation.addRepresentation(d.cell,{type:r})}catch(p){console.warn(`[MolstarControls] Failed to create component for ${t}:`,p)}}else{let d=[...a.representations||[],...a.genericRepresentations||[]].filter(m=>{let h=kt(m);return(Rt.get(t)||[]).some(f=>new RegExp(`\\b${f}\\b`,"i").test(h))});if(d.length>0)try{await o.managers.structure.hierarchy.toggleVisibility(d,"hide"),await o.managers.structure.component.removeRepresentations(d)}catch{}}}};try{return o.dataTransaction?await o.dataTransaction(l):await l(),!0}catch(a){return console.warn(`[MolstarControls] Error during component transaction for ${t}:`,a),!1}}function Tt(o){let t={water:!1,carbohydrate:!1,ligand:!1,sidechain:!1},e=o?.managers?.structure?.hierarchy?.current?.structures;if(!e||e.length===0)return t;for(let n of e){let i=[...n.components||[],...n.representations||[],...n.genericRepresentations||[]];for(let r of i){let s=oe(r);s&&(t[s]=!0)}}return t}function zn(o){let t=o?.ma_qa_metric_local,e=t?.metric_value,n=Number(t?._rowCount??0);if(!t||!e||typeof e.value!="function"||n<=0)return[];let i=null,r=o?.ma_qa_metric,s=Number(r?._rowCount??0);if(r&&s>0&&typeof r.id?.value=="function"){i=new Set;for(let c=0;c<s;c++){let u=Number(r.id.value(c)),p=String(r.type?.value?.(c)??"").toLowerCase(),d=String(r.name?.value?.(c)??"").toLowerCase(),m=String(r.mode?.value?.(c)??"").toLowerCase();(p.includes("plddt")||d.includes("plddt"))&&(!m||m==="local")&&i.add(u)}if(i.size===0)return[]}let l=t.metric_id,a=[];for(let c=0;c<n;c++){if(i&&typeof l?.value=="function"&&!i.has(Number(l.value(c))))continue;let u=Number(e.value(c));Number.isFinite(u)&&u>=0&&u<=100&&a.push(u)}return a}function jn(o){let t=o?.exptl,e=Number(t?._rowCount??0);if(!t||e<=0||typeof t.method?.value!="function")return!1;for(let n=0;n<e;n++){let i=String(t.method.value(n)??"").trim().toUpperCase();if(i&&!i.includes("THEORETICAL")&&!i.includes("PREDICT")&&!i.includes("MODEL"))return!0}return!1}function Kn(o){let t=o?.sourceData?.data?.db;if(jn(t))return[];let e=zn(t);if(e.length>0)return e;let n=o?.atomicHierarchy?.residueAtomSegments?.offsets,i=o?.atomicConformation?.B_iso_or_equiv,r=t?.atom_site?.group_PDB;if(!n||n.length<=1||!i||typeof i.value!="function")return[];let s=[],l=1/0,a=0,c=0,u=0;for(let d=0;d<n.length-1;d++){let m=n[d],h=n[d+1];if(r&&typeof r.value=="function"&&r.value(m)==="HETATM")continue;let g=Number(i.value(m));if(!(!Number.isFinite(g)||g<0)){if(h-m>1){c++;let f=!0;for(let w=m+1;w<h;w++)if(Number(i.value(w))!==g){f=!1;break}f&&u++}s.push(g),g<l&&(l=g),g>a&&(a=g)}}return c>0&&u/c>=.9&&a>l&&a>1&&a<=100?s:[]}function Wn(o){if(o.length===0)return null;let t=0,e=0,n=0,i=0,r=0;for(let l of o)t+=l,l>90?e++:l>=70?n++:l>=50?i++:r++;let s=o.length;return{globalPlddt:t/s,veryHighPct:e/s*100,confidentPct:n/s*100,lowPct:i/s*100,veryLowPct:r/s*100}}function Gn(o){let t=o?.managers?.structure?.hierarchy?.current?.structures,e=[];for(let n of t||[])for(let i of n.cell?.obj?.data?.models||[])e.push(...Kn(i));return e}async function _t(o,t){if(!o)return!1;try{let e=o.managers?.structure?.hierarchy?.current?.structures;if(!e||e.length===0)return!1;for(let n of e){let i=n.components||[],r=i.filter(Le),s=i.filter(Ne),l=i.filter(c=>!Le(c)&&!Ne(c)),a=r.length>0?r:i;await $e(o,a,t),await $e(o,l,"element-symbol"),await $e(o,s,Et)}return!0}catch(e){return console.warn(`[BiomolecularViewer] Error applying ${t} color:`,e),!1}}async function $e(o,t,e){if(t.length!==0)try{await o.managers.structure.component.updateRepresentationsTheme(t,{color:e})}catch(n){console.warn(`[BiomolecularViewer] updateRepresentationsTheme ${e} failed:`,n)}}var ge="plddt-confidence",fe=class{constructor(t){this.host=t}host;legendVisible=!1;metrics=void 0;get plugin(){return this.host.getViewer()?.plugin}invalidate(){this.metrics=void 0}getMetrics(){return this.metrics===void 0&&(this.metrics=Wn(Gn(this.plugin))),this.metrics}hasConfidence(){return this.getMetrics()!==null}shouldColorByConfidence(){return this.hasConfidence()&&this.legendVisible}resolveForLoadedStructure(){return this.legendVisible=this.shouldColorByConfidence(),this.legendVisible}setGlobalTheme(t){let e=this.host.getViewer();e?.initParams&&(e.initParams.alphafoldView=t);let n=e?.plugin?.config?.items;if(n)for(let i of n.values())i&&typeof i=="object"&&i.theme&&"globalName"in i.theme&&(i.theme.globalName=t?ge:void 0)}applyColoring(){return this.shouldColorByConfidence()?this.applyConfidenceColor():this.applyDefaultColor()}applyConfidenceColor(){return this.setGlobalTheme(!0),_t(this.plugin,ge)}applyDefaultColor(){return this.setGlobalTheme(!1),_t(this.plugin,"default")}ensureControls(){this.updateLegend()}async toggleLegend(){await this.setLegendVisible(!this.legendVisible)}async setLegendVisible(t){this.legendVisible=t,this.updateLegend(),await this.host.onLegendToggled()}updateLegend(){let t=this.host.getPanel();if(!t)return;this.host.mountControls();let e=this.host.isMounted()&&this.hasConfidence();t.plddtAvailable=e,t.plddtMetrics=e?this.getMetrics():null,t.plddtColoring=this.legendVisible}};function be(o){if(!o)return null;let t=o.start_residue_number??o.residue_number;if(t!=null&&t!==""){let s=Number(t),l=o.end_residue_number??t,a=Number(l);if(!isNaN(s)&&!isNaN(a))return{start:s,end:a}}if(!o.region)return{start:1,end:1};let e=o.region.replace(/\(Atom.*?\)/gi,"").trim(),n=e.match(/(\d+)\s*$/);if(n){let s=Number(n[1]);return{start:s,end:s}}let i=e.match(/\d+/g);if(!i||i.length===0)return{start:1,end:1};let r=Number(i[i.length-1]);return{start:r,end:r}}var K="#ff4fa8";var Jn=/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;function L(o){return typeof o=="object"&&o!==null&&!Array.isArray(o)}function N(o){if(typeof o!="string")return;let t=o.trim().toLowerCase();if(Jn.test(t))return t.length===4?`#${t[1]}${t[1]}${t[2]}${t[2]}${t[3]}${t[3]}`:t}function Mt(o){return(typeof o=="string"?o.trim().toUpperCase():"")||void 0}function At(o,t){return{chain:o,start:t.start,end:t.end,...t.startName?{startName:t.startName}:{},...t.endName?{endName:t.endName}:{}}}function _(o){let t=new Map;for(let n of o){if(!L(n))continue;let i=Math.trunc(Number(n.start)),r=Math.trunc(Number(n.end??n.start));if(!Number.isFinite(i)||!Number.isFinite(r))continue;let s=n.chain,l=(typeof s=="string"&&s.trim()?s.trim():"A").toUpperCase(),a=Mt(n.startName),c=Mt(n.endName);i>r&&([a,c]=[c,a]);let u={start:Math.min(i,r),end:Math.max(i,r),startName:a,endName:c},p=t.get(l);p?p.push(u):t.set(l,[u])}let e=[];for(let n of[...t.keys()].sort()){let i=t.get(n);i.sort((s,l)=>s.start-l.start||s.end-l.end);let r={...i[0]};for(let s=1;s<i.length;s++){let l=i[s];l.start<=r.end+1?(l.start===r.start&&!r.startName&&(r.startName=l.startName),l.end>r.end?(r.end=l.end,r.endName=l.endName):l.end===r.end&&(r.endName||(r.endName=l.endName))):(e.push(At(n,r)),r={...l})}e.push(At(n,r))}return e}function qt(o,t,e){let{startName:n,endName:i,...r}=o;return{...r,start:t,end:e,...n&&t===o.start?{startName:n}:{},...i&&e===o.end?{endName:i}:{}}}function $(o){return(o.chain||"A").toUpperCase()}function Lt(o){let t=o.auth_asym_id;return(typeof t=="string"?t.trim().toUpperCase():"")||void 0}function Yn(o){if(!L(o))return null;let t=o.startResidue;if(!L(t))return null;let e=L(o.endResidue)?o.endResidue:t,n=Lt(t),i=Lt(e);return n&&i&&n!==i?null:{chain:n??i,start:t.auth_seq_id,end:e.auth_seq_id,startName:t.auth_comp_id,endName:e.auth_comp_id}}function Xn(o){let t=[];for(let e of o){let n=Yn(e);n&&t.push(n)}return _(t)}function Zn(o,t){let e=$(o),n=(i,r)=>{let s=t?.(e,i)??r;return{auth_seq_id:i,...s?{auth_comp_id:s}:{},auth_asym_id:e}};return{startResidue:n(o.start,o.startName),endResidue:n(o.end,o.endName)}}function He(o,t){return o.map(e=>Zn(e,t))}function q(o){if(!Array.isArray(o))return[];let t=new Set;for(let e of o){if(typeof e!="string")continue;let n=e.trim().toUpperCase();n&&t.add(n)}return[...t].sort()}function ye(o){let t=new Set(o.residues.map($));return q(o.chains).filter(e=>!t.has(e))}function Nt(o,t){return JSON.stringify(_(o).filter(e=>e.chain===t).map(e=>[e.start,e.end]))}function Qn(o,t,e){return q(o).filter(n=>Nt(t,n)===Nt(e,n))}function F(o){return o.length>0?{chains:[...o]}:{}}function re(o){let t=_(o.residues),e=q(o.chains),n=new Set(e),i=[],r=new Map;for(let s of t){let l=$(s);if(!n.has(l)){i.push({ranges:[s]});continue}let a=r.get(l);if(a)a.ranges.push(s);else{let c={chain:l,ranges:[s]};r.set(l,c),i.push(c)}}for(let s of e)r.has(s)||i.push({chain:s,ranges:[]});return i}function ve(o,t=zt){return o.chain?`Chain ${o.chain}`:t(o.ranges[0])}function Ft(o,t){let e=Ot(o),n=[];for(let i of new Set(_(o).map($))){let r=t(i);if(!r||r.length===0)continue;let s=Ot(r);s.size>0&&[...s].every(l=>e.has(l))&&n.push(i)}return n.sort()}function Ut(o){return o.some(t=>ye(t).length>0)}function Vt(o,t){let e=!1,n=[];for(let i of o){let r=new Map;for(let u of ye(i)){let p=t(u);p&&r.set(u,p)}if(r.size===0){n.push(i);continue}e=!0;let s=_([...r].flatMap(([u,p])=>p.map(d=>({...d,chain:u})))),l=new Set(s.map($)),a=q(i.chains).filter(u=>!r.has(u)||l.has(u)),c=_([...i.residues,...s]);c.length===0&&a.length===0||n.push({id:i.id,...i.label?{label:i.label}:{},...i.color?{color:i.color}:{},residues:c,...F(a)})}return e?n:o}function Oe(o,t=1){let e=Math.max(1,t);for(let i of o){let r=/^s(\d+)$/.exec(i);r&&(e=Math.max(e,Number(r[1])+1))}let n=`s${e}`;return o.add(n),n}function Ie(o){let t=/^s(\d+)$/.exec(o);return t?Number(t[1]):0}function De(o,t){let e=_(t)[0];if(!e)return K;for(let n=o.length-1;n>=0;n--){let i=o[n];if(i.label)continue;let r=N(i.color);if(!r)continue;if(_(i.residues).some(l=>l.chain===e.chain&&l.start<=e.start&&e.start<=l.end))return r}return K}function ei(o,t=1){if(!L(o))return[];let e=[];for(let[n,i]of Object.entries(o)){if(!L(i))continue;let r=Array.isArray(i.residues)?i.residues:[];e.push({...i,id:n,residues:Xn(r)})}return Bt(e,t)}function Bt(o,t){let e=[];for(let r of o){if(!L(r))continue;let s=_(Array.isArray(r.residues)?r.residues:[]),l=q(r.chains);if(s.length===0&&l.length===0)continue;let a=typeof r.label=="string"?r.label.trim():"",c=N(r.color);if(!a&&!c)continue;let u=r.id,p=typeof u=="string"?u.trim():"";e.push({...p?{id:p}:{},...a?{label:a}:{},...c?{color:c}:{},residues:s,...F(l)})}for(let r of e)r.label&&!r.color&&(r.color=De(e,r.residues));let n=new Set,i=e.map(r=>r.id&&!n.has(r.id)?(n.add(r.id),!0):!1);return e.map((r,s)=>({id:i[s]?r.id:Oe(n,t),...r.label?{label:r.label}:{},...r.color?{color:r.color}:{},residues:r.residues,...F(r.chains??[])}))}function X(o){let t=o.ranges;return Array.isArray(t)?_(t):[]}function we(o){return o.color??K}function zt(o){let t=o.chain||"A";return o.start===o.end?`${t} ${o.start}`:`${t} ${o.start}\u2013${o.end}`}function jt(o,t=1){if(o.length===0)return"";let e=o.slice(0,Math.max(1,t)).map(zt),n=o.length-e.length;return n>0?`${e.join(", ")} +${n} more`:e.join(", ")}function D(o){return!!o.label}function qe(o){return o.filter(D)}function Kt(o){return o.filter(t=>!D(t))}function xe(o,t=1){let e=new Set;for(let n of o)typeof n.id=="string"&&e.add(n.id);return Oe(e,t)}var ti=["style","components","selections","annotations","confidence"],Se={waters:!1,sugars:!1,ligands:!0,sidechains:!1};function V(o){let t=l=>{let a=o[l];return typeof a=="string"?a.trim():""},e=t("id"),n=t("path"),i=t("filename"),r=o.source,s=typeof r=="string"?r.toLowerCase():"";return s||(s=t("url")?"url":i?"artifact":"workspace"),s==="workspace"?n||i||e:s==="artifact"?i||n||e:(e||t("uniprot_id")||n||i).toUpperCase()}function se(o,t){if(!L(t))return t;let e=L(o)?{...o}:{};for(let[n,i]of Object.entries(t))i===null?delete e[n]:e[n]=se(e[n],i);return e}function Wt(o,t){let e=o.structures,n=L(e)?e[t]:void 0;return L(n)?n:null}function Re(o,t=V(o)){return Wt(o,t)??{}}function ni(o){return L(o)?Object.keys(o).reduce((t,e)=>Math.max(t,Ie(e)),0):0}function Fe(o,t=V(o)){let e=o.nextSelectionId,n=typeof e=="number"&&Number.isInteger(e)&&e>0?e:1,i=o.structures;if(L(i))for(let[r,s]of Object.entries(i))r===t||!L(s)||(n=Math.max(n,ni(s.selections)+1));return n}function Ue(o,t=V(o)){return ei(Re(o,t).selections,Fe(o,t))}function ii(o){let t=Se;return Object.entries(o).every(([e,n])=>{switch(e){case"selections":return!L(n)||Object.keys(n).length===0;case"style":return n==="cartoon";case"components":return L(n)&&Object.entries(n).every(([i,r])=>i in t&&t[i]===r);case"annotations":return n===!1;case"confidence":return n===!0;default:return!1}})}function Gt(o){return o===null?!1:L(o)?Object.values(o).some(Gt):!0}function Jt(o,t,e=V(o)){let n={},i={};for(let[l,a]of Object.entries(t))ti.includes(l)?i[l]=a:n[l]=a;let r=Wt(o,e),s=se(r??{},i);return ii(s)?r?n.structures={[e]:null}:Gt(i)&&(n.structures={[e]:i}):r?Object.keys(i).length>0&&(n.structures={[e]:i}):n.structures={[e]:s},n}function Yt(o,t){let e=se(o,t);return V(e)===V(o)?{...t}:{...t,activeSelection:null}}function $t(o,t){return{...o.label?{label:o.label}:{},...o.color?{color:o.color}:{},residues:He(o.residues,t),...F(o.chains??[])}}function Xt(o,t=[],e=1,n){let i=new Map;for(let a of t)i.set(a.id,$t(a,n));let r={},s=Math.max(1,e);for(let a of o){s=Math.max(s,Ie(a.id)+1);let c=$t(a,n),u=i.get(a.id);JSON.stringify(u)!==JSON.stringify(c)&&(u?.chains&&!c.chains&&(c.chains=null),r[a.id]=c)}let l=new Set(o.map(a=>a.id));for(let a of t)s=Math.max(s,Ie(a.id)+1),l.has(a.id)||(r[a.id]=null);return{selections:r,...s>e?{nextSelectionId:s}:{}}}function Ve(o,t,e,n=1){let i=a=>t==="labelled"===D(a),r=new Map;for(let a of e)r.has(a.id)||r.set(a.id,a);let s=new Set,l=[];for(let a of o){if(!i(a)){l.push(a);continue}let c=r.get(a.id);c&&!s.has(a.id)&&(l.push(c),s.add(a.id))}for(let a of e)s.has(a.id)||(l.push(a),s.add(a.id));return Bt(l,n)}function ke(o){return Kt(o).filter(t=>t.color).map(t=>({color:t.color,residues:t.residues.map(e=>({...e}))}))}function It(o,t){return JSON.stringify([o,t.map(e=>[$(e),e.start,e.end])])}function Zt(o,t,e=1){let n=new Map;for(let s of Kt(t)){if(!s.color)continue;let l=It(s.color,_(s.residues)),a=n.get(l);a?a.push(s):n.set(l,[s])}let i=new Set(t.map(s=>s.id)),r=[];for(let s of o){let l=N(s.color),a=_(s.residues);if(!l||a.length===0)continue;let c=n.get(It(l,a))?.shift(),u=c?.id??Oe(i,e);r.push({id:u,color:l,residues:c?c.residues.map(p=>({...p})):a,...F(c?.chains??[])})}return r}function Ce(o,t){return`${(o||"A").toUpperCase()}:${t}`}function Ht(o){let t=new Map;for(let e of o){let n=N(e.color);if(n)for(let i of _(e.residues))for(let r=i.start;r<=i.end;r++)t.set(Ce(i.chain,r),n)}return t}function oi(o,t){let e=[];for(let n of _(o)){let i=null;for(let r=n.start;r<=n.end+1;r++){let s=r<=n.end&&!t.has(Ce(n.chain,r));s&&i===null&&(i=r),!s&&i!==null&&(e.push(qt(n,i,r-1)),i=null)}}return e}function Qt(o,t,e){let n=Ht(t),i=Ht(e),r=new Set,s=new Map,l=o.map(c=>{if(!D(c))return c;let u;for(let p of _(c.residues))for(let d=p.start;d<=p.end;d++){let m=Ce(p.chain,d),h=i.get(m);h===void 0||h===n.get(m)||(r.add(m),u=h)}return!u||u===c.color?c:(s.set(c.id,u),{...c,color:u})});if(r.size===0)return{selections:l,highlights:[...e],recolored:s};let a=[];for(let c of e){let u=oi(c.residues,r);u.length>0&&a.push({...c,residues:u})}return{selections:l,highlights:a,recolored:s}}function Ot(o){let t=new Set;for(let e of _(o))for(let n=e.start;n<=e.end;n++)t.add(Ce(e.chain,n));return t}function en(o,t,e,n=1,i=[]){let r=N(e),s=_(t),l=q(i);if(!r||s.length===0&&l.length===0)return{selections:[...o]};let a=xe(o,n);return{selections:[...o,{id:a,color:r,residues:s,...F(l)}],id:a}}function Dt(o,t){let e=n=>JSON.stringify(_(n).map(i=>[(i.chain||"A").toUpperCase(),i.start,i.end]));return e(o)===e(t)}function tn(o,t,e,n,i=1,r){let s=_(t),l=N(n),a=q(r),c=JSON.stringify(ye({residues:s,chains:a})),u=(f,w)=>f.filter(S=>!w.includes($(S))),p=f=>{if(!D(f))return!1;if(Dt(f.residues,s)&&JSON.stringify(ye(f))===c)return!0;let w=q(f.chains);return a.length>0&&JSON.stringify(w)===JSON.stringify(a)&&Dt(u(f.residues,w),u(s,a))},d;for(let f=o.length-1;f>=0;f--)if(p(o[f])){d=o[f];break}let m=q(r??d?.chains),h={id:d?.id??xe(o,i),label:e,color:l??d?.color??De(o,s),residues:_([...s,...(d?.residues??[]).filter(f=>m.includes($(f)))]),...F(m)};return{selections:d?o.map(f=>f.id===d.id?h:f):[...o,h],entry:h,...d?{previous:d}:{}}}function nn(o,t,e,n,i){let r=o.find(a=>a.id===t&&D(a)),s=_(e);if(!r||s.length===0)return null;let l={id:t,label:n,color:N(i)??r.color??De(o,s),residues:s,...F(Qn(r.chains,r.residues,s))};return o.map(a=>a.id===t?l:a)}function ri(o,t=1){let e=re(o);if(e.length===0)return"";let n=e.slice(0,Math.max(1,t)).map(r=>ve(r)),i=e.length-n.length;return i>0?`${n.join(", ")} +${i} more`:n.join(", ")}function Be(o){let t=o.residues[0],e=t.chain||"A";return{id:o.id,note:o.label??"",region:ri(o),chain_id:e,residue_number:t.start,end_residue_number:t.end,ranges:o.residues.map(n=>({...n})),...F(o.chains??[]),...o.color?{color:o.color}:{}}}function Ee(o){return qe(o).filter(t=>t.residues.length>0).map(Be)}function on(o,t){let e=o,n=e.note;if(typeof n!="string"||!n.trim())return null;let i=X(o);if(i.length===0)return null;let r=N(e.color);return{id:t,label:n.trim(),...r?{color:r}:{},residues:i,...F(q(e.chains))}}function si(o,t){let e=[];for(let n of o)for(let i of t){if($(n)!==$(i))continue;let r=Math.max(n.start,i.start),s=Math.min(n.end,i.end);r<=s&&e.push(qt(n,r,s))}return e}function ze(o,t){let e=[];for(let n of o){let i=D(n);if(i&&!t.labelled)continue;let r=!i&&t.touching?si(n.residues,t.touching):n.residues.map(s=>({...s}));r.length!==0&&e.push({id:n.id,color:we(n),residues:r,labelled:i})}return e}function rn(o,t){let e=N(o);if(!e)return o;let n=1-Math.min(1,Math.max(0,t)),i=r=>Math.round(parseInt(e.slice(r,r+2),16)*n).toString(16).padStart(2,"0");return`#${i(1)}${i(3)}${i(5)}`}var je=/^([A-Za-z0-9_]+)\s*\|/;function ae(o){return N(o.color)??K}function ai(o,t,e){let n=be(o);if(!n)return null;let i=o.region?o.region.match(je)?.[1]:null,r=o.chain_id||o.chain||i;return{auth_asym_id:r?String(r).toUpperCase():"A",start_auth_residue_number:n.start,end_auth_residue_number:n.end,color:t,focus:e}}function We(o,t,e){if(Array.isArray(o.ranges)&&o.ranges.length>0)return X(o).map(i=>({auth_asym_id:i.chain||"A",start_auth_residue_number:i.start,end_auth_residue_number:i.end,color:t,focus:e}));let n=ai(o,t,e);return n?[n]:[]}function Ge(o,t,e,n){let i=o?.residues,r=o?.atoms,s=n(i?.auth_comp_id,t)||n(r?.auth_comp_id,e)||n(i?.label_comp_id,t)||n(r?.label_comp_id,e)||n(i?.comp_id,t)||"";return String(s).trim().toUpperCase()}function li(o){if(!o)return null;if(o.indices===void 0||o.indices===null)return typeof o.index=="number"?o.index:null;if(typeof o.indices=="number"){if(Number.isInteger(o.indices))return o.indices;{let t=new ArrayBuffer(8),e=new Float64Array(t),n=new Uint32Array(t);return e[0]=o.indices,n[0]}}if(typeof o.indices=="object"){if(typeof o.indices.start=="number")return o.indices.start;if(typeof o.indices.min=="number")return o.indices.min;if(typeof o.indices.get=="function")return o.indices.get(0);if(Array.isArray(o.indices)&&o.indices.length>0)return o.indices[0];if(o.indices.elements&&typeof o.indices.elements.get=="function")return o.indices.elements.get(0)}return null}function an(o){if(!o)return null;let t=null;if(o.elements&&o.elements.length>0)t=o.elements[0];else if(o.a&&o.a.unit)t=o.a;else if(o.bonds&&o.bonds.length>0){let e=o.bonds[0];e.a&&e.a.unit?t=e.a:e.u1&&e.u2&&(t={unit:e.u1,indices:e.index1})}if(!t)return null;try{let e=t.unit;if(!e)return null;let n=li(t);if(n!==null&&e.model&&e.model.atomicHierarchy){let i=e.model.atomicHierarchy,r=n;e.elements&&(r=typeof e.elements[n]=="number"?e.elements[n]:typeof e.elements.get=="function"?e.elements.get(n):n);let s=r;i.residueAtomSegments&&typeof i.residueAtomSegments.index=="function"?s=i.residueAtomSegments.index(r):i.residueAtomSegments&&i.residueAtomSegments.index&&typeof i.residueAtomSegments.index[r]=="number"&&(s=i.residueAtomSegments.index[r]);let l=i.residues,a=i.chains,c=(m,h)=>m&&typeof m.value=="function"?m.value(h):m?m[h]:null,u=c(l?.auth_seq_id,s),p=Ge(i,s,r,c),d="";if(i.chainAtomSegments)try{let m=-1,h=i.chainAtomSegments.index;if(typeof h=="function"?m=h(r):h&&typeof h[r]=="number"?m=h[r]:h&&typeof h.get=="function"&&(m=h.get(r)),m<0&&i.chainAtomSegments.offsets){let g=i.chainAtomSegments.offsets,f=typeof g.length=="number"?g.length:typeof g.count=="number"?g.count:0,w=0,S=f-2;for(;w<=S;){let E=w+S>>>1,T=typeof g.get=="function"?g.get(E+1):g[E+1],y=typeof g.get=="function"?g.get(E):g[E];if(r>=T)w=E+1;else if(r<y)S=E-1;else{w=E;break}}m=w}m>=0&&(d=c(a?.auth_asym_id,m)||"")}catch{}if(d||(d=e.auth_asym_id||e.chainGroupId||"A"),u!=null&&u!=="")return{auth_seq_id:Number(u),...p?{auth_comp_id:p}:{},auth_asym_id:d}}}catch(e){console.warn("[BiomolecularViewer] Loci parse error:",e)}return null}async function Je(o,t,e){if(!t||!o)return;let n=null,i=null,r=typeof t=="object"?t.region||"":t,s=r.match(je)?.[1];if(typeof t=="object"&&(n=Number(t.residue_number||t.start_residue_number)||null,i=Number(t.end_residue_number||n)||null),!n&&r){let m=r.replace(je,"").replace(/\(Atom.*?\)/gi,"").trim().match(/\d+/g);m&&m.length>0&&(n=Number(m[0]),i=m.length>1?Number(m[1]):n)}if(!n){e&&e("Could not parse residue number from note.");return}i=i??n;let l=typeof t=="object"&&Array.isArray(t.ranges)&&t.ranges.length>0,a=l?jt(X(t),Number.POSITIVE_INFINITY):`${n}${i!==n?"\u2013"+i:""}`,c=o.visual;if(!c||typeof c.focus!="function"&&typeof c.highlight!="function"){e&&e("PDBe-Mol* camera API not available.");return}let u=typeof t=="object"&&(t.chain_id||t.chain)||s,p=l&&typeof t=="object"?We(t,ae(t),!0):[{auth_asym_id:u?String(u).toUpperCase():"A",start_auth_residue_number:n,end_auth_residue_number:i,color:typeof t=="object"?ae(t):{r:255,g:80,b:80},focus:!0}];if(p.length===0){e&&e("Could not resolve region for note.");return}e&&e(`Zooming to residues ${a}\u2026`);try{typeof c.focus=="function"&&await c.focus(p),typeof c.highlight=="function"&&await c.highlight({data:p}),e&&e(`Zoomed to residues ${a}.`)}catch(d){let m=d instanceof Error?d.message:String(d);e&&e(`Error zooming: ${m}`),console.warn("[BiomolecularViewer] Zoom error:",d)}}function ln(o,t,e,n){if(!o||!t||o.length<3||t.length<16)return null;let i=o[0],r=o[1],s=o[2],l=t[3]*i+t[7]*r+t[11]*s+t[15];if(l<=.01)return{sx:0,sy:0,visible:!1};let a=(t[0]*i+t[4]*r+t[8]*s+t[12])/l,c=(t[1]*i+t[5]*r+t[9]*s+t[13])/l,u=(t[2]*i+t[6]*r+t[10]*s+t[14])/l;if(u<-3||u>3)return{sx:0,sy:0,visible:!1};let p=(a*.5+.5)*e,d=(1-(c*.5+.5))*n,m=p>=-100&&p<=e+100&&d>=-100&&d<=n+100;return{sx:p,sy:d,visible:m}}function Ye(o,t,e,n){if(!o||o.length===0)return null;for(let i=o.length-1;i>=0;i--){let r=ci(o[i],t,e,n);if(r)return r}return null}function Xe(o,t){return`${(o||"A").toUpperCase()}:${t}`}function cn(o){let t=new Map,e=(i,r)=>i&&typeof i.value=="function"?i.value(r):i?i[r]:null,n=new Set;try{for(let i of o||[])for(let r of i?.units||[]){let s=r.model;if(!s||n.has(s))continue;n.add(s);let l=s.atomicHierarchy,a=l?.residues;if(!a)continue;let c=Number(a._rowCount??a.auth_seq_id?.rowCount??0),u=l.residueAtomSegments?.offsets,p=l.chainAtomSegments?.index;for(let d=0;d<c;d++){let m=u?Number(typeof u.get=="function"?u.get(d):u[d]):d,h=Ge(l,d,m,e);if(!h)continue;let g=p==null?0:typeof p=="function"?p(m):typeof p.get=="function"?p.get(m):p[m]??0,f=String(e(l.chains?.auth_asym_id,g)||""),w=Number(e(a.auth_seq_id,d));f&&Number.isFinite(w)&&t.set(Xe(f,w),h)}}}catch(i){console.warn("[BiomolecularViewer] Error reading residue names:",i)}return t}function ci(o,t,e,n){try{if(!o.units)return null;let i=(r,s)=>r&&typeof r.value=="function"?r.value(s):r?r[s]:null;for(let r of o.units){let s=ui(r,t,e,n,i);if(s)return s}}catch(i){console.warn("[BiomolecularViewer] Error in getResiduePositionFromUnits:",i)}return null}function ui(o,t,e,n,i){let r=o.model;if(!r)return null;let s=o.elements,l=o.conformation;if(!s||!l||s.length===0)return null;let a=r.atomicHierarchy;if(!a)return null;let c=a.residueAtomSegments,u=a.chainAtomSegments,p=a.residues,d=a.chains,m=a.atoms,h=y=>c?typeof c.index=="function"?c.index(y):c.index&&typeof c.index[y]=="number"?c.index[y]:c.index&&typeof c.index.get=="function"?c.index.get(y):y:y,g=(y,b)=>{if(a.residues&&a.residues.chainIndex&&typeof a.residues.chainIndex[b]=="number")return a.residues.chainIndex[b];if(u){if(typeof u.index=="function")return u.index(y);if(u.index&&typeof u.index[y]=="number")return u.index[y];if(u.index&&typeof u.index.get=="function")return u.index.get(y)}return 0},f=y=>{let b=r.atomicConformation,v=0,x=0,P=0;if(b){let I=b.x,k=b.y,Y=b.z;I&&k&&Y&&(v=typeof I=="function"?I(y):I[y]??0,x=typeof k=="function"?k(y):k[y]??0,P=typeof Y=="function"?Y(y):Y[y]??0)}let R=l?.operator?.matrix;if(R&&R.length===16){let I=R[0]*v+R[4]*x+R[8]*P+R[12],k=R[1]*v+R[5]*x+R[9]*P+R[13],Y=R[2]*v+R[6]*x+R[10]*P+R[14];return[I,k,Y]}return[v,x,P]},w=0,S=0,E=0,T=0;for(let y=0;y<s.length;y++){let b=s[y],v=h(b);if(v==null)continue;if(t!=null){let R=i(p?.auth_seq_id,v);if(!(R!=null&&(Number(R)===Number(t)||String(R)===String(t))))continue}if(e&&String(i(d?.auth_asym_id,g(b,v))||o.auth_asym_id||"").toUpperCase()!==e.toUpperCase())continue;if(n){let R=Ge(a,v,b,i);if(R&&R!==n.trim().toUpperCase())continue}let x=String(i(m?.label_atom_id,b)||i(m?.auth_atom_id,b)||"").trim().toUpperCase(),P=f(b);if(x==="CA")return P;w+=P[0],S+=P[1],E+=P[2],T++}return T>0?[w/T,S/T,E/T]:null}function di(o){if(typeof o=="number"){if(Number.isInteger(o))return[o];let n=new ArrayBuffer(8);new Float64Array(n)[0]=o;let[i,r]=new Int32Array(n),s=[];for(let l=i;l<r;l++)s.push(l);return s}let t=o;if(!t||typeof t.length!="number")return[];let e=[];for(let n=0;n<t.length;n++){let i=typeof t.get=="function"?t.get(n):t[n];typeof i=="number"&&e.push(i)}return e}function sn(o,t){let e=o?.index;if(!e)return null;let n=typeof e=="function"?e(t):typeof e.get=="function"?e.get(t):e[t];return typeof n=="number"?n:null}function Ke(o,{polymerOnly:t=!1}={}){let e=[],n=(i,r)=>i&&typeof i.value=="function"?i.value(r):i?i[r]:null;try{for(let i of o?.elements||[]){let r=i?.unit,s=r?.model?.atomicHierarchy;if(!s)continue;let l=new Set;for(let a of di(i.indices)){let c=r.elements,u=c?Number(typeof c.get=="function"?c.get(a):c[a]):a;if(!Number.isFinite(u))continue;let p=sn(s.residueAtomSegments,u);if(p===null||l.has(p))continue;l.add(p);let d=Number(n(s.residues?.auth_seq_id,p));if(!Number.isFinite(d))continue;let m=sn(s.chainAtomSegments,u)??0;if(t&&!pi(r.model,m))continue;let h=String(n(s.chains?.auth_asym_id,m)??"");e.push({chain:h||void 0,start:d,end:d})}}}catch(i){console.warn("[BiomolecularViewer] Error reading loci residues:",i)}return _(e)}function pi(o,t){let e=o?.atomicHierarchy?.index?.getEntityFromChain?.(t),n=typeof e=="number"?o?.entities?.data?.type?.value?.(e):void 0;return typeof n!="string"||n==="polymer"}function un(o,t){let e=i=>i.filter(r=>$(r)===t),n=e(Ke(o,{polymerOnly:!0}));return n.length>0?n:e(Ke(o))}function dn(o){let t=o?.managers?.structure?.selection?.entries;if(!t||typeof t.values!="function")return[];let e=[];for(let n of t.values())e.push(...Ke(n?.selection));return _(e)}import{css as mi,html as W,LitElement as hi,nothing as gi}from"lit";import{customElement as fi,property as pn,query as bi,state as mn}from"lit/decorators";import{repeat as yi}from"lit/directives/repeat";var vi="No selections yet",wi="No annotation";function Pe(o){return W`<span class="material-symbols-outlined"
      aria-hidden="true">${o}</span>`}function hn(o){o.stopPropagation()}var U=class extends hi{constructor(){super(...arguments);this.notes=[];this.annotationsVisible=!1;this.editing=null;this.editDraft="";this.refocusEdit=!1}willUpdate(e){if(this.editing!==null){if(e.has("notes")&&!this.notes.some(n=>n.id===this.editing)){this.editing=null;return}this.refocusEdit=this.editInput!==void 0&&this.shadowRoot?.activeElement===this.editInput}}updated(){let e=this.editInput;this.refocusEdit&&e&&this.shadowRoot?.activeElement!==e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length)),this.refocusEdit=!1}emit(e,n){this.dispatchEvent(new CustomEvent(e,{detail:n,bubbles:!0,composed:!0}))}async startEdit(e){this.editing=e.id,this.editDraft=e.text,await this.updateComplete,this.editInput?.focus(),this.editInput?.select()}commitEdit(){let e=this.editing;if(e===null)return;this.editing=null;let n=this.notes.findIndex(r=>r.id===e),i=this.editDraft.trim();n>=0&&i&&i!==this.notes[n].text&&this.emit("annotation-rename",{index:n,text:i})}cancelEdit(){this.editing=null}render(){let e=this.notes.length,n=this.notes.map((i,r)=>({note:i,index:r})).reverse();return W`
      <div class="bm-overlay-notes-items ${this.annotationsVisible?"":"dimmed"}">
        ${yi(n,({note:i})=>i.id,({note:i,index:r})=>this.renderNote(i,r))}
      </div>
      <div id="bm-notes-empty" class="bm-hint" ?hidden=${e>0}>
        ${vi}</div>
    `}renderNote(e,n){let i={index:n,residue:null},r=this.editing===e.id,s=e.text!=="",l=s?"Edit this annotation":"Add an annotation";return W`
      <div class="bm-overlay-note-item ${r?"editing":""}"
           style="--bm-note-color: ${e.color}"
           title=${r?"":"Click to zoom to these residues"}
           @click=${()=>{r||this.emit("annotation-zoom",i)}}
           @mouseenter=${()=>{this.emit("annotation-hover",i)}}
           @mouseleave=${()=>{this.emit("annotation-hover-end",null)}}>
        <div class="bm-note-header">
          ${r?this.renderEditField():W`
            <button class="bm-btn-edit-note" title=${l}
                    aria-label=${l}
                    @click=${a=>{a.stopPropagation(),this.startEdit(e)}}>${Pe("edit")}</button>
            <div class="bm-note-text ${s?"":"empty"}">${s?e.text:wi}</div>`}
          <div class="bm-note-actions">
            ${r?this.renderEditActions():gi}
            <button class="bm-btn-del"
                    title="Delete this selection"
                    aria-label="Delete this selection"
                    @click=${a=>{a.preventDefault(),a.stopPropagation(),this.emit("annotation-delete",{index:n})}}>${Pe("delete")}</button>
          </div>
        </div>
        <div class="bm-note-residues">
          ${e.residues.map((a,c)=>W`
            <button class="bm-note-residue" title="Zoom to ${a}"
                    @click=${u=>{u.stopPropagation(),this.emit("annotation-zoom",{index:n,residue:c})}}
                    @mouseenter=${()=>{this.emit("annotation-hover",{index:n,residue:c})}}
                    @mouseleave=${()=>{this.emit("annotation-hover",i)}}>${a}</button>`)}
        </div>
      </div>
    `}renderEditField(){let e=n=>{n.stopPropagation(),n.key==="Enter"?(n.preventDefault(),this.commitEdit()):n.key==="Escape"&&(n.preventDefault(),this.cancelEdit())};return W`
      <input class="bm-note-edit-input" type="text" spellcheck="true"
             aria-label="Annotation text" .value=${this.editDraft}
             @input=${n=>{this.editDraft=n.target.value}}
             @keydown=${e} @keyup=${hn} @keypress=${hn}>
    `}renderEditActions(){return W`
      <button class="bm-btn-save-note" title="Save (Enter)"
              aria-label="Save the annotation"
              @click=${e=>{e.stopPropagation(),this.commitEdit()}}>${Pe("check")}</button>
      <button class="bm-btn-cancel-note" title="Cancel (Escape)"
              aria-label="Cancel editing"
              @click=${e=>{e.stopPropagation(),this.cancelEdit()}}>${Pe("close")}</button>
    `}};U.styles=mi`
    :host {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    /*
     * Two independent selectors: the host when it carries [hidden], and any
     * shadow element that carries [hidden]. Each hides only itself. Needed
     * because our display rules would otherwise override the UA [hidden] rule.
     */
    :host([hidden]),
    [hidden] {
      display: none !important;
    }
    /* The Material Symbols class (the font itself is loaded by ui.html). */
    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }
    button,
    input {
      font: inherit;
      color: inherit;
      margin: 0;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--agys-accent);
      outline-offset: 2px;
    }
    .bm-hint {
      font-size: 11px;
      line-height: 1.4;
      color: var(--agys-ink-soft);
    }

    /* Hidden annotations: the list stays, dimmed. */
    .bm-overlay-notes-items.dimmed {
      opacity: 0.55;
    }
    /*
     * The note color shows as an inset bar and a light tint; text stays on
     * --agys-ink so it keeps AA contrast whatever color is picked.
     */
    .bm-overlay-note-item {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 3px;
      padding: 7px 9px;
      background: color-mix(
          in srgb, var(--bm-note-color, var(--bm-annot)) 12%, transparent);
      color: var(--agys-ink);
      border: none;
      border-radius: var(--agys-radius-md);
      cursor: pointer;
      transition: background-color 0.15s ease;
    }
    /* The note color strip, 3px. The pseudo-element covers the whole card
       (radius inherited) and a mask keeps only the left strip, so the strip
       is clipped by the card's 8px corners rather than overhanging them,
       with a straight inner edge. Same technique as the Citations cards. */
    .bm-overlay-note-item::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background-color: var(--bm-note-color, var(--bm-annot));
      -webkit-mask: linear-gradient(to right, #000 0 3px, transparent 3px);
      mask: linear-gradient(to right, #000 0 3px, transparent 3px);
      pointer-events: none;
    }
    .bm-overlay-note-item:hover,
    .bm-overlay-note-item.editing {
      background: color-mix(
          in srgb, var(--bm-note-color, var(--bm-annot)) 20%, transparent);
    }
    .bm-overlay-note-item.editing {
      cursor: default;
    }
    .bm-note-header {
      display: flex;
      align-items: center;
      gap: 4px;
      min-width: 0;
    }
    .bm-note-actions {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      gap: 4px;
      margin-left: auto;
    }
    .bm-note-text {
      flex: 1 1 auto;
      min-width: 0;
      font-weight: 600;
      overflow-wrap: anywhere;
    }
    .bm-note-text.empty {
      font-weight: normal;
      font-style: italic;
      color: var(--agys-ink-soft);
    }
    .bm-note-edit-input {
      flex: 1 1 auto;
      min-width: 0;
      height: 24px;
      box-sizing: border-box;
      padding: 0 8px;
      font-weight: 600;
      color: var(--agys-ink);
      background: var(--agys-paper);
      border: 1px solid transparent;
      border-radius: var(--agys-radius-sm);
      cursor: text;
    }
    .bm-note-edit-input:focus {
      border-color: var(--bm-accent-line);
    }
    .bm-note-residues {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .bm-note-residue {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      box-sizing: border-box;
      padding: 0 8px;
      font-family: var(--agys-font-mono);
      font-size: 11px;
      line-height: 1;
      white-space: nowrap;
      border: none;
      border-radius: 999px;
      background: var(--agys-sunken);
      color: var(--agys-ink);
      cursor: pointer;
      transition: background-color 0.15s ease;
    }
    .bm-note-residue:hover {
      background: var(--agys-hover);
    }
    .bm-note-residue:active {
      background: var(--agys-pressed);
    }
    .bm-btn-del,
    .bm-btn-edit-note,
    .bm-btn-save-note,
    .bm-btn-cancel-note {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      line-height: 1;
      background: transparent;
      color: var(--agys-ink-soft);
      border: none;
      border-radius: var(--agys-radius-sm);
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .bm-btn-del:hover,
    .bm-btn-edit-note:hover,
    .bm-btn-cancel-note:hover {
      background: var(--agys-hover);
      color: var(--agys-ink);
    }
    .bm-btn-del:active,
    .bm-btn-edit-note:active,
    .bm-btn-cancel-note:active {
      background: var(--agys-pressed);
    }
    .bm-btn-del:hover {
      color: var(--agys-bad);
    }
    .bm-btn-edit-note {
      color: var(--bm-note-color, var(--agys-ink-soft));
    }
    .bm-btn-edit-note:hover {
      color: var(--bm-note-color, var(--agys-ink));
    }
    .bm-btn-save-note {
      background: var(--agys-ink);
      color: var(--agys-paper);
      transition: opacity 0.15s ease;
    }
    .bm-btn-save-note:hover {
      opacity: 0.88;
    }
    .bm-btn-edit-note .material-symbols-outlined,
    .bm-btn-del .material-symbols-outlined,
    .bm-btn-save-note .material-symbols-outlined,
    .bm-btn-cancel-note .material-symbols-outlined {
      font-size: 15px;
    }
  `,C([pn({attribute:!1})],U.prototype,"notes",2),C([pn({type:Boolean})],U.prototype,"annotationsVisible",2),C([mn()],U.prototype,"editing",2),C([mn()],U.prototype,"editDraft",2),C([bi(".bm-note-edit-input")],U.prototype,"editInput",2),U=C([fi("bm-annotations-list")],U);import{css as xi,html as Z,LitElement as Si,nothing as gn}from"lit";import{customElement as Ri,state as Qe}from"lit/decorators";var Ze={red:"#ff1f3d",orange:"#ffc266",yellow:"#f2ff00",green:"#2ee693",cyan:"#00f0ff",blue:"#00a2ff",magenta:"#a200ff"};var le=[{name:"magenta",hex:Ze.magenta},...Object.entries(Ze).filter(([o])=>o!=="magenta").map(([o,t])=>({name:o,hex:t})),{name:"pink",hex:K}];function ki(o){return Z`<span class="material-symbols-outlined"
      aria-hidden="true">${o}</span>`}function fn(o){o.stopPropagation()}var B=class extends Si{constructor(){super(...arguments);this.color=le[0].hex;this.customOpen=!1;this.hexDraft=""}render(){return Z`
      ${this.renderSwatches()}
      ${this.customOpen?this.renderCustomRow():gn}
    `}renderSwatches(){let e=this.color.toLowerCase(),i=!le.some(r=>r.hex.toLowerCase()===e);return Z`
      <div class="bm-swatches" role="group" aria-label="Color">
        ${le.map(r=>{let s=r.hex.toLowerCase()===e;return Z`
          <button class="bm-swatch ${s?"marked":""}"
                  style="--bm-swatch: ${r.hex}"
                  data-color=${r.hex}
                  title=${r.name} aria-label="Color ${r.name}"
                  aria-pressed=${s?"true":"false"}
                  @click=${()=>{this.color=r.hex.toLowerCase(),this.customOpen=!1}}></button>`})}
        <label class="bm-swatch bm-swatch-custom ${i?"marked":""}"
               style=${i?`--bm-swatch: ${e}`:""}
               title="Custom color">${ki("colorize")}<input
            class="bm-custom-picker" type="color"
            aria-label="Custom color" .value=${e}
            @click=${()=>{this.customOpen=!0,this.hexDraft||(this.hexDraft=e)}}
            @input=${r=>{let s=r.target.value.toLowerCase();this.hexDraft=s,this.color=s}}></label>
      </div>
    `}renderCustomRow(){let e=this.hexDraft.trim(),n=N(e.startsWith("#")?e:`#${e}`),i=e!==""&&!n,r=s=>{s.stopPropagation(),s.key==="Enter"&&s.preventDefault()};return Z`
      <div class="bm-custom-row">
        <input class="bm-hex ${i?"invalid":""}" type="text"
               placeholder="#rrggbb" maxlength="7" spellcheck="false"
               autocomplete="off" title="Hex color, #rrggbb"
               aria-label="Custom color hex, #rrggbb"
               aria-invalid=${i?"true":"false"}
               .value=${this.hexDraft}
               @input=${s=>{this.hexDraft=s.target.value;let l=this.hexDraft.trim(),a=N(l.startsWith("#")?l:`#${l}`);a&&(this.color=a)}}
               @keydown=${r} @keyup=${fn}
               @keypress=${fn}>
      </div>
      ${i?Z`<div class="bm-hex-error" role="alert">
        Enter a color as #rrggbb</div>`:gn}
    `}};B.styles=xi`
    :host {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    :host([hidden]),
    [hidden] {
      display: none !important;
    }
    /* The Material Symbols class (the font itself is loaded by ui.html). */
    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }
    button,
    input {
      font: inherit;
      color: inherit;
      margin: 0;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--agys-accent);
      outline-offset: 2px;
    }

    /* Round swatches and the custom color button. 24px circles meet the
       WCAG 2.5.8 target size; selection is an outline ring (a shape
       change), so it never relies on hue. */
    .bm-swatches {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }
    .bm-swatch {
      position: relative;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      box-sizing: border-box;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: var(--bm-swatch, transparent);
      /* Neon swatches (yellow, green, cyan) are near-invisible on a light
         canvas (~1.1:1). The edge is the swatch's own hue pulled toward the
         ink color, which follows the host theme, so every swatch keeps a
         >= 3:1 boundary (WCAG 1.4.11) on light, dark and custom themes. */
      box-shadow: inset 0 0 0 1.5px
          color-mix(in oklab, var(--bm-swatch, transparent) 55%,
                    var(--agys-ink));
      cursor: pointer;
      transition: transform 0.1s ease;
    }
    .bm-swatch:hover {
      transform: scale(1.1);
    }
    .bm-swatch.marked {
      outline: 2px solid var(--agys-ink);
      outline-offset: 2px;
    }
    .bm-swatch-custom {
      position: relative;
      overflow: hidden;
      color: var(--agys-ink-soft);
      background: var(--bm-swatch, transparent);
    }
    .bm-swatch-custom:focus-within {
      outline: 2px solid var(--agys-accent);
      outline-offset: 2px;
    }
    .bm-swatch-custom .material-symbols-outlined {
      font-size: 15px;
      pointer-events: none;
    }
    .bm-swatch-custom.marked .material-symbols-outlined {
      color: #ffffff;
      mix-blend-mode: difference;
    }
    /* The native color input covers the eyedropper, invisible, so clicks
       reach it and the browser opens its picker next to the eyedropper. */
    .bm-custom-picker {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      padding: 0;
      border: none;
      opacity: 0;
      cursor: pointer;
    }

    .bm-custom-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .bm-hex {
      flex: 1 1 auto;
      min-width: 0;
      height: var(--agys-control-h);
      box-sizing: border-box;
      padding: 0 8px;
      font-family: var(--agys-font-mono);
      font-size: 12px;
      color: var(--agys-ink);
      background: var(--agys-sunken);
      border: 1px solid transparent;
      border-radius: var(--agys-radius-sm);
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }
    .bm-hex::placeholder {
      color: var(--agys-ink-faint);
      opacity: 1;
    }
    .bm-hex:focus {
      background: var(--agys-paper);
      border-color: var(--bm-accent-line);
    }
    .bm-hex.invalid {
      border-color: var(--agys-bad);
    }
    .bm-hex-error {
      color: var(--agys-bad);
      font-size: 11px;
    }
  `,C([Qe()],B.prototype,"color",2),C([Qe()],B.prototype,"customOpen",2),C([Qe()],B.prototype,"hexDraft",2),B=C([Ri("bm-color-picker")],B);import{css as Ci,html as Ei,LitElement as Pi}from"lit";import{customElement as Ti,property as _i,query as Mi,state as Ai}from"lit/decorators";function bn(o){o.stopPropagation()}var z=class extends Pi{constructor(){super(...arguments);this.hasSelection=!1;this.draft=""}emit(e,n){this.dispatchEvent(new CustomEvent(e,{detail:n,bubbles:!0,composed:!0}))}save(){if(!this.hasSelection)return;let e=this.picker?.color??le[0].hex;this.emit("selection-save",{hex:e,text:this.draft.trim()}),this.draft=""}render(){let e=n=>{n.stopPropagation(),n.key==="Enter"&&!n.shiftKey&&(n.preventDefault(),this.save())};return Ei`
      <div class="bm-field">
        <div id="bm-color-label" class="bm-field-label">Color</div>
        <bm-color-picker role="group" aria-labelledby="bm-color-label">
        </bm-color-picker>
      </div>
      <div class="bm-field">
        <label class="bm-field-label" for="bm-note-input">Annotation
          <span class="bm-optional">(optional)</span></label>
        <textarea id="bm-note-input" class="bm-note-input" rows="2"
                  placeholder="Enter annotation" spellcheck="true"
                  .value=${this.draft}
                  @input=${n=>{this.draft=n.target.value}}
                  @keydown=${e} @keyup=${bn}
                  @keypress=${bn}></textarea>
        <div class="bm-save-row">
          <button id="bm-selection-save" class="bm-save"
                  ?disabled=${!this.hasSelection}
                  @click=${()=>{this.save()}}>Save</button>
        </div>
      </div>
    `}};z.styles=Ci`
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    :host([hidden]),
    [hidden] {
      display: none !important;
    }
    button,
    textarea {
      font: inherit;
      color: inherit;
      margin: 0;
    }
    button:focus-visible,
    textarea:focus-visible {
      outline: 2px solid var(--agys-accent);
      outline-offset: 2px;
    }
    .bm-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .bm-field-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: var(--agys-ink-soft);
    }
    .bm-optional {
      font-weight: normal;
    }
    .bm-note-input {
      box-sizing: border-box;
      width: 100%;
      min-height: 56px;
      max-height: 160px;
      padding: 6px 8px;
      resize: vertical;
      font-family: var(--agys-font);
      font-size: 12px;
      line-height: 1.4;
      color: var(--agys-ink);
      background: var(--agys-sunken);
      border: 1px solid transparent;
      border-radius: var(--agys-radius-sm);
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }
    .bm-note-input::placeholder {
      color: var(--agys-ink-soft);
      opacity: 1;
    }
    .bm-note-input:focus {
      background: var(--agys-paper);
      border-color: var(--bm-accent-line);
    }
    .bm-save-row {
      display: flex;
      justify-content: flex-end;
      gap: 6px;
    }
    .bm-save {
      flex: 0 0 auto;
      height: var(--agys-control-h);
      padding: 0 14px;
      font-size: 12px;
      font-weight: 600;
      border: none;
      border-radius: var(--agys-radius-sm);
      color: var(--agys-paper);
      background: var(--agys-ink);
      cursor: pointer;
      transition: opacity 0.15s ease;
    }
    .bm-save:hover {
      opacity: 0.88;
    }
    .bm-save:disabled {
      /*
       * Faint ink so the disabled state reads as disabled: soft ink is too
       * close to primary ink. WCAG 1.4.3 exempts inactive controls.
       */
      color: var(--agys-ink-faint);
      background: var(--agys-sunken);
      opacity: 1;
      cursor: not-allowed;
    }
  `,C([_i({type:Boolean})],z.prototype,"hasSelection",2),C([Ai()],z.prototype,"draft",2),C([Mi("bm-color-picker")],z.prototype,"picker",2),z=C([Ti("bm-selection-editor")],z);import{css as Li,html as J,LitElement as Ni,nothing as $i}from"lit";import{customElement as Ii,property as yn}from"lit/decorators";var Hi=[{value:"residue",label:"Residue"},{value:"chain",label:"Chain"}],Oi="Select residues, use SHIFT click to select a range, CTRL / CMD click to add or remove",Di="Shift+click selects a range; Ctrl / Cmd+click adds or removes; Escape clears.";function qi(o){return J`<span class="material-symbols-outlined"
      aria-hidden="true">${o}</span>`}var G=class extends Ni{constructor(){super(...arguments);this.selection={ranges:[],items:[]};this.granularity="residue"}emit(e,n){this.dispatchEvent(new CustomEvent(e,{detail:n,bubbles:!0,composed:!0}))}render(){let e=this.selection.ranges.length===0;return J`
      <div class="bm-stack">
        <div class="bm-select-row">
          <span id="bm-select-label" class="bm-label">Select</span>
          <div class="bm-segmented" role="group"
               aria-labelledby="bm-select-label">
            ${Hi.map(n=>{let i=n.value===this.granularity;return J`
              <button class="bm-segment ${i?"active":""}"
                      data-granularity=${n.value}
                      aria-pressed=${i?"true":"false"}
                      title="Click to select a whole ${n.value}"
                      @click=${()=>{i||this.emit("granularity-change",{granularity:n.value})}}>${n.label}</button>`})}
          </div>
        </div>
        ${e?this.renderEmpty():this.renderList()}
        ${e?$i:J`<div id="bm-selection-hint" class="bm-hint">${Di}</div>`}
      </div>
    `}renderEmpty(){return J`<div id="bm-selection-empty" class="bm-selection-empty"
        role="status">${Oi}</div>`}renderList(){let{items:e}=this.selection;return J`
      <div class="bm-list-header">
        <span id="bm-selection-count" class="bm-selection-count">${e.length} selected</span>
        <button id="bm-selection-clear" class="bm-text-btn"
                title="Deselect everything"
                @click=${()=>{this.emit("selection-clear",null)}}>Clear</button>
      </div>
      <ul id="bm-selection-list" class="bm-selection-list"
          aria-label="Selected residues">
        ${e.map(n=>this.renderItem(n))}
      </ul>
    `}renderItem(e){let n=`Remove ${e.label} from selection`;return J`
      <li class="bm-selection-item">
        <span class="bm-selection-label" title=${e.label}>${e.label}</span>
        <button class="bm-selection-remove" title=${n}
                aria-label=${n}
                @click=${()=>{this.emit("selection-remove",{item:e})}}>${qi("close")}</button>
      </li>
    `}};G.styles=Li`
    :host {
      display: block;
    }
    :host([hidden]),
    [hidden] {
      display: none !important;
    }
    /* The Material Symbols class (the font itself is loaded by ui.html). */
    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }
    .bm-stack {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    button {
      font: inherit;
      color: inherit;
      margin: 0;
    }
    button:focus-visible {
      outline: 2px solid var(--agys-accent);
      outline-offset: 2px;
    }
    .bm-label,
    .bm-hint,
    .bm-selection-count,
    .bm-selection-empty {
      font-size: 11px;
      color: var(--agys-ink-soft);
    }
    .bm-label {
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .bm-selection-count {
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .bm-hint,
    .bm-selection-empty {
      line-height: 1.4;
    }
    .bm-selection-empty {
      overflow-wrap: anywhere;
    }

    /* Residue | Chain segmented control. */
    .bm-select-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .bm-segmented {
      display: inline-flex;
      gap: 4px;
      padding: var(--bm-seg-pad);
      background: var(--agys-sunken);
      border: none;
      border-radius: var(--agys-radius-md);
    }
    .bm-segment {
      height: calc(var(--agys-control-h) - var(--bm-seg-pad) * 2);
      padding: 0 10px;
      font-size: 11.5px;
      font-weight: 500;
      background: transparent;
      border: none;
      border-radius: var(--agys-radius-sm);
      color: var(--agys-ink-soft);
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .bm-segment:hover {
      color: var(--agys-ink);
      background: var(--agys-hover);
    }
    .bm-segment.active {
      font-weight: 600;
      color: var(--agys-ink);
      background: var(--agys-raised);
      box-shadow: var(--agys-lift-1),
          inset 0 0 0 1px var(--agys-card-edge);
    }

    /* "N selected", Clear and the list. */
    .bm-list-header {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .bm-text-btn {
      margin-left: auto;
      height: 24px;
      padding: 0 8px;
      font-size: 11.5px;
      font-weight: 500;
      background: transparent;
      border: none;
      border-radius: var(--agys-radius-sm);
      color: var(--agys-ink-soft);
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .bm-text-btn:hover {
      color: var(--agys-ink);
      background: var(--agys-hover);
    }
    .bm-text-btn:active {
      background: var(--agys-pressed);
    }
    /* Wrapping chips, as in the notes list; about six rows, then the
       list scrolls. */
    .bm-selection-list {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      gap: 4px;
      max-height: 136px;
      margin: 0;
      padding: 0;
      overflow-y: auto;
      list-style: none;
    }
    /* Kept in step with .bm-note-residue (bm-annotations-list.ts). */
    .bm-selection-item {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      max-width: 100%;
      min-height: 24px;
      box-sizing: border-box;
      padding: 0 2px 0 8px;
      border: none;
      border-radius: 999px;
      background: var(--agys-sunken);
      color: var(--agys-ink);
      transition: background-color 0.15s ease;
    }
    .bm-selection-item:hover,
    .bm-selection-item:focus-within {
      background: var(--agys-hover);
    }
    .bm-selection-label {
      min-width: 0;
      font-family: var(--agys-font-mono);
      font-size: 11px;
      line-height: 1.6;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .bm-selection-remove {
      display: inline-flex;
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0;
      background: transparent;
      border: none;
      border-radius: 999px;
      color: var(--agys-ink-soft);
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .bm-selection-remove:hover {
      color: var(--agys-ink);
      background: var(--agys-pressed);
    }
    .bm-selection-remove:focus-visible {
      outline-offset: 0;
    }
    .bm-selection-remove .material-symbols-outlined {
      font-size: 14px;
    }
  `,C([yn({attribute:!1})],G.prototype,"selection",2),C([yn()],G.prototype,"granularity",2),G=C([Ii("bm-selection-list")],G);import{css as Fi,html as M,LitElement as Ui,nothing as xn}from"lit";import{customElement as Vi,property as H,state as Sn}from"lit/decorators";var vn=["cartoon","stick","sphere","surface","line"],wn=[{rep:"cartoon",label:"Cartoon",title:"Cartoon (Helices & Sheets)"},{rep:"stick",label:"Stick",title:"Stick"},{rep:"sphere",label:"Sphere",title:"Sphere (van der Waals)"},{rep:"surface",label:"Surface",title:"Surface"},{rep:"line",label:"Line",title:"Line"}],Q=[{key:"waters",kind:"water",id:"bm-toggle-waters-btn",label:"Waters",title:"Toggle Waters / Solvent visibility",icon:"water_drop"},{key:"sugars",kind:"carbohydrate",id:"bm-toggle-sugars-btn",label:"Sugars",title:"Toggle Sugars / Carbohydrates visibility",icon:"cookie"},{key:"ligands",kind:"ligand",id:"bm-toggle-ligands-btn",label:"Ligands",title:"Toggle Ligands visibility",icon:"science"},{key:"sidechains",kind:"sidechain",id:"bm-toggle-sidechains-btn",label:"Sidechains",title:"Toggle Sidechain sticks visibility",icon:"hub"}];var Cn="bm-side-panel-collapsed",En="bm-side-panel-width",nt=300,Te=220,et=640,Bi=200,zi=16;function Pn(o,t=0){let e=et;return t>0&&(e=Math.min(e,t-Bi)),e=Math.max(e,Te),Number.isFinite(o)?Math.round(Math.min(Math.max(o,Te),e)):nt}function ji(){try{let o=window.localStorage?.getItem(En);if(o)return Pn(Number(o))}catch{}return nt}function Ki(o){try{window.localStorage?.setItem(En,String(o))}catch{}}function Rn(){try{let o=window.localStorage?.getItem(Cn),t=o?JSON.parse(o):[];if(Array.isArray(t))return new Set(t.filter(e=>typeof e=="string"))}catch{}return new Set}function Wi(o){try{window.localStorage?.setItem(Cn,JSON.stringify([...o].sort()))}catch{}}var Gi=[{key:"veryHighPct",id:"bm-plddt-pct-vhigh",label:"Very High",range:"(>90)",color:"var(--bm-plddt-vhigh)"},{key:"confidentPct",id:"bm-plddt-pct-conf",label:"Confident",range:"(70\u201390)",color:"var(--bm-plddt-conf)"},{key:"lowPct",id:"bm-plddt-pct-low",label:"Low",range:"(50\u201370)",color:"var(--bm-plddt-low)"},{key:"veryLowPct",id:"bm-plddt-pct-vlow",label:"Very Low",range:"(<50)",color:"var(--bm-plddt-vlow)"}];function tt(o,t=""){return M`<span class="material-symbols-outlined ${t}"
      aria-hidden="true">${o}</span>`}function kn(o,t,e,n,i=!1){let r=`${t?"Hide":"Show"} ${e}`;return M`<button id=${o} class="bm-eye-btn ${t?"":"off"}"
      aria-pressed=${t?"true":"false"}
      aria-label=${r} title=${r}
      ?hidden=${i} ?disabled=${i}
      @click=${s=>{s.stopPropagation(),n()}}>${tt(t?"visibility":"visibility_off")}</button>`}var A=class extends Ui{constructor(){super(...arguments);this.representation="cartoon";this.components={waters:!1,sugars:!1,ligands:!0,sidechains:!1};this.availableComponents=null;this.domains=[];this.plddtAvailable=!1;this.plddtMetrics=null;this.plddtColoring=!1;this.annotationsVisible=!1;this.notes=[];this.selection={ranges:[],items:[]};this.granularity="residue";this.width=ji();this.collapsed=Rn();this.dragging=!1;this.drag=null;this.onResizerPointerDown=e=>{if(e.button===0){e.preventDefault(),e.stopPropagation(),this.drag={pointerId:e.pointerId,startX:e.clientX,startWidth:this.width};try{e.currentTarget.setPointerCapture(e.pointerId)}catch{}this.setDragging(!0)}};this.onResizerPointerMove=e=>{let n=this.drag;!n||e.pointerId!==n.pointerId||this.setWidth(n.startWidth+(n.startX-e.clientX),!1)};this.onResizerPointerEnd=e=>{!this.drag||e.pointerId!==this.drag.pointerId||(this.drag=null,this.setDragging(!1),this.setWidth(this.width,!0))};this.onResizerKeyDown=e=>{let n=zi*(e.shiftKey?4:1),i=null;e.key==="ArrowLeft"&&(i=this.width+n),e.key==="ArrowRight"&&(i=this.width-n),e.key==="Home"&&(i=Te),e.key==="End"&&(i=et),i!==null&&(e.preventDefault(),e.stopPropagation(),this.setWidth(i,!0))};this.onResizerDoubleClick=e=>{e.stopPropagation(),this.setWidth(nt,!0)}}connectedCallback(){super.connectedCallback(),this.applyWidth()}disconnectedCallback(){super.disconnectedCallback(),this.drag=null,this.dragging=!1}willUpdate(e){e.has("width")&&this.applyWidth()}emit(e,n){this.dispatchEvent(new CustomEvent(e,{detail:n,bubbles:!0,composed:!0}))}applyWidth(){this.parentElement?.style.setProperty("--bm-side-panel-width",`${this.width}px`)}setWidth(e,n){let i=this.parentElement?.getBoundingClientRect().width??0;this.width=Pn(e,i),this.applyWidth(),n&&(Ki(this.width),this.emit("panel-resize",{width:this.width}))}isSectionExpanded(e){return!this.collapsed.has(e)}setSectionExpanded(e,n){let i=Rn();n?i.delete(e):i.add(e),Wi(i),this.collapsed=i}setDragging(e){this.dragging=e,this.parentElement?.classList.toggle("bm-resizing",e)}render(){return M`
      <div id="bm-side-panel-resizer"
           class="bm-side-panel-resizer ${this.dragging?"dragging":""}"
           role="separator"
           aria-orientation="vertical"
           aria-controls="bm-side-panel-content"
           aria-label="Resize the controls panel"
           aria-valuenow=${String(this.width)}
           aria-valuemin=${String(Te)}
           aria-valuemax=${String(et)}
           title="Drag to resize the panel; double-click to reset"
           tabindex="0"
           @pointerdown=${this.onResizerPointerDown}
           @pointermove=${this.onResizerPointerMove}
           @pointerup=${this.onResizerPointerEnd}
           @pointercancel=${this.onResizerPointerEnd}
           @dblclick=${this.onResizerDoubleClick}
           @keydown=${this.onResizerKeyDown}></div>
      <aside id="bm-side-panel-content" class="bm-side-panel"
             aria-label="Viewer controls">
        ${this.renderSection("bm-section-style",M`Representation`,this.renderRepresentation())}
        ${this.renderSection("bm-section-components",M`Components`,this.renderComponents())}
        ${this.renderConfidenceSection()}
        ${this.renderSection("bm-section-selection",M`Select &amp; customize`,M`
          <div class="bm-annotate-card">
            <bm-selection-list id="bm-selection-list"
                               .selection=${this.selection}
                               .granularity=${this.granularity}>
            </bm-selection-list>
            <bm-selection-editor id="bm-selection-editor"
                .hasSelection=${this.selection.ranges.length>0}>
            </bm-selection-editor>
          </div>`)}
        ${this.renderAnnotationsSection()}
      </aside>
    `}renderSection(e,n,i,r={}){let s=this.isSectionExpanded(e);return M`
      <section id=${e} class="bm-section ${s?"":"collapsed"}"
               ?hidden=${r.hidden??!1}>
        <div class="bm-section-header">
          <h2 class="bm-section-title">
            <button class="bm-section-toggle"
                    aria-expanded=${s?"true":"false"}
                    aria-controls="${e}-body"
                    @click=${l=>{l.stopPropagation(),this.setSectionExpanded(e,!s)}}>
              ${tt("expand_more","bm-section-chevron")}
              ${n}
            </button>
          </h2>
          ${r.actions?M`<div class="bm-section-actions">${r.actions}</div>`:xn}
        </div>
        <div id="${e}-body" class="bm-section-body">${i}</div>
      </section>
    `}renderRepresentation(){return M`
      <div class="bm-card">
        <div class="bm-rep-btn-group">
          ${wn.map(e=>M`
            <button id="bm-rep-${e.rep}"
                    class="bm-rep-btn ${e.rep===this.representation?"active":""}"
                    data-rep=${e.rep}
                    title=${e.title}
                    @click=${()=>{this.emit("rep-change",{rep:e.rep})}}>${e.label}</button>`)}
        </div>
      </div>
      ${this.domains.length>0?this.renderDomains():xn}
    `}renderDomains(){return M`
      <div id="bm-coloring-panel" class="bm-card">
        <div id="bm-domains-legend" class="bm-domains-legend">
          <div class="bm-domains-title">Rigid Domains (PAE):</div>
          ${this.domains.map((e,n)=>M`
            <div class="bm-domain-item">
              <span>Domain ${n+1}: residues ${e.start}–${e.end} (${e.length} AAs)</span>
            </div>`)}
        </div>
      </div>
    `}renderComponents(){let e=this.availableComponents;return M`
      <div class="bm-card">
        <div class="bm-chip-btn-group">
          ${Q.map(n=>{let i=this.components[n.key],r=e!==null&&!e[n.kind];return M`
            <button id=${n.id}
                    class="bm-chip-btn ${i&&!r?"active":""} ${r?"unavailable":""}"
                    data-component=${n.key}
                    title=${n.title}
                    aria-pressed=${i&&!r?"true":"false"}
                    @click=${s=>{s.preventDefault(),this.emit("component-toggle",{key:n.key})}}>${tt(n.icon,"bm-chip-icon")}${n.label}</button>`})}
        </div>
      </div>
    `}renderConfidenceSection(){let e=this.plddtAvailable,n=e?this.plddtMetrics:null,i=a=>`${a.toFixed(1)}%`,r=kn("bm-toggle-plddt-legend-btn",this.plddtColoring,"pLDDT coloring",()=>{this.emit("confidence-toggle",null)},!e),s=e?this.plddtColoring?"":"dimmed":"hidden",l=M`
      <div id="bm-plddt-legend" class="bm-card bm-plddt-legend ${s}"
           role="region" aria-label="pLDDT confidence legend">
        <div id="bm-plddt-global-row" class="bm-plddt-global"
             ?hidden=${!n}>
          <span>Overall global pLDDT:</span>
          <span id="bm-plddt-global-val" class="bm-plddt-global-val">${n?n.globalPlddt.toFixed(2):"--"}</span>
        </div>
        <div class="bm-plddt-legend-items">
          ${Gi.map(a=>M`
            <div class="bm-plddt-legend-item">
              <span class="bm-plddt-legend-label">
                <span class="bm-plddt-swatch"
                      style="background-color: ${a.color};"></span>
                <span>${a.label} <span class="bm-plddt-range">${a.range}</span></span>
              </span>
              <span id=${a.id} class="bm-plddt-pct">${n?i(n[a.key]):""}</span>
            </div>`)}
        </div>
      </div>
    `;return this.renderSection("bm-section-confidence",M`Confidence`,l,{actions:r,hidden:!e})}renderAnnotationsSection(){let e=this.notes.length,n=M`
      <button id="bm-clear-overlay-notes-btn" class="bm-clear-overlay-btn"
              ?hidden=${e===0}
              @click=${()=>{this.emit("delete-all-annotations",null)}}>Delete All</button>
      ${kn("bm-annotations-switch",this.annotationsVisible,"annotations",()=>{this.emit("annotations-toggle",null)})}
    `,i=M`Selections (<span
        id="bm-annotations-count">${e}</span>)`,r=M`
      <bm-annotations-list .notes=${this.notes}
                           .annotationsVisible=${this.annotationsVisible}>
      </bm-annotations-list>
    `;return this.renderSection("bm-section-annotations",i,r,{actions:n})}};A.styles=Fi`
    /*
     * Colors come from the shared --agys-* tokens (shell.css) and the
     * viewer's --bm-* tokens (template.ts); custom properties inherit
     * through this shadow root.
     */
    :host {
      position: relative;
      flex: 0 0 var(--bm-side-panel-used, var(--bm-side-panel-width, 300px));
      width: var(--bm-side-panel-used, var(--bm-side-panel-width, 300px));
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      min-height: 0;
      background: var(--agys-canvas);
      color: var(--agys-ink);
      border-left: 1px solid var(--agys-rule);
      font-family: var(--agys-font);
      font-size: 12px;
    }
    /*
     * Two independent selectors: the host when it carries [hidden], and any
     * shadow element that carries [hidden]. Each hides only itself. Needed
     * because our display rules would otherwise override the UA [hidden] rule.
     */
    :host([hidden]),
    [hidden] {
      display: none !important;
    }
    /* The Material Symbols class (the font itself is loaded by ui.html). */
    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }
    .bm-side-panel {
      flex: 1 1 auto;
      min-height: 0;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      scrollbar-width: thin;
      scrollbar-color: var(--agys-card-edge) transparent;
    }
    /* 9px hit area centred on the 1px left hairline; widens to an accent
       grip on hover / focus / drag. */
    .bm-side-panel-resizer {
      position: absolute;
      top: 0;
      bottom: 0;
      left: -5px;
      width: 9px;
      z-index: 21;
      cursor: col-resize;
      touch-action: none;
      background: transparent;
      outline: none;
    }
    .bm-side-panel-resizer::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 4px;
      width: 1px;
      background: transparent;
      transition: background-color 0.15s ease, width 0.15s ease,
        left 0.15s ease;
    }
    .bm-side-panel-resizer:hover::before,
    .bm-side-panel-resizer.dragging::before,
    .bm-side-panel-resizer:focus-visible::before {
      left: 3px;
      width: 3px;
      background: var(--agys-accent);
    }
    .bm-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .bm-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-height: 20px;
    }
    /* --agys-ink-faint fails AA contrast at this size, so this uses soft ink. */
    .bm-section-title {
      flex: 1 1 auto;
      min-width: 0;
      margin: 0;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: none;
      color: var(--agys-ink-soft);
    }
    /* The whole title is the collapse / expand button. Pulled left by the
       chevron's inset so the glyph lines up with the content below. */
    .bm-section-toggle {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      min-height: 24px;
      margin: 0 0 0 -4px;
      padding: 2px 6px 2px 0;
      border: none;
      border-radius: var(--agys-radius-sm);
      background: none;
      color: inherit;
      font: inherit;
      letter-spacing: inherit;
      text-transform: inherit;
      text-align: left;
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .bm-section-toggle:hover {
      background: var(--agys-hover);
      color: var(--agys-ink);
    }
    .bm-section-chevron {
      font-size: 18px;
      transition: transform 0.2s ease;
    }
    .bm-section.collapsed .bm-section-chevron {
      transform: rotate(-90deg);
    }
    .bm-section.collapsed > .bm-section-body {
      display: none;
    }
    .bm-section-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .bm-annotate-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 0;
      background: transparent;
      border: none;
      border-radius: 0;
    }
    .bm-annotate-card bm-selection-editor {
      padding-top: 0;
      border-top: none;
    }
    .bm-section-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }
    /* Layout wrapper only; draws no box. */
    .bm-card {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 0;
      background: none;
      border: none;
      border-radius: 0;
    }
    .bm-hint {
      font-size: 11px;
      line-height: 1.45;
      color: var(--agys-ink-soft);
    }
    .bm-eye-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      border-radius: var(--agys-radius-sm);
      background: none;
      color: var(--agys-accent-ink);
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .bm-eye-btn .material-symbols-outlined {
      font-size: 17px;
    }
    .bm-eye-btn:hover {
      background: var(--agys-hover);
    }
    .bm-eye-btn.off {
      color: var(--agys-ink-faint);
      opacity: 1;
    }
    .bm-eye-btn.off:hover {
      color: var(--agys-ink);
    }
    .bm-section-toggle:focus-visible,
    .bm-eye-btn:focus-visible,
    .bm-rep-btn:focus-visible,
    .bm-chip-btn:focus-visible,
    .bm-clear-overlay-btn:focus-visible {
      outline: 2px solid var(--agys-accent);
      outline-offset: 2px;
    }

    /* ── Segmented representation control ─────────────────────────── */
    .bm-rep-btn-group {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      gap: 4px;
      width: fit-content;
      max-width: 100%;
      box-sizing: border-box;
      padding: var(--bm-seg-pad);
      background: var(--agys-sunken);
      border: none;
      border-radius: var(--agys-radius-md);
    }
    .bm-rep-btn {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: calc(var(--agys-control-h) - var(--bm-seg-pad) * 2);
      white-space: nowrap;
      background: none;
      border: none;
      color: var(--agys-ink-soft);
      font: inherit;
      font-size: 11.5px;
      font-weight: 500;
      line-height: 1;
      padding: 0 6px;
      border-radius: var(--agys-radius-sm);
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease,
        box-shadow 0.15s ease;
    }
    .bm-rep-btn:hover {
      color: var(--agys-ink);
      background: var(--agys-hover);
    }
    /*
     * The inset hairline is a shadow rather than a border so the box model
     * is identical in both states.
     */
    .bm-rep-btn.active,
    .bm-rep-btn.active:hover {
      color: var(--agys-ink);
      background: var(--agys-raised);
      box-shadow: var(--agys-lift-1),
        inset 0 0 0 1px var(--agys-card-edge);
      font-weight: 600;
    }

    /* The rigid domains legend - an inset tray. */
    .bm-domains-legend {
      padding: 6px 8px;
      font-size: 11px;
      max-height: 92px;
      overflow-y: auto;
      background: var(--agys-sunken);
      border: none;
      border-radius: var(--agys-radius-md);
      color: var(--agys-ink);
      scrollbar-width: thin;
      scrollbar-color: var(--agys-card-edge) transparent;
    }
    .bm-domains-title {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 4px;
      color: var(--agys-ink-faint);
    }
    .bm-domain-item {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 3px;
      color: var(--agys-ink);
    }

    /*
     * ── Component chips ─────────────────────────────────────────────
     * The chips have no stroke, so two adjacent active chips merge below
     * the 4px gap.
     */
    .bm-chip-btn-group {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
    }
    .bm-chip-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: var(--agys-control-h);
      padding: 0 10px;
      font-family: inherit;
      background: transparent;
      border: none;
      border-radius: 999px;
      color: var(--agys-ink-soft);
      font-size: 11.5px;
      font-weight: 500;
      line-height: 1;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .bm-chip-btn:hover {
      color: var(--agys-ink);
      background: var(--agys-hover);
    }
    .bm-chip-btn.active {
      color: var(--agys-accent-ink);
      background: var(--agys-accent-soft);
      font-weight: 600;
    }
    .bm-chip-btn.unavailable,
    .bm-chip-btn.unavailable.active {
      opacity: 0.34;
      cursor: default;
      pointer-events: none;
      color: var(--agys-ink-faint);
      background: transparent;
      font-weight: 500;
    }
    .bm-chip-icon {
      font-size: 14px;
      line-height: 1;
      vertical-align: middle;
      margin-right: 0;
    }

    /* ── pLDDT confidence legend ───────────────────────────────────── */
    .bm-plddt-legend {
      font-size: 11px;
      transition: opacity 0.2s ease;
    }
    /* Coloring off: the stats stay readable, dimmed. */
    .bm-plddt-legend.dimmed {
      opacity: 0.55;
    }
    .bm-plddt-legend.hidden {
      display: none;
    }
    .bm-plddt-global {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 11px;
      color: var(--agys-ink-soft);
      padding-bottom: 0;
      margin-bottom: 8px;
      border-bottom: none;
      font-variant-numeric: tabular-nums;
    }
    .bm-plddt-global-val {
      font-family: var(--agys-font-mono);
      font-weight: 600;
      color: var(--agys-ink);
    }
    .bm-plddt-legend-items {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .bm-plddt-legend-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      line-height: 1.25;
      white-space: nowrap;
      color: var(--agys-ink);
    }
    .bm-plddt-legend-label {
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }
    .bm-plddt-swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 3px;
      flex-shrink: 0;
      border: none;
      box-shadow: inset 0 0 0 1px var(--bm-swatch-edge);
    }
    .bm-plddt-range {
      color: var(--agys-ink-soft);
      opacity: 1;
      font-size: 10.5px;
      font-variant-numeric: tabular-nums;
    }
    .bm-plddt-pct {
      font-family: var(--agys-font-mono);
      font-weight: 600;
      font-size: 10.5px;
      font-variant-numeric: tabular-nums;
      color: var(--agys-ink-soft);
      opacity: 1;
    }

    .bm-clear-overlay-btn {
      background: none;
      border: none;
      color: var(--agys-ink-faint);
      cursor: pointer;
      font-family: inherit;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 2px 4px;
      border-radius: 4px;
      opacity: 1;
      transition: color 0.15s ease, background-color 0.15s ease;
    }
    .bm-clear-overlay-btn:hover {
      color: var(--agys-bad);
      background: var(--agys-hover);
      text-decoration: none;
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
      }
    }
  `,C([H()],A.prototype,"representation",2),C([H({attribute:!1})],A.prototype,"components",2),C([H({attribute:!1})],A.prototype,"availableComponents",2),C([H({attribute:!1})],A.prototype,"domains",2),C([H({type:Boolean})],A.prototype,"plddtAvailable",2),C([H({attribute:!1})],A.prototype,"plddtMetrics",2),C([H({type:Boolean})],A.prototype,"plddtColoring",2),C([H({type:Boolean})],A.prototype,"annotationsVisible",2),C([H({attribute:!1})],A.prototype,"notes",2),C([H({attribute:!1})],A.prototype,"selection",2),C([H()],A.prototype,"granularity",2),C([H({type:Number})],A.prototype,"width",2),C([Sn()],A.prototype,"collapsed",2),C([Sn()],A.prototype,"dragging",2),A=C([Vi("bm-side-panel")],A);function Tn(o,t){let e="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9l7-7V5a2 2 0 0 0-2-2z",n="M14 21v-5a2 2 0 0 1 2-2h5";return o?O`<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d=${e} style="fill: ${o}" stroke="#fff" stroke-width="0.8"/>
      <path d=${n} fill=${t??o} stroke="#fff" stroke-width="0.5"/>
      <line x1="8" y1="9" x2="14" y2="9" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="8" y1="13" x2="12" y2="13" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`:O`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round">
    <path d=${e}/>
    <path d=${n}/>
    <line x1="8" y1="9" x2="14" y2="9"/>
    <line x1="8" y1="13" x2="12" y2="13"/>
  </svg>`}function _n(){return O`
    <style>
      /* Viewer-local tokens. */
      :root,
      .biomolecular-viewer-root {
        /* The Mol* stage (3D viewport + sequence area) uses the host chat
           input box surface (--card), falling back to the AGYS card. */
        --bm-stage: var(--card, var(--agys-card));
        --bm-accent-line: color-mix(in srgb, var(--agys-accent) 30%, transparent);
        /* Annotation layer — #ff4fa8 is the reserved 3D ribbon hue */
        --bm-annot: #ff4fa8;
        --bm-annot-ink: #c2417a;
        /* Text on a saturated annotation or selection fill. */
        --bm-on-annot: #ffffff;
        /* Residues selected or focused in the Mol* sequence track. */
        --bm-seq-selected: #e91e63;
        --bm-pin-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
        /* AlphaFold pLDDT confidence bands. */
        --bm-plddt-vhigh: #0053d6;
        --bm-plddt-conf: #65cbf3;
        --bm-plddt-low: #ffdb13;
        --bm-plddt-vlow: #ff7d45;
        /* Edge on small color swatches, readable in both modes. */
        --bm-swatch-edge: rgba(128, 128, 128, 0.35);

        /* Metrics */
        /*
         * Every control keys off --agys-control-h, including the segmented
         * group: its inner buttons are sized as
         * (control-h - seg-pad * 2), so the group's outer height equals
         * --agys-control-h exactly.
         */
        --bm-seg-pad: 4px;
        /*
         * Sequence track sizing. Mol* builds its layout from absolutely
         * positioned sibling regions, so the boundary between the track and
         * the viewport below cannot be derived - it has to be stated. These
         * tokens are the single source for the track and the viewport edge.
         *
         * The track is a border-box, so its height must carry the gutters or
         * they get subtracted from the sequence area instead of added around
         * it - --bm-seq-track-h adds the gutter to both sides so the content
         * box is exactly --bm-seq-content-h.
         *
         * Sequence area height. A line is 21.4px (14px base x 85% x 180%),
         * and the strip loses 25px to the selector row and 10px to Mol*'s top
         * padding, so visible lines = (this - 35) / 21.4.
         *
         * 125px gives 4.2 lines. The fraction is deliberate: a sliver of the
         * next line is what tells you the strip scrolls.
         */
        --bm-seq-content-h: 125px;
        --bm-seq-gutter: 2px;
        --bm-seq-track-h: calc(
            var(--bm-seq-content-h) + var(--bm-seq-gutter) * 2);
        /*
         * Clearance between the top hairline and the "Sequence of" selector
         * row. Applied as a margin on that row only, with the strip below
         * shifted down by the same amount so the two never overlap.
         */
        --bm-seq-select-gap: 2px;
      }

      .biomolecular-viewer-root[data-theme='dark'] {
        --bm-annot-ink: #ff9ccd;
      }

      /* ── Layout shell ───────────────────────────────────────────────── */
      .biomolecular-viewer-root {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        background: var(--agys-canvas);
        color: var(--agys-ink);
        font-family: var(--agys-font);
      }
      .bm-viewer-target,
      .bm-viewer-target .msp-plugin,
      .bm-viewer-target .msp-layout,
      .bm-viewer-target .msp-layout-main,
      .bm-viewer-target .msp-layout-region,
      .bm-viewer-target .msp-viewport,
      .bm-viewer-target .msp-viewport-wrapper,
      .bm-viewer-target .msp-viewport-host3d,
      .bm-viewer-target .msp-canvas3d,
      .bm-viewer-target canvas {
        background-color: var(--bm-stage) !important;
      }
      /*
       * Mol* puts a 1px #31374a border on all four sides of the layout
       * container. Only the top edge is kept, as the divider under the
       * toolbar.
       */
      .bm-viewer-target .msp-plugin .msp-layout-standard {
        border: none;
        border-top: 1px solid var(--agys-rule);
      }
      .bm-viewer-target {
        flex: 1 1 0%;
        display: flex;
        flex-direction: column;
        position: relative;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
      }
      /* The closed "Show sequence" bar stacked on the Mol* viewport. */
      .bm-stage-col {
        flex: 1 1 0%;
        display: flex;
        flex-direction: column;
        position: relative;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
        background: var(--bm-stage);
      }
      /* The 3D viewport and, to its right, the controls panel. */
      .bm-main-row {
        flex: 1 1 0%;
        display: flex;
        flex-direction: row;
        position: relative;
        min-height: 0;
        overflow: hidden;
        /* Set by <bm-side-panel> as it is resized. */
        --bm-side-panel-width: 300px;
        /* What is drawn: the chosen width, capped so at least 200px of the
           viewport stays visible if the sidecar has since narrowed.
           Percentages resolve against the row at each use site. */
        --bm-side-panel-used: min(
          var(--bm-side-panel-width),
          max(220px, 100% - 200px)
        );
      }
      .bm-main-row.bm-resizing {
        cursor: col-resize;
        user-select: none;
      }

      .bm-control-panel {
        flex-shrink: 0;
        position: relative;
        z-index: 10;
        background: transparent;
        padding: 8px 10px 6px;
      }

      .biomolecular-module {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 12px;
        font-family: var(--agys-font);
        color: var(--agys-ink);
      }
      .bm-toolbar-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
        flex-wrap: nowrap;
        min-width: 0;
      }
      .biomolecular-module label {
        font-size: 11px;
        font-weight: 500;
        color: var(--agys-ink-soft);
        white-space: nowrap;
      }

      /* Shared focus ring */
      .biomolecular-module button:focus-visible,
      .biomolecular-module select:focus-visible,
      .biomolecular-module input:focus-visible,
      .bm-viewport-ctrl-btn:focus-visible,
      .bm-sequence-collapse-header:focus-visible,
      .msp-layout-top .msp-sequence-select .bm-sequence-hide-btn:focus-visible {
        outline: 2px solid var(--agys-accent);
        outline-offset: 2px;
        border-radius: var(--agys-radius-sm);
      }

      /* ── Structure selector (borderless until touched) ──────────────── */
      .bm-field {
        position: relative;
        display: inline-flex;
        align-items: center;
        min-width: 0;
        flex: 0 1 auto;
      }
      .bm-field::after {
        content: "";
        position: absolute;
        right: 10px;
        top: 50%;
        width: 5px;
        height: 5px;
        border-right: 1.5px solid var(--agys-ink-faint);
        border-bottom: 1.5px solid var(--agys-ink-faint);
        transform: translateY(-72%) rotate(45deg);
        pointer-events: none;
      }
      .biomolecular-module select {
        appearance: none;
        -webkit-appearance: none;
        height: var(--agys-control-h);
        max-width: 260px;
        min-width: 130px;
        width: 100%;
        padding: 0 26px 0 9px;
        background: var(--agys-sunken);
        color: var(--agys-ink);
        border: 1px solid transparent;
        border-radius: var(--agys-radius-sm);
        font-family: var(--agys-font);
        font-size: 12px;
        font-weight: 500;
        line-height: var(--agys-control-h);
        text-overflow: ellipsis;
        cursor: pointer;
        outline: none;
        transition: background-color 0.15s ease, border-color 0.15s ease;
      }
      .biomolecular-module select:hover {
        background: var(--agys-hover);
      }
      .biomolecular-module select:focus {
        border-color: var(--bm-accent-line);
      }
      /* Native popups paint outside our surface, so give them real colors. */
      .biomolecular-module select option {
        background-color: var(--agys-paper);
        color: var(--agys-ink);
      }
      .biomolecular-module input[type="text"],
      .biomolecular-module input[type="number"] {
        height: var(--agys-control-h);
        background: var(--agys-sunken);
        color: var(--agys-ink);
        border: 1px solid transparent;
        border-radius: var(--agys-radius-sm);
        padding: 0 9px;
        font-family: var(--agys-font);
        font-size: 12px;
        outline: none;
      }
      .biomolecular-module input[type="text"]:focus,
      .biomolecular-module input[type="number"]:focus {
        border-color: var(--bm-accent-line);
        background: var(--agys-paper);
      }

      /* ── Ghost icon buttons (no boxes, tint on hover) ───────────────── */
      .biomolecular-module button {
        font-family: var(--agys-font);
      }
      .biomolecular-module .bm-icon-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        gap: 5px;
        height: var(--agys-control-h);
        min-width: var(--agys-control-h);
        padding: 0 6px;
        background: transparent;
        border: none;
        border-radius: var(--agys-radius-sm);
        color: var(--agys-ink-soft);
        font-family: var(--agys-font);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.15s ease, color 0.15s ease;
      }
      .biomolecular-module .bm-icon-btn:hover {
        background: var(--agys-hover);
        color: var(--agys-ink);
      }
      .biomolecular-module .bm-icon-btn:active {
        background: var(--agys-pressed);
      }
      .biomolecular-module .bm-icon-btn .material-symbols-outlined {
        font-size: 17px;
        line-height: 1;
      }

      /*
       * Status text: fills the remaining space and truncates to one line.
       *
       * Deliberately no ":empty { display: none }". This is a role="status"
       * live region, and display: none removes it from the accessibility
       * tree. It must stay rendered while empty so screen readers are
       * watching it before the message lands. Empty, it is invisible anyway.
       */
      .bm-status-bar {
        flex: 1 1 0;
        min-width: 0;
        padding: 0 2px;
        text-align: right;
        font-family: var(--agys-font-mono);
        font-size: 10.5px;
        letter-spacing: 0.01em;
        color: var(--agys-ink-faint);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* ── Hide PDBe structure tools & controls overlay (comprehensive) ── */
      .msp-layout-controls,
      .msp-control-panel,
      .msp-btn-screenshot,
      .msp-screenshot-viewport-controls,
      .msp-state-snapshot-viewport-controls,
      #bm-viewer-target button[title="Screenshot / State Snapshot"],
      #bm-viewer-target button[title*="Screenshot"] {
        display: none !important;
      }
      .bm-viewer-target .msp-layout-region-left,
      .bm-viewer-target .msp-layout-region-right,
      .bm-viewer-target .msp-layout-left,
      .bm-viewer-target .msp-layout-right,
      .bm-viewer-target .msp-settings-control {
        display: none !important;
      }
      /* Clicks select residues without Mol*'s selection mode (see
         selectFromClick in viewer.ts), so its toggle is hidden. */
      .msp-viewport-controls button[title="Toggle Selection Mode"] {
        display: none !important;
      }
      /* Mol*'s selection toolbar (granularity, set operations, brush and
         theme dialogs) stays hidden: the side panel's Selection section
         offers the picking level (elements/bm-selection-list.ts). */
      .msp-selection-viewport-controls {
        display: none !important;
      }

      /* ── Mol* viewport controls (ghost treatment) ───────────────────── */
      .msp-viewport-top-left-controls,
      .pdbemolstar-viewport-top-center-controls {
        z-index: 10;
      }
      .msp-viewport-top-left-controls button,
      .msp-viewport-top-left-controls .msp-btn {
        background-color: var(--agys-sunken) !important;
        color: var(--agys-ink) !important;
        border: none !important;
        border-radius: var(--agys-radius-sm) !important;
        font-family: var(--agys-font) !important;
      }
      .msp-viewport-top-left-controls button:hover,
      .msp-viewport-top-left-controls .msp-btn:hover {
        background-color: var(--agys-hover) !important;
        color: var(--agys-ink) !important;
      }
      /* Ensure color swatches keep their inline background styles */
      .msp-btn-color-swatch,
      .msp-color-swatch {
        border-radius: 4px;
        min-width: 16px;
        min-height: 16px;
      }

      /* ── Mol* residue info, hover tooltips & toasts ─────────────────── */
      .msp-highlight-info {
        background: var(--agys-paper) !important;
        color: var(--agys-ink) !important;
        border: none !important;
        border-radius: var(--agys-radius-md) !important;
        box-shadow: var(--agys-lift-1) !important;
        font-family: var(--agys-font) !important;
      }
      .msp-highlight-info-hr {
        background-color: var(--agys-card-edge) !important;
      }
      .msp-highlight-info-additional {
        color: var(--agys-accent-ink) !important;
      }
      .msp-toast-container .msp-toast-entry {
        background: var(--agys-paper) !important;
        color: var(--agys-ink) !important;
        border: none !important;
        border-radius: var(--agys-radius-md) !important;
        box-shadow: var(--agys-lift-2) !important;
      }
      .msp-toast-container .msp-toast-entry .msp-toast-title {
        background: var(--agys-sunken) !important;
        color: var(--agys-ink) !important;
      }
      .msp-toast-container .msp-toast-entry .msp-toast-message {
        color: var(--agys-ink) !important;
      }

      /* ── Mol* sequence track ──────────────────────────────────────── */
      .msp-layout-top,
      .msp-layout-top .msp-layout-region,
      .msp-layout-top .msp-layout-static,
      .msp-layout-top .msp-scrollable,
      .msp-layout-top .msp-scrollable-container,
      .msp-layout-top .msp-sequence,
      .msp-layout-top .msp-sequence-wrapper,
      .msp-layout-top .msp-sequence-wrapper-non-empty {
        background-color: var(--bm-stage) !important;
      }
      .msp-layout-top {
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        top: 0 !important;
        width: 100% !important;
        height: var(--bm-seq-track-h) !important;
        z-index: 10 !important;
        box-sizing: border-box;
        color: var(--agys-ink) !important;
        /*
         * This padding does NOT inset the sequence content: Mol*'s
         * .msp-layout-static child is absolutely positioned against the
         * padding box. The visible clearance under the top hairline comes
         * from --bm-seq-select-gap on the selector row instead.
         */
        padding: var(--bm-seq-gutter) 0;
        /*
         * Mol* puts border-bottom: 1px solid #31374a on this element in every
         * layout variant. Recolored to the same --agys-rule as the top
         * hairline on .msp-layout-standard, so the pair match.
         */
        border-bottom: 1px solid var(--agys-rule) !important;
      }
      .msp-layout-top * {
        box-sizing: border-box;
      }
      /*
       * Mol* pads this wrapper 10px 10px 3px 10px. The trailing 3px is zeroed
       * so both ends of the strip come purely from --bm-seq-gutter. The 10px
       * top is untouched: residue numbers are drawn at top: -1.1em, above
       * their letters, so they clip if it is tightened.
       */
      .msp-layout-top .msp-sequence-wrapper {
        padding-bottom: 0 !important;
      }
      .msp-layout-hide-top .msp-layout-top,
      [data-sequence-hidden] .msp-layout-top {
        display: none !important;
      }
      /*
       * The viewport starts where the track ends. Mol* pins this at a literal
       * 100px matching its own stock track, so it is restated from the same
       * token. While the track is hidden (viewer.ts sets
       * data-sequence-hidden on the root) the viewport fills its space.
       */
      .msp-layout-main {
        top: var(--bm-seq-track-h) !important;
        left: 0 !important;
        right: 0 !important;
      }
      .msp-layout-hide-top .msp-layout-main,
      [data-sequence-hidden] .msp-layout-main {
        top: 0 !important;
      }

      /* Sequence toolbar & controls */
      .msp-layout-top .msp-control-row,
      .msp-layout-top .msp-sequence-select {
        background-color: transparent !important;
        color: var(--agys-ink) !important;
        border-bottom: none !important;
      }
      .msp-layout-top label,
      .msp-layout-top .msp-control-row span,
      .msp-layout-top .msp-sequence-select span {
        color: var(--agys-ink-soft) !important;
        background-color: transparent !important;
        cursor: default !important;
        user-select: none;
      }
      /*
       * Mol* lays this row out as inline-block children with no margin, so the
       * only separation between adjacent dropdowns is collapsed whitespace,
       * which can render as zero. Flex with an explicit gap makes the
       * separation real and matches the 4px used by every other control group.
       *
       * Height stays at Mol*'s 24px: Mol* positions the strip at a hardcoded
       * top: 25px derived from this row, so resizing it would push the strip
       * over the dropdowns.
       */
      .msp-layout-top .msp-sequence-select {
        display: flex;
        align-items: center;
        gap: 4px;
        padding-right: 8px;
        margin-top: var(--bm-seq-select-gap) !important;
      }
      /* The row starts --bm-seq-select-gap lower, so the strip moves too. */
      .msp-layout-top .msp-sequence-wrapper-non-empty {
        top: calc(25px + var(--bm-seq-select-gap)) !important;
      }
      .msp-layout-top .msp-sequence-select > select {
        flex: 0 0 auto;
      }
      .msp-layout-top select {
        background-color: var(--agys-sunken) !important;
        color: var(--agys-ink) !important;
        border: 1px solid transparent !important;
        border-radius: var(--agys-radius-sm) !important;
        font-family: var(--agys-font) !important;
        /* Mol*'s defaults differ; match the toolbar select (12px / 500). */
        font-size: 12px !important;
        font-weight: 500 !important;
        cursor: pointer !important;
      }
      .msp-layout-top select:hover {
        background-color: var(--agys-hover) !important;
      }

      /* Sequence residue letters & interactions */
      /*
       * Mol* defaults to a serif Courier face; use the system monospace so
       * residues stay column-aligned but match the rest of the UI.
       */
      .msp-layout-top .msp-sequence-wrapper,
      .msp-layout-top .msp-sequence-wrapper span {
        font-family: var(--agys-font-mono) !important;
      }
      .msp-layout-top .msp-sequence-wrapper span:not(.msp-sequence-marker):not(.msp-sequence-number) {
        color: var(--agys-ink);
        font-weight: 500;
      }
      .msp-layout-top .msp-sequence-wrapper span:not(.msp-sequence-marker):not(.msp-sequence-number):hover,
      .msp-layout-top .msp-sequence-wrapper .msp-sequence-highlight {
        background-color: var(--bm-annot) !important;
        color: var(--bm-on-annot) !important;
        border-radius: 3px !important;
        font-weight: 700 !important;
        cursor: pointer !important;
      }
      .msp-layout-top .msp-sequence-wrapper .msp-sequence-selected,
      .msp-layout-top .msp-sequence-wrapper .msp-sequence-select,
      .msp-layout-top .msp-sequence-wrapper .msp-sequence-focused,
      .msp-layout-top .msp-sequence-wrapper .msp-sequence-focus {
        background-color: var(--bm-seq-selected) !important;
        color: var(--bm-on-annot) !important;
        border-radius: 3px !important;
        font-weight: 700 !important;
      }
      .msp-layout-top .msp-sequence-wrapper .msp-sequence-marker,
      .msp-layout-top .msp-sequence-wrapper .msp-sequence-number {
        color: var(--agys-accent-ink) !important;
        font-family: var(--agys-font-mono) !important;
        font-weight: 600 !important;
      }
      .msp-layout-top .msp-icon,
      .msp-layout-top button {
        color: var(--agys-ink-soft) !important;
      }

      /* ── Scrollbars (uniform, hairline-toned) ───────────────────────── */
      .msp-layout-top,
      .msp-layout-top .msp-sequence-wrapper {
        scrollbar-width: thin;
        scrollbar-color: var(--agys-card-edge) transparent;
      }
      .msp-layout-top ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: transparent;
      }
      .msp-layout-top ::-webkit-scrollbar-track {
        background-color: transparent;
      }
      .msp-layout-top ::-webkit-scrollbar-thumb {
        background-color: var(--agys-card-edge) !important;
        border-radius: 3px;
      }
      .msp-layout-top ::-webkit-scrollbar-thumb:hover {
        background-color: var(--agys-ink-faint) !important;
      }

      /* ── Sequence show / hide ───────────────────────────────────────────
         Open: Mol*'s row reads "Hide sequence of [structure] [chain]" (the
         .bm-sequence-hide-btn built in viewer.ts). Closed: the
         #bm-sequence-header row stands in for it and reads "Show sequence". */
      .bm-sequence-collapse-header {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        gap: 2px;
        width: 100%;
        height: var(--agys-control-h);
        box-sizing: border-box;
        padding: 0 8px 0 8px;
        background: var(--bm-stage);
        border: none;
        border-top: 1px solid var(--agys-rule);
        color: var(--agys-ink-soft);
        font-family: var(--agys-font);
        font-size: 12px;
        font-weight: 500;
        line-height: 1;
        text-align: left;
        white-space: nowrap;
        cursor: pointer;
        user-select: none;
        transition: background-color 0.15s ease, color 0.15s ease;
      }
      .bm-sequence-collapse-header[hidden] {
        display: none;
      }
      .bm-sequence-collapse-header:hover {
        background: linear-gradient(var(--agys-hover), var(--agys-hover)),
            var(--bm-stage);
        color: var(--agys-ink);
      }
      .bm-sequence-collapse-arrow {
        display: inline-block;
        font-size: 16px;
        line-height: 1;
        vertical-align: middle;
      }
      /* "Hide sequence of", in place of Mol*'s "Sequence of" label. */
      .msp-layout-top .msp-sequence-select .bm-sequence-hide-btn {
        display: inline-flex;
        align-items: center;
        flex: 0 0 auto;
        gap: 2px;
        height: 24px;
        /* Margin, not padding: the gap sits outside the hover fill. */
        margin-left: 1px !important;
        padding: 0 8px 0 2px;
        border: none;
        border-radius: var(--agys-radius-sm);
        background: transparent !important;
        color: var(--agys-ink-soft) !important;
        font-family: var(--agys-font);
        /* One type spec for every control in the toolbar and sequence row:
           12px / 500. Important because Mol*'s row rules would otherwise win. */
        font-size: 12px !important;
        font-weight: 500 !important;
        line-height: 24px;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer !important;
        transition: background-color 0.15s ease, color 0.15s ease;
      }
      .msp-layout-top .msp-sequence-select .bm-sequence-hide-btn span {
        color: inherit !important;
        cursor: pointer !important;
      }
      .msp-layout-top .msp-sequence-select .bm-sequence-hide-btn:hover {
        background: var(--agys-hover) !important;
        color: var(--agys-ink) !important;
      }
      .bm-sequence-hide-btn .material-symbols-outlined {
        font-size: 16px;
        line-height: 1;
      }

      /* ── 3D pin markers & tooltips ──────────────────────────────────── */
      .bm-pin {
        position: absolute;
        transform: translate(-50%, -50%);
        line-height: 1;
        cursor: pointer;
        filter: drop-shadow(var(--bm-pin-shadow));
        transition: opacity 0.2s, width 0.15s ease, height 0.15s ease;
        opacity: 0;
        user-select: none;
        width: 24px;
        height: 24px;
        pointer-events: auto;
      }
      .bm-pin-tooltip {
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        background: var(--agys-paper);
        color: var(--agys-ink);
        border: none;
        border-radius: var(--agys-radius-lg);
        padding: 10px 13px;
        font-family: var(--agys-font);
        font-size: 12px;
        line-height: 1.5;
        white-space: normal;
        width: max-content;
        max-width: 360px;
        min-width: 220px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.15s;
        box-shadow: var(--agys-lift-2);
        z-index: 100;
      }
      .bm-pin:hover .bm-pin-tooltip {
        opacity: 1;
      }
      /* The label takes the note's own color (set per pin by viewer.ts). */
      .bm-pin-label {
        font-family: var(--agys-font-mono);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: var(--bm-note-color, var(--bm-annot-ink));
        margin-bottom: 3px;
      }
      .bm-pin-note-text {
        color: var(--agys-ink);
        white-space: pre-wrap;
        word-break: break-word;
      }
      .bm-pin-note-text.empty {
        font-style: italic;
        color: var(--agys-ink-faint);
        opacity: 1;
      }
      .bm-tooltip-arrow {
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid var(--agys-paper);
      }
      .bm-pin-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 5;
      }

      /* ── Load error ─────────────────────────────────────────────────── */
      .bm-load-error {
        margin-top: 6px;
        padding: 10px 12px;
        color: var(--agys-bad);
        background: var(--agys-sunken);
        border: none;
        border-left: 2px solid var(--agys-bad);
        border-radius: var(--agys-radius-sm);
        font-family: var(--agys-font-mono);
        font-size: 11px;
        line-height: 1.5;
        display: none;
      }

      /* ── Viewport icon column (Mol* + custom) ───────────────────────────
         The lift-1 shadow keeps the icons legible over any structure color. */
      .msp-viewport-controls-buttons {
        display: flex !important;
        flex-direction: column !important;
        gap: 0 !important;
        background: transparent !important;
      }
      .msp-viewport-controls-buttons > div {
        margin: 0 !important;
        padding: 0 !important;
      }
      /*
       * Each Mol* button group carries a background in Mol*'s own (dark) skin
       * color, which shows through the gaps between our buttons in light mode.
       * The buttons have their own themed background, so drop it.
       */
      .msp-viewport-controls .msp-semi-transparent-background {
        display: none !important;
      }
      .bm-viewport-custom-controls {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 0;
        width: var(--agys-control-h);
        z-index: 12;
        pointer-events: auto;
      }
      .biomolecular-viewer-root > .bm-viewport-custom-controls {
        position: absolute;
        top: 160px;
        right: 10px;
      }
      /* Before a structure is loaded Mol* has no viewport controls yet: the
         strip waits in the viewer area's top-right corner, beside the side
         panel (see mountViewportCustomControls). */
      .bm-viewer-target > .bm-viewport-custom-controls {
        position: absolute;
        top: 10px;
        right: 10px;
      }
      .msp-viewport-controls-buttons button,
      .msp-viewport-controls-buttons .msp-btn,
      .bm-viewport-ctrl-btn {
        width: var(--agys-control-h) !important;
        height: var(--agys-control-h) !important;
        padding: 0 !important;
        margin: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background-color: color-mix(in srgb, var(--agys-paper) 88%, transparent) !important;
        color: var(--agys-ink-soft) !important;
        border: none !important;
        border-radius: var(--agys-radius-sm) !important;
        cursor: pointer !important;
        user-select: none !important;
        transition: background-color 0.15s ease, color 0.15s ease !important;
        box-shadow: var(--agys-lift-1), inset 0 0 0 1px var(--agys-card-edge) !important;
        box-sizing: border-box !important;
      }
      /*
       * The rule above forces "display: flex !important", which outranks any
       * inline style.display = 'none'. Hiding a control button therefore has
       * to go through an equally-weighted !important rule.
       */
      .bm-viewport-ctrl-btn[hidden] {
        display: none !important;
      }
      .msp-viewport-controls-buttons button,
      .msp-viewport-controls-buttons .msp-btn {
        margin-bottom: 4px !important;
      }
      .msp-viewport-controls-buttons button svg,
      .msp-viewport-controls-buttons .msp-btn svg {
        fill: currentColor !important;
        width: 17px !important;
        height: 17px !important;
      }
      .msp-viewport-controls-buttons button.msp-btn-link-toggle-off,
      .msp-viewport-controls-buttons .msp-btn.msp-btn-link-toggle-off,
      .bm-viewport-ctrl-btn.inactive {
        color: var(--agys-ink-soft) !important;
        opacity: 1 !important;
      }
      .msp-viewport-controls-buttons button:hover,
      .msp-viewport-controls-buttons .msp-btn:hover,
      .bm-viewport-ctrl-btn:hover {
        background-color: var(--agys-paper) !important;
        color: var(--agys-ink) !important;
      }
      .msp-viewport-controls-buttons button:active,
      .msp-viewport-controls-buttons .msp-btn:active,
      .bm-viewport-ctrl-btn:active {
        background-color: var(--agys-pressed) !important;
      }
      /* The panel toggle always reads as on while the side panel is open. */
      .msp-viewport-controls-buttons button[title*="Selection"].msp-btn-link-toggle-on,
      .msp-viewport-controls-buttons .msp-btn[title*="Selection"].msp-btn-link-toggle-on,
      .bm-viewport-ctrl-btn.active,
      .bm-viewport-ctrl-btn.bm-panel-toggle {
        color: var(--agys-accent-ink) !important;
        background-color: color-mix(in srgb, var(--agys-paper) 82%, var(--agys-accent) 18%) !important;
        opacity: 1 !important;
      }
      .msp-viewport-controls-buttons button[title*="Selection"].msp-btn-link-toggle-on:hover,
      .msp-viewport-controls-buttons .msp-btn[title*="Selection"].msp-btn-link-toggle-on:hover,
      .bm-viewport-ctrl-btn.active:hover,
      .bm-viewport-ctrl-btn.bm-panel-toggle:hover {
        color: var(--agys-accent-ink) !important;
        background-color: color-mix(in srgb, var(--agys-paper) 74%, var(--agys-accent) 26%) !important;
      }
      .bm-viewport-ctrl-btn .material-symbols-outlined {
        font-size: 18px;
        line-height: 1;
      }
      /*
       * Mol*'s Reset Zoom hover menu (Reset Zoom / Orient Axes / Reset Axes).
       * Mol* hardcodes its dark skin (#111318) on the menu and its rows, and
       * the icon-button rules above would squeeze the text buttons to 28px,
       * so the menu gets its own themed card treatment.
       *
       * These selectors outrank Mol*'s, so the menu and rows need no
       * !important. The buttons only use it on properties the icon-button
       * rules above already force with !important.
       */
      .msp-plugin .msp-viewport-controls .msp-hover-box-wrapper .msp-hover-box-body {
        width: auto;
        min-width: 120px;
        padding: 4px;
        background: var(--agys-paper);
        border-radius: var(--agys-radius-md);
        box-shadow: var(--agys-lift-2), inset 0 0 0 1px var(--agys-card-edge);
      }
      .msp-plugin .msp-viewport-controls .msp-hover-box-body .msp-flex-column,
      .msp-plugin .msp-viewport-controls .msp-hover-box-body .msp-flex-row {
        background: transparent;
        margin: 0;
        height: auto;
      }
      .msp-plugin .msp-viewport-controls .msp-hover-box-body button,
      .msp-plugin .msp-viewport-controls .msp-hover-box-body .msp-btn {
        width: 100% !important;
        height: var(--agys-control-h) !important;
        margin: 0 !important;
        padding: 0 10px !important;
        justify-content: flex-start !important;
        white-space: nowrap;
        background-color: transparent !important;
        color: var(--agys-ink) !important;
        box-shadow: none !important;
        font-family: var(--agys-font);
        font-size: 13px;
      }
      .msp-plugin .msp-viewport-controls .msp-hover-box-body button:hover:not(:disabled),
      .msp-plugin .msp-viewport-controls .msp-hover-box-body .msp-btn:hover:not(:disabled) {
        background-color: var(--agys-hover) !important;
      }
      .msp-plugin .msp-viewport-controls .msp-hover-box-body button:active:not(:disabled),
      .msp-plugin .msp-viewport-controls .msp-hover-box-body .msp-btn:active:not(:disabled) {
        background-color: var(--agys-pressed) !important;
      }
      .msp-plugin .msp-viewport-controls .msp-hover-box-body button:disabled,
      .msp-plugin .msp-viewport-controls .msp-hover-box-body .msp-btn:disabled {
        color: var(--agys-ink-faint) !important;
        cursor: default !important;
      }

      @media (prefers-reduced-motion: reduce) {
        .biomolecular-viewer-root *,
        .bm-pin,
        .bm-pin-tooltip {
          transition-duration: 0.01ms !important;
          animation-duration: 0.01ms !important;
        }
      }
    </style>

    <div class="biomolecular-viewer-root">
      <div id="biomolecular-control-panel" class="bm-control-panel">
        <div class="biomolecular-module">
          <div class="bm-toolbar-row">
            <div class="bm-field">
              <select id="bm-workspace-select" aria-label="Structure file">
                <option value="">-- No files --</option>
              </select>
            </div>
            <button
              id="bm-refresh-files-btn"
              class="bm-icon-btn"
              title="Refresh file list"
              aria-label="Refresh file list"
            >
              <span class="material-symbols-outlined">refresh</span>
            </button>
            <input
              type="file"
              id="bm-local-file-input"
              accept=".pdb,.cif,.mmcif,.ent"
              style="display: none"
            />
            <button
              id="bm-local-file-btn"
              class="bm-icon-btn"
              title="Upload local PDB/CIF file from disk"
            >
              <span class="material-symbols-outlined">upload_file</span>
              Upload
            </button>
            <div id="bm-status-bar" class="bm-status-bar" role="status"></div>
          </div>
        </div>

        <div id="bm-load-error" class="bm-load-error"></div>
      </div>
      <div class="bm-main-row">
        <div class="bm-stage-col">
          <button
            id="bm-sequence-header"
            class="bm-sequence-collapse-header"
            type="button"
            title="Show the sequence panel"
            aria-expanded="true"
            hidden
          >
            <span class="material-symbols-outlined bm-sequence-collapse-arrow" aria-hidden="true">expand_more</span>
            <span class="bm-sequence-title">Show sequence</span>
          </button>
          <div id="bm-viewer-target" class="bm-viewer-target"></div>
        </div>
        <bm-side-panel id="bm-side-panel"></bm-side-panel>
      </div>
      <div id="bm-viewport-custom-controls" class="bm-viewport-custom-controls">
        <button
          id="bm-toggle-panel-btn"
          class="bm-viewport-ctrl-btn bm-panel-toggle active"
          title="Hide the controls panel"
          aria-label="Hide the controls panel"
          aria-controls="bm-side-panel"
          aria-expanded="true"
        >
          <span class="material-symbols-outlined">right_panel_close</span>
        </button>
      </div>
    </div>
  `}var Ji=1e3;function Yi(o){switch(o){case"cartoon":return"cartoon";case"stick":return"ball-and-stick";case"sphere":return"spacefill";case"surface":return"gaussian-surface";case"line":return"line";default:return o}}function Xi(o){let t=o.startsWith(".user_uploaded/")?o.slice(15):o,e=t.split("/");if(e.length<2)return t;let n=e[e.length-1],i=n.lastIndexOf("."),r=i>0?n.slice(0,i):n;return e[e.length-2].toLowerCase()!==r.toLowerCase()?t:[...e.slice(0,-2),n].join("/")}var An="bm-side-panel-open",Zi=20,Qi=150,eo="Select residues first",to="Note saved",no="Scanning conversation for structure files\u2026";function io(){try{return window.localStorage?.getItem(An)!=="false"}catch{return!0}}function oo(o){try{window.localStorage?.setItem(An,String(o))}catch{}}var Mn={r:255,g:105,b:180};function ro(o){return{path:o,source:"workspace",id:null,uniprot_id:null,filename:null,url:null}}var _e=class{viewer=null;currentId=null;loadedRevision=void 0;currentSource="";currentConvId=null;container=null;currentStructureUrl="";currentFormat="pdb";currentPreset="cartoon";currentWorkspacePath="";currentAnnotations=null;userNotes=[];viewerTarget=null;panelEl=null;pinOverlay=null;pinAnimFrame=null;renderedNotesKey=null;context=null;renderUserNotes=null;annotationsVisible=!1;plddt=new fe({getViewer:()=>this.viewer,getPanel:()=>this.sidePanel(),isMounted:()=>this.isMounted,mountControls:()=>this.mountViewportCustomControls(),onLegendToggled:async()=>{let t=this.loadedKey;await this.setStyle(this.currentPreset||"cartoon"),await this.sendStructurePatch({confidence:this.plddt.legendVisible},t)}});sequencePanelVisible=!0;sequenceRowObserver=null;sidePanelOpen=io();wiredPanels=new WeakSet;panelStatus=void 0;unsubscribeTheme=null;lastPaintedRibbons=[];pluginSubs=[];customControlsEl=null;components={...Se};lastState={};loadedKey="";get sceneSelections(){return this.sceneSelectionsValue}set sceneSelections(t){this.sceneSelectionsValue=t,this.updateSidePanelNotes()}sceneSelectionsValue=[];idFloor=1;sceneHighlights=[];observedHighlights=[];userHighlightDebounceTimer=null;eventSuppressionDepth=0;selectedRanges=[];postedSelectedRanges="[]";selectedRangesDebounceTimer=null;chainResidueCache=null;constructor(t){t&&(this.context=t,this.currentConvId=t.getConversationId())}getStateKey(t){let e=Re(t);return JSON.stringify({convId:this.context?.getConversationId()??this.currentConvId,id:t.id,path:t.path,filename:t.filename,uniprot_id:t.uniprot_id,url:t.url,source:t.source,revision:t.revision,style:e.style,components:e.components,selections:Ue(t),annotations:e.annotations,confidence:e.confidence})}sendStatePatch(t){return this.context?this.context.postState(t):Promise.resolve()}sendTrackedPatch(t){return Object.keys(t).length===0?Promise.resolve():(this.lastState=se(this.lastState,t),this.sendStatePatch(t))}sendStructurePatch(t,e=this.loadedKey){return e?this.sendTrackedPatch(Jt(this.lastState,t,e)):(console.warn("[BiomolecularViewer] No structure shown; edit not saved"),Promise.resolve())}sendSwitchPatch(t){return this.sendTrackedPatch(Yt(this.lastState,t))}async init(t){this.container=t,this.container.style.position="relative",this.container.style.width="100%",this.container.style.height="100%",this.container.style.display="flex",this.container.style.flexDirection="column",this.container.style.overflow="hidden";try{if(await mt("pdbe-molstar-js",()=>!!window.PDBeMolstarPlugin),!window.PDBeMolstarPlugin)throw new Error("PDBeMolstarPlugin not found on window object.");this.container.textContent="",ce(_n(),this.container),this.applyTheme(),this.viewerTarget=this.container.querySelector("#bm-viewer-target"),this.panelEl=this.container.querySelector(".biomolecular-viewer-root"),this.viewer=new window.PDBeMolstarPlugin,this.panelEl&&await this.initControlPanel(this.panelEl),this.ensureSidePanel(),document.addEventListener("keydown",this.onDocumentKeyDown),this.plddt.ensureControls(),this.ensureSequenceHeader(),this.setupThemeListener()}catch(e){console.error("[BiomolecularViewer] init - caught error",e);let n=e instanceof Error?e.message:String(e);throw t.dispatchEvent(new j("Viewer Initialisation Failed",n)),e}}setupThemeListener(){this.unsubscribeTheme||(this.unsubscribeTheme=ft((t,e)=>{this.applyTheme(),this.syncThemeBg(e)}))}applyTheme(){let t=this.container?.querySelector(".biomolecular-viewer-root");t&&gt(t)}stageRgb(){let t=this.viewerTarget??this.container?.querySelector("#bm-viewer-target");if(!t)return;let e=pe(getComputedStyle(t).backgroundColor);return e&&e.a!==0?{r:e.r,g:e.g,b:e.b}:void 0}syncThemeBg(t){if(!this.viewer)return;let e=this.stageRgb()??t??te();try{typeof this.viewer.canvas?.setBgColor=="function"&&this.viewer.canvas.setBgColor(e),this.viewer.plugin?.canvas3d?.setProps&&this.viewer.plugin.canvas3d.setProps({renderer:{backgroundColor:ht(e)}})}catch(n){console.debug("[BiomolecularViewer] Could not dynamic-sync Mol* canvas bg:",n)}}lastFilesJson="";async loadWorkspaceFiles(t,e,n=!1){let i=this.getConvId()||"";!n&&e&&e(no);try{let r=await fetch(`./biomolecular/list-workspace-pdbs?conversationId=${encodeURIComponent(i)}`);if(!r.ok)throw new Error("Failed to retrieve file list.");let l=(await r.json()).files||[],a=JSON.stringify({convId:i,files:l});if(a===this.lastFilesJson&&t&&t.children.length>1){!n&&e&&e(`Found ${l.length} structure files.`);return}if(this.lastFilesJson=a,t)if(t.textContent="",l.length===0){let c=document.createElement("option");c.value="",c.textContent="-- No structure files in this conversation --",t.appendChild(c)}else{let c=document.createElement("option");c.value="",c.textContent="-- Select a file --",t.appendChild(c);let u=this.currentWorkspacePath||"",p=(this.currentId?this.currentId.split("/").pop():"")||"",d=l.some(m=>u&&m===u||!u&&p&&m===p);l.forEach(m=>{let h=document.createElement("option");h.value=m,h.textContent=Xi(m);let g=u&&m===u||!u&&p&&m===p,f=!d&&(u&&m.endsWith("/"+u)||(this.currentSource==="workspace"||this.currentSource==="artifact")&&p&&m.endsWith("/"+p));(g||f)&&(h.selected=!0),t.appendChild(h)})}!n&&e&&e(`Found ${l.length} structure files.`)}catch(r){!n&&e&&e(`Error scanning files: ${r instanceof Error?r.message:String(r)}`)}}async handleLocalFileUpload(t,e){e(`Uploading & saving ${t.name}\u2026`);let n=new FileReader;n.onload=async i=>{let r=i.target?.result;if(!r)return;let s;try{s=await(await ee("./biomolecular/upload-file",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:t.name,content:r,conversationId:this.getConvId()})})).json()}catch(l){e(`Upload failed: ${l instanceof Error?l.message:String(l)}`);return}if(s.status!=="success"){e(`Upload failed: ${s.error??"unknown error"}`);return}e(`Saved ${t.name}`),await this.openWorkspaceFile(s.path||`.user_uploaded/${s.filename}`,e,Date.now())},n.onerror=()=>{e(`Upload failed: could not read ${t.name}`)},n.readAsText(t)}async openWorkspaceFile(t,e,n){try{await this.sendSwitchPatch({...ro(t),...n===void 0?{}:{revision:n}})}catch(i){e(`Could not open ${t}: ${i instanceof Error?i.message:String(i)}`)}}async initControlPanel(t){let e=d=>t.querySelector(d),n=t.querySelector("#bm-workspace-select"),i=e("#bm-refresh-files-btn"),r=e("#bm-local-file-input"),s=e("#bm-local-file-btn"),l=e("#bm-status-bar"),a=null,c=d=>{l&&(a&&(clearTimeout(a),a=null),l.textContent=d,d&&!d.endsWith("\u2026")&&!d.endsWith("...")&&(a=setTimeout(()=>{l.textContent===d&&(l.textContent="")},3e3)))};i&&(i.onclick=()=>this.loadWorkspaceFiles(n,c)),s&&r&&(s.onclick=()=>r.click(),r.onchange=async()=>{let d=r.files?.[0];d&&await this.handleLocalFileUpload(d,c)}),n&&(n.onfocus=()=>this.loadWorkspaceFiles(n,c,!0),n.onchange=async()=>{let d=n.value;d&&await this.openWorkspaceFile(d,c)}),this.panelStatus=c;let u=this.sidePanel();u&&(u.representation=this.currentPreset||"cartoon"),this.updateComponentChips();let p=async()=>{this.renderedNotesKey=this.notesRenderKey(),this.mountViewportCustomControls(),this.updateAnnotationsVisibilityButton(),this.updateSidePanelNotes(),await this.update3DMarkers()};this.renderUserNotes=p,this.loadWorkspaceFiles(n)}isMounted=!1;cleanupAll(){this.pinAnimFrame&&(cancelAnimationFrame(this.pinAnimFrame),this.pinAnimFrame=null),this.pinOverlay&&(this.pinOverlay.textContent="");try{this.viewer?.visual&&(typeof this.viewer.visual.clearSelection=="function"&&this.viewer.visual.clearSelection(),typeof this.viewer.visual.clearHighlight=="function"&&this.viewer.visual.clearHighlight())}catch{}}async reapplyVisualOverlays(){this.plddt.hasConfidence()&&await this.plddt.applyColoring(),this.plddt.updateLegend(),this.lastPaintedRibbons=[],await this.applyHighlights(!0),this.syncObservedToScene(),this.annotationsVisible&&await this.update3DMarkers()}async setStyle(t,e){return this.withEventSuppression(()=>this.setStyleInternal(t,e))}async setStyleInternal(t,e){if(!t)return!1;this.currentPreset=t;let n=this.sidePanel();if(n&&(n.representation=t),!this.viewer)return!1;let i=t.charAt(0).toUpperCase()+t.slice(1);e&&e(`Switching view to ${i}\u2026`);try{let r=this.viewer.plugin;await this.waitForStructureReady();let s=r?.managers?.structure?.hierarchy?.current?.structures;if(s&&s.length>0){let l=this.plddt.shouldColorByConfidence();this.plddt.setGlobalTheme(l);let a={type:Yi(t),color:l?ge:"default"},c=r.state.data.build();for(let u of s){let p=(u.components||[]).filter(Ct);if((u.components||[]).length===0)try{let d=await r.builders.structure.tryCreateComponentStatic(u.cell,"polymer");d&&(p=[d])}catch{}for(let d of p){if(!d?.cell)continue;let[m,...h]=d.representations||[];if(!m?.cell){r.builders.structure.representation.buildRepresentation(c,d.cell,a);continue}let g=this.representationParams(r,d,a);g?c.to(m.cell).update(g):(h.push(m),r.builders.structure.representation.buildRepresentation(c,d.cell,a));for(let f of h)c.delete(f.cell.transform.ref)}}return await c.commit(),this.plddt.updateLegend(),e&&e(`View switched to ${i}.`),!0}}catch(r){console.warn("[BiomolecularViewer] setStyle failed:",r)}return!1}representationParams(t,e,n){let i=t.state.data.build(),r=t.builders.structure.representation.buildRepresentation(i,e.cell,n)?.ref;return r?i.getTree().transforms.get(r)?.params:void 0}async waitForStructureReady(t=15e3){let e=this.viewer?.plugin;if(!e)return!1;let n=Date.now(),i=null;for(;Date.now()-n<t;){let r=e.managers?.structure?.hierarchy?.current?.structures,s=e.state?.data?.inTransaction||e.state?.data?.behaviors?.isUpdating?.value;if(r&&r.length>0){if(i=null,(r[0].components||[]).length>0&&!s)return!0}else if(s)i=null;else if(i??=Date.now(),Date.now()-i>=Ji)return!1;await new Promise(l=>setTimeout(l,50))}return(e.managers?.structure?.hierarchy?.current?.structures?.length||0)>0}async loadStructureAndShow(t,e,n,i){if(!this.viewerTarget)throw new Error("The structure viewer is not mounted.");let r=this.container?.querySelector("#bm-load-error");r&&(r.style.display="none");try{this.cleanupAll(),this.plddt.invalidate(),this.sceneSelections=[],this.sceneHighlights=[],this.observedHighlights=[],this.userNotes=[],this.forgetRangeAnchor(),typeof this.renderUserNotes=="function"&&this.renderUserNotes(),this.currentId=e,this.currentSource=n;let s=this.panelEl?this.panelEl.querySelector("#bm-workspace-select"):null;if(s)if(n==="workspace"||n==="artifact"){let d=this.currentWorkspacePath||e,m=!1;for(let h=0;h<s.options.length;h++){let g=s.options[h];if(g.value&&(g.value===d||g.value===e)){s.selectedIndex=h,m=!0;break}}if(!m)for(let h=0;h<s.options.length;h++){let g=s.options[h];if(g.value&&(d&&(g.value.endsWith("/"+d)||d.endsWith("/"+g.value))||e&&(g.value.endsWith("/"+e)||e.endsWith("/"+g.value)))){s.selectedIndex=h,m=!0;break}}if(!m&&d){let h=document.createElement("option");h.value=d,h.textContent=d,h.selected=!0,s.appendChild(h)}}else s.value="";this.currentStructureUrl=t,this.currentFormat=i;let l=i==="mmcif"?"cif":i,a={customData:{url:t,format:l,ext:l,binary:!1},bgColor:this.stageRgb()??te(),selectColor:Mn,hideControls:!1,hideCanvasControls:["expand","animation","controlToggle","controlSwitch","controlInfo","structureTools","screenshot","snapshotControls","snapshotDescription","trajectory","selection"],sequencePanel:this.sequencePanelVisible,leftPanel:!1,rightPanel:!1,logPanel:!1,landscape:!0,validationAnnotation:!1,domainAnnotation:!1,symmetryAnnotation:!1,alphafoldView:!1,defaultPreset:"default"};if(this.viewer?.initParams&&(this.viewer.initParams.hideCanvasControls=["expand","animation","controlToggle","controlSwitch","controlInfo","structureTools","screenshot","snapshotControls","snapshotDescription","trajectory","selection"],this.viewer.initParams.selectColor=Mn,this.viewer.initParams.defaultPreset="default",this.viewer.initParams.alphafoldView=!1,this.viewer.initParams.sequencePanel=this.sequencePanelVisible,this.viewer.initParams.leftPanel=!1,this.viewer.initParams.rightPanel=!1,this.viewer.initParams.logPanel=!1,this.viewer.initParams.landscape=!0),!this.isMounted||!this.viewer){if(!this.viewer&&(window.PDBeMolstarPlugin&&(this.viewer=new window.PDBeMolstarPlugin),!this.viewer))throw new Error("PDBeMolstarPlugin is not available on window.");await this.viewer.render(this.viewerTarget,{...a,customData:void 0,alphafoldView:!0}),this.isMounted=!0}this.plddt.setGlobalTheme(!1);try{await this.viewer.visual.update(a,!0)}catch(d){console.warn("[BiomolecularViewer] visual.update failed, falling back to render:",d),await this.viewer.render(this.viewerTarget,{...a,customData:void 0,alphafoldView:!0}),this.plddt.setGlobalTheme(!1),this.isMounted=!0}if(this.configurePluginControls(),this.syncSequencePanelState(),!await this.waitForStructureReady())throw new Error("the viewer loaded, but couldn't read a structure from this file: it may be missing, truncated, or not a macromolecular PDB or mmCIF file");this.updateComponentAvailability();let c=this.plddt.resolveForLoadedStructure();this.currentPreset&&this.currentPreset!=="cartoon"?await this.setStyle(this.currentPreset):c?await this.plddt.applyConfidenceColor():await this.plddt.applyDefaultColor(),this.plddt.updateLegend(),this.currentAnnotations=null;let u=this.sidePanel();u&&(u.domains=[]),await this.loadAnnotations(t,e);let p=d=>{let m=this.panelEl&&this.panelEl.querySelector("#bm-status-bar");m&&(m.textContent=d)};return this.hookInteractivity(p),await this.syncComponentVisibilityWithHierarchy(),await this.resetCamera(),this.currentId=e,this.currentSource=n,p&&p(`Loaded: ${e}`),{status:"rendered"}}catch(s){console.error(`[BiomolecularViewer] Failed to load ${e}:`,s);let l=`Failed to load ${e}: ${s instanceof Error?s.message:String(s)}`,a=this.container?.querySelector("#bm-load-error");return a?(a.textContent=`Error \u2014 ${l}`,a.style.display="block"):this.container&&ce(O`
          <div class="bm-load-error" style="display:block">
            Error — ${l}
          </div>
        `,this.container),{status:"failed",message:l}}}async resetCamera(){try{await this.viewer?.visual?.reset?.({camera:!0})}catch(t){console.warn("[BiomolecularViewer] Error resetting the camera:",t)}}getConvId(){if(this.context&&typeof this.context.getConversationId=="function"){let e=this.context.getConversationId();if(e&&e!=="null"&&e!=="undefined"&&e!=="")return e}let t=new URLSearchParams(window.location.search);return t.get("conversationId")||t.get("convId")||""}configurePluginControls(){let t=this.viewer?.plugin;if(!(!t||!t.config))try{let e=t.config;if(typeof e.set!="function")return;let n=[/reset/i];for(let[i]of e.entries?.()||[]){let r=String(i&&(i.key||i.name)||i);if(r.startsWith("viewport.")){let s=n.some(l=>l.test(r));e.set(i,s)}}}catch(e){console.warn("[BiomolecularViewer] Failed to configure plugin viewport controls:",e)}}selectionsPatchFor(t,e){let n=Xt(t,e,this.idFloor,this.residueNameLookup);return this.idFloor=Math.max(this.idFloor,n.nextSelectionId??1),n}async syncUserNotes(t=[]){let e=[];for(let r of this.userNotes){(typeof r.id!="string"||!r.id)&&(r.id=xe([...this.sceneSelections,...this.userNotes],this.idFloor));let s=on(r,r.id);s&&e.push(s)}let n=[...t,...this.sceneSelections];this.sceneSelections=Ve(this.sceneSelections,"labelled",e);let i={...this.selectionsPatchFor(this.sceneSelections,n),annotations:this.annotationsVisible};await this.sendStructurePatch(i)}notesRenderKey(){return JSON.stringify([this.annotationsVisible,this.userNotes])}residueNameCache=null;residueNameLookup=(t,e)=>this.residueNameAt(t,e);residueNameAt(t,e){let i=this.viewer?.plugin?.managers?.structure?.hierarchy?.current?.structures?.map(r=>r.cell?.obj?.data).filter(Boolean)||[];if(i.length!==0)return(!this.residueNameCache||this.residueNameCache.source!==i[0])&&(this.residueNameCache={source:i[0],names:cn(i)}),this.residueNameCache.names.get(Xe(t,e))}residueRangeLabel(t){let e=(t.chain||"A").toUpperCase(),n=i=>{let r=this.residueNameAt(e,i);return r?`${r} ${i}`:`${i}`};return t.start===t.end?`${e} | ${n(t.start)}`:`${e} | ${n(t.start)}\u2013${n(t.end)}`}saveComponentPreferences(t=this.loadedKey){this.sendStructurePatch({components:{...this.components}},t)}updateComponentChips(){let t=this.sidePanel();t&&(t.components={...this.components})}updateComponentAvailability(){let t=this.viewer?this.viewer.plugin:null;if(!t)return;let e=this.sidePanel();e&&(e.availableComponents=Tt(t))}async toggleComponent(t,e){let n=this.viewer?this.viewer.plugin:null;n&&await this.withEventSuppression(()=>Pt(n,t,e))}async syncComponentVisibilityWithHierarchy(){if(this.viewer?.plugin){for(let t of Q)await this.toggleComponent(t.kind,this.components[t.key]);await this.plddt.applyColoring()}}hookInteractivity(t){let e=this.viewer?this.viewer.plugin:null;if(e){for(let n of this.pluginSubs)try{n.unsubscribe()}catch{}this.pluginSubs=[],this.ensurePinOverlay();try{if(e.managers?.structure?.selection?.events?.changed){let n=e.managers.structure.selection.events.changed.subscribe(()=>{this.updateSelection()});n&&typeof n.unsubscribe=="function"&&this.pluginSubs.push(n)}if(e.behaviors&&e.behaviors.interaction){let n=e.behaviors.interaction.click.subscribe(i=>{if(!i||!i.current)return;this.selectFromClick(i);let r=i.current.loci;if(!r||r.kind==="empty-loci"){t&&t("Selection cleared");return}let l=an(r);if(!l||l.auth_seq_id===void 0)return;let a=l.auth_comp_id?`${l.auth_comp_id} ${l.auth_seq_id}`:`${l.auth_seq_id}`,c=l.auth_asym_id?`${l.auth_asym_id} | ${a}`:a;t&&t(`Selected: ${c}`)});n&&typeof n.unsubscribe=="function"&&this.pluginSubs.push(n),this.disableModifierClickFocus(),this.watchUserHighlights(),this.watchPickingGranularity(),this.updateSelection()}this.watchCameraClipping()}catch(n){console.warn("[BiomolecularViewer] Interactivity hook error:",n)}}}watchCameraClipping(){let t=this.viewer?.plugin?.canvas3d?.didDraw;if(!t||typeof t.subscribe!="function")return;let e=t.subscribe(()=>{this.restoreClippedStructure()});e&&typeof e.unsubscribe=="function"&&this.pluginSubs.push(e)}restoreClippedStructure(){let t=this.viewer?.plugin?.canvas3d,e=t?.camera;if(!e?.state||e.transition?.inTransition)return;let n=t.boundingSphereVisible;if(!n||typeof e.getTargetDistance!="function")return;let i=yt(e.state,n,e.getTargetDistance(n.radius));i!==null&&e.setState({radius:i,radiusMax:Math.max(e.state.radiusMax??0,i)},0)}ensurePinOverlay(){if(!this.viewerTarget)return;let t=this.viewerTarget.querySelector(".msp-viewport")||this.viewerTarget,e=t.querySelector("#bm-pin-overlay");e||(e=document.createElement("div"),e.id="bm-pin-overlay",e.className="bm-pin-overlay",t.appendChild(e)),this.pinOverlay=e}mountViewportCustomControls(){let t=this.container?.querySelector(".biomolecular-viewer-root")||this.viewerTarget;if(!t)return;let e=t.querySelector("#bm-viewport-custom-controls")||this.customControlsEl;if(!e)return;this.customControlsEl=e;let i=this.viewerTarget?.querySelector(".msp-viewport-controls")??this.viewerTarget;i&&e.parentElement!==i&&i.appendChild(e)}rootEl(){return this.container?.querySelector(".biomolecular-viewer-root")||this.viewerTarget}sidePanel(){let t=this.rootEl()?.querySelector("bm-side-panel")??null;return t&&!this.wiredPanels.has(t)&&(this.wiredPanels.add(t),this.wireSidePanel(t)),t}wireSidePanel(t){let e=(n,i)=>{t.addEventListener(n,r=>{i(r.detail)})};e("rep-change",({rep:n})=>{let i=this.loadedKey;this.setStyle(n,this.panelStatus).then(()=>{this.sendStructurePatch({style:n},i)})}),e("component-toggle",({key:n})=>{this.toggleComponentChip(n)}),e("confidence-toggle",()=>{this.plddt.toggleLegend()}),e("granularity-change",({granularity:n})=>{this.setPickingGranularity(n)}),e("selection-remove",({item:n})=>{this.removeSelectionItem(n)}),e("selection-clear",()=>{this.clearMolstarSelection()}),e("selection-save",({hex:n,text:i})=>{this.saveSelection(n,i)}),e("annotations-toggle",()=>{this.toggleAnnotationsVisible()}),e("delete-all-annotations",()=>{this.deleteSelections(this.sceneSelections)}),e("annotation-rename",({index:n,text:i})=>{this.renameSelection(n,i)}),e("annotation-delete",({index:n})=>{let i=this.sceneSelections[n];i&&this.deleteSelections([i])}),e("annotation-zoom",({index:n,residue:i})=>{let r=this.sceneSelections[n],s=r&&this.notePart(r,i);s&&Je(this.viewer,s,this.panelStatus)}),e("annotation-hover",({index:n,residue:i})=>{let r=this.sceneSelections[n];this.clearHoverHighlight();let s=r&&this.notePart(r,i);s&&this.hoverHighlight(s)}),e("annotation-hover-end",()=>{this.clearHoverHighlight()}),e("panel-resize",()=>{this.requestViewerResize()})}notePart(t,e){if(t.residues.length===0)return null;let n=Be(t);if(e===null)return n;let i=re(t)[e];return i?i.ranges.length>0?{...n,ranges:i.ranges}:null:n}hoverHighlight(t){let e=We(t,ae(t),!1);if(e.length===0)return;let n=this.viewer,i=n?.plugin?.managers?.interactivity?.lociHighlights;try{if(typeof n?.getLociForParams=="function"&&typeof i?.highlightOnly=="function"){let r=n.getLociForParams(e);r&&r.kind!=="empty-loci"&&i.highlightOnly({loci:r},!1);return}n?.visual?.highlight?.({data:e})}catch(r){console.warn("[BiomolecularViewer] Could not highlight:",r)}}clearHoverHighlight(){let t=this.viewer?.visual;typeof t?.clearHighlight=="function"&&t.clearHighlight()}async deleteSelections(t){let e=new Set(t.map(r=>r.id));if(e.size===0)return;let n=this.sceneSelections.filter(r=>!e.has(r.id)),i=t.some(D);i&&(this.userNotes=Ee(n)),await this.commitSelectionEdit(n,i)}updateSidePanelNotes(){let t=this.sidePanel();t&&(t.notes=this.sceneSelections.map(e=>({id:e.id,text:D(e)?e.label??"":"",color:we(e),residues:this.chipLabels(e)})))}async toggleComponentChip(t){let e=Q.find(i=>i.key===t);if(!e)return;let n=this.loadedKey;this.components[t]=!this.components[t],this.updateComponentChips(),this.panelStatus?.(`${this.components[t]?"Showing":"Hiding"} ${e.label}\u2026`),await this.toggleComponent(e.kind,this.components[t]),await this.reapplyVisualOverlays(),this.saveComponentPreferences(n)}ensureSidePanel(){let t=this.rootEl();if(!t)return;this.mountViewportCustomControls();let e=t.querySelector("#bm-toggle-panel-btn");e&&!e.hasClickListener&&(e.hasClickListener=!0,e.addEventListener("click",n=>{n.stopPropagation(),this.setSidePanelOpen(!this.sidePanelOpen)})),this.updateSidePanel(),this.updateAnnotationsVisibilityButton()}setSidePanelOpen(t){this.sidePanelOpen=t,oo(t),this.updateSidePanel(),this.requestViewerResize()}requestViewerResize(){requestAnimationFrame(()=>{try{this.viewer?.plugin?.canvas3d?.handleResize?.()}catch(t){console.debug("[BiomolecularViewer] canvas resize failed:",t)}window.dispatchEvent(new Event("resize"))})}updateSidePanel(){let t=this.rootEl();if(!t)return;let e=this.sidePanel();e&&(e.hidden=!this.sidePanelOpen);let n=t.querySelector("#bm-toggle-panel-btn");if(!n)return;let i=this.sidePanelOpen?"Hide the controls panel":"Show the controls panel";n.title=i,n.setAttribute("aria-label",i),n.setAttribute("aria-expanded",String(this.sidePanelOpen));let r=n.querySelector(".material-symbols-outlined");r&&(r.textContent=this.sidePanelOpen?"right_panel_close":"right_panel_open")}toggleAnnotationsVisible(){this.annotationsVisible=!this.annotationsVisible,this.updateAnnotationsVisibilityButton(),this.flashAnnotationModeStatus(),typeof this.renderUserNotes=="function"?this.renderUserNotes():this.update3DMarkers(),this.sendStructurePatch({annotations:this.annotationsVisible})}flashAnnotationModeStatus(){let t=this.panelEl?.querySelector("#bm-status-bar");t&&(t.textContent=this.annotationsVisible?"Annotations shown.":"Annotations hidden.",setTimeout(()=>{t.textContent?.startsWith("Annotations ")&&(t.textContent="")},3500))}updateAnnotationsVisibilityButton(){let t=this.sidePanel();t&&(t.annotationsVisible=this.annotationsVisible)}ensureSequenceHeader(){let t=this.container?.querySelector(".biomolecular-viewer-root")||this.viewerTarget;if(!t)return null;let e=t.querySelector("#bm-sequence-header");if(e&&!e.hasClickListener&&(e.hasClickListener=!0,e.addEventListener("click",n=>{n.stopPropagation(),this.setSequencePanelVisible(!0)})),!this.sequenceRowObserver&&this.viewerTarget&&typeof MutationObserver<"u"){let n=!1;this.sequenceRowObserver=new MutationObserver(()=>{n||(n=!0,requestAnimationFrame(()=>{n=!1,this.injectSequenceHideButton()}))}),this.sequenceRowObserver.observe(this.viewerTarget,{childList:!0,subtree:!0})}return this.injectSequenceHideButton(),this.updateSequenceHeader(),e}setSequencePanelVisible(t){this.sequencePanelVisible=t,this.syncSequencePanelState()}injectSequenceHideButton(){let t=this.viewerTarget?.querySelector(".msp-sequence-select");if(!t)return;let e=Array.from(t.children).find(a=>a instanceof HTMLElement&&a.tagName==="SPAN"&&/^Sequence( of)?$/.test(a.textContent?.trim()??"")),n=`Hide sequence${e?.textContent?.trim().endsWith(" of")?" of":""}`,i=t.querySelector(".bm-sequence-hide-btn");if(i){let a=i.querySelector(".bm-sequence-hide-text");a&&a.textContent!==n&&(a.textContent=n),e&&e.style.display!=="none"&&(e.style.display="none");return}let r=document.createElement("button");r.type="button",r.className="bm-sequence-hide-btn",r.title="Hide the sequence panel",r.setAttribute("aria-expanded","true");let s=document.createElement("span");s.className="material-symbols-outlined",s.setAttribute("aria-hidden","true"),s.textContent="expand_less";let l=document.createElement("span");l.className="bm-sequence-hide-text",l.textContent=n,r.append(s,l),r.addEventListener("click",a=>{a.stopPropagation(),this.setSequencePanelVisible(!1)}),e?(e.style.display="none",t.insertBefore(r,e)):t.prepend(r)}updateSequenceHeader(){let t=this.container?.querySelector(".biomolecular-viewer-root")||this.viewerTarget;if(!t)return;let e=t.querySelector("#bm-sequence-header");e&&(e.hidden=this.sequencePanelVisible,e.setAttribute("aria-expanded",String(this.sequencePanelVisible)))}syncSequencePanelState(){this.rootEl()?.toggleAttribute("data-sequence-hidden",!this.sequencePanelVisible);try{this.syncThemeBg();let t=this.viewer?.plugin;if(t?.layout){let e=t.layout.state,n=this.sequencePanelVisible?"full":"hidden";t.layout.setProps({regionState:{...e?.regionState,left:"hidden",right:"hidden",bottom:"hidden",top:n}}),requestAnimationFrame(()=>{t.canvas3d?.handleResize?.()})}}catch(t){console.debug("[BiomolecularViewer] Error syncing sequence state:",t)}this.updateSequenceHeader()}async loadAnnotations(t,e){let n="";t.includes("path=")&&(n=new URLSearchParams(t.split("?")[1]).get("path")||"");let i=e||this.currentId||"",r=this.getConvId();try{let s=`./biomolecular/get-annotations?conversationId=${encodeURIComponent(r)}&path=${encodeURIComponent(n)}&id=${encodeURIComponent(i)}`,l=await fetch(s);if(l.ok){let a=await l.json();if(a&&a.domains&&a.domains.length>0){this.currentAnnotations=a;let c=this.sidePanel();c&&(c.domains=a.domains.map(u=>({start:u.start,end:u.end,length:u.length})))}}}catch(s){console.warn("[BiomolecularViewer] Annotations fetch error:",s)}}async update3DMarkers(){if(!this.viewer)return;if(!this.annotationsVisible){this.pinOverlay&&this.pinOverlay.querySelectorAll(".bm-pin").forEach(n=>n.remove()),await this.applyAnnotationHighlights();return}let t=()=>{let n=this.viewer?.plugin,r=n?.managers?.structure?.hierarchy?.current?.structures?.[0];return!n||!n.canvas3d||!r||!r.components?!1:r.components.some(s=>s.representations&&s.representations.length>0)},e=0;for(;!t()&&e<30;){if(!this.annotationsVisible){await this.applyAnnotationHighlights();return}await new Promise(n=>setTimeout(n,200)),e++}if(!t()){console.warn("[BiomolecularViewer] Viewer failed to become ready for markers.");return}if(!this.annotationsVisible){await this.applyAnnotationHighlights();return}await this.applyAnnotationHighlights(),this.updatePinOverlays()}async applyOverpaints(t){let e=this.viewer?.visual;t.length===0||!e||typeof e.select!="function"||await this.withEventSuppression(async()=>{try{await e.select({data:t,keepColors:!0,keepRepresentations:!0})}catch(n){console.warn("[BiomolecularViewer] Failed to apply overpaints:",n)}})}async clearVisualHighlights(){let t=this.viewer?.visual;t&&typeof t.clearSelection=="function"&&await this.withEventSuppression(async()=>{try{await t.clearSelection(void 0,{keepColors:!1,keepRepresentations:!0})}catch(e){console.warn("[BiomolecularViewer] clearSelection failed:",e)}}),this.lastPaintedRibbons=[]}syncObservedToScene(){this.observedHighlights=ie(this.sceneHighlights)}async applyHighlights(t=!1){t||await this.clearVisualHighlights(),await this.paintSelections(!0)}get isEventSuppressed(){return this.eventSuppressionDepth>0}async withEventSuppression(t){this.eventSuppressionDepth++;try{return await t()}finally{this.eventSuppressionDepth--}}watchUserHighlights(){let t=this.viewer?.plugin;if(!t?.state?.data?.events?.cell?.stateUpdated)return;let e=t.state.data.events.cell.stateUpdated.subscribe(n=>{if(this.isEventSuppressed)return;let i=n?.cell?.transform?.tags;(n?.cell?.transform?.transformer?.id?.includes("overpaint")||Array.isArray(i)&&i.includes("overpaint-controls"))&&(this.userHighlightDebounceTimer&&clearTimeout(this.userHighlightDebounceTimer),this.userHighlightDebounceTimer=setTimeout(()=>{if(!this.isEventSuppressed)try{let s=this.extractOverpaints();if(s!==null&&JSON.stringify(s)!==JSON.stringify(this.observedHighlights)&&JSON.stringify(s)!==JSON.stringify(xt(this.sceneHighlights))){let l=Qt(this.sceneSelections,this.sceneHighlights,s);this.observedHighlights=l.highlights,this.sceneHighlights=l.highlights;let a=this.sceneSelections;if(this.sceneSelections=Ve(l.selections,"color",Zt(l.highlights,l.selections,this.idFloor),this.idFloor),l.recolored.size>0){for(let c of this.userNotes){let u=typeof c.id=="string"?l.recolored.get(c.id):void 0;u&&(c.color=u)}this.syncUserNotes(a).then(()=>this.renderUserNotes?.()).catch(c=>{console.warn("[biomolecular] failed to recolor notes",c)})}else this.sendStructurePatch(this.selectionsPatchFor(this.sceneSelections,a))}}catch(s){console.warn("[biomolecular] failed to read user highlights",s)}},300))});e&&typeof e.unsubscribe=="function"&&this.pluginSubs.push(e)}watchPickingGranularity(){let t=this.viewer?.plugin?.managers?.interactivity?.events?.propsUpdated;if(!t||typeof t.subscribe!="function")return;let e=t.subscribe(()=>{this.updateSelection()});e&&typeof e.unsubscribe=="function"&&this.pluginSubs.push(e)}selectFromClick(t){let e=this.viewer?.plugin;if(!e||e.selectionMode||t.button!==void 0&&t.button!==1)return;let n=t.modifiers??{};if(n.alt)return;let i=e.managers?.interactivity?.lociSelects;if(!i)return;let r=t.current?.loci,s=!r||r.kind==="empty-loci",l=n.control||n.meta;if(l&&s)return;let a=e.managers?.structure?.focus;try{if(s){i.deselectAll(),this.forgetRangeAnchor();return}let c=i.normalizedLoci?.({loci:r},!0)?.loci??r;if(l)i.toggle({loci:r}),a&&(a.referenceLoci=c),this.focusSelection(c,!0);else if(n.shift){let u=a?.tryGetRange?.(c);i.select({loci:u??r}),this.focusSelection(u??c)}else i.selectOnly({loci:r}),a&&(a.referenceLoci=c)}catch(c){console.warn("[BiomolecularViewer] Could not select:",c)}}focusSelection(t,e=!1){let n=this.viewer?.plugin,i=n?.managers?.structure?.focus;if(typeof i?.setFromLoci!="function")return;let r=t?.structure,s=n.managers.structure.selection?.getLoci?.(r),l=i.referenceLoci;if(e&&s&&!s.elements?.length){i.clear?.(),i.referenceLoci=l;return}let a=s?.elements?.length?s:t;i.setFromLoci(a),i.referenceLoci=l,n.managers?.camera?.focusLoci?.(a)}disableModifierClickFocus(){let t=e=>e.filter(n=>!n?.modifiers?.control&&!n?.modifiers?.meta);this.editClickBindings("ms-plugin.representation-focus-loci",{clickFocusExtend:()=>[],clickFocusAdd:()=>[]}),this.editClickBindings("ms-plugin.camera-focus-loci",{clickCenterFocus:t,clickResetCameraOnEmpty:t})}editClickBindings(t,e){let n=this.viewer?.plugin,i=n?.state?.behaviors;try{let r=i?.cells?.get?.(t)?.transform?.params;if(!r?.bindings)return;let s={...r.bindings},l=!1;for(let[c,u]of Object.entries(e)){let p=s[c];if(!Array.isArray(p?.triggers))continue;let d=u(p.triggers);d.length!==p.triggers.length&&(s[c]=d.length===0?{triggers:[],action:"",description:""}:{...p,triggers:d},l=!0)}if(!l)return;let a=i.build().to(t).update({...r,bindings:s});Promise.resolve(n.runTask(i.updateTree(a))).catch(c=>{console.warn(`[BiomolecularViewer] ${t} bindings kept:`,c)})}catch(r){console.warn(`[BiomolecularViewer] ${t} bindings kept:`,r)}}selectedResidueRanges(){return dn(this.viewer?.plugin)}updateSelection(){this.selectedRanges=this.selectedResidueRanges(),this.scheduleSelectedRangesPost();let t=this.sidePanel();t&&(t.selection={ranges:this.selectedRanges,items:this.selectionItems()},t.granularity=this.pickingGranularity())}scheduleSelectedRangesPost(){this.selectedRangesDebounceTimer&&clearTimeout(this.selectedRangesDebounceTimer),this.selectedRangesDebounceTimer=setTimeout(()=>{this.selectedRangesDebounceTimer=null;let t=He(this.selectedRanges,this.residueNameLookup),e=JSON.stringify(t);e!==this.postedSelectedRanges&&(this.postedSelectedRanges=e,this.sendStatePatch({activeSelection:t}).catch(n=>{console.warn("[biomolecular] failed to post active selection",n)}))},Qi)}selectionItems(){let t=[],e=re({residues:this.selectedRanges,chains:this.selectedWholeChains()});for(let n of e){if(n.chain){t.push({label:ve(n),ranges:n.ranges,chain:!0});continue}let i=n.ranges[0];if(i.end-i.start+1>Zi){t.push({label:this.residueRangeLabel(i),ranges:[i]});continue}for(let r=i.start;r<=i.end;r++){let s={...i,start:r,end:r};t.push({label:this.residueRangeLabel(s),ranges:[s]})}}return t}removeSelectionItem(t){let e=this.viewer,n=e?.plugin?.managers?.interactivity?.lociSelects;if(!n||typeof e.getLociForParams!="function")return;let i=t.chain?[{auth_asym_id:$(t.ranges[0]??{})}]:t.ranges.map(r=>({auth_asym_id:$(r),start_auth_residue_number:r.start,end_auth_residue_number:r.end}));try{let r=e.getLociForParams(i);r&&r.kind!=="empty-loci"&&n.deselect({loci:r},!1)}catch(r){console.warn("[BiomolecularViewer] Could not deselect:",r)}this.updateSelection()}resolvePendingChains(t){return Vt(t,e=>this.chainResidues(e))}chainResidues(t){let e=this.viewer,n=e?.plugin?.managers?.structure?.hierarchy?.current?.structures;if(typeof e?.getLociForParams!="function"||!n?.length)return null;let i=this.chainResidueCache;(!i||i.structures!==n)&&(i={structures:n,byChain:new Map},this.chainResidueCache=i);let{byChain:r}=i,s=r.get(t);if(s)return s;try{let l=un(e.getLociForParams([{auth_asym_id:t}]),t);return r.set(t,l),l}catch(l){return console.warn(`[BiomolecularViewer] Could not find chain ${t}:`,l),null}}pickingGranularity(){return this.viewer?.plugin?.managers?.interactivity?.props?.granularity==="chain"?"chain":"residue"}setPickingGranularity(t){try{this.viewer?.plugin?.managers?.interactivity?.setProps?.({granularity:t})}catch(e){console.warn("[BiomolecularViewer] Could not set the granularity:",e)}this.forgetRangeAnchor(),this.updateSelection()}onDocumentKeyDown=t=>{if(t.key!=="Escape"||this.selectedRanges.length===0)return;let e=t.composedPath()[0];e instanceof HTMLElement&&(e.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(e.tagName))||this.clearMolstarSelection()};clearMolstarSelection(){try{this.viewer?.plugin?.managers?.interactivity?.lociSelects?.deselectAll(),this.viewer?.plugin?.managers?.structure?.focus?.clear?.()}catch(t){console.warn("[BiomolecularViewer] Could not clear the selection:",t)}this.forgetRangeAnchor(),this.updateSelection()}forgetRangeAnchor(){let t=this.viewer?.plugin?.managers?.structure?.focus;t&&(t.referenceLoci=void 0)}selectedWholeChains(){return Ft(this.selectedRanges,t=>this.chainResidues(t))}chipLabels(t){return re(t).map(e=>ve(e,n=>this.residueRangeLabel(n)))}async colorSelectedResidues(t){if(!N(t))return;let e=this.selectedRanges;if(e.length===0)return;let n=en(this.sceneSelections,e,t,this.idFloor,this.selectedWholeChains());await this.commitSelectionEdit(n.selections),this.clearMolstarSelection()}async saveSelection(t,e){let n=this.selectedRanges;if(n.length===0){this.panelStatus?.(eo);return}let i=e.trim();if(!i){await this.colorSelectedResidues(t);return}let r=tn(this.sceneSelections,n,i,t,this.idFloor,this.selectedWholeChains()).selections;await this.commitNoteEdit(r),this.clearMolstarSelection(),this.panelStatus?.(to)}async renameSelection(t,e){let n=e.trim(),i=this.sceneSelections[t];if(!n||!i)return;let r=D(i)?nn(this.sceneSelections,i.id,i.residues,n,i.color):this.sceneSelections.map(s=>s.id===i.id?{...s,label:n,color:we(s)}:s);r&&await this.commitNoteEdit(r)}async commitNoteEdit(t){let e=this.loadedKey,n=this.sceneSelections;this.sceneSelections=t,this.sceneHighlights=ke(t),this.userNotes=Ee(t),this.annotationsVisible=!0,this.updateAnnotationsVisibilityButton(),await this.withEventSuppression(async()=>{await this.applyHighlights(),this.syncObservedToScene(),await this.renderUserNotes?.()});let i={...this.selectionsPatchFor(t,n),annotations:!0};await this.sendStructurePatch(i,e).catch(r=>{console.warn("[biomolecular] failed to save the note",r)})}async commitSelectionEdit(t,e=!1){let n=this.loadedKey,i=this.sceneSelections;this.sceneSelections=t,this.sceneHighlights=ke(t),await this.withEventSuppression(async()=>{await this.applyHighlights(),this.syncObservedToScene(),e&&await this.renderUserNotes?.()});let r=this.selectionsPatchFor(t,i);await this.sendStructurePatch(r,n).catch(s=>{console.warn("[biomolecular] failed to save selections",s)})}extractOverpaints(){let t=this.viewer?.plugin,e=t?.managers?.structure?.hierarchy?.current?.structures;if(!e?.length)return null;let n=[],i=!1;for(let r of e){let s=r.cell?.obj?.data;if(r.components)for(let l of r.components){let a=l.cell?.transform?.tags;if(!(Array.isArray(a)&&a.includes("pdbe-molstar.added-component"))&&l.representations)for(let c of l.representations){let u=c.cell?.transform?.ref;if(!(!u||!t.state?.data?.cells)){i=!0;for(let p of t.state.data.cells.values()){let d=p.transform?.tags;if(p.transform?.parent!==u||!p.transform?.transformer?.id?.includes("overpaint")&&!(Array.isArray(d)&&d.includes("overpaint-controls")))continue;let m=p.params?.values?.layers||p.transform?.params?.layers||[],h=[];for(let g of m){if(!g?.bundle||!g.clear&&g.color===void 0)continue;let f=this.bundleToHighlight(g.bundle,g.color??0,s);f&&(h=g.clear?me(h,f.residues):he(h,f))}n.push(...h)}}}}}return i?St(n,this.lastPaintedRibbons.map(r=>({color:r.color,residues:r.residues})),this.sceneHighlights):null}bundleToHighlight(t,e,n){try{let i=wt(e),r=[],s=t?.elements||[],l=n?.unitMap,a=(p,d)=>p&&typeof p.value=="function"?p.value(d):p?p[d]:null,c=(p,d)=>{let m=p?.index;if(!m)return null;if(typeof m=="function")return m(d);if(typeof m.get=="function")return m.get(d);let h=m[d];return typeof h=="number"?h:null},u=(p,d)=>{let m=p?.model?.atomicHierarchy;if(!m)return null;let h=p.elements?p.elements[d]??d:d,g=c(m.residueAtomSegments,h);if(g===null)return null;let f=a(m.residues?.auth_seq_id,g),w=c(m.chainAtomSegments,h)??0,S=a(m.chains?.auth_asym_id,w)??"";if(f==null)return null;let E=Number(f);return Number.isFinite(E)?{seqId:E,chain:S}:null};for(let p of s){let d=[];if(l&&p.groupedUnits)for(let f of p.groupedUnits){let w=Array.isArray(f)?f:f&&typeof f.length=="number"?Array.from(f):[f];for(let S of w){let E=l.get?.(S)??l[S];E&&d.push(E)}}if(d.length===0)continue;let m=[],h=p.ranges;if(h){let f=typeof h.length=="number"?h.length:typeof h.size=="number"?h.size:0,w=S=>typeof h.get=="function"?h.get(S):h[S];for(let S=0;S<f-1;S+=2){let E=w(S),T=w(S+1);E!==void 0&&T!==void 0&&m.push([E,T])}}let g=p.set;if(g){let f=typeof g.length=="number"?g.length:typeof g.size=="number"?g.size:0,w=S=>typeof g.get=="function"?g.get(S):g[S];for(let S=0;S<f;S++){let E=w(S);E!==void 0&&m.push([E,E])}}for(let f of d)for(let[w,S]of m){let E=u(f,w),T=u(f,S);E&&T&&r.push({chain:E.chain||void 0,start:E.seqId,end:T.seqId})}}return r.length===0?null:{residues:r,color:i}}catch(i){return console.debug("[BiomolecularViewer] Failed to parse overpaint bundle:",i),null}}async applyAnnotationHighlights(){await this.paintSelections(!1)}hasLiveRepresentations(){let e=this.viewer?.plugin?.managers?.structure?.hierarchy?.current?.structures?.[0],n=e?.components?.some(i=>i.representations&&i.representations.length>0);return!!(e?.cell?.obj&&n)}async paintSelections(t){if(!this.viewer)return;let e=this.lastPaintedRibbons;this.lastPaintedRibbons=[],e.length>0&&await this.clearAnnotationHighlights(e);let n=this.annotationsVisible&&qe(this.sceneSelections).length>0&&this.hasLiveRepresentations(),i=n?ze(this.sceneSelections,{labelled:!0}).filter(l=>l.labelled):[],r=t?void 0:[...e,...i].flatMap(l=>l.residues);if(r&&r.length===0)return;let s=ze(this.sceneSelections,{labelled:n,touching:r});this.lastPaintedRibbons=i;try{await this.applyOverpaints(s.flatMap(l=>l.residues.map(a=>({auth_asym_id:(a.chain||"A").toUpperCase(),start_auth_residue_number:a.start,end_auth_residue_number:a.end,color:l.color,focus:!1}))))}catch(l){console.warn("[BiomolecularViewer] Error painting selections:",l)}}async clearAnnotationHighlights(t){if(!this.viewer||t.length===0)return;let e=t.flatMap(n=>n.residues.map(i=>({auth_asym_id:(i.chain||"A").toUpperCase(),start_auth_residue_number:i.start,end_auth_residue_number:i.end})));e.length!==0&&await this.withEventSuppression(async()=>{try{let n=this.viewer.getStructures?.()||[],i=this.viewer?.plugin;if(i&&n.length>0)for(let r of n){let s=r.structureRef;if(!s||!s.components)continue;let l=this.viewer.getSelections?.(e,r.number)||[];if(l.length===0)continue;let a=l.map(p=>({bundle:p.bundle,color:0,clear:!0})),c=i.build(),u=!1;for(let p of s.components){let d=p.cell?.transform?.tags;if(!(Array.isArray(d)&&d.includes("pdbe-molstar.added-component"))&&p.representations)for(let m of p.representations){let h=m.cell?.transform?.ref;if(!h)continue;let g=null;if(i.state?.data?.cells){for(let f of i.state.data.cells.values())if(f.transform?.parent===h&&(f.transform?.transformer?.id?.includes("overpaint")||f.transform?.transformer?.info?.name?.includes("overpaint")||Array.isArray(f.transform?.tags)&&f.transform.tags.includes("overpaint-controls")||f.transform?.tags==="overpaint-controls")){g=f;break}}g&&(c.to(g.transform.ref).update(f=>({layers:(f.layers||[]).concat(a)})),u=!0)}}u&&await c.commit()}}catch(n){console.warn("[BiomolecularViewer] Error clearing annotation highlights by residue IDs:",n)}})}updatePinOverlays(){if(this.ensurePinOverlay(),!this.pinOverlay||(this.pinOverlay.querySelectorAll(".bm-pin").forEach(i=>i.remove()),this.pinAnimFrame&&(cancelAnimationFrame(this.pinAnimFrame),this.pinAnimFrame=null),!this.annotationsVisible||!this.userNotes||this.userNotes.length===0||!this.viewer))return;let t=this.userNotes.map((i,r)=>{let s=be(i);return s?{note:i,range:s,idx:r}:null}).filter(Boolean);if(t.length===0)return;let e=t.map(i=>{let r=document.createElement("div");r.className="bm-pin";let s=ae(i.note);r.style.setProperty("--bm-note-color",s);let l=this.chipLabels({residues:X(i.note),chains:i.note.chains}).join(", ")||i.note.region||`${i.note.chain_id||i.note.chain||"A"} ${i.note.residue_number||i.range.start}`,a=i.note.note||"";ce(O`
        ${Tn("var(--bm-note-color)",rn(s,.17))}
        <div class="bm-pin-tooltip">
          <div class="bm-pin-label">${l}</div>
          <div class="bm-pin-note-text">${a}</div>
          <div class="bm-tooltip-arrow"></div>
        </div>
      `,r);let c=r.querySelector(".bm-pin-tooltip");return r.addEventListener("mouseenter",()=>{c&&(r.style.zIndex="50",c.style.opacity="1")}),r.addEventListener("mouseleave",()=>{c&&(r.style.zIndex="",c.style.opacity="0")}),r.addEventListener("click",u=>{u.stopPropagation(),Je(this.viewer,i.note)}),this.pinOverlay.appendChild(r),{el:r,range:i.range,note:i.note}}),n=i=>{let r=this.viewer?.plugin,l=r?.managers?.structure?.hierarchy?.current?.structures?.map(u=>u.cell?.obj?.data).filter(Boolean)||[];if(!r||!r.canvas3d||l.length===0){i>0?setTimeout(()=>n(i-1),300):console.warn("[BiomolecularViewer] Structure data not ready after retries. Pins hidden.");return}let a=e.map(u=>{let p=Math.floor((u.range.start+u.range.end)/2),d=u.note.chain_id||u.note.chain;if(u.note.region){let g=u.note.region.match(/^([A-Za-z0-9_]+)\s*\|/);g&&(d=g[1])}let m=u.note.component_id||u.note.residue_name;m&&!/^[A-Za-z0-9]{1,4}$/.test(m.trim())&&(m=void 0);let h=Ye(l,p,d,m);return{el:u.el,pos:h,midRes:p,chainId:d,compId:m}}),c=()=>{try{let u=this.viewer?.plugin?.managers?.structure?.hierarchy?.current?.structures?.map(y=>y.cell?.obj?.data).filter(Boolean)||l,p=r.canvas3d;if(!p||!p.camera){this.pinAnimFrame=requestAnimationFrame(c);return}let d=p.camera,m=p?.webgl?.gl?.canvas||this.viewerTarget?.querySelector(".msp-layout-main")||this.pinOverlay,h=this.pinOverlay.getBoundingClientRect(),g=m?m.getBoundingClientRect():h,f=g.width,w=g.height,S=g.left-h.left,E=g.top-h.top;if(!f||!w){this.pinAnimFrame=requestAnimationFrame(c);return}let T=d.viewProjection;if(!T&&d.projection&&d.view){let y=d.projection,b=d.view,v=new Float32Array(16);for(let x=0;x<4;x++)for(let P=0;P<4;P++)v[P*4+x]=y[0+x]*b[P*4+0]+y[4+x]*b[P*4+1]+y[8+x]*b[P*4+2]+y[12+x]*b[P*4+3];T=v}if(T)for(let y of a){!y.pos&&u.length>0&&(y.pos=Ye(u,y.midRes,y.chainId,y.compId));let b=ln(y.pos,T,f,w);b&&b.visible?(y.el.style.left=b.sx+S+"px",y.el.style.top=b.sy+E+"px",y.el.style.width="24px",y.el.style.height="24px",y.el.style.opacity="1"):y.el.style.opacity="0"}}catch(u){console.warn("[BiomolecularViewer] Pin update error:",u)}this.pinAnimFrame=requestAnimationFrame(c)};this.pinAnimFrame=requestAnimationFrame(c)};n(20)}async reconcile(t,e){if(this.context=e,this.currentConvId=e.getConversationId(),!this.viewer)throw new Error("Viewer is not initialized.");this.eventSuppressionDepth++;try{this.lastState=t;let n=typeof t.id=="string"&&t.id.trim()||void 0,i=typeof t.path=="string"&&t.path.trim()||void 0,r=typeof t.filename=="string"&&t.filename.trim()||void 0,s=typeof t.uniprot_id=="string"&&t.uniprot_id.trim()||void 0,l=typeof t.url=="string"&&t.url.trim()||void 0;if(t.id==null&&!i&&!r&&!s&&!l&&!t.source){this.cleanupAll(),this.viewer?.plugin&&this.viewer.plugin.clear(),this.currentId=null,this.loadedKey="",this.currentWorkspacePath="",this.currentSource=void 0,this.userNotes=[],this.sceneHighlights=[],this.observedHighlights=[];let v=this.panelEl?.querySelector("#bm-workspace-select")||null;return this.loadWorkspaceFiles(v,void 0,!0),{status:"rendered"}}let a=(typeof t.source=="string"?t.source.toLowerCase():"")||"";if(a||(l?a="url":r?a="artifact":a="workspace"),a==="workspace"&&!i&&!r&&!n)throw new Error('Workspace source requires "path" property.');if(a==="artifact"&&!r&&!i&&!n)throw new Error('Artifact source requires "filename" property.');if(a==="url"&&!l&&!i)throw new Error('URL source requires "url" property.');let c=V(t),u=t.revision,p=c!==this.currentId||a!==this.currentSource||u!==this.loadedRevision,d=Re(t,c),m=Ue(t,c);this.idFloor=Math.max(this.idFloor,Fe(t,c)),this.applySceneAnnotationsFlag(d,p),typeof d.confidence=="boolean"?this.plddt.legendVisible=d.confidence:p&&(this.plddt.legendVisible=!0),p&&(this.components={...Se});let h=d.components;if(h&&typeof h=="object"){let v=h;for(let x of Q)typeof v[x.key]=="boolean"&&(this.components[x.key]=v[x.key])}this.updateComponentChips();let g=typeof d.style=="string"?d.style.trim().toLowerCase():"",w=vn.includes(g)?g:"";if(p){this.cleanupAll(),this.currentPreset=w||"cartoon";let v=this.sidePanel();v&&(v.representation=this.currentPreset);let x="",P=c,R="mmcif";if(a==="workspace"){let k=i||r||"";this.currentWorkspacePath=k,R=k.toLowerCase().endsWith(".cif")||k.toLowerCase().endsWith(".mmcif")?"mmcif":"pdb",P=k.split("/").pop()||k,x=`./biomolecular/workspace-file?conversationId=${encodeURIComponent(this.currentConvId||"")}&path=${encodeURIComponent(k)}`}else if(a==="artifact"){let k=r||i||"";this.currentWorkspacePath=k,R=k.toLowerCase().endsWith(".cif")||k.toLowerCase().endsWith(".mmcif")?"mmcif":"pdb",P=k,x=`./api/artifact?conversationId=${encodeURIComponent(this.currentConvId||"")}&filename=${encodeURIComponent(k)}`}else if(a==="rcsb"||a==="pdb"){let k=(n||i||r||"").toUpperCase();this.currentWorkspacePath="",R="mmcif",P=k,x=`https://files.rcsb.org/download/${encodeURIComponent(k)}.cif`}else if(a==="alphafold"){let k=s||n||i||r||"";this.currentWorkspacePath="",R="mmcif",P=k,x=`https://alphafold.ebi.ac.uk/files/AF-${encodeURIComponent(k)}-F1-model_v4.cif`}else if(a==="url"||l){let k=l||i||"";this.currentWorkspacePath="",R=k.toLowerCase().endsWith(".cif")||k.toLowerCase().endsWith(".mmcif")?"mmcif":"pdb",P=k.split("/").pop()||k,x=k}else{let k=i||r||n||"";this.currentWorkspacePath=k,R=k.toLowerCase().endsWith(".cif")||k.toLowerCase().endsWith(".mmcif")?"mmcif":"pdb",P=k.split("/").pop()||k,x=`./biomolecular/workspace-file?conversationId=${encodeURIComponent(this.currentConvId||"")}&path=${encodeURIComponent(k)}`}let I=await this.loadStructureAndShow(x,P,a,R);if(this.loadedKey=c,I.status==="failed")return this.currentId=null,this.currentSource="",I;this.currentId=c,this.currentSource=a,this.loadedRevision=u}else await this.reapplyVisualOverlays();if(this.loadedKey=c,w&&w!==this.currentPreset&&await this.setStyle(w),Ut(m)){let v=this.resolvePendingChains(m);v!==m&&(this.sendStructurePatch(this.selectionsPatchFor(v,m),c),m=[...v])}this.sceneSelections=m;let S=Ee(m);this.userNotes=S,this.mountViewportCustomControls(),(p||this.notesRenderKey()!==this.renderedNotesKey)&&(typeof this.renderUserNotes=="function"?await this.renderUserNotes():await this.update3DMarkers()),this.plddt.ensureControls(),await this.syncComponentVisibilityWithHierarchy();let T=ke(m),y=JSON.stringify(ie(T))!==JSON.stringify(ie(this.sceneHighlights));this.sceneHighlights=T,y&&await this.applyHighlights(),this.syncObservedToScene();let b=this.panelEl?.querySelector("#bm-workspace-select")||null;return this.loadWorkspaceFiles(b,void 0,!0),{status:"rendered"}}finally{this.eventSuppressionDepth--}}applySceneAnnotationsFlag(t,e){typeof t.annotations=="boolean"?this.annotationsVisible=t.annotations:e&&(this.annotationsVisible=!1)}async destroy(){if(this.cleanupAll(),this.viewer){try{this.viewer.plugin&&(this.viewer.plugin.clear(),this.viewer.plugin.dispose())}catch(t){console.warn("[BiomolecularViewer] Error disposing viewer:",t)}this.viewer=null}this.pinAnimFrame&&(cancelAnimationFrame(this.pinAnimFrame),this.pinAnimFrame=null),this.pinOverlay&&(this.pinOverlay.remove(),this.pinOverlay=null),this.sequenceRowObserver?.disconnect(),this.sequenceRowObserver=null;for(let t of this.pluginSubs)try{t.unsubscribe()}catch{}this.pluginSubs=[],this.currentWorkspacePath="",this.currentAnnotations=null,this.lastState={},this.loadedKey="",this.userNotes=[],this.sceneSelections=[],this.sceneHighlights=[],this.observedHighlights=[],this.lastPaintedRibbons=[],this.userHighlightDebounceTimer&&(clearTimeout(this.userHighlightDebounceTimer),this.userHighlightDebounceTimer=null),document.removeEventListener("keydown",this.onDocumentKeyDown),this.selectedRanges=[],this.selectedRangesDebounceTimer&&(clearTimeout(this.selectedRangesDebounceTimer),this.selectedRangesDebounceTimer=null),this.postedSelectedRanges="[]",this.panelEl=null,this.panelStatus=void 0,this.context=null,this.currentId=null,this.currentSource=void 0,this.currentConvId=null,this.isMounted=!1,this.unsubscribeTheme&&(this.unsubscribeTheme(),this.unsubscribeTheme=null),this.container&&(this.container.textContent="",this.container=null)}};pt({factory:o=>new _e(o)},{logPrefix:"BiomolecularStructureViewer"});
