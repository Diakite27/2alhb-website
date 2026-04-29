from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import (
    Promotion, Member, Testimonial, Event, NewsArticle,
    Partner, GalleryImage, GalleryAlbum, SiteStats, ContactMessage,
    BureauMember, JobOffer, FAQ, Activity, AssociationInfo,
    NewsletterSubscriber, MemberDocument, Notification, CotisationPayment,
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
        fields = ["id", "title", "image", "caption", "album", "event", "created_at"]


# --- Stats ---

class SiteStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteStats
        fields = ["members_count", "countries_count", "promotions_count", "insertion_rate"]


# --- Contact ---

class ContactMessageSerializer(serializers.ModelSerializer):
    honeypot = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "message", "honeypot", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_honeypot(self, value):
        if value:
            raise serializers.ValidationError("Spam detected.")
        return value


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
            "facebook_url", "linkedin_url", "whatsapp",
            "adhesion_fee", "monthly_fee", "annual_fee",
        ]


# --- Aggregations ---

class MembersPerCountrySerializer(serializers.Serializer):
    country = serializers.CharField()
    count = serializers.IntegerField()


# --- Member Profile (authenticated) ---

class MemberProfileSerializer(serializers.ModelSerializer):
    promotion_year = serializers.SerializerMethodField()
    promotion_name = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "phone", "promotion", "promotion_year", "promotion_name",
            "membership_type", "cotisation_mode",
            "profession", "company", "city", "country", "bio",
            "photo", "linkedin", "is_approved", "created_at",
        ]
        read_only_fields = ["id", "username", "is_approved", "created_at"]

    def get_promotion_year(self, obj):
        return obj.promotion.year if obj.promotion else None

    def get_promotion_name(self, obj):
        return obj.promotion.name if obj.promotion else ""


class MemberProfileUpdateSerializer(serializers.ModelSerializer):
    promotion_year = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Member
        fields = [
            "first_name", "last_name", "phone", "promotion_year",
            "profession", "company", "city", "country", "bio",
            "photo", "linkedin",
        ]

    def update(self, instance, validated_data):
        promotion_year = validated_data.pop("promotion_year", None)
        if promotion_year:
            from .models import Promotion
            promo, _ = Promotion.objects.get_or_create(year=promotion_year)
            instance.promotion = promo
        return super().update(instance, validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mot de passe actuel incorrect.")
        return value


# --- Newsletter ---

class NewsletterSubscribeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ["email"]

    def create(self, validated_data):
        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=validated_data["email"],
            defaults={"is_active": True},
        )
        if not created and not subscriber.is_active:
            subscriber.is_active = True
            subscriber.save()
        return subscriber


# --- Gallery Album ---

class GalleryAlbumSerializer(serializers.ModelSerializer):
    photos_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = GalleryAlbum
        fields = ["id", "title", "description", "cover_image", "event", "photos_count", "created_at"]


class GalleryAlbumDetailSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)
    photos_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = GalleryAlbum
        fields = ["id", "title", "description", "cover_image", "event", "photos_count", "images", "created_at"]


# --- Documents ---

class MemberDocumentSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = MemberDocument
        fields = ["id", "title", "category", "category_display", "file", "description", "is_adherent_only", "published_at"]


# --- Notifications ---

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "title", "message", "notification_type", "is_read", "link", "created_at"]


# --- Cotisation Payments ---

class CotisationPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CotisationPayment
        fields = ["id", "amount", "period_label", "payment_method", "reference", "paid_at"]


# --- Testimonial Create (member) ---

class TestimonialCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["content"]
