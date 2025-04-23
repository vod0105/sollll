import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import "../styles/LoveLetter.css";
import letterImg from "../assets/images/a1.jpg";

function LoveLetter() {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const [letterContent, setLetterContent] = useState([
    `Bày Đặt gửi My Love 💌,\nIuu em nhiều lắm, nhớ em nhiều lắm❤️.\nMong em luôn vui vẻ và hạnh phúc.\nChúc em luôn bình an, học tập tốt và một đời an nhiên.\nEm hãy sống theo cách em muốn nhé. Ảnh rất thích điều đó.\nẢnh đã suy nghĩ rất nhiều để nói ra điều này. Ảnh thương em. Ngoài gia đình thì chưa có ai ảnh thương và tin tưởng như thế.\nVà ảnh cũng biết rằng em cũng thương ảnh lắm. Mãi mãi về sau, ảnh vẫn luôn yêu thương em như vậy.\nMong em nhớ rằng luôn có người dõi theo em, yêu thương em, ủng hộ em và tin tưởng em vô điều kiện.\nEm hay nói là ảnh hay quên, em yên tâm nhé, ảnh cũng khá hay quên thật ó, nhưng đó là những thứ ảnh cảm thấy ko quan trọng, không cần thiết.\nChuyện tình của chúng ta mà chuyện mà ảnh quan tâm nhất, đáng nhớ nhất cuộc đời anh.\nĐiều anh tự hào và hạnh phúc nhất từ trước tới nay là yêu em, được cạnh em. Ảnh nghĩ rằng sau này cũng vậy đó.\nMãi thương em!💗\nIuu`
  ]);
  const [newLetter, setNewLetter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch letters from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "letters"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreLetters = snapshot.docs.map((doc) => doc.data().content);
        setLetterContent([
          ...firestoreLetters,
          letterContent[0] // Keep default letter at the end
        ]);
      },
      (error) => {
        console.error("Error fetching letters:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Handle saving a new letter
  const handleSaveLetter = async (e) => {
    e.preventDefault();
    if (!newLetter.trim()) return;
    try {
      await addDoc(collection(db, "letters"), {
        content: newLetter,
        uid: "dfjkdfjkdfdjkdjfk", // Replace with actual user ID
        createdAt: new Date(),
      });
      setNewLetter("");
      setIsModalOpen(false);
      console.log("Letter saved successfully");
    } catch (error) {
      console.error("Error saving letter:", error);
    }
  };

  return (
    <div className="loveletter-gradient-bg">
      <button className="backBtn" onClick={() => navigate("/home")}>
        <IoArrowBack size={24} color="#fb7098" /> Back
      </button>
      <div className="loveletter-container">
        <img src={letterImg} alt="Letter illustration" className="loveletter-illustration" />
        <button
          className="loveletter-add-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <FaHeart size={20} color="#f06c92" />
          <span className="loveletter-add-btn-text">Write Letter</span>
        </button>
        {letterContent.map((letter, index) => (
        <div className="loveletter-box">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
            <FaHeart size={32} color="#ee638d" />
          </div>
          <div className="loveletter-title">My Letters</div>
          
            <div key={index} className="loveletter-content">
              {letter.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
              {/* {index < letterContent.length - 1 && <hr className="loveletter-divider" />} */}
            </div>
          
        </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="loveletter-modal-container">
          <div className="loveletter-modal-content">
            <div className="loveletter-modal-title">Write Your Letter</div>
            <textarea
              className="loveletter-caption-input"
              placeholder="Write your heart out..."
              value={newLetter}
              onChange={(e) => setNewLetter(e.target.value)}
            />
            <button
              className="loveletter-save-btn"
              onClick={handleSaveLetter}
            >
              <span className="loveletter-save-btn-text">Save Letter</span>
            </button>
            <button
              className="loveletter-save-btn"
              onClick={() => setIsModalOpen(false)}
            >
              <span className="loveletter-save-btn-text">Cancel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoveLetter;