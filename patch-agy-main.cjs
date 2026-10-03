const fs = require('fs');

const mainJsPath = 'C:/Projetos/Antigravity-Traducao-PTBR/web-bundle/main.js';
let code = fs.readFileSync(mainJsPath, 'utf8');

// 1. Localizar e substituir case "verificationRequired"
const searchStr = 'case "verificationRequired":let w=a.validationUrl;return{id:c,icon:e,title:"Verification required",message:z.createElement("span",null,"Please verify your account to continue using"';
const replaceStr = 'case "verificationRequired":let w=a.validationUrl;return{id:c,icon:e,title:"Verificação necessária",message:z.createElement("span",null,"Verifique sua conta para continuar usando o"';

if (code.includes(searchStr)) {
    code = code.replace(searchStr, replaceStr);
    console.log('[OK] verificationRequired title & message replaced!');
} else {
    console.warn('[!] searchStr not found!');
}

// Também traduzir "Learn more" e "Complete verification" dentro desse bloco
const oldAction = 'primaryAction:{label:"Complete verification",onClick:()=>{r(w)}}}';
const newAction = 'primaryAction:{label:"Concluir verificação",onClick:()=>{r(w)}}}';
if (code.includes(oldAction)) {
    code = code.replace(oldAction, newAction);
    console.log('[OK] Complete verification label replaced!');
}

// 2. Adicionar termos adicionais em _ptAgyDict
const agyDictAddition = {
    'Verification required': 'Verificação necessária',
    'Verification Required': 'Verificação necessária',
    'Complete verification': 'Concluir verificação',
    'Please verify your account to continue using': 'Verifique sua conta para continuar usando',
    'Please verify your account, then sign in again to continue. Learn more by visiting our': 'Verifique sua conta e entre novamente para continuar. Saiba mais visitando nosso',
    'Further action is required to use': 'Ação adicional necessária para usar o',
    'Check for Updates': 'Verificar Atualizações',
    'No updates available': 'Nenhuma atualização disponível',
    'Checking for updates...': 'Verificando atualizações...',
    'Update available': 'Atualização disponível',
    'Restart to update': 'Reiniciar para atualizar',
    'Downloading update...': 'Baixando atualização...',
    'An error occurred while checking for updates': 'Ocorreu um erro ao verificar atualizações',
    'You are running the latest version.': 'Você está usando a versão mais recente.'
};

let dictInjected = 0;
for (const [k, v] of Object.entries(agyDictAddition)) {
    const needle = '"' + k + '":';
    if (!code.includes(needle)) {
        code = code.replace('_ptAgyDict = {', '_ptAgyDict = {\n  ' + JSON.stringify(k) + ': ' + JSON.stringify(v) + ',');
        dictInjected++;
    }
}
console.log(`[OK] Injected ${dictInjected} terms into _ptAgyDict.`);

fs.writeFileSync(mainJsPath, code, 'utf8');
console.log('[OK] Antigravity main.js updated successfully!');
