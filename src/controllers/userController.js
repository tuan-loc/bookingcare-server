import userService from "../services/userService";

const handleLogin = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).json({
      errorCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  let userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errorCode: userData.errorCode,
    message: userData.errorMessage,
    user: userData.user ? userData.user : {},
  });
};

const handleGetAllUser = async (req, res) => {
  let { id } = req.query;

  if (!id) {
    return res.status(200).json({
      errorCode: 1,
      errorMessage: "Missing required parameters !",
      users: [],
    });
  }

  let users = await userService.getAllUsers(id);
  return res.status(200).json({
    errorCode: 0,
    errorMessage: "OK",
    users,
  });
};

const handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
};

const handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errorCode: 1,
      errorMessage: "Missing required parameters !",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};

const handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUser(data);
  return res.status(200).json(message);
};

const getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      errorCode: -1,
      errorMessage: "Error from server",
    });
  }
};

module.exports = {
  handleLogin,
  handleGetAllUser,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
};
