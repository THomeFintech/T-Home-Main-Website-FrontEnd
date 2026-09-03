import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

const circleItems = [
  {
    img: "/home/scrolling icons/personal loan.png",
    text: "Personal Loans",
  },
  {
    img: "/home/scrolling icons/home loan.png",
    text: "Home Loans",
  },
  {
    img: "/home/scrolling icons/mortgage loans.png",
    text: "Mortgage Loans",
  },
  {
    img: "/home/scrolling icons/balance transfer.png",
    text: "Balance Transfer",
  },
  {
    img: "/home/scrolling icons/company registration.png",
    text: "Company Registration",
  },
  {
    img: "/home/scrolling icons/Food License.png",
    text: "Food License",
  },
  {
    img: "/home/scrolling icons/gst services.png",
    text: "GST Services",
  },
  {
    img: "/home/scrolling icons/itr tax filing.png",
    text: "ITR Tax Filing",
  },
  {
    img: "/home/scrolling icons/loan against property.png",
    text: "Loan Against Property",
  },
  {
    img: "/home/scrolling icons/MSME.png",
    text: "MSME",
  },
  {
    img: "/home/scrolling icons/pan adhaar linking.png",
    text: "PAN Aadhaar Linking",
  },
];

export default function HeroDesktop() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % circleItems.length);
    }, 2500);
  
    return () => clearInterval(interval);
  }, []);
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
          Loans, Tax Solutions, Business Registration
          and many more services from one trusted platform.
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

  <div className="map-glow" />

  <div className="map-section">

    <img
      src="/home/telangana map.png"
      alt="Telangana"
      className="hero-map"
    />

    <div className="rotating-circle">

      <img
        src={circleItems[currentIndex].img}
        alt={circleItems[currentIndex].text}
        className="circle-icon"
      />

      <p className="circle-text">
        {circleItems[currentIndex].text}
      </p>

    </div>

  </div>

</div>

    </section>
  );
}