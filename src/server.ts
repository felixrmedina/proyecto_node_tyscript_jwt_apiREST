import app from "./app";
const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
})