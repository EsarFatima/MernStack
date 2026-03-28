import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/api';
import './Dashboard.css';

function Dashboard({ onLogout }) {
  const [creatures, setCreatures] = useState([]);
  const [name, setName] = useState('');
  const [power, setPower] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch creatures on load
  useEffect(() => {
    fetchCreatures();
  }, []);

  const fetchCreatures = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/creatures');
      if (Array.isArray(data)) {
        setCreatures(data);
      } else {
        setError(data.error || 'Failed to fetch creatures');
      }
    } catch (err) {
      setError('An error occurred while fetching creatures');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addCreature = async e => {
    e.preventDefault();
    setError('');

    try {
      const newCreature = await apiRequest('/creatures', {
        method: 'POST',
        body: JSON.stringify({ name, power })
      });

      if (newCreature._id) {
        setCreatures([...creatures, newCreature]);
        setName('');
        setPower('');
      } else {
        setError(newCreature.error || 'Failed to add creature');
      }
    } catch (err) {
      setError('An error occurred while adding creature');
      console.error(err);
    }
  };

  const deleteCreature = async (id) => {
    try {
      await apiRequest(`/creatures/${id}`, { method: 'DELETE' });
      setCreatures(creatures.filter(c => c._id !== id));
    } catch (err) {
      setError('An error occurred while deleting creature');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
      onLogout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🎮 Creature Collector</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="creatures-section">
        <h2>Your Creatures</h2>
        {loading ? (
          <p>Loading creatures...</p>
        ) : creatures.length === 0 ? (
          <p className="no-creatures">You haven't caught any creatures yet!</p>
        ) : (
          <ul className="creatures-list">
            {creatures.map(c => (
              <li key={c._id} className="creature-item">
                <div className="creature-info">
                  <strong>{c.name}</strong>
                  {c.power && <span className="power">Power: {c.power}</span>}
                </div>
                <button 
                  onClick={() => deleteCreature(c._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="add-creature-section">
        <h3>Catch a New Creature</h3>
        <form onSubmit={addCreature} className="add-creature-form">
          <div className="form-group">
            <input 
              type="text"
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="Creature name (required)" 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="text"
              value={power} 
              onChange={e => setPower(e.target.value)}
              placeholder="Power (optional)" 
            />
          </div>
          <button type="submit" className="btn-add">Add Creature</button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
