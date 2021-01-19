const dbHost = "127.0.0.1";
const dbName = "delilah_resto";
const dbPort = "3306";
const dbUser = "root";
const password = "Andres2310.";

const dbPath = `mysql://${dbUser}:${password}@${dbHost}:${dbPort}/`;

export default { dbName, dbPath };