const { gql } = require("apollo-server")

exports.typeDefs = gql`
  type Query {
    loginByToken(token: String): Authors
    findRecipesByPage(page: Int): [Recipes]!
    getImage(name: String!): Images!
    findAuthor(author: String!): Authors!
    getTotalRecipes: TotalRecipes!
    findRecipeByName(recipeName: String): Recipes!
    loginWhithPassword(email: String!, password: String!): LoogedUser
  }

  type LoogedUser {
    token: String
    user: Authors
  }
  type TotalRecipes {
    qty: Int
    optionList: [Recipes]!
  }
  type Authors {
    id: ID
    author: String!
    recipes: [Recipes]
  }
  type Images {
    data: String!
    name: String!
  }
  type Login {
    author: String!
    email: String!
    password: String!
  }
  type Recipes {
    author: String
    recipeName: String
    description: String
    ingredients: [Ingredients]
    steps: [String]
    frontImage: String
  }
  type Ingredients {
    ingredient: String!
    quantity: String
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): LoogedUser
    createRecipe(
      userData: Author
      author: String
      recipeName: String!
      description: String!
      ingredients: [Ingredient!]
      steps: [String!]
      image: Image
    ): Authors
  }
  input Ingredient {
    ingredient: String!
    quantity: String
  }
  input Image {
    frontImage: String!
    data: String!
  }
  input Author {
    id: ID
    author: String!
    recipes: [Recipe]
  }
  input Recipe {
    author: String
    recipeName: String
    description: String
    ingredients: [Ingredient]
    steps: [String]
    frontImage: String
  }
`
