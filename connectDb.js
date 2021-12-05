const mysql = require("mysql")
if (process.env.appEnvironment == "production") {
  var sqldb = mysql.createPool({
    connectionLimit: 10,
    host: process.env.awsserver,
    port: process.env.awsport,
    user: process.env.awsuser,
    password: process.env.awspass,
    database: process.env.awsdb,
  })
} else if (process.env.appEnvironment == "fh") {
  var sqldb = mysql.createPool({
    connectionLimit: 10,
    host: process.env.fhserver,
    port: process.env.fhport,
    user: process.env.fhuser,
    password: process.env.fhpassword,
    database: process.env.fhdb,
  })
} else {
  var sqldb = mysql.createPool({
    connectionLimit: 10,
    host: process.env.stagingAwsserver,
    port: process.env.awsport,
    user: process.env.awsuser,
    password: process.env.stagingAwspass,
    database: process.env.awsdb,
  })
}

sqldb.getConnection((err, connection) => {
  if (err) {
    if (
      err.code === "PROTOCOL_CONNECTION_LOST" ||
      err.code === "ECONNREFUSED" ||
      err.code === "ER_CON_COUNT_ERROR" ||
      err.code === "PROTOCOL_SEQUENCE_TIMEOUT"
    )
      console.error(`Database connection was closed. Error: ${err.code}`)
    else console.log(err)
  } else {
    console.log(
      `Database Connected \n\x1b[34mEnvironment:\x1b[0m ${process.env.appEnvironment}\n\x1b[34mEndpoint:\x1b[0m ${sqldb.config.connectionConfig.host} \n\x1b[34mThread:\x1b[0m ${connection.threadId}`
    )
  }
  if (connection) connection.release()
  return
})

module.exports = sqldb
