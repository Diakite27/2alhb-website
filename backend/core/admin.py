from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    Member, Testimonial, Event, NewsArticle,
    Partner, GalleryImage, SiteStats, ContactMessage,
)


@admin.register(Member)
class MemberAdmin(UserAdmin):
    list_display = ["username", "get_full_name", "promotion", "profession", "country", "is_approved"]
    list_filter = ["is_approved", "country", "promotion"]
    search_fields = ["first_name", "last_name", "email", "promotion"]
    fieldsets = UserAdmin.fieldsets + (
        ("Infos Alumni", {
            "fields": ("phone", "promotion", "profession", "company", "city", "country", "bio", "photo", "linkedin", "is_approved"),
        }),
    )


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["member", "is_featured", "created_at"]
    list_filter = ["is_featured"]


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ["title", "date", "location", "is_published"]
    list_filter = ["is_published"]


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
