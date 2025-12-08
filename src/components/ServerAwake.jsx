import React, { useState, useEffect } from 'react';

const ServerAwake = ({ children }) => {
    const [status, setStatus] = useState('checking');
    const [timeLeft, setTimeLeft] = useState(90);

    useEffect(() => {
        const checkServer = async () => {
            try {
                const serverUrl = import.meta.env.VITE_SERVER_URL;
                if (!serverUrl) {
                    console.error("VITE_SERVER_URL is not defined");
                }

                const baseUrl = serverUrl ? serverUrl.replace(/\/$/, "") : "";
                if (!baseUrl) {

                    console.warn("No VITE_SERVER_URL found.");

                }

                const url = baseUrl ? `${baseUrl}/api/status` : '/api/status';

                const res = await fetch(url);

                if (res.ok) {
                    setStatus('ready');
                }
            } catch (error) {

            }
        };

        // Initial check
        checkServer();

        const interval = setInterval(() => {
            if (status !== 'ready') {
                checkServer();
                setTimeLeft((prev) => prev - 2);
            }
        }, 2000);

        const timeout = setTimeout(() => {
            if (status !== 'ready') {
                setStatus('error');
                clearInterval(interval);
            }
        }, 90000); // 90 seconds

        if (status === 'ready') {
            clearInterval(interval);
            clearTimeout(timeout);
        }

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [status]);

    if (status === 'ready') {
        return <>{children}</>;
    }

    if (status === 'error') {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-zinc-900 text-white p-4 text-center">
                <div className="flex flex-col items-center gap-4 max-w-md">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-red-500">Server Unavailable</h2>
                    <p className="text-zinc-400">
                        The server took too long to respond. It might be down or undergoing maintenance.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-zinc-900 text-white bg-opacity-95 fixed inset-0 z-50">
            <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700">
                <div className="relative">
                    {/* Simple SVG Spinner */}
                    <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <h2 className="text-xl font-semibold tracking-wide">Waking up Server...</h2>
                <p className="text-sm text-zinc-500 max-w-xs text-center">
                    This may take up to a minute
                    <br />
                    <span className="text-xs opacity-70">Remaining time: ~{timeLeft}s</span>
                </p>
            </div>
        </div>
    );
};

export default ServerAwake;
