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

export function filterPlans(plansList, filter, campus = USER_CAMPUS) {
  if (filter === 'All Plans') return plansList;
  if (filter === 'High Protein')
    return plansList.filter((p) => p.tags.includes('High Protein') || p.filterKeys?.includes('High Protein'));
  if (filter === 'Vegetarian') return plansList.filter((p) => p.tags.includes('Vegetarian'));
  if (filter === 'Budget Friendly')
    return plansList.filter((p) => p.price <= 45 || p.filterKeys?.includes('Budget Friendly'));
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
