const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../config/swaggerConfig");
const apiRoutes = require("./routes/apiRoutes");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Nothing strange happening in: ${port}`);
});
