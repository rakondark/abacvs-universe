// connect
const mysql = require('mysql2');

module.exports = async (params) => new Promise(
(resolve, reject) => {
  const connection = mysql.createConnection(params);

  connection.connect(error => {
	  if (error) {
      reject(error);
      return;
    }
    resolve(connection);
  });
  /*
  connection.config.queryFormat = function (query, values) {
    if (!values) return query;
    return query.replace(/\:(\w+)/g, function (txt, key) {
      if (values.hasOwnProperty(key)) {
        return this.escape(values[key]);
      }
      return txt;
    }.bind(this));
  };
  */
});