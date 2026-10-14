const fs = require("node:fs");
const path = require("node:path");

const target = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, "..", "web-bundle", "main.js");

if (!fs.existsSync(target)) {
  console.error(`[ERRO] Arquivo não encontrado: ${target}`);
  process.exit(1);
}

const source = fs.readFileSync(target, "utf8");
const key = '"No plugins available"';
const translation = '"Não há plugins disponíveis."';

if (source.includes(`${key}: ${translation}`)) {
  console.log("[OK] A mensagem do menu de plugins já está traduzida.");
  process.exit(0);
}

const anchor = '  "No plugins available.": "Não há plugins disponíveis.",';
if (!source.includes(anchor)) {
  console.error("[ERRO] Não encontrei a entrada de tradução esperada; nenhum arquivo foi alterado.");
  process.exit(2);
}

const updated = source.replace(
  anchor,
  `  ${key}: "Não há plugins disponíveis.",\n${anchor}`
);

if (updated === source) {
  console.error("[ERRO] Não foi possível aplicar a tradução; nenhum arquivo foi alterado.");
  process.exit(3);
}

fs.writeFileSync(target, updated, "utf8");
console.log(`[OK] Mensagem adicionada ao dicionário PT-BR: ${target}`);
