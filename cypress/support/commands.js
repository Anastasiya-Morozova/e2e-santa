// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const loginPage = require("../fixtures/pages/loginPage.json");
const generalElements = require("../fixtures/pages/general.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const boxPage = require("../fixtures/pages/boxPage.json");

Cypress.Commands.add("login", (userName, password) => {
  cy.get(loginPage.loginField).type(userName);
  cy.get(loginPage.passwordField).type(password);
  cy.get(generalElements.submitButton).click({ force: true });
});

Cypress.Commands.add("toss", () => {
  cy.get(invitePage.settingsBtn).click();
  cy.get(invitePage.tossing).click();
  cy.get(generalElements.submitButton).click();
  cy.get(invitePage.tossingBtn).click();
});

Cypress.Commands.add("addUsers", (users) => {
  cy.get(generalElements.submitButton).click();
  cy.get(".switch__toggle").click();
  for (let i = 0; i < users.length; i++) {
    cy.get(`:nth-child(${i * 2 + 1}) > .frm-wrapper > #input-table-${i}`).type(
      users[i].name
    );
    cy.get(`:nth-child(${i * 2 + 2}) > .frm-wrapper > #input-table-${i}`).type(
      users[i].email
    );
  }
  cy.get(invitePage.inviteBtn).click();
});

Cypress.Commands.add("createBox", (newBoxName, maxAmount, currency) => {
  cy.get('.home-page-buttons > [href="/box/new"] > .btn-main').click();
  cy.get(boxPage.boxNameField).type(newBoxName);
  return cy
    .get(boxPage.idField)
    .invoke("val")
    .then((v) => {
      cy.get(generalElements.arrowRight).click();
      cy.get(boxPage.sixthIcon).click();
      cy.get(generalElements.arrowRight).click();
      cy.get(".switch__toggle").click();
      cy.get(boxPage.maxAnount).type(maxAmount);
      cy.get(boxPage.currency).select(currency);
      cy.get(generalElements.arrowRight).click();
      cy.get(generalElements.arrowRight).click();

      return cy.log(v).then(() => v);
    });
});
