// Modules and script imports
import { sequelize } from "./index.js";
import { DataTypes } from "sequelize";

// This function gets the list of sent messages and show them in the sent box.
async function pushToSent (userID) {

    // Create model
    const msgInbox = sequelize.define ('msgInbox', {
        id: {type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true}, 
        from: DataTypes.STRING(45),
        date: DataTypes.STRING(45), 
        subject: DataTypes.STRING(45),
        message: DataTypes.STRING(144)}, {
        tableName: "sent_" + userID
        });

    // Sincronization
    (async () => {
        await sequelize.sync();
    })();
     
    const msgList = await msgInbox.findAll({attributes: ['id', 'from', 'date', 'subject', 'message'], raw: true});

    return msgList
}


export { pushToSent };