// Modules and script imports
import { sequelize } from "./index.js";
import { DataTypes } from "sequelize";

// This function gets the list of receive messages and show them in the inbox.
async function pushToInbox (userID) {

    // Create model
    const msgInbox = sequelize.define ('msgInbox', {
        id: {type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true}, 
        from: DataTypes.STRING(45),
        date: DataTypes.STRING(45), 
        subject: DataTypes.STRING(45),
        message: DataTypes.STRING(144),
        read: DataTypes.BOOLEAN}, {
        tableName: "inbox_" + userID
        });

    // Sincronization
    (async () => {
        await sequelize.sync();
    })();
     
    const msgList = await msgInbox.findAll({attributes: ['id', 'from', 'date', 'subject', 'message', 'read'], raw: true});

    return msgList
}


export { pushToInbox };