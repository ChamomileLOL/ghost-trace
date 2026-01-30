import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// TRAP: Your Render Backend URL
const socket = io.connect("https://ghost-trace.onrender.com");

function App() {
  const [ghosts, setGhosts] = useState({ x: 0, y: 0 });
  const [myPos, setMyPos] = useState({ x: 0, y: 0 });
  const [status, setStatus] = useState("🔴 CONNECTING..."); // Connection Status

  useEffect(() => {
    // 1. Connection Monitoring (So you know when Server Wakes Up)
    socket.on('connect', () => setStatus("🟢 ONLINE (GHOST ACTIVE)"));
    socket.on('disconnect', () => setStatus("🔴 DISCONNECTED"));

    // 2. Universal Tracker (Mouse + Touch)
    const handleMove = (x, y) => {
      setMyPos({ x, y });
      socket.emit('mouse_move', { x, y });
    };

    // Mouse Handler
    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);

    // Touch Handler (For Phones)
    const handleTouchMove = (e) => {
      // Prevent scrolling while drawing
      // e.preventDefault(); 
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    socket.on('ghost_move', (data) => {
      setGhosts(data);
    });

    // Attach Listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      socket.off('ghost_move');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div style={{
      height: '100vh', width: '100vw', background: '#0d0d0d', color: 'white', overflow: 'hidden',
      touchAction: 'none' // DISAABLES SCROLLING ON PHONE (Important!)
    }}>
      
      {/* STATUS HUD */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', fontFamily: 'monospace', zIndex: 100 }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>GHOST-TRACE</h1>
        <p style={{ fontSize: '12px', fontWeight: 'bold' }}>{status}</p>
        <p style={{ color: '#888', fontSize: '10px' }}>
          My: {Math.round(myPos.x)}, {Math.round(myPos.y)} <br/>
          Ghost: {Math.round(ghosts.x)}, {Math.round(ghosts.y)}
        </p>
      </div>

      {/* MY CURSOR (Green) */}
      <div style={{
        position: 'absolute', left: myPos.x, top: myPos.y,
        width: '30px', height: '30px',
        border: '2px solid #0f0', borderRadius: '50%',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none'
      }} />

      {/* GHOST CURSOR (Red) */}
      <div style={{
        position: 'absolute', left: ghosts.x, top: ghosts.y,
        width: '20px', height: '20px', background: 'red', borderRadius: '50%',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
        boxShadow: '0 0 20px red',
        transition: 'all 0.1s linear'
      }} />
    </div>
  );
}

export default App;