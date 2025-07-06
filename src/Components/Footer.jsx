import React from 'react';

function Footer() {
    return (
        <footer className="footer footer-horizontal footer-center p-10 soraFont bg-black text-white">
            <aside>
                <div className="flex flex-row items-center gap-2">
                    <h1 className="text-2xl font-bold text-blue-600 "> 
          WhereIsIt
        </h1>
                </div>

                <nav className="grid grid-flow-col gap-6 text-base">
                    <a className="link link-hover">Lost-Fount Items</a>
                    <a className="link link-hover">Contact Us</a>
                </nav>
            </aside>

            <nav>
                <div className="grid grid-flow-col gap-4">
                    {/* Twitter */}
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 
                                1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 
                                1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 
                                0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 
                                2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 
                                2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 
                                1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 
                                2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 
                                2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 
                                1.797-1.562 2.457-2.549z" />
                        </svg>
                    </a>

                    {/* YouTube */}
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 
                                0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 
                                8.549 4.385 8.816 3.6.245 11.626.246 15.23 
                                0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 
                                12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                    </a>

                    {/* Facebook */}
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 
                                1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 
                                1.583-5.192 4.615v3.385z" />
                        </svg>
                    </a>

                    {/* GitHub */}
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-current">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 
                                5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 
                                0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 
                                17.07 3.633 16.7 3.633 16.7c-1.087-.744.084-.729.084-.729 
                                1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 
                                1.304 3.495.997.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.334-5.466-5.931 
                                0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 
                                0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404 
                                c1.02.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 
                                3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 
                                1.235 1.911 1.235 3.221 0 4.609-2.803 5.628-5.475 
                                5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 
                                3.286 0 .321.216.694.825.576C20.565 22.092 
                                24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                    </a>
                </div>
            </nav>
        </footer>
    );
}

export default Footer;
