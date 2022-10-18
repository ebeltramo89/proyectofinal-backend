// Modules and script imports
import { sequelize } from "./index.js";
import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';

// This function checks the username and the password typed by the user  
async function authUser (inputUsrData) {

    // User information
    let usrInfo = {id: '', username: '', logged: false};

    // Obtain user list
    const userList = await obtainUsrList();

    // Check against data entered by user
    let user = userList.find(element => element.username === inputUsrData.username);
    
    // Check password
    if (user) {
        await checkPass (inputUsrData.password, user.password) ? usrInfo = {id: user.iduser, name: user.name, 
                                                                            surname: user.surname, username: user.username, 
                                                                            logged: true} :
                                                                            usrInfo = {id: '', name: '', surname: '', username: '', 
                                                                            logged: false}
                                                                            console.log("Emanuel", usrInfo)
        return usrInfo
    }
    return usrInfo;
}

// This function obtains the list (table) of the users registered 
async function obtainUsrList () {

    // Create model
    const user = sequelize.define ('user', {
        iduser: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false}, 
        name: DataTypes.STRING(45), 
        surname: DataTypes.STRING(45), 
        username: DataTypes.STRING(45), 
        password: DataTypes.STRING(255)}, {
        tableName: 'users'
        });

    // Sincronization
    (async () => {
        await sequelize.sync();
    })();
     
    // Obtain user list
    return await user.findAll({attributes: ['iduser', 'name', 'surname', 'username', 'password'], raw: true});

}

// This function compares the password typed by the user against the password saved in the database 
async function checkPass (planePass, hashPass) {
    return bcrypt.compare(planePass, hashPass)
}


export { authUser,  obtainUsrList };