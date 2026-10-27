"""
Utilitaires d'envoi d'emails pour la 2ALHB.
"""

import logging

from django.conf import settings
from django.core.mail import get_connection, send_mail, send_mass_mail

logger = logging.getLogger(__name__)


def _get_info_connection():
    """
    Ouvre une connexion SMTP sur le compte "infos@" dédié aux communications
    (événements, articles, newsletters).

    Si le backend n'est pas SMTP (ex: console en local), on retourne None pour
    laisser Django utiliser la connexion par défaut.
    """
    if "smtp" not in settings.EMAIL_BACKEND:
        return None
    return get_connection(
        backend="django.core.mail.backends.smtp.EmailBackend",
        host=settings.INFO_EMAIL_HOST,
        port=settings.INFO_EMAIL_PORT,
        username=settings.INFO_EMAIL_HOST_USER,
        password=settings.INFO_EMAIL_HOST_PASSWORD,
        use_tls=settings.INFO_EMAIL_USE_TLS,
        use_ssl=settings.INFO_EMAIL_USE_SSL,
    )

SITE_URL = getattr(settings, "SITE_URL", "https://2alhb.com")

# Signature officielle de la 2ALHB, ajoutée à la fin de chaque email.
SIGNATURE = (
    "\n\n"
    "Fraternellement,\n"
    "Le Bureau de la 2ALHB\n"
    "Amicale des Anciens du Lycée HOUPHOUËT-BOIGNY de Korhogo\n"
    f"{SITE_URL}"
)

NEWSLETTER_FOOTER = (
    "\n\n---\n"
    "Vous recevez cet email car vous êtes inscrit aux communications de la 2ALHB.\n"
    "Pour vous désabonner : {unsubscribe_url}"
)


# === Emails membres ===


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
            f"  • Les notifications et événements"
            f"{SIGNATURE}"
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

    try:
        body = info.welcome_email_body.format(
            prenom=member.first_name,
            nom=member.last_name,
            promotion=member.promotion.year if member.promotion else "—",
            type_membre=member.get_membership_type_display(),
        )
    except (KeyError, IndexError):
        body = info.welcome_email_body

    send_mail(
        subject=email_subject(info.welcome_email_subject),
        message=body,
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
            f"des informations complémentaires, nous vous invitons à contacter le bureau."
            f"{SIGNATURE}"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[member.email],
        fail_silently=True,
    )


# === Communications : envoi aux abonnés newsletter ET aux membres ===


def _get_active_subscriber_emails():
    """Retourne la liste des emails des abonnés newsletter actifs."""
    from .models import NewsletterSubscriber

    return list(
        NewsletterSubscriber.objects.filter(is_active=True).values_list("email", flat=True)
    )


def _get_active_member_emails():
    """Retourne les emails des membres approuvés et actifs (email renseigné)."""
    from .models import Member

    return list(
        Member.objects.filter(is_approved=True, is_active=True)
        .exclude(email="")
        .values_list("email", flat=True)
    )


def _get_all_recipient_emails():
    """
    Réunit abonnés newsletter + membres approuvés, sans doublon.

    La casse de l'email est normalisée (minuscules) pour éviter les doublons
    du type 'Jean@x.com' / 'jean@x.com'.
    """
    emails = {}
    for email in _get_active_subscriber_emails() + _get_active_member_emails():
        if not email:
            continue
        key = email.strip().lower()
        if key and key not in emails:
            emails[key] = email.strip()
    return list(emails.values())


def _build_newsletter_footer(email=None):
    """Construit le pied de page avec le lien de désabonnement.

    Si un email est fourni, il est ajouté en paramètre pour préremplir le
    formulaire de désabonnement côté frontend.
    """
    from urllib.parse import quote

    url = f"{SITE_URL}/desabonnement"
    if email:
        url = f"{url}?email={quote(email)}"
    return NEWSLETTER_FOOTER.format(unsubscribe_url=url)


def _send_to_subscribers(subject, body, recipient_emails=None):
    """
    Envoi groupé d'une communication 2ALHB.

    Args:
        subject: Objet de l'email (le préfixe [2ALHB] est ajouté automatiquement).
        body: Corps du message (la signature et le footer sont ajoutés automatiquement).
        recipient_emails: Liste d'emails. Si None, envoie à tous les abonnés
            newsletter actifs ET aux membres approuvés (dédupliqués).

    Returns:
        Nombre d'emails envoyés.
    """
    if recipient_emails is None:
        recipient_emails = _get_all_recipient_emails()

    if not recipient_emails:
        return 0

    full_subject = f"[2ALHB] {subject}"

    # Les communications partent depuis infos@ (compte dédié).
    from_email = settings.INFO_FROM_EMAIL

    # Message personnalisé par destinataire : le lien de désabonnement
    # contient son email pour préremplir le formulaire.
    email_tuples = [
        (
            full_subject,
            f"{body}{SIGNATURE}{_build_newsletter_footer(email)}",
            from_email,
            [email],
        )
        for email in recipient_emails
    ]

    connection = _get_info_connection()
    send_mass_mail(email_tuples, fail_silently=True, connection=connection)
    logger.info("Communication '%s' envoyée à %d destinataire(s) depuis %s.", subject, len(email_tuples), from_email)

    return len(email_tuples)


def send_newsletter_event(event):
    """Envoie un email aux abonnés et aux membres quand un événement est publié."""
    date_str = event.date.strftime("%d/%m/%Y à %H:%M") if event.date else "Date à confirmer"

    body = (
        f"Bonjour,\n\n"
        f"Un nouvel événement a été publié par la 2ALHB :\n\n"
        f"📅 {event.title}\n"
        f"📍 {event.location}\n"
        f"🕐 {date_str}\n\n"
        f"{event.description[:300]}\n\n"
        f"Rendez-vous sur le site pour plus de détails : {SITE_URL}/evenements"
    )

    return _send_to_subscribers(subject=f"Nouvel événement : {event.title}", body=body)


def send_newsletter_news(article):
    """Envoie un email aux abonnés et aux membres quand un article est publié."""
    body = (
        f"Bonjour,\n\n"
        f"Un nouvel article a été publié par la 2ALHB :\n\n"
        f"📰 {article.title}\n\n"
        f"{article.excerpt}\n\n"
        f"Lire la suite sur le site : {SITE_URL}/actualites/{article.slug}"
    )

    return _send_to_subscribers(subject=article.title, body=body)


def send_newsletter_custom(subject, body, recipient_emails=None):
    """
    Envoie une newsletter personnalisée (action admin).

    Args:
        subject: Objet de la newsletter.
        body: Contenu du message.
        recipient_emails: Liste d'emails ciblés. Si None, envoie à tous les actifs.

    Returns:
        Nombre d'emails envoyés.
    """
    return _send_to_subscribers(subject=subject, body=body, recipient_emails=recipient_emails)
