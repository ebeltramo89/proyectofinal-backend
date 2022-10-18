"use strict"

// Modules import
import  cookieParser  from "cookie-parser";
import  express  from "express";
import  session  from "express-session";
import  dotenv   from "dotenv";
import  cors  from "cors";

import { registration, checkTableUsers } from "./registUsr.js"
import { msgDeleteSent, msgDeleteInbox }  from "./msgDelete.js"
import { CitiesData, CountriesData } from "./CountryCityData.js"
import { pushToInbox } from "./msgInbox.js"
import { pushToSent } from "./msgSent.js"
import { Sequelize } from "sequelize";
import { authUser } from "./authUsr.js"
import { UsrList } from "./usrList.js"
import { sendMsg } from "./sendMsg.js"
import { msgRead } from "./msgMarkAsRead.js"


// Enviorment variables
console.clear();
dotenv.config({path: './src/.env'});

// Server options
const app = express();
const PORT = process.env.PORT_FRONT;

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

// Set cors options 
app.use(cors({
    "origin": 'http://localhost:4200',
    "methods": ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    "credentials": true,
    "allowedHeaders": ['Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'],
}));

// To see session cookie
app.use(cookieParser());

// Set session
app.use(session({
    secret: 'keyword',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false, httpOnly: false },
    name: 'Cookie'
}));


// Set data base parameters
export const sequelize = new Sequelize ('database', process.env.USER, process.env.PASS, {
    'host': 'localhost',
    'dialect': 'mysql',

    define: {
        timestamps: false,
    },
});

// This function checks if the table of users exists. If 
checkTableUsers();

// USER LOGIN - Endpoint
app.post("/login", (req, res) => {

    // Front to Back       
    authUser(req.body).then(usrInfo =>{

        // If user data is correct, it is saved in the session
        if(usrInfo.logged) {

            console.log("ID session - Login...", req.session.id)
            console.log("Cookie sesion...", req.headers.cookie)

            // Assign to session
            req.session.usrInfo = usrInfo

            // Back to Front
            res.send(usrInfo.logged);

          // If user data is wrong, the logged variable is false  
        } else if (!usrInfo.logged) { 

            // Back to Front
            res.send(usrInfo.logged) 
        }

    });

})

// USER REGISTRATION - Enpoint
app.post("/registration",  (req, res) => {

    // Front to Back    
    const userData = req.body  
 
    // Load new user - Back to Front 
    registration(userData).then((data) => {res.send(data);})                                     
                          .catch ((error) => console.log(error))
})

// USER REGISTRATION List of Countries - ENDPOINT
app.get("/registration/countries" , (req, res) =>{
       
    // Back to Front - It sends the list of the countries contains in the array CountriesData
    res.send(CountriesData);

})

// USER REGISTRATION List of cities of selected country - ENDPOINT
app.get("/registration/cities/:id" , (req, res) =>{

    // Front to Back - It obtains the id of the selected country
    let id_country = req.params.id

    // List of cities of the selected country
    let Cities = CitiesData.find(country => country.id === parseInt(id_country));

    // Back to Front
    res.send(Cities.cities);

})

// SEND MESSAGE - Endpoint
app.post("/message/send", (req, res) => {

    // Front to Back: list of recipients, subject and message
    let MsgData = { 
        recip: req.body.recip, from: req.body.sender, subj: req.body.subj, mess: req.body.mess
    }
     
    // Back to Front
    sendMsg(MsgData).then(() => res.send(true));
    
})

// GET Inbox - Endpoint
app.get("/inbox", (req, res, next) => {

    // Front to Back
    let userID = req.session.usrInfo.id
    
    // Back to Front
    pushToInbox(userID).then((msgList) => {res.send(msgList);              
    }).catch((error) => {console.log(error)}) 
    
})

// GET Sent - Endpoint
app.get("/sent", (req, res) => {

    // User ID - It's used for the sent table name
    let userID = req.session.usrInfo.id

    // Back to Front
    pushToSent(userID).then((msgList) => {res.send(msgList);              
                        }).catch((error) => {console.log(error)})
    
})

// GET Users List - ENDPOINT
app.get("/message/userlist", (req, res) => {
    
    // Back to Front
    UsrList().then((userList) => {res.send(userList);})
             .catch((error) => {console.log(error)})

})


// GET Delete message in Inbox - ENDPOINT
app.get("/inbox/delete/:id", (req, res) => {

    // Front to Back
    let msgInfo = {msgID: req.params.id, tablename: "inbox_" + req.session.usrInfo.id}
    
   // Back to Front
   msgDeleteInbox(msgInfo).then((msgList) => {res.send(msgList);})              
                          .catch((error) => {console.log(error)})

})

// GET Delete message in Sent - ENDPOINT
app.get("/sent/delete/:id", (req, res) => {

   // Front to Back
   let msgInfo = {msgID: req.params.id, tablename: "sent_" + req.session.usrInfo.id}

   // Back to Front
   msgDeleteSent(msgInfo).then((msgList) => {res.send(msgList);})              
                         .catch((error) => {console.log(error)})

})

// GET Delete message in Inbox - ENDPOINT
app.get("/inbox/markasread/:id", (req, res) => {

   // Front to Back
   let msgInfo = {msgID: req.params.id, tablename: "inbox_" + req.session.usrInfo.id}

   // Back to Front
   msgRead(msgInfo).then((msgList) => {res.send(msgList);})              
                   .catch((error) => {console.log(error)})

})

// GET Send user info to Front - ENDPOINT
app.get("/usrinfo", (req, res) => {

    // Front to Back
    if (req.session.id) {

        const usrInfo = {
            id: req.session.usrInfo.id,
            username: req.session.usrInfo.username,
            name: req.session.usrInfo.name,
            surname: req.session.usrInfo.surname
        }
        res.send(usrInfo)
    }

 })

 // GET Logout - ENDPOINT
app.get("/logout", (req, res) => {

    // Front to Back
    if (req.session.usrInfo.logged) {

        // Destroy session when the user click on Logout button
        req.session.destroy();
        res.send(true);

    }

    res.send(false);

 })

  // GET Check session - ENDPOINT
app.get("/checksession", (req, res) => {

    // Front to Back
    if (req.session.usrInfo.logged) {
        
        res.send(true);

    }

    res.send(false);
 })

// * / * / * /* / * / * / * /* / * / * / * /* / * / * / * /* / * / * / * /* / * / * / * /* / *

//Server listening
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

// Connect with data base
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
}

