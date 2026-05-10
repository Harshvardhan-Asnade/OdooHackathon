import { useState } from 'react';
import { User, MapPin, Mail, Phone, Edit3 } from 'lucide-react';
import { currentUser, trips } from '../data/mockData';
import { Link } from 'react-router-dom';
import './Pages.css';

export default function Profile() {
  return (
    <div className="page-content">
      <div className="container">
        <div className="profile-header animate-in">
          <div className="profile-avatar"><User size={40} /></div>
          <div className="profile-info">
            <h1>{currentUser.firstName} {currentUser.lastName}</h1>
            <div className="profile-meta">
              <span><Mail size={14} /> {currentUser.email}</span>
              <span><Phone size={14} /> {currentUser.phone}</span>
              <span><MapPin size={14} /> {currentUser.city}, {currentUser.country}</span>
            </div>
            <button className="btn btn-outline btn-sm"><Edit3 size={14} /> Edit Profile</button>
          </div>
        </div>

        <section className="section animate-in animate-in-delay-1">
          <h2>Preplanned Trips</h2>
          <div className="trips-grid">
            {trips.filter(t => t.status !== 'completed').map((trip, i) => (
              <Link to={`/trips/${trip.id}`} key={trip.id} className="trip-card">
                <div className="trip-cover" style={{ background: `linear-gradient(135deg, #1A565322, #1A565308)` }}>
                  <span className="trip-emoji">{trip.coverEmoji}</span>
                </div>
                <div className="trip-info">
                  <h4>{trip.name}</h4>
                  <div className="trip-meta"><span><MapPin size={13} /> {trip.cities[0]}</span></div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section animate-in animate-in-delay-2">
          <h2>Previous Trips</h2>
          <div className="trips-grid">
            {trips.filter(t => t.status === 'completed').map((trip) => (
              <Link to={`/trips/${trip.id}`} key={trip.id} className="trip-card">
                <div className="trip-cover" style={{ background: `linear-gradient(135deg, #7A9E7E22, #7A9E7E08)` }}>
                  <span className="trip-emoji">{trip.coverEmoji}</span>
                </div>
                <div className="trip-info">
                  <h4>{trip.name}</h4>
                  <div className="trip-meta"><span><MapPin size={13} /> {trip.cities[0]}</span></div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
