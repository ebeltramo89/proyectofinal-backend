// Modules and script imports
import { sequelize } from "./index.js";
import { DataTypes } from "sequelize";

// This function obtains the list of the registered users from the database 
 async function UsrList () {

    // Create model
    const user = sequelize.define ('user', {
        iduser: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false}, 
        name: DataTypes.STRING(45), 
        surname: DataTypes.STRING(45),  
        country: DataTypes.STRING(45),
        city: DataTypes.STRING(45), 
        username: DataTypes.STRING(45), 
        password: DataTypes.STRING(45)}, {
        tableName: 'users'
        });

    // Sincronization
    (async () => {
        await sequelize.sync();
    })();
     
    //
    const userList = await user.findAll({attributes: ['iduser', 'name', 'surname', 'username'], raw: true});

    return userList
}


export { UsrList };