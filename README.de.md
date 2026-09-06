# AILIS

AILIS ist ein Desktop-Agent mit VRM-Avatar, Text, Sprache, Werkzeugen und dauerhaftem Gedächtnis. Im Hauptdialog übernimmt ein Agent mit einer persistenten Session Gespräch, Ausführung und abschließende Antwort. Persönlichkeit ist Konfiguration, kein zweites Modell zur nachträglichen Umschreibung.

[English](README.md) · [中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md)

Die Paketversion ist 1.4.1. Diese Dokumentation beschreibt den Quellstand `00b3244` eines unabhängigen Worktrees, geprüft am 2026-09-06. Gleiche Versionsnummern bedeuten nicht zwingend identischen Code.

## Start

Im Repository-Stamm pnpm 10.33.0 verwenden. Die dokumentierte lokale Prüfung nutzte Node 22.17.1.

```powershell
pnpm install --frozen-lockfile
pnpm desktop:dev
```

Modell, Zugangsdaten und Zustandsverzeichnis im Kontrollfenster prüfen. Sprache, Bildverarbeitung und externe Werkzeuge benötigen zusätzliche Konfiguration. Installation und Start verändern den lokalen Zustand.

## Aktuelle Dokumentation

Das technische Handbuch wird als eine chinesische Fassung gepflegt, damit parallele Übersetzungen nicht auseinanderlaufen: [Übersicht](docs/README.md), [Architektur](docs/architecture.md), [Konfiguration](docs/configuration.md), [Bewertung](docs/evaluation.md), [Fehlersuche](docs/troubleshooting.md).

Lokale Speicherung garantiert weder Offline-Betrieb noch Verschlüsselung. Werkzeuge können Dateien und externe Dienste verwenden. Historische Benchmarkwerte gelten nicht als Messung dieses Quellstands.

[Mitwirken](CONTRIBUTING.md) · [Lizenz](LICENSE). Für externe Modelle, Stimmen und Assets gelten jeweils eigene Bedingungen.
