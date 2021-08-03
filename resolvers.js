require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.resolvers = {
  Query: {
    loginByToken: async (_, { token }, { Authors }) =>
      await jwt.verify(token, process.env.SEED, (error, data) => {
        if (data) return Authors.findOne({ author: data.user.author })
      }),

    findRecipesByPage: async (_, { page }, { Recipes }) => {
      const recipes = await Recipes.find()
      return recipes.reverse().splice(page * 12, 12)
    },

    findRecipeByName: async (_, { recipeName }, { Recipes }) => await Recipes.findOne({ recipeName }),
    getImage: async (_, { name }, { Images }) => await Images.findOne({ name }),
    findAuthor: async (_, { author }, { Authors }) => await Authors.findOne({ author }),
    findAllAuthors: async (_, __, { Authors }) => await Authors.find(),
    getTotalRecipes: async (_, __, { Recipes }) => {
      const totalRecipes = await Recipes.find()
      return { qty: totalRecipes.length, optionList: totalRecipes }
    },

    loginWhithPassword: async (_, { email, password }, { Authors, Login }) => {
      const userLogin = await Login.findOne({ email })
      const comparedPasswords = await bcrypt.compare(password, userLogin.password).then((boolean) => boolean)
      if (comparedPasswords) {
        const user = await Authors.findOne({ author: userLogin.author })
        const token = await jwt.sign({ user }, process.env.SEED, {
          expiresIn: "30d"
        })
        return { token, authors: user }
      }
    }
  },
  Mutation: {
    createUser: async (_, { name, email, password }, { Authors, Login }) => {
      const alreadyExist = await Authors.find({ name })
      if (alreadyExist.length === 0) {
        const encryptedPassword = await bcrypt.hash(password, 12)
        new Login({ name, email, password: encryptedPassword }).save()
        const user = await new Authors({ author: name }).save()
        const token = await jwt.sign({ user }, process.env.SEED, {
          expiresIn: "30d"
        })
        console.log("User created:", { token, user })
        return { token, user }
      }
    },
    createRecipe: async (
      _,
      { userData, author, recipeName, description, ingredients, steps, image },
      { Recipes, Images, Authors }
    ) => {
      new Images({ data: image.data, name: image.frontImage }).save()

      const newRecipe = await new Recipes({
        author,
        recipeName,
        description,
        ingredients,
        steps,
        frontImage: image.frontImage
      }).save()

      const newAuthor = await Authors.findByIdAndUpdate(
        userData.id,
        { recipes: userData.recipes.concat(newRecipe) },
        { useFindAndModify: false }
      )
      return newAuthor
    }
  }
}
