import React from 'react';
import { Helmet } from 'react-helmet';

function EmailVerifiedPage() {
    return (

        <body className=" flex justify-center h-screen mt-11">
            <div className="bg-white p-8 rounded-lg shadow-lg w-auto h-60" >
                <div>
                    <h1 className="mt-2 mb-3 text-center text-3xl font-extrabold text-gray-900">Email Verified Successfully</h1>
                </div>


                <p className="text-gray-700 mb-4">Your email address has been successfully verified.</p>
                <button
                    className="bg-violet-500 hover:bg-violet-200 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => window.location.href = '/login'}
                >
                    Go to Login page
                </button>
            </div>
        </body>
    );
}

export default EmailVerifiedPage;
