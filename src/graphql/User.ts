import { objectType, extendType, stringArg, intArg, nonNull, list, floatArg } from 'nexus';

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
    t.string('email');
    t.int('phone');
    t.nonNull.list.nonNull.float("coord");
  },
});

export const SignUp = objectType({
  name: "SignUp",
  definition(t) {
    t.nonNull.field('user', { type: "User" }),
    t.nonNull.field("condition", { type: "Condition" })
  }
})

export const UserSignUp = extendType({
  type: "Mutation",
  definition(t) {

    t.nonNull.field("signup", {

      type: "SignUp",
      args: {
        email: stringArg(),
        phone: intArg(),
        name: nonNull(stringArg()),
        coord : nonNull(list(nonNull(floatArg())))
      },

      async resolve(parent, args, context) {
        const { email, phone, name, coord } = args;

        if (!email && !phone) {
          throw new Error("Both phone and email cannot be null");
        }

//        const user = await context.prisma.user.create({
//          data: {
//            email: email,
//            phone: phone,
//            name: name,
//            coord: coord
//          },
//        });

        const condition: Promise<{
          aqi: number;
          coord: number[];
          updatedAt: any;
        }> = await context.dataSources.pollutionAPI.getPollution(coord);

        const user = {
          id: 9,
          email: 'etsat',
          phone: 8908009,
          name: 'setas',
          coord: [50, 50]

        }

        console.log('Condition from User.ts', condition);
        console.log('User prisma stuff from User.ts', user);

        return {
          user,
          condition
        }

      },
    });

  },

})
