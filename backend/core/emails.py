"""
Utilitaires d'envoi d'emails pour la 2ALHB.
"""

from django.core.mail import send_mail
from django.conf import settings


def email_subject(subject):
    return f"{settings.EMAIL_SUBJECT_PREFIX}{subject}"


def send_welcome_email(member, password=None):
    """Envoie un email de bienvenue quand l'adhésion est approuvée."""
    if not member.email:
        return

    credentials_block = ""
    if password:
        credentials_block = (
            f"\nVos identifiants de connexion :\n"
            f"  • Nom d'utilisateur : {member.username}\n"
            f"  • Mot de passe : {password}\n\n"
            f"⚠️ Nous vous recommandons de changer votre mot de passe "
            f"dès votre première connexion.\n"
        )

    send_mail(
        subject=email_subject("Bienvenue dans l'amicale !"),
        message=(
            f"Bonjour {member.first_name},\n\n"
            f"Votre adhésion à la 2ALHB a été approuvée par le bureau. "
            f"Bienvenue dans la grande famille des anciens du Lycée Houphouët-Boigny de Korhogo !\n"
            f"{credentials_block}\n"
            f"Connectez-vous sur le site pour accéder à :\n"
            f"  • L'annuaire des membres\n"
            f"  • Les offres d'emploi\n"
            f"  • Les documents de l'association\n"
            f"  • Les notifications et événements\n\n"
            f"Fraternellement,\n"
            f"Le Bureau de la 2ALHB\n"
            f"Amicale des Anciens du Lycée Houphouët-Boigny de Korhogo"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[member.email],
        fail_silently=True,
    )

    # Envoyer aussi l'email d'accueil paramétrable
    send_custom_welcome_email(member)


def send_custom_welcome_email(member):
    """Envoie l'email d'accueil personnalisable (paramétré depuis l'admin)."""
    if not member.email:
        return

    from .models import AssociationInfo
    info = AssociationInfo.load()

    # Remplacer les variables dans le corps du message
    try:
        body = info.welcome_email_body.format(
            prenom=member.first_name,
            nom=member.last_name,
            promotion=member.promotion.year if member.promotion else "—",
            type_membre=member.get_membership_type_display(),
        )
    except (KeyError, IndexError):
        # Si le template contient des variables invalides, envoyer tel quel
        body = info.welcome_email_body

    send_mail(
        subject=email_subject(info.welcome_email_subject),
        message=body,
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
        subject=email_subject(f"Nouvel événement : {event.title}"),
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


def send_membership_revoked_email(member):
    """Informe un membre que son adhésion n'est plus approuvée."""
    if not member.email:
        return

    send_mail(
        subject=email_subject("Information sur votre adhésion"),
        message=(
            f"Bonjour {member.first_name},\n\n"
            f"Nous vous informons que votre adhésion à la 2ALHB n'est plus active. "
            f"Vous n'avez plus accès aux services réservés aux membres de l'amicale.\n\n"
            f"Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez obtenir "
            f"des informations complémentaires, nous vous invitons à contacter le bureau.\n\n"
            f"Fraternellement,\n"
            f"Le Bureau de la 2ALHB\n"
            f"Amicale des Anciens du Lycée Houphouët-Boigny de Korhogo"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[member.email],
        fail_silently=True,
    )
