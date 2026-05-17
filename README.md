# 2ALHB — Amicale des Anciens du Lycée HOUPHOUËT-BOIGNY de Korhogo

Site web officiel de la 2ALHB — association à but non lucratif regroupant les anciens élèves du Lycée Houphouët-Boigny de Korhogo, Côte d'Ivoire.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion |
| **Backend** | Django 6, Django REST Framework, PostgreSQL |
| **Auth** | JWT (SimpleJWT) avec token blacklist |
| **Admin** | Django Jazzmin |
| **Police** | Poppins (Google Fonts) |

## Structure du projet

```
2alhb/
├── frontend/          # Next.js app
│   ├── public/
│   │   ├── images/    # Logo, photos statiques
│   │   └── documents/ # PDF statuts
│   └── src/
│       ├── app/       # Pages (App Router)
│       ├── components/# Composants réutilisables
│       └── lib/       # API client, auth, hooks, constants
├── backend/           # Django + DRF
│   ├── config/        # Settings, URLs
│   ├── core/          # App principale (models, views, serializers, signals)
│   └── seed_data.py   # Script de peuplement initial
└── README.md
```

## Pages

- `/` — Accueil (hero, mission, témoignages, événements, partenaires, adhésion, contact)
- `/association/presentation` — Présentation, timeline, objectifs, valeurs
- `/association/bureau` — Bureau exécutif + commissions thématiques
- `/association/adhesion` — Formulaire d'adhésion avec choix de cotisation
- `/association/statuts` — Statuts officiels (58 articles, PDF téléchargeable)
- `/association/reglement` — Règlement intérieur
- `/association/plan-activites` — Plan d'activités annuel par trimestre
- `/evenements` — Tous les événements
- `/emplois` — Offres d'emploi (publication réservée aux membres connectés)
- `/galerie` — Albums photos avec lightbox
- `/connexion` — Login membre
- `/espace-membre` — Profil, annuaire, notifications, documents, cotisations, témoignage

## Lancer le projet

### Prérequis

- Node.js 20+
- Python 3.12+
- PostgreSQL 14+

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configurer la base de données
# Créer une base PostgreSQL "alhb_db"
# Copier .env et ajuster DATABASE_URL

python manage.py migrate
python manage.py shell < seed_data.py
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le site est accessible sur `http://localhost:3000`, l'API sur `http://localhost:8000/api/`.

## Admin

- URL : `http://localhost:8000/admin/`
- Identifiants par défaut : `admin` / `admin2alhb`
- Interface Jazzmin avec sidebar, icônes et actions personnalisées

### Actions admin disponibles

- 📩 Envoyer un rappel de cotisation (calcule les mois impayés)
- 📊 Exporter les membres en Excel
- Notifications automatiques (événements, offres, documents, approbation)

## API Endpoints principaux

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/info/` | GET | Non | Infos association |
| `/api/stats/` | GET | Non | Statistiques |
| `/api/members/register/` | POST | Non | Inscription (3/h) |
| `/api/token/` | POST | Non | Login JWT |
| `/api/auth/profile/` | GET/PATCH | Oui | Profil membre |
| `/api/auth/logout/` | POST | Oui | Déconnexion (blacklist token) |
| `/api/auth/notifications/` | GET | Oui | Notifications |
| `/api/auth/documents/` | GET | Oui | Documents réservés |
| `/api/auth/directory/` | GET | Oui | Annuaire membres |
| `/api/events/` | GET | Non | Événements |
| `/api/jobs/` | GET | Non | Offres d'emploi |
| `/api/jobs/create/` | POST | Oui | Publier une offre |
| `/api/testimonials/create/` | POST | Oui | Soumettre un témoignage |
| `/api/contact/` | POST | Non | Message de contact (5/h) |
| `/api/newsletter/subscribe/` | POST | Non | Newsletter (5/h) |

## Sécurité

- Rate limiting (30 req/min anon, 120 req/min auth, endpoints sensibles limités)
- JWT avec blacklist au logout + rotation des refresh tokens
- Protection mass assignment (inscription + profil)
- Validation upload (type + taille 2MB)
- Honeypot anti-spam sur formulaire contact
- HTTPS/HSTS/CSP activés en production
- Race condition protégée sur numéro adhérent (select_for_update)
- Numéro adhérent unique auto-généré : `2ALHB-{PROMO}-{XXX}`

## Couleurs

- Orange : `#f76c00`
- Vert : `#366042`
- Blanc : `#ffffff`

## Déploiement (production)

### Variables d'environnement backend (`.env`)

```env
# Django
SECRET_KEY=<clé-aléatoire-50-caractères-minimum>
DEBUG=False
ALLOWED_HOSTS=api.2alhb.ci,2alhb.ci

# Base de données
DATABASE_URL=postgres://user:password@host:5432/alhb_db

# CORS
CORS_ALLOWED_ORIGINS=https://2alhb.ci,https://www.2alhb.ci

# Email (SMTP)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=contact@2alhb.ci
EMAIL_HOST_PASSWORD=<mot-de-passe-application>
DEFAULT_FROM_EMAIL=2ALHB <contact@2alhb.ci>
```

### Variables d'environnement frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=https://api.2alhb.ci/api
```

### Restauration de la base de données

```bash
createdb -U user alhb_db
psql -U user -d alhb_db < backend/dump_prod.sql
python manage.py changepassword admin
```

### Tâche planifiée (cron)

```bash
# Rappels de cotisation — les 5, 10 et 15 de chaque mois à 8h
0 8 5,10,15 * * cd /path/to/backend && venv/bin/python manage.py send_cotisation_reminders
```

### Commandes utiles

```bash
# Collecter les fichiers statiques
python manage.py collectstatic --noinput

# Créer un superuser
python manage.py createsuperuser

# Seed initial (si pas de dump)
python manage.py shell < seed_data.py
```

### Checklist déploiement

- [ ] `SECRET_KEY` générée (50+ caractères)
- [ ] `DEBUG=False`
- [ ] `ALLOWED_HOSTS` configuré
- [ ] `CORS_ALLOWED_ORIGINS` configuré
- [ ] `DATABASE_URL` PostgreSQL
- [ ] Email SMTP configuré et testé
- [ ] Cron cotisation activé
- [ ] `collectstatic` exécuté
- [ ] HTTPS/SSL configuré (Nginx/Caddy)
- [ ] Mot de passe admin changé
- [ ] Stockage media configuré (S3 ou volume persistant)

## Licence

Projet privé — © 2026 2ALHB. Tous droits réservés.
