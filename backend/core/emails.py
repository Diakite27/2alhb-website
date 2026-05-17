"""
Utilitaires d'envoi d'emails pour la 2ALHB.
"""

from django.core.mail import send_mail
from django.conf import settings


def send_welcome_email(member):
    """Envoie un email de bienvenue quand l'adhésion est approuvée."""
    if not member.email:
        return

    send_mail(
        subject="[2ALHB] Bienvenue dans l'amicale !",
        message=(
            f"Bonjour {member.first_name},\n\n"
            f"Votre adhésion à la 2ALHB a été approuvée par le bureau.\n\n"
            f"Vous pouvez maintenant vous connecter à votre espace membre :\n"
            f"- Nom d'utilisateur : {member.username}\n"
            f"- Mot de passe : celui qui vous a été communiqué\n\n"
            f"Connectez-vous sur le site pour accéder à l'annuaire, "
            f"aux offres d'emploi, aux documents et bien plus.\n\n"
            f"Fraternellement,\n"
            f"Le Bureau de la 2ALHB"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[member.email],
        fail_silently=True,
    )


def send_new_event_email(member, event):
    """Notifie un membre par email d'un nouvel événement."""
    if not member.email:
        return

    date_str = event.date.strftime("%d/%m/%Y à %H:%M") if event.date else "Date à confirmer"

    send_mail(
        subject=f"[2ALHB] Nouvel événement : {event.title}",
        message=(
            f"Bonjour {member.first_name},\n\n"
            f"Un nouvel événement a été publié :\n\n"
            f"📅 {event.title}\n"
            f"📍 {event.location}\n"
            f"🕐 {date_str}\n\n"
            f"{event.description[:200]}...\n\n"
            f"Rendez-vous sur le site pour plus de détails.\n\n"
            f"Fraternellement,\n"
            f"Le Bureau de la 2ALHB"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[member.email],
        fail_silently=True,
    )
