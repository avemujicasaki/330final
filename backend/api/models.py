from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    display_name = models.CharField(max_length=120, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class Cook(models.Model):
    id = models.SlugField(primary_key=True, max_length=40)
    name = models.CharField(max_length=120)
    short_name = models.CharField(max_length=40)
    title = models.CharField(max_length=200)
    rating = models.FloatField()
    reviews_count = models.PositiveIntegerField(default=0)
    location = models.CharField(max_length=200)
    pickup_time = models.CharField(max_length=40)
    pickup_days = models.CharField(max_length=40)
    schedule = models.CharField(max_length=120)
    image = models.URLField(max_length=500)
    bio = models.TextField()
    tags = models.JSONField(default=list)

    def __str__(self):
        return self.name


class Review(models.Model):
    cook = models.ForeignKey(Cook, related_name='reviews', on_delete=models.CASCADE)
    text = models.TextField()
    author = models.CharField(max_length=120)

    class Meta:
        ordering = ['id']


class MenuItem(models.Model):
    item_id = models.SlugField(max_length=60)
    cook = models.ForeignKey(Cook, related_name='menu', on_delete=models.CASCADE)
    day = models.CharField(max_length=20)
    name = models.CharField(max_length=200)
    desc = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    icon = models.CharField(max_length=20, default='Utensils')
    image = models.URLField(max_length=500)

    class Meta:
        unique_together = [('cook', 'item_id')]
        ordering = ['item_id']

    def __str__(self):
        return self.name


class WeeklyPlan(models.Model):
    id = models.SlugField(primary_key=True, max_length=40)
    cook = models.ForeignKey(Cook, related_name='plans', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    meals_per_week = models.PositiveSmallIntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    rating = models.FloatField()
    location = models.CharField(max_length=200)
    tags = models.JSONField(default=list)
    filter_keys = models.JSONField(default=list)
    image = models.URLField(max_length=500)

    def __str__(self):
        return self.name


class Subscription(models.Model):
    STATUS_ACTIVE = 'active'
    STATUS_SKIPPED = 'skipped'
    STATUS_CANCELLED = 'cancelled'
    STATUS_CHOICES = [
        (STATUS_ACTIVE, 'active'),
        (STATUS_SKIPPED, 'skipped'),
        (STATUS_CANCELLED, 'cancelled'),
    ]

    user = models.ForeignKey(User, related_name='subscriptions', on_delete=models.CASCADE)
    plan = models.ForeignKey(WeeklyPlan, null=True, on_delete=models.SET_NULL)
    plan_id_slug = models.CharField(max_length=40)
    plan_name = models.CharField(max_length=200)
    cook = models.ForeignKey(Cook, null=True, on_delete=models.SET_NULL)
    cook_id_slug = models.CharField(max_length=40)
    cook_name = models.CharField(max_length=120)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    meals_per_week = models.PositiveSmallIntegerField()
    location = models.CharField(max_length=200)
    pickup_days = models.CharField(max_length=40, blank=True)
    pickup_time = models.CharField(max_length=40, blank=True)
    payment_last4 = models.CharField(max_length=4, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)
    skipped_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def external_id(self):
        return f'sub-{self.pk}'


class MealOrder(models.Model):
    STATUS_CONFIRMED = 'confirmed'
    STATUS_CHOICES = [(STATUS_CONFIRMED, 'confirmed')]

    user = models.ForeignKey(User, related_name='meal_orders', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_CONFIRMED)
    total = models.DecimalField(max_digits=8, decimal_places=2)
    payment_last4 = models.CharField(max_length=4, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def external_id(self):
        return f'order-{self.pk}'


class OrderItem(models.Model):
    order = models.ForeignKey(MealOrder, related_name='items', on_delete=models.CASCADE)
    key = models.CharField(max_length=80)
    name = models.CharField(max_length=200)
    day = models.CharField(max_length=20)
    cook_name = models.CharField(max_length=120)
    cook_id_slug = models.CharField(max_length=40)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    qty = models.PositiveSmallIntegerField()
    image = models.URLField(max_length=500, blank=True)


class CookApplication(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_CHOICES = [(STATUS_PENDING, 'pending')]

    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=120)
    email = models.EmailField()
    specialty = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    availability = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-submitted_at']

    @property
    def external_id(self):
        return f'app-{self.pk}'
