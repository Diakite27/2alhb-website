from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    Promotion, Member, Testimonial, Event, NewsArticle,
    Partner, GalleryImage, GalleryAlbum, SiteStats, ContactMessage,
    BureauMember, JobOffer, FAQ, Activity, AssociationInfo,
    NewsletterSubscriber, MemberDocument, Notification, CotisationPayment,
)

admin.site.site_header = "Administration de 2ALHB"
admin.site.site_title = "2ALHB Admin"
admin.site.index_title = "Gestion du site"


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ["year", "name", "members_count"]
    search_fields = ["year", "name"]
    ordering = ["-year"]

    def members_count(self, obj):
        return obj.members.filter(is_approved=True).count()
    members_count.short_description = "Membres"


@admin.register(Member)
class MemberAdmin(UserAdmin):
    list_display = ["username", "get_full_name", "promotion", "membership_type", "profession", "country", "is_approved"]
    list_filter = ["is_approved", "country", "promotion__year", "membership_type"]
    search_fields = ["first_name", "last_name", "email", "promotion__year"]
    actions = ["send_cotisation_reminder"]

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "password1", "password2"),
        }),
        ("Informations personnelles", {
            "fields": ("first_name", "last_name", "email", "phone"),
        }),
        ("Infos Alumni", {
            "fields": ("promotion", "membership_type", "cotisation_mode", "profession", "company", "city", "country"),
        }),
    )

    fieldsets = UserAdmin.fieldsets + (
        ("Infos Alumni", {
            "fields": (
                "phone", "promotion", "membership_type", "cotisation_mode",
                "profession", "company", "city", "country", "bio", "photo",
                "linkedin", "is_approved",
            ),
        }),
    )

    @admin.action(description="📩 Envoyer un rappel de cotisation aux membres sélectionnés")
    def send_cotisation_reminder(self, request, queryset):
        from .models import Notification, CotisationPayment
        import datetime

        now = datetime.date.today()
        count = 0

        for member in queryset.filter(is_approved=True, membership_type="adherent"):
            # Trouver le dernier paiement
            last_payment = CotisationPayment.objects.filter(member=member).order_by("-paid_at").first()

            if last_payment:
                last_date = last_payment.paid_at
                # Calculer les mois impayés depuis le dernier paiement
                months_due = (now.year - last_date.year) * 12 + (now.month - last_date.month)
                if months_due <= 0:
                    continue  # À jour, pas de rappel
                period = f"depuis {last_date.strftime('%B %Y').capitalize()} ({months_due} mois)"
            else:
                period = "aucun paiement enregistré"
                months_due = "?"

            Notification.objects.create(
                recipient=member,
                title=f"Rappel de cotisation",
                message=f"Votre cotisation est en retard ({period}). Merci de régulariser votre situation dans les meilleurs délais.",
                notification_type="cotisation",
                link="/espace-membre",
            )
            count += 1

        self.message_user(request, f"✅ Rappel envoyé à {count} membre(s) en retard de cotisation.")


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["member", "is_featured", "created_at"]
    list_filter = ["is_featured"]


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ["title", "date", "category", "location", "is_featured", "is_published"]
    list_filter = ["is_published", "is_featured", "category"]


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "is_published", "published_at"]
    list_filter = ["is_published"]
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ["name", "website", "order"]
    list_editable = ["order"]


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ["title", "album", "event", "created_at"]
    list_filter = ["album", "event"]


@admin.register(SiteStats)
class SiteStatsAdmin(admin.ModelAdmin):
    list_display = ["members_count", "countries_count", "promotions_count", "insertion_rate"]

    def has_add_permission(self, request):
        return not SiteStats.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "subject", "is_read", "created_at"]
    list_filter = ["is_read"]
    readonly_fields = ["name", "email", "subject", "message", "created_at"]


@admin.register(BureauMember)
class BureauMemberAdmin(admin.ModelAdmin):
    list_display = ["get_display_name", "role", "category", "order"]
    list_filter = ["category"]
    list_editable = ["order"]

    @admin.display(description="Nom")
    def get_display_name(self, obj):
        return obj.display_name


@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = ["title", "company", "job_type", "sector", "is_active", "created_at"]
    list_filter = ["is_active", "job_type", "sector"]
    search_fields = ["title", "company", "description"]


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ["question", "order", "is_published"]
    list_filter = ["is_published"]
    list_editable = ["order", "is_published"]


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ["title", "quarter", "year", "status", "order"]
    list_filter = ["quarter", "year", "status"]
    list_editable = ["status", "order"]


@admin.register(AssociationInfo)
class AssociationInfoAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "phone"]

    def has_add_permission(self, request):
        return not AssociationInfo.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ["email", "is_active", "subscribed_at"]
    list_filter = ["is_active"]
    search_fields = ["email"]


class GalleryImageInline(admin.TabularInline):
    model = GalleryImage
    extra = 1
    fields = ["title", "image", "caption"]


@admin.register(GalleryAlbum)
class GalleryAlbumAdmin(admin.ModelAdmin):
    list_display = ["title", "event", "photos_count", "is_published", "created_at"]
    list_filter = ["is_published"]
    inlines = [GalleryImageInline]

    def photos_count(self, obj):
        return obj.images.count()
    photos_count.short_description = "Photos"


@admin.register(MemberDocument)
class MemberDocumentAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "is_adherent_only", "published_at"]
    list_filter = ["category", "is_adherent_only"]
    search_fields = ["title"]
    date_hierarchy = "published_at"


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["title", "recipient", "notification_type", "is_read", "created_at"]
    list_filter = ["notification_type", "is_read"]
    search_fields = ["title", "recipient__first_name", "recipient__last_name"]


@admin.register(CotisationPayment)
class CotisationPaymentAdmin(admin.ModelAdmin):
    list_display = ["member", "amount", "period_label", "payment_method", "paid_at"]
    list_filter = ["payment_method"]
    search_fields = ["member__first_name", "member__last_name", "period_label"]
