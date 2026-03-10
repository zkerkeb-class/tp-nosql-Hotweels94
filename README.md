# API Pokédex NoSQL

Une API RESTful complète pour gérer une Pokédex avec MongoDB, Mongoose et Express.js. Les utilisateurs peuvent créer des comptes, consulter les Pokémon, gérer leurs favoris et créer des équipes.

## 📋 Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Authentification](#authentification)
- [Routes principales](#routes-principales)
- [Fonctionnalités bonus](#fonctionnalités-bonus)
- [Exemples d'utilisation](#exemples-dutilisation)

---

## Installation

### Prérequis

- Node.js (v14+)
- MongoDB (local ou cluster)
- npm

### Étapes

```bash
# Cloner le repository
git clone <repo-url>
cd tp-nosql-Hotweels94

# Installer les dépendances
npm install

# Créer un fichier .env
touch .env
```

### Configuration du fichier .env

```
JWT_SECRET=votre_secret_jwt_très_sécurisé
MONGODB_URI=mongodb://localhost:27017/pokemon-nosql
PORT=3000
```

### Lancer le serveur

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

---

## Authentification

Toutes les routes protégées nécessitent un token JWT dans l'en-tête `Authorization`.

### Format du token

```
Authorization: Bearer <token>
```

Le token est retourné lors de la connexion et valide pendant **24 heures**.

---

## Routes principales

### 🔐 Authentification (PUBLIC)

#### 1. Inscription
```http
POST /auth/register
Content-Type: application/json
```

**Body:**
```json
{
  "username": "pikachu123",
  "password": "MotDePasse123"
}
```

**Réponse (201):**
```json
{
  "message": "User registered successfully"
}
```

---

#### 2. Connexion
```http
POST /auth/login
Content-Type: application/json
```

**Body:**
```json
{
  "username": "pikachu123",
  "password": "MotDePasse123"
}
```

**Réponse (200):**
```json
{
  "message": "Connexion réussie",
  "user": {
    "username": "pikachu123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 🎮 Pokémon (PUBLIC)

#### 3. Lister tous les Pokémon
```http
GET /pokemons?page=1&limit=20&type=Electric&name=Pikachu&sort=-base.Attack
Authorization: Bearer <token>
```

**Paramètres de requête:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre de résultats par page (défaut: 20)
- `type` (optionnel): Filtrer par type (ex: Electric, Fire, Water)
- `name` (optionnel): Rechercher par nom (regex)
- `sort` (optionnel): Trier par champ (`-` = descendant, ex: `-base.Attack`)

**Réponse (200):**
```json
{
  "pokemons": [
    {
      "_id": "507f...",
      "id": 25,
      "name": {
        "english": "Pikachu",
        "french": "Pikachu",
        "chinese": "皮卡丘",
        "japanese": "ピカチュウ"
      },
      "type": ["Electric"],
      "base": {
        "HP": 35,
        "Attack": 55,
        "Defense": 40,
        "Sp. Attack": 50,
        "Sp. Defense": 50,
        "Speed": 90
      }
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

---

#### 4. Récupérer un Pokémon par ID
```http
GET /pokemon/:id
```

**Exemple:**
```http
GET /pokemon/25
```

**Réponse (200):**
```json
{
  "_id": "507f...",
  "id": 25,
  "name": {
    "english": "Pikachu",
    "french": "Pikachu",
    "chinese": "皮卡丘",
    "japanese": "ピカチュウ"
  },
  "type": ["Electric"],
  "base": {
    "HP": 35,
    "Attack": 55,
    "Defense": 40,
    "Sp. Attack": 50,
    "Sp. Defense": 50,
    "Speed": 90
  }
}
```

---

#### 5. Créer un Pokémon (Authentifié)
```http
POST /pokemon
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "id": 999,
  "name": {
    "english": "MyPokemon",
    "french": "MonPokémon",
    "chinese": "我的宝可梦",
    "japanese": "私のポケモン"
  },
  "type": ["Normal"],
  "base": {
    "HP": 50,
    "Attack": 60,
    "Defense": 55,
    "Sp. Attack": 65,
    "Sp. Defense": 55,
    "Speed": 70
  }
}
```

**Réponse (201):**
```json
{
  "_id": "507f...",
  "id": 999,
  "name": {...},
  "type": ["Normal"],
  "base": {...}
}
```

---

#### 6. Modifier un Pokémon (Authentifié)
```http
PUT /pokemon/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (partiel):**
```json
{
  "name": {
    "english": "UpdatedPokemon"
  }
}
```

**Réponse (200):** Pokémon mis à jour

---

#### 7. Supprimer un Pokémon (Authentifié)
```http
DELETE /pokemon/:id
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "message": "Pokémon deleted successfully"
}
```

---

## Fonctionnalités bonus

### ⭐ Favoris (Authentifié)

#### 8. Récupérer ses favoris
```http
GET /favorites
Authorization: Bearer <token>
```

**Réponse (200):**
```json
[
  {
    "_id": "507f...",
    "user": "user_id",
    "pokemon": {
      "_id": "507f...",
      "id": 25,
      "name": {"english": "Pikachu", ...},
      "type": ["Electric"],
      "base": {...}
    },
    "createdAt": "2024-03-10T10:15:30.000Z"
  }
]
```

---

#### 9. Ajouter un favori
```http
POST /favorites/:id
Authorization: Bearer <token>
```

**Exemple:**
```http
POST /favorites/25
```

**Réponse (201):**
```json
{
  "_id": "507f...",
  "user": "user_id",
  "pokemon": "pokemon_object_id",
  "createdAt": "2024-03-10T10:15:30.000Z"
}
```

---

#### 10. Supprimer un favori
```http
DELETE /favorites/:id
Authorization: Bearer <token>
```

**Exemple:**
```http
DELETE /favorites/favorite_id
```

**Réponse (200):**
```json
{
  "message": "Favori supprimé avec succès"
}
```

---

### 👥 Équipes (Authentifié) - BONUS

Gérez vos équipes de 6 Pokémon maximum.

#### 11. Créer une équipe
```http
POST /teams
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Mon Équipe de Feu",
  "pokemons": [4, 5, 6, 37, 38, 146]
}
```

**Réponse (201):**
```json
{
  "_id": "507f...",
  "user": "user_id",
  "name": "Mon Équipe de Feu",
  "pokemons": [
    {
      "_id": "507f...",
      "id": 4,
      "name": {"english": "Charmander", ...},
      "type": ["Fire"],
      "base": {...}
    }
  ],
  "createdAt": "2024-03-10T10:15:30.000Z",
  "updatedAt": "2024-03-10T10:15:30.000Z"
}
```

**Erreurs possibles:**
```json
{
  "erreurs": {
    "pokemons": "Une équipe ne peut contenir que 6 Pokémon maximum"
  }
}
```

---

#### 12. Récupérer ses équipes
```http
GET /teams
Authorization: Bearer <token>
```

**Réponse (200):**
```json
[
  {
    "_id": "507f...",
    "user": "user_id",
    "name": "Mon Équipe de Feu",
    "pokemons": [...],
    "createdAt": "2024-03-10T10:15:30.000Z",
    "updatedAt": "2024-03-10T10:15:30.000Z"
  }
]
```

---

#### 13. Récupérer une équipe par ID
```http
GET /teams/:id
Authorization: Bearer <token>
```

**Réponse (200):** Équipe complète avec Pokémon peuplés

---

#### 14. Modifier une équipe
```http
PUT /teams/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Équipe Électrique",
  "pokemons": [25, 26, 100, 101, 125, 145]
}
```

**Réponse (200):** Équipe modifiée

---

#### 15. Supprimer une équipe
```http
DELETE /teams/:id
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "message": "Équipe supprimée avec succès"
}
```

---

### 📊 Statistiques avancées avec agrégation (PUBLIC) - BONUS

#### 16. Récupérer les statistiques avancées
```http
GET /stats
```

**Réponse (200):**
```json
{
  "countByType": [
    {
      "_id": "Water",
      "count": 105
    },
    {
      "_id": "Normal",
      "count": 85
    }
  ],
  "avgHPByType": [
    {
      "_id": "Dragon",
      "avgHP": 82.5,
      "count": 3
    },
    {
      "_id": "Electric",
      "avgHP": 46.8,
      "count": 15
    }
  ],
  "maxAttackPokemon": {
    "id": 130,
    "name": "Gyarados",
    "attack": 100,
    "type": ["Water", "Flying"]
  },
  "maxHPPokemon": {
    "id": 108,
    "name": "Slowbro",
    "hp": 95,
    "type": ["Water", "Psychic"]
  },
  "globalStats": {
    "totalPokemons": 802,
    "avgAttack": 75.32,
    "avgHP": 69.25,
    "avgDefense": 71.43,
    "maxAttack": 154,
    "maxHP": 255,
    "maxDefense": 200,
    "minAttack": 20,
    "minHP": 20,
    "minDefense": 5
  }
}
```

### 👥 Validation de la création et modification des pokémons niveau avancé - BONUS

Pour créer ou modifier un pokémon, il va y avoir plusieurs validations. Il va vérifier que le type soit présent dans la liste des types, que les stats soient comprises entre 1 et 255, et que l'ID soit un entier positif.


---


## Structure du projet

```
.
├── index.js                 # Point d'entrée principal
├── controller/              # Logique métier
│   ├── auth.js
│   ├── pokemon.js
│   ├── favorite.js
│   └── team.js
├── model/                   # Schémas Mongoose
│   ├── User.js
│   ├── pokemon.js
│   ├── favorite.js
│   └── team.js
├── routes/                  # Définition des routes
│   ├── auth.js
│   ├── pokemons.js
│   ├── favorites.js
│   └── teams.js
├── middleware/              # Middlewares (auth, etc.)
│   └── auth.js
├── db/                      # Connexion à la base de données
│   └── connect.js
└── data/                    # Données initiales
    └── pokemons.json
```

---

## Niveaux d'authentification

| Route | Authentifiée | Description |
|-------|--------------|-------------|
| POST /auth/register | ❌ Non | Créer un compte |
| POST /auth/login | ❌ Non | Se connecter |
| GET /pokemons | ❌ Non | Lister les Pokémon |
| GET /pokemon/:id | ❌ Non | Détails d'un Pokémon |
| GET /stats | ❌ Non | Statistiques avancées |
| POST /pokemon | ✅ Oui | Créer un Pokémon |
| PUT /pokemon/:id | ✅ Oui | Modifier un Pokémon |
| DELETE /pokemon/:id | ✅ Oui | Supprimer un Pokémon |
| GET /favorites | ✅ Oui | Récupérer ses favoris |
| POST /favorites/:id | ✅ Oui | Ajouter un favori |
| DELETE /favorites/:id | ✅ Oui | Supprimer un favori |
| GET /teams | ✅ Oui | Récupérer ses équipes |
| POST /teams | ✅ Oui | Créer une équipe |
| GET /teams/:id | ✅ Oui | Détails d'une équipe |
| PUT /teams/:id | ✅ Oui | Modifier une équipe |
| DELETE /teams/:id | ✅ Oui | Supprimer une équipe |
