import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import user from './routes/user.route.js'
import product from './routes/product.router.js'


const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.static("public"))
app.use(json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())


app.use("/api/v1/user", user)
app.use("/api/v1/product", product)

export { app }