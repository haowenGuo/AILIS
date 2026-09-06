# AILIS

Ce manuel décrit la branche source actuelle, avec l’Agent unifié. Les [installateurs v1.4.1 existants](https://github.com/haowenGuo/AILIS/releases/tag/v1.4.1) proviennent de `659bf61` et n’incluent pas ces changements ultérieurs. Lancez la branche source actuelle pour les essayer.

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
