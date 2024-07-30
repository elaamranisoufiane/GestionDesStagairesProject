import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Edit() {

    const [registerFirstname, setRegisterFirstname] = useState('');
    const [registerLastname, setRegisterLastname] = useState('');
    const [registerCine, setRegisterCine] = useState('');
    const [registerTel, setRegisterTel] = useState('');

    const [registerProfilePhoto, setRegisterProfilePhoto] = useState('');
    const [registerStartDate, setRegisterStartDate] = useState('');
    const [registerEndDate, setRegisterEndDate] = useState('');
    const [registerRapportAttachement, setRegisterRapoortAttachement] = useState('');
    const [registerProjectAttachement, setRegisterProjectAttachement] = useState('');


    const [registerEmail, setRegisterEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const [oldUserInfo, setOldUserInfo] = useState('');
    const { id } = useParams();


    const [registerProfilePhotoError, setregisterProfilePhotoError] = useState('');
    const [registerStartDateError, setRegisterStartDateError] = useState('');
    const [registerEndDateError, setregisterEndDateError] = useState('');
    const [registerRapportAttachementError, setRegisterRapoortAttachementError] = useState('');
    const [registerProjectAttachementError, setRegisterProjectAttachementError] = useState('');




    useEffect(() => {
        axios.get(`/getInternByNumber/${id}`)
            .then(response => {
                setOldUserInfo(response.data);

                setRegisterFirstname(response.data.firstname);
                setRegisterLastname(response.data.lastname);
                setRegisterCine(response.data.cine);
                setRegisterEmail(response.data.email);
                setRegisterTel(response.data.phoneNumber);
                setRegisterProfilePhoto(response.data.profilePhoto);
                setRegisterStartDate(response.data.dateStart.toString().split('T')[0]);
                setRegisterEndDate(response.data.dateEnd.toString().split('T')[0]);
                setRegisterProjectAttachement(response.data.project);
                setRegisterProjectAttachement(response.data.rapport);
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error fetching item data:', error);
            });

    }, []);


    const [firstnameError, setFirstnameError] = useState("");
    const [lastnameError, setLastnameError] = useState("");
    const [cineError, setCineError] = useState("");
    const [telError, setTelError] = useState("");


    const [emailError, setEmailError] = useState("");
    const [ErrorMessage, setErrorMessage] = useState("");



    const validateForm = () => {
        let isValid = true;

        if (!registerCine.trim()) {
            setCineError("CINE requis.");
            isValid = false;
        } else {
            setCineError("");

        }

        if (!registerStartDate.trim()) {
            setRegisterStartDate("Date de debut de project est requis.");
            isValid = false;
        } else {
            setRegisterStartDate("");
        }

        if (!registerEndDate.trim()) {
            setregisterEndDateError("Date de fin de project est requis.");
            isValid = false;
        } else {
            setregisterEndDateError("");
        }

        if (!registerFirstname.trim()) {
            setFirstnameError("Prénom requis.");
            isValid = false;
        } else {
            setFirstnameError("");

        }

        if (!registerLastname.trim()) {
            setLastnameError("Nom requis.");
            isValid = false;
        } else {
            setLastnameError("");

        }
        if (!registerTel.trim()) {
            setTelError("Numero de Téléphone requis.");
            isValid = false;
        } else {
            setTelError("");

        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
        if (!emailRegex.test(registerEmail)) {
            setEmailError("Invalid email address");
            isValid = false;

        } else {
            setEmailError("");
        }


        return isValid;
    };

    const edit = async () => {
        if (validateForm()) {
            setLoading(true);
            axios({
                method: "post",
                data: {
                    firstname: registerFirstname,
                    lastname: registerLastname,
                    cine: registerCine,
                    email: registerEmail,
                    tel: registerLastname,
                    id: id,
                    dateStart: registerStartDate,
                    dateEnd: registerEndDate,
                    profilePhoto: URL.createObjectURL(registerProfilePhoto),
                    rapport: URL.createObjectURL(registerRapportAttachement),
                    project: URL.createObjectURL(registerProjectAttachement)
                },
                withCredentials: true,
                url: "/editIntern"
            })
                .then(response => {
                    if (response.data.message === 'CINE already exists') {
                        setErrorMessage('Le CINE existe déjà.');
                        setLoading(false);
                    } else if (response.data.message === 'Email already exists') {
                        setErrorMessage('L\'adresse e-mail existe déjà.');
                        setLoading(false);
                    } else {
                        window.location.href = '/intern/index';
                        setLoading(false);
                    }

                    setLoading(false);
                })
                .catch(error => {
                    console.error("Edit failed:", error);
                    setLoading(false);
                });
        }
    }




    return (

        <body className="flex justify-center h-auto min-h-screen my-11">
            <div>
                <div className="bg-white p-8 rounded-lg shadow-lg w-auto h-auto" >
                    <div>
                        <h1 className="my-6 text-center text-3xl font-extrabold text-gray-900 mb-5"> Modifier {oldUserInfo.firstname} {oldUserInfo.lastname}</h1>

                    </div>
                    {ErrorMessage && (
                        <p className="text-red-500 text-sm mt-2">{ErrorMessage}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                        <div className="mt-4 rounded-md shadow-sm -space-y-px grid grid-cols-1 gap-2">
                            <div className="flex flex-col items-center justify-items-center">

                                {registerProfilePhoto ? (
                                    <div className="relative group">
                                        <img
                                            src={registerProfilePhoto}
                                            alt="Profile Preview"
                                            className="w-64 h-64 rounded-full object-cover group-hover:bg-slate-500 group-hover:opacity-30"
                                        />

                                        <div className="absolute top-1/3 left-28 opacity-0 group-hover:opacity-100">
                                            <button onClick={e => setRegisterProfilePhoto(null)}>
                                                <svg
                                                    viewBox="0 0 1024 1024"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="#ffffff"
                                                    className="w-11 h-11 hover:w-12 hover:h-12"
                                                >
                                                    <path
                                                        fill="#64748b"
                                                        d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"
                                                    ></path>
                                                </svg>
                                            </button>

                                            <label for="profilePhoto" className="cursor-pointer">

                                                <svg className="w-11 h-11 hover:w-12 hover:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17H17.01M15.6 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H8.4M12 15V4M12 4L15 7M12 4L9 7" stroke="#64748b" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

                                                <input
                                                    id="profilePhoto"
                                                    name="profilePhoto"
                                                    type="file"
                                                    accept="image/*"
                                                    required
                                                    className="hidden"
                                                    onChange={e => setRegisterProfilePhoto(e.target.files[0])}
                                                />
                                            </label>
                                        </div>
                                        <p className="text-red-500 text-xs">{registerProfilePhotoError}</p>

                                    </div>
                                ) : (
                                    <label for="profilePhoto" class="flex flex-col items-center justify-center w-64 h-64 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50  hover:bg-gray-100">
                                        <div class="rounded-full flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                                        </div>
                                        <input
                                            id="profilePhoto"
                                            name="profilePhoto"
                                            type="file"
                                            accept="image/*"
                                            required
                                            className="hidden"
                                            onChange={e => setRegisterProfilePhoto(e.target.files[0])}
                                        />
                                    </label>

                                )}

                            </div>
                        </div>

                        <div className="mt-4 rounded-md shadow-sm -space-y-px grid grid-cols-1 gap-2 w-auto md:w-96">

                            <div>
                                <input
                                    id="firstname"
                                    name="firstname"
                                    type="text"
                                    required
                                    value={registerFirstname}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  rounded-t-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Prénom"
                                    onChange={e => setRegisterFirstname(e.target.value)}
                                />
                                <p className="text-red-500 text-xs">{firstnameError}</p>
                            </div>

                            <div>
                                <input
                                    id="lastname"
                                    name="lastname"
                                    type="text"
                                    required
                                    value={registerLastname}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Nom"
                                    onChange={e => setRegisterLastname(e.target.value)}
                                />
                                <p className="text-red-500 text-xs">{lastnameError}</p>
                            </div>

                            <div>
                                <input
                                    id="cine"
                                    name="cine"
                                    type="text"
                                    required
                                    value={registerCine}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="CINE"
                                    onChange={e => setRegisterCine(e.target.value)}
                                />
                                <p className="text-red-500 text-xs">{cineError}</p>
                            </div>

                            <div className="items-center mt-4">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={registerEmail}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email"
                                    onChange={e => setRegisterEmail(e.target.value)}
                                />
                                <p className="text-red-500 text-xs">{emailError}</p>
                            </div>



                            <div>
                                <input
                                    id="tel"
                                    name="tel"
                                    type="text"
                                    required
                                    value={registerTel}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  rounded-b-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Téléphone"
                                    onChange={e => setRegisterTel(e.target.value)}
                                />
                                <p className="text-red-500 text-xs">{telError}</p>
                            </div>

                            <div>
                                <label htmlFor="startDate" className="sr-only">Date de début du stage</label>
                                <input
                                    id="startDate"
                                    name="startDate"
                                    type="date"
                                    required
                                    value={registerStartDate}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Date de début du stage"
                                    onChange={e => setRegisterStartDate(e.target.value)}
                                />
                                <p className="text-red-500 text-xs">{registerStartDateError}</p>

                            </div>

                            <div>
                                <label htmlFor="endDate" className="sr-only">Date de fin du stage</label>
                                <input
                                    id="endDate"
                                    name="endDate"
                                    type="date"
                                    required
                                    value={registerEndDate}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Date de fin du stage"
                                    onChange={e => setRegisterEndDate(e.target.value)}
                                />
                                <p className="text-red-500 text-xs">{registerEndDateError}</p>

                            </div>


                            <div>
                                <label for="reportAttachment" class="flex items-center p-4 gap-3 rounded-3xl border border-gray-300 border-dashed bg-gray-50 cursor-pointer">
                                    <img class="h-16 w-auto" src="https://demo.tailus.io/images/icons/upload.webp" alt="" />.
                                    <div class="space-y-2">
                                        <h4 class="text-base font-semibold text-gray-700">Importer le rapport </h4>
                                        {registerRapportAttachement ? (
                                            <span className="text-sm text-gray-600">{registerRapportAttachement.name}</span>
                                        ) : (
                                            <span class="text-sm text-gray-500">Attachement de rapport</span>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="reportAttachment"
                                        name="reportAttachment"
                                        accept=".doc,.docx,.tex,.pdf"
                                        hidden
                                        onChange={e => setRegisterRapoortAttachement(e.target.files[0])} />

                                </label>
                                <p className="text-red-500 text-xs">{registerRapportAttachementError}</p>

                            </div>

                            <div>

                                <label for="projectAttachment" class="flex items-center p-4 gap-3 rounded-3xl border border-gray-300 border-dashed bg-gray-50 cursor-pointer">
                                    <img class="h-16 w-auto" src="https://demo.tailus.io/images/icons/upload.webp" alt="" />.
                                    <div class="space-y-2">
                                        <h4 class="text-base font-semibold text-gray-700">Importer le projet</h4>
                                        {registerProjectAttachement ? (
                                            <span className="text-sm text-gray-600">{registerProjectAttachement.name}</span>
                                        ) : (
                                            <span class="text-sm text-gray-500">Attachement de projet</span>
                                        )}
                                    </div>
                                    <input type="file" id="projectAttachment" name="projectAttachment" accept=".rar,.zip,.js,.html,.php,.css" hidden onChange={e => setRegisterProjectAttachement(e.target.files[0])} />

                                </label>
                                <p className="text-red-500 text-xs">{registerProjectAttachementError}</p>

                            </div>




                        </div>
                    </div>

                    <div className="items-center mt-4">


                        {loading ? (
                            <button
                                type=""
                                disabled={loading}
                                className="  mt-4 w-full  items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-violet-200 focus:shadow-outline focus:outline-none bg-violet-500 rounded"
                            >
                                <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin  fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                type=""
                                disabled={loading}
                                onClick={edit}
                                className="mt-4 w-full  items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-violet-200 focus:shadow-outline focus:outline-none bg-violet-500 rounded"
                            >
                                Modifier
                            </button>
                        )}


                    </div>


                </div>
            </div>
            <style>{`

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
       
      `}</style>
        </body >
    );
}
