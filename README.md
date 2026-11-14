# Billed Frontend

Application OpenClassrooms de gestion des notes de frais. Un employé peut consulter ses notes et envoyer un justificatif. L’administration peut examiner les justificatifs et valider ou refuser une note.

[API Billed sur GitHub](https://github.com/DRGYZ/Billed-app-FR-Back-main)

## Lancer la démo locale

Utilisez Node.js 24 et npm pour l’API, et Python 3 pour servir le frontend. Lancez les commandes dans deux terminaux depuis les dossiers correspondants.

**Terminal 1 · API**

```sh
cd Billed-app-FR-Back-main
npm ci
npm run run:dev
```

**Terminal 2 · Frontend**

```sh
cd Billed-app-FR-Front-main
python -m http.server 8080 --bind 127.0.0.1
```

Ouvrez `http://127.0.0.1:8080/`. Le frontend utilise l’API sur `http://localhost:5678`. Le backend prépare les comptes de démo suivants.

| Écran | E-mail | Mot de passe de démo |
| --- | --- | --- |
| Employé | `employee@test.tld` | `employee` |
| Administration | `admin@test.tld` | `admin` |

## Tests

Dans le dépôt frontend, les tests Jest utilisent des mocks et tournent sans lancer l’API.

```sh
npm ci
npm test -- --runInBand
```

Le rapport HTML de couverture se trouve dans `coverage/lcov-report/index.html`. Le workflow GitHub Actions utilise les mêmes commandes.

## Structure

- `src/app/` contient le routeur, le client API et les fonctions de formatage.
- `src/containers/` gère les interactions et `src/views/` contient les templates.
- `src/__tests__/`, `src/__mocks__/` et `src/fixtures/` couvrent les parcours côté navigateur.
