import { objectType, extendType, nonNull, floatArg, list } from 'nexus';

export const Condition = objectType({
  name: "Condition",
  definition(t) {
    t.nonNull.list.nonNull.float("coord");
    t.nonNull.int("aqi");
    t.nonNull.dateTime("updatedAt");
  }
});

export const ConditionQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("condition", {

      type: "Condition",
      args: { coord: nonNull(list(nonNull(floatArg()))) },

      resolve(parent, args, context, info) {
        return context.dataSources.pollutionAPI.getPollution(args.coord);
      }
    })
  }
})
