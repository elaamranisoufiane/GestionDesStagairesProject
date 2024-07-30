// server/index.js

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('./db');
const crypto = require('crypto');

const fs = require('fs');
const request = require('request-promise');

const PORT = process.env.SERVER_PORT || 3001;

const app = express();
const expressSession = require('express-session');
require('dotenv').config();
app.use(express.static('client/build'));
const authMiddleware = require('./authMiddleware');

const axios = require('axios');
const authMiddlewareAdmin = require('./authMiddlewareAdmin');

//email verification process 
const nodemailer = require('nodemailer');


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));




app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({
    limit: '150mb',
    extended: true
}));



app.use(expressSession({ secret: 'mySecretKey', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());




require("./passportConfig")(passport);

const multer = require('multer');
const storageProfilePhotos = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadFolder = './uploads/profilePhotos';
        fs.mkdir(uploadFolder, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating the uploads folder:', err);
                return cb(err); // Return error if folder creation fails
            }
            cb(null, uploadFolder);
        });
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const uploadProfilePhotos = multer({ storage: storageProfilePhotos });

app.use('/uploads/profilePhotos', express.static('uploads/profilePhotos'));

app.post('/upload/profilePhotos', uploadProfilePhotos.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const newImageUrl = req.file.filename;
    res.status(200).json({ newImageUrl });
});

// Storage configuration for rapports
const storageRapports = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadFolder = './uploads/rapports';
        fs.mkdir(uploadFolder, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating the uploads folder:', err);
                return cb(err);
            }
            cb(null, uploadFolder);
        });
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const uploadRapports = multer({ storage: storageRapports });

app.use('/uploads/rapports', express.static('uploads/rapports'));

app.post('/upload/rapports', uploadRapports.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const newImageUrl = req.file.filename;
    res.status(200).json({ newImageUrl });
});


// Storage configuration for rapports
const storageprojects = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadFolder = './uploads/projects';
        fs.mkdir(uploadFolder, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating the uploads folder:', err);
                return cb(err);
            }
            cb(null, uploadFolder);
        });
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const uploadProjects = multer({ storage: storageprojects });

app.use('/uploads/projects', express.static('uploads/projects'));

app.post('/upload/projects', uploadProjects.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const newImageUrl = req.file.filename;
    res.status(200).json({ newImageUrl });
});

////////////////////////////////////////////////////////////////////////////

// app.post('/register', (req, res) => {
//     try {
//         const username = req.body.username;
//         const password = req.body.password;
//         const coupon = req.body.coupon;
//         const email = req.body.email;
//         const recaptchaToken = req.body.recaptchaToken;
//         const secretKey = process.env.RECAPTCHA_SECRET_KEY;
//         const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;



//         // axios.post(verificationURL)
//         axios.post(verificationURL)
//             .then((response) => {
//                 const data = response.data;
//                 const success = true;
//                 // const success = data.success;
//                 if (success !== undefined && success === true) {
//                     // reCAPTCHA verification passed

//                     const usernameQuery = 'SELECT * FROM user WHERE username = ?';
//                     db.query(usernameQuery, [username], (usernameError, usernameResult) => {
//                         if (usernameError) {
//                             throw usernameError;
//                         }

//                         if (usernameResult.length > 0) {
//                             res.send({ message: "Username already exists" });
//                         } else {
//                             const emailQuery = 'SELECT * FROM user WHERE email = ?';
//                             db.query(emailQuery, [email], async (emailError, emailResult) => {
//                                 if (emailError) {
//                                     throw emailError;
//                                 }

