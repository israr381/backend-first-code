import connectDb from "./db/index.js";
import { app } from "./app.js";


connectDb()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed!", err);
    });


    export default app;