'use server'
import {connect} from "mongoose";

export const connectMongoDB = async () => {
    try {
        if (process.env.MONGODB_URI) {
            await connect(process.env.MONGODB_URI, {dbName: 'next_expense'})
        }
    } catch (e) {
        console.error(e)
    }
}
