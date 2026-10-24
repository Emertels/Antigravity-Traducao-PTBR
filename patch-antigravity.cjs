const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

console.log("====================================================================");
console.log("    PATCHER DINAMICO AUTOMATIZADO ANTIGRAVITY PT-BR - EMERSON TELES  ");
console.log("====================================================================");

const preflightOnly = process.argv[2] === "--preflight";
const agyArg = process.argv[preflightOnly ? 3 : 2];
const agyDir = agyArg || path.join(process.env.LOCALAPPDATA, "Programs", "antigravity");
const scriptDir = __dirname;
const webBundleDir = path.join(scriptDir, "web-bundle");
const sourceWebBundleMain = path.join(webBundleDir, "main.js");

if (!fs.existsSync(webBundleDir)) {
    console.error("[x] Erro: Pasta web-bundle não encontrada em:", webBundleDir);
    process.exit(1);
}
if (!fs.existsSync(sourceWebBundleMain)) {
    console.error("[x] Erro: web-bundle/main.js não encontrado em:", sourceWebBundleMain);
    process.exit(1);
}
const sourceMainText = fs.readFileSync(sourceWebBundleMain, "utf8");
const translationCreditMarkers = sourceMainText.match(/"data-testid":"ptbr-translation-credit"/g) || [];
if (translationCreditMarkers.length !== 1 || !sourceMainText.includes('color:"#00adb5",fontSize:"12px"')) {
    console.error("[x] O cartão da versão precisa conter um único crédito PT-BR em azul-turquesa; nenhum arquivo foi alterado.");
    process.exit(1);
}
const targetInjectionPoint = "'--enable_sidecars',";
const turboPreservationChecks = [
    ['rótulo PT-BR de Request Review', 'request_review:{label:"Solicitar revisão",description:"Every command requires approval."'],
    ['rótulo PT-BR de Default', '"default":{label:"Padrão",description:"Ask before sensitive operations."'],
    ['campo de busca PT-BR', 'placeholder:"Pesquisar abas, arquivos, extensões, subagentes, artefatos e tarefas..."'],
    ['tradução do rótulo Turbo', '"Turbo": "Turbo"'],
    ['tradução da descrição do perfil Turbo', '"Run all commands without restrictions.": "Executar todos os comandos sem restrições."'],
    ['perfil Turbo na estrutura atual', /turbo:\{label:"Turbo",description:"Run all commands without restrictions\.",\s*prefValues:\{/],
    ['identificador atual do perfil Turbo', /AgentPermissionPreset\.TURBO/],
    ['Turbo habilitado no seletor principal', /\b[\w$]{1,80}=\["request_review","default","turbo"\]/]
];
const missingTurboParts = turboPreservationChecks.filter(([, marker]) =>
    marker instanceof RegExp ? !marker.test(sourceMainText) : !sourceMainText.includes(marker)
);
if (missingTurboParts.length) {
    console.error("[x] O bundle de origem não contém todos os elementos do modo Turbo:");
    for (const [label] of missingTurboParts) console.error(`    - ${label}`);
    console.error("Nenhum arquivo da instalação foi alterado. Verifique se o web-bundle pertence à versão compatível do Antigravity.");
    process.exit(1);
}
const sourceWebBundleHash = crypto.createHash("sha256").update(fs.readFileSync(sourceWebBundleMain)).digest("hex");

const resourcesDir = path.join(agyDir, "resources");
const srcAsar = path.join(resourcesDir, "app.asar");
const backupDir = path.join(agyDir, "_backups");
const tempAsar = path.join(resourcesDir, "app.asar.tmp");

if (!fs.existsSync(srcAsar)) {
    console.error("[x] Erro: app.asar não encontrado em:", srcAsar);
    process.exit(1);
}

function computeIntegrity(buffer) {
    const blockSize = 4 * 1024 * 1024;
    const blocks = [];
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");
    for (let i = 0; i < buffer.length; i += blockSize) {
        const chunk = buffer.subarray(i, Math.min(i + blockSize, buffer.length));
        blocks.push(crypto.createHash("sha256").update(chunk).digest("hex"));
    }
    return { algorithm: "SHA256", hash, blockSize, blocks };
}

function getAgyAsarVersion(filePath) {
    try {
        const fd = fs.openSync(filePath, "r");
        const sBuf = Buffer.alloc(16);
        fs.readSync(fd, sBuf, 0, 16, 0);
        const s2 = sBuf.readUInt32LE(4);
        const jSize = sBuf.readUInt32LE(12);
        const hBuf = Buffer.alloc(jSize);
        fs.readSync(fd, hBuf, 0, jSize, 16);
        const h = JSON.parse(hBuf.toString("utf8"));
        const bOff = 8 + s2;
        const pkg = h.files && h.files["package.json"];
        if (!pkg) { fs.closeSync(fd); return null; }
        const buf = Buffer.alloc(pkg.size);
        fs.readSync(fd, buf, 0, pkg.size, bOff + parseInt(pkg.offset, 10));
        fs.closeSync(fd);
        const pkgStr = buf.toString("utf8").replace(/^[^{]*/, "");
        return JSON.parse(pkgStr).version;
    } catch (e) {
        return null;
    }
}

function getAgyAsarEntryText(filePath, entryPath) {
    let fd;
    try {
        fd = fs.openSync(filePath, "r");
        const sBuf = Buffer.alloc(16);
        fs.readSync(fd, sBuf, 0, 16, 0);
        const s2 = sBuf.readUInt32LE(4);
        const jSize = sBuf.readUInt32LE(12);
        const hBuf = Buffer.alloc(jSize);
        fs.readSync(fd, hBuf, 0, jSize, 16);
        let entry = JSON.parse(hBuf.toString("utf8"));
        for (const segment of entryPath) {
            entry = entry && entry.files && entry.files[segment];
            if (!entry) return null;
        }
        if (entry.files || !Number.isFinite(Number(entry.size)) || !Number.isFinite(Number(entry.offset))) return null;
        const baseOffset = 8 + s2;
        const data = Buffer.alloc(entry.size);
        fs.readSync(fd, data, 0, entry.size, baseOffset + Number(entry.offset));
        return data.toString("utf8");
    } catch (_) {
        return null;
    } finally {
        if (fd !== undefined) fs.closeSync(fd);
    }
}

function getTurboUiCompatibilityIssues(version, bundleText) {
    const parts = String(version || "").split(".").map(Number);
    const isAtLeast223 = parts.length >= 2 &&
        (parts[0] > 2 || (parts[0] === 2 && (parts[1] > 23 || (parts[1] === 23 && (parts[2] || 0) >= 0))));
    if (!isAtLeast223) return [];

    const presetDeclaration = /\bvar\s+[\w$]{1,80}=\{request_review:\{label:/.exec(bundleText);
    const visiblePresets = /\b[\w$]{1,80}=\["request_review","default","turbo"\]/.exec(bundleText);
    const start = presetDeclaration ? presetDeclaration.index : -1;
    const end = visiblePresets ? visiblePresets.index : -1;
    const presetTable = start >= 0 && end > start ? bundleText.slice(start, end) : "";
    const required = [
        ['perfil Request Review com rótulo PT-BR e descrição atual', 'request_review:{label:"Solicitar revisão",description:"Every command requires approval."'],
        ['perfil Default com rótulo PT-BR e descrição atual', '"default":{label:"Padrão",description:"Ask before sensitive operations."'],
        ['perfil Turbo e sua descrição atual', 'turbo:{label:"Turbo",description:"Run all commands without restrictions."'],
        ['identificador atual do perfil Turbo', 'AgentPermissionPreset.TURBO']
    ];
    const issues = required.filter(([, marker]) => !presetTable.includes(marker)).map(([label]) => label);
    if (!visiblePresets) {
        issues.push('Turbo habilitado na lista de perfis visíveis');
    }
    if (!bundleText.includes('placeholder:"Pesquisar abas, arquivos, extensões, subagentes, artefatos e tarefas..."')) {
        issues.push('placeholder de busca traduzido');
    }
    return issues;
}

function isAlreadyTranslatedAgy(filePath) {
    try {
        const fd = fs.openSync(filePath, "r");
        const sBuf = Buffer.alloc(16);
        fs.readSync(fd, sBuf, 0, 16, 0);
        const s2 = sBuf.readUInt32LE(4);
        const jSize = sBuf.readUInt32LE(12);
        const hBuf = Buffer.alloc(jSize);
        fs.readSync(fd, hBuf, 0, jSize, 16);
        const h = JSON.parse(hBuf.toString("utf8"));
        const bOff = 8 + s2;
        
        // Verificar languageServer.js
        const ls = h.files && h.files.dist && h.files.dist.files && h.files.dist.files["languageServer.js"];
        if (ls) {
            const buf = Buffer.alloc(ls.size);
            fs.readSync(fd, buf, 0, ls.size, bOff + parseInt(ls.offset, 10));
            const str = buf.toString("utf8");
            if (str.includes("web_bundle_path") || str.includes("Emerson Teles")) {
                fs.closeSync(fd);
                return true;
            }
        }
        
        // Verificar provisionSplash.js
        const splash = h.files && h.files.dist && h.files.dist.files && h.files.dist.files["provisionSplash.js"];
        if (splash) {
            const buf = Buffer.alloc(splash.size);
            fs.readSync(fd, buf, 0, splash.size, bOff + parseInt(splash.offset, 10));
            if (buf.toString("utf8").includes("Configurando o WSL:")) {
                fs.closeSync(fd);
                return true;
            }
        }
        
        fs.closeSync(fd);
        return false;
    } catch (e) {
        return false;
    }
}

// 1. Detectar versão atual instalada
const currentVersion = getAgyAsarVersion(srcAsar);
if (!currentVersion) { console.error("[x] Não foi possível detectar a versão do app.asar instalado."); process.exit(1); }
const currentVersionParts = currentVersion.split(".").map(Number);
const isAgy224OrNewer = currentVersionParts[0] > 2 || (currentVersionParts[0] === 2 && currentVersionParts[1] >= 24);
if (isAgy224OrNewer) {
    const newUiTranslationChecks = [
        ['personalizações adicionais', '"Other Customizations": "Outras personalizações"'],
        ['Visualizador Biomolecular', '"Biomolecular Structure Viewer": "Visualizador de Estruturas Biomoleculares"'],
        ['disponibilidade do Gemini 4 Argon para Ultra e Pro', '"Gemini 4 Argon is currently available to Ultra and paid Pro plan subscribers."'],
        ['descrição do Google Agenda', '"Verify availability, schedule events, and RSVP."'],
        ['ajuda jurídica', '"Visit Legal Help to ask for content changes for legal reasons."'],
        ['trechos da ajuda jurídica', '"to ask for content changes for legal reasons.": "para solicitar alterações de conteúdo por motivos legais."'],
        ['aviso de anexos de log', '"Attaching logs requires an email address": "Para anexar logs, é necessário informar um endereço de e-mail"'],
        ['observador de Shadow DOM e iframes', 'function _observeAgRoot(root)'],
        ['raiz Shadow DOM adicionada dinamicamente', 'if (node.shadowRoot) _observeAgRoot(node.shadowRoot);'],
        ['fragmento da descrição de permissões do projeto', 'projectPermissionsText.includes("This project was created for")'],
        ['seletor de idioma dos limites', 'var resetTime = t.match(/^Resets in\\s+(.+)$/i);']
    ];
    const missingNewUiTranslations = newUiTranslationChecks.filter(([, marker]) => !sourceMainText.includes(marker));
    if (missingNewUiTranslations.length) {
        console.error(`[x] Faltam traduções novas exigidas para o Antigravity ${currentVersion}:`);
        for (const [label] of missingNewUiTranslations) console.error(`    - ${label}`);
        console.error("Nenhum arquivo da instalação foi alterado.");
        process.exit(14);
    }
}
const turboUiIssues = getTurboUiCompatibilityIssues(currentVersion, sourceMainText);
if (turboUiIssues.length) {
    console.error(`[x] O web-bundle do projeto não corresponde à interface de segurança do Antigravity ${currentVersion}.`);
    console.error("    A instalação foi interrompida antes de criar backup, alterar o ASAR ou substituir arquivos.");
    console.error("    O bundle atual não contém estes pontos da interface usada por essa versão:");
    for (const issue of turboUiIssues) console.error(`    - ${issue}`);
    console.error("    Mantenha o Antigravity original até atualizar o web-bundle para uma compilação compatível.");
    process.exit(12);
}
const installedLanguageServer = getAgyAsarEntryText(srcAsar, ["dist", "languageServer.js"]);
if (!installedLanguageServer) {
    console.error(`[x] Não encontrei dist/languageServer.js no Antigravity ${currentVersion}.`);
    console.error("    O instalador parou antes de fechar o aplicativo ou alterar arquivos.");
    process.exit(13);
}
if (!installedLanguageServer.includes("--web_bundle_path") && !installedLanguageServer.includes(targetInjectionPoint)) {
    console.error(`[x] O patch dinâmico ainda não reconhece a estrutura do Antigravity ${currentVersion}.`);
    console.error("    Nenhum arquivo foi alterado; o ASAR estático foi bloqueado para evitar downgrade.");
    process.exit(13);
}
if (preflightOnly) {
    console.log(`[OK] A estrutura do patch corresponde ao Antigravity ${currentVersion}; verificação do seletor Turbo aprovada.`);
    process.exit(0);
}
const isSrcTranslated = isAlreadyTranslatedAgy(srcAsar);

console.log(`[*] Versão do Google Antigravity instalada detectada: ${currentVersion}`);
console.log(`    -> Preservando estritamente a versão ${currentVersion} (sem downgrade)!`);

// Backup imutável exclusivo da versão instalada; nunca reutilizar o arquivo raiz.
const versionBackupDir = path.join(backupDir, currentVersion);
if (!fs.existsSync(versionBackupDir)) fs.mkdirSync(versionBackupDir, { recursive: true });
const versionBackupAsar = path.join(versionBackupDir, "app.asar");
const versionBackupInfo = path.join(versionBackupDir, "backup-info.txt");
const infoText = `Backup original Google Antigravity\nVersão: ${currentVersion}\nCriado: ${new Date().toLocaleString("pt-BR")}\n`; 
if (!fs.existsSync(versionBackupAsar) && !isSrcTranslated) {
    console.log(`[*] Salvando o app.asar original de ${currentVersion} em ${versionBackupAsar}`);
    fs.copyFileSync(srcAsar, versionBackupAsar);
    fs.writeFileSync(versionBackupInfo, infoText, "utf8");
}
const cleanAsarPath = fs.existsSync(versionBackupAsar) && getAgyAsarVersion(versionBackupAsar) === currentVersion && !isAlreadyTranslatedAgy(versionBackupAsar)
    ? versionBackupAsar : (!isSrcTranslated ? srcAsar : null);
if (!cleanAsarPath || isAlreadyTranslatedAgy(cleanAsarPath) || getAgyAsarVersion(cleanAsarPath) !== currentVersion) {
    console.error("[x] Backup original limpo desta versão ausente ou inválido; nenhum patch será aplicado.");
    console.error("    Repare/instale o Antigravity oficial por cima e tente novamente. Mantenha os dados do usuário.");
    process.exit(11);
}
if (!isSrcTranslated && cleanAsarPath === versionBackupAsar) {
    console.log("[OK] Backup original em inglês desta versão encontrado e validado; ele será mantido sem substituição.");
}
const installedWebBundleMarker = path.join(agyDir, "resources", "web-bundle", ".agy-ptbr-installed");
const installedWebBundleMain = path.join(agyDir, "resources", "web-bundle", "main.js");
let installedWebBundleIsCurrent = false;
try {
    const markerText = fs.readFileSync(installedWebBundleMarker, "utf8");
    const installedMainHash = crypto.createHash("sha256").update(fs.readFileSync(installedWebBundleMain)).digest("hex");
    installedWebBundleIsCurrent = markerText.includes(`main.js SHA256: ${sourceWebBundleHash}`) && installedMainHash === sourceWebBundleHash;
} catch (_) { }
if (isSrcTranslated && installedWebBundleIsCurrent && cleanAsarPath === versionBackupAsar) {
    process.exit(10);
}
if (isSrcTranslated) console.log("[i] Tradução anterior detectada; verificando e atualizando o pacote a partir do backup limpo.");
console.log(`[*] Usando base limpa original: ${cleanAsarPath}`);
// 4. Ler cabeçalho ASAR da base limpa original
const cleanFd = fs.openSync(cleanAsarPath, "r");
const sizeBuf = Buffer.alloc(16);
fs.readSync(cleanFd, sizeBuf, 0, 16, 0);
const cleanSize2 = sizeBuf.readUInt32LE(4);
const cleanJsonSize = sizeBuf.readUInt32LE(12);
const cleanHeaderBuf = Buffer.alloc(cleanJsonSize);
fs.readSync(cleanFd, cleanHeaderBuf, 0, cleanJsonSize, 16);
const cleanHeader = JSON.parse(cleanHeaderBuf.toString("utf8"));
const cleanBaseOffset = 8 + cleanSize2;

function getCleanFileData(entry) {
    const buf = Buffer.alloc(entry.size);
    fs.readSync(cleanFd, buf, 0, entry.size, cleanBaseOffset + parseInt(entry.offset, 10));
    return buf;
}

function getCleanFile(p) {
    const parts = p.split("/");
    let cur = cleanHeader;
    for (const part of parts) {
        if (!cur.files || !cur.files[part]) return null;
        cur = cur.files[part];
    }
    return getCleanFileData(cur).toString("utf8");
}

// 5. Aplicar patches nas funções a partir do código limpo original
// 5.1 dist/languageServer.js: injetar --web_bundle_path
const lsEntry = cleanHeader.files.dist && cleanHeader.files.dist.files && cleanHeader.files.dist.files["languageServer.js"];
if (!lsEntry) {
    console.error("[x] Erro: dist/languageServer.js não encontrado no app.asar limpo.");
    process.exit(1);
}
let lsCode = getCleanFileData(lsEntry).toString("utf8");

const injectionCode = `'--enable_sidecars',
        ];
        // Injetar web_bundle_path para interface traduzida PT-BR (Emerson Teles)
        const webBundlePath = process.resourcesPath
            ? path_1.default.join(process.resourcesPath, 'web-bundle')
            : path_1.default.join(__dirname, '..', '..', 'resources', 'web-bundle');
        if (fs.existsSync(webBundlePath)) {
            args.push(\`--web_bundle_path=\${webBundlePath}\`);
        }
        if (false) [`;

if (lsCode.includes(targetInjectionPoint) && !lsCode.includes("--web_bundle_path")) {
    lsCode = lsCode.replace(targetInjectionPoint, injectionCode);
    console.log("    -> Injetado carregador do web-bundle em dist/languageServer.js");
} else if (!lsCode.includes("--web_bundle_path")) {
    console.error(`[x] O patch dinâmico não reconhece dist/languageServer.js do Antigravity ${currentVersion}.`);
    console.error("    Nenhum ASAR foi substituído; atualize o patch para esta compilação.");
    process.exit(13);
}

// 5.2 dist/tray.js e dist/main.js
const trayEntry = cleanHeader.files.dist && cleanHeader.files.dist.files && cleanHeader.files.dist.files["tray.js"];
let trayCode = trayEntry ? getCleanFileData(trayEntry).toString("utf8") : null;
if (trayCode) {
    trayCode = trayCode.replace(
        "countItem.label =\n                (count > 0 ? `${count}` : 'No') +\n                    ' agent' +\n                    (count === 1 ? '' : 's') +\n                    ' running';",
        "countItem.label = (count > 0 ? `${count}` : 'Nenhum') + ' agente' + (count === 1 ? '' : 's') + ' em execução';"
    );
}

const mainEntry = cleanHeader.files.dist && cleanHeader.files.dist.files && cleanHeader.files.dist.files["main.js"];
let mainCode = mainEntry ? getCleanFileData(mainEntry).toString("utf8") : null;
if (mainCode) {
    mainCode = mainCode.replace("label: 'Open Antigravity'", "label: 'Abrir Antigravity'");
    mainCode = mainCode.replace("label: `Open ${electron_1.app.getName()}`", "label: `Abrir ${electron_1.app.getName()}`");
    mainCode = mainCode.replace("label: 'Quit'", "label: 'Sair'");
    mainCode = mainCode.replace("label: 'No agents running'", "label: 'Nenhum agente em execução'");
}

// 5.3 dist/loadingOverlay.js
const loEntry = cleanHeader.files.dist && cleanHeader.files.dist.files && cleanHeader.files.dist.files["loadingOverlay.js"];
let loCode = loEntry ? getCleanFileData(loEntry).toString("utf8") : null;
if (loCode) {
    loCode = loCode.replace(/<div class="text">Loading Antigravity<\/div>/g, '<div class="text">Carregando o Antigravity...</div>');
    console.log("    -> Tela de carregamento traduzida em dist/loadingOverlay.js");
}

// 5.4 dist/updater.js
const updaterEntry = cleanHeader.files.dist && cleanHeader.files.dist.files && cleanHeader.files.dist.files["updater.js"];
let updaterCode = updaterEntry ? getCleanFileData(updaterEntry).toString("utf8") : null;
if (updaterCode) {
    updaterCode = updaterCode.replace("title: 'Check for Updates'", "title: 'Verificar Atualizações'");
    updaterCode = updaterCode.replace("message: 'No updates available'", "message: 'Nenhuma atualização disponível'");
    updaterCode = updaterCode.replace('MenuUpdateStep["CheckForUpdates"] = "Check for Updates";', 'MenuUpdateStep["CheckForUpdates"] = "Verificar Atualizações";');
    updaterCode = updaterCode.replace('MenuUpdateStep["CheckingForUpdates"] = "Checking for Updates...";', 'MenuUpdateStep["CheckingForUpdates"] = "Verificando Atualizações...";');
    updaterCode = updaterCode.replace('MenuUpdateStep["DownloadingUpdate"] = "Downloading Update...";', 'MenuUpdateStep["DownloadingUpdate"] = "Baixando Atualização...";');
    updaterCode = updaterCode.replace('MenuUpdateStep["RestartToUpdate"] = "Restart to Update";', 'MenuUpdateStep["RestartToUpdate"] = "Reiniciar para Atualizar";');
    console.log("    -> Modal e status de atualização traduzidos em dist/updater.js");
}

// 5.5 dist/menu.js
const menuEntry = cleanHeader.files.dist && cleanHeader.files.dist.files && cleanHeader.files.dist.files["menu.js"];
let menuCode = menuEntry ? getCleanFileData(menuEntry).toString("utf8") : null;
if (menuCode) {
    menuCode = menuCode.replace("label: 'New Window'", "label: 'Nova Janela'");
    menuCode = menuCode.replace("label: 'Connect to WSL'", "label: 'Conectar ao WSL'");
    menuCode = menuCode.replace("label: 'Reopen Locally'", "label: 'Reabrir localmente'");
    console.log("    -> Menus WSL e janelas traduzidos em dist/menu.js");
}

// 5.6 dist/ideInstall/wizardHtml.js
const wizHtmlEntry = cleanHeader.files.dist && cleanHeader.files.dist.files && cleanHeader.files.dist.files["ideInstall"] && cleanHeader.files.dist.files["ideInstall"].files && cleanHeader.files.dist.files["ideInstall"].files["wizardHtml.js"];
let wizHtmlCode = wizHtmlEntry ? getCleanFileData(wizHtmlEntry).toString("utf8") : null;
if (wizHtmlCode) {
    wizHtmlCode = wizHtmlCode.replace('Setting up…', 'Configurando…');
    wizHtmlCode = wizHtmlCode.replace('Welcome to the new Antigravity!', 'Bem-vindo ao novo Antigravity!');
    wizHtmlCode = wizHtmlCode.replace(
        "Antigravity has been redesigned to put agents first with new capabilities. If you'd still like a code editor, you can download it as a separate app named <b>Antigravity IDE</b>.",
        "O Antigravity foi reformulado para priorizar os agentes com novos recursos. Se você ainda quiser um editor de código, poderá baixá-lo como um aplicativo separado chamado <b>Antigravity IDE</b>."
    );
    wizHtmlCode = wizHtmlCode.replace('Download the Antigravity IDE', 'Baixar o Antigravity IDE');
    wizHtmlCode = wizHtmlCode.replace('Explore the new Antigravity', 'Explorar o novo Antigravity');
    console.log("    -> Wizard inicial traduzido em dist/ideInstall/wizardHtml.js");
}

// 5.7 dist/provisionSplash.js
const provSplashEntry = cleanHeader.files.dist && cleanHeader.files.dist.files && cleanHeader.files.dist.files["provisionSplash.js"];
let provSplashCode = provSplashEntry ? getCleanFileData(provSplashEntry).toString("utf8") : null;
if (provSplashCode) {
    provSplashCode = provSplashCode.replace('Setting up WSL: ${escapeHtml(distro)}', 'Configurando o WSL: ${escapeHtml(distro)}');
    console.log("    -> Splash do WSL traduzido em dist/provisionSplash.js");
}

// Validar sintaxe do languageServer.js
const tempCheck = path.join(resourcesDir, "temp_ls_check.js");
try {
    fs.writeFileSync(tempCheck, lsCode, "utf8");
    execFileSync(process.execPath, ["--check", tempCheck], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true
    });
    fs.unlinkSync(tempCheck);
    console.log("    [OK] Verificação sintática de dist/languageServer.js aprovada!");
} catch (e) {
    try { fs.unlinkSync(tempCheck); } catch {}
    const syntaxDetails = e.stderr ? e.stderr.toString("utf8").trim() : "";
    console.error("[x] Falha na verificação sintática:", syntaxDetails || e.message);
    process.exit(1);
}

const patchedLsBuf = Buffer.from(lsCode, "utf8");
const patchedTrayBuf = trayCode ? Buffer.from(trayCode, "utf8") : null;
const patchedMainBuf = mainCode ? Buffer.from(mainCode, "utf8") : null;
const patchedLoBuf = loCode ? Buffer.from(loCode, "utf8") : null;
const patchedUpdaterBuf = updaterCode ? Buffer.from(updaterCode, "utf8") : null;
const patchedMenuBuf = menuCode ? Buffer.from(menuCode, "utf8") : null;
const patchedWizHtmlBuf = wizHtmlCode ? Buffer.from(wizHtmlCode, "utf8") : null;
const patchedProvSplashBuf = provSplashCode ? Buffer.from(provSplashCode, "utf8") : null;

// 6. Escanear e reconstruir árvore ASAR estritamente a partir da base limpa original
function scan(node, prefix = "") {
    let items = [];
    for (const [k, v] of Object.entries(node.files || {})) {
        const full = prefix ? prefix + "/" + k : k;
        if (v.files) {
            items = items.concat(scan(v, full));
        } else {
            items.push({ path: full, entry: v });
        }
    }
    return items;
}

function setDeep(obj, pathArr, leaf) {
    let cur = obj;
    for (let i = 0; i < pathArr.length - 1; i++) {
        const p = pathArr[i];
        if (!cur.files) cur.files = {};
        if (!cur.files[p]) cur.files[p] = {};
        cur = cur.files[p];
    }
    if (!cur.files) cur.files = {};
    cur.files[pathArr[pathArr.length - 1]] = leaf;
}

const allItems = scan(cleanHeader);
let currentOffset = 0;
const filesToWrite = [];
const newHeader = { files: {} };

for (const item of allItems) {
    const p = item.path;
    const e = item.entry;
    const parts = p.split("/");

    if (e.unpacked) {
        setDeep(newHeader, parts, { size: e.size, unpacked: true });
        continue;
    }

    if (p === "dist/languageServer.js") {
        const size = patchedLsBuf.length;
        const offset = currentOffset.toString();
        const integrity = computeIntegrity(patchedLsBuf);
        setDeep(newHeader, parts, { size, offset, integrity });
        filesToWrite.push({ type: "buffer", buffer: patchedLsBuf, size, path: p });
        currentOffset += size;
    } else if (p === "dist/tray.js" && patchedTrayBuf) {
        const size = patchedTrayBuf.length;
        const offset = currentOffset.toString();
        const integrity = computeIntegrity(patchedTrayBuf);
        setDeep(newHeader, parts, { size, offset, integrity });
        filesToWrite.push({ type: "buffer", buffer: patchedTrayBuf, size, path: p });
        currentOffset += size;
    } else if (p === "dist/main.js" && patchedMainBuf) {
        const size = patchedMainBuf.length;
        const offset = currentOffset.toString();
        const integrity = computeIntegrity(patchedMainBuf);
        setDeep(newHeader, parts, { size, offset, integrity });
        filesToWrite.push({ type: "buffer", buffer: patchedMainBuf, size, path: p });
        currentOffset += size;
    } else if (p === "dist/loadingOverlay.js" && patchedLoBuf) {
        const size = patchedLoBuf.length;
        const offset = currentOffset.toString();
        const integrity = computeIntegrity(patchedLoBuf);
        setDeep(newHeader, parts, { size, offset, integrity });
        filesToWrite.push({ type: "buffer", buffer: patchedLoBuf, size, path: p });
        currentOffset += size;
    } else if (p === "dist/updater.js" && patchedUpdaterBuf) {
        const size = patchedUpdaterBuf.length;
        const offset = currentOffset.toString();
        const integrity = computeIntegrity(patchedUpdaterBuf);
        setDeep(newHeader, parts, { size, offset, integrity });
        filesToWrite.push({ type: "buffer", buffer: patchedUpdaterBuf, size, path: p });
        currentOffset += size;
    } else if (p === "dist/menu.js" && patchedMenuBuf) {
        const size = patchedMenuBuf.length;
        const offset = currentOffset.toString();
        const integrity = computeIntegrity(patchedMenuBuf);
        setDeep(newHeader, parts, { size, offset, integrity });
        filesToWrite.push({ type: "buffer", buffer: patchedMenuBuf, size, path: p });
        currentOffset += size;
    } else if (p === "dist/ideInstall/wizardHtml.js" && patchedWizHtmlBuf) {
        const size = patchedWizHtmlBuf.length;
        const offset = currentOffset.toString();
        const integrity = computeIntegrity(patchedWizHtmlBuf);
        setDeep(newHeader, parts, { size, offset, integrity });
        filesToWrite.push({ type: "buffer", buffer: patchedWizHtmlBuf, size, path: p });
        currentOffset += size;
    } else if (p === "dist/provisionSplash.js" && patchedProvSplashBuf) {
        const size = patchedProvSplashBuf.length;
        const offset = currentOffset.toString();
        const integrity = computeIntegrity(patchedProvSplashBuf);
        setDeep(newHeader, parts, { size, offset, integrity });
        filesToWrite.push({ type: "buffer", buffer: patchedProvSplashBuf, size, path: p });
        currentOffset += size;
    } else {
        const size = e.size;
        const srcOffset = cleanBaseOffset + parseInt(e.offset, 10);
        const offset = currentOffset.toString();
        const leaf = { size, offset };
        if (e.integrity) leaf.integrity = e.integrity;
        setDeep(newHeader, parts, leaf);
        filesToWrite.push({ type: "copy", srcOffset, size, path: p });
        currentOffset += size;
    }
}

// 7. Serializar novo cabeçalho
const newJsonStr = JSON.stringify(newHeader);
const newJsonBuf = Buffer.from(newJsonStr, "utf8");
const newJsonSize = newJsonBuf.length;

const padding = (4 - (newJsonSize % 4)) % 4;
const headerSize = newJsonSize + padding;
const size2 = headerSize + 8;
const size3 = headerSize + 4;

const prefixBuf = Buffer.alloc(16);
prefixBuf.writeUInt32LE(4, 0);
prefixBuf.writeUInt32LE(size2, 4);
prefixBuf.writeUInt32LE(size3, 8);
prefixBuf.writeUInt32LE(newJsonSize, 12);

console.log("[*] Gerando novo app.asar traduzido para Antigravity (a partir da base 100% original em inglês)...");
const outFd = fs.openSync(tempAsar, "w");
fs.writeSync(outFd, prefixBuf, 0, 16);
fs.writeSync(outFd, newJsonBuf, 0, newJsonSize);
if (padding > 0) fs.writeSync(outFd, Buffer.alloc(padding));

const CHUNK_SIZE = 4 * 1024 * 1024;
const copyBuf = Buffer.alloc(CHUNK_SIZE);

for (let i = 0; i < filesToWrite.length; i++) {
    const f = filesToWrite[i];
    if (f.type === "buffer") {
        fs.writeSync(outFd, f.buffer, 0, f.buffer.length);
    } else {
        let remaining = f.size;
        let readPos = f.srcOffset;
        while (remaining > 0) {
            const toRead = Math.min(remaining, CHUNK_SIZE);
            fs.readSync(cleanFd, copyBuf, 0, toRead, readPos);
            fs.writeSync(outFd, copyBuf, 0, toRead);
            readPos += toRead;
            remaining -= toRead;
        }
    }
}

fs.closeSync(cleanFd);
fs.closeSync(outFd);

// 8. A atualização do pacote portátil fica a cargo do mantenedor do projeto
// 9. Substituição atômica final
fs.copyFileSync(tempAsar, srcAsar);
try { fs.unlinkSync(tempAsar); } catch (e) { }

// 10. Copiar web-bundle para resources/web-bundle
const targetWebBundle = path.join(resourcesDir, "web-bundle");
if (fs.existsSync(targetWebBundle)) fs.rmSync(targetWebBundle, { recursive: true, force: true });
fs.mkdirSync(targetWebBundle, { recursive: true });

function copyDirRecursive(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
            copyDirRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

copyDirRecursive(webBundleDir, targetWebBundle);
fs.writeFileSync(path.join(targetWebBundle, ".agy-ptbr-installed"), `PT-BR translation marker\nmain.js SHA256: ${sourceWebBundleHash}\n`, "utf8");
console.log("    [OK] Pasta web-bundle traduzida instalada com sucesso em resources/web-bundle!");

console.log("====================================================================");
console.log(` [OK] SUCESSO! Antigravity atualizado e traduzido na versão ${currentVersion}!`);
console.log("====================================================================");
