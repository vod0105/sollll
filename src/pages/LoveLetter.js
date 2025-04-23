import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import "../styles/LoveLetter.css";
import letterImg from "../assets/images/a1.jpg";


function LoveLetter() {
  const navigate = useNavigate();
  return (
    <div className="loveletter-gradient-bg" style={{ minHeight: "100vh", padding: "0 0 30px 0" }}>
      <button className="backBtn" style={{ marginLeft: 16 }} onClick={() => navigate("/home")}>
        <IoArrowBack size={24} color="#fb7098" style={{ marginRight: 7 }} /> Back
      </button>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}>
        {/* Letter Illustration */}
        <img src={letterImg} alt="Letter illustration" className="loveletter-illustration" />
        <div className="loveletter-box">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
            <FaHeart size={32} color="#ee638d" />
          </div>
          <div className="loveletter-title" style={{ fontFamily: "'Pacifico', cursive" }}>My Letter</div>
          <div className="loveletter-content">
            Bày Đặt gửi My Love 💌,<br />
            Iuu em nhiều lắm, nhớ em nhiều lắm❤️.<br />
            Mong em luôn vui vẻ và hạnh phúc.<br />
            Chúc em luôn bình an, học tập tốt và một đời an nhiên.<br />
            Em hãy sống theo cách em muốn nhé. Ảnh rất thích điều đó.<br />
            Ảnh đã suy nghĩ rất nhiều để nói ra điều này. Ảnh thương em. Ngoài gia đình thì chưa có ai ảnh thương và tin tưởng như thế.<br />
            Và ảnh cũng biết rằng em cũng thương ảnh lắm. Mãi mãi về sau, ảnh vẫn luôn yêu thương em như vậy.<br />
            Mong em nhớ rằng luôn có người dõi theo em, yêu thương em, ủng hộ em và tin tưởng em vô điều kiện.<br />
            Em hay nói là ảnh hay quên, em yên tâm nhé, ảnh cũng khá hay quên thật ó, nhưng đó là những thứ ảnh cảm thấy ko quan trọng, không cần thiết.<br />
            Chuyện tình của chúng ta mà chuyện mà ảnh quan tâm nhất, đáng nhớ nhất cuộc đời anh.<br />
            Điều anh tự hào và hạnh phúc nhất từ trước tới nay là yêu em, được cạnh em. Ảnh nghĩ rằng sau này cũng vậy đó.<br />
            Mãi thương em!💗<br />
            Iuu
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoveLetter;
