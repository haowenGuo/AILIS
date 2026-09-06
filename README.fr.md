# AILIS

AILIS est un agent de bureau avec avatar VRM, texte, voix, outils et mémoire persistante. La conversation principale utilise un seul Agent et une Session durable pour dialoguer, agir et produire la réponse finale. La personnalité est une configuration, pas un second modèle qui réécrit le résultat.

[English](README.md) · [中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md)

Le paquet porte la version 1.4.1. Ces documents décrivent le code `00b3244` d'un arbre de travail indépendant, vérifié le 2026-09-06. Deux applications portant le même numéro peuvent contenir des sources différentes.

## Démarrage

À la racine du dépôt, utiliser pnpm 10.33.0. La validation locale enregistrée utilisait Node 22.17.1.

```powershell
pnpm install --frozen-lockfile
pnpm desktop:dev
```

Vérifier le modèle, les identifiants et le répertoire d'état dans le panneau de contrôle. La voix, la vision et les outils externes ont leurs propres dépendances. Installation et démarrage modifient l'état local.

## Documentation actuelle

Le manuel technique est maintenu en chinois dans une seule série de pages pour éviter les traductions divergentes : [index](docs/README.md), [architecture](docs/architecture.md), [configuration](docs/configuration.md), [évaluation](docs/evaluation.md), [diagnostic](docs/troubleshooting.md).

Le stockage local ne garantit ni un fonctionnement hors ligne ni le chiffrement. Les outils peuvent accéder aux fichiers et à des services externes. Les anciens scores ne sont pas présentés comme des mesures de ce code.

[Contribuer](CONTRIBUTING.md) · [Licence](LICENSE). Les modèles, voix et ressources tierces conservent leurs conditions propres.
