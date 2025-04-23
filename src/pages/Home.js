import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { IoImagesOutline, IoMailOpenOutline } from "react-icons/io5";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-gradient-bg" style={{ minHeight: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 70 }}>
        <div className="home-headerBox">
          <FaHeart size={36} color="#ca1442" />
          <span className="home-greeting" style={{ fontFamily: "'Pacifico', cursive" }}>Dear Lover</span>
          <FaHeart size={36} color="#ca1442" />
        </div>
        <div className="home-subheader">Choose an option below</div>
        <button className="home-bigBtn pink" onClick={() => navigate("/romantic-images")}>
          <IoImagesOutline size={30} style={{ marginRight: 12 }} />
          Romantic Images
        </button>
        <button className="home-bigBtn yellow" onClick={() => navigate("/love-letter")}>
          <IoMailOpenOutline size={30} color="#b5651d" style={{ marginRight: 12 }} />
          <span style={{ color: "#b5651d" }}>Love Letter</span>
        </button>
        <div className="home-notes-box">
          <div className="home-notes-title">Notes</div>
          <div className="home-notes-content">
            - Do ảnh deploy miễn phí nên là trong một tháng dùng db được mấy nghìn token đó.<br />
            - Nếu như dùng hết trong token trong tháng thì tháng sau mới sử dụng tiếp được.<br />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;