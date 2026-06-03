from django.utils import timezone
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cook, CookApplication, MealOrder, Subscription, WeeklyPlan
from .serializers import (
    CookApplicationSerializer,
    CookDetailSerializer,
    CookListSerializer,
    LoginSerializer,
    MealOrderCreateSerializer,
    MealOrderSerializer,
    RegisterSerializer,
    SubscriptionSerializer,
    UserSerializer,
    WeeklyPlanSerializer,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {'token': token.key, 'user': UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserSerializer(user).data})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class CookListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Cook.objects.all()
    serializer_class = CookListSerializer


class CookDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Cook.objects.prefetch_related('menu', 'reviews')
    serializer_class = CookDetailSerializer
    lookup_field = 'id'


class PlanListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = WeeklyPlan.objects.select_related('cook')
    serializer_class = WeeklyPlanSerializer


class PlanDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = WeeklyPlan.objects.select_related('cook')
    serializer_class = WeeklyPlanSerializer
    lookup_field = 'id'


class SubscriptionListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save()


def _subscription_pk(sub_id):
    if isinstance(sub_id, str) and sub_id.startswith('sub-'):
        return int(sub_id[4:])
    return int(sub_id)


class SubscriptionActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, sub_id):
        try:
            sub = Subscription.objects.get(pk=_subscription_pk(sub_id), user=request.user)
        except (Subscription.DoesNotExist, ValueError):
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')
        now = timezone.now()
        if action == 'skip':
            sub.status = Subscription.STATUS_SKIPPED
            sub.skipped_at = now
            sub.save(update_fields=['status', 'skipped_at'])
        elif action == 'cancel':
            sub.status = Subscription.STATUS_CANCELLED
            sub.cancelled_at = now
            sub.save(update_fields=['status', 'cancelled_at'])
        else:
            return Response({'detail': 'action must be "skip" or "cancel".'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(SubscriptionSerializer(sub).data)


class MealOrderListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MealOrder.objects.filter(user=self.request.user).prefetch_related('items')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MealOrderCreateSerializer
        return MealOrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = MealOrderCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(MealOrderSerializer(order).data, status=status.HTTP_201_CREATED)


class CookApplicationCreateView(generics.CreateAPIView):
    serializer_class = CookApplicationSerializer

    def get_permissions(self):
        return [AllowAny()]
