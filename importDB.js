require("dotenv").config();
const { connectDB, disconnectDB } = require("./db/connect");
const User = require("./model/user");
const Property = require("./model/property");

const userData = require("./Data/userData.json");
const propertyData = require("./Data/propertyData.json");

const Import = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    async function seedUsers() {
      try {
        await User.insertMany(userData);
        console.log("Users seeded successfully.");
      } catch (error) {
        console.error("Error seeding users:", error);
      }
    }
    async function seedProperties() {
      try {
        const users = await User.find(); // Get all users

        for (const property of propertyData) {
          const randomUser = users[Math.floor(Math.random() * users.length)]; // Get a random user
          property.owner = randomUser._id; // Assign the random user as the owner

          await Property.create(property);
        }

        console.log("Properties seeded successfully.");
      } catch (error) {
        console.error("Error seeding properties:", error);
      }
    }

    // Seed users first
    await User.deleteMany();
    seedUsers()
      .then(async () => {
        // Then seed properties with random owners
        await Property.deleteMany();
        seedProperties()
          .then(() => {
            // Close the database connection when done
            disconnectDB();
          })
          .catch((error) => {
            console.error("Error seeding properties:", error);
          });
      })
      .catch((error) => {
        console.error("Error seeding users:", error);
      });
    console.log("success");
  } catch (error) {
    console.log(error);
  }
};
module.exports = { Import };
