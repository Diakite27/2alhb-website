from django.contrib.auth.models import AbstractUser
from django.db import models, transaction, connection


class Promotion(models.Model):
    """Promotion / Année de sortie du lycée."""

    year = models.PositiveIntegerField("Année", unique=True)
    name = models.CharField("Nom de baptême", max_length=200, blank=True, help_text="Ex: Les Invincibles")
    photo = models.ImageField("Photo de groupe", upload_to="promotions/", blank=True)
    description = models.TextField("Description", blank=True)

    class Meta:
        verbose_name = "Promotion"
        verbose_name_plural = "Promotions"
        ordering = ["-year"]

    def __str__(self):
        if self.name:
            return f"{self.year} — {self.name}"
        return str(self.year)

    @property
    def members_count(self):
        return self.members.filter(is_approved=True, is_active=True).count()


class Member(AbstractUser):
    """Membre / Ancien élève du Lycée Houphouët-Boigny."""

    MEMBERSHIP_CHOICES = [
        ("simple", "Membre Simple"),
        ("adherent", "Membre Adhérent"),
    ]
    COTISATION_CHOICES = [
        ("mensuelle", "Mensuelle — 5 000 FCFA/mois"),
        ("annuelle", "Annuelle — 60 000 FCFA/an"),
    ]

    member_number = models.CharField(
        "Numéro d'adhérent", max_length=20, unique=True, blank=True, null=True,
        help_text="Généré automatiquement : 2ALHB-PROMO-XXX"
    )
    phone = models.CharField("Téléphone", max_length=20, blank=True)
    promotion = models.ForeignKey(
        Promotion, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="members", verbose_name="Promotion"
    )
    membership_type = models.CharField(
        "Type de membre", max_length=10, choices=MEMBERSHIP_CHOICES, default="simple"
    )
    cotisation_mode = models.CharField(
        "Mode de cotisation", max_length=10, choices=COTISATION_CHOICES,
        blank=True, help_text="Requis pour les membres adhérents"
    )
    profession = models.CharField("Profession", max_length=200)
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
        promo = self.promotion.year if self.promotion else "?"
        return f"{self.get_full_name()} ({promo})"

    def save(self, *args, **kwargs):
        if not self.member_number:
            self.member_number = self._generate_member_number()
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_member_number_for_promo(promo_year):
        """Generate a unique member number with row-level locking to prevent race conditions."""
        prefix = f"2ALHB-{promo_year}-"
        qs = Member.objects.filter(member_number__startswith=prefix)
        # select_for_update is silently ignored on SQLite; use it only on
        # backends that support it so we still get locking on PostgreSQL.
        if connection.vendor != "sqlite":
            qs = qs.select_for_update()
        existing = qs.order_by("-member_number").first()
        if existing and existing.member_number:
            try:
                last_num = int(existing.member_number.split("-")[-1])
            except ValueError:
                last_num = 0
        else:
            last_num = 0
        return f"{prefix}{str(last_num + 1).zfill(3)}"

    def _generate_member_number(self):
        promo_year = self.promotion.year if self.promotion else "0000"
        with transaction.atomic():
            return Member._generate_member_number_for_promo(promo_year)


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

    CATEGORY_CHOICES = [
        ("gala", "Gala"),
        ("sport", "Sport"),
        ("forum", "Forum"),
        ("retrouvailles", "Retrouvailles"),
        ("solidarite", "Solidarité"),
        ("autre", "Autre"),
    ]

    title = models.CharField("Titre", max_length=200)
    description = models.TextField("Description")
    date = models.DateTimeField("Date")
    location = models.CharField("Lieu", max_length=200)
    category = models.CharField("Catégorie", max_length=20, choices=CATEGORY_CHOICES, default="autre")
    image = models.ImageField("Image", upload_to="events/", blank=True)
    is_featured = models.BooleanField("Mis en avant", default=False)
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
    album = models.ForeignKey(
        "GalleryAlbum", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="images", verbose_name="Album"
    )
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


class BureauMember(models.Model):
    """Membre du bureau exécutif."""

    CATEGORY_CHOICES = [
        ("direction", "Direction"),
        ("commission", "Commission"),
    ]

    member = models.ForeignKey(
        Member, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="bureau_roles", verbose_name="Membre"
    )
    name = models.CharField("Nom complet", max_length=200, help_text="Utilisé si pas lié à un membre")
    role = models.CharField("Fonction", max_length=200)
    category = models.CharField("Catégorie", max_length=20, choices=CATEGORY_CHOICES)
    photo = models.ImageField("Photo", upload_to="bureau/", blank=True)
    order = models.PositiveIntegerField("Ordre d'affichage", default=0)

    class Meta:
        verbose_name = "Membre du bureau"
        verbose_name_plural = "Membres du bureau"
        ordering = ["order"]

    def __str__(self):
        return f"{self.display_name} — {self.role}"

    @property
    def display_name(self):
        if self.member:
            return self.member.get_full_name()
        return self.name

    @property
    def initials(self):
        parts = self.display_name.split()
        if len(parts) >= 2:
            return f"{parts[0][0]}{parts[-1][0]}".upper()
        return self.display_name[:2].upper()


