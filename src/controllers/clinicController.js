import clinicService from "../services/clinicService";

const createClinic = async (req, res) => {
  try {
    let response = await clinicService.createClinic(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

const getAllClinic = async (req, res) => {
  try {
    let response = await clinicService.getAllClinic();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

const getDetailClinicById = async (req, res) => {
  try {
    let response = await clinicService.getDetailClinicById(req.query.id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

module.exports = {
  createClinic,
  getAllClinic,
  getDetailClinicById,
};
