const fs=require('fs'),path=require('path');
const file=process.argv[2]||path.join(__dirname,'..','web-bundle','main.js'),limit=Number(process.argv[3]||100),source=fs.readFileSync(file,'utf8');
const runtimeStart=source.indexOf('window._ptAgyDict = _ptAgyDict;');const appSource=runtimeStart>=0?source.slice(runtimeStart):source;const keys=new Set([...source.matchAll(/^\s*"((?:[^"\\]|\\.)+)"\s*:/gm)].map(m=>m[1].replace(/\\"/g,'"').replace(/\\n/g,' ')));const prefixes=new Set();
// Também ler dicionários compactados em Object.assign; as atualizações locais
// usam esse formato para aplicar correções sem reformatar o bundle compilado.
for(const m of source.matchAll(/Object\.assign\(_ptAgyDict,\s*(\{[^\n]*?\})\s*\)/g))for(const k of m[1].matchAll(/"((?:[^"\\]|\\.)+)"\s*:/g))keys.add(k[1].replace(/\\"/g,'"').replace(/\\n/g,' '));
const candidates=new Set();
const prefixStart=source.indexOf('var _ptMcpPrefixes = {');if(prefixStart>=0){const prefixEnd=source.indexOf('};',prefixStart);if(prefixEnd>=0){const block=source.slice(prefixStart,prefixEnd);for(const k of block.matchAll(/^\s*"((?:[^"\\]|\\.)+)"\s*:/gm)){const key=k[1].replace(/\\"/g,'"').replace(/\\n/g,' ');keys.add(key);prefixes.add(key)}}}
for(const m of source.matchAll(/Object\.assign\(_ptMcpPrefixes,\s*(\{[^\n]*?\})\s*\)/g))for(const k of m[1].matchAll(/"((?:[^"\\]|\\.)+)"\s*:/g)){const key=k[1].replace(/\\"/g,'"').replace(/\\n/g,' ');keys.add(key);prefixes.add(key)}
// The marketplace obtains some card descriptions at runtime, so they are not
// discoverable as properties in main.js. Keep screenshot-derived samples here
// to prevent the static scan from reporting full coverage while missing them.
const runtimeCatalogCandidates=[
  "Also includes global permissions when working in this project.",
  "Interactive 3D biomolecular structure viewer via Mol*. Renders 3D molecular structures from local workspace files (.cif, .mmcif, .pdb) or conversation artifacts, and manages user 3D annotations and",
  "Uses Chrome DevTools MCP for inspecting, debugging, and testing cookies, session state, authentication issues, and cookie consent compliance. Use when diagnosing 401/403 errors, authentication redirects,",
  "Verify availability, schedule events, and RSVP.",
  "Connect Antigravity to Dropbox to search, inspect, and manage files",
  "Connect Antigravity to your Notion workspace with",
  "Compile and deploy on Netlify: functions, edge functions, deploy previews, and site management",
  "Deploy, configure, monitor, and troubleshoot apps",
  "Compile and deploy web apps and AI agents on Vercel",
  "Compile Wix apps and headless sites, and manage content",
  "Build with Google",
  "Compile on Google's developer platforms, including Android, Chrome, Gemini, and Google Cloud.",
  "Google does not control the availability or functionality of third-party developer tools. Your data from third-party developer tools connected to your Antigravity instance may be shared with Google. Google will protect any such data in accordance with the Google Privacy Policy, found here:",
  "Google does not control the availability or functionality of third-party developer tools.",
  "Your data from third-party developer tools connected to your Antigravity instance may be shared with Google.",
  "Google will protect any such data in accordance with the Google Privacy Policy, found here:"
];
for(const value of runtimeCatalogCandidates)candidates.add(value);
const skillPrefixStart=source.indexOf('var _ptRemainingSkillPrefixes = {');if(skillPrefixStart>=0){const skillPrefixEnd=source.indexOf('};',skillPrefixStart);if(skillPrefixEnd>=0){const block=source.slice(skillPrefixStart,skillPrefixEnd);for(const k of block.matchAll(/^\s*"((?:[^"\\]|\\.)+)"\s*:/gm)){const key=k[1].replace(/\\"/g,'"').replace(/\\n/g,' ');keys.add(key);prefixes.add(key)}}}
const props=['label','description','title','aria-label','placeholder','message','tooltip','emptyText','buttonText','alt'];
const propertyRe=new RegExp('(?:'+props.join('|')+')\\s*:\\s*(?:"((?:[^"\\\\]|\\\\.){2,300})"|`([^`\\n]{2,300})`)','g');
for(const m of appSource.matchAll(propertyRe)){const value=(m[1]||m[2]).replace(/\\n/g,' ').replace(/\\"/g,'"').replace(/\\u([0-9a-f]{4})/gi,(_,hex)=>String.fromCharCode(parseInt(hex,16))).trim();if(!/^[A-Za-z]/.test(value)||!/[\s…]/.test(value)||!/[A-Za-z]{3}/.test(value)||/[\u3400-\u9fffãõáéíóúçêôà]/i.test(value)||/\b(?:não|para|com|sem|uma|umas|seu|seus|sua|suas|em|sobre|gerar|revisar|concluir|abrir|descobrir)\b/i.test(value)||/[\r\n,;{}<>]/.test(value)||value.includes('${')||/^https?:/i.test(value)||/^[A-Za-z0-9._/-]+$/.test(value))continue;candidates.add(value)}
const preservedLabels=new Set(["a2a (ttv2)","Flash Lite","Novo Projeto","Este computador"]);
const missing=[...candidates].filter(value=>{const normalized=value.replace(/\s+/g,' ').trim();return !keys.has(value)&&!keys.has(normalized)&&!preservedLabels.has(value)&&![...prefixes].some(prefix=>value.startsWith(prefix)||value.includes(prefix))}).sort((a,b)=>a.localeCompare(b));
console.log(`Antigravity UI property scan | ${path.basename(file)}`);console.log(`Candidatos de rótulo/descrição: ${candidates.size}; sem mapeamento exato ou por prefixo: ${missing.length}`);for(const value of missing.slice(0,limit))console.log(`- ${value}`);if(missing.length>limit)console.log(`... mais ${missing.length-limit}; passe um limite maior como segundo argumento.`);
