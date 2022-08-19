import { ApolloServer } from "apollo-server";
import { PollutionAPI } from "./dataSources";
import { PrismaClient } from '@prisma/client';

import { schema } from "./schema";
import { context } from './context';

export const prisma = new PrismaClient();

export const server = new ApolloServer({
  schema,
  context,
  introspection: true,
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
