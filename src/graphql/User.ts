import { objectType, extendType, stringArg, intArg, nonNull, list, floatArg } from 'nexus';
import { NexusGenObjects } from "../../nexus-typegen";

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


export const SafeUser = objectType({
  name: "SafeUser",
  definition(t) {
    t.nonNull.field('name', { type: "String" })
  }
})

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("users", {
      type: nonNull(list(nonNull(SafeUser))),

      async resolve(_, _args, context) {
        const data = await context.prisma.user.findMany({
          select: { name: true },
        });
        console.log('Data: ', data);
        return data;
      }
    })
  }
});

export const UserAccount = extendType({
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

      async resolve(_, args, context) {
        const { email, phone, name, coord } = args;

        if (!email && !phone) {
          throw new Error("Both phone and email cannot be null");
        }

        const user = await context.prisma.user.create({
          data: {
            email: email,
            phone: phone,
            name: name,
            coord: coord
          },
        });

        const condition: Promise<{
          aqi: number;
          coord: number[];
          updatedAt: any;
        }> = await context.dataSources.pollutionAPI.getPollution(coord);

        console.log('Condition from User.ts', condition);
        console.log('User prisma stuff from User.ts', user);

        return {
          user,
          condition
        }

      },
    });

    t.nonNull.field("delete", {
      type: "User",
      args: {
        name: nonNull(stringArg()),
        email: stringArg(),
        phone: intArg(),
      },

      async resolve(_, args, context) {
        const { email, phone } = args;

        if (!email && !phone) {
          throw new Error("Both phone and email cannot be null");
        } else if (email) {
          const user = await context.prisma.user.delete({
            where: {
              email: email,
            }

          });

          return user;

        } else if (phone) {
          const user = await context.prisma.user.delete({
            where: {
              phone: phone,
            }
          });

          return user;
        } else {
          const user = await context.prisma.user.delete({
            where: {
              phone: phone!,
              email: email!,
            }
          });

          return user;

        }
      }
    })

  },

})
