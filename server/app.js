const express  = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');

const schema = require('./schema/schema');
const test = require('./schema/types_schema');

const port = process.env.PORT || 4000;

const app = express();

mongoose.connect('mongodb+srv://deepu01:test0123@testcluster.5ttws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', () => {
    console.log('Hurray! we are connected!');
})

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}))

app.use('/types', graphqlHTTP({
    graphiql: true,
    schema: test
}))

app.listen(port, () => {
    console.log('Listening for requests on my awesome port 4000');
}) 