/*"use client";

import React, { useEffect, useRef } from 'react';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { auth } from '../lib/firebase/firebase';

export const Auth = () => {
    const uiRef = useRef<firebaseui.auth.AuthUI | null>(null);

    useEffect(() => {
        if (!uiRef.current) {
            const uiConfig = {
                signInOptions: [
                    {
                        provider: 'google.com',
                    },
                ],
                signInFlow: 'popup',
                callbacks: {
                    signInSuccessWithAuthResult: () => {
                        return false;
                    },
                },
                credentialHelper: firebaseui.auth.CredentialHelper.NONE,
            };

            const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
            ui.start('#firebaseui-auth-container', uiConfig);
            uiRef.current = ui;
        }

        return () => {
            if (uiRef.current) {
                uiRef.current.delete();
            }
        };
    }, []);

    return (
        <div id="firebaseui-auth-container"></div>
    );
};
*/