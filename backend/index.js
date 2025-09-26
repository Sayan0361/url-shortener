import express from "express"
import "dotenv/config"

const app = express()
const PORT = process.env.PORT ?? 8000

app.get("/", (req,res) => {
    return res.json({
        status: 200,
        message: `Server is working fine`
    })
})

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})