export function validatePayment({ cardName, cardNumber, expiry, cvc }) {
  if (!cardName?.trim()) return 'Enter the name on your card.';
  const digits = cardNumber.replace(/\s/g, '');
  if (digits.length < 15) return 'Enter a valid card number.';
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Expiry must be MM/YY.';
  if (cvc.length < 3) return 'Enter a valid CVC.';
  return '';
}
