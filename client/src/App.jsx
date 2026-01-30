import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connect to your local backend
const socket = io.connect("http://localhost:5001");

function App() {
  const [ghosts, setGhosts] = useState({ x: 0, y: 0 });
  const [myPos, setMyPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // --- THE TRAP: DOM EVENT LISTENER (Syllabus: DOM Manipulation) ---
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setMyPos({ x: clientX, y: clientY });

      // Send my position to the server
      socket.emit('mouse_move', { x: clientX, y: clientY });
    };

    // --- THE TRAP: SOCKET LISTENER (Syllabus: Async Data Handling) ---
    socket.on('ghost_move', (data) => {
      setGhosts(data);
    });

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      socket.off('ghost_move');
    };
  }, []);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: '#0d0d0d', // Dark Mode
      color: 'white',
      overflow: 'hidden',
      cursor: 'none' // Hide the real cursor for effect
    }}>

      {/* THE HUD (Heads Up Display) */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', fontFamily: 'monospace' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>GHOST-TRACE <span style={{color:'red', animation: 'blink 1s infinite'}}>● REC</span></h1>
        <p style={{ color: '#888' }}>
          Your Pos: {myPos.x}, {myPos.y} <br/>
          Ghost Pos: {ghosts.x}, {ghosts.y}
        </p>
      </div>

      {/* MY CURSOR (Green Ring) */}
      <div style={{
        position: 'absolute',
        left: myPos.x,
        top: myPos.y,
        width: '40px',
        height: '40px',
        border: '2px solid #0f0',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        boxShadow: '0 0 15px #0f0'
      }} />

      {/* GHOST CURSOR (Red Filled Circle) */}
      <div style={{
        position: 'absolute',
        left: ghosts.x,
        top: ghosts.y,
        width: '20px',
        height: '20px',
        background: 'red',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        boxShadow: '0 0 20px red',
        transition: 'left 0.1s linear, top 0.1s linear' // Smooth interpolation
      }} />

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

export default App;