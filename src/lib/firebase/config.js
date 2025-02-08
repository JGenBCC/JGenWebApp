export const config = {
  apiKey: "AIzaSyBVihl3qr_pRU7x5yCJL5V_zxBIhfswCgo",
  authDomain: "jgenwebapp.firebaseapp.com",
  projectId: "jgenwebapp",
  storageBucket: "jgenwebapp.firebasestorage.app",
  messagingSenderId: "453561510234",
  appId: "1:453561510234:web:61f8d2db95153708c52b63",
  measurementId: "G-BMK9PKBXHE"
};

// When deployed, there are quotes that need to be stripped
Object.keys(config).forEach((key) => {
  const configValue = config[key] + "";
  if (configValue.charAt(0) === '"') {
    config[key] = configValue.substring(1, configValue.length - 1);
  }
});

export const firebaseConfig = config;
