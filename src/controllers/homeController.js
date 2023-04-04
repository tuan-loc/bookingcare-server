import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs");
  } catch (error) {
    console.log(error);
  }
};

let getCRUD = (req, res) => {
  return res.send("get CRUD");
};

const postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send("post crud from server");
};

const displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  return res.send("display get CRUD");
};

const getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDService.getUserInfoById(userId);
    console.log(userData);
    return res.send("Found user");
  } else {
    return res.send("user not found!");
  }
};

const putCRUD = async (req, res) => {
  let data = req.body;
  await CRUDService.updateUserData(data);
  return res.send("update done");
};

const deleteCRUD = async (req, res) => {
  let id = req.query.id;

  if (id) {
    await CRUDService.deleteUserById(id);
    return res.send("Delete user success");
  } else {
    return res.send("user not found");
  }
};

module.exports = {
  getHomePage,
  getCRUD,
  postCRUD,
  displayGetCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};
