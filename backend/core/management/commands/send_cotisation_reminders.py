"""
Commande automatique de relance de cotisation.

Usage:
    python manage.py send_cotisation_reminders

Planifier via cron (ex: tous les 1er du mois à 8h) :
    0 8 1 * * cd /path/to/backend && venv/bin/python manage.py send_cotisation_reminders
"""

import datetime
from django.core.management.base import BaseCommand
from core.models import Member, CotisationPayment, Notification


class Command(BaseCommand):
    help = "Envoie des rappels de cotisation aux membres adhérents en retard"

    def handle(self, *args, **options):
        today = datetime.date.today()
        count = 0

        adherents = Member.objects.filter(
            is_approved=True, is_active=True, membership_type="adherent"
        )

        for member in adherents:
            last_payment = CotisationPayment.objects.filter(
                member=member, category="cotisation"
            ).order_by("-paid_at").first()

            should_remind = False
            period_info = ""

            if member.cotisation_mode == "mensuelle":
                if last_payment:
                    months_since = (today.year - last_payment.paid_at.year) * 12 + (today.month - last_payment.paid_at.month)
                    if months_since >= 1:
                        should_remind = True
                        period_info = f"{months_since} mois impayé(s) depuis {last_payment.paid_at.strftime('%B %Y')}"
                else:
                    should_remind = True
                    period_info = "aucun paiement enregistré"

            elif member.cotisation_mode == "annuelle":
                if last_payment:
                    # Rappel si le dernier paiement date de plus d'un an
                    days_since = (today - last_payment.paid_at).days
                    if days_since >= 335:  # ~11 mois = rappel avant échéance
                        should_remind = True
                        period_info = f"cotisation annuelle à renouveler (dernier paiement : {last_payment.paid_at.strftime('%d/%m/%Y')})"
                else:
                    should_remind = True
                    period_info = "aucun paiement annuel enregistré"

            if should_remind:
                # Éviter les doublons : pas de rappel si un a été envoyé ce mois-ci
                already_sent = Notification.objects.filter(
                    recipient=member,
                    notification_type="cotisation",
                    created_at__year=today.year,
                    created_at__month=today.month,
                ).exists()

                if not already_sent:
                    Notification.objects.create(
                        recipient=member,
                        title="Rappel de cotisation",
                        message=f"Votre cotisation est en retard ({period_info}). Merci de régulariser votre situation.",
                        notification_type="cotisation",
                        link="/espace-membre",
                    )
                    count += 1

        self.stdout.write(self.style.SUCCESS(f"✅ {count} rappel(s) envoyé(s)"))