//                                 if (emailResult.length > 0) {
//                                     res.send({ message: "Email already exists" });
//                                 } else {
//                                     // Username and email are not in use, proceed with registration
//                                     var customer = 123;
//                                     // var customer = await createCustomer(username, email);
//                                     const hashedPassword = bcrypt.hashSync(password, 10);
//                                     const query = 'INSERT INTO `user`(`username`,`password`,`email`,`coupon`,`attempt`, `subscribre`,`credits`,`planName`,`created_at`) VALUES (?,?,?,?,?,?,?,?,?,?)';
//                                     db.query(query, [username, hashedPassword, email, coupon, 0, false, 10, "Free Plan", new Date()], (err, result) => {
//                                         if (err) {
//                                             throw err;
//                                         }
//                                         res.send({ message: "User Created" });
//                                         const randomBytes = crypto.randomBytes(16);
//                                         const verificationToken = randomBytes.toString('hex');

//                                         // Save the verification token in the database
//                                         const updateTokenQuery = 'UPDATE user SET verification_token = ? WHERE email = ?';
//                                         db.query(updateTokenQuery, [verificationToken, email], async (updateTokenError, updateTokenResult) => {
//                                             if (updateTokenError) {
//                                                 throw updateTokenError;
//                                             }

//                                             // Send verification email
//                                             const verificationLink = `${process.env.DOMAIN}/verify?token=${verificationToken}`;
//                                             //const verificationLink = "testing";


//                                             const mailOptions = {
//                                                 from: process.env.SMTPEMAIL,
//                                                 to: email,
//                                                 subject: 'Gestion des Stagaires, Email Verification',
//                                                 html: `
//                                                 <!DOCTYPE html>
//                                                 <html lang="en">
//                                                 <head>
//                                                     <meta charset="UTF-8">
//                                                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                                                     <title>Email Verification</title>
//                                                     <style>
//                                                         @import url('https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css');
//                                                     </style>
//                                                 </head>
//                                                 <body class="bg-gray-100">

//                                                     <div class="container mx-auto px-4 py-8">
//                                                         <div class="bg-white rounded-lg shadow-md p-6">
//                                                             <h1 class="text-2xl font-bold text-blue-500 mb-4">Veuillez vérifier votre adresse e-mail</h1>
//                                                             <p class="mb-4">Thank you for signing up! To complete your registration, please click the button below to verify your email address:</p>
//                                                             <a href="${verificationLink}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Verify Email</a>
//                                                         </div>
//                                                     </div>

//                                                 </body>
//                                                 </html>
//                                                 `
//                                             };


//                                             // Create a nodemailer transporter
//                                             const transporter = nodemailer.createTransport({
//                                                 host: 'smtp.gmail.com',
//                                                 port: 465,
//                                                 secure: true,
//                                                 auth: {
//                                                     user: process.env.SMTPEMAIL,
//                                                     pass: process.env.SMTPPASSWORD
//                                                 }
//                                             });

//                                             // Send the email
//                                             transporter.sendMail(mailOptions, (emailError, info) => {
//                                                 if (emailError) {
//                                                     throw emailError;
//                                                 }
//                                                 res.status(200).send({ message: 'Email sent' });

//                                             });
//                                         });


//                                     });
//                                 }
//                             });
//                         }
//                     });
//                 } else {
//                     res.send({ message: "reCAPTCHA verification failed" });
//                 }
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//                 res.status(500).send({ message: 'Verification failed' });
//             });



//     } catch (err) {
//         res.send({ message: err });
//     }
// });


