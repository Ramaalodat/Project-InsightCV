import React from 'react';
import './CTACompany.css';

export default function CTACompany() {
  return (
    <section className="cta-company">
      <div className="cta-content">
        <div className="cta-card">
          <div className="cta-glow" aria-hidden="true" />
          <div className="cta-inner">
            <h3 className="cta-title">
              Ready to find the perfect match for your company?
            </h3>
            <div className="cta-buttons">
              <a href="/company-home/suggested" className="cta-btn-primary">
                Discover Candidates
              </a>
              <a href="/company-home/ads" className="cta-btn-secondary">
                Add New Post
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
