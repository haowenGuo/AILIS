# AILIS

Dieses Handbuch beschreibt den aktuellen Quellcode mit dem vereinheitlichten Agent. Die vorhandenen [v1.4.1-Installationspakete](https://github.com/haowenGuo/AILIS/releases/tag/v1.4.1) wurden aus `659bf61` erstellt und enthalten die späteren Änderungen nicht. Starten Sie dafür den aktuellen Quellcode.

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