//send verification email multiple times
app.post('/send-verification-link', async (req, res) => {
    const email = req.body.email;
    const TokenQuery = 'SELECT verification_token from user WHERE email = ? AND is_verified = 0';

    try {
        const TokenResult = await new Promise((resolve, reject) => {
            db.query(TokenQuery, [email], (TokenError, TokenResult) => {
                if (TokenError) {
                    reject(TokenError);
                    return;
                }
                resolve(TokenResult);
            });
        });

        if (TokenResult.length > 0 && TokenResult[0].verification_token) {
            // Send verification email
            const verificationLink = `${process.env.DOMAIN}/verify?token=${TokenResult[0].verification_token}`;
            const mailOptions = {
                from: process.env.SMTPEMAIL,
                to: email,
                subject: 'Gestion des Stagiaires: Vérification de l\'Email',
                html: `
             <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Vérification de l'Email</title>
                <style>
                    @import url('https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css');
                </style>
            </head>
            <body class="bg-gray-100">
                <div class="container mx-auto px-4 py-8">
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h1 class="text-2xl font-bold text-blue-500 mb-4">Veuillez vérifier votre adresse e-mail</h1>
                        <p class="mb-4">Merci de vous être inscrit ! Pour compléter votre inscription, veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse e-mail :</p>
                     <a href="${verificationLink}" style="display: inline-block; background-color: #8b5cf6; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 4px; text-decoration: none; text-align: center;">Vérifier l'Email</a>
                       
                     </div>
                </div>
            </body>
            </html>
                                    `
            };

            // Create a nodemailer transporter
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.SMTPEMAIL,
                    pass: process.env.SMTPPASSWORD
                }
            });

            // Send the email
            await transporter.sendMail(mailOptions);
            res.status(200).send({ message: true });
        } else {
            res.status(200).send({ message: false });
        }
    } catch (error) {
        console.error('Error sending verification link:', error);
        res.status(500).send({ message: 'Error sending verification link.' });
    }
});


//email verification 
app.get('/verify', (req, res) => {
    const verificationToken = req.query.token;

    if (!verificationToken) {
        return res.redirect('/email-failed');
    }

    const verifyQuery = 'UPDATE user SET is_verified = 1 WHERE verification_token = ?';

    db.query(verifyQuery, [verificationToken], (verifyError, verifyResult) => {
        if (verifyError) {
            console.error('Verification failed. Error:', verifyError);
            return res.redirect('/email-failed');
        }

        if (verifyResult.affectedRows > 0) {
            // Token was valid and updated
            return res.redirect('/email-verified');
        } else {
            // Token was invalid or not found
            return res.redirect('/email-failed');
        }
    });
});

//reset password
app.get('/reset-password-page', (req, res) => {
    const verificationToken = req.query.token;
    const verifyQuery = 'SELECT id FROM user WHERE is_verified = 1 AND verification_token = ?';

    db.query(verifyQuery, [verificationToken], (error, result) => {
        if (error) {
            console.error('Database error:', error);
            res.redirect('/');
        } else if (result.length === 0) {
            res.redirect('/404');
        } else {
            res.redirect(`/reset-password/${verificationToken}/${result[0].id}`);
        }
    });
});


//submit new password
app.post('/submit-reset-password', (req, res) => {
    const password = bcrypt.hashSync(req.body.password, 10);
    const userId = req.body.userId;
    const token = req.body.token;

    const query = 'UPDATE user SET password = ? WHERE verification_token = ? AND id = ?'
    db.query(query, [password, token, userId], (err, result) => {
        if (err) {
            throw err;
        }
        res.send({ message: "password reset" });
    });


});

//forget password

