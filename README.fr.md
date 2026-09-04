<div align="center">
  <img width="220" alt="AILIS fait signe de la main" src="Resources/Emotes/ailis/wave.png">
  <h1>AILIS</h1>
  <p><strong>Un compagnon IA de bureau open source qui peut voir, écouter, mémoriser et accomplir un travail réel.</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.4.1-2563eb?style=flat-square">
    <img alt="Desktop" src="https://img.shields.io/badge/desktop-Electron-0f172a?style=flat-square">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=flat-square">
  </p>
  <p>
    <a href="https://101.133.239.56/Test/"><strong>Essayer AILIS</strong></a> ·
    <a href="https://github.com/haowenGuo/AILIS/releases"><strong>Télécharger</strong></a> ·
    <a href="docs/getting-started.md">Démarrage rapide</a> ·
    <a href="docs/README.md">Documentation</a>
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

## Plus qu'une fenêtre de chat

AILIS est conçu comme une IA personnelle qui vit réellement sur le bureau. Son personnage 3D visible, sa voix, ses expressions et sa mémoire à long terme s'appuient sur un Agent Runtime capable de rechercher, lire des fichiers, écrire du code, organiser du contenu et utiliser l'ordinateur.

Parlez naturellement à AILIS. Lorsqu'un travail est nécessaire, elle comprend le contexte d'écran et de fichiers autorisé, choisit les bons outils, termine la tâche et mémorise les préférences utiles.

## Expérience centrale

<table>
  <tr>
    <td width="33%" valign="top"><h3>Visible</h3>Un personnage VRM avec expressions, mouvements, synchronisation labiale et bulles de dialogue.</td>
    <td width="33%" valign="top"><h3>Conversationnelle</h3>Entrée vocale et parole naturelle complètent une interaction texte rapide.</td>
    <td width="33%" valign="top"><h3>Contextuelle</h3>Avec autorisation, AILIS comprend écrans, fenêtres, zones capturées et fichiers locaux.</td>
  </tr>
  <tr>
    <td width="33%" valign="top"><h3>Capable</h3>Recherche, code, fichiers, Web, e-mail et actions ordinateur partagent un chemin auditable.</td>
    <td width="33%" valign="top"><h3>Mémoire</h3>Les préférences, projets et relations utiles sont conservés pour mieux collaborer.</td>
    <td width="33%" valign="top"><h3>Contrôlable</h3>Les actions importantes passent par des flux d'approbation et d'audit.</td>
  </tr>
</table>

## Comment fonctionne AILIS

| 1. Décrire | 2. Comprendre | 3. Exécuter | 4. Mémoriser |
| :---: | :---: | :---: | :---: |
| Expliquer l'objectif naturellement | Lire le contexte autorisé | Utiliser recherche, code, fichiers et ordinateur | Conserver préférences et contexte projet |

## Capacité Agent évaluée

AILIS est évalué sur des tâches complètes de bout en bout. Les résultats historiques ci-dessous appartiennent à des sources figées (GAIA A6 et Terminal A7), et non à une nouvelle évaluation de v1.4.1. Voir le [registre des versions et des preuves](docs/ailis-version-registry.md) et les [notes de version](docs/releases/v1.4.1.md).

| Benchmark | AILIS | Codex, même modèle |
| :--- | ---: | ---: |
| **GAIA public validation · 165 tâches** | **72.12%** | 64.85% |
| **Terminal-Bench 2.1 · 89 tâches** | 67.42% | **75.73% ± 1.32%** |

<p align="center">
  <strong>ToolSandbox 71.51%</strong> ·
  <strong>LongMemEval-S 71.60%</strong> ·
  <strong>PersonaMem 65.71%</strong>
</p>

<p align="center"><a href="docs/evaluation.md"><strong>Voir les scores complets, l'efficacité et les preuves reproductibles</strong></a></p>

## Fonctionnalités disponibles

- [x] Personnage VRM résident, chat et panneau de contrôle sous Windows
- [x] Interaction en temps réel par texte, voix, expressions et mouvements
- [x] Contexte autorisé d'écran, fenêtres, fichiers et code
- [x] Outils de recherche, Web, code, fichiers, e-mail et ordinateur
- [x] Mémoire à long terme des préférences, projets et relations
- [x] Approbation, preuves et récupération pour les actions importantes
- [ ] Fiabilité, cache et récupération renforcés pour les tâches longues
- [ ] Expérience voix temps réel, multi-appareils et plugins plus complète

## Démarrage rapide

Téléchargez l'application depuis [Releases](https://github.com/haowenGuo/AILIS/releases), ou découvrez AILIS via [l'expérience Web](https://101.133.239.56/Test/).

```bash
pnpm install
pnpm desktop:dev
```

La construction, la voix, la validation, le backend optionnel et le packaging sont décrits dans [Getting Started](docs/getting-started.md).

## Direction

AILIS n'est ni un chat de rôle sans capacité d'exécution, ni un terminal habillé d'un avatar.

1. **Un compagnon numérique présent** : conversation, voix, expressions, relations et mémoire.
2. **Un Agent personnel fiable** : compréhension du contexte, outils généraux et tâches longues.
3. **Un système compréhensible et contrôlable** : actions approuvées, progrès traçables et erreurs récupérables.

## En savoir plus

<p align="center">
  <a href="docs/getting-started.md"><strong>Installer et configurer</strong></a> ·
  <a href="docs/README.md"><strong>Documentation</strong></a> ·
  <a href="docs/evaluation.md"><strong>Évaluations</strong></a>
</p>

## Vie privée et contrôle

Le contexte visuel nécessite une autorisation. Les actions affectant fichiers, applications, comptes ou services externes passent par une approbation, et la mémoire locale ainsi que l'état Runtime restent par défaut sur l'ordinateur de l'utilisateur. Seul le contexte nécessaire à la requête active est envoyé au service modèle configuré.

## Licence

Le code source AILIS est publié sous [licence MIT](LICENSE). Certains modèles, mouvements, voix et ressources de personnage peuvent avoir leurs propres licences.
