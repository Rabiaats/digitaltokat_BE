"use strict"

module.exports = function (email) {
  const atIndex = email.indexOf("@");
  const namePart = email.substring(0, atIndex); // örn: "example"
  const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1); // "Example"

  const randomNumbers = Math.floor(10000 + Math.random() * 90000); // 5 haneli rastgele sayı

  return `${capitalized}**${randomNumbers}`;
}
