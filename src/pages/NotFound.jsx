import React from 'react';

function NotFoundPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
                <p className="text-2xl mt-4">
                    <span className="text-red-500">Oops!</span> Page not found.
                </p>
                <p className="mt-2 text-lg text-gray-600">The page you’re looking for doesn’t exist.</p>
                <a href="index.html" className="mt-6 inline-block px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition">
                    Go Home
                </a>
            </div>
        </div>
    );
}

export default NotFoundPage;
