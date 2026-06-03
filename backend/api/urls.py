from django.urls import path

from . import views

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view()),
    path('auth/login/', views.LoginView.as_view()),
    path('me/', views.MeView.as_view()),
    path('cooks/', views.CookListView.as_view()),
    path('cooks/<slug:id>/', views.CookDetailView.as_view()),
    path('plans/', views.PlanListView.as_view()),
    path('plans/<slug:id>/', views.PlanDetailView.as_view()),
    path('subscriptions/', views.SubscriptionListCreateView.as_view()),
    path('subscriptions/<str:sub_id>/action/', views.SubscriptionActionView.as_view()),
    path('orders/', views.MealOrderListCreateView.as_view()),
    path('cook-applications/', views.CookApplicationCreateView.as_view()),
]
