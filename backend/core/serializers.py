from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import (
    Promotion, Member, Testimonial, Event, NewsArticle,
    Partner, GalleryImage, SiteStats, ContactMessage,
    BureauMember, JobOffer, FAQ, Activity, AssociationInfo,
)


# --- Promotion ---

class PromotionSerializer(serializers.ModelSerializer):
    members_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Promotion
        fields = ["id", "year", "name", "photo", "description", "members_count"]


class PromotionListSerializer(serializers.ModelSerializer):
    members_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Promotion
        fields = ["id", "year", "name", "members_count"]


# --- Member ---

class MemberPublicSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    promotion_year = serializers.SerializerMethodField()
    promotion_name = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = [
            "id", "full_name", "promotion", "promotion_year", "promotion_name",
            "profession", "company", "city", "country", "photo", "linkedin",
        ]

    def get_full_name(self, obj):
        return obj.get_full_name()

    def get_promotion_year(self, obj):
        return obj.promotion.year if obj.promotion else None

    def get_promotion_name(self, obj):
        return obj.promotion.name if obj.promotion else ""


class MemberRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    promotion_year = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Member
        fields = [
            "username", "email", "password", "password_confirm",
            "first_name", "last_name", "phone", "promotion_year",
            "membership_type", "cotisation_mode",
            "profession", "company", "city", "country", "bio", "photo", "linkedin",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError({"password_confirm": "Les mots de passe ne correspondent pas."})
        if attrs.get("membership_type") == "adherent" and not attrs.get("cotisation_mode"):
            raise serializers.ValidationError({"cotisation_mode": "Le mode de cotisation est requis pour les membres adhérents."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        promotion_year = validated_data.pop("promotion_year", None)
        member = Member(**validated_data)
        member.set_password(password)
        if promotion_year:
            promo, _ = Promotion.objects.get_or_create(year=promotion_year)
            member.promotion = promo
        member.save()
        return member


# --- Testimonial ---

class TestimonialSerializer(serializers.ModelSerializer):
    member = MemberPublicSerializer(read_only=True)

    class Meta:
        model = Testimonial
        fields = ["id", "member", "content", "is_featured", "created_at"]


# --- Event ---

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "id", "title", "description", "date", "location",
            "category", "image", "is_featured", "is_published",
        ]


# --- News ---

class NewsArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = NewsArticle
        fields = [
            "id", "title", "slug", "excerpt", "content",
            "image", "author_name", "published_at",
        ]

    def get_author_name(self, obj):
        return obj.author.get_full_name() if obj.author else "2ALHB"


# --- Partner ---

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ["id", "name", "logo", "website", "order"]


# --- Gallery ---

class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ["id", "title", "image", "caption", "event", "created_at"]


# --- Stats ---

class SiteStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteStats
        fields = ["members_count", "countries_count", "promotions_count", "insertion_rate"]


# --- Contact ---

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


# --- Bureau ---

class BureauMemberSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(read_only=True)
    initials = serializers.CharField(read_only=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = BureauMember
        fields = ["id", "display_name", "initials", "role", "category", "photo_url", "order"]

    def get_photo_url(self, obj):
        if obj.photo:
            return obj.photo.url
        if obj.member and obj.member.photo:
            return obj.member.photo.url
        return None


# --- Job Offers ---

class JobOfferSerializer(serializers.ModelSerializer):
    posted_by_name = serializers.SerializerMethodField()

    class Meta:
        model = JobOffer
        fields = [
            "id", "title", "company", "location", "job_type", "sector",
            "description", "apply_url", "posted_by_name", "poster_email",
            "is_active", "created_at",
        ]

    def get_posted_by_name(self, obj):
        if obj.posted_by:
            promo = obj.posted_by.promotion.year if obj.posted_by.promotion else ""
            return f"{obj.posted_by.get_full_name()} — Promotion {promo}"
        return obj.poster_name


class JobOfferCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = [
            "title", "company", "location", "job_type", "sector",
            "description", "apply_url", "poster_name", "poster_email",
        ]


# --- FAQ ---

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer", "order"]


# --- Activities ---

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ["id", "title", "description", "quarter", "year", "date_label", "status", "order"]


# --- Association Info ---

class AssociationInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssociationInfo
        fields = [
            "name", "full_name", "slogan", "email", "phone", "address",
            "facebook_url", "linkedin_url",
            "adhesion_fee", "monthly_fee", "annual_fee",
        ]


# --- Aggregations ---

class MembersPerCountrySerializer(serializers.Serializer):
    country = serializers.CharField()
    count = serializers.IntegerField()
