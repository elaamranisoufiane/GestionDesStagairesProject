
export default function Footer() {

    return (
        <footer className="container mx-auto flex justify-between items-center border-t py-8">
            <div className="pt-12 lg:pt-16">
                <div className="px-4 mx-auto max-w-7xl md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
                        <div className="col-span-full lg:col-span-2">
                            <div className="lg:-mt-2 mb-4">
                                <a
                                    href="/"
                                    className="inline-flex items-center text-black-800 text-xl md:text-2xl font-bold gap-2"
                                >
                                    <span className="">Gestion Des Stagraires - préfecture d'Es-Smara</span>
                                </a>
                            </div>
                            <p className="text-gray-500 sm:pr-8 mb-6">
                                Cette application vise à gérer les stagiaires de toutes les divisions de la préfecture d'Essmara.
                            </p>

                        </div>
















                        <div className="col-start-6 col-end-6">
                            <div className="text-gray-800 font-bold tracking-widest uppercase mb-4">
                                Legal
                            </div>
                            <nav className="flex flex-col gap-4">
                                <div className="">
                                    <a
                                        href="/terms"
                                        className="text-gray-500 hover:text-violet-500 active:text-violet-600 transition duration-100"
                                    >
                                        Guide d'utilisation
                                    </a>
                                </div>

                            </nav>
                        </div>


                    </div>
                    <div className="text-gray-400 text-sm text-center border-t py-8">
                        © 2024 All rights created by DSIG.
                    </div>

                </div>

            </div>

        </footer >

    );

}