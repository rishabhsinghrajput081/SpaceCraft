import React, { useEffect, useRef, useState } from "react";
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import Confetti from "react-confetti";

const GamePage = () => {
  const [balloonPosition, setBalloonPosition] = useState({ x: 0, y: 0 });
  const [handDetected, setHandDetected] = useState(false);
  const [message, setMessage] = useState("");
  const [confetti, setConfetti] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const videoRef = useRef(null);
  const [handModel, setHandModel] = useState(null);

  const targetWidth = 50;
  const targetHeight = 50;
  const obstacleWidth = 50;
  const obstacleHeight = 50;

  // Array for different asteroid images
  const asteroidImages = [
    "/asteroid1.png", // Type 1
    "/asteroid2.png", // Type 2
    "/asteroid3.png", // Type 3
    "/asteroid4.png", // Type 4
  ];
  const gameStartSound = new Audio("/sounds/gamegoing.mp3");
  const collisionSound = new Audio("/sounds/blast.mp3");

  const [collisionSoundPlayed, setCollisionSoundPlayed] = useState(false);

  const startGameSound = () => {
    gameStartSound
      .play()
      .then(() => {
        console.log("Sound played");
      })
      .catch((error) => {
        console.error("Failed to play sound:", error);
      });
  };


  useEffect(() => {
    const setupTensorFlow = async () => {
      await tf.ready();
      console.log("TensorFlow.js ready");
      const model = await handpose.load();
      console.log("Handpose model loaded");
      setHandModel(model);
    };
    setupTensorFlow();
  }, []);

  useEffect(() => {
    const startVideoStream = async () => {
      try {
        const video = videoRef.current;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        video.srcObject = stream;

        video.onloadedmetadata = () => {
          video.play();
        };
      } catch (error) {
        console.error("Error accessing video stream:", error);
      }
    };
    startVideoStream();
  }, []);

  useEffect(() => {
    if (handModel && !gameOver) {
      const detectHandGesture = async () => {
        if (
          videoRef.current &&
          videoRef.current.readyState === 4 &&
          videoRef.current.videoWidth > 0 &&
          videoRef.current.videoHeight > 0
        ) {
          const predictions = await handModel.estimateHands(videoRef.current);

          if (predictions.length > 0) {
            const prediction = predictions[0]; // Take the first hand detected
            if (prediction.landmarks && prediction.landmarks.length > 0) {
              setHandDetected(true); // Set to true only if landmarks are detected
              trackIndexFinger(prediction.landmarks);
            } else {
              setHandDetected(false);
              setMessage("");
            }
          } else {
            setHandDetected(false);
            setMessage("");
          }
        }
        requestAnimationFrame(detectHandGesture);
      };
      detectHandGesture();
    }
  }, [handModel, gameOver]);

  const trackIndexFinger = (landmarks) => {
    const indexFinger = landmarks[8]; // Index finger tip

    if (indexFinger) {
      const flippedX = window.innerWidth - indexFinger[0]; // Mirror the X-axis

      const centerY = window.innerHeight / 2;
      const maxX = window.innerWidth / 2 - 50;

      const newX = Math.min(
        Math.max(flippedX - 25, window.innerWidth / 2 - maxX),
        window.innerWidth / 2 + maxX
      );
      const newY = centerY;

      setBalloonPosition({
        x: newX,
        y: newY,
      });
    }
  };

  useEffect(() => {
    if (!gameOver) {
      let lastObstacleTime = Date.now();
      const obstacleIntervalTime = 5000; // Create new obstacle every 5 seconds
  
      const createObstacle = () => {
        const now = Date.now();
        if (now - lastObstacleTime > obstacleIntervalTime) {
          const leftLimit = window.innerWidth / 2;
          const rightLimit = window.innerWidth - obstacleWidth;
          const randomX = Math.floor(Math.random() * (rightLimit - leftLimit)) + leftLimit;
          const obstacleY = -obstacleHeight;
  
          // Randomly choose one of the 4 asteroid images
          const randomImageType = Math.floor(Math.random() * asteroidImages.length);
  
          setObstacles((prevObstacles) => [
            ...prevObstacles,
            { x: randomX, y: obstacleY, imageType: randomImageType },
          ]);
          lastObstacleTime = now;
        }
      };
  
      // Continuously check and create obstacles
      const gameLoop = () => {
        createObstacle();
        requestAnimationFrame(gameLoop);
      };
  
      gameLoop();
  
      return () => cancelAnimationFrame(gameLoop);
    }
  }, [gameOver]);
  
  useEffect(() => {
    if (!gameOver) {
      const moveObstacles = () => {
        setObstacles((prevObstacles) =>
          prevObstacles
            .map((obstacle) => ({ ...obstacle, y: obstacle.y + 10 })) // Adjust the speed here
            .filter((obstacle) => obstacle.y < window.innerHeight)
        );
      };
  
      const moveInterval = setInterval(moveObstacles, 5); // ~60 FPS
      return () => clearInterval(moveInterval);
    }
  }, [gameOver]);

  useEffect(() => {
    const checkCollision = () => {
      obstacles.forEach((obstacle) => {
        if (
          balloonPosition.x < obstacle.x + obstacleWidth &&
          balloonPosition.x + targetWidth > obstacle.x &&
          balloonPosition.y < obstacle.y + obstacleHeight &&
          balloonPosition.y + targetHeight > obstacle.y
        ) {
          if (!gameStartSound.paused) {
            gameStartSound.pause();
            gameStartSound.currentTime = 0; // Reset playback to the start
          }
          if (!collisionSoundPlayed) {
            collisionSound.play()
              .then(() => {
                console.log("Collision sound played");
              })
              .catch((error) => {
                console.error("Failed to play collision sound:", error);
              });
  
            // Set the flag to true to prevent the sound from playing again
            setCollisionSoundPlayed(true);
          }
  
          setMessage("Game Over!");
          setConfetti(true);
          setGameOver(true);
        }
      });
    };

    checkCollision();
  }, [balloonPosition, obstacles, collisionSoundPlayed]);

  useEffect(() => {
    if (!gameOver) {
      const scoreInterval = setInterval(() => {
        setScore((prevScore) => prevScore + 1);
      }, 2000);

      return () => clearInterval(scoreInterval);
    }
  }, [gameOver]);

  const restartGame = () => {
    startGameSound();
    
    setBalloonPosition({ x: 0, y: 0 });
    setObstacles([]);
    setMessage("");
    setConfetti(false);
    setGameOver(false);
    setScore(0);
    setCollisionSoundPlayed(false);
  };
  useEffect(() => {
    gameStartSound.load();
  }, []);

  return (
    <div
      className="game-container"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#87CEEB", // Optional fallback color if the image doesn't load
        backgroundImage: "url('/background.png')", // Path to your background image in the public folder
        backgroundSize: "cover", // Ensures the background image covers the entire container
        backgroundPosition: "center", // Centers the background image
        backgroundRepeat: "no-repeat", // Prevents repeating the background image
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "white" }}>SpaceCraft fighter</h1>
    <p style={{ color: "white" }}>Place your hand in the webcam's frame and at a proper distance. Once the message appears, you're ready to play!</p>
    <button
        onClick={startGameSound}
        style={{
          position: "absolute",
          top: "5%",
          left: "5%",
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Play Sound
      </button>
    

      {handDetected && (
  <div
    style={{
      position: "absolute",
      top: "20%",
      left: "10%",
      display: "flex",
      alignItems: "center",
    }}
  >
    <p
      style={{
        color: "green",
        fontSize: "50px",
        marginRight: "10px", // Space between the text and the image
      }}
    >
      Hand Detected
    </p>
    <img
      src="/hand.png" // Image from the public folder
      alt="Hand"
      style={{
        width: "400px", // You can adjust the size
        height: "200px",
      }}
    />
  </div>
)}

      {!gameOver && (
        <p
          style={{
            color: "white",
            fontSize: "24px",
            position: "absolute",
            top: "10%",
            left: "10%",
          }}
        >
          Score: {score}
        </p>
      )}

      {message && (
        <div
          style={{
            color: "red",
            fontSize: "30px",
            position: "absolute",
            top: "30%",
            left: "10%",
          }}
        >
          {message} <br />
          
        </div>
      )}

      {gameOver && (
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "10%",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "white",
              fontSize: "24px",
              marginBottom: "10px",
            }}
          >
            Final Score: {score}
          </p>
          
          <button
            onClick={restartGame}
            style={{
              padding: "10px 20px",
              fontSize: "20px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Restart Game
          </button>
        </div>
      )}

      <video
        ref={videoRef}
        style={{
          display: "none",
        }}
        autoPlay
        playsInline
      ></video>

      {balloonPosition && (
        <div
          style={{
            position: "absolute",
            left: balloonPosition.x,
            top: balloonPosition.y,
            backgroundImage: "url('/spacecraft.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            width: "100px",
            height: "100px",
            zIndex: 1,
          }}
        />
      )}

      {obstacles.map((obstacle, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: obstacle.x,
            top: obstacle.y,
            backgroundImage: `url(${asteroidImages[obstacle.imageType]})`,
            backgroundSize: "contain", // Keep the aspect ratio intact
            backgroundRepeat: "no-repeat",
            width: obstacleWidth * 2, // Increase size
            height: obstacleHeight * 2, // Increase size
            zIndex: 0,
          }}
        />
      ))}

      {confetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
          gravity={0.3}
          recycle={false}
        />
      )}
    </div>
  );
};

export default GamePage;
