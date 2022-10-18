// Modules and script imports
import { obtainUsrList } from "./authUsr.js"
import { sequelize } from "./index.js";
import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';

// This function creates a new user in the database. 
async function registration (usrData) {

    // Create model
    const user = sequelize.define ('user', {
        iduser: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false}, 
        name: DataTypes.STRING(45), 
        surname: DataTypes.STRING(45),  
        country: DataTypes.STRING(45),
        city: DataTypes.STRING(45), 
        username: DataTypes.STRING(45), 
        password: DataTypes.STRING(255)}, {
        tableName: 'users'
        });

    // Sincronization
    (async () => {
        await sequelize.sync();
    })();
    
    // Check if the username already exists
    const userList = await obtainUsrList();
    const userSearched = userList.find(element => element.username === usrData.username);

    if (!userSearched) {

        // Set iduser and hash password
        const id = Date.parse(Date());

        // Hash password
        const passEncrypted = await hashPass (usrData.password);
        
        // Create user: send data to database
        try {
            await user.create({
            iduser: id, name: usrData.name, surname: usrData.surname, country: usrData.country, 
            city: usrData.city, username: usrData.username, password: passEncrypted}
        )} catch (error) {
            console.log("Error when the new user data was pused to data base", error);
        }

        // Create Inbox and Sent tables
        createInboxSent (id);

        return true;

    } else if (userSearched) {
        return false;
    }
    
}

// This function checks if the user table exists. 
async function checkTableUsers () {

    // Create model
    const user = sequelize.define ('user', {
        iduser: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false}, 
        name: DataTypes.STRING(45), 
        surname: DataTypes.STRING(45),  
        country: DataTypes.STRING(45),
        city: DataTypes.STRING(45), 
        username: DataTypes.STRING(45), 
        password: DataTypes.STRING(255)}, {
        tableName: 'users'
        });

    // Sincronization
    (async () => {
        await sequelize.sync();
    })();

}

// This function creates the inbox and outbox (sent box) tables in the database
async function createInboxSent (id) {

    // Create model
    const Inbox = sequelize.define ('Inbox', {
        id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true}, 
        from: DataTypes.STRING(45), 
        date: DataTypes.STRING(45),  
        subject: DataTypes.STRING(45),
        message: DataTypes.STRING(144),
        read: DataTypes.BOOLEAN}, {
        tableName: "inbox_" + id 
        });

    const Sent = sequelize.define ('Sent', {
        id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true}, 
        from: DataTypes.STRING(45), 
        date: DataTypes.STRING(45),  
        subject: DataTypes.STRING(45),
        message: DataTypes.STRING(144)}, {
        tableName: "sent_" + id 
        });    

    // Sincronization
    (async () => {
        await sequelize.sync();
    })();
    
}

// This function encryptes the password typed by the user.
async function hashPass (password) {
    try {
        return await bcrypt.hash(password, 5);
    } catch {() => console.log("Error during encryption process...")}
}

export { registration, checkTableUsers };