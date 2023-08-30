import express,{Request,Response} from 'express'
import path from 'path'
import http from 'http'


const app = express()
const server = http.createServer(app)

app.use(express.static(path.join(__dirname,'../public')))
server.listen(3000)

