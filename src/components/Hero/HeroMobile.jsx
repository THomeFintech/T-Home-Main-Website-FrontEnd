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

        Financial Guidance

      </div>

      <h1 className="mobile-title">

        Smarter Loans, Tax &amp; Business Services for Every Income

        <br />

        <span>Profile</span>

      </h1>

      <p className="mobile-subtitle">

        Explore lender options, check indicative eligibility, and complete filings with expert guidance and simple planning tools.

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

            Transparent Guidance • Multiple Lender Options

          </p>

          <span>

            Assisted Documentation • Consent-Based Data Handling

          </span>

        </div>

      </div>

      <div className="mobile-features">

        <div>

          <ShieldCheck size={20}/>

          <span>Consent-Based Data Handling</span>

        </div>

        <div>

          <Zap size={20}/>

          <span>Assisted Documentation</span>

        </div>

        <div>

          <Headphones size={20}/>

          <span>Transparent Guidance</span>

        </div>

      </div>

      <button
        className="mobile-primary"
        onClick={() => navigate("/tools?tool=loan-prediction")}
      >

        <Grid2x2 size={18}/>

        Check Indicative Eligibility

        <ArrowRight size={16}/>

      </button>

      <button
        className="mobile-secondary"
        onClick={() => navigate("/services")}
      >

        <Calculator size={18}/>

        Explore Services

      </button>

    </section>

  );

}