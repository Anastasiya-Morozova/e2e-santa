const users = require("../fixtures/users.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");

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
  let maxAmount = 50;
  let currency = "Евро";
  var boxKey = [];

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users[0].email, users[0].password);
    cy.createBox(newBoxName, maxAmount, currency).then((val) => {
      boxKey.push(val);
    });
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
    cy.addUsers(users);
    cy.get(".txt-secondary > .base--clickable")
      .contains("добавить еще участников.")
      .should("exist");
  });

  it("tossing", () => {
    cy.toss();
    cy.get(".picture-notice__title").should(
      "have.text",
      "Жеребьевка проведена"
    );
    cy.clearCookies();
  });

  after("delete box", () => {
    cy.clearCookies();
    cy.visit("/login");
    cy.login(users[0].email, users[0].password);
    cy.request("DELETE", `https://staging.lpitko.ru/api/box/${boxKey[0]}`);
  });
});
