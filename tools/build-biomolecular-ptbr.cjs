const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', 'biomolecular-sidecar', '1.3.0');
const originalMain = path.join(root, 'original', 'dist', 'main.js');
const translatedMain = path.join(root, 'translated', 'dist', 'main.js');
let source = fs.readFileSync(originalMain, 'utf8');

const replacements = [
  ['M`Representation`', 'M`Representação`'],
  ['M`Components`', 'M`Componentes`'],
  ['M`Select &amp; customize`', 'M`Selecionar e personalizar`'],
  ['{rep:"cartoon",label:"Cartoon",title:"Cartoon (Helices & Sheets)"}', '{rep:"cartoon",label:"Fita",title:"Fita (hélices e folhas)"}'],
  ['{rep:"stick",label:"Stick",title:"Stick"}', '{rep:"stick",label:"Bastões",title:"Bastões"}'],
  ['{rep:"sphere",label:"Sphere",title:"Sphere (van der Waals)"}', '{rep:"sphere",label:"Esferas",title:"Esferas (van der Waals)"}'],
  ['{rep:"surface",label:"Surface",title:"Surface"}', '{rep:"surface",label:"Superfície",title:"Superfície"}'],
  ['{rep:"line",label:"Line",title:"Line"}', '{rep:"line",label:"Linha",title:"Linha"}'],
  ['label:"Waters",title:"Toggle Waters / Solvent visibility"', 'label:"Águas",title:"Alternar visibilidade de águas e solvente"'],
  ['label:"Sugars",title:"Toggle Sugars / Carbohydrates visibility"', 'label:"Açúcares",title:"Alternar visibilidade de açúcares e carboidratos"'],
  ['label:"Ligands",title:"Toggle Ligands visibility"', 'label:"Ligantes",title:"Alternar visibilidade de ligantes"'],
  ['label:"Sidechains",title:"Toggle Sidechain sticks visibility"', 'label:"Cadeias laterais",title:"Alternar visibilidade das cadeias laterais"'],
  ['Hi=[{value:"residue",label:"Residue"},{value:"chain",label:"Chain"}]', 'Hi=[{value:"residue",label:"Resíduo"},{value:"chain",label:"Cadeia"}]'],
  ['Oi="Select residues, use SHIFT click to select a range, CTRL / CMD click to add or remove"', 'Oi="Selecione resíduos. Use Shift + clique para selecionar um intervalo e Ctrl/Cmd + clique para adicionar ou remover itens."'],
  ['Di="Shift+click selects a range; Ctrl / Cmd+click adds or removes; Escape clears."', 'Di="Shift + clique seleciona um intervalo; Ctrl/Cmd + clique adiciona ou remove itens; Esc limpa a seleção."'],
  ['var vi="No selections yet",wi="No annotation"', 'var vi="Nenhuma seleção ainda",wi="Nenhuma anotação"'],
  ['<span id="bm-select-label" class="bm-label">Select</span>', '<span id="bm-select-label" class="bm-label">Selecionar</span>'],
  ['title="Click to select a whole ${n.value}"', 'title="Clique para selecionar toda a ${n.value}"'],
  ['<span id="bm-selection-count" class="bm-selection-count">${e.length} selected</span>', '<span id="bm-selection-count" class="bm-selection-count">${e.length} selecionado(s)</span>'],
  ['title="Deselect everything"', 'title="Desmarcar tudo"'],
  ['>Clear</button>', '>Limpar</button>'],
  ['aria-label="Selected residues"', 'aria-label="Resíduos selecionados"'],
  ['Remove ${e.label} from selection', 'Remover ${e.label} da seleção'],
  ['M`Selections (<span', 'M`Seleções (<span'],
  ['>Delete All</button>', '>Excluir tudo</button>'],
  ['<div id="bm-color-label" class="bm-field-label">Color</div>', '<div id="bm-color-label" class="bm-field-label">Cor</div>'],
  ['<label class="bm-field-label" for="bm-note-input">Annotation\n          <span class="bm-optional">(optional)</span></label>', '<label class="bm-field-label" for="bm-note-input">Anotação\n          <span class="bm-optional">(opcional)</span></label>'],
  ['placeholder="Enter annotation"', 'placeholder="Digite uma anotação"'],
  ['aria-label="Annotation text"', 'aria-label="Texto da anotação"'],
  ['aria-label="Viewer controls"', 'aria-label="Controles do visualizador"'],
  ['"Annotations shown."', '"Anotações visíveis."'],
  ['"Annotations hidden."', '"Anotações ocultas."'],
  ['@click=${()=>{this.save()}}>Save</button>', '@click=${()=>{this.save()}}>Salvar</button>'],
  ['title="Refresh file list"', 'title="Atualizar lista de arquivos"'],
  ['aria-label="Refresh file list"', 'aria-label="Atualizar lista de arquivos"'],
  ['title="Upload local PDB/CIF file from disk"', 'title="Enviar arquivo PDB/CIF local do disco"'],
  ['              Upload\n', '              Enviar\n'],
  ['-- No structure files in this conversation --', '-- Não há arquivos de estrutura nesta conversa --'],
  ['-- Select a file --', '-- Selecione um arquivo --'],
];

for (const [from, to] of replacements) {
  if (!source.includes(from)) throw new Error(`Texto esperado não encontrado no bundle original: ${from}`);
  source = source.replaceAll(from, to);
}

fs.mkdirSync(path.dirname(translatedMain), { recursive: true });
fs.writeFileSync(translatedMain, source, 'utf8');
const translatedHtml = fs.readFileSync(path.join(root, 'original', 'ui.html'), 'utf8')
  .replace('<html lang="en">', '<html lang="pt-BR">')
  .replace('<title>Biomolecular Structure Viewer</title>', '<title>Visualizador de Estruturas Biomoleculares</title>')
  .replace('>Biomolecular Structure Viewer</div>', '>Visualizador de Estruturas Biomoleculares</div>')
  .replace('Something went wrong. Try closing and reopening the Biomolecular Structure Viewer.', 'Algo deu errado. Tente fechar e reabrir o Visualizador de Estruturas Biomoleculares.');
fs.writeFileSync(path.join(root, 'translated', 'ui.html'), translatedHtml, 'utf8');
console.log(`Tradução do visualizador biomolecular ${replacements.length} substituições.`);
