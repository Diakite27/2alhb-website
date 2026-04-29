from django.urls import path
from . import views

app_name = "core"

urlpatterns = [
    # Association info
    path("info/", views.association_info, name="association-info"),

    # Auth / Profile
    path("auth/profile/", views.MemberProfileView.as_view(), name="member-profile"),
    path("auth/change-password/", views.ChangePasswordView.as_view(), name="change-password"),
    path("auth/logout/", views.logout_view, name="auth-logout"),
    path("auth/notifications/", views.NotificationListView.as_view(), name="notification-list"),
    path("auth/notifications/<int:pk>/read/", views.mark_notification_read, name="notification-read"),
    path("auth/notifications/read-all/", views.mark_all_notifications_read, name="notification-read-all"),
    path("auth/payments/", views.CotisationPaymentListView.as_view(), name="payment-list"),
    path("auth/documents/", views.MemberDocumentListView.as_view(), name="document-list"),
    path("auth/directory/", views.MemberDirectoryView.as_view(), name="member-directory"),

    # Promotions
    path("promotions/", views.PromotionListView.as_view(), name="promotion-list"),
    path("promotions/<int:year>/", views.PromotionDetailView.as_view(), name="promotion-detail"),
    path("promotions/stats/", views.members_per_promotion, name="promotion-stats"),

    # Members
    path("members/", views.MemberListView.as_view(), name="member-list"),
    path("members/register/", views.MemberRegistrationView.as_view(), name="member-register"),
    path("members/map/", views.members_per_country, name="members-map"),

    # Bureau
    path("bureau/", views.BureauMemberListView.as_view(), name="bureau-list"),

    # Testimonials
    path("testimonials/", views.TestimonialListView.as_view(), name="testimonial-list"),
    path("testimonials/create/", views.TestimonialCreateView.as_view(), name="testimonial-create"),

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
    path("gallery/albums/", views.GalleryAlbumListView.as_view(), name="album-list"),
    path("gallery/albums/<int:pk>/", views.GalleryAlbumDetailView.as_view(), name="album-detail"),

    # Job offers
    path("jobs/", views.JobOfferListView.as_view(), name="job-list"),
    path("jobs/create/", views.JobOfferCreateView.as_view(), name="job-create"),

    # FAQ
    path("faq/", views.FAQListView.as_view(), name="faq-list"),

    # Activities / Plan
    path("activities/", views.ActivityListView.as_view(), name="activity-list"),

    # Newsletter
    path("newsletter/subscribe/", views.NewsletterSubscribeView.as_view(), name="newsletter-subscribe"),
    path("newsletter/unsubscribe/", views.newsletter_unsubscribe, name="newsletter-unsubscribe"),

    # Stats
    path("stats/", views.site_stats, name="site-stats"),

    # Contact
    path("contact/", views.ContactCreateView.as_view(), name="contact-create"),
]