class JobOffer(models.Model):
    """Offre d'emploi partagée par un membre."""

    TYPE_CHOICES = [
        ("cdi", "CDI"),
        ("cdd", "CDD"),
        ("stage", "Stage"),
        ("freelance", "Freelance"),
    ]

    title = models.CharField("Intitulé du poste", max_length=200)
    company = models.CharField("Entreprise", max_length=200)
    location = models.CharField("Lieu", max_length=200)
    job_type = models.CharField("Type de contrat", max_length=10, choices=TYPE_CHOICES)
    sector = models.CharField("Secteur", max_length=100)
    description = models.TextField("Description")
    apply_url = models.URLField("Lien pour postuler", blank=True)
    posted_by = models.ForeignKey(
        Member, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="job_offers", verbose_name="Publié par"
    )
    poster_name = models.CharField("Nom du publieur", max_length=200, blank=True)
    poster_email = models.EmailField("Email de contact", blank=True)
    is_active = models.BooleanField("Active", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Offre d'emploi"
        verbose_name_plural = "Offres d'emploi"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} — {self.company}"


class FAQ(models.Model):
    """Question fréquente."""

    question = models.CharField("Question", max_length=300)
    answer = models.TextField("Réponse")
    order = models.PositiveIntegerField("Ordre", default=0)
    is_published = models.BooleanField("Publié", default=True)

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQ"
        ordering = ["order"]

    def __str__(self):
        return self.question


class Activity(models.Model):
    """Activité du plan annuel."""

    STATUS_CHOICES = [
        ("done", "Réalisé"),
        ("in-progress", "En cours"),
        ("upcoming", "À venir"),
    ]
    QUARTER_CHOICES = [
        ("Q1", "1er Trimestre"),
        ("Q2", "2e Trimestre"),
        ("Q3", "3e Trimestre"),
        ("Q4", "4e Trimestre"),
    ]

    title = models.CharField("Titre", max_length=200)
    description = models.TextField("Description")
    quarter = models.CharField("Trimestre", max_length=2, choices=QUARTER_CHOICES)
    year = models.PositiveIntegerField("Année", default=2026)
    date_label = models.CharField("Date affichée", max_length=50, help_text="Ex: Janvier 2026")
    status = models.CharField("Statut", max_length=15, choices=STATUS_CHOICES, default="upcoming")
    order = models.PositiveIntegerField("Ordre", default=0)

    class Meta:
        verbose_name = "Activité"
        verbose_name_plural = "Plan d'activités"
        ordering = ["year", "quarter", "order"]

    def __str__(self):
        return f"[{self.quarter} {self.year}] {self.title}"


