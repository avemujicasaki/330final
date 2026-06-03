from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework import serializers

from .models import (
    Cook,
    CookApplication,
    MealOrder,
    MenuItem,
    OrderItem,
    Review,
    Subscription,
    User,
    WeeklyPlan,
)


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='display_name', read_only=True)

    class Meta:
        model = User
        fields = ('email', 'name')


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=4, write_only=True)
    name = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value.lower()

    def create(self, validated_data):
        email = validated_data['email']
        name = validated_data.get('name') or email.split('@')[0]
        user = User.objects.create_user(
            email=email,
            password=validated_data['password'],
            display_name=name,
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            request=self.context.get('request'),
            email=attrs['email'].lower(),
            password=attrs['password'],
        )
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        attrs['user'] = user
        return attrs


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('text', 'author')


class MenuItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='item_id')

    class Meta:
        model = MenuItem
        fields = ('id', 'day', 'name', 'desc', 'price', 'icon', 'image')


class CookListSerializer(serializers.ModelSerializer):
    shortName = serializers.CharField(source='short_name')
    pickupTime = serializers.CharField(source='pickup_time')
    pickupDays = serializers.CharField(source='pickup_days')

    class Meta:
        model = Cook
        fields = (
            'id', 'name', 'shortName', 'title', 'rating', 'location',
            'pickupTime', 'pickupDays', 'tags', 'image',
        )


class CookDetailSerializer(serializers.ModelSerializer):
    menu = MenuItemSerializer(many=True, read_only=True)
    reviews_list = ReviewSerializer(source='reviews', many=True, read_only=True)
    shortName = serializers.CharField(source='short_name')
    pickupTime = serializers.CharField(source='pickup_time')
    pickupDays = serializers.CharField(source='pickup_days')
    reviews = serializers.IntegerField(source='reviews_count')

    class Meta:
        model = Cook
        fields = (
            'id', 'name', 'shortName', 'title', 'rating', 'reviews',
            'location', 'pickupTime', 'pickupDays', 'schedule', 'image',
            'bio', 'tags', 'menu', 'reviews_list',
        )


class WeeklyPlanSerializer(serializers.ModelSerializer):
    cookId = serializers.CharField(source='cook_id')
    mealsPerWeek = serializers.IntegerField(source='meals_per_week')
    filterKeys = serializers.JSONField(source='filter_keys')

    class Meta:
        model = WeeklyPlan
        fields = (
            'id', 'cookId', 'name', 'mealsPerWeek', 'price', 'rating',
            'location', 'tags', 'filterKeys', 'image',
        )


class SubscriptionSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    planId = serializers.CharField(source='plan_id_slug')
    planName = serializers.CharField(source='plan_name')
    cookId = serializers.CharField(source='cook_id_slug')
    cookName = serializers.CharField(source='cook_name')
    mealsPerWeek = serializers.IntegerField(source='meals_per_week')
    pickupDays = serializers.CharField(source='pickup_days', required=False, allow_blank=True, default='')
    pickupTime = serializers.CharField(source='pickup_time', required=False, allow_blank=True, default='')
    paymentLast4 = serializers.CharField(source='payment_last4', required=False, allow_blank=True, default='')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    skippedAt = serializers.DateTimeField(source='skipped_at', read_only=True)
    cancelledAt = serializers.DateTimeField(source='cancelled_at', read_only=True)

    class Meta:
        model = Subscription
        fields = (
            'id', 'type', 'planId', 'planName', 'cookId', 'cookName', 'price',
            'mealsPerWeek', 'location', 'pickupDays', 'pickupTime',
            'paymentLast4', 'status', 'createdAt', 'skippedAt', 'cancelledAt',
        )
        read_only_fields = ('status', 'createdAt', 'skippedAt', 'cancelledAt')

    def get_id(self, obj):
        return obj.external_id

    def get_type(self, obj):
        return 'subscription'

    def create(self, validated_data):
        user = self.context['request'].user
        plan_id = validated_data['plan_id_slug']
        plan = WeeklyPlan.objects.filter(id=plan_id).select_related('cook').first()
        cook = plan.cook if plan else Cook.objects.filter(id=validated_data['cook_id_slug']).first()
        return Subscription.objects.create(
            user=user,
            plan=plan,
            plan_id_slug=plan_id,
            plan_name=validated_data['plan_name'],
            cook=cook,
            cook_id_slug=validated_data['cook_id_slug'],
            cook_name=validated_data['cook_name'],
            price=validated_data['price'],
            meals_per_week=validated_data['meals_per_week'],
            location=validated_data['location'],
            pickup_days=validated_data.get('pickup_days', ''),
            pickup_time=validated_data.get('pickup_time', ''),
            payment_last4=validated_data.get('payment_last4', ''),
        )


class OrderItemSerializer(serializers.ModelSerializer):
    cookId = serializers.CharField(source='cook_id_slug')
    cookName = serializers.CharField(source='cook_name')

    class Meta:
        model = OrderItem
        fields = ('key', 'name', 'day', 'cookName', 'cookId', 'price', 'qty', 'image')


class OrderItemWriteSerializer(serializers.Serializer):
    key = serializers.CharField()
    name = serializers.CharField()
    day = serializers.CharField()
    cookName = serializers.CharField()
    cookId = serializers.CharField()
    price = serializers.DecimalField(max_digits=6, decimal_places=2)
    qty = serializers.IntegerField(min_value=1)
    image = serializers.URLField(required=False, allow_blank=True, default='')


class MealOrderSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    items = OrderItemSerializer(many=True, read_only=True)
    paymentLast4 = serializers.CharField(source='payment_last4', required=False, allow_blank=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = MealOrder
        fields = ('id', 'type', 'items', 'total', 'paymentLast4', 'status', 'createdAt')

    def get_id(self, obj):
        return obj.external_id

    def get_type(self, obj):
        return 'meal'


class MealOrderCreateSerializer(serializers.Serializer):
    items = OrderItemWriteSerializer(many=True)
    paymentLast4 = serializers.CharField(max_length=4, required=False, allow_blank=True)

    def create(self, validated_data):
        user = self.context['request'].user
        items_data = validated_data['items']
        total = sum(i['price'] * i['qty'] for i in items_data)
        order = MealOrder.objects.create(
            user=user,
            total=total,
            payment_last4=validated_data.get('paymentLast4', ''),
        )
        for item in items_data:
            OrderItem.objects.create(
                order=order,
                key=item['key'],
                name=item['name'],
                day=item['day'],
                cook_name=item['cookName'],
                cook_id_slug=item['cookId'],
                price=item['price'],
                qty=item['qty'],
                image=item.get('image', ''),
            )
        return order


class CookApplicationSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField(read_only=True)
    submittedAt = serializers.DateTimeField(source='submitted_at', read_only=True)

    class Meta:
        model = CookApplication
        fields = (
            'id', 'name', 'email', 'specialty', 'location',
            'availability', 'bio', 'status', 'submittedAt',
        )
        read_only_fields = ('status', 'submittedAt')

    def get_id(self, obj):
        return obj.external_id

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        return CookApplication.objects.create(user=user, **validated_data)
