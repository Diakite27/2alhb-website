from django.urls import path
from . import views

app_name = "core"

urlpatterns = [
    # Promotions
    path("promotions/", views.PromotionListView.as_view(), name="promotion-list"),
    path("promotions/<int:year>/", views.PromotionDetailView.as_view(), name="promotion-detail"),
    path("promotions/stats/", views.members_per_promotion, name="promotion-stats"),

    # Members
    path("members/", views.MemberListView.as_view(), name="member-list"),
    path("members/register/", views.MemberRegistrationView.as_view(), name="member-register"),
    path("members/map/", views.members_per_country, name="members-map"),

    # Testimonials
    path("testimonials/", views.TestimonialListView.as_view(), name="testimonial-list"),

    # Events
    path("events/", views.EventListView.as_view(), name="event-list"),
    path("events/<int:pk>/", views.EventDetailView.as_view(), name="event-detail"),

    # News
    path("news/", views.NewsListView.as_view(), name="news-list"),
    path("news/<slug:slug>/", views.NewsDetailView.as_view(), name="news-detail"),

    # Partners
    path("partners/", views.PartnerListView.as_view(), name="partner-list"),

    # Gallery
    path("gallery/", views.GalleryListView.as_view(), name="gallery-list"),

    # Stats
    path("stats/", views.site_stats, name="site-stats"),

    # Contact
    path("contact/", views.ContactCreateView.as_view(), name="contact-create"),
]
