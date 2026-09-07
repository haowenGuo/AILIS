# AILIS

Ce manuel décrit le code actuel avec l’Agent unifié. La [version 1.4.2](https://github.com/haowenGuo/AILIS/releases/tag/v1.4.2) comprend les nouvelles interfaces de discussion et de configuration ainsi que les corrections ASR. Unity et les environnements vocaux ou modèles volumineux ne sont pas inclus. Consultez les [notes de version](docs/releases/v1.4.2.md) pour les prérequis.

AILIS est une application de bureau proposant des échanges texte et voix, des tâches avec outils, un contexte persistant et un avatar VRM.

## Démarrer

Depuis la racine du dépôt, avec pnpm 10.33.0 :

```powershell
pnpm install --frozen-lockfile
pnpm desktop:dev
```

Configurez un service de modèle dans le panneau de contrôle. La voix, la vision et les outils externes nécessitent leurs propres paramètres et dépendances.

[Manuel en chinois](docs/README.md) · [English](README.md) · [Contribuer](CONTRIBUTING.md) · [Licence](LICENSE)

Le manuel technique détaillé est centralisé en chinois. Les modèles et ressources externes conservent leurs conditions respectives.
