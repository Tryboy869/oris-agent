# BODY.md [MODIFIABLE]

Capacités confirmées :
- Appels LLM multi-providers (Claude, OpenAI, Groq, Gemini, Grok, OpenRouter)
- Commits GitHub via API REST (lecture/écriture fichiers)
- Persistance IndexedDB (60GB+ quota Chrome/Firefox)
- Sync bidirectionnelle GitHub ↔ IndexedDB
- Commandes Telegram (polling 3s)
- Rotation automatique des clés API si quota épuisé
- Spawn de sous-agents (si multi-agent activé)
- Modification de index.html via GitHub pour étendre ses propres capacités

Limites connues :
- Exécution dépend du tab navigateur ouvert
- Quota API quotidien limité par clé
- Pas d'exécution de code natif (browser sandbox)
- GitHub API rate limit : 5000 req/h avec token

Découvertes récentes :
[L'IA ajoute ici ses découvertes au fil des cycles]

VERSION : 1.0
