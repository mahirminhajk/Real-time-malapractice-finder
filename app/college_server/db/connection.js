import { connect } from "mongoose"

//* connection to function to mongodb
const connectDB = (uri) => {
    connect(uri).then(() => {
        console.log("Database connected")
    }).catch((err) => {
        console.log(err)
    }
    )
}

export default connectDB
