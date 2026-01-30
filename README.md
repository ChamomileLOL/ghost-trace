# GHOST-TRACE: Real-Time Telemetry System

**A low-latency, distributed WebSocket application that synchronizes user input coordinates across devices over the public internet.**

### 🔴 [View Live Demo](https://ghost-trace-kappa.vercel.app)
*(Note: Since this is hosted on a free Render tier, the server may take 30-50 seconds to 'wake up' on the first load. Watch for the 'ONLINE' indicator.)*

---

## ⚡ Key Features

* **Real-Time Synchronization:** Sub-100ms latency using bidirectional WebSocket communication.
* **Cross-Device Input:** seamless mapping of Mobile Touch events (`touchmove`) to Desktop Cursor coordinates (`mousemove`).
* **Connection State Management:** Visual feedback system (`CONNECTING` vs `ONLINE`) to handle serverless cold starts.
* **Latency Compensation:** CSS linear interpolation to smooth out packet jitter for the 'Ghost' cursor.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite
* **Backend:** Node.js, Express
* **Communication:** Socket.io (WebSockets)
* **Database:** MongoDB (Atlas)
* **Deployment:** * **Client:** Vercel (CI/CD)
    * **Server:** Render (Auto-Deploy)

---

## 🧠 Engineering Challenges Solved

### 1. The "Serverless Cold Start" Problem
**Challenge:** Free-tier hosting puts the backend to sleep after inactivity, causing the frontend to look broken.
**Solution:** Implemented a 'Heartbeat' listener on the client. The UI explicitly shows a `🔴 CONNECTING...` state until the WebSocket handshake completes, improving User Experience (UX) rather than leaving the user in the dark.

### 2. Mobile-to-Desktop Mapping
**Challenge:** Mobile devices use `touch` events while desktops use `mouse` events.
**Solution:** Created a unified event handler in React that detects the input method and normalizes the `(x, y)` coordinates before broadcasting them to the server.

### 3. Production Port Conflicts
**Challenge:** Local environments run on port `5001`, but cloud providers dynamically assign ports.
**Solution:** Implemented environment variable injection (`process.env.PORT || 5001`) to ensure the server binds correctly in any environment.

---

## 🚀 How to Run Locally

If you want to run the ghost in your own machine:

**1. Clone the Repository**

git clone [https://github.com/YOUR_USERNAME/ghost-trace.git](https://github.com/YOUR_USERNAME/ghost-trace.git)
cd ghost-trace
2. Setup Backend


cd server
npm install
# Create a .env file with your MONGO_URI if needed, or run locally
node index.js
3. Setup Frontend


# Open a new terminal
cd client
npm install
npm run dev

Open the link on your Desktop.

Open the same link on your Smartphone.

Move your finger on your phone -> Watch the dot move on your Desktop.

Author: XAVIER MOORKATTIL 


---

![alt text](output.png)