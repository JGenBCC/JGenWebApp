'use client';

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";

const app = initializeApp(firebaseConfig);

export default app;
