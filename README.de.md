# AILIS

Dieses Handbuch beschreibt den aktuellen Quellcode mit dem vereinheitlichten Agent. [Version 1.4.2](https://github.com/haowenGuo/AILIS/releases/tag/v1.4.2) enthält neue Chat- und Einstellungsoberflächen sowie ASR-Korrekturen. Unity und große Sprach- oder Modelllaufzeiten sind nicht enthalten. Voraussetzungen stehen in den [Versionshinweisen](docs/releases/v1.4.2.md).

AILIS ist eine Desktop-Anwendung für Text- und Sprachdialoge, Aufgaben mit Werkzeugen, dauerhaften Kontext und einen VRM-Avatar.

## Starten

Im Stammverzeichnis des Repositorys mit pnpm 10.33.0:

```powershell
pnpm install --frozen-lockfile
pnpm desktop:dev
```

Konfigurieren Sie einen Modelldienst im Kontrollfenster. Sprache, Bildverarbeitung und externe Werkzeuge benötigen eigene Einstellungen und Abhängigkeiten.

[Chinesisches Handbuch](docs/README.md) · [English](README.md) · [Mitwirken](CONTRIBUTING.md) · [Lizenz](LICENSE)

Das ausführliche technische Handbuch wird zentral auf Chinesisch gepflegt. Für externe Modelle und Ressourcen gelten eigene Nutzungsbedingungen.
