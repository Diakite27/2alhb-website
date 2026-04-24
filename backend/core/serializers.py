from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import (
    Member, Testimonial, Event, NewsArticle,
    Partner, GalleryImage, SiteStats, ContactMessage,
)


class MemberPublicSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = [
            "id", "full_name", "promotion", "profession",
            "company", "city", "country", "photo", "linkedin",
        ]

    def get_full_name(self, obj):
        return obj.get_full_name()


class MemberRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = Member
        fields = [
            "username", "email", "password", "password_confirm",
            "first_name", "last_name", "phone", "promotion",
            "profession", "company", "city", "country", "bio", "photo", "linkedin",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError({"password_confirm": "Les mots de passe ne correspondent pas."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        member = Member(**validated_data)
        member.set_password(password)
        member.save()
        return member


class TestimonialSerializer(serializers.ModelSerializer):
    member = MemberPublicSerializer(read_only=True)

    class Meta:
        model = Testimonial
        fields = ["id", "member", "content", "is_featured", "created_at"]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "title", "description", "date", "location", "image", "is_published"]


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


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ["id", "name", "logo", "website", "order"]


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ["id", "title", "image", "caption", "event", "created_at"]


class SiteStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteStats
        fields = ["members_count", "countries_count", "promotions_count", "insertion_rate"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


class MembersPerCountrySerializer(serializers.Serializer):
    country = serializers.CharField()
    count = serializers.IntegerField()
