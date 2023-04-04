"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        email: "admin@gmail.com",
        password:
          "$2a$10$xe9V2DWs9u8SZ4X1ojxvF.dpU6APwzpZaWZ91xiPid8dul4g8fWMe",
        firstName: "Tuan",
        lastName: "Loc",
        address: "HCM city",
        gender: 1,
        roleId: "ROLE",
        phoneNumber: "1234",
        positionId: "",
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
