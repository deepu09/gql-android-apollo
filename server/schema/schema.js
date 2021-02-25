const  graphql = require('graphql');
const { argsToArgsConfig } = require('graphql/type/definition');
var _ = require('lodash');
const User = require('../model/user');
const Hobby = require('../model/hobby');
const Post = require('../model/post');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql

//Create types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},
        salary: {type: GraphQLString},
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({userId: parent.id});
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({userId: parent.id});
            }
        }
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobbies of individual users',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId)
            }
        }
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post made by the user',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        }
    })
});

//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({});
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({})
            }
        },
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return User.findById(args.id)
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Hobby.findById(args.id)
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Post.findById(args.id)
            }
        }
    }
});

//Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: GraphQLString},
                salary: {type: GraphQLString}
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession,
                    salary : args.salary
                });
                return user.save();
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id : {type: new GraphQLNonNull(GraphQLID)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: new GraphQLNonNull(GraphQLString)},
                salary: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                if (args.name !== undefined) {
                                
                }
                return updatedUser = User.findByIdAndUpdate(
                    args.id, 
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession,
                            salary: args.salary
                        }
                    },
                    { new: true, upsert: true }//Send back the updated objectType
                )
            }
        },
        removeUser: {
            type: UserType,
            args: {
                id : {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let removedUser = User.findByIdAndRemove(args.id).exec();
                if (!removedUser) {
                    throw new ("Error");
                }
                return removedUser;
            }

        },
        createPost: {
            type: PostType,
            args: {
                comment: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let post = new Post({
                    comment: args.comment,
                    userId: args.userId
                });
                return post.save();
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                comment: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                return updatedPost = Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            comment: args.comment
                        }
                    },
                    {new: true}
                )
            }
        },
        removePost: {
            type: PostType,
            args: {
                id : {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let removedPost = Post.findByIdAndRemove(args.id).exec();
                if(!removedPost) {
                    throw new ("Error");
                }
                return removedPost;
            }

        },
        createHobby: {
            type: HobbyType,
            args: {
                title: {type: GraphQLString},
                description: {type: GraphQLString},
                userId: {type:GraphQLID}
            },
            resolve(parent, args) {
                let hobby = new Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                });
                return hobby.save();
            }
        },
        updateHobby: {
            type: HobbyType,
            args: {
                id : {type: new GraphQLNonNull(GraphQLID)},
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                return updatedHobby = Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            title: args.title,
                            description: args.description
                        }
                    },
                    {new: true}
                )
            }
        },
        removeHobby: {
            type: HobbyType,
            args: {
                id : {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let removedHobby = Hobby.findByIdAndRemove(args.id).exec();
                if(!removedHobby) {
                    throw new ("Error");
                }
                return removedHobby;
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});