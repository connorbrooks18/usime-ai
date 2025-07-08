import React from 'react';

function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to My Website</h1>
      <section className="hero-section">
        <h2>Main Headline</h2>
        <p>This is where you can put your main content and introduction.</p>
        <button className="primary-button">Get Started</button>
      </section>
      
      <section className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Feature 1</h3>
            <p>Description of your first feature</p>
          </div>
          <div className="feature-card">
            <h3>Feature 2</h3>
            <p>Description of your second feature</p>
          </div>
          <div className="feature-card">
            <h3>Feature 3</h3>
            <p>Description of your third feature</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
