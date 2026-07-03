import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  Headphones,
  BadgePercent,
  Calculator,
  ArrowRight,
  Grid2x2,
} from "lucide-react";
import "./HeroDesktop.css";

export default function HeroDesktop() {
  const navigate = useNavigate();

  return (
    <section className="hero-desktop">

      {/* LEFT */}

      <div className="hero-left">

        <div className="hero-badge">
          <span>NEW</span>
          Latest integration just arrived
        </div>

        <h1 className="hero-title">
          One Platform for
          <br />
          <span>All Your Financial Needs</span>
        </h1>

        <p className="hero-subtitle">
          Loans, Tax Solutions, Business Registration,
          Insurance and many more services from one trusted platform.
        </p>

        {/* Offer */}

        <div className="offer-card">

          <div className="offer-icon">
            <BadgePercent size={26}/>
          </div>

          <div>

            <small className="offer-label">
              Special Offer
            </small>

            <h3>
              Low Interest Rates
            </h3>

            <p>
              Quick approvals • Zero hidden charges
            </p>

            <span>
              Apply Online in JUST 5 MINUTES
            </span>

          </div>

        </div>

        {/* Features */}

        <div className="feature-row">

          <div className="feature-card">

            <div className="feature-icon">
              <ShieldCheck size={20}/>
            </div>

            <span>100% Secure</span>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              <Zap size={20}/>
            </div>

            <span>Quick Process</span>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              <Headphones size={20}/>
            </div>

            <span>Expert Support</span>

          </div>

        </div>

        {/* Buttons */}

        <div className="hero-buttons">

          <button
            className="primary-btn"
            onClick={() => navigate("/services")}
          >

            <Grid2x2 size={20}/>

            Explore Services

            <ArrowRight size={18}/>

          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/emi-calculator")}
          >

            <Calculator size={20}/>

            Calculate EMI

          </button>

        </div>

      </div>

      {/* RIGHT */}

      <div className="hero-right">

        <div className="map-glow"/>

        <img
          src="/home/telangana map.png"
          alt=""
          className="hero-map"
        />

        <div className="floating-service">

          <img
            src="/home/scrolling icons/mortgage loans.png"
            alt=""
          />

          <p>
            Mortgage
            <br/>
            Loans
          </p>

        </div>

      </div>

    </section>
  );
}