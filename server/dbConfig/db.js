const mongoose = require("mongoose");

const  connectDB = async() =>{
    try {
        mongoose.set('strictQuery', false)

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database Connected: ${conn.connection.host} ${conn.connection.name}`)
        
    } catch (error) {
        console.log('An error occurred while trying to connect to database', error)
    }
}

module.exports = connectDB;


