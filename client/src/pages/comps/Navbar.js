import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
// import moment from 'moment';


//get user details
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

//get user name 
const username = await getUsername().then((result) => {
    return result.username;
});

//get user prigvilige 
const role = await getUsername().then((result) => {
    return result.role;
});


// Call logout 
const handleLogout = () => {
    axios.get('/logout', { withCredentials: true })
        .then(res => {
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
};




let credits = null;

export default function NavBar() {
    const [plans, setPlans] = useState([]);
    const [plansPayment, setPlansPayment] = useState([]);

    useEffect(() => {
        const getPlans = async () => {
            try {
                const response = await axios.get('/api/getAllProductss', {
                    withCredentials: true,
                });
                setPlans(response.data);
            } catch (error) {
                console.error("Login failed:", error);
            }
        };

        getPlans();
    }, []);

    useEffect(() => {
        const getPlansPayment = async () => {
            try {
                const response = await axios.get('/api/getAllProductsspayment', {
                    withCredentials: true,
                });
                setPlansPayment(response.data);
            } catch (error) {
                console.error("Login failed:", error);
            }
        };

        getPlansPayment();
    }, []);


    //dispaly the user name
    const [showProfile, setShowProfile] = useState(false);
    const [open, setOpen] = useState(false);
    const [showTools, setShowTools] = useState(false);

    useEffect(() => {
        getUsername().then(result => {
            if (result) {
                credits = result.credits;
            }
        });
    }, []);



    const toolsButtonRef = useRef(null);
    const profileButtonRef = useRef(null);
    const menuButtonRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (toolsButtonRef.current && !toolsButtonRef.current.contains(event.target)) {
                setShowTools(false);
            }
        };

        const handleOutsideClickProfile = (event) => {
            if (profileButtonRef.current && !profileButtonRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };

        const handleOutsideClickMenu = (event) => {
            if (menuButtonRef.current && !menuButtonRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('click', handleOutsideClickProfile);
        document.addEventListener('click', handleOutsideClickMenu);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
            document.removeEventListener('click', handleOutsideClickProfile);
            document.removeEventListener('click', handleOutsideClickMenu);
        };
    });




    return (
        <>
            <nav className="p-4 m-4 md:pl-20 mr-0">
                <div className="container mx-auto flex justify-between items-center">

                    <a className="inline-flex items-center text-black-800 font-bold gap-2.5 text-xl md:text-2xl" href="/dashboard">
                        <span className="">Gestion Des Stagraires</span>
                    </a>
                    <nav className="hidden lg:flex gap-12">


                        {role == 'admin' ? (
                            <a className="hover:text-violet-500 active:text-violet-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/admin/index">Gestion des utilisateurs</a>
                        ) : null}

                        {username ? (
                            <a className="hover:text-violet-500 active:text-violet-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/intern/index">Gestion des stagaires</a>
                        ) : null}

                        {username ? (
                            <a className="hover:text-violet-500 active:text-violet-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/projects">Gestion des projects</a>
                        ) : null}

                        {/* {username ? (
                            <div className='relative'>
                                <a className="hover:text-violet-500 active:text-violet-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal cursor-pointer" ref={toolsButtonRef} onClick={() => setShowTools(!showTools)}>Tools</a>
                                {showTools ? (
                                    <ul className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-300 mt-1 py-2 px-3 rounded shadow-md z-50 w-52">
                                        <li>
                                            <a className="hover:text-violet-500 active:text-violet-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/remove-background-pro">Liste des stagiaires</a>
                                        </li>
                                    </ul>
                                ) : null}
                            </div>

                        ) :
                            null
                        } */}



                    </nav>




                    {!username ? (
                        <a className="items-center hidden md:inline-flex justify-center h-12 px-6 text-xs md:text-md md:font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded" href="/Login">Login</a>
                    ) :
                        <div>

                            <div className="cursor-pointer relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full" ref={profileButtonRef} onClick={() => setShowProfile(!showProfile)}>
                                <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                            </div>


                            <div className="z-10 relative">
                                {showProfile ? (
                                    <ul className="absolute right-0 text-gray-900 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg">
                                        <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <span className="text-violet-900 font-bold hover:text-gray-200" >
                                                Bienvenue {username}
                                            </span>
                                        </li>

                                        {username ? (
                                            <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                                <a href='/profile' className="">Profile</a>
                                            </li>
                                        ) : null}




                                        {username ? (
                                            <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                                <button onClick={handleLogout} >Logout </button>
                                            </li>
                                        ) : null}

                                    </ul>
                                ) : null}
                            </div>
                        </div>}



                    <div className="z-10 relative md:absolute md:right-1">
                        <button
                            className="block lg:hidden w-10 h-10 rounded-md bg-gray-200"
                            onClick={() => setOpen(!open)}
                            ref={menuButtonRef}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 m-auto" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {open && (
                            <ul className="lg:hidden absolute right-0 text-gray-900 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg">
                                <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                    <a href="/">Home</a>
                                </li>


                                {role == 'admin' ? (
                                    <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">

                                        <a className="" href="/admin/index">Gestion  des utilisateurs</a>
                                    </li>
                                ) : null}


                                {username ? (
                                    <>
                                        <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <a className="" href="/remove-background-pro">Liste des stagaires</a>
                                        </li>

                                    </>
                                ) : null}

                            </ul>
                        )}
                    </div>
                </div >
            </nav >



        </>



    );
}

