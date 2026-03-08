/**
 * Hero banner on the home page with CTA that scrolls to #places-to-stay.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Banner.css";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="banner">
      <div className="banner_info">
        <h1>Get out and stretch your imagination</h1>
        <h5>
          Plan a different kind of getaway to uncover the hidden gems near you.
        </h5>
        <button
          type="button"
          className="banner_info_explore"
          onClick={() => navigate("/#places-to-stay")}
        >
          Explore nearby
        </button>
      </div>
    </div>
  );
};

export default Banner;
