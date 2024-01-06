Feature: User creates a box, adds users, tosses and deletes the box

Scenario: User logins on the secret santa website and create a box
Given User visits the secret santa website
Then User logins with email: "nmorozova283@gmail.com" and password: "qwerty123"
When User creates a box with a random name, max amount: 50, and currency: "Евро"
Then User is redirected to the dashboard page and should see the box name
Then User sees menu items: Участники, Моя карточка, Подопечный

Scenario: User adds participants
When User adds next participants:
|email                           | name    |
|nmorozova283+test1@gmail.com    | test1   |
|nmorozova283+test2@gmail.com    | test2   |
|nmorozova283+test3@gmail.com    | test3   |
Then User should see 'добавить еще участников.'

Scenario: User tosses
When User tosses
Then User should see 'Жеребьевка проведена'
Then Cookies are cleaned

Scenario: User logins and deletes the box
Given Cookies are cleaned
When User visits the secret santa website
Then User logins with email: "nmorozova283@gmail.com" and password: "qwerty123"
Then Request to delete the box is sent
