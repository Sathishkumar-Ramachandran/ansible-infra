const moongoose= require('mongoose');

moongoose.set('strictQuery', true);


const connectDB= async()=>{
    const mongoOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 30000, 
      };
    try{
     const con=await moongoose.connect("mongodb+srv://teamproject:Sathish123@cluster0.wqp3wtc.mongodb.net/?retryWrites=true&w=majority")
     console.log(`connected to the MongoDB Database ${con.connection.name}`);
    }
    catch(err){
     console.log(err)
     process.exit(1);
    }
}
module.exports=connectDB;