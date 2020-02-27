const express=require('express')
const app=express()
const cors=require('cors')
const BodyParser=require('body-parser')
const fs=require('fs') //buat tambahfile berhubungan sm file pokoknya

const port = 1975

app.use(cors()) //appuse buat manggil
app.use(BodyParser.urlencoded({extended:false}))
app.use(BodyParser.json())
app.use(express.static('public'))

const {authRouter, kelasRouter}=require('./router')

app.use('/auth', authRouter)
app.use('/kelas', kelasRouter)


app.get('/', (req, res) => {
    return res.status(200).send('<h1>API PKC</h1>')
})


app.listen(port, ()=> console.log(`API AKTIF DI ${port}`))