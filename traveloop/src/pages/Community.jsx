import { useState } from 'react';
import { Heart, MessageCircle, Share2, User } from 'lucide-react';
import { communityPosts } from '../data/mockData';
import './Pages.css';

export default function Community() {
  const [liked, setLiked] = useState({});

  const toggleLike = (id) => setLiked(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="page-content">
      <div className="container container-narrow">
        <div className="page-header animate-in">
          <h1>Community</h1>
          <p>Share experiences and get inspired</p>
        </div>

        <div className="community-feed">
          {communityPosts.map((post, i) => (
            <div key={post.id} className={`card community-card animate-in animate-in-delay-${Math.min(i + 1, 6)}`}>
              <div className="post-header">
                <div className="post-avatar"><User size={18} /></div>
                <div>
                  <strong>{post.user.name}</strong>
                  <span className="post-trip-tag">{post.trip}</span>
                </div>
                <span className="post-date">{new Date(post.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
              </div>
              <p className="post-content">{post.content}</p>
              <div className="post-actions">
                <button className={`post-action ${liked[post.id] ? 'liked' : ''}`} onClick={() => toggleLike(post.id)}>
                  <Heart size={16} fill={liked[post.id] ? 'var(--terracotta)' : 'none'} /> {post.likes + (liked[post.id] ? 1 : 0)}
                </button>
                <button className="post-action"><MessageCircle size={16} /> {post.comments}</button>
                <button className="post-action"><Share2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
