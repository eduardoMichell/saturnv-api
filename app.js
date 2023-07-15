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
app.use('/rv', require('./core/controllers/RvController'))


const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running on port: ${PORT} - DOCS: http://localhost:${PORT}/api-docs/#/`))

