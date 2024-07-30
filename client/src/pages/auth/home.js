//'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';

import imageHome from "../../assets/welcome-bg.svg"

const Home = () => {


    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [SuccessMessage, setSuccessMessage] = useState('');
    const [loadingModel, setLoadingModel] = useState(false);
    const [ShowRestPasswordModel, setShowRestPasswordModel] = useState(false);


    const handleResetPassword = async (e) => {
        setLoadingModel(true);

        axios({
            method: "post",
            data: {
                email: email,
            },
            withCredentials: true,
            url: "/forgot-password"
        })
            .then(response => {
                setMessage('');
                setSuccessMessage("Veuillez vérifier votre e-mail.");
                setLoadingModel(false);
            })
            .catch(error => {
                setSuccessMessage('');
                setMessage(error.response.data.message);
                setLoadingModel(false);
            });


    };


    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sendLinkloading, setSendLinkloading] = useState(false);

    const [showEmailVerificationModel, setShowEmailVerificationModel] = useState(null);
    const [emailToverify, setEmailToverify] = useState('');
    const [successSendingLink, setSuccessSendingLink] = useState(false);
    const [errorSendingLink, setErrorSendingLink] = useState(false);


    const validateEmailForm = () => {
        let isValid = true;

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
        if (!emailRegex.test(emailToverify)) {
            setErrorSendingLink("Adresse e-mail invalide.");
            isValid = false;

        } else {
            setErrorSendingLink("");
        }
        return isValid;
    }

    const handleSubmitsEmailToverify = () => {
        if (validateEmailForm()) {
            setSuccessSendingLink('');
            setErrorSendingLink('');
            setSendLinkloading(true);
            axios({
                method: "post",
                data: {
                    email: emailToverify,
                },
                withCredentials: true,
                url: "/send-verification-link"
            })
                .then(response => {
                    setSendLinkloading(false);
                    if (response.data.message == true) {
                        setSuccessSendingLink("Veuillez vérifier votre e-mail.");
                    } else {
                        setErrorSendingLink("E-mail non disponible pour vérification.");
                    }
                })
                .catch((error) => {
                    setSendLinkloading(false);
                    setErrorSendingLink('Error: ' + error.message);
                })
                .finally(() => {
                    setEmailToverify('');
                });
        }
    };



    const validateForm = () => {
        let isValid = true;

        if (!loginUsername.trim()) {
            setUsernameError('Nom d\'utilisateur requis');
            isValid = false;
        } else {
            setUsernameError('');
        }

        if (!loginPassword.trim()) {
            setPasswordError('Mot de passe requis');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    //const navigate = useNavigate();

    const handleLogin = () => {
        if (validateForm()) {
            setLoading(true);
            axios({
                method: 'post',
                data: {
                    username: loginUsername,
                    password: loginPassword,
                },
                withCredentials: true,
                url: '/login',
            })
                .then((response) => {
                    //navigate('/dashboard');
                    localStorage.setItem('authenticated', 'true');
                    setLoading(false);
                    window.location.href = '/dashboard';

                })
                .catch((error) => {
                    setLoginError('Échec de la connexion. Veuillez vérifier votre identifiant et votre mot de passe, ou vérifier votre adresse e-mail.');
                    setLoading(false);
                    console.error('Login failed:', error);
                });

        }
    };


    //go to top of the page button
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };


    const videoRef = useRef(null);
    const [play, setPlay] = useState(false);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setPlay(true);
                } else {
                    setPlay(false);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, options);

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    return (

        <>
            <Helmet>
                <title>Gestion Des Stagraires - préfecture d'Es-Smara</title>
                <meta name="description" content="AI Image Editing Tools - Background Generator, Background Removal, Image Upscaler and Restore Image for your photos." />
            </Helmet>

            <main className="max-w-3/4 h-full flex flex-col items-center min-h-screen">
                <div className="container grid grid-cols-1 md:grid-cols-2 h-screen">

                    {/* Left Side */}
                    <div className='bg-inherit flex items-center justify-center pt-40 md:pt-0 z-10'>
                        <div className="bg-white p-8 rounded-lg shadow-lg w-96 h-auto" >
                            <div>
                                <h1 className="mt-2 text-center text-3xl font-extrabold text-gray-900">Login</h1>
                            </div>

                            <div className="mt-4 rounded-md shadow-sm -space-y-px grid grid-cols-1 gap-2">
                                {loginError && <p className="text-red-500 text-sm mt-2">{loginError}</p>}
                                <div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Identifiant"
                                        onChange={(e) => setLoginUsername(e.target.value)}
                                    />
                                    <p className="text-red-500 text-xs">{usernameError}</p>
                                </div>
                                <div className="gap-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Mot de passe"
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                    />
                                    <p className="text-red-500 text-xs">{passwordError}</p>
                                </div>
                            </div>
                            <div>

                                {loading ? (
                                    <button type=""
                                        className="mt-4 w-full items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-violet-200 focus:shadow-outline focus:outline-none bg-violet-500 rounded">
                                        <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-violet-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button type=""
                                        onClick={handleLogin} className="mt-4 w-full  items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-violet-200 focus:shadow-outline focus:outline-none bg-violet-500 rounded">
                                        Se connecter
                                    </button>
                                )}


                            </div>


                            <a
                                onClick={(e) => setShowRestPasswordModel(true)}
                                className="text-violet-500 hover:text-violet-700 text-sm float-left cursor-pointer mt-4"
                            >
                                Mot de passe oublié?
                            </a>

                            <a
                                onClick={() => { setShowEmailVerificationModel(true) }}
                                className="text-violet-500 hover:text-violet-700 text-sm float-right cursor-pointer mt-4"
                            >
                                Vérifiez votre e-mail
                            </a>

                        </div>
 
                    </div>

                    {/* Right Side */}
                    <div className="bg-violet-500  flex flex-col items-start justify-start h-screen p-8 text-white absolute md:relative z-0">
                        <div className="text-left z-10">
                            <h2 className="text-3xl font-bold mb-4">
                                Bienvenue dans votre espace privé,
                            </h2>
                            <p className="text-lg">
                                Un système d'information intégré qui permet la gestion des Stagiaires.
                            </p>
                        </div>

                        <div className="flex justify-center items-center w-full absolute z-0 md:mt-10 opacity-25 md:opacity-100 md:relative">
                            <img src={imageHome} alt="Home Image" className="max-w-full" />
                        </div>
                    </div>



                </div>
            </main>


            <button
                className={`${isVisible ? 'block' : 'hidden'
                    } fixed bottom-4 right-4 p-4 bg-violet-200 hover:bg-violet-500 text-white font-semibold rounded-full  text-xl flex items-center justify-center`}
                onClick={scrollToTop}
            >
             <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier"  strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="#000000"  strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>






            {ShowRestPasswordModel ? (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg w-auto">
                        <div className=" items-start justify-between p-4 rounded-t border-gray-600">
                            <div className="flex justify-end">
                                <button id="closeModelButton" onClick={(e) => setShowRestPasswordModel(false)} type="button" className="text-gray-900 bg-transparent  hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 ">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"  strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6">
                                    </path></svg><span className="sr-only">Close</span>
                                </button>
                            </div>
 
                            <h2 className="text-2xl font-bold mb-4">Entrez l'e-mail de votre compte</h2>

                        </div>
                        <div className='min-h-10 '>
                            {message && <p className="text-red-500 text-sm mt-2">{message}</p>}
                            {SuccessMessage && <p className="text-green-500 text-sm mt-2">{SuccessMessage}</p>}
                        </div>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="mt-2 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {loadingModel ? (
                            <button type=""
                                className="mt-4 w-full items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-violet-200 focus:shadow-outline focus:outline-none bg-violet-500 rounded">
                                <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-violet-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            </button>
                        ) : (
                            <button type=""
                                onClick={handleResetPassword} className="mt-4 w-full  items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-violet-200 focus:shadow-outline focus:outline-none bg-violet-500 rounded">
                                Réinitialiser
                            </button>
                        )}





                    </div>

                </div>
            ) : null
            }




            {showEmailVerificationModel ? (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg w-96">

                        <div className="flex justify-end">
                            <button
                                onClick={() => { setShowEmailVerificationModel(false) }}
                                className="text-gray-400 hover:text-gray-500"
                                aria-label="Close"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold mb-4">Vérification de l'E-mail</h2>
                        {errorSendingLink && <p className="text-red-500 text-sm mt-2">{errorSendingLink}</p>}
                        {successSendingLink && <p className="text-green-500 text-sm mt-2">{successSendingLink}</p>}
                        <div className="mb-4">

                            <input
                                type="email"
                                id="emailToverify"
                                name="emailToverify"
                                value={emailToverify}
                                onChange={(e) => setEmailToverify(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Entrer votre Email"
                                required
                            />
                        </div>




                        {sendLinkloading ? (
                            <button type=""
                                className="mt-4 w-full  items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-violet-200 focus:shadow-outline focus:outline-none bg-violet-500 rounded">
                                <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-violet-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            </button>
                        ) : (
                            <button type=""
                                onClick={handleSubmitsEmailToverify}
                                className="mt-4 w-full  items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-violet-200 focus:shadow-outline focus:outline-none bg-violet-500 rounded">
                                Vérifiez l'e-mail
                            </button>
                        )}



                    </div>
                </div>
            ) : null
            }





        </>
    );

};
export default Home; 