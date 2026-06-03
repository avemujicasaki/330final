import { Leaf, Zap, Utensils } from 'lucide-react';
import { MEAL_IMAGES, PLAN_IMAGES } from './data/images';

export const FILTER_OPTIONS = [
  'All Plans',
  'High Protein',
  'Vegetarian',
  'Budget Friendly',
  'Near Me',
  'Asian Food',
  'Halal',
];

export const USER_CAMPUS = 'North Quad';

export const cooks = [
  {
    id: 'priya',
    name: 'Priya Singh',
    shortName: 'Priya S.',
    title: 'Home-Style Thai & Comfort',
    rating: 4.9,
    reviews: 98,
    location: 'South Campus Commons',
    pickupTime: '6:00 PM',
    pickupDays: 'Mon–Fri',
    schedule: 'Mon–Fri 6:00 PM–7:30 PM',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
    bio: 'Second-year CS major sharing family Thai recipes. Weekly curry rotations with vegetarian swaps every day.',
    tags: ['Vegetarian', 'High Protein', 'Spicy'],
    reviews_list: [
      { text: 'The green curry was incredible — perfect heat and portion size.', author: 'James Smith' },
      { text: 'Loved the labeled allergens on every container.', author: 'Lily Wang' },
    ],
    menu: [
      { id: 'green-curry', day: 'Monday', name: 'Green Curry Bowl', desc: 'Coconut green curry with jasmine rice and Thai basil.', price: 11.5, icon: Leaf, image: MEAL_IMAGES['green-curry'] },
      { id: 'pad-thai', day: 'Wednesday', name: 'Campus Pad Thai', desc: 'Rice noodles, tamarind, peanuts, and lime.', price: 12, icon: Zap, image: MEAL_IMAGES['pad-thai'] },
      { id: 'mango-sticky', day: 'Friday', name: 'Mango Sticky Rice', desc: 'Sweet coconut rice with fresh mango.', price: 9, icon: Utensils, image: MEAL_IMAGES['mango-sticky'] },
    ],
  },
  {
    id: 'mark',
    name: 'Mark Thompson',
    shortName: 'Mark T.',
    title: 'Lean Muscle Prep Coach',
    rating: 4.7,
    reviews: 76,
    location: 'University Gym Hub',
    pickupTime: '5:30 PM',
    pickupDays: 'Mon–Fri',
    schedule: 'Mon–Fri 5:30 PM–6:30 PM',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
    bio: 'Kinesiology senior meal-prepping high-protein bowls for athletes and gym regulars.',
    tags: ['High Protein', 'Gluten-Free'],
    reviews_list: [
      { text: 'Best post-workout meals on campus. Macros listed clearly.', author: 'Chris Lee' },
      { text: 'Portions are huge and always on time at the gym hub.', author: 'Sam Rivera' },
    ],
    menu: [
      { id: 'chicken-bowl', day: 'Monday', name: 'Grilled Chicken Power Bowl', desc: 'Chicken, quinoa, roasted veggies, and chimichurri.', price: 14.5, icon: Zap, image: MEAL_IMAGES['chicken-bowl'] },
      { id: 'salmon', day: 'Wednesday', name: 'Salmon & Sweet Potato', desc: 'Baked salmon, greens, and herb butter.', price: 15, icon: Leaf, image: MEAL_IMAGES.salmon },
      { id: 'turkey-wrap', day: 'Friday', name: 'Turkey Protein Wrap', desc: 'Whole wheat wrap, turkey, hummus, and spinach.', price: 12, icon: Utensils, image: MEAL_IMAGES['turkey-wrap'] },
    ],
  },
  {
    id: 'yuki',
    name: 'Yuki Kimura',
    shortName: 'Yuki K.',
    title: 'Budget Bento Specialist',
    rating: 4.8,
    reviews: 112,
    location: 'Library Plaza',
    pickupTime: '12:30 PM',
    pickupDays: 'Mon–Fri',
    schedule: 'Mon–Fri 12:30 PM–1:30 PM',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80',
    bio: 'Economics major offering affordable bento boxes with halal-friendly options near the library.',
    tags: ['Asian Food', 'Halal Option', 'Value'],
    reviews_list: [
      { text: 'Amazing value — five lunches under $40 for the week.', author: 'Nina Patel' },
      { text: 'Convenient pickup right before afternoon classes.', author: 'Omar Hassan' },
    ],
    menu: [
      { id: 'teriyaki', day: 'Monday', name: 'Teriyaki Chicken Bento', desc: 'Chicken, rice, edamame, and pickled ginger.', price: 9.5, icon: Zap, image: MEAL_IMAGES.teriyaki },
      { id: 'tofu-bento', day: 'Wednesday', name: 'Halal Tofu Bento', desc: 'Sesame tofu, rice, and seasonal vegetables.', price: 8.5, icon: Leaf, image: MEAL_IMAGES['tofu-bento'] },
      { id: 'onigiri', day: 'Friday', name: 'Salmon Onigiri Set', desc: 'Three onigiri with miso soup.', price: 10, icon: Utensils, image: MEAL_IMAGES.onigiri },
    ],
  },
];

