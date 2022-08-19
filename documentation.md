# Architektur

## Server

### Konfigurationsdateien
- [package.json](package.json): Applikations Spezifikationen
- [.env](.env): Environment Variablen (Datenbank)
- [.cpanel.yml](.cpanel.yml): Deployment file für den host von innology.ch
- [index.js](index.js): 
  - starten der Applikation
  - definieren der Applikationsstruktur, Bodyparser, Express-Session, öffentliche Ordner
  - öffnen des Websockets auf der Serverseite

### private
- **configs**: Serverspezifische Konfigurationsdateien
- **controller**: 
  - Logik der Komponenten User und Showroom
  - Verhalten für die unterschiedlichen Requests
- **middleware**: Fileuploadspezifikation bei Upload-Requests
- **models**: Mongoose Datenbank Modlle für Showroom und Client
- **routes**: Handling der unterscheidlichen URL Routen und HTTP Requests
- **templates**: json2html Templates um die Daten aus der Datenbank in ein HTML zu wrappen
- **util**: nützliche sonstige Funktionen z.B. Filesystemcalls


### views:
- alle unterschiedlichen ejs-Templates
- showrooms: Startseite
- view: Konfigurator

## Client
### public
- **components**: A-Frame Komponenten
- **css**: CSS Stylesheets
- **js**:
  - **Object-Selector Controller**: Logik und Verhalten für die Auswahl und Manipulation von 3D-Objekten auf Clientseite
  - **showroom-client**: Client Websocket Verbindung
  - **backsideFixing**: Schattenkorrekturen für alle 3D-Modelle
  - **popup**: sonstige JavaScript Funktionen (Hauptsächlich Popups) auf Clientseite

#### resources:
- icons
- **skyboxes**: 360° Bilder für die Umgebung ausserhalb des Showrooms
- **uploads**: 
  - **rooms**: Modell des Standard Raums
  - **email**: Speicherung der vom Client hochgeladenen Objekte
