// Modules and script imports
import { sequelize } from "./index.js";
import { DataTypes } from "sequelize";

// This function changes the status of the read variable. This variable is used to indicate if the message was read.
async function msgRead (msgInfo) {

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

    // Obtain current state of read parameter
    const readStatus = await msg.findByPk(msgInfo.msgID);

    // Set new value of read
    await msg.update({ read: !readStatus.read }, { where: {id: msgInfo.msgID } })

    // Update list of message
    const msgList = await msg.findAll({attributes: ['id', 'from', 'date', 'subject', 'message', 'read'], raw: true});

    return msgList
}


export { msgRead };