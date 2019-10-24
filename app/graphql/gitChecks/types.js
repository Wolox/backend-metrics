const { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLFloat } = require('graphql');

exports.gitStatsByTech = new GraphQLObjectType({
  name: 'GitStatsByTech',
  fields: {
    tech_name: { type: GraphQLString },
    value: { type: GraphQLFloat }
  }
});

exports.proyectGitStats = new GraphQLObjectType({
  name: 'Project',
  fields: {
    id: { type: GraphQLID },
    pickUpTimeAvg: { type: this.gitStatsByTech }
  }
});
