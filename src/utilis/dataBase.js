import mongoose from 'mongoose'

const dataBaseConnection = async function () {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        if (connection) {
            console.log("Connection is established with database");
        }
    } catch (error) {
        console.log("Connection error with Database", error);
        process.exit(1)
    }
}

export default dataBaseConnection