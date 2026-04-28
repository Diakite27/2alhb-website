"""
Seed script — run with: backend/venv/bin/python backend/manage.py shell < backend/seed_data.py
"""
import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from core.models import (
    FAQ, Activity, BureauMember, AssociationInfo, SiteStats, Partner,
)

# --- FAQ ---
faq_data = [
    ("Qui peut adhérer à la 2ALHB ?", "Tout ancien élève du Lycée HOUPHOUËT-BOIGNY de Korhogo, quelle que soit sa promotion ou son lieu de résidence actuel, peut demander à adhérer à l'amicale."),
    ("L'adhésion est-elle payante ?", "Le droit d'adhésion est de 5 000 FCFA. Les membres adhérents paient en plus une cotisation mensuelle (5 000 FCFA) ou annuelle (60 000 FCFA)."),
    ("Comment se déroule la validation ?", "Après soumission du formulaire, le bureau exécutif examine votre demande. Vous recevez une confirmation par email sous 48h."),
    ("Quels sont les avantages d'être membre ?", "Accès à l'annuaire des anciens, invitations aux événements exclusifs, programmes de mentorat, partage d'opportunités professionnelles."),
    ("Je suis à l'étranger, puis-je participer ?", "Absolument ! La 2ALHB a des membres dans plusieurs pays. Vous pouvez participer aux événements en ligne et rejoindre les groupes de la diaspora."),
    ("Comment puis-je m'impliquer davantage ?", "Vous pouvez rejoindre une commission, proposer des événements ou devenir mentor pour les jeunes diplômés. Contactez le bureau pour en savoir plus."),
]

for i, (q, a) in enumerate(faq_data):
    FAQ.objects.get_or_create(question=q, defaults={"answer": a, "order": i})

print(f"FAQ: {FAQ.objects.count()} items")

# --- Activities ---
activities_data = [
    ("Q1", "Assemblée Générale Ordinaire", "Bilan de l'année écoulée, adoption du budget prévisionnel et renouvellement partiel du bureau.", "Janvier 2026", "done", 0),
    ("Q1", "Campagne d'adhésion", "Lancement de la campagne annuelle de recrutement de nouveaux membres. Objectif : 100 nouveaux adhérents.", "Février 2026", "done", 1),
    ("Q1", "Journée portes ouvertes au lycée", "Visite du Lycée HOUPHOUËT-BOIGNY de Korhogo avec les anciens. Échanges avec les élèves actuels.", "Mars 2026", "done", 2),
    ("Q2", "Programme de mentorat — Cohorte 2", "Lancement de la deuxième cohorte de mentorat. Jumelage de 30 jeunes diplômés avec des aînés.", "Avril 2026", "in-progress", 0),
    ("Q2", "Forum Emploi & Insertion", "Salon professionnel réservé aux membres. Stands d'entreprises partenaires, ateliers CV.", "Mai 2026", "upcoming", 1),
    ("Q2", "Dîner Gala Annuel", "Soirée de gala réunissant toutes les générations. Remise de prix d'excellence et levée de fonds.", "Juin 2026", "upcoming", 2),
    ("Q3", "Tournoi sportif inter-promotions", "Compétitions de football, basketball et athlétisme entre promotions.", "Juillet 2026", "upcoming", 0),
    ("Q3", "Action solidaire — Rentrée scolaire", "Distribution de kits scolaires, bourses d'études et rénovation d'une salle de classe.", "Septembre 2026", "upcoming", 1),
    ("Q3", "Retrouvailles promotions 2000-2010", "Week-end dédié aux promotions 2000 à 2010. Visite du lycée et soirée de retrouvailles.", "Septembre 2026", "upcoming", 2),
    ("Q4", "Conférence annuelle", "Conférence thématique ouverte au public. Intervenants : anciens élèves leaders.", "Octobre 2026", "upcoming", 0),
    ("Q4", "Expansion diaspora", "Création des antennes 2ALHB à Paris, Dakar et Casablanca.", "Novembre 2026", "upcoming", 1),
    ("Q4", "Bilan annuel & Fête de fin d'année", "Présentation du bilan, célébration des réussites et lancement du plan 2027.", "Décembre 2026", "upcoming", 2),
]

for quarter, title, desc, date_label, status, order in activities_data:
    Activity.objects.get_or_create(
        title=title, quarter=quarter, year=2026,
        defaults={"description": desc, "date_label": date_label, "status": status, "order": order}
    )

print(f"Activities: {Activity.objects.count()} items")

# --- Bureau Members ---
bureau_data = [
    ("À définir", "Président(e)", "direction", 0),
    ("À définir", "Vice-Président(e)", "direction", 1),
    ("À définir", "Secrétaire Général(e)", "direction", 2),
    ("À définir", "Secrétaire Général(e) Adjoint(e)", "direction", 3),
    ("À définir", "Trésorier(ère)", "direction", 4),
    ("À définir", "Trésorier(ère) Adjoint(e)", "direction", 5),
    ("À définir", "Responsable Organisation", "commission", 6),
    ("À définir", "Responsable Communication", "commission", 7),
    ("À définir", "Commission Insertion Professionnelle", "commission", 8),
    ("À définir", "Commission Solidarité & Entraide", "commission", 9),
    ("À définir", "Responsable Diaspora", "commission", 10),
    ("À définir", "Commission Consultative", "commission", 11),
]

for name, role, category, order in bureau_data:
    BureauMember.objects.get_or_create(
        role=role, defaults={"name": name, "category": category, "order": order}
    )

print(f"Bureau: {BureauMember.objects.count()} members")

# --- Stats ---
stats = SiteStats.load()
stats.members_count = 500
stats.countries_count = 8
stats.promotions_count = 40
stats.insertion_rate = 85
stats.save()
print("Stats updated")

# --- Association Info ---
info = AssociationInfo.load()
info.name = "2ALHB"
info.full_name = "Amicale des Anciens du Lycée HOUPHOUËT-BOIGNY de Korhogo"
info.slogan = "Connecter les anciens, inspirer les générations futures"
info.email = "contact@2alhb.ci"
info.phone = "+225 07 00 00 00 00"
info.address = "Lycée HOUPHOUËT-BOIGNY de Korhogo\nCôte d'Ivoire"
info.adhesion_fee = 5000
info.monthly_fee = 5000
info.annual_fee = 60000
info.save()
print("Association info updated")

print("\n✅ Seed complete!")
