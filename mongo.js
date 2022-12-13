const mongoose = require("mongoose");
const password = process.argv[2];
const personName = process.argv[3] ?? "";
const personNumber = process.argv[4] ?? "";

async function createUser(name, number) {
  const person = new Person({
    name: name,
    number: number,
  });
  await person.save();
  console.log("person saved");
}

async function getUsers() {
  const result = await Person.find({});
  return result;
}

async function main() {
  if (process.argv.length === 5) {
    await createUser(personName, personNumber);
  } else {
    const people = await getUsers();
    people.forEach((person) => console.log(person));
  }

  mongoose.connection.close();
}

main();
