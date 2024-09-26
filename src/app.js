import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import user from './routes/user.route.js'
import product from './routes/product.router.js'
import review from './routes/review.router.js'

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
app.use("/api/v1/review", review)

export { app }