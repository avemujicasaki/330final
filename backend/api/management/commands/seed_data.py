from decimal import Decimal

from django.core.management.base import BaseCommand

from api.models import Cook, MenuItem, Review, WeeklyPlan

MEAL_IMAGES = {
    'green-curry': '/images/meals/green-curry.jpg',
    'pad-thai': '/images/meals/pad-thai.jpg',
    'mango-sticky': '/images/meals/mango-sticky.jpg',
    'chicken-bowl': '/images/meals/chicken-bowl.jpg',
    'salmon': '/images/meals/salmon.jpg',
    'turkey-wrap': '/images/meals/turkey-wrap.jpg',
    'teriyaki': '/images/meals/teriyaki-bento.jpg',
    'tofu-bento': '/images/meals/tofu-bento.jpg',
    'onigiri': '/images/meals/onigiri.jpg',
}

PLAN_IMAGES = {
    'thai': '/images/plans/thai.jpg',
    'muscle': '/images/plans/muscle.jpg',
    'bento': '/images/plans/bento.jpg',
}

COOKS = [
    {
        'id': 'priya',
        'name': 'Priya Singh',
        'short_name': 'Priya S.',
        'title': 'Home-Style Thai & Comfort',
        'rating': 4.9,
        'reviews_count': 98,
        'location': 'South Campus Commons',
        'pickup_time': '6:00 PM',
        'pickup_days': 'Mon–Fri',
        'schedule': 'Mon–Fri 6:00 PM–7:30 PM',
        'image': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
        'bio': 'Second-year CS major sharing family Thai recipes. Weekly curry rotations with vegetarian swaps every day.',
        'tags': ['Vegetarian', 'High Protein', 'Spicy'],
        'reviews': [
            {'text': 'The green curry was incredible — perfect heat and portion size.', 'author': 'James Smith'},
            {'text': 'Loved the labeled allergens on every container.', 'author': 'Lily Wang'},
        ],
        'menu': [
            {'id': 'green-curry', 'day': 'Monday', 'name': 'Green Curry Bowl', 'desc': 'Coconut green curry with jasmine rice and Thai basil.', 'price': '11.50', 'icon': 'Leaf'},
            {'id': 'pad-thai', 'day': 'Wednesday', 'name': 'Campus Pad Thai', 'desc': 'Rice noodles, tamarind, peanuts, and lime.', 'price': '12.00', 'icon': 'Zap'},
            {'id': 'mango-sticky', 'day': 'Friday', 'name': 'Mango Sticky Rice', 'desc': 'Sweet coconut rice with fresh mango.', 'price': '9.00', 'icon': 'Utensils'},
        ],
    },
    {
        'id': 'mark',
        'name': 'Mark Thompson',
        'short_name': 'Mark T.',
        'title': 'Lean Muscle Prep Coach',
        'rating': 4.7,
        'reviews_count': 76,
        'location': 'University Gym Hub',
        'pickup_time': '5:30 PM',
        'pickup_days': 'Mon–Fri',
        'schedule': 'Mon–Fri 5:30 PM–6:30 PM',
        'image': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
        'bio': 'Kinesiology senior meal-prepping high-protein bowls for athletes and gym regulars.',
        'tags': ['High Protein', 'Gluten-Free'],
        'reviews': [
            {'text': 'Best post-workout meals on campus. Macros listed clearly.', 'author': 'Chris Lee'},
            {'text': 'Portions are huge and always on time at the gym hub.', 'author': 'Sam Rivera'},
        ],
        'menu': [
            {'id': 'chicken-bowl', 'day': 'Monday', 'name': 'Grilled Chicken Power Bowl', 'desc': 'Chicken, quinoa, roasted veggies, and chimichurri.', 'price': '14.50', 'icon': 'Zap'},
            {'id': 'salmon', 'day': 'Wednesday', 'name': 'Salmon & Sweet Potato', 'desc': 'Baked salmon, greens, and herb butter.', 'price': '15.00', 'icon': 'Leaf'},
            {'id': 'turkey-wrap', 'day': 'Friday', 'name': 'Turkey Protein Wrap', 'desc': 'Whole wheat wrap, turkey, hummus, and spinach.', 'price': '12.00', 'icon': 'Utensils'},
        ],
    },
    {
        'id': 'yuki',
        'name': 'Yuki Kimura',
        'short_name': 'Yuki K.',
        'title': 'Budget Bento Specialist',
        'rating': 4.8,
        'reviews_count': 112,
        'location': 'Library Plaza',
        'pickup_time': '12:30 PM',
        'pickup_days': 'Mon–Fri',
        'schedule': 'Mon–Fri 12:30 PM–1:30 PM',
        'image': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80',
        'bio': 'Economics major offering affordable bento boxes with halal-friendly options near the library.',
        'tags': ['Asian Food', 'Halal Option', 'Value'],
        'reviews': [
            {'text': 'Amazing value — five lunches under $40 for the week.', 'author': 'Nina Patel'},
            {'text': 'Convenient pickup right before afternoon classes.', 'author': 'Omar Hassan'},
        ],
        'menu': [
            {'id': 'teriyaki', 'day': 'Monday', 'name': 'Teriyaki Chicken Bento', 'desc': 'Chicken, rice, edamame, and pickled ginger.', 'price': '9.50', 'icon': 'Zap'},
            {'id': 'tofu-bento', 'day': 'Wednesday', 'name': 'Halal Tofu Bento', 'desc': 'Sesame tofu, rice, and seasonal vegetables.', 'price': '8.50', 'icon': 'Leaf'},
            {'id': 'onigiri', 'day': 'Friday', 'name': 'Salmon Onigiri Set', 'desc': 'Three onigiri with miso soup.', 'price': '10.00', 'icon': 'Utensils'},
        ],
    },
]

