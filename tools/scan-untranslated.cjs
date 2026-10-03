const fs=require('fs'),path=require('path');
const file=process.argv[2]||path.join(__dirname,'..','web-bundle','main.js'),limit=Number(process.argv[3]||100),source=fs.readFileSync(file,'utf8');
const runtimeStart=source.indexOf('window._ptAgyDict = _ptAgyDict;');const appSource=runtimeStart>=0?source.slice(runtimeStart):source;const keys=new Set([...source.matchAll(/^\s*"((?:[^"\\]|\\.)+)"\s*:/gm)].map(m=>m[1].replace(/\\"/g,'"').replace(/\\n/g,' ')));
const props=['label','description','title','aria-label','placeholder','message','tooltip','emptyText','buttonText','alt'];
const propertyRe=new RegExp('(?:'+props.join('|')+')\\s*:\\s*(?:"((?:[^"\\\\]|\\\\.){2,300})"|`([^`\\n]{2,300})`)','g');
const candidates=new Set();
for(const m of appSource.matchAll(propertyRe)){const value=(m[1]||m[2]).replace(/\\n/g,' ').replace(/\\"/g,'"').replace(/\\u([0-9a-f]{4})/gi,(_,hex)=>String.fromCharCode(parseInt(hex,16))).trim();if(!/^[A-Za-z]/.test(value)||!/[\s…]/.test(value)||!/[A-Za-z]{3}/.test(value)||/[\u3400-\u9fffãõáéíóúçêôà]/i.test(value)||/\b(?:não|para|com|sem|uma|umas|seu|seus|sua|suas|em|sobre|gerar|revisar|concluir|abrir|descobrir)\b/i.test(value)||/[\r\n,;{}<>]/.test(value)||value.includes('${')||/^https?:/i.test(value)||/^[A-Za-z0-9._/-]+$/.test(value))continue;candidates.add(value)}
const missing=[...candidates].filter(value=>!keys.has(value)).sort((a,b)=>a.localeCompare(b));
console.log(`Antigravity UI property scan | ${path.basename(file)}`);console.log(`Candidatos de rótulo/descrição: ${candidates.size}; sem mapeamento exato: ${missing.length}`);for(const value of missing.slice(0,limit))console.log(`- ${value}`);if(missing.length>limit)console.log(`... mais ${missing.length-limit}; passe um limite maior como segundo argumento.`);