class AssociationInfo(models.Model):
    """Informations générales de l'association (singleton)."""

    name = models.CharField("Nom", max_length=200, default="2ALHB")
    full_name = models.CharField("Nom complet", max_length=300, default="Amicale des Anciens du Lycée HOUPHOUËT-BOIGNY de Korhogo")
    slogan = models.CharField("Slogan", max_length=300, default="Connecter les anciens, inspirer les générations futures")
    email = models.EmailField("Email", default="contact@2alhb.ci")
    phone = models.CharField("Téléphone", max_length=20, default="+225 07 00 00 00 00")
    address = models.TextField("Adresse", default="Lycée HOUPHOUËT-BOIGNY de Korhogo\nCôte d'Ivoire")
    facebook_url = models.URLField("Facebook", blank=True)
    linkedin_url = models.URLField("LinkedIn", blank=True)
    whatsapp = models.CharField("WhatsApp", max_length=20, blank=True, help_text="Numéro avec indicatif, ex: +2250700000000")
    adhesion_fee = models.PositiveIntegerField("Droit d'adhésion (FCFA)", default=5000)
    monthly_fee = models.PositiveIntegerField("Cotisation mensuelle (FCFA)", default=5000)
    annual_fee = models.PositiveIntegerField("Cotisation annuelle (FCFA)", default=60000)
    welcome_email_subject = models.CharField(
        "Objet email d'accueil", max_length=200,
        default="Bienvenue dans la grande famille 2ALHB !",
        help_text="Objet de l'email d'accueil envoyé en plus du mail technique avec les identifiants."
    )
    welcome_email_body = models.TextField(
        "Corps email d'accueil", 
        default=(
            "Cher(e) {prenom},\n\n"
            "C'est avec un immense plaisir que nous vous accueillons au sein de la 2ALHB — "
            "l'Amicale des Anciens du Lycée HOUPHOUËT-BOIGNY de Korhogo.\n\n"
            "Vous faites désormais partie d'un réseau solidaire de plus de 500 anciens élèves "
            "répartis dans 8 pays, unis par les valeurs d'entraide, d'excellence et de fraternité.\n\n"
            "N'hésitez pas à consulter l'annuaire des membres, participer aux événements et "
            "contribuer à la vie de l'amicale.\n\n"
            "Fraternellement,\n"
            "Le Bureau de la 2ALHB"
        ),
        help_text="Variables disponibles : {prenom}, {nom}, {promotion}, {type_membre}. Ce message est envoyé en complément du mail technique contenant les identifiants."
    )

    class Meta:
        verbose_name = "Infos de l'association"
        verbose_name_plural = "Infos de l'association"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class NewsletterSubscriber(models.Model):
    """Abonné à la newsletter."""

    email = models.EmailField("Email", unique=True)
    is_active = models.BooleanField("Actif", default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Abonné newsletter"
        verbose_name_plural = "Abonnés newsletter"
        ordering = ["-subscribed_at"]

    def __str__(self):
        return self.email


class GalleryAlbum(models.Model):
    """Album photo pour regrouper les images."""

    title = models.CharField("Titre", max_length=200)
    description = models.TextField("Description", blank=True)
    cover_image = models.ImageField("Image de couverture", upload_to="gallery/covers/", blank=True)
    event = models.ForeignKey(
        Event, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="albums", verbose_name="Événement lié"
    )
    is_published = models.BooleanField("Publié", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Album"
        verbose_name_plural = "Albums"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    @property
    def photos_count(self):
        return self.images.count()


class MemberDocument(models.Model):
    """Document réservé aux membres adhérents (PV, rapports, newsletters)."""

    CATEGORY_CHOICES = [
        ("pv", "Procès-verbal d'AG"),
        ("rapport", "Rapport financier"),
        ("newsletter", "Newsletter"),
        ("autre", "Autre document"),
    ]

    title = models.CharField("Titre", max_length=200)
    category = models.CharField("Catégorie", max_length=20, choices=CATEGORY_CHOICES)
    file = models.FileField("Fichier", upload_to="documents/")
    description = models.TextField("Description", blank=True)
    is_adherent_only = models.BooleanField("Réservé aux adhérents", default=True)
    published_at = models.DateField("Date de publication")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Document"
        verbose_name_plural = "Documents"
        ordering = ["-published_at"]

    def __str__(self):
        return f"[{self.get_category_display()}] {self.title}"


class Notification(models.Model):
    """Notification pour un membre."""

    TYPE_CHOICES = [
        ("event", "Événement"),
        ("job", "Offre d'emploi"),
        ("cotisation", "Cotisation"),
        ("document", "Document"),
        ("general", "Général"),
    ]

    recipient = models.ForeignKey(
        Member, on_delete=models.CASCADE, related_name="notifications", verbose_name="Destinataire"
    )
    title = models.CharField("Titre", max_length=200)
    message = models.TextField("Message")
    notification_type = models.CharField("Type", max_length=15, choices=TYPE_CHOICES, default="general")
    is_read = models.BooleanField("Lu", default=False)
    link = models.CharField("Lien", max_length=300, blank=True, help_text="URL relative vers la page concernée")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} → {self.recipient.get_full_name()}"


class CotisationPayment(models.Model):
    """Historique des paiements de cotisation."""

    PAYMENT_CATEGORY_CHOICES = [
        ("adhesion", "Droit d'adhésion"),
        ("cotisation", "Cotisation"),
    ]

    member = models.ForeignKey(
        Member, on_delete=models.CASCADE, related_name="payments", verbose_name="Membre"
    )
    category = models.CharField(
        "Catégorie", max_length=15, choices=PAYMENT_CATEGORY_CHOICES, default="cotisation"
    )
    amount = models.PositiveIntegerField("Montant (FCFA)")
    period_label = models.CharField("Période", max_length=50, help_text="Ex: Avril 2026, Année 2026")
    payment_method = models.CharField("Mode de paiement", max_length=50, blank=True)
    reference = models.CharField("Référence", max_length=100, blank=True)
    paid_at = models.DateField("Date de paiement")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Paiement de cotisation"
        verbose_name_plural = "Paiements de cotisation"
        ordering = ["-paid_at"]

    def __str__(self):
        return f"{self.member.get_full_name()} — {self.amount} FCFA ({self.period_label})"
