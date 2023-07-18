const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')

const app = express()

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger/swagger_autogen.json')

require('dotenv').config()

app.use(cors())
app.use(express.json());
app.use(bodyParser.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/', require('./core/controllers/RvController'))


app.listen(3001, () => console.log(`Server is up`))

