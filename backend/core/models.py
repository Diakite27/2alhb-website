from django.contrib.auth.models import AbstractUser
from django.db import models


class Member(AbstractUser):
    """Membre / Ancien élève du Lycée Houphouët-Boigny."""

    phone = models.CharField("Téléphone", max_length=20, blank=True)
    promotion = models.CharField("Promotion / Année de sortie", max_length=10, blank=True)
    profession = models.CharField("Profession", max_length=200, blank=True)
    company = models.CharField("Entreprise / Organisation", max_length=200, blank=True)
    city = models.CharField("Ville", max_length=100, blank=True)
    country = models.CharField("Pays", max_length=100, default="Côte d'Ivoire")
    bio = models.TextField("Biographie", blank=True)
    photo = models.ImageField("Photo", upload_to="members/photos/", blank=True)
    linkedin = models.URLField("LinkedIn", blank=True)
    is_approved = models.BooleanField("Approuvé", default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Membre"
        verbose_name_plural = "Membres"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.get_full_name()} ({self.promotion})"


class Testimonial(models.Model):
    """Témoignage d'un ancien élève."""

    member = models.ForeignKey(
        Member, on_delete=models.CASCADE, related_name="testimonials", verbose_name="Membre"
    )
    content = models.TextField("Témoignage")
    is_featured = models.BooleanField("Mis en avant", default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Témoignage"
        verbose_name_plural = "Témoignages"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Témoignage de {self.member.get_full_name()}"


class Event(models.Model):
    """Événement organisé par l'amicale."""

    title = models.CharField("Titre", max_length=200)
    description = models.TextField("Description")
    date = models.DateTimeField("Date")
    location = models.CharField("Lieu", max_length=200)
    image = models.ImageField("Image", upload_to="events/", blank=True)
    is_published = models.BooleanField("Publié", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Événement"
        verbose_name_plural = "Événements"
        ordering = ["-date"]

    def __str__(self):
        return self.title


class NewsArticle(models.Model):
    """Article d'actualité."""

    title = models.CharField("Titre", max_length=200)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField("Extrait", max_length=300)
    content = models.TextField("Contenu")
    image = models.ImageField("Image", upload_to="news/", blank=True)
    author = models.ForeignKey(
        Member, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Auteur"
    )
    is_published = models.BooleanField("Publié", default=True)
    published_at = models.DateTimeField("Date de publication", auto_now_add=True)

    class Meta:
        verbose_name = "Article"
        verbose_name_plural = "Articles"
        ordering = ["-published_at"]

    def __str__(self):
        return self.title


class Partner(models.Model):
    """Partenaire de l'association."""

    name = models.CharField("Nom", max_length=200)
    logo = models.ImageField("Logo", upload_to="partners/")
    website = models.URLField("Site web", blank=True)
    order = models.PositiveIntegerField("Ordre d'affichage", default=0)

    class Meta:
        verbose_name = "Partenaire"
        verbose_name_plural = "Partenaires"
        ordering = ["order"]

    def __str__(self):
        return self.name


class GalleryImage(models.Model):
    """Image de la galerie photo."""

    title = models.CharField("Titre", max_length=200, blank=True)
    image = models.ImageField("Image", upload_to="gallery/")
    caption = models.TextField("Légende", blank=True)
    event = models.ForeignKey(
        Event, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="gallery_images", verbose_name="Événement"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Photo"
        verbose_name_plural = "Galerie"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title or f"Photo #{self.pk}"


class SiteStats(models.Model):
    """Statistiques affichées sur le site (singleton)."""

    members_count = models.PositiveIntegerField("Nombre de membres", default=0)
    countries_count = models.PositiveIntegerField("Pays de présence", default=0)
    promotions_count = models.PositiveIntegerField("Nombre de promotions", default=0)
    insertion_rate = models.PositiveIntegerField("Taux d'insertion (%)", default=0)

    class Meta:
        verbose_name = "Statistiques du site"
        verbose_name_plural = "Statistiques du site"

    def __str__(self):
        return "Statistiques du site"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class ContactMessage(models.Model):
    """Message de contact."""

    name = models.CharField("Nom", max_length=200)
    email = models.EmailField("Email")
    subject = models.CharField("Sujet", max_length=200)
    message = models.TextField("Message")
    is_read = models.BooleanField("Lu", default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Message"
        verbose_name_plural = "Messages"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.subject}"
