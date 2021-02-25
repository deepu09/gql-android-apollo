const  graphql = require('graphql');
const { buildResolveInfo } = require('graphql/execution/execute');

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLNonNull
} = graphql

//Scalar Type
/*
    String
    int
    Float
    Boolean
    ID
*/
var persons = [
    {id: '1', name: "Pradeep Kaja", age: 35, isMarried: true, gpa: 3.67},
];

const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'Represents a person type',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: GraphQLInt},
        isMarried: {type: GraphQLBoolean},
        gpa: {type: GraphQLFloat},

        justAType: {
            type: Person,
            resolve(parent, args) {
                return parent;
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Types of Graph QL',
    fields: {
        person: {
            type: Person,
            resolve(parent, args) {
                let person = {
                    //id: {type: GraphQLID},
                    name: 'Pradeep Kaja',
                    age: 35,
                    isMarried: true,
                    gpa: 3.67,
                };
                return person;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})