const express = require("express");

const app = express();

app.use(express.json());

app.listen(3000,()=>{
    console.log("Server is running on 3000")
})


app.use('api/credit/add',)
app.use('api/credit/action',)
app.use('api/balance/:userId',)
app.use('api/balance/lowBalance',)
app.use('api/balance/expireCredits',)