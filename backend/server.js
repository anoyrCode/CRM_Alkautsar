const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors)



app.listen(3000,()=>{
    console.log('serevr is running')
})