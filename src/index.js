import dotenv from 'dotenv'
import { app } from './app.js'
import dataBaseConnection from './utilis/dataBase.js'

dotenv.config({ path: './.env' })

dataBaseConnection()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log("Server connection failed !!! ", error);
    })
