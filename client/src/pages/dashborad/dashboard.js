import React from "react";
import axios from "axios";

const getUsername = async () => {
    try {
        const response = await axios.get('/getUser', {
            withCredentials: true,
        });
        const isAuthenticated = JSON.stringify(response.data);

        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        return false;
    }
};

const username = await getUsername().then((result) => {
    return result.username;
});


const role = await getUsername().then((result) => {
    return result.role;
});


export default function Dashbaord() {


    return (

        <main className="max-w-3/4 h-full flex  flex-col items-center min-h-screen">
            <div className="container bg-white p-10 rounded-lg   mx-auto flex-col transition-all">
                <div className="grid grid-cols-1 md:grid-cols-3 md:h-16 gap-4 pt-20 p-6">

                    {role === 'admin' ? (
                        <a href="/admin/index" className="bg-white shadow-lg rounded-lg p-4 transition-transform transform-gpu hover:bg-violet-600 cursor-pointer">
                            <p className="text-2xl font-semibold text-violet-600 hover:text-white"> Gestion des utilisateurs </p>
                        </a>
                    ) : null}
                    {username ? (
                        <>
                            <a href="/intern/index" className="bg-white shadow-lg rounded-lg p-4 transition-transform transform-gpu hover:bg-violet-600 cursor-pointer">
                                <p className="text-2xl font-semibold text-violet-600 hover:text-white"> Gestion des Stagaires </p>
                            </a>
                        </>
                    ) : null}
                    {username ? (
                        <>
                            <a href="/projects" className="bg-white shadow-lg rounded-lg p-4 transition-transform transform-gpu hover:bg-violet-600 cursor-pointer">
                                <p className="text-2xl font-semibold text-violet-600 hover:text-white"> Gestion des projects </p>
                            </a>
                        </>
                    ) : null}




                </div>
            </div>
        </main>
    );
}
