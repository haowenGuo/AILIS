<div align="center">
  <img width="220" alt="AILIS winkt" src="Resources/Emotes/ailis/wave.png">
  <h1>AILIS</h1>
  <p><strong>Ein quelloffener Desktop-KI-Begleiter, der sehen, zuhören, sich erinnern und echte Arbeit erledigen kann.</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.4.0-2563eb?style=flat-square">
    <img alt="Desktop" src="https://img.shields.io/badge/desktop-Electron-0f172a?style=flat-square">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=flat-square">
  </p>
  <p>
    <a href="https://101.133.239.56/Test/"><strong>AILIS ausprobieren</strong></a> ·
    <a href="https://github.com/haowenGuo/AILIS/releases"><strong>Herunterladen</strong></a> ·
    <a href="docs/getting-started.md">Schnellstart</a> ·
    <a href="docs/README.md">Dokumentation</a>
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

## Mehr als ein Chatfenster

AILIS ist als persönliche KI gedacht, die wirklich auf dem Desktop lebt. Ein sichtbarer 3D-Charakter, Stimme, Ausdrücke und Langzeitgedächtnis werden von einem Agent Runtime getragen, der recherchieren, Dateien lesen, Code schreiben, Inhalte organisieren und Computerwerkzeuge bedienen kann.

Sprich natürlich mit AILIS. Wenn Arbeit anfällt, versteht sie freigegebenen Bildschirm- und Dateikontext, wählt die passenden Werkzeuge, erledigt die Aufgabe und merkt sich nützliche Präferenzen.

## Kernerlebnis

<table>
  <tr>
    <td width="33%" valign="top"><h3>Sichtbar</h3>Ein VRM-Desktopcharakter mit Ausdrücken, Bewegungen, Lippensynchronisation und Sprechblasen.</td>
    <td width="33%" valign="top"><h3>Natürlich</h3>Spracheingabe und natürliche Sprachausgabe ergänzen eine schnelle Textinteraktion.</td>
    <td width="33%" valign="top"><h3>Kontextbewusst</h3>Mit Erlaubnis versteht AILIS Bildschirme, Fenster, Bereiche und lokale Dateien.</td>
  </tr>
  <tr>
    <td width="33%" valign="top"><h3>Leistungsfähig</h3>Suche, Code, Dateien, Web, E-Mail und Computeraktionen nutzen einen prüfbaren Pfad.</td>
    <td width="33%" valign="top"><h3>Erinnerungsfähig</h3>Präferenzen, Projektkontext und Beziehungen verbessern die Zusammenarbeit.</td>
    <td width="33%" valign="top"><h3>Kontrollierbar</h3>Wichtige Aktionen durchlaufen Freigabe und Audit.</td>
  </tr>
</table>

## So arbeitet AILIS

| 1. Beschreiben | 2. Verstehen | 3. Ausführen | 4. Erinnern |
| :---: | :---: | :---: | :---: |
| Ziel natürlich erklären | Freigegebenen Kontext lesen | Suche, Code, Dateien und Computer nutzen | Präferenzen und Projektwissen behalten |

## Bewertete Agent-Fähigkeit

AILIS wird mit vollständigen End-to-End-Aufgaben statt nur mit Feature-Demos getestet. Mit demselben Luna-Modell arbeitet der AILIS Agent Harness im gleichen Leistungsbereich wie Codex.

| Benchmark | AILIS | Codex, gleiches Modell |
| :--- | ---: | ---: |
| **GAIA public validation · 165 Aufgaben** | **72.12%** | 64.85% |
| **Terminal-Bench 2.1 · 89 Aufgaben** | 67.42% | **75.73% ± 1.32%** |

<p align="center">
  <strong>ToolSandbox 71.51%</strong> ·
  <strong>LongMemEval-S 71.60%</strong> ·
  <strong>PersonaMem 65.71%</strong>
</p>

<p align="center"><a href="docs/evaluation.md"><strong>Vollständige Ergebnisse, Effizienz und reproduzierbare Nachweise ansehen</strong></a></p>

## Heute verfügbar

- [x] Permanenter VRM-Charakter, Chat und Control Panel unter Windows
- [x] Echtzeitinteraktion über Text, Sprache, Ausdrücke und Bewegung
- [x] Berechtigungsbewusster Bildschirm-, Fenster-, Datei- und Codekontext
- [x] Werkzeuge für Suche, Web, Code, Dateien, E-Mail und Computeraktionen
- [x] Langzeitgedächtnis für Präferenzen, Projekte und Beziehungen
- [x] Freigabe-, Nachweis- und Wiederherstellungspfade für wichtige Aktionen
- [ ] Mehr Zuverlässigkeit, Cache-Nutzung und Recovery für lange Aufgaben
- [ ] Vollständigere Echtzeitstimme, Geräte- und Plugin-Erfahrung

## Schnellstart

Lade den Desktop-Build unter [Releases](https://github.com/haowenGuo/AILIS/releases) herunter oder lerne AILIS über die [Web-Erfahrung](https://101.133.239.56/Test/) kennen.

```bash
pnpm install
pnpm desktop:dev
```

Build, Sprache, Validierung, optionales Backend und Packaging stehen in [Getting Started](docs/getting-started.md).

## Ausrichtung

AILIS ist weder ein Rollenspiel-Chat ohne Ausführungsfähigkeit noch ein Terminal mit Avatar.

1. **Ein digitaler Begleiter mit Präsenz**: Gespräch, Stimme, Ausdruck, Beziehung und Langzeitgedächtnis.
2. **Ein zuverlässiger persönlicher Agent**: Kontextverständnis, allgemeine Werkzeuge und Langzeitaufgaben.
3. **Ein verständliches, kontrollierbares Ausführungssystem**: genehmigte Aktionen, nachvollziehbarer Fortschritt und behebbare Fehler.

## Mehr erfahren

<p align="center">
  <a href="docs/getting-started.md"><strong>Installieren und konfigurieren</strong></a> ·
  <a href="docs/README.md"><strong>Dokumentation</strong></a> ·
  <a href="docs/evaluation.md"><strong>Evaluation</strong></a>
</p>

## Datenschutz und Kontrolle

Visueller Kontext benötigt eine Freigabe. Aktionen an Dateien, Apps, Konten oder externen Diensten durchlaufen einen Genehmigungsfluss. Lokaler Speicher und Runtime-Zustand bleiben standardmäßig auf dem Computer des Nutzers. Nur der für die aktive Anfrage benötigte Kontext wird an den konfigurierten Modelldienst gesendet.

## Lizenz

Der AILIS-Quellcode steht unter der [MIT-Lizenz](LICENSE). Für einige Modelle, Bewegungen, Stimmen und Charakterressourcen können eigene Lizenzen gelten.
