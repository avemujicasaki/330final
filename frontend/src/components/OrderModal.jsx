import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function OrderModal({ item, cook, onClose }) {
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [item?.id]);

  if (!item) return null;

  const handleAdd = () => {
    addToCart({
      key: `${cook.id}-${item.id}`,
      cookId: cook.id,
      cookName: cook.name,
      menuItemId: item.id,
      name: item.name,
      day: item.day,
      price: item.price,
      image: item.image,
      qty,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-labelledby="order-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2 id="order-title">Order {item.name}</h2>
        <p className="muted">{item.day} · by {cook.name}</p>
        <p>{item.desc}</p>
        <p className="price-line">
          <strong>${(item.price * qty).toFixed(2)}</strong>
          <span>${item.price.toFixed(2)} each</span>
        </p>
        <label className="field">
          Quantity
          <div className="qty-row">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button type="button" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
        </label>
        <button type="button" className="btn-primary full" onClick={handleAdd}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
