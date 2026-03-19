# 🎓 StudentCRUD

API REST de gestion d'étudiants avec **Bun**, **Hono** et **Zod**.

---

## 🛠️ Stack technique

* **Bun** : Runtime & gestionnaire de paquets
* **Hono** : Framework HTTP
* **Zod** : Validation des données
* **Vitest** : Tests unitaires
* **ESLint** : Linter TypeScript

---

## 📁 Structure du projet

```
StudentCRUD/
├── data/
│   ├── students.json          # Données persistantes
│   └── students.test.json     # Fixtures tests
├── src/
│   ├── schemas/               # Schémas Zod
│   ├── Models/                # Interfaces
│   ├── services/              # Logique métier
│   ├── views/                 # Formatage des réponses
│   ├── Controllers/           # Handlers HTTP
│   ├── Routes/                # Routes Hono
│   ├── __tests__/             # Tests unitaires
│   └── index.ts               # Point d'entrée
├── eslint.config.ts
├── vitest.config.ts
└── package.json
```

---

## 🚀 Installation & lancement

```sh
bun install
bun run dev
```

Le serveur démarre sur **[http://localhost:3000](http://localhost:3000)**.

---

## 📡 Endpoints

* `GET /students` : Liste des étudiants
* `GET /students/:id` : Étudiant par ID
* `POST /students` : Crée un étudiant
* `PUT /students/:id` : Modifie un étudiant
* `DELETE /students/:id` : Supprime un étudiant
* `GET /students/stats` : Statistiques globales
* `GET /students/search?q=...` : Recherche par prénom/nom

---

## ✅ Validation (Zod)

| Champ       | Type     | Règles                                                   |
| ----------- | -------- | -------------------------------------------------------- |
| `id`        | `number` | Entier positif                                           |
| `firstName` | `string` | 2–50 caractères                                          |
| `lastName`  | `string` | 2–50 caractères                                          |
| `email`     | `string` | Format email valide                                      |
| `grade`     | `number` | 0–20                                                     |
| `field`     | `string` | `informatique` | `mathématiques` | `physique` | `chimie` |

---

## 🧪 Tests

```sh
bun run test
bun run test:watch
bun run test:coverage
```

---

## 🔍 Lint

```sh
bun run lint
bun run lint:fix
```

---

## ⚙️ CI/CD

Le pipeline GitHub Actions s'exécute à chaque push sur `main`.

---
