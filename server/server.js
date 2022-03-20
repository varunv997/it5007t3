const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language')

let reservations = []

const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
  },
});

const resolvers = {
  Query: {
    reservationList
  },
  Mutation: {
    createReservation,
    deleteReservation
  },
  GraphQLDate
};

function reservationList() {
  return reservations;
}

function createReservation(_, { reservation }) {
  reservations.push(reservation);
  return reservation
}


function deleteReservation(_, { id }) {
  reservations = reservations.filter(item => !(item.id == id.toString()));
}


const server = new ApolloServer ({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();

app.use(express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, function () {
  console.log('App started on port 3000');
});
