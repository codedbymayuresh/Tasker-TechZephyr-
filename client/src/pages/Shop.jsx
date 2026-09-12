import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Shop() {
  const { user, updateUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/shop');
      setItems(res.data.items || res.data);
    } catch (err) {
      setError('Could not load Black Market inventory.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyItem = async (itemId) => {
    try {
      const res = await api.post('/shop/buy', { itemId });
      updateUser(res.data.user);
      setMessage('Item successfully acquired and added to inventory.');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed. Check your CR balance.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleUseItem = async (itemId, idx) => {
    try {
      const res = await api.post('/shop/use-item', { itemId: itemId || idx });
      updateUser(res.data.user);
      
      let alertText = res.data.message;
      if (res.data.rewards?.leveledUp) {
        alertText += ` 🎉 LEVEL UP! Reached Level ${res.data.rewards.newLevel}!`;
      }
      
      setMessage(alertText);
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not execute item protocol.');
      setTimeout(() => setError(''), 4000);
    }
  };

  if (!user) return null;

  return (
    <main style={{ padding: '2rem', fontFamily: "'Share Tech Mono', monospace", color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: '#00f0ff', margin: 0, textShadow: '0 0 10px rgba(0,240,255,0.3)', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
            BLACK MARKET DECK
          </h1>
          <p style={{ color: '#888', margin: '0.3rem 0 0 0', fontSize: '0.85rem' }}>EXCHANGE CREDITS FOR SYSTEM ENHANCEMENTS</p>
        </div>
        <div style={{ background: '#111', border: '1px solid #fce205', padding: '0.6rem 1.2rem', color: '#fce205', fontWeight: 'bold', boxShadow: '0 0 10px rgba(252,226,5,0.2)' }}>
          CREDITS: {user.gold || 0} CR
        </div>
      </div>

      {message && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', padding: '1rem', marginBottom: '1.5rem', color: '#22c55e', textAlign: 'center', fontWeight: 'bold' }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(255,0,60,0.1)', border: '1px solid #ff003c', padding: '1rem', marginBottom: '1.5rem', color: '#ff003c', textAlign: 'center', fontWeight: 'bold' }}>
          {error}
        </div>
      )}

      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Section: Store Items Available for Purchase */}
        <section style={{ background: '#111', border: '1px solid #222', padding: '1.5rem' }}>
          <h2 style={{ color: '#00f0ff', fontSize: '1.2rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem', marginTop: 0 }}>
            AVAILABLE PROTOCOLS / ITEMS
          </h2>

          {loading ? (
            <div style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>Decrypting market data...</div>
          ) : !items || items.length === 0 ? (
            <div style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No items available in the Black Market.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {items.map((item) => {
                const itemPrice = item.price ?? item.cost ?? item.creditCost ?? 0;
                return (
                  <div key={item._id || item.id} style={{ background: '#16161a', border: '1px solid #333', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.4rem 0', color: '#fff' }}>{item.name}</h4>
                      <p style={{ margin: '0 0 1rem 0', color: '#888', fontSize: '0.8rem' }}>{item.description || 'Enhancement tool.'}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #222', paddingTop: '0.8rem' }}>
                      <span style={{ color: '#fce205', fontWeight: 'bold', fontSize: '0.9rem' }}>{itemPrice} CR</span>
                      <button 
                        onClick={() => handleBuyItem(item._id || item.id)}
                        style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '0.4rem 0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        [ ACQUIRE ]
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Section: User's Inventory */}
        <section style={{ background: '#111', border: '1px solid #222', padding: '1.5rem' }}>
          <h2 style={{ color: '#22c55e', fontSize: '1.2rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem', marginTop: 0 }}>
            INVENTORY ({user.inventory?.length || 0})
          </h2>

          {!user.inventory || user.inventory.length === 0 ? (
            <div style={{ color: '#666', textAlign: 'center', padding: '3rem' }}>Inventory is empty. Acquire items from the market.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {user.inventory.map((invItem, idx) => (
                <div key={invItem._id || idx} style={{ background: '#131316', border: '1px solid #1e293b', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem 0', color: '#fff', fontSize: '0.95rem' }}>{invItem.name || invItem.itemId?.name || 'Encrypted Item'}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#00f0ff' }}>STATUS: SECURED</span>
                  </div>
                  <button 
                    onClick={() => handleUseItem(invItem._id, idx)}
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', color: '#22c55e', padding: '0.4rem 0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    [ USE ]
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}