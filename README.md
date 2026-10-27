```markdown
# ShopFlow — Plateforme E-Commerce B2B Fullstack

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**ShopFlow** est une solution logicielle complète d'approvisionnement B2B (Business-to-Business) développée selon les standards actuels du marché. L'application repose sur une séparation nette entre une API REST robuste et sécurisée en Java 21 / Spring Boot 3 et une interface utilisateur réactive conçue en React 19 et TypeScript.

Le système prend en charge la gestion du cycle de vie complet des achats professionnels : consultation et filtrage de catalogue avec stock en temps réel, authentification stateless par jeton JWT, gestion de panier multi-articles, tunnel de commande transactionnel avec mise à jour atomique des stocks, et intégration du composant de paiement sécurisé Stripe.

---

## 🏗️ Architecture Technique & Conception

Le projet adopte les principes du Clean Code, une séparation rigoureuse des responsabilités et une sécurité stateless :

- **Pattern Controller-Service-Repository :** Isolation totale de la logique métier, découplage via interfaces et inversion de contrôle.
- **Data Transfer Objects (DTO) & Mappers :** Aucune entité JPA n'est exposée directement au client HTTP. Toutes les requêtes entrantes et réponses sortantes transitent par des DTOs validés (`ProductResponseDTO`, `OrderCreateRequestDTO`, `AuthResponseDTO`, etc.).
- **Gestion des transactions :** Utilisation de `@Transactional` pour garantir l'atomicité des commandes (décrémentation des stocks et création de commande simultanées en base PostgreSQL).
- **Sécurité Stateless & RBAC :** Filtre de sécurité personnalisé (`JwtAuthenticationFilter`) interceptant chaque requête HTTP pour valider la signature cryptographique du token JWT avant d'alimenter le `SecurityContextHolder`. Gestion des rôles applicatifs (`ROLE_USER`, `ROLE_ADMIN`).
- **Gestion du CORS :** Configuration explicite du bean `CorsConfigurationSource` autorisant les requêtes preflight `OPTIONS` et les en-têtes d'authentification (`Authorization: Bearer <token>`).
- **Client HTTP Typé :** Centralisation d'une instance Axios avec intercepteur de requêtes pour injecter automatiquement le jeton JWT extrait du `localStorage`.

---

## 🛠️ Stack Technologique Complète

### Backend
- **Langage :** Java 21 (LTS)
- **Framework :** Spring Boot 3 (Spring Web, Spring Data JPA, Spring Security, Spring Validation)
- **Sécurité :** JSON Web Tokens (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`), BCrypt Password Hashing
- **Base de données :** PostgreSQL 16, Hibernate 6 ORM
- **Documentation API :** Springdoc OpenAPI UI (`springdoc-openapi-starter-webmvc-ui` v2.8.5)
- **Paiements :** Stripe Java SDK
- **Productivité :** Project Lombok
- **Build Tool :** Apache Maven (via Maven Wrapper)

### Frontend
- **Bibliothèque UI :** React 19
- **Langage :** TypeScript 5
- **Tooling & Build :** Vite 8
- **Styles & Design System :** Tailwind CSS 3
- **Routage :** React Router DOM
- **Client HTTP :** Axios
- **Intégration Stripe :** `@stripe/stripe-js`, `@stripe/react-stripe-js`
- **Iconographie :** Lucide React

### DevOps & Infrastructure
- **Conteneurisation :** Docker, Dockerfile multi-stage builds (Eclipse Temurin 21 JRE & Node.js 20 Alpine)
- **Orchestration :** Docker Compose (Services PostgreSQL, Spring Boot API, Nginx Client)
- **Serveur Web :** Nginx Alpine (pour servir le build de production du client)

---

## 📦 Structure du Dépôt (Monorepo)

```text
ShopFlow/
├── api/                                # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/shopflow/api/
│   │   │   │   ├── config/             # Sécurité JWT, CORS, OpenAPI
│   │   │   │   ├── controllers/        # Endpoints REST (Auth, Products, Orders)
│   │   │   │   ├── dto/                # Objets de transfert de données typés
│   │   │   │   ├── entities/           # Entités JPA (User, Product, Order, OrderItem)
│   │   │   │   ├── enums/              # Énumérations (Role, OrderStatus)
│   │   │   │   ├── repositories/       # Interfaces Spring Data JPA
│   │   │   │   └── services/           # Logique métier transactionnelle
│   │   │   └── resources/
│   │   │       └── application.yml     # Configuration base de données et JWT
│   ├── Dockerfile                      # Build Maven multi-stage
│   ├── mvnw / mvnw.cmd                 # Wrapper Maven
│   └── pom.xml                         # Dépendances Maven
│
├── client/                             # Frontend React + TypeScript
│   ├── src/
│   │   ├── assets/                     # Ressources graphiques statiques
│   │   ├── components/                 # Composants UI (Navbar, AuthModal, CartDrawer, CheckoutForm)
│   │   ├── services/                   # Client Axios & configuration Stripe
│   │   ├── types/                      # Définitions TypeScript
│   │   ├── App.tsx                     # Assemblage applicatif et état global du panier
│   │   └── main.tsx                    # Point d'entrée React
│   ├── Dockerfile                      # Build Vite et image Nginx Alpine
│   ├── package.json                    # Dépendances Node.js
│   └── vite.config.ts                  # Configuration du bundler Vite
│
├── docker-compose.yml                  # Orchestration multi-conteneurs
└── README.md                           # Documentation du projet

```

