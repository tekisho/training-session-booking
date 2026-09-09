const mongoose = require('mongoose');

const localhost = "mongodb://127.0.0.1:27017/trainingSessionDB";

async function connectToDatabase(url) {
  try {
    const connect = await mongoose.connect(url);
    console.log (
      "Database connected to server successfully:",
      connect.connection.host + " |",
      connect.connection.name
    );
  } catch(err) {
      console.log(err);
      process.exit(1);
  }
};

async function connectToLocalDatabase() {
    await connectToDatabase(localhost);
};

module.exports = {
    connectToDatabase,
    connectToLocalDatabase,
};