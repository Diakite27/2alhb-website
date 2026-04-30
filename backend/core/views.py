from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from django.db.models import Count, Q
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import (
    Promotion, Member, Testimonial, Event, NewsArticle,
    Partner, GalleryImage, GalleryAlbum, SiteStats, ContactMessage,
    BureauMember, JobOffer, FAQ, Activity, AssociationInfo,
    NewsletterSubscriber, MemberDocument, Notification, CotisationPayment,
)
from .serializers import (
    PromotionSerializer, PromotionListSerializer,
    MemberPublicSerializer, MemberRegistrationSerializer,
    MemberProfileSerializer, MemberProfileUpdateSerializer, ChangePasswordSerializer,
    TestimonialSerializer, EventSerializer, NewsArticleSerializer,
    PartnerSerializer, GalleryImageSerializer, GalleryAlbumSerializer, GalleryAlbumDetailSerializer,
    SiteStatsSerializer,
    ContactMessageSerializer, MembersPerCountrySerializer,
    BureauMemberSerializer, JobOfferSerializer, JobOfferCreateSerializer,
    FAQSerializer, ActivitySerializer, AssociationInfoSerializer,
    NewsletterSubscribeSerializer,
    MemberDocumentSerializer, NotificationSerializer, CotisationPaymentSerializer,
    TestimonialCreateSerializer,
)


# --- Promotions ---

class PromotionListView(generics.ListAPIView):
    serializer_class = PromotionListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Promotion.objects.annotate(
            members_count=Count(
                "members",
                filter=Q(members__is_approved=True, members__is_active=True),
            )
        ).order_by("-year")


class PromotionDetailView(generics.RetrieveAPIView):
    serializer_class = PromotionSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "year"

    def get_queryset(self):
        return Promotion.objects.annotate(
            members_count=Count(
                "members",
                filter=Q(members__is_approved=True, members__is_active=True),
            )
        )


# --- Members ---

class MemberListView(generics.ListAPIView):
    serializer_class = MemberPublicSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ["country", "promotion__year"]
    search_fields = ["first_name", "last_name", "profession", "company"]

    def get_queryset(self):
        return Member.objects.filter(
            is_approved=True, is_active=True
        ).select_related("promotion")


class RegistrationThrottle(AnonRateThrottle):
    """Stricter rate limit for registration to prevent abuse."""
    rate = "10/hour"


class MemberRegistrationView(generics.CreateAPIView):
    serializer_class = MemberRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [RegistrationThrottle]


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def members_per_promotion(request):
    data = (
        Member.objects.filter(is_approved=True, is_active=True, promotion__isnull=False)
        .values("promotion__year", "promotion__name")
        .annotate(count=Count("id"))
        .order_by("-promotion__year")
    )
    return Response([
        {"year": item["promotion__year"], "name": item["promotion__name"], "count": item["count"]}
        for item in data
    ])


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def members_per_country(request):
    data = (
        Member.objects.filter(is_approved=True, is_active=True)
        .values("country")
        .annotate(count=Count("id"))
        .order_by("-count")
    )
    serializer = MembersPerCountrySerializer(data, many=True)
    return Response(serializer.data)


# --- Testimonials ---

class TestimonialListView(generics.ListAPIView):
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Testimonial.objects.filter(is_featured=True).select_related(
            "member", "member__promotion"
        )


# --- Events ---

class EventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ["category", "is_featured"]

    def get_queryset(self):
        return Event.objects.filter(is_published=True)


class EventDetailView(generics.RetrieveAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Event.objects.filter(is_published=True)


# --- News ---

class NewsListView(generics.ListAPIView):
    serializer_class = NewsArticleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return NewsArticle.objects.filter(is_published=True)


class NewsDetailView(generics.RetrieveAPIView):
    serializer_class = NewsArticleSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return NewsArticle.objects.filter(is_published=True)


# --- Partners ---

class PartnerListView(generics.ListAPIView):
    serializer_class = PartnerSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Partner.objects.all()


# --- Gallery ---

class GalleryListView(generics.ListAPIView):
    serializer_class = GalleryImageSerializer
    permission_classes = [permissions.AllowAny]
    queryset = GalleryImage.objects.all()


# --- Stats ---

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def site_stats(request):
    stats = SiteStats.load()
    serializer = SiteStatsSerializer(stats)
    return Response(serializer.data)


# --- Contact ---

class ContactThrottle(AnonRateThrottle):
    """Stricter rate limit for contact form to prevent email bombing."""
    rate = "5/hour"


class ContactCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ContactThrottle]


# --- Bureau ---

class BureauMemberListView(generics.ListAPIView):
    serializer_class = BureauMemberSerializer
    permission_classes = [permissions.AllowAny]
    queryset = BureauMember.objects.select_related("member", "member__promotion").all()
    filterset_fields = ["category"]


# --- Job Offers ---

class JobOfferListView(generics.ListAPIView):
    serializer_class = JobOfferSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ["job_type", "sector"]
    search_fields = ["title", "company", "sector", "description"]

    def get_queryset(self):
        return JobOffer.objects.filter(is_active=True).select_related("posted_by", "posted_by__promotion")


class JobOfferCreateView(generics.CreateAPIView):
    serializer_class = JobOfferCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)


# --- FAQ ---

class FAQListView(generics.ListAPIView):
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return FAQ.objects.filter(is_published=True)


# --- Activities ---

class ActivityListView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ["quarter", "year", "status"]

    def get_queryset(self):
        return Activity.objects.all()


# --- Association Info ---

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def association_info(request):
    info = AssociationInfo.load()
    serializer = AssociationInfoSerializer(info)
    return Response(serializer.data)


# --- Auth / Profile ---

class MemberProfileView(generics.RetrieveUpdateAPIView):
    """Profil du membre connecté."""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return MemberProfileUpdateSerializer
        return MemberProfileSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.GenericAPIView):
    """Changer le mot de passe."""
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response({"detail": "Mot de passe modifié avec succès."})


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """Blacklist the refresh token on logout."""
    refresh_token = request.data.get("refresh")
    if not refresh_token:
        return Response({"detail": "Refresh token requis."}, status=400)
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Déconnexion réussie."})
    except TokenError:
        return Response({"detail": "Token invalide ou déjà révoqué."}, status=400)


# --- Newsletter ---

class NewsletterThrottle(AnonRateThrottle):
    """Stricter rate limit for newsletter subscription."""
    rate = "5/hour"


class NewsletterSubscribeView(generics.CreateAPIView):
    serializer_class = NewsletterSubscribeSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [NewsletterThrottle]


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def newsletter_unsubscribe(request):
    email = request.data.get("email")
    if not email:
        return Response({"detail": "Email requis."}, status=400)
    try:
        sub = NewsletterSubscriber.objects.get(email=email)
        sub.is_active = False
        sub.save()
        return Response({"detail": "Désabonnement effectué."})
    except NewsletterSubscriber.DoesNotExist:
        return Response({"detail": "Email non trouvé."}, status=404)


# --- Gallery Albums ---

class GalleryAlbumListView(generics.ListAPIView):
    serializer_class = GalleryAlbumSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return GalleryAlbum.objects.filter(is_published=True).annotate(
            photos_count=Count("images")
        )


class GalleryAlbumDetailView(generics.RetrieveAPIView):
    serializer_class = GalleryAlbumDetailSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return GalleryAlbum.objects.filter(is_published=True).annotate(
            photos_count=Count("images")
        ).prefetch_related("images")


# --- Documents (members only) ---

class MemberDocumentListView(generics.ListAPIView):
    serializer_class = MemberDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["category"]

    def get_queryset(self):
        user = self.request.user
        qs = MemberDocument.objects.all()
        # Non-approved members see no documents
        if not user.is_approved:
            return qs.none()
        # Adherent-only docs restricted
        if user.membership_type != "adherent":
            qs = qs.filter(is_adherent_only=False)
        return qs


# --- Notifications ---

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read(request, pk):
    try:
        notif = Notification.objects.get(pk=pk, recipient=request.user)
        notif.is_read = True
        notif.save()
        return Response({"detail": "Notification marquée comme lue."})
    except Notification.DoesNotExist:
        return Response({"detail": "Notification non trouvée."}, status=404)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def mark_all_notifications_read(request):
    Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
    return Response({"detail": "Toutes les notifications marquées comme lues."})


# --- Cotisation Payments ---

class CotisationPaymentListView(generics.ListAPIView):
    serializer_class = CotisationPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CotisationPayment.objects.filter(member=self.request.user)


# --- Annuaire (members only) ---

class MemberDirectoryView(generics.ListAPIView):
    """Annuaire complet réservé aux membres connectés."""
    serializer_class = MemberPublicSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["country", "promotion__year", "city"]
    search_fields = ["first_name", "last_name", "profession", "company", "city"]

    def get_queryset(self):
        return Member.objects.filter(
            is_approved=True, is_active=True
        ).select_related("promotion").exclude(pk=self.request.user.pk)


# --- Testimonial Submit (member) ---

class TestimonialCreateView(generics.CreateAPIView):
    """Soumettre un témoignage (membre connecté)."""
    serializer_class = TestimonialCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(member=self.request.user, is_featured=False)


class JobOfferDetailView(generics.RetrieveAPIView):
    serializer_class = JobOfferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobOffer.objects.filter(is_active=True).select_related("posted_by", "posted_by__promotion")
