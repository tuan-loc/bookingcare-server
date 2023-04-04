import db from "../models/index";
import bcrypt from "bcryptjs";

let salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

const handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          where: { email: email },
          attributes: [
            "id",
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
          ],
          raw: true,
        });

        if (user) {
          let check = await bcrypt.compareSync(password, user.password);

          if (check) {
            userData.errorCode = 0;
            userData.errorMessage = "Ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.errorCode = 3;
            userData.errorMessage = "Wrong password !";
          }
        } else {
          userData.errorCode = 2;
          userData.errorMessage = `User's not found !`;
        }
      } else {
        userData.errorCode = 1;
        userData.errorMessage = `Your's email isn't exist in your system. Please try other email !`;
      }

      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

const checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { email: userEmail } });

      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }

      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: { exclude: ["password"] },
        });
      }

      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

const createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check) {
        resolve({
          errorCode: 1,
          errorMessage:
            "Your email is already in used. Please try another email!",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.avatar,
        });
        resolve({
          errorCode: 0,
          message: "OK",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id } });

      if (!user) {
        resolve({
          errorCode: 2,
          errorMessage: `The user isn't exist !`,
        });
      } else {
        await db.User.destroy({
          where: { id },
        });
        resolve({
          errorCode: 0,
          message: `The user is deleted !`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.positionId || !data.gender) {
        resolve({
          errorCode: 2,
          errorMessage: "Missing required parameters !",
        });
      }
      let user = await db.User.findOne({ where: { id: data.id }, raw: false });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        user.gender = data.gender;
        user.phoneNumber = data.phoneNumber;

        if (data.avatar) {
          user.image = data.avatar;
        }

        await user.save();

        resolve({
          errorCode: 0,
          message: "Update the user succeeds !",
        });
      } else {
        resolve({
          errorCode: 1,
          errorMessage: "User's not found !",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllCodeService = (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!type) {
        resolve({
          errorCode: 1,
          errorMessage: "Missing required parameters !",
        });
      } else {
        let response = {};
        let allcode = await db.Allcode.findAll({ where: { type } });
        response.errorCode = 0;
        response.data = allcode;
        resolve(response);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin,
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUser,
  getAllCodeService,
};
