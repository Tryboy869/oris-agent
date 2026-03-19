# Contributing to ORIS

## Principe fondamental

ORIS est un projet de recherche en cours. Les contributions doivent respecter la distinction fondamentale :

- **oris/** — Ne jamais modifier sans discussion approfondie. Ce sont les lois physiques du système.
- **oris-dev/** — Zone d'évolution. L'IA elle-même y contribue à chaque cycle.
- **index.html** — Le runtime. Modifications bienvenues via PR.

## Comment contribuer

1. Fork le repo
2. Crée une branche : `git checkout -b feature/ma-feature`
3. Teste dans ton propre déploiement avant de soumettre
4. Ouvre une Pull Request avec description détaillée

## Ce qu'on cherche

- Nouveaux outils dans `oris-dev/runtime/tools.js`
- Optimisations du cycle agent dans `oris-dev/runtime/agent.js`
- Support de nouveaux providers LLM
- Améliorations de l'interface

## Ce qu'on ne veut pas

- Modifications de `oris/REALITY.md`, `oris/SOUL.md`, `oris/INSTINCT.md`, `oris/IDENTITY.md`
- Ajout de dépendances externes (npm, CDN tiers non fiables)
- Code qui contourne les limites de budget

## Contact

Daouda Abdoul Anzize — voir README pour les liens.
