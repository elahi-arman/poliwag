const { MongoClient } = require("mongodb");

let client;

const PollyDB = {
  client: client,
  initialize: function (user, password) {
    const uri = `mongodb+srv://${user}:${password}@polly.seqsf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect().db("polly").command({ ping: 1 });
  },

  close: () => {
    client.close();
  },
};
