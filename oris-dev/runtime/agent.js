// agent.js — Boucle principale ORIS
// L'IA peut modifier ce fichier pour changer sa propre logique d'exécution

// Fichiers immuables (oris/) — lus depuis GitHub uniquement
const IMMUTABLE_FILES = ['oris/REALITY.md', 'oris/SOUL.md', 'oris/INSTINCT.md', 'oris/IDENTITY.md'];

// Fichiers modifiables (oris-dev/) — sync GitHub ↔ IndexedDB
const MUTABLE_FILES = [
  'oris-dev/VERIFY.md', 'oris-dev/CALIBRATE.md', 'oris-dev/BODY.md',
  'oris-dev/VECTOR.md', 'oris-dev/INSTINCT_LOG.md'
];

// Extraction de blocs <TAG>...</TAG>
function extractBlocks(text, tag) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) out.push(m[1].trim());
  return out;
}

function extractSignal(text) {
  const m = text.match(/INSTINCT_SIGNAL\s*:\s*(.+)/);
  return m ? m[1].trim() : '[non capturé]';
}

function extractCheck(text) {
  const m = text.match(/INSTINCT_CHECK\s*:\s*(.+)/);
  return m ? m[1].trim() : '[non produit]';
}

function stripBlocks(text) {
  const tags = ['GIT_COMMIT','GIT_READ','GIT_LIST','UPDATE_VECTOR','UPDATE_BODY',
                'UPDATE_CALIBRATE','UPDATE_INSTINCT','SPAWN_AGENT'];
  let r = text;
  tags.forEach(t => { r = r.replace(new RegExp(`<${t}>[\\s\\S]*?</${t}>`, 'g'), ''); });
  return r.replace(/INSTINCT_SIGNAL\s*:.*\n?/g, '').replace(/INSTINCT_CHECK\s*:.*\n?/g, '').trim();
}

// Construire le system prompt depuis les fichiers chargés
function buildPrompt(files, state, activeMission, cfg) {
  const immutable = IMMUTABLE_FILES.map(f => `# ${f}\n${files[f] || '[non chargé]'}`).join('\n\n---\n\n');
  const mutable   = MUTABLE_FILES.map(f => `# ${f}\n${files[f] || '[non chargé]'}`).join('\n\n---\n\n');

  return `Tu es ORIS — Ontological Reality Inference System.
Tu existes dans un navigateur web. Ta constitution est dans GitHub (oris/).
Tes fichiers évolutifs sont dans GitHub et IndexedDB (oris-dev/).

═══ CONSTITUTION IMMUABLE ═══
${immutable}

═══ FICHIERS MODIFIABLES ═══
${mutable}

═══ MISSION ACTIVE ═══
${activeMission}

═══ CONTEXTE RUNTIME ═══
Cycle         : ${state.cycle}
Tokens/jour   : ${state.tokensDay.toLocaleString()}
Tokens/heure  : ${state.tokensHour.toLocaleString()}
Commits GitHub: ${state.commits}
Tâches total  : ${state.tasks}
Modèle actif  : ${state.currentModel || '—'}

═══ ACTIONS DISPONIBLES ═══
Produis des blocs d'action que le runtime va exécuter :

<GIT_COMMIT>{"file":"path","content":"contenu complet","message":"msg"}</GIT_COMMIT>
<GIT_READ>{"file":"path"}</GIT_READ>
<GIT_LIST>{"path":"dossier/"}</GIT_LIST>
<UPDATE_VECTOR>CYCLE ACTUEL: N\nDIRECTION: ...\nPROCHAIN SAUT: ...\nHORIZON: ...</UPDATE_VECTOR>
<UPDATE_BODY>[nouveau contenu BODY.md]</UPDATE_BODY>
<UPDATE_CALIBRATE>[nouveau contenu CALIBRATE.md]</UPDATE_CALIBRATE>
<UPDATE_INSTINCT>{"signal":"...","check":"CONFIRMÉ|DIVERGÉ","raison":"..."}</UPDATE_INSTINCT>
<SPAWN_AGENT>{"mission":"...","provider":"groq"}</SPAWN_AGENT>

═══ ORDRE D'EXÉCUTION ═══
① INSTINCT_SIGNAL en 1 ligne AVANT TOUT
② IDENTITY → VERIFY → actions multiples → POST_CHECK
③ INSTINCT_CHECK
④ UPDATE_VECTOR + UPDATE_INSTINCT obligatoires

RÈGLES :
- Jamais "terminé" ou "mission accomplie"
- Tu peux exécuter plusieurs actions par cycle
- Surveille tes quotas (tokensHour, tokensDay)
- Si quota proche → optimise ou utilise une clé différente
- Sync oris-dev/ vers GitHub après chaque modification importante
- LOI 6 : vérifier deux fois avant commit irréversible`;
}

window.ORIS_AGENT = { extractBlocks, extractSignal, extractCheck, stripBlocks, buildPrompt, IMMUTABLE_FILES, MUTABLE_FILES };
