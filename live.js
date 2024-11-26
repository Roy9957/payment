import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDeoS_Px31_c1F7ph05MrpCqPdvou4TDbw",
  authDomain: "payment-48193.firebaseapp.com",
  databaseURL: "https://payment-48193-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "payment-48193",
  storageBucket: "payment-48193.firebasestorage.app",
  messagingSenderId: "233832319655",
  appId: "1:233832319655:web:31bb818afbad9fb4e56982"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Extract the paymentId from the URL
const urlParams = new URLSearchParams(window.location.search);
const paymentId = urlParams.get('paymentId');

// Check payment status in Firebase
const paymentRef = ref(database, 'payments/' + paymentId);
const statusMessage = document.getElementById('statusMessage');
const statusIcon = document.getElementById('statusIcon');
const userDetails = document.getElementById('userDetails');
const phone = document.getElementById('phone');
const transactionId = document.getElementById('transactionId');
const amount = document.getElementById('amount');

// Check if payment status is updated
get(paymentRef).then((snapshot) => {
  if (snapshot.exists()) {
    const paymentData = snapshot.val();
    const status = paymentData.status;

    // Display user details
    phone.textContent = paymentData.phone || "Not Provided";
    transactionId.textContent = paymentData.transactionId || "Not Provided";
    amount.textContent = paymentData.amount || "Not Provided";

    // If the status is "Done", change icon color to green and update the message
    if (status === 'Done') {
      statusMessage.textContent = 'Payment done!';
      statusMessage.className = 'message done';
      statusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
      statusIcon.className = 'icon done';
    }
    // If the status is "no" or any other incomplete status, show error message
    else if (status === 'No' || status === 'E') {
      statusMessage.textContent = 'Payment failed.';
      statusMessage.className = 'message error';
      statusIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
      statusIcon.className = 'icon error';
    }
    // If still continuing, keep the loading icon and red color
    else {
      statusMessage.textContent = 'Payment is continuing...';
      statusMessage.className = 'message continuing';
      statusIcon.innerHTML = '<i class="fas fa-spinner"></i>';
      statusIcon.className = 'icon spinner';
    }
  } else {
    statusMessage.textContent = 'No payment found!';
    statusMessage.className = 'message error';
    statusIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    statusIcon.className = 'icon error';
  }
}).catch((error) => {
  statusMessage.textContent = 'Error fetching payment status.';
  statusMessage.className = 'message error';
  statusIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
  statusIcon.className = 'icon error';
  console.error(error);
});