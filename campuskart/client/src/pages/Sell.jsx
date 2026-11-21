
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errText } from '../api';

const cats = [
  'Books',
  'Electronics',
  'Project Kits',
  'Hostel Essentials',
  'Stationery',
  'Cycles',
  'Instruments',
  'Sports',
  'Other'
];

export default function Sell() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Books',
    condition: 'Good',
    price: '',
    originalPrice: '',
    purchaseYear: '',
    images: '',
    meetup: 'Library',
    negotiable: false,
    exchange: false
  });

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => {
    const { name, type, checked, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const images = form.images
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);

      if (images.length > 5) {
        setError('You can add a maximum of 5 images.');
        return;
      }

      if (
        images.some((url) => {
          try {
            return new URL(url).protocol !== 'https:';
          } catch {
            return true;
          }
        })
      ) {
        setError('Please enter valid HTTPS image URLs.');
        return;
      }

      const payload = {
        ...form,
        images,
        price: Number(form.price),
        originalPrice:
          form.originalPrice === ''
            ? undefined
            : Number(form.originalPrice),
        purchaseYear:
          form.purchaseYear === ''
            ? undefined
            : Number(form.purchaseYear)
      };

      await api.post('/items', payload);

      nav('/my-items');
    } catch (err) {
      setError(errText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container narrow page">
      <div className="page-heading">
        <span className="overline">SHARE SOMETHING GOOD</span>
        <h1>List an item</h1>
        <p>Give a useful item its next chapter.</p>
      </div>

      <form onSubmit={submit} className="panel form">
        <label>
          Item title
          <input
            name="title"
            required
            maxLength="120"
            placeholder="e.g. Arduino Uno R3"
            value={form.title}
            onChange={change}
          />
        </label>

        <div className="two-col">
          <label>
            Category
            <select
              name="category"
              value={form.category}
              onChange={change}
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label>
            Condition
            <select
              name="condition"
              value={form.condition}
              onChange={change}
            >
              {['New', 'Like New', 'Good', 'Used'].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Description
          <textarea
            name="description"
            required
            rows={4}
            value={form.description}
            onChange={change}
            placeholder="What's included? Any signs of use?"
          />
        </label>

        <div className="two-col">
          <label>
            Selling price (₹; 0 = free)
            <input
              name="price"
              type="number"
              min="0"
              required
              value={form.price}
              onChange={change}
            />
          </label>

          <label>
            Original price (₹)
            <input
              name="originalPrice"
              type="number"
              min="0"
              value={form.originalPrice}
              onChange={change}
            />
          </label>
        </div>

        <div className="two-col">
          <label>
            Purchase year
            <input
              name="purchaseYear"
              type="number"
              min="1990"
              max="2100"
              value={form.purchaseYear}
              onChange={change}
            />
          </label>

          <label>
            Campus meetup location
            <select
              name="meetup"
              value={form.meetup}
              onChange={change}
            >
              {[
                'Library',
                'Canteen',
                'Main Gate',
                'Department Block',
                'Hostel',
                'Other'
              ].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Image URLs (one HTTPS URL per line; up to 5)
          <textarea
            name="images"
            rows={2}
            placeholder="https://example.com/image.jpg"
            value={form.images}
            onChange={change}
          />
        </label>

        <p className="hint">
          This starter supports hosted image URLs.
          Cloudinary uploads can be added later.
        </p>

        <div className="checkboxes">
          <label className="check">
            <input
              type="checkbox"
              name="negotiable"
              checked={form.negotiable}
              onChange={change}
            />
            Price negotiable
          </label>

          <label className="check">
            <input
              type="checkbox"
              name="exchange"
              checked={form.exchange}
              onChange={change}
            />
            Accept exchanges
          </label>
        </div>

        <p className="hint">
          Listings appear after an administrator approves them.
        </p>

        {error && (
          <p className="error">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="button full"
        >
          {busy
            ? 'Publishing...'
            : 'Submit listing for approval'}
        </button>
      </form>
    </main>
  );
}
