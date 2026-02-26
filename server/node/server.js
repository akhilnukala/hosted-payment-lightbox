const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());

const CLIENT_PORT = 3000;
const SERVER_PORT = 4000;
const BASE_URL = `https://uat.api.converge.eu.elavonaws.com`;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  proxy: false,
});

// Step 1. Enter credentials
const MERCHANT_ALIAS = process.env.MERCHANT_ALIAS || "";
const SECRET_KEY = process.env.SECRET_KEY || "";
const credentials = `${MERCHANT_ALIAS}:${SECRET_KEY}`;
const encodedCreds = Buffer.from(credentials).toString("base64");

// Step 2. Create an order
const createOrder = async () => {
  const requestBody = {
    //Step 3. Enter product info and amount
    total: {
      amount: "12.00",
      currencyCode: "USD",
    },
  };

  const orderRequest = {
    method: "post",
    url: `/orders`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${encodedCreds}`,
    },
    data: requestBody,
  };

  try {
    const response = await axiosClient(orderRequest);
    const orderID = response.data?.id;
    return orderID;
  } catch (error) {
    console.error("Error creating order:", error.message);
    throw error;
  }
};

// Step 4. Create a payment session
app.get("/payment-session", async (req, res) => {
  if (!MERCHANT_ALIAS || !SECRET_KEY) {
    console.error("Merchant credentials are not set in .env file.");
    return res
      .status(500)
      .json({ message: "Merchant credentials are not set in .env file." });
  }

  try {
    const orderID = await createOrder();

    // Step 5. Enter navigation URLs
    const requestBody = {
      order: orderID,
      originUrl: `http://localhost:${CLIENT_PORT}/`,
      hppType: "lightbox",
      doCreateTransaction: "false",
    };

    const paymentSessionRequest = {
      method: "post",
      url: `/payment-sessions`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCreds}`,
      },
      data: requestBody,
    };

    // Step 6. Redirect to the URL from the response
    const response = await axiosClient(paymentSessionRequest);
    res.json(response.data.id);
  } catch (error) {
    console.error("Error creating payment session:", error.message);
    res.status(500).json({ message: "Failed to create payment session." });
  }
});

app.listen(SERVER_PORT, () =>
  console.log(`Server running on port ${SERVER_PORT}`),
);
