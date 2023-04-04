import specialtySevice from "../services/specialtyService";

const createSpecialty = async (req, res) => {
  try {
    let response = await specialtySevice.createSpecialty(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

const getAllSpecialty = async (req, res) => {
  try {
    let response = await specialtySevice.getAllSpecialty();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

const getDetailSpecialtyById = async (req, res) => {
  try {
    let response = await specialtySevice.getDetailSpecialtyById(
      req.query.id,
      req.query.location
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

module.exports = {
  createSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
};
