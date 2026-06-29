<div align="center">
  <h1>AILIS Assistant</h1>
  <p><strong>Un assistant IA incarné pour desktop, open source, avec personnage VRM, voix temps réel, contexte visuel, mémoire et Agent Harness inspiré de Codex.</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.0.6-2563eb?style=for-the-badge">
    <img alt="Runtime" src="https://img.shields.io/badge/runtime-Electron-0f172a?style=for-the-badge">
    <img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-059669?style=for-the-badge">
  </p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README.zh-CN.md">简体中文</a> ·
    <a href="README.ja.md">日本語</a> ·
    <a href="README.ko.md">한국어</a> ·
    <a href="README.fr.md">Français</a> ·
    <a href="README.de.md">Deutsch</a>
  </p>
</div>

---

## Qu'est-ce qu'AILIS

AILIS Assistant est un assistant IA incarné conçu d'abord pour le desktop. Il réunit un personnage 3D VRM, des fenêtres Electron, l'interaction vocale, le contexte visuel basé sur des captures d'écran, la mémoire et un Agent Runtime structuré.

AILIS n'est pas un simple chatbot web. Le projet vise un assistant personnel de bureau capable de parler avec l'utilisateur, de comprendre le contexte de l'écran avec permission, de retenir les préférences utiles et d'exécuter des tâches via des outils explicites et auditables.

## Direction du projet

AILIS cherche à combiner l'expressivité d'un personnage et la fiabilité d'un système d'exécution.

- Une couche personnage avec présence, expressions, mouvements, voix et continuité relationnelle.
- Un Agent Harness pour planifier, router les outils, demander validation, journaliser les preuves et récupérer après erreur.
- Un runtime desktop local-first où les paramètres, mémoires, logs et modèles restent sous le contrôle de l'utilisateur.

## Capacités actuelles

- Personnage VRM desktop avec expressions, motions, lip sync et bulles de dialogue.
- Fenêtre de mascotte Electron, fenêtre de chat, panneau de contrôle, intégration tray et état local persistant.
- Configuration de fournisseurs de modèles compatibles OpenAI, avec base URL personnalisée et workflows locaux.
- Workers TTS desktop, chemins de voix cloud et worker optionnel de reconnaissance vocale locale.
- Contexte visuel avec permissions via captures d'écran, fenêtres et régions.
- Blocs de mémoire, contexte de projet, état relationnel et réflexion légère.
- Couche d'outils pour fichiers, code, actions ordinateur, email, compétences MCP, Web/Search et utilitaires locaux.
- Modèle d'approbation explicite pour les actions affectant fichiers, applications, comptes ou services externes.
- Évaluations d'expérience humaine, tests de contrats d'outils, vérifications Gateway et smoke tests d'agent.

## Architecture

```text
Utilisateur / Voix / Écran
        |
        v
AILIS Desktop UI
  - Personnage VRM
  - Fenêtre de chat
  - Panneau de contrôle
        |
        v
Agent Harness
  - planner
  - tool router
  - approval gate
  - evidence log
  - recovery loop
        |
        v
Runtime Services
  - model providers
  - voice / ASR / TTS
  - vision capture
  - memory store
  - local tools / MCP
        |
        v
Validation
  - tests
  - evals
  - smoke checks
```

## Structure du dépôt

```text
electron/   Processus principal Electron, preload bridge, services runtime, adaptateurs d'outils locaux
src/        Applications renderer pour mascotte, chat, contrôle, voix, vision UI et bulles
backend/    Backend FastAPI optionnel, schémas API, services mémoire et assets statiques
Resources/  Modèle VRM, motions VRMA, audio de référence et assets personnage
docs/       Architecture, mémoire, écosystème d'outils, évaluation et planning de release
evals/      Scénarios d'expérience humaine et données d'évaluation long terme
scripts/    Préparation runtime, validation, smoke tests, benchmarks et packaging
tests/      Tests runtime, mémoire, outils, contrats, gateway et comportement agent
```

## Démarrage rapide

```bash
pnpm install
pnpm desktop:dev
```

Construire et lancer:

```bash
pnpm desktop:start
```

Packager l'application Windows:

```bash
pnpm desktop:package
```

Backend optionnel:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python -m uvicorn backend.main:app --reload
```

## Modèles et voix

AILIS n'est pas lié à un fournisseur unique. La configuration peut se faire via le panneau de contrôle desktop ou les fichiers d'environnement locaux.

- Fournisseurs cloud compatibles OpenAI.
- Endpoints vLLM locaux.
- Workflows locaux orientés Ollama.
- Base URL, nom de modèle, timeout et clés privées personnalisés.
- Préparation optionnelle du runtime ASR local et TTS desktop.

Ne committez jamais de vraies clés API, identifiants, transcriptions, caches de modèles, logs runtime ou résultats d'évaluation générés.

## Commandes utiles

```bash
pnpm test:ailis-runtime
pnpm test:ailis-agent
pnpm test:ailis-tool-contracts
pnpm test:ailis-memory
pnpm ailis:validate-harness
```

Validation Gateway complète:

```bash
pnpm ailis:validate-gateway
```

## Documents clés

- [Embodied Agent Architecture](docs/ailis-embodied-agent-architecture.md)
- [Memory Architecture V2](docs/ailis-memory-architecture-v2.md)
- [Humanlike Eval](docs/ailis-humanlike-eval.md)
- [Tool Ecosystem Driver Guide](docs/tool-ecosystem-driver-guide.md)

## État du projet

Ligne de release actuelle : `v1.0.6`.

AILIS est en développement actif. Le runtime desktop, l'Agent Harness, la couche d'outils et la surface d'évaluation sont déjà importants, mais le projet doit encore être considéré comme un product/runtime en phase alpha plutôt qu'un Agent OS de production. Les priorités immédiates sont les contrats d'outils, les validations plus sûres, une meilleure mémoire, une configuration locale plus fluide et des évaluations end-to-end plus solides.

## Confidentialité et sécurité

- La capture visuelle est basée sur la permission et sert à comprendre le contexte.
- Les actions qui affectent fichiers, applications, comptes ou services externes doivent passer par une approbation explicite.
- La mémoire et l'état runtime restent locaux sauf choix contraire de l'utilisateur.
- Les secrets doivent rester dans la configuration locale, jamais dans le dépôt.

## Licence

Le code source d'AILIS est publié sous [Apache License 2.0](LICENSE). Certains assets, modèles, motions ou ressources vocales inclus ou tiers peuvent avoir leurs propres licences; vérifiez les notes associées avant redistribution.
