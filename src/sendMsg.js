// Modules and script imports
import { sequelize } from "./index.js";
import { DataTypes } from "sequelize";

// This function uploads the new message in the inbox of each recipient and in the sent box of the sender.
async function sendMsg (MsgData) {

    // Date info
    let date = new Date();
    let today = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    // Set iduser and hash password

    let infoTopush_Inbox = {
        from: MsgData.from.name + " " + MsgData.from.surname, 
        date: today,
        subject: MsgData.subj, 
        message: MsgData.mess,
        read: false
    }

    let infoTopush_Sent = {
        from: MsgData.from.name + " " + MsgData.from.surname, 
        date: today,
        subject: MsgData.subj, 
        message: MsgData.mess
    }

    // Load message to Sent Box
    
    for (let i=0; i<MsgData.recip.length; i++) {

        pushMsgInbox ("inbox_" + MsgData.recip[i].iduser, infoTopush_Inbox);

    }

    for (let i=0; i<MsgData.recip.length; i++) {

        infoTopush_Sent.from = MsgData.recip[i].name + " " + MsgData.recip[i].surname;
        pushMsgSent ("sent_" + MsgData.from.id, infoTopush_Sent);

    }
}

async function pushMsgInbox (tableName, infoTopush) {

    // Create model
    const mess = sequelize.define ('mess', {
        id: {type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true}, 
        from: DataTypes.STRING(45),
        date: DataTypes.STRING(45), 
        subject: DataTypes.STRING(45),
        message: DataTypes.STRING(144),
        read: DataTypes.BOOLEAN}, {
        tableName: tableName
    }); 

    // Sincronization
    (async () => {
        await sequelize.sync();
    })(); 
    
    // Create user: send data to database
    try {
            await mess.create({
            //id: infoTopush.id, 
            from: infoTopush.from, 
            date: infoTopush.date, 
            subject: infoTopush.subject, 
            message: infoTopush.message,
            read: infoTopush.read}
        )} catch (error) {
            console.log("Error when the new user data was pused to data base", error);
        }

}

async function pushMsgSent (tableName, infoTopush) {

    // Create model
    const mess = sequelize.define ('mess', {
        id: {type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true}, 
        from: DataTypes.STRING(45),
        date: DataTypes.STRING(45), 
        subject: DataTypes.STRING(45),
        message: DataTypes.STRING(144)}, {
        tableName: tableName
    }); 

    // Sincronization
    (async () => {
        await sequelize.sync();
    })(); 
    
    // Create user: send data to database
    try {
            await mess.create({
            //id: infoTopush.id, 
            from: infoTopush.from, 
            date: infoTopush.date, 
            subject: infoTopush.subject, 
            message: infoTopush.message}
        )} catch (error) {
            console.log("Error when the new user data was pused to data base", error);
        }

}

export { sendMsg };