app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    const useremailQuery = 'SELECT * FROM user WHERE email = ?';
    db.query(useremailQuery, [email], (userError, userResult) => {
        if (userError) {
            throw userError;
        }

        if (userResult.length > 0) {

            const randomBytes = crypto.randomBytes(16);
            const verificationToken = randomBytes.toString('hex');

            // Save the verification token in the database
            const updateTokenQuery = 'UPDATE user SET verification_token = ? WHERE email = ?';
            db.query(updateTokenQuery, [verificationToken, email], async (updateTokenError, updateTokenResult) => {
                if (updateTokenError) {
                    throw updateTokenError;
                }

                // Send verification email
                const verificationLink = `${process.env.DOMAIN}/reset-password-page?token=${verificationToken}`;
                //const verificationLink = "testing";


                const mailOptions = {
                    from: process.env.SMTPEMAIL,
                    to: email,
                    subject: 'Gestion des stagiaires - Réinitialisation du mot de passe',
                    html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>You have requested a password reset</title>
                        <style>
                            @import url('https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css');
                        </style>
                    </head>
                    <body class="bg-gray-100">
                    
                        <div class="container mx-auto px-4 py-8">
                            <div class="bg-white rounded-lg shadow-md p-6">
                                <h1 class="text-2xl font-bold text-blue-500 mb-4">Reset your password</h1>
                                <p class="mb-4">Veuillez cliquer ici pour réinitialiser votre mot de passe.</p>
                                <a href="${verificationLink}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Reset your password</a>
                            </div>
                        </div>
                    
                    </body>
                    </html>
                    `
                };


                // Create a nodemailer transporter
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.SMTPEMAIL,
                        pass: process.env.SMTPPASSWORD
                    }
                });

                // Send the email
                transporter.sendMail(mailOptions, (emailError, info) => {
                    if (emailError) {
                        throw emailError;
                    }

                });
            });

            return res.status(200).json({ message: 'Veuillez vérifier votre email.' });

        } else {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
    });



});

//login 
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send('No user exists!');
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            res.send("User Logged in");
        });
    })(req, res, next);
});

//get user information
app.get('/getUser', (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        res.json(user);
    } else {
        res.status(401).send('Unauthorized');
    }
});

// logging out
app.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    } else {
        res.send('not loggin');
    }
});


//check Auth
app.get('/checkAuthUser', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(true);
    } else {
        res.json(false);
    }
});



///get all users with pagination
const ITEMS_PER_PAGE = 10;
app.get('/getAllUsers', authMiddlewareAdmin, async (req, res) => {
    const { page = 1, querySearch = "", statusActive, statusSubscription } = req.query;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    var query = `SELECT * FROM user WHERE username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%' ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;



    // if ((!statusSubscription || statusSubscription == -1) && statusActive) {

    //     if (1 == statusActive) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND (credits > 0 and (currentPeriodEnd IS NULL OR currentPeriodEnd > NOW()))  OR role = 'admin' ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     } else if (0 == statusActive) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND (credits <= 0 OR currentPeriodEnd < NOW()) ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     }

    // } else if (statusSubscription && (!statusActive || statusActive == -1)) {
    //     if (1 == statusSubscription) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND currentPeriodEnd IS NOT NULL AND currentPeriodEnd > NOW() ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     } else if (0 == statusSubscription) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%')  AND (currentPeriodEnd IS NULL OR currentPeriodEnd < NOW()) AND role is null ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     }
    // } else if (statusSubscription && statusActive) {

    //     if (1 == statusSubscription && 1 == statusActive) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND (credits > 0 and (currentPeriodEnd IS NOT NULL OR currentPeriodEnd > NOW())) ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     } else if (0 == statusSubscription && 1 == statusActive) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND (credits > 0 and (currentPeriodEnd IS NULL))  ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     } else if (0 == statusSubscription && 0 == statusActive) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND (credits <= 0 and (currentPeriodEnd IS NULL)) ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     } else if (1 == statusSubscription && 0 == statusActive) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND (credits <= 0 and (currentPeriodEnd IS NOT NULL OR currentPeriodEnd > NOW()))  ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     }

    // }

    if (req.isAuthenticated()) {
        try {
            const results = await new Promise((resolve, reject) => {
                db.query(query, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });

            res.json(results);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.json({ message: 'Login please!' });
    }
});


//get the total number of Users
app.get('/getTotalUsers', authMiddleware, async (req, res) => {
    const query = 'SELECT COUNT(*) as totalUsers FROM user';

    if (req.isAuthenticated()) {
        try {
            const result = await new Promise((resolve, reject) => {
                db.query(query, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results[0].totalUsers);
                    }
                });
            });

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.json({ message: 'Login please!' });
    }
});



//delete uers by id 
app.delete('/deleteUser/:id', authMiddlewareAdmin, async (req, res) => {
    if (req.isAuthenticated()) {

        const userId = req.params.id;
        const currentWorkingDirectory = process.cwd();
        const deleteQuery = 'DELETE FROM user WHERE id = ?';
        const query = 'SELECT url FROM project WHERE id_user = ?';

        db.query(query, [userId], (error, results) => {
            if (error) {
                console.error('Error fetching images:', error);
                return res.status(500).json({ error: 'An error occurred while fetching images' });
            }

            if (results.length > 0) {
                results.forEach((image) => {
                    const imageUrl = image.url;
                    const filePath = path.join(currentWorkingDirectory, imageUrl);

                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting image file:', err);
                            return res.status(500).json({ error: 'An error occurred while deleting the image file' });
                        }
                    });
                });
            }

            db.query(deleteQuery, [userId], (err, result) => {
                if (err) {
                    console.error('Error deleting user:', err);
                    return res.status(500).json({ error: 'An error occurred while deleting the user' });
                }

                return res.json({ message: 'Delete successful' });
            });
        });

    } else {
        return res.json({ message: 'Login please!' });
    }
});

//stagaire management  
app.get('/getAllInterns', authMiddleware, async (req, res) => {
    const { page = 1, querySearch = "", statusActive, statusSubscription } = req.query;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    var query = `SELECT * FROM intern WHERE firstname LIKE '%${querySearch}%' OR lastname LIKE '%${querySearch}%' OR cine LIKE '%${querySearch}%' ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;



    // if ((!statusSubscription || statusSubscription == -1) && statusActive) {

    //     if (1 == statusActive) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND (credits > 0 and (currentPeriodEnd IS NULL OR currentPeriodEnd > NOW()))  OR role = 'admin' ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     } else if (0 == statusActive) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND (credits <= 0 OR currentPeriodEnd < NOW()) ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     }

    // } else if (statusSubscription && (!statusActive || statusActive == -1)) {
    //     if (1 == statusSubscription) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND currentPeriodEnd IS NOT NULL AND currentPeriodEnd > NOW() ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     } else if (0 == statusSubscription) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%')  AND (currentPeriodEnd IS NULL OR currentPeriodEnd < NOW()) AND role is null ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     }
    // } else if (statusSubscription && statusActive) {

    //     if (1 == statusSubscription && 1 == statusActive) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND (credits > 0 and (currentPeriodEnd IS NOT NULL OR currentPeriodEnd > NOW())) ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     } else if (0 == statusSubscription && 1 == statusActive) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND (credits > 0 and (currentPeriodEnd IS NULL))  ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     } else if (0 == statusSubscription && 0 == statusActive) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND (credits <= 0 and (currentPeriodEnd IS NULL)) ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     } else if (1 == statusSubscription && 0 == statusActive) {
    //         query = `SELECT * FROM user WHERE (username LIKE '%${querySearch}%' OR email LIKE '%${querySearch}%') AND (credits <= 0 and (currentPeriodEnd IS NOT NULL OR currentPeriodEnd > NOW()))  ORDER BY created_at DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    //     }

    // }

    if (req.isAuthenticated()) {
        try {
            const results = await new Promise((resolve, reject) => {
                db.query(query, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });

            res.json(results);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.json({ message: 'Login please!' });
    }
});

app.get('/getTotalInterns', authMiddleware, async (req, res) => {
    const query = 'SELECT COUNT(*) as totalIntern FROM intern';

    if (req.isAuthenticated()) {
        try {
            const result = await new Promise((resolve, reject) => {
                db.query(query, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results[0].totalIntern);
                    }
                });
            });

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.json({ message: 'Login please!' });
    }
});


app.delete('/deleteIntern/:id', authMiddleware, async (req, res) => {
    if (req.isAuthenticated()) {

        const userId = req.params.id;
        const currentWorkingDirectory = process.cwd();
        const deleteQuery = 'DELETE FROM intern WHERE id = ?';
        //const query = 'SELECT url FROM project WHERE id_user = ?';
        const query = 'SELECT profilePhoto,project,rapport FROM intern WHERE id = ?';

        db.query(query, [userId], (error, results) => {
            if (error) {
                console.error('Error fetching project:', error);
                return res.status(500).json({ error: 'An error occurred while fetching project' });
            }

            if (results.length > 0) {
                results.forEach((profile) => {
                    if (profile.profilePhoto !== '') {
                        const imageUrl = profile.profilePhoto;
                        const filePath = path.join(currentWorkingDirectory, imageUrl);

                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error('Error deleting profilePhoto file:', err);
                                return res.status(500).json({ error: 'An error occurred while deleting the profilePhoto file' });
                            }
                        });
                    }

                    if (profile.project !== '') {
                        const project = profile.project;
                        const filePath = path.join(currentWorkingDirectory, project);

                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error('Error deleting project file:', err);
                                return res.status(500).json({ error: 'An error occurred while deleting the project file' });
                            }
                        });
                    }

                    if (profile.rapport !== '') {
                        const rapport = profile.rapport;
                        const filePath = path.join(currentWorkingDirectory, rapport);

                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error('Error deleting rapport file:', err);
                                return res.status(500).json({ error: 'An error occurred while deleting the rapport file' });
                            }
                        });
                    }


                });

            }

            db.query(deleteQuery, [userId], (err, result) => {
                if (err) {
                    console.error('Error deleting intern:', err);
                    return res.status(500).json({ error: 'An error occurred while deleting the intern' });
                }

                return res.json({ message: 'Delete successful' });
            });
        });

    } else {
        return res.json({ message: 'Login please!' });
    }
});







//add user by admin
app.post('/adduser', authMiddlewareAdmin, (req, res) => {
    try {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const username = req.body.username;
        const password = req.body.password;
        const role = req.body.role;
        const email = req.body.email;


        const usernameQuery = 'SELECT * FROM user WHERE username = ?';
        db.query(usernameQuery, [username], (usernameError, usernameResult) => {
            if (usernameError) {
                throw usernameError;
            }

            if (usernameResult.length > 0) {
                res.send({ message: "Username already exists" });
            } else {
                const emailQuery = 'SELECT * FROM user WHERE email = ?';
                db.query(emailQuery, [email], async (emailError, emailResult) => {
                    if (emailError) {
                        throw emailError;
                    }

                    if (emailResult.length > 0) {
                        res.send({ message: "Email already exists" });
                    } else {
                        // var customer = await createCustomer(username, email);
                        const hashedPassword = bcrypt.hashSync(password, 10);
                        const query = 'INSERT INTO `user`(`username`,`firstname`,`lastname`,`password`,`email`,`role`,`created_at`) VALUES (?,?,?,?,?,?,?)';
                        db.query(query, [username, firstname, lastname, hashedPassword, email, role, new Date()], (err, result) => {
                            if (err) {
                                throw err;
                            }
                            res.send({ message: "User Created" });

                            const randomBytes = crypto.randomBytes(16);
                            const verificationToken = randomBytes.toString('hex');

                            // Save the verification token in the database
                            const updateTokenQuery = 'UPDATE user SET verification_token = ? WHERE email = ?';
                            db.query(updateTokenQuery, [verificationToken, email], async (updateTokenError, updateTokenResult) => {
                                if (updateTokenError) {
                                    throw updateTokenError;
                                }

                                // Send verification email
                                const verificationLink = `${process.env.DOMAIN}/verify?token=${verificationToken}`;
                                //const verificationLink = "testing";


                                const mailOptions = {
                                    from: process.env.SMTPEMAIL,
                                    to: email,
                                    subject: 'Gestion des Stagiaires: Vérification de l\'Email',
                                    html: `
                                    <!DOCTYPE html>
                                    <html lang="fr">
                                    <head>
                                        <meta charset="UTF-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <title>Vérification de l'Email</title>
                                        <style>
                                            @import url('https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css');
                                        </style>
                                    </head>
                                    <body class="bg-gray-100">
                                        <div class="container mx-auto px-4 py-8">
                                            <div class="bg-white rounded-lg shadow-md p-6">
                                                <h1 class="text-2xl font-bold text-blue-500 mb-4">Veuillez vérifier votre adresse e-mail</h1>
                                                <p class="mb-4">Merci de vous être inscrit ! Pour compléter votre inscription, veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse e-mail :</p>
                                            <a href="${verificationLink}">Vérifier l'Email</a>
                                           
                                                </div>
                                        </div>
                                    </body>
                                    </html>
                                                                        `
                                };


                                // Create a nodemailer transporter
                                const transporter = nodemailer.createTransport({
                                    host: 'smtp.gmail.com',
                                    port: 465,
                                    secure: true,
                                    auth: {
                                        user: process.env.SMTPEMAIL,
                                        pass: process.env.SMTPPASSWORD
                                    }
                                });

                                // Send the email
                                transporter.sendMail(mailOptions, (emailError, info) => {
                                    if (emailError) {
                                        throw emailError;
                                    }

                                    //console.log('Email sent: ' + info.response);
                                });
                            });
                        });
                    }
                });
            }
        });

    } catch (err) {
        res.send({ message: err });
    }
});

//add intern by  users
app.post('/addintern', authMiddleware, (req, res) => {
    try {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const cine = req.body.cine;
        const tel = req.body.tel;
        const email = req.body.email;
        const dateStart = req.body.dateStart;
        const dateEnd = req.body.dateEnd;
        const profilePhoto = req.body.profilePhoto;
        const rapport = req.body.rapport;
        const project = req.body.project;


        const cineQuery = 'SELECT * FROM intern WHERE cine = ?';
        db.query(cineQuery, [cine], (cineError, cineResult) => {
            if (cineError) {
                throw cineError;
            }

            if (cineResult.length > 0) {
                res.send({ message: "CINE already exists" });
            } else {
                const emailQuery = 'SELECT * FROM intern WHERE email = ?';
                db.query(emailQuery, [email], async (emailError, emailResult) => {
                    if (emailError) {
                        throw emailError;
                    }

                    if (emailResult.length > 0) {
                        res.send({ message: "Email already exists" });
                    } else {
                        const query = 'INSERT INTO `intern`(`firstname`,`lastname`,`cine`,`email`,`phoneNumber`,`dateStart`,`dateEnd`,`profilePhoto`,`rapport`,`project`,`created_at`) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
                        db.query(query, [firstname, lastname, cine, email, tel, dateStart, dateEnd, profilePhoto, rapport, project, new Date()], (err, result) => {
                            if (err) {
                                throw err;
                            }
                            res.send({ message: "intern Created" });
                        });
                    }
                });
            }
        });

    } catch (err) {
        res.send({ message: err });
    }
});



