import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const SERVER_PORT = 4000;

const LIGHTBOX_URL = `https://uat.hpp.converge.eu.elavonaws.com/client/library.js`;

declare global {
  interface Window {
    ElavonLightbox: any;
  }
}

const useExternalScriptHook = (url: string) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true; // Use async loading
    document.body.appendChild(script); // Append to the body or head

    return () => {
      // Cleanup function: remove the script when the component unmounts
      document.body.removeChild(script);
    };
  }, [url]); // Re-run effect if the URL changes
};

const Home = () => {
  const [lightbox, setLightbox] = useState<any>(null);

  const navigate = useNavigate();

  // <!-- Step 1. Include the Lightbox JS library -->
  useExternalScriptHook(LIGHTBOX_URL);

  async function getPaymentSession() {
    try {
      const response = await axios.get(
        `http://localhost:${SERVER_PORT}/payment-session`,
      );
      const sessionId = response.data;
      return sessionId;
    } catch (error) {
      console.error("Error starting payment session:", error);
      alert(`There was an error starting the payment session: ${error}`);
    }
  }

  const redirectToSuccessPage = () => {
    navigate("/success", { replace: true });
  };

  const submitData = (data: any) => {
    redirectToSuccessPage();
  };

  async function onClickHandler() {
    const sessionId = await getPaymentSession();

    // <!-- Step 3. Use the lightbox JS library -->
    if (!lightbox) {
      const MessageTypes = window.ElavonLightbox.MessageTypes;

      const lightboxObj = new window.ElavonLightbox({
        sessionId: sessionId,
        onReady: (error: any) =>
          error ? console.error("Lightbox failed to load") : lightboxObj.show(),
        messageHandler: (message: any, defaultAction: any) => {
          switch (message.type) {
            case MessageTypes.transactionCreated:
              submitData({
                sessionId: message.sessionId,
                transaction: message.transaction,
                authorized: message.isAuthorized,
              });
              break;
            case MessageTypes.hostedCardCreated:
              submitData({
                sessionId: message.sessionId,
                hostedCardId: message.hostedCard,
              });
              break;
            case MessageTypes.error:
              console.error("An error occurred:", message.error);
              break;
          }
          defaultAction();
        },
      });
      setLightbox(lightboxObj);
    } else {
      lightbox.show();
    }
  }

  return (
    // <!-- Step 2. Create an order summary -->
    <div className="payment-form">
      <div className="form-group">
        <h2>Order Summary</h2>
        <img src="/sock.png" alt="Socks" />
        <div className="description">
          <h3>Order total: $12.00</h3>
        </div>
      </div>
      <div className="span-checkout">
        <button className="button" onClick={onClickHandler}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Home;
