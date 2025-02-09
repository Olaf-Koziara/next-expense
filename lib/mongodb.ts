import * as mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI, {dbName: 'next_expense'})
        }
    } catch (e) {
        console.error(e)
    }
}
