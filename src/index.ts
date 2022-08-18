import { ApolloServer } from "apollo-server";
import { schema } from "./schema";
import { PollutionAPI } from "./dataSources";

export const server = new ApolloServer({
  schema,
  dataSources: () => {
    return {
      pollutionAPI: new PollutionAPI(),
    };
  },
});

const port = 3000;

server.listen({ port }).then(({ url }) => {
  console.log("Server ready at ", url);
})
