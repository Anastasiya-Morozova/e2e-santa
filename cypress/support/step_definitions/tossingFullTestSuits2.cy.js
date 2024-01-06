import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
const dashboardPage = require("../../fixtures/pages/dashboardPage.json");
var boxKey = [];
import { faker } from "@faker-js/faker";
let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });

Given("User visits the secret santa website", function () {
  cy.visit("/login");
});
Then(
  "User logins with email: {string} and password: {string}",
  function (email, password) {
    cy.login(email, password);
  }
);
When(
  "User creates a box with a random name, max amount: {int}, and currency: {string}",
  function (maxAmount, currency) {
    cy.createBox(newBoxName, maxAmount, currency).then((val) => {
      boxKey.push(val);
    });
  }
);
Then(
  "User is redirected to the dashboard page and should see the box name",
  function () {
    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
  }
);
Then("User sees menu items: Участники, Моя карточка, Подопечный", function () {
  cy.get(".layout-1__header-wrapper-fixed .toggle-menu-item span")
    .invoke("text")
    .then((text) => {
      expect(text).to.include("Участники");
      expect(text).to.include("Моя карточка");
      expect(text).to.include("Подопечный");
    });
});
When("User adds next participants:", function (dataTable) {
  const data = dataTable.hashes();
  cy.addUsers(data);
});
Then("User should see 'добавить еще участников.'", function () {
  cy.get(".txt-secondary > .base--clickable")
    .contains("добавить еще участников.")
    .should("exist");
});
When("User tosses", function () {
  cy.toss();
});
Then("User should see 'Жеребьевка проведена'", function (string) {
  cy.get(".picture-notice__title").should("have.text", "Жеребьевка проведена");
});
Then("Cookies are cleaned", function () {
  cy.clearCookies();
});
Then("Request to delete the box is sent", function () {
  cy.request("DELETE", `https://staging.lpitko.ru/api/box/${boxKey[0]}`);
});