//Edit user by Admin
app.post('/editUser', authMiddlewareAdmin, (req, res) => {
    if (req.isAuthenticated()) {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const userId = req.body.id;
        const updatedUserData = req.body;
        const role = req.body.role;

        const { username, password, email } = updatedUserData;

        const usernameQuery = 'SELECT * FROM user WHERE username = ? && id != ?';
        db.query(usernameQuery, [username, userId], (usernameError, usernameResult) => {
            if (usernameError) {
                throw usernameError;
            }

            if (usernameResult.length > 0) {
                res.send({ message: "Username already exists" });
            } else {
                const emailQuery = 'SELECT * FROM user WHERE email = ? && id != ?';
                db.query(emailQuery, [email, userId], (emailError, emailResult) => {
                    if (emailError) {
                        throw emailError;
                    }

                    if (emailResult.length > 0) {
                        res.send({ message: "Email already exists" });
                    } else {

                        if (password) {
                            const hashedPassword = bcrypt.hashSync(password, 10);
                            db.query('UPDATE user SET username=?,firstname=?, lastname=?, password=?, email=?, role=?, updated_at=? WHERE id = ?',
                                [username, firstname, lastname, hashedPassword, email, role, new Date(), userId],
                                (err, result) => {
                                    if (err) {
                                        console.error('Error updating user:', err);
                                        res.status(500).json({ error: 'An error occurred while updating the user' });
                                    } else {
                                        res.json({ message: 'User updated successfully' });
                                    }
                                }
                            );
                        } else {
                            db.query('UPDATE user SET username=?,firstname=?, lastname=?, email=?, role=?,updated_at=? WHERE id = ?',
                                [username, firstname, lastname, email, role, new Date(), userId],
                                (err, result) => {
                                    if (err) {
                                        console.error('Error updating user:', err);
                                        res.status(500).json({ error: 'An error occurred while updating the user' });
                                    } else {
                                        res.json({ message: 'User updated successfully' });
                                    }
                                }
                            );
                        }

                    }
                });
            }
        });


    } else {
        res.status(401).json({ message: 'Login please!' });
    }
});