export const plans = [
  {
    id: 'thai',
    cookId: 'priya',
    name: 'Home-Style Thai Curry',
    mealsPerWeek: 5,
    price: 45,
    rating: 4.9,
    location: 'South Campus Commons',
    tags: ['Vegetarian', 'High Protein', 'Spicy'],
    filterKeys: ['High Protein', 'Vegetarian'],
    image: PLAN_IMAGES.thai,
  },
  {
    id: 'muscle',
    cookId: 'mark',
    name: 'Lean Muscle Prep',
    mealsPerWeek: 5,
    price: 60,
    rating: 4.7,
    location: 'University Gym Hub',
    tags: ['High Protein', 'Gluten-Free'],
    filterKeys: ['High Protein'],
    image: PLAN_IMAGES.muscle,
  },
  {
    id: 'bento',
    cookId: 'yuki',
    name: 'Budget Bento Week',
    mealsPerWeek: 5,
    price: 38,
    rating: 4.8,
    location: 'Library Plaza',
    tags: ['Asian Food', 'Halal Option', 'Value'],
    filterKeys: ['Budget Friendly', 'Asian Food', 'Halal'],
    image: PLAN_IMAGES.bento,
  },
];

export const STATIC_PAGES = {
  guidelines: {
    title: 'Community Guidelines',
    body: 'CoachShare is built on trust between student cooks and subscribers. Be respectful, arrive on time for pickups, communicate allergies clearly, and report safety concerns immediately.',
  },
  safety: {
    title: 'Safety',
    body: 'All cooks complete campus kitchen safety training. Meals are labeled with ingredients and allergens. Report any illness or concern within 24 hours through Support.',
  },
  terms: {
    title: 'Terms of Service',
    body: 'Subscriptions renew weekly unless skipped or canceled before Friday midnight. Refunds are issued for missed pickups caused by cook cancellation. Campus ID required for pickup.',
  },
  support: {
    title: 'Support',
    body: 'Email support@coachshare.campus.edu or visit the Student Union help desk Mon–Fri 10 AM–4 PM. Average response time: under 12 hours.',
  },
};

export function getCookById(id) {
  return cooks.find((c) => c.id === id);
}

export function getPlanById(id) {
  return plans.find((p) => p.id === id);
}

export function filterPlans(plansList, filter, campus = USER_CAMPUS) {
  if (filter === 'All Plans') return plansList;
  if (filter === 'High Protein') return plansList.filter((p) => p.tags.includes('High Protein') || p.filterKeys?.includes('High Protein'));
  if (filter === 'Vegetarian') return plansList.filter((p) => p.tags.includes('Vegetarian'));
  if (filter === 'Budget Friendly') return plansList.filter((p) => p.price <= 45 || p.filterKeys?.includes('Budget Friendly'));
  if (filter === 'Asian Food') return plansList.filter((p) => p.tags.includes('Asian Food'));
  if (filter === 'Halal') return plansList.filter((p) => p.tags.some((t) => t.includes('Halal')));
  if (filter === 'Near Me') {
    const near = ['North Quad', 'South Campus', 'Library'];
    return [...plansList].sort((a, b) => {
      const aNear = near.some((n) => a.location.includes(n) || campus.includes(n.split(' ')[0]));
      const bNear = near.some((n) => b.location.includes(n));
      if (aNear === bNear) return 0;
      return aNear ? -1 : 1;
    });
  }
  return plansList;
}
