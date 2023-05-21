import mongoose from "mongoose";
export const connectBD = () => {
  mongoose
    .connect(process.env.MongoURI, {
      dbName: "PostHub",
    })
    .then((c) => console.log(`Database is connected with ${c.connection.host}`))
    .catch((e) => console.log(e));
};
