# 2ALHB — Amicale des Anciens du Lycée HOUPHOUËT-BOIGNY de Korhogo

Site web officiel de la 2ALHB — association à but non lucratif regroupant les anciens élèves du Lycée HOUPHOUËT-BOIGNY de Korhogo, Côte d'Ivoire.

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
- `/association/bureau` — Bureau exécutif (photos dynamiques depuis l'admin)
- `/association/adhesion` — Formulaire d'adhésion avec choix de cotisation
- `/association/statuts` — Statuts officiels (58 articles, PDF téléchargeable)
- `/association/reglement` — Règlement intérieur
- `/association/plan-activites` — Plan d'activités annuel par trimestre
- `/evenements` — Tous les événements + détail `/evenements/[id]`
- `/emplois` — Offres d'emploi (accès réservé aux membres connectés) + détail `/emplois/[id]`
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
- 📊 Exporter les paiements en Excel
- Notifications automatiques (événements, offres, documents, approbation)
- ✉️ Email d'accueil personnalisable (depuis Infos de l'association)

## Emails

### Emails automatiques

| Déclencheur | Email envoyé |
|-------------|--------------|
| Approbation d'un membre | Email technique (identifiants) + Email d'accueil (personnalisable) |
| Rappel de cotisation (cron) | Email de rappel avec mois impayés |
| Nouvel événement | Notification email aux membres |

### Email d'accueil personnalisable

Depuis l'admin → **Infos de l'association** → section "Email d'accueil", l'admin peut modifier :
- L'objet du mail
- Le corps du message avec les variables : `{prenom}`, `{nom}`, `{promotion}`, `{type_membre}`

Cet email est envoyé **en complément** du mail technique contenant les identifiants de connexion.

### Configuration email

