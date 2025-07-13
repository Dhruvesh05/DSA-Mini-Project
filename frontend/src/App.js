import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'https://canteen-backend-i995.onrender.com';

function App() {
  const [menu, setMenu] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [queue, setQueue] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMenu();
    fetchQueue();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_BASE}/menu`);
      setMenu(res.data);
    } catch (err) {
      console.error("Error fetching menu:", err);
      setMessage("❌ Failed to load menu.");
    }
  };

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`${API_BASE}/queue`);
      setQueue(res.data);
    } catch (err) {
      console.error("Error fetching queue:", err);
      setMessage("❌ Failed to load queue.");
    }
  };

  const placeOrder = async () => {
    if (!customerName || !selectedItem) {
      setMessage("⚠️ Please enter your name and select a food item.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/order`, {
        customerName,
        foodItem: selectedItem
      });

      const order = res.data.order;
      setMessage(`✅ Order placed: ${order.foodItem} for ₹${order.price}`);
      fetchQueue();
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.error || "Error placing order"));
    }
  };

  const serveOrder = async () => {
    try {
      const res = await axios.post(`${API_BASE}/serve`);
      setMessage(res.data.message + (res.data.price ? ` | Total: ₹${res.data.price}` : ''));
      fetchQueue();
    } catch (err) {
      setMessage("❌ Error serving order");
    }
  };

  return (
    <div className="App" style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>🍽 Canteen Ordering System</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 10 }}
      />

      <select
        value={selectedItem}
        onChange={(e) => setSelectedItem(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 10 }}
      >
        <option value="">-- Select Food Item --</option>
        {menu && Object.entries(menu).map(([key, item]) => (
          <option key={key} value={item.name}>
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)} - ₹{item.price}
          </option>
        ))}
      </select>

      <button onClick={placeOrder} style={{ padding: 10, width: "100%", marginBottom: 10 }}>
        ✅ Place Order
      </button>

      <button onClick={serveOrder} style={{ padding: 10, width: "100%", marginBottom: 20 }}>
        🍽 Serve Next Order
      </button>

      {message && <p><strong>{message}</strong></p>}

      <h3>📋 Pending Orders</h3>
      {queue.length === 0 ? (
        <p>No pending orders.</p>
      ) : (
        <ul style={{ paddingLeft: 20 }}>
          {queue.map((order, index) => (
            <li key={index} style={{ marginBottom: 5 }}>
              {order.customerName} - {order.foodItem} <span style={{ marginLeft: 10, color: 'gray' }}>ETA: {order.waitTime} mins</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
