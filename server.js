require("dotenv").config()
const mongoose = require("mongoose")

const Authors = require("./models/Authors")
const Images = require("./models/Images")
const Login = require("./models/Login")
const Recipes = require("./models/Recipes")

const { ApolloServer } = require("apollo-server")
const { typeDefs } = require("./schema")
const { resolvers } = require("./resolvers")

// mongoose
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
  if (err) console.error("DB error:", err)
  else console.log("DB running")
})
//creation and config of the apollo-server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req: { params } }) => ({
    params,
    Authors,
    Images,
    Login,
    Recipes
  }),
  introspection: true,
  playground: true
})

server.listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => {
  console.log(`Server ready at: ${url}`)
})