- **Développement** : backend console (emails affichés dans le terminal)
- **Production** : SMTP (voir variables d'environnement ci-dessous)

## API Endpoints principaux

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/info/` | GET | Non | Infos association |
| `/api/stats/` | GET | Non | Statistiques |
| `/api/members/register/` | POST | Non | Inscription (10/h) |
| `/api/token/` | POST | Non | Login JWT |
| `/api/auth/profile/` | GET/PATCH | Oui | Profil membre |
| `/api/auth/change-password/` | POST | Oui | Changer mot de passe |
| `/api/auth/logout/` | POST | Oui | Déconnexion (blacklist token) |
| `/api/auth/notifications/` | GET | Oui | Notifications |
| `/api/auth/documents/` | GET | Oui | Documents réservés |
| `/api/auth/directory/` | GET | Oui | Annuaire membres |
| `/api/events/` | GET | Non | Événements |
| `/api/events/:id/` | GET | Non | Détail événement |
| `/api/jobs/` | GET | Non | Offres d'emploi |
| `/api/jobs/:id/` | GET | Oui | Détail offre |
| `/api/jobs/create/` | POST | Oui | Publier une offre |
| `/api/testimonials/create/` | POST | Oui | Soumettre un témoignage |
| `/api/contact/` | POST | Non | Message de contact (5/h) |
| `/api/newsletter/subscribe/` | POST | Non | Newsletter (5/h) |

## Sécurité

- Rate limiting (endpoints sensibles limités)
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

---

## Déploiement (production)

### Architecture recommandée

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  Nginx/Caddy│────▶│  Next.js     │     │  Django    │
│  (reverse   │     │  (port 3000) │     │  (Gunicorn)│
│   proxy +   │────▶│              │────▶│  port 8000 │
│   SSL)      │     └──────────────┘     └─────┬──────┘
└─────────────┘                                │
                                         ┌─────▼──────┐
                                         │ PostgreSQL │
                                         │  (alhb_db) │
                                         └────────────┘
```

### Variables d'environnement backend (`.env`)

```env
# Django
SECRET_KEY=<clé-aléatoire-50-caractères-minimum>
DEBUG=False
ALLOWED_HOSTS=api.2alhb.ci,2alhb.ci

# Base de données
DATABASE_URL=postgres://user:password@localhost:5432/alhb_db

# CORS
CORS_ALLOWED_ORIGINS=https://2alhb.ci,https://www.2alhb.ci

# Email (SMTP)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=contact@2alhb.ci
EMAIL_HOST_PASSWORD=<mot-de-passe-application-gmail>
DEFAULT_FROM_EMAIL=2ALHB <contact@2alhb.ci>
```

> **Note Gmail** : Utiliser un "mot de passe d'application" (pas le mot de passe du compte). Aller dans Compte Google → Sécurité → Mots de passe des applications.

### Variables d'environnement frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=https://api.2alhb.ci/api
```

### Installation serveur (Ubuntu/Debian)

```bash
# 1. Cloner le projet
git clone https://github.com/Diakite27/2alhb-website.git
cd 2alhb-website

# 2. Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# 3. Configurer .env (copier les variables ci-dessus)
nano .env

# 4. Base de données
createdb -U postgres alhb_db
python manage.py migrate
python manage.py createsuperuser
# OU restaurer le dump :
psql -U postgres -d alhb_db < dump_prod.sql
python manage.py changepassword admin

# 5. Fichiers statiques
python manage.py collectstatic --noinput

# 6. Frontend
cd ../frontend
npm install
npm run build

# 7. Lancer les services
# Backend (avec gunicorn)
cd ../backend
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3

# Frontend (avec PM2 ou systemd)
cd ../frontend
npm start  # ou: pm2 start npm --name "2alhb-front" -- start
```

### Configuration Nginx (exemple)

```nginx
# Frontend
server {
    listen 443 ssl;
    server_name 2alhb.ci www.2alhb.ci;

    ssl_certificate /etc/letsencrypt/live/2alhb.ci/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/2alhb.ci/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend API
server {
    listen 443 ssl;
    server_name api.2alhb.ci;

    ssl_certificate /etc/letsencrypt/live/api.2alhb.ci/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.2alhb.ci/privkey.pem;

    client_max_body_size 5M;

    location /static/ {
        alias /path/to/backend/staticfiles/;
    }

    location /media/ {
        alias /path/to/backend/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Services systemd (optionnel)

```ini
# /etc/systemd/system/2alhb-backend.service
[Unit]
Description=2ALHB Django Backend
After=network.target postgresql.service

[Service]
User=www-data
WorkingDirectory=/path/to/2alhb-website/backend
ExecStart=/path/to/2alhb-website/backend/venv/bin/gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
Restart=always
EnvironmentFile=/path/to/2alhb-website/backend/.env

[Install]
WantedBy=multi-user.target
```

```ini
# /etc/systemd/system/2alhb-frontend.service
[Unit]
Description=2ALHB Next.js Frontend
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/2alhb-website/frontend
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

### Tâche planifiée (cron)

```bash
# Rappels de cotisation — les 5, 10 et 15 de chaque mois à 8h
0 8 5,10,15 * * cd /path/to/backend && venv/bin/python manage.py send_cotisation_reminders
```

### SSL avec Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d 2alhb.ci -d www.2alhb.ci -d api.2alhb.ci
```

### Checklist déploiement

- [ ] `SECRET_KEY` générée (50+ caractères aléatoires)
- [ ] `DEBUG=False`
- [ ] `ALLOWED_HOSTS` configuré avec les domaines
- [ ] `CORS_ALLOWED_ORIGINS` configuré
- [ ] `DATABASE_URL` PostgreSQL (pas SQLite)
- [ ] Email SMTP configuré et testé
- [ ] Cron cotisation activé (5, 10, 15 du mois)
- [ ] `collectstatic` exécuté
- [ ] HTTPS/SSL configuré (Let's Encrypt)
- [ ] Mot de passe admin changé (`python manage.py changepassword admin`)
- [ ] Stockage media configuré (volume persistant ou S3)
- [ ] Nginx configuré (frontend + API + static + media)
- [ ] Services systemd activés et démarrés
- [ ] Email d'accueil personnalisé depuis l'admin
- [ ] Backup base de données planifié
- [ ] Domaines DNS pointés vers le serveur

### Commandes utiles

```bash
# Générer une SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(64))"

# Collecter les fichiers statiques
python manage.py collectstatic --noinput

# Créer un superuser
python manage.py createsuperuser

# Dump de la base
pg_dump -U postgres alhb_db > dump_prod.sql

# Restaurer
psql -U postgres -d alhb_db < dump_prod.sql

# Logs backend
journalctl -u 2alhb-backend -f

# Logs frontend
journalctl -u 2alhb-frontend -f

# Redémarrer les services
sudo systemctl restart 2alhb-backend 2alhb-frontend
```

## Licence

Projet privé — © 2026 2ALHB. Tous droits réservés.
