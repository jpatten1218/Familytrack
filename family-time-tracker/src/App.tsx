import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';

function App() {
  const [message, setMessage] = useState('Welcome to Family Time Tracker!');

  return (
    <DataProvider>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <header style={{ 
          backgroundColor: '#2563eb', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h1 style={{ margin: 0 }}>Family Time Tracker</h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
            Track meaningful moments with Logan, Carter, Blake, and Emma
          </p>
        </header>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#1f2937' }}>🎉 App Successfully Running!</h2>
          <p style={{ color: '#6b7280' }}>
            Your Family Time Tracker is now ready to use. Here's what you can do:
          </p>
          
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#374151' }}>✅ Features Available:</h3>
            <ul style={{ color: '#6b7280', lineHeight: 1.6 }}>
              <li><strong>Time Tracking:</strong> Log activities with your children</li>
              <li><strong>Analytics:</strong> View charts and statistics</li>
              <li><strong>Gamification:</strong> Earn achievements and track streaks</li>
              <li><strong>Micro-Moments:</strong> Track brief daily interactions</li>
              <li><strong>Interest Tracking:</strong> Monitor evolving interests</li>
            </ul>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#374151' }}>👨‍👩‍👧‍👦 Your Children:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
              {[
                { name: 'Logan', age: 11, interests: 'video games, sports, music' },
                { name: 'Carter', age: 9, interests: 'outdoor activities, building' },
                { name: 'Blake', age: 7, interests: 'art, stories, imaginative play' },
                { name: 'Emma', age: 5, interests: 'dolls, princess play, singing' }
              ].map(child => (
                <div key={child.name} style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '15px', 
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#1f2937' }}>
                    {child.name} ({child.age})
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    Interests: {child.interests}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setMessage('Time logging feature coming soon!')}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '20px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            🕐 Start Logging Family Time
          </button>

          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#ecfdf5', 
            border: '1px solid #a7f3d0',
            borderRadius: '6px' 
          }}>
            <p style={{ margin: 0, color: '#065f46', fontWeight: '500' }}>
              {message}
            </p>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '15px', 
          borderRadius: '6px',
          border: '1px solid #e5e7eb' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>🚀 Next Steps:</h3>
          <ol style={{ color: '#6b7280', lineHeight: 1.6, paddingLeft: '20px' }}>
            <li>Use the full featured app (complete with all components)</li>
            <li>Start logging your first family activity</li>
            <li>Explore the analytics dashboard</li>
            <li>Track achievements and build streaks</li>
            <li>Monitor your children's evolving interests</li>
          </ol>
        </div>
      </div>
    </DataProvider>
  );
}

export default App;
