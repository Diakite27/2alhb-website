from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Event, JobOffer, MemberDocument, Member, Notification

NOTIFICATION_BATCH_SIZE = 500


def _bulk_notify(members_qs, title, message, notification_type, link):
    """Create notifications in batches to avoid memory issues with large member counts."""
    member_ids = list(members_qs.values_list("pk", flat=True))
    notifications = [
        Notification(
            recipient_id=mid,
            title=title,
            message=message,
            notification_type=notification_type,
            link=link,
        )
        for mid in member_ids
    ]
    Notification.objects.bulk_create(notifications, batch_size=NOTIFICATION_BATCH_SIZE)


@receiver(post_save, sender=Event)
def notify_new_event(sender, instance, created, **kwargs):
    """Notifie tous les membres approuvés quand un événement est publié."""
    if created and instance.is_published:
        members = Member.objects.filter(is_approved=True, is_active=True)
        date_str = instance.date.strftime('%d/%m/%Y') if instance.date else "Date à confirmer"
        _bulk_notify(
            members,
            title=f"Nouvel événement : {instance.title}",
            message=f"{instance.title} le {date_str} à {instance.location}.",
            notification_type="event",
            link="/evenements",
        )


@receiver(post_save, sender=JobOffer)
def notify_new_job(sender, instance, created, **kwargs):
    """Notifie tous les membres approuvés quand une offre d'emploi est publiée."""
    if created and instance.is_active:
        members = Member.objects.filter(is_approved=True, is_active=True)
        _bulk_notify(
            members,
            title=f"Nouvelle offre : {instance.title}",
            message=f"{instance.title} chez {instance.company} ({instance.location}).",
            notification_type="job",
            link="/emplois",
        )


@receiver(post_save, sender=MemberDocument)
def notify_new_document(sender, instance, created, **kwargs):
    """Notifie les membres quand un document est ajouté."""
    if created:
        if instance.is_adherent_only:
            members = Member.objects.filter(is_approved=True, is_active=True, membership_type="adherent")
        else:
            members = Member.objects.filter(is_approved=True, is_active=True)

        _bulk_notify(
            members,
            title=f"Nouveau document : {instance.title}",
            message=f"Un nouveau document ({instance.get_category_display()}) est disponible dans votre espace membre.",
            notification_type="document",
            link="/espace-membre",
        )


@receiver(pre_save, sender=Member)
def notify_member_approved(sender, instance, **kwargs):
    """Notifie le membre quand son adhésion est approuvée."""
    if not instance.pk:
        return  # New member, skip

    try:
        old = Member.objects.get(pk=instance.pk)
    except Member.DoesNotExist:
        return

    # Was not approved, now is approved
    if not old.is_approved and instance.is_approved:
        # Generate a new temporary password to send to the member
        import secrets
        temp_password = f"2ALHB-{secrets.token_hex(4)}"
        instance.set_password(temp_password)

        Notification.objects.create(
            recipient=instance,
            title="Bienvenue dans la 2ALHB !",
            message="Votre adhésion a été approuvée par le bureau. Vous avez maintenant accès à l'ensemble des services de l'amicale.",
            notification_type="general",
            link="/espace-membre",
        )
        # Send welcome email with credentials
        from .emails import send_welcome_email
        send_welcome_email(instance, temp_password)
