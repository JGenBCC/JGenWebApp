import { handleRedirectResult } from './lib/firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

// ...existing code...

async function initApp() {
    // ...existing initialization code...

    // Handle the redirect result
   /* try {
        const user = await handleRedirectResult();
        if (user) {
            toast.success(`User signed in: ${user.email}`);
        }
    } catch (error) {
        toast.error("Error during redirect handling");
        console.error("Error during redirect handling:", error);
    }*/

    // ...existing code...
}

function App() {
    useEffect(() => {
        initApp();
    }, []);

    return (
        <>
            {/* ...existing components... */}
            <ToastContainer />
        </>
    );
}

// Render the App component
ReactDOM.render(<App />, document.getElementById('root'));