PLANS = [
    {
        'id': 'thai', 'cook_id': 'priya', 'name': 'Home-Style Thai Curry',
        'meals_per_week': 5, 'price': '45.00', 'rating': 4.9,
        'location': 'South Campus Commons',
        'tags': ['Vegetarian', 'High Protein', 'Spicy'],
        'filter_keys': ['High Protein', 'Vegetarian'],
    },
    {
        'id': 'muscle', 'cook_id': 'mark', 'name': 'Lean Muscle Prep',
        'meals_per_week': 5, 'price': '60.00', 'rating': 4.7,
        'location': 'University Gym Hub',
        'tags': ['High Protein', 'Gluten-Free'],
        'filter_keys': ['High Protein'],
    },
    {
        'id': 'bento', 'cook_id': 'yuki', 'name': 'Budget Bento Week',
        'meals_per_week': 5, 'price': '38.00', 'rating': 4.8,
        'location': 'Library Plaza',
        'tags': ['Asian Food', 'Halal Option', 'Value'],
        'filter_keys': ['Budget Friendly', 'Asian Food', 'Halal'],
    },
]


class Command(BaseCommand):
    help = 'Seed cooks, menus, plans, and reviews from frontend data.js'

    def handle(self, *args, **options):
        WeeklyPlan.objects.all().delete()
        MenuItem.objects.all().delete()
        Review.objects.all().delete()
        Cook.objects.all().delete()

        for data in COOKS:
            cook = Cook.objects.create(
                id=data['id'],
                name=data['name'],
                short_name=data['short_name'],
                title=data['title'],
                rating=data['rating'],
                reviews_count=data['reviews_count'],
                location=data['location'],
                pickup_time=data['pickup_time'],
                pickup_days=data['pickup_days'],
                schedule=data['schedule'],
                image=data['image'],
                bio=data['bio'],
                tags=data['tags'],
            )
            for r in data['reviews']:
                Review.objects.create(cook=cook, text=r['text'], author=r['author'])
            for m in data['menu']:
                MenuItem.objects.create(
                    item_id=m['id'],
                    cook=cook,
                    day=m['day'],
                    name=m['name'],
                    desc=m['desc'],
                    price=Decimal(m['price']),
                    icon=m['icon'],
                    image=MEAL_IMAGES.get(m['id'], ''),
                )

        for p in PLANS:
            cook = Cook.objects.get(id=p['cook_id'])
            WeeklyPlan.objects.create(
                id=p['id'],
                cook=cook,
                name=p['name'],
                meals_per_week=p['meals_per_week'],
                price=Decimal(p['price']),
                rating=p['rating'],
                location=p['location'],
                tags=p['tags'],
                filter_keys=p['filter_keys'],
                image=PLAN_IMAGES.get(p['id'], ''),
            )

        self.stdout.write(self.style.SUCCESS('Seed data loaded.'))
