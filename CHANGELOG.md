# Changelog

Toutes les modifications notables sont documentées ici.
Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

## [1.0.0] — 2026-03-19

### Ajouté
- Architecture ORIS complète : constitution immuable + fichiers modifiables
- Support multi-providers : Claude, OpenAI, Groq, Gemini, OpenRouter, Grok
- Rotation automatique des clés API si quota épuisé
- Sync bidirectionnelle GitHub ↔ IndexedDB
- Protocole dual-process INSTINCT (TEMPS 0 / TEMPS 1 / TEMPS 2)
- VECTOR.md avec horizon permanent
- Contrôle Telegram (polling, 9 commandes)
- Commits GitHub autonomes depuis le navigateur
- Multi-agents (spawn de sous-agents)
- Budget configurable par cycle / heure / jour
- Interface dark theme JetBrains Mono
- Fallback GitHub si IndexedDB corrompu

### Architecture
- `oris/` : fichiers immuables (constitution)
- `oris-dev/` : fichiers modifiables par l'IA
- `oris-dev/runtime/` : scripts JS modifiables
