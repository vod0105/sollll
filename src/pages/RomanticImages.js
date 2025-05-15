import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoAddCircle } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { initializeApp } from "firebase/app";
import {
  collection,
  addDoc,
  getDocs,
  getFirestore,
  query,
  orderBy,
  serverTimestamp,
  limit,
  startAfter,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useSwipeable } from "react-swipeable"; // Import react-swipeable
import "../styles/RomanticImages.css";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAF-Zl66s8BgAGT1K7iQFmrAHCLXHOUvXc",
  authDomain: "iuusoll.firebaseapp.com",
  projectId: "iuusoll",
  storageBucket: "iuusoll.firebasestorage.app",
  messagingSenderId: "61733282252",
  appId: "1:61733282252:web:80f2ad60b8ed694f6ffd69",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Initial static images with timestamps
const initialRomanticImages = [
  {
    id: "initial-0",
    imageBase64: require("../assets/images/a2.jpg"),
    caption: "Dễ thương góa, iuu emm nhiều 🌹",
    createdAt: new Date("2025-04-20T08:00:00Z"),
    uid: "static",
  },
  {
    id: "initial-1",
    imageBase64: require("../assets/images/a3.jpg"),
    caption: "Tình cờ được ngồi cạnh em.",
    createdAt: new Date("2025-04-20T09:00:00Z"),
    uid: "static",
  },
  {
    id: "initial-2",
    imageBase64: require("../assets/images/a4.jpg"),
    caption: "Gái xinh đi đá bóng >>.",
    createdAt: new Date("2025-04-20T10:00:00Z"),
    uid: "static",
  },
  {
    id: "initial-3",
    imageBase64: require("../assets/images/a5.jpg"),
    caption: "Eiuu tổ quốc, zì tổ quốc có em đó.😍",
    createdAt: new Date("2025-04-20T11:00:00Z"),
    uid: "static",
  },
  {
    id: "initial-4",
    imageBase64: require("../assets/images/a6.jpg"),
    caption: "Dễ thương quá trời!",
    createdAt: new Date("2025-04-20T12:00:00Z"),
    uid: "static",
  },
  {
    id: "initial-5",
    imageBase64: require("../assets/images/a1.jpg"),
    caption: "Iuu emm lắm, nhớ em nhiều.",
    createdAt: new Date("2025-04-20T13:00:00Z"),
    uid: "static",
  },
];

