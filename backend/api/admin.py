from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

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


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ('email',)
    list_display = ('email', 'display_name', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Profile', {'fields': ('display_name',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {'classes': ('wide',), 'fields': ('email', 'password1', 'password2', 'display_name')}),
    )
    search_fields = ('email', 'display_name')


admin.site.register(Cook)
admin.site.register(Review)
admin.site.register(MenuItem)
admin.site.register(WeeklyPlan)
admin.site.register(Subscription)
admin.site.register(MealOrder)
admin.site.register(OrderItem)
admin.site.register(CookApplication)