---

## ⚡ Fonctionnalités Développées

### 1. Authentification & Gestion des Sessions

* Formulaire modal avec bascule dynamique Connexion / Inscription.
* Hachage sécurisé des mots de passe avec BCrypt en base de données.
* Émission d'un token JWT d'une durée configurable retourné à la connexion et stocké dans le navigateur.
* Déconnexion instantanée avec purge du jeton et réinitialisation de l'état utilisateur.

### 2. Gestion du Catalogue B2B

* Affichage dynamique des fiches produits avec calcul du stock restant.
* Désactivation automatique de l'ajout au panier en cas de rupture de stock.
* Restreinte des endpoints de création et modification de produits (`POST`, `PUT`) aux utilisateurs disposant de l'autorité `ROLE_ADMIN`.

### 3. Panier & Cycle de Commande

* Panier interactif sous forme de tiroir latéral (*drawer*) accessible en permanence.
* Incrémentation, décrémentation et suppression unitaire d'articles avec mise à jour immédiate du sous-total.
* Validation des stocks côté serveur à la commande avec décrémentation immédiate en base de données pour empêcher tout dépassement de quota.
* Fenêtre de confirmation avec récapitulatif du numéro de référence de commande (`#ID`).
* Consultation de l'historique complet des commandes passées par l'utilisateur connecté via un modal dédié.

### 4. Tunnel de Paiement par Carte

* Intégration du composant sécurisé Stripe Elements (`CardElement`).
* Émission et confirmation d'intention de paiement chiffrée de bout en bout sans transit de données bancaires sensibles sur le serveur applicatif.

### 5. Documentation Interactive des Endpoints (Swagger)

* Génération automatique de la spécification OpenAPI 3 sur `/v3/api-docs`.
* Interface graphique interactive Swagger UI disponible sur `/swagger-ui/index.html` permettant de visualiser les modèles de données et d'exécuter des requêtes de test directement dans le navigateur.

---

## 🚀 Guide d'Installation et Lancement en Local

### Prérequis Système

* **Java Development Kit (JDK) :** Version 21 ou supérieure
* **Node.js :** Version 20 LTS ou supérieure (avec `npm`)
* **PostgreSQL :** Instance locale active sur le port `5432` avec une base nommée `shopflow_db` (identifiants par défaut : `postgres` / `password`)

---

### Étape 1 : Démarrer le Backend (Spring Boot)

1. Naviguer dans le dossier `api` :
```bash
cd api

```


2. Lancer l'application avec le wrapper Maven :
```powershell
# Sous Windows (PowerShell / CMD)
.\mvnw.cmd spring-boot:run

# Sous Linux / macOS
./mvnw spring-boot:run

```


3. L'API est opérationnelle sur : `http://localhost:8081`
4. Accéder à la documentation interactive : `http://localhost:8081/swagger-ui/index.html`

---

### Étape 2 : Démarrer le Frontend (React / Vite)

1. Ouvrir un second terminal et naviguer dans le dossier `client` :
```bash
cd client

```


2. Installer les dépendances :
```bash
npm install

```


3. Lancer le serveur de développement local :
```bash
npm run dev

```


4. L'interface web est accessible sur : `http://localhost:5173`

---

## 🐳 Déploiement Conteneurisé (Docker Compose)

Le projet contient l'ensemble des configurations nécessaires pour être instancié dans des conteneurs isolés sans nécessiter l'installation préalable de Java, Node ou PostgreSQL sur la machine hôte.

Pour compiler les images et orchestrer l'ensemble des services d'une seule instruction, exécutez la commande suivante à la racine du projet :

```bash
docker compose up --build

```

### Services instanciés :

* **`shopflow-db` :** PostgreSQL 16 Alpine accessible sur le port hôte `5432`. Données persistées via un volume Docker nommé `pgdata`.
* **`shopflow-api` :** Application Spring Boot compilée via une étape multi-stage Maven et exécutée dans une image légère Alpine JRE 21 sur le port `8081`.
* **`shopflow-client` :** Application React compilée sous Vite et servie par un serveur Web Nginx Alpine sur le port `80`.

---

## 🔐 Matrice des Endpoints REST

| Méthode | Endpoint | Description | Accès requis |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Inscription d'un nouveau compte client | Public |
| `POST` | `/api/v1/auth/login` | Authentification et retour du token JWT | Public |
| `GET` | `/api/v1/products` | Récupération de la liste complète des produits | Public |
| `GET` | `/api/v1/products/{id}` | Détail d'un produit spécifique | Public |
| `POST` | `/api/v1/products` | Ajout d'une nouvelle référence de produit | Administrateur (`ROLE_ADMIN`) |
| `PUT` | `/api/v1/products/{id}` | Modification d'un produit et mise à jour de stock | Administrateur (`ROLE_ADMIN`) |
| `POST` | `/api/v1/orders` | Création d'une commande et décrémentation des stocks | Authentifié (JWT) |
| `GET` | `/api/v1/orders/my-orders` | Historique des commandes de l'utilisateur connecté | Authentifié (JWT) |
| `GET` | `/swagger-ui/index.html` | Interface Swagger UI OpenAPI 3 | Public |

---

## 👤 Auteur

**Yassir Ourahou**

* GitHub : [@YASSIROURAHOU](https://www.google.com/search?q=https://github.com/YASSIROURAHOU)

```

```