
import React, { useState, useEffect } from 'react';
import axios from 'axios';



const ITEMS_PER_PAGE = 10;


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


const role = await getUsername().then((result) => {
    return result.role;
});



const Intern = () => {
    const [interns, setInterns] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const [searchSentence, setSearchSentence] = useState("");

    const [searchSubs, setSearchSubs] = useState(-1);
    const [searchStatus, setSearchStatus] = useState(-1);





    const handleSearchSubsChange = (e) => {
        setSearchSubs(e.target.value);
    };

    const handleSearchStatusChange = (e) => {
        setSearchStatus(e.target.value);
    };

    const getAllInterns = async () => {
        try {
            const response = await axios.get(`/getAllInterns?page=${currentPage}&querySearch=${searchSentence}&statusActive=${searchStatus}&statusSubscription=${searchSubs}`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching interns:", error);
            return [];
        }
    };

    const getMaxPages1 = async () => {
        try {
            const response = await axios.get('/getTotalinterns', {
                withCredentials: true,
            });
            const totalinterns = response.data;
            const calculatedMaxPages = Math.ceil(totalinterns / ITEMS_PER_PAGE);
            setMaxPages(calculatedMaxPages);
        } catch (error) {
            console.error("Error fetching total interns:", error);
        }
    };

    useEffect(() => {
        getAllInterns().then((result) => {
            setInterns(result);
        });
        //setCurrentPage(1);
        getMaxPages1();
    }, [currentPage]);

    //////////////
    const handleSearchSubmit = (event) => {
        getAllInterns().then((result) => {
            setInterns(result);
        });
        setCurrentPage(1);
        getMaxPages1();
    };

    //delete user 
    const deleteUser = (userId) => {
        axios.delete(`/deleteIntern/${userId}`)
            .then((response) => {

                getAllInterns().then((result) => {
                    setInterns(result);
                });
                generatePageNumbers();
                getMaxPages1();

            })
            .catch((error) => {
                console.error('Error deleting item', error);
            });
    };



    const generatePageNumbers = () => {
        const pageNumbers = [];
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(maxPages, currentPage + 1);


        if (currentPage > 2) {
            pageNumbers.push(
                <li key="min" className="mr-2">
                    <button
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300  hover:bg-gray-100 hover:text-gray-700 "
                    >
                        ...
                    </button>
                </li>
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li key={i} className="mr-2">
                    <a
                        onClick={() => setCurrentPage(i)}
                        className={`cursor-pointer flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border ${currentPage === i
                            ? 'bg-violet-500'
                            : 'bg-gray-300'
                            } hover:bg-gray-100 hover:text-gray-700 `}
                    >
                        {`${i}`}
                    </a>
                </li>
            );
        }

        if (currentPage < (maxPages - 1)) {
            pageNumbers.push(
                <li key="max" className="mr-2">
                    <button
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300  hover:bg-gray-100 hover:text-gray-700 "
                    >
                        ...
                    </button>
                </li>
            );
        }

        return pageNumbers;
    };


    return (
        <main className="max-w-3/4 h-full flex  flex-col items-center min-h-screen">
            <div className="container bg-white p-10 rounded-lg   mx-auto flex-col">
                <h2 className="text-2xl font-semibold"> Gestion des stagaires </h2>

                <div className="bg-white p-4 rounded-lg">
                    <div className="grid grid-cols-1 gap-4">

                        <div className="md:p-4 rounded-lg md:flex-auto">
                            {role === 'user' || role === 'admin' ? (
                                <span className="float-left mt-2">
                                    <button className="font-bold py-2 px-4 roundedmt-4  items-center  tracking-wide text-white transition duration-200 shadow-md hover:bg-violet-200 focus:shadow-outline focus:outline-none bg-violet-500 rounded"
                                        onClick={() => window.location.href = `/intern/add`}>
                                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier"    ></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="#1C274C" strokeWidth="1.5"></path> <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#1C274C" strokeWidth="1.5"  ></path> </g></svg>
                                    </button>
                                </span>
                            ) : null}


                            <div className="flex-auto md:float-right md:inline-flex">
                                <div className='flex'>
                                    <select
                                        id="searchSubs"
                                        name="searchSubs"
                                        className="border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-900 m-2 mb-2"
                                        value={searchSubs}
                                        onChange={handleSearchSubsChange}
                                    >
                                        <option value="-1" >Option</option>
                                        <option value="0">Option1</option>
                                        <option value="1">Option2</option>
                                    </select>

                                    <select
                                        id="searchStatus"
                                        name="searchStatus"
                                        className="border m-2 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-900 mt-2 mb-2 "
                                        value={searchStatus}
                                        onChange={handleSearchStatusChange}
                                    >
                                        <option value="-1">option</option>
                                        <option value="0">Option1</option>
                                        <option value="1">Option2</option>
                                    </select>
                                </div>


                                <div className='flex'>
                                    <input className='font-bold py-2 px-4 roundedmt-4 m-2  items-center tracking-wide bg-gray-100 transition duration-200 shadow-mdfocus:shadow-outline focus:outline-none rounded'
                                        onChange={e => { setSearchSentence(e.target.value); }} placeholder="Rechercher" />

                                    <button onClick={e => { handleSearchSubmit(e) }} className="border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-900 mt-2 mb-2 hover:bg-violet-200 focus:shadow-outline  bg-violet-500 ">

                                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier"    ></g><g id="SVGRepo_iconCarrier"> <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#000000" strokeWidth="2"    ></path> </g></svg>

                                    </button>
                                </div>




                            </div>

                        </div>

                        {interns.map((user, index) => (

                            <div
                                key={index}
                                className="bg-white shadow-lg p-6 rounded-lg flex flex-col gap-4 border border-gray-200"
                            >


                                <div className='grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-5'>
                                    <div className='flex justify-center'>
                                        <div>
                                            {user.profilePhoto ? (
                                                <img
                                                    src={user.profilePhoto}
                                                    alt="Profile Preview"
                                                    className="w-28 h-28 rounded-full object-cover group-hover:bg-slate-500 group-hover:opacity-30"
                                                />
                                            ) : (
                                                <img
                                                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                                    alt="Profile Preview"
                                                    className="w-28 h-28 rounded-full object-cover group-hover:bg-slate-500 group-hover:opacity-30"
                                                />

                                            )}
                                        </div>
                                    </div>
                                    <div className='col-span-5'>
                                        <div className="text-xl font-semibold text-gray-800">
                                            {user.cine} - {user.firstname}, {user.lastname}
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div>
                                                <span className="font-bold">Email:</span> {user.email}
                                            </div>
                                            <div>
                                                <span className="font-bold">Numéro de téléphone:</span> 065699281
                                            </div>
                                            <div>
                                                <span className="font-bold">Stagiaire inscrit à:</span> {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-bold">Debut: </span> <span className="font-bold text-green-700"> {new Date(user.dateStart).toLocaleDateString()}</span>
                                            <span className="font-bold">, Fin: </span><span className="font-bold text-red-700"> {new Date(user.dateEnd).toLocaleDateString()}</span>
                                        </div>
                                        {role === 'user' || role === 'admin' ? (
                                            <div className="mt-4 flex justify-end space-x-3">
                                                <button
                                                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                                                    onClick={() => (window.location.href = `/intern/edit/${user.id}`)}
                                                >
                                                    <svg
                                                        width="24px"
                                                        height="24px"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="mr-2"
                                                    >
                                                        <path
                                                            d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                                                            stroke="#ffffff"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                        ></path>
                                                        <path
                                                            d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                                                            stroke="#ffffff"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                        ></path>
                                                    </svg>

                                                </button>

                                                <button
                                                    className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                                                    onClick={() => deleteUser(user.id)}
                                                >
                                                    <svg
                                                        width="24px"
                                                        height="24px"
                                                        viewBox="0 0 1024 1024"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="#ffffff"
                                                        className="mr-2"
                                                    >
                                                        <path
                                                            fill="#ffffff"
                                                            d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"
                                                        ></path>
                                                    </svg>

                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                        ))}

                        <nav className="flex justify-center items-center">
                            <ul className="inline-flex -space-x-px text-sm">
                                <li>
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prevPage) => prevPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                                    >
                                        Previous
                                    </button>
                                </li>
                                {generatePageNumbers()}
                                <li>
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prevPage) => prevPage + 1)
                                        }
                                        disabled={currentPage === maxPages}
                                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>




                    </div>
                </div>

            </div>


            <style>{`
        main { 
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .footer-content {
          width: 100%;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: space-between; 
          align-items: center; 
          color: gray;
        }

        .footer-links {
          text-decoration: none;
          color: gray;
        } 
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

            <style>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        
      `}</style>


        </main >


    );

};
export default Intern; 