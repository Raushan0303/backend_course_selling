import express from 'express';
import bodyParser from 'body-parser';
import { connect } from './config/db.js';
import apiRoutes from './routes/userRouter.js'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.use('/api/v1',apiRoutes);



app.listen(3000,async()=>{
    console.log(`server thik chal raha hai ${3000} ispe`)
    await connect()
    console.log("Mongodb connected")
})