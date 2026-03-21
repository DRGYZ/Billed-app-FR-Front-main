# Billed Frontend

Frontend du projet OpenClassrooms P9 Billed.

Cette application permet de se connecter en tant qu'employe ou administrateur RH, de consulter des notes de frais, d'en creer de nouvelles cote employe, et de les valider ou refuser cote administrateur. Le frontend consomme l'API locale exposee par le backend sur `http://localhost:5678`.

## Stack

- JavaScript ES Modules
- HTML / CSS
- jQuery
- Jest
- Testing Library (`@testing-library/dom`, `user-event`)

## Prerequis

- Node.js
- npm
- Le backend Billed lance localement

Version verifiee dans ce repo : `Node.js 24.0.2` et `npm 11.3.0`.

## Installation

```bash
cd Billed-app-FR-Front-main
npm install
```

## Lancer le projet

1. Lancez d'abord le backend dans le repo `Billed-app-FR-Back-main`.
2. Dans ce repo frontend :

```bash
cd Billed-app-FR-Front-main
npx live-server
```

Application disponible sur :

```text
http://127.0.0.1:8080/
```

## Parcours disponibles

- Employe : connexion, consultation des notes de frais, creation d'une nouvelle note, envoi d'un justificatif.
- Administrateur RH : connexion, consultation du dashboard, visualisation d'un justificatif, validation ou refus d'une note.

## Comptes de test

Ces comptes sont verifies dans la base SQLite du backend (`database_dev.sqlite`) :

```text
Administrateur
email : admin@test.tld
mot de passe : admin

Employe
email : employee@test.tld
mot de passe : employee
```

## Tests

Lancer toute la suite :

```bash
npm test
```

Resultat actuel :

```text
11/11 suites
54/54 tests
```

## Couverture

Couverture actuelle obtenue avec `npm test` :

```text
Statements : 89.82%
Branches   : 74.55%
Functions  : 83.33%
Lines      : 92.19%
```

Le rapport HTML est genere dans :

```text
coverage/lcov-report/index.html
```

## Commandes utiles

```bash
npm test
npx live-server
```

## Structure du projet

```text
src/
  app/          Router, Store, utilitaires
  containers/   logique des pages
  views/        templates HTML
  css/          styles
  constants/    routes et constantes
  fixtures/     jeux de donnees de test
  __mocks__/    mocks API pour les tests
  __tests__/    tests unitaires et d'integration
```

## Notes de setup

- Le frontend n'a pas de script `start` npm : le lancement se fait via `live-server`.
- Les tests frontend utilisent des mocks (`src/__mocks__/store.js`) et peuvent etre executes sans lancer le backend.
- En execution normale, le frontend appelle l'API locale definie dans `src/app/Store.js`, sur `http://localhost:5678`.