app.post('/editIntern', authMiddleware, (req, res) => {
    if (req.isAuthenticated()) {
        const userId = req.body.id;
        const updatedUserData = req.body;

        const { firstname, lastname, cine, password, email } = updatedUserData;

        const cineQuery = 'SELECT * FROM intern WHERE cine = ? && id != ?';
        db.query(cineQuery, [cine, userId], (cineError, cineResult) => {
            if (cineError) {
                throw cineError;
            }

            if (cineResult.length > 0) {
                res.send({ message: "CINE already exists" });
            } else {
                const emailQuery = 'SELECT * FROM intern WHERE email = ? && id != ?';
                db.query(emailQuery, [email, userId], (emailError, emailResult) => {
                    if (emailError) {
                        throw emailError;
                    }

                    if (emailResult.length > 0) {
                        res.send({ message: "Email already exists" });
                    } else {

                        if (password) {
                            const hashedPassword = bcrypt.hashSync(password, 10);
                            db.query('UPDATE intern SET firstname=?, lastname=?, cine=?, password=?, email=?, updated_at=? WHERE id = ?',
                                [firstname, lastname, cine, hashedPassword, email, new Date(), userId],
                                (err, result) => {
                                    if (err) {
                                        console.error('Error updating user:', err);
                                        res.status(500).json({ error: 'An error occurred while updating the user' });
                                    } else {
                                        res.json({ message: 'User updated successfully' });
                                    }
                                }
                            );
                        } else {
                            db.query('UPDATE intern SET firstname=?, lastname=?, cine=?, email=?, updated_at=? WHERE id = ?',
                                [firstname, lastname, cine, email, new Date(), userId],
                                (err, result) => {
                                    if (err) {
                                        console.error('Error updating user:', err);
                                        res.status(500).json({ error: 'An error occurred while updating the user' });
                                    } else {
                                        res.json({ message: 'User updated successfully' });
                                    }
                                }
                            );
                        }

                    }
                });
            }
        });


    } else {
        res.status(401).json({ message: 'Login please!' });
    }
});


//get user number ID  
app.get('/getUserByNumber/:id', authMiddleware, (req, res) => {
    const userId = req.params.id;
    if (req.isAuthenticated()) {
        db.query('SELECT * FROM user WHERE id = ?', [userId], (err, results) => {
            if (err) {
                console.error('Error fetching user data:', err);
                res.status(500).json({ error: 'An error occurred while fetching user data' });
            } else {
                const item = results[0];
                res.json(item);
            }
        });
    } else {
        return res.json({ message: 'Login please!' });
    }
});

//get intern number ID  
app.get('/getInternByNumber/:id', authMiddleware, (req, res) => {
    const userId = req.params.id;
    if (req.isAuthenticated()) {
        db.query('SELECT * FROM intern WHERE id = ?', [userId], (err, results) => {
            if (err) {
                console.error('Error fetching intern data:', err);
                res.status(500).json({ error: 'An error occurred while fetching intern data' });
            } else {
                const item = results[0];
                res.json(item);
            }
        });
    } else {
        return res.json({ message: 'Login please!' });
    }
});





app.use(express.static(path.resolve(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});



const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

});
