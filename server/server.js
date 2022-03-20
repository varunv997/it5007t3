const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language')
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/reservations';

let db;

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
    reservationList,
    blacklist
  },
  Mutation: {
    createReservation,
    deleteReservation,
    createBlacklist
  },
  GraphQLDate
};

async function reservationList() {
  let reservations = await db.collection('reservations').find({}).toArray();
  return reservations;
}

async function blacklist() {
  let blacklist = await db.collection('blacklist').find({}).toArray();
  return blacklist;
}

async function createReservation(_, { reservation }) {
  const result = await db.collection('reservations').insertOne(reservation);
  const savedReservation = await db.collection('reservations')
    .findOne({ _id: result.insertedId }); 
  return savedReservation;
}

async function deleteReservation(_, { id }) {
  //reservations = reservations.filter(item => !(item.id == id.toString()));
  reservation = await db.collection('reservations').findOne({}, {id:id})
  const result = await db.collection('reservations').deleteOne({id: id});
  return reservation;
}

async function createBlacklist(_, { customer }) {
  const result = await db.collection('blacklist').insertOne(customer);
  const savedBlacklist = await db.collection('blacklist')
    .findOne({ _id: result.insertedId });
  return savedBlacklist;
}


const server = new ApolloServer ({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});


async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const app = express();

app.use(express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });

(async function () {
  try {
    await connectToDb();
    app.listen(3000, function () {
      console.log('App started on port 3000');
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();