from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Event, JobOffer, MemberDocument, Member, Notification


@receiver(post_save, sender=Event)
def notify_new_event(sender, instance, created, **kwargs):
    """Notifie tous les membres approuvés quand un événement est publié."""
    if created and instance.is_published:
        members = Member.objects.filter(is_approved=True, is_active=True)
        notifications = [
            Notification(
                recipient=member,
                title=f"Nouvel événement : {instance.title}",
                message=f"{instance.title} le {instance.date.strftime('%d/%m/%Y')} à {instance.location}.",
                notification_type="event",
                link="/evenements",
            )
            for member in members
        ]
        Notification.objects.bulk_create(notifications)


@receiver(post_save, sender=JobOffer)
def notify_new_job(sender, instance, created, **kwargs):
    """Notifie tous les membres approuvés quand une offre d'emploi est publiée."""
    if created and instance.is_active:
        members = Member.objects.filter(is_approved=True, is_active=True)
        notifications = [
            Notification(
                recipient=member,
                title=f"Nouvelle offre : {instance.title}",
                message=f"{instance.title} chez {instance.company} ({instance.location}).",
                notification_type="job",
                link="/emplois",
            )
            for member in members
        ]
        Notification.objects.bulk_create(notifications)


@receiver(post_save, sender=MemberDocument)
def notify_new_document(sender, instance, created, **kwargs):
    """Notifie les membres quand un document est ajouté."""
    if created:
        if instance.is_adherent_only:
            members = Member.objects.filter(is_approved=True, is_active=True, membership_type="adherent")
        else:
            members = Member.objects.filter(is_approved=True, is_active=True)

        notifications = [
            Notification(
                recipient=member,
                title=f"Nouveau document : {instance.title}",
                message=f"Un nouveau document ({instance.get_category_display()}) est disponible dans votre espace membre.",
                notification_type="document",
                link="/espace-membre",
            )
            for member in members
        ]
        Notification.objects.bulk_create(notifications)


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
        Notification.objects.create(
            recipient=instance,
            title="Bienvenue dans la 2ALHB !",
            message="Votre adhésion a été approuvée par le bureau. Vous avez maintenant accès à l'ensemble des services de l'amicale.",
            notification_type="general",
            link="/espace-membre",
        )
