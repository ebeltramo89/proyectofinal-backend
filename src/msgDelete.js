// Modules and script imports
import { sequelize } from "./index.js";
import { DataTypes } from "sequelize";

// This function deletes a message of the inbox.  
async function msgDeleteInbox (msgInfo) {

    // Create model
    const msg = sequelize.define ('msg', {
        id: {type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true}, 
        from: DataTypes.STRING(45),
        date: DataTypes.STRING(45), 
        subject: DataTypes.STRING(45),
        message: DataTypes.STRING(144),
        read: DataTypes.BOOLEAN}, {
        tableName: msgInfo.tablename
        });

    // Sincronization
    (async () => {
        await sequelize.sync();
    })();
     
    // Delete message
    await msg.destroy({where: {id: msgInfo.msgID}});

    // Update list of message
    const msgList = await msg.findAll({attributes: ['id', 'from', 'date', 'subject', 'message', 'read'], raw: true});

    return msgList

}

// This function deletes a message of the sent box.  
async function msgDeleteSent (msgInfo) {

    // Create model
    const msg = sequelize.define ('msg', {
        id: {type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true}, 
        from: DataTypes.STRING(45),
        date: DataTypes.STRING(45), 
        subject: DataTypes.STRING(45),
        message: DataTypes.STRING(144)}, {
        tableName: msgInfo.tablename
        });

    // Sincronization
    (async () => {
        await sequelize.sync();
    })();
     
    // Delete message
    await msg.destroy({where: {id: msgInfo.msgID}});

    // Update list of message
    const msgList = await msg.findAll({attributes: ['id', 'from', 'date', 'subject', 'message'], raw: true});

    return msgList

}


export { msgDeleteSent, msgDeleteInbox };