const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  //пользователь 1 логинится
  //пользователь 1 создает коробку
  //пользователь 1 получает приглашение
  //пользователь 2 переходит по приглашению
  //пользователь 2 заполняет анкету
  //пользователь 3 переходит по приглашению
  //пользователь 3 заполняет анкету
  //пользователь 4 переходит по приглашению
  //пользователь 4 заполняет анкету
  //пользователь 1 логинится
  //пользователь 1 запускает жеребьевку
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let wishes = faker.word.noun() + faker.word.adverb() + faker.word.adjective();
  let maxAmount = 50;
  let currency = "Евро";
  let inviteLink;

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users[0].email, users[0].password);
    cy.get('.home-page-buttons > [href="/box/new"] > .btn-main').click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.sixthIcon).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(".switch__toggle").click();
    cy.get(boxPage.maxAnount).type(maxAmount);
    cy.get(boxPage.currency).select(currency);
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
    cy.get(".layout-1__header-wrapper-fixed .toggle-menu-item span")
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("add participants", () => {
    //inviting users without confirmation via emails
    cy.get(generalElements.submitButton).click();
    cy.get(".switch__toggle").click();
    for (let i = 0; i < users.length-1; i++) {
      cy.get(`:nth-child(${i*2+1}) > .frm-wrapper > #input-table-${i}`).type(users[i+1].name);
      cy.get(`:nth-child(${i*2+2}) > .frm-wrapper > #input-table-${i}`).type(users[i+1].email);
    }
    cy.get(invitePage.inviteBtn).click();
    cy.get('.txt-secondary > .base--clickable').contains("добавить еще участников.").should("exist");
  });

  it("tossing",()=>{
    cy.get(invitePage.settingsBtn).click();
    cy.get(invitePage.tossing).click();
    cy.get(generalElements.submitButton).click();
    cy.get(invitePage.tossingBtn).click();
    cy.clearCookies();
  })

  after("delete box", () => {
    cy.visit("/login");
    cy.login(users[0].email, users[0].password);
    cy.get(
      '.layout-1__header-wrapper-fixed > .layout-1__header > .header > .header__items > .layout-row-start > [href="/account/boxes"] > .header-item > .header-item__text > .txt--med'
    ).click();
    cy.get(":nth-child(1) > a.base--clickable > .user-card").first().click();
    cy.get(
      ".layout-1__header-wrapper-fixed > .layout-1__header-secondary > .header-secondary > .header-secondary__right-item > .toggle-menu-wrapper > .toggle-menu-button > .toggle-menu-button--inner"
    ).click();
    cy.contains("Архивация и удаление").click({ force: true });
    cy.get(":nth-child(2) > .form-page-group__main > .frm-wrapper > .frm").type(
      "Удалить коробку"
    );
    cy.get(".btn-service").click();
  });
});
