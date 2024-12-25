import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/game');
  };

  return (
    <div style={styles.homeContainer}>
      <h1 style={styles.title}>Welcome to Spacecraft Fighter!</h1>
      <p style={styles.description}>
        Enhance Your Hand-Eye Coordination and Motor Control with Every Move! This game is specially designed to help individuals with Cerebral Palsy (CP) improve motor coordination in a fun and accessible way.
      </p>
      <div style={styles.textContainer}>
        <h2 style={styles.sectionTitle}>How to Play:</h2>
        <p style={styles.text}>
          <strong>Use Your Hand for Control:</strong> The game uses hand gestures to control the spacecraft. Simply move your hand left and right, and especially your index finger, to steer your spacecraft and avoid obstacles. Make sure only one hand is within the camera frame to ensure smooth gameplay.
        </p>
        <p style={styles.text}>
          <strong>Avoid Asteroids:</strong> As the game progresses, asteroids (space obstacles) will fall towards your spacecraft. Use your hand to guide the spacecraft left and right to dodge these obstacles.
        </p>
        <p style={styles.text}>
          <strong>Boost Your Skills:</strong> Each successful dodge helps you improve your hand-eye coordination and reaction time. The more you play, the sharper your skills become!
        </p>

        <h2 style={styles.sectionTitle}>Why Play?</h2>
        <p style={styles.text}>
          <strong>Motor Control Improvement:</strong> This game is designed to help you enhance your fine motor control. By moving your hand and finger to control the spacecraft, you engage and strengthen the muscles responsible for precision movements.
        </p>
        <p style={styles.text}>
          <strong>Hand-Eye Coordination:</strong> The more you play, the better your hand-eye coordination becomes, helping you react quicker and more accurately to changing conditions in your environment.
        </p>
        <p style={styles.text}>
          <strong>Fun and Engaging:</strong> Who says therapy can’t be fun? Spacecraft Fighter is not only a tool for improving your skills, but it's also a thrilling, space-themed game that makes rehabilitation enjoyable.
        </p>

        <h2 style={styles.sectionTitle}>Features:</h2>
        <ul style={styles.featureList}>
          <li style={styles.text}><strong>Track Your Score:</strong> The game keeps track of your score, allowing you to challenge yourself and improve with each playthrough. See how long you can survive and how high you can score!</li>
          <li style={styles.text}><strong>Compete with Yourself:</strong> Each time you play, aim to beat your previous score. Challenge yourself to improve and keep pushing your limits for better hand-eye coordination and motor control.</li>
          <li style={styles.text}><strong>Therapeutic Fun:</strong> A game that combines entertainment with rehabilitation – perfect for improving fine motor skills in a fun, stress-free environment.</li>
        </ul>

        <h2 style={styles.sectionTitle}>Designed for Everyone:</h2>
        <p style={styles.text}>
          Whether you're looking to improve motor control, practice hand-eye coordination, or just have fun, Spacecraft Fighter provides an accessible, interactive experience for people of all abilities. It’s particularly helpful for those with CP who want to work on their movement and coordination in an enjoyable way.
        </p>

        <h2 style={styles.sectionTitle}>Start Playing Today!</h2>
        <p style={styles.text}>
          Ready to embark on your journey to better coordination and motor control? Grab your hand and let’s start dodging those asteroids! With every move, you’re improving your skills – one gesture at a time. And don't forget – each time you play, you have the chance to beat your last score!
        </p>
      </div>
      <button style={styles.button} onClick={startGame}>
        Start Game
      </button>

      {/* Developer Info Card */}
      <div style={styles.developerCard}>
        <p style={styles.developerText}>Developer: Rishabh Singh Rajput</p>
        <p style={styles.developerText}>For feedback, please reach out:</p>
        <p style={styles.developerText}>
          <a href="mailto:rishabhsinghrajput081@gmail.com" style={styles.link}>rishabhsinghrajput081@gmail.com</a>
        </p>
        <p style={styles.developerText}>
          <a href="https://www.linkedin.com/in/rishabh-singh-rajput-569828203/" target="_blank" rel="noopener noreferrer" style={styles.link}>LinkedIn</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  homeContainer: {
    textAlign: 'center',
    padding: '50px',
    backgroundColor: '#87cefa',
    backgroundImage: 'url(/homepage.gif)',  // Reference to the homepage.gif in the public folder
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    overflowY: 'auto', // Allow scrolling when content overflows
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  description: {
    fontSize: '22px',
    marginTop: '20px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
  },
  textContainer: {
    maxWidth: '800px',
    textAlign: 'left',
    marginTop: '30px',
    paddingRight: '20px', // Prevents text from hitting the screen edges
    overflowY: 'auto', // Enable scrolling for content
    maxHeight: '70vh', // Limit height to 70% of the viewport height
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginTop: '30px',
    textDecoration: 'underline',
  },
  text: {
    fontSize: '22px',
    lineHeight: '1.8',
    marginTop: '10px',
  },
  featureList: {
    listStyleType: 'disc',
    marginLeft: '40px',
    textAlign: 'left',
  },
  button: {
    marginTop: '40px',
    padding: '12px 30px',
    fontSize: '18px',
    backgroundColor: '#ff6347',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  // Developer Info Card Styles
  developerCard: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '15px',
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    maxWidth: '200px',
  },
  developerText: {
    marginBottom: '10px',
    fontSize: '14px',
  },
  link: {
    color: '#ff6347',
    textDecoration: 'none',
  },
};

export default HomePage;
