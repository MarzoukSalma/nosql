# Réseau Social Étudiant

Application web dédiée aux étudiants, construite avec **Express** (backend), **React** (frontend) et **Neo4j** comme base de données graphe.

## Fonctionnalités

- Authentification et gestion de profil étudiant
- Réseau de connexions entre étudiants
- Fil d'actualité et publications
- Messagerie instantanée (temps réel)
- Groupes et communautés
- Partage de ressources académiques
- Événements et offres de stages

## Stack

- **Backend** : Node.js + Express + Neogma (ORM Neo4j)
- **Frontend** : React + Vite
- **Base de données** : Neo4j (Graph Database)
- **Temps réel** : Socket.io
- **Auth** : JWT

## Installation

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

Copie `.env.example` en `.env` et remplis les variables Neo4j et JWT.

## Lancer le projet

```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 5173)
cd frontend && npm run dev
```

---
*Projet NoSQL — Mai 2026*
