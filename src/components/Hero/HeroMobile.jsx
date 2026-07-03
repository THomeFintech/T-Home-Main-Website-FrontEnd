import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  Headphones,
  BadgePercent,
  Calculator,
  Grid2x2,
  ArrowRight,
} from "lucide-react";

import "./HeroMobile.css";

export default function HeroMobile() {

  const navigate = useNavigate();

  return (

    <section className="mobile-hero">

      <div className="mobile-badge">

        <BadgePercent size={18} />

        Your Trusted Financial Partner

      </div>

      <h1 className="mobile-title">

        One Platform for

        <br />

        <span>All Your Financial Needs</span>

      </h1>

      <p className="mobile-subtitle">

        Loans, Tax Solutions, Business Registration and many more services from one trusted platform.

      </p>

      <img
        src="/home/telangana map.png"
        className="mobile-map"
        alt=""
      />

      <div className="mobile-offer">

        <div className="offer-icon">

          <BadgePercent size={20}/>

        </div>

        <div>

          <p>

            Low interest rates, quick approvals,

            and zero hidden charges.

          </p>

          <span>

            Apply online in just 5 minutes.

          </span>

        </div>

      </div>

      <div className="mobile-features">

        <div>

          <ShieldCheck size={20}/>

          <span>100% Secure</span>

        </div>

        <div>

          <Zap size={20}/>

          <span>Quick Process</span>

        </div>

        <div>

          <Headphones size={20}/>

          <span>Expert Support</span>

        </div>

      </div>

      <button
        className="mobile-primary"
        onClick={() => navigate("/services")}
      >

        <Grid2x2 size={18}/>

        Explore Services

        <ArrowRight size={16}/>

      </button>

      <button
        className="mobile-secondary"
        onClick={() => navigate("/emi-calculator")}
      >

        <Calculator size={18}/>

        Calculate EMI

      </button>

    </section>

  );

}