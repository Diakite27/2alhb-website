from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q

from .models import (
    Promotion, Member, Testimonial, Event, NewsArticle,
    Partner, GalleryImage, SiteStats, ContactMessage,
    BureauMember, JobOffer, FAQ, Activity, AssociationInfo,
)
from .serializers import (
    PromotionSerializer, PromotionListSerializer,
    MemberPublicSerializer, MemberRegistrationSerializer,
    TestimonialSerializer, EventSerializer, NewsArticleSerializer,
    PartnerSerializer, GalleryImageSerializer, SiteStatsSerializer,
    ContactMessageSerializer, MembersPerCountrySerializer,
    BureauMemberSerializer, JobOfferSerializer, JobOfferCreateSerializer,
    FAQSerializer, ActivitySerializer, AssociationInfoSerializer,
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
    filterset_fields = ["country", "promotion__year"]
    search_fields = ["first_name", "last_name", "profession", "company"]

    def get_queryset(self):
        return Member.objects.filter(
            is_approved=True, is_active=True
        ).select_related("promotion")


class MemberRegistrationView(generics.CreateAPIView):
    serializer_class = MemberRegistrationSerializer
    permission_classes = [permissions.AllowAny]


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

class ContactCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]


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
    permission_classes = [permissions.AllowAny]


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
