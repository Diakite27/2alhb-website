from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    Promotion, Member, Testimonial, Event, NewsArticle,
    Partner, GalleryImage, SiteStats, ContactMessage,
    BureauMember, JobOffer, FAQ, Activity, AssociationInfo,
)


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
    fieldsets = UserAdmin.fieldsets + (
        ("Infos Alumni", {
            "fields": (
                "phone", "promotion", "membership_type", "cotisation_mode",
                "profession", "company", "city", "country", "bio", "photo",
                "linkedin", "is_approved",
            ),
        }),
    )


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
    list_display = ["name", "order"]


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ["title", "event", "created_at"]


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
    list_display = ["display_name", "role", "category", "order"]
    list_filter = ["category"]
    list_editable = ["order"]


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
