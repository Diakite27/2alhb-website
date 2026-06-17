"""
Commande automatique de relance de cotisation par notification + email.

Usage:
    python manage.py send_cotisation_reminders

Planifier via cron (les 5, 10 et 15 de chaque mois à 8h) :
    0 8 5,10,15 * * cd /path/to/backend && venv/bin/python manage.py send_cotisation_reminders
"""

import datetime
from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from core.emails import email_subject
from core.models import Member, CotisationPayment, Notification


class Command(BaseCommand):
    help = "Envoie des rappels de cotisation (notification + email) aux membres adhérents en retard"

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
                    days_since = (today - last_payment.paid_at).days
                    if days_since >= 335:
                        should_remind = True
                        period_info = f"cotisation annuelle à renouveler (dernier paiement : {last_payment.paid_at.strftime('%d/%m/%Y')})"
                else:
                    should_remind = True
                    period_info = "aucun paiement annuel enregistré"

            if should_remind:
                # Max 3 rappels par mois par membre
                reminders_this_month = Notification.objects.filter(
                    recipient=member,
                    notification_type="cotisation",
                    created_at__year=today.year,
                    created_at__month=today.month,
                ).count()

                if reminders_this_month < 3:
                    # Créer la notification
                    Notification.objects.create(
                        recipient=member,
                        title="Rappel de cotisation",
                        message=f"Votre cotisation est en retard ({period_info}). Merci de régulariser votre situation.",
                        notification_type="cotisation",
                        link="/espace-membre",
                    )

                    # Envoyer l'email
                    if member.email:
                        try:
                            send_mail(
                                subject=email_subject("Rappel de cotisation"),
                                message=(
                                    f"Bonjour {member.first_name},\n\n"
                                    f"Nous vous rappelons que votre cotisation est en retard ({period_info}).\n\n"
                                    f"Merci de procéder au paiement dans les meilleurs délais "
                                    f"par virement bancaire ou mobile money.\n\n"
                                    f"Pour toute question, contactez le bureau.\n\n"
                                    f"Fraternellement,\n"
                                    f"Le Bureau de la 2ALHB"
                                ),
                                from_email=settings.DEFAULT_FROM_EMAIL,
                                recipient_list=[member.email],
                                fail_silently=True,
                            )
                        except Exception as e:
                            self.stderr.write(f"  ⚠ Email échoué pour {member.email}: {e}")

                    count += 1

        self.stdout.write(self.style.SUCCESS(f"✅ {count} rappel(s) envoyé(s) (notification + email)"))
