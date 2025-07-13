const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const menu = {
  poha: 20, upma: 20, chai: 10, samosa: 20, sandwich: 20,
  vadapav: 20, breadbutter: 15, patties: 20, coffee: 20, biscuits: 10
};

let queue = [];

function calculateWaitTime(queue, newItem) {
  let totalWaitTime = 0;
  for (const order of queue) {
    const time = ["chai", "coffee", "breadbutter"].includes(order.foodItem) ? 1 : 2;
    totalWaitTime += time;
  }
  const servingTime = ["chai", "coffee", "breadbutter"].includes(newItem) ? 1 : 2;
  return totalWaitTime + servingTime;
}

app.get("/", (req, res) => {
  res.send("🎉 Canteen API is running!");
});


app.get("/menu", (req, res) => {
  res.json(menu);
});


app.post("/order", (req, res) => {
  const { customerName, foodItem } = req.body;
  const item = foodItem.toLowerCase();

  if (!menu[item]) {
    return res.status(400).json({ error: "Invalid food item" });
  }

  const waitTime = calculateWaitTime(queue, item);
  const price = menu[item];

  const order = {
    customerName,
    foodItem: item,
    price,
    waitTime
  };

  queue.push(order);
  res.json({ message: "Order placed!", order });
});


app.post("/serve", (req, res) => {
  if (queue.length === 0) {
    return res.json({ message: "No pending orders to serve." });
  }

  const order = queue.shift();
  res.json({
    message: `Serving ${order.customerName}'s ${order.foodItem}`,
    price: order.price,
    waitTime: order.waitTime
  });
});


app.get("/queue", (req, res) => {
  res.json(queue);
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