function RomanticImages() {
  const navigate = useNavigate();
  const [images, setImages] = useState(initialRomanticImages);
  const [modalVisible, setModalVisible] = useState(false);
  const [newImageBase64, setNewImageBase64] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [captionInput, setCaptionInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [zoomModalVisible, setZoomModalVisible] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(-1); // Track current image index
  const [isConnected, setIsConnected] = useState(navigator.onLine);

  // Format timestamp for display
  const formatDate = (date) => {
    if (!date) return "Unknown date";
    const jsDate = date instanceof Date ? date : date.toDate ? date.toDate() : new Date(date.seconds * 1000);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(jsDate);
  };

  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => {
      setIsConnected(false);
      setError("No internet connection. Showing local images.");
      setLoading(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Sign in anonymously
    signInAnonymously(auth).catch((error) => {
      console.error("Anonymous auth failed:", error);
    });

    // Fetch images
    const fetchImages = async () => {
      setLoading(true);
      if (!navigator.onLine) {
        setError("No internet connection. Showing local images.");
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "romantic_images"),
        orderBy("createdAt", "desc"),
        limit(20)
      );
      try {
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt // Firestore timestamp
        }));
        setImages([...list, ...initialRomanticImages]);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error("Fetch images error:", error);
        setImages(initialRomanticImages);
        setLoading(false);
        setError("Failed to fetch images.");
      }
    };

    fetchImages();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadMoreImages = async () => {
    if (!lastDoc || !isConnected) return;
    setLoading(true);

    const q = query(
      collection(db, "romantic_images"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(20)
    );
    try {
      const querySnapshot = await getDocs(q);
      const newImages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt
      }));
      setImages((prev) => [...prev, ...newImages]);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setLoading(false);
    } catch (error) {
      console.error("Load more error:", error);
      setError("Failed to load more images.");
      setLoading(false);
    }
  };

  const handleImagePick = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageBase64(reader.result);
        setNewImagePreview(reader.result);
        setModalVisible(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToFirebase = async (base64Image, caption) => {
    if (!isConnected) {
      alert("No internet connection. Cannot upload images while offline.");
      return false;
    }

    try {
      setUploading(true);
      await addDoc(collection(db, "romantic_images"), {
        imageBase64: base64Image,
        caption: caption,
        createdAt: serverTimestamp(),
        uid: "kdsjfksdjf",
      });

      setUploading(false);
      return true;
    } catch (error) {
      console.error("Upload failed: Do dung lượng ảnh quá lớn");
      alert("Upload failed: Do dung lượng ảnh quá lớn, vui lòng nén ảnh hoặc dùng ảnh khác.");
      setUploading(false);
      return false;
    }
  };

  const handleAddImage = async () => {
    if (newImageBase64 && captionInput.trim() !== "") {
      const ok = await uploadToFirebase(newImageBase64, captionInput.trim());
      if (ok) {
        setNewImageBase64(null);
        setNewImagePreview(null);
        setCaptionInput("");
        setModalVisible(false);
        // Refresh images
        const q = query(
          collection(db, "romantic_images"),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        try {
          const querySnapshot = await getDocs(q);
          const list = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt
          }));
          setImages([...list, ...initialRomanticImages]);
          setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } catch (error) {
          console.error("Error refreshing images:", error);
          setError("Failed to refresh images.");
        }
      }
    }
  };

  const handleZoom = (img, index) => {
    setZoomImage(img);
    setCurrentImageIndex(index); // Set the current image index
    setZoomModalVisible(true);
  };

  // Swipe handlers for navigating images
  const handleSwipe = (direction) => {
    if (direction === "Left" && currentImageIndex < images.length - 1) {
      // Swipe left -> next image
      setCurrentImageIndex((prev) => prev + 1);
      setZoomImage(images[currentImageIndex + 1]);
    } else if (direction === "Right" && currentImageIndex > 0) {
      // Swipe right -> previous image
      setCurrentImageIndex((prev) => prev - 1);
      setZoomImage(images[currentImageIndex - 1]);
    } else if (direction === "Up" && currentImageIndex < images.length - 1) {
      // Swipe up -> next image
      setCurrentImageIndex((prev) => prev + 1);
      setZoomImage(images[currentImageIndex + 1]);
    } else if (direction === "Down" && currentImageIndex > 0) {
      // Swipe down -> previous image
      setCurrentImageIndex((prev) => prev - 1);
      setZoomImage(images[currentImageIndex - 1]);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("Left"),
    onSwipedRight: () => handleSwipe("Right"),
    onSwipedUp: () => handleSwipe("Up"),
    onSwipedDown: () => handleSwipe("Down"),
    trackMouse: true, // Optional: allows mouse drag to simulate swipe
    delta: 10, // Minimum distance for a swipe
  });

  return (
    <div className="romantic-gradient-bg">
      <div className="container">
        <button className="backBtn" onClick={() => navigate("/home")}>
          <IoArrowBack size={24} color="#fb7098" /> Back
        </button>
        <h1 className="romantic-heading">Romantic Moments</h1>
        <button className="addImageBtn" onClick={() => document.getElementById("imageInput").click()}>
          <IoAddCircle size={28} color="#f06c92" /> Add Image
        </button>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImagePick}
        />

        {uploading && (
          <div className="loading">
            <CircularProgress style={{ color: "#fb7098" }} />
            <span>Uploading image...</span>
          </div>
        )}

        {loading && !uploading && (
          <div className="loading">
            <CircularProgress style={{ color: "#fb7098" }} />
            <span>Loading images...</span>
          </div>
        )}

        {error && !loading && (
          <div className="error">
            <span>{error}</span>
            <button
              onClick={async () => {
                setLoading(true);
                setError(null);
                if (!navigator.onLine) {
                  setError("No internet connection. Showing local images.");
                  setLoading(false);
                  return;
                }
                const q = query(
                  collection(db, "romantic_images"),
                  orderBy("createdAt", "desc"),
                  limit(20)
                );
                try {
                  const querySnapshot = await getDocs(q);
                  const list = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt
                  }));
                  setImages([...list, ...initialRomanticImages]);
                  setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
                  setLoading(false);
                  setError(null);
                } catch (error) {
                  setImages(initialRomanticImages);
                  setLoading(false);
                  setError("Failed to fetch images.");
                }
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && (
          <div className="image-grid">
            {images.length === 0 ? (
              <div className="no-images">
                <FaHeart size={31} color="#ffb5c7" />
                <span>No romantic moments yet.</span>
                <span>Add your first romantic image!</span>
              </div>
            ) : (
              images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="feed-card"
                  onClick={() => handleZoom(img, idx)} // Pass index to handleZoom
                >
                  <img
                    src={img.uid === "static" ? img.imageBase64 : img.imageBase64}
                    alt="Romantic"
                    className="feed-image"
                  />
                  <div className="caption-bar">
                    <FaHeart size={17} color="#fb7098" />
                    <span className="feed-caption">
                      {img.caption || <span className="no-caption">No caption</span>}
                    </span>
                  </div>
                  <div className="image-timestamp">
                    {formatDate(img.createdAt)}
                  </div>
                </div>
              ))
            )}
            {lastDoc && (
              <button className="load-more" onClick={loadMoreImages}>
                Load More
              </button>
            )}
          </div>
        )}

        {/* Modal for adding new image */}
        <Modal
          open={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setNewImageBase64(null);
            setNewImagePreview(null);
          }}
        >
          <div className="modal-content">
            <h2>Write a caption for your photo</h2>
            {newImagePreview && (
              <img src={newImagePreview} alt="Preview" className="preview-image" />
            )}
            <TextField
              placeholder="Type something romantic..."
              multiline
              rows={4}
              value={captionInput}
              onChange={(e) => setCaptionInput(e.target.value)}
              className="caption-input"
              variant="outlined"
            />
            <Button
              variant="contained"
              className="save-caption-btn"
              onClick={handleAddImage}
              disabled={captionInput.trim() === ""}
            >
              Save
            </Button>
            <Button
              className="cancel-btn"
              onClick={() => {
                setModalVisible(false);
                setNewImageBase64(null);
                setNewImagePreview(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </Modal>

        {/* Modal for zooming image */}
        <Modal
          open={zoomModalVisible}
          onClose={() => setZoomModalVisible(false)}
        >
          <div className="zoom-modal" {...swipeHandlers}> {/* Add swipe handlers */}
            <button
              className="zoom-close-btn"
              onClick={() => setZoomModalVisible(false)}
            >
              ✕
            </button>
            {zoomImage && (
              <>
                <img
                  src={
                    zoomImage.uid === "static"
                      ? zoomImage.imageBase64
                      : zoomImage.imageBase64
                  }
                  alt="Zoomed"
                  className="zoom-image"
                />
                {zoomImage.caption && (
                  <div className="zoom-caption-bar">
                    <FaHeart size={18} color="#ffb5c7" />
                    <span className="zoom-caption-text">{zoomImage.caption}</span>
                  </div>
                )}
              </>
            )}
            {/* Navigation arrows for additional UX */}
            {/* <button
              className="zoom-nav-btn zoom-prev-btn"
              onClick={() => handleSwipe("Right")}
              disabled={currentImageIndex <= 0}
            >
              ←
            </button>
            <button
              className="zoom-nav-btn zoom-next-btn"
              onClick={() => handleSwipe("Left")}
              disabled={currentImageIndex >= images.length - 1}
            >
              →
            </button> */}
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default RomanticImages;