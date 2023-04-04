import doctorService from "../services/doctorService";

const getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;

  try {
    let response = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, message: "Error from server..." });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

const postInforDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInforDoctor(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

const getDetailDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

const bulkCreateSchedule = async (req, res) => {
  try {
    let data = await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

const getScheduleByDate = async (req, res) => {
  try {
    let data = await doctorService.getScheduleByDate(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

const getExtraInforDoctorById = async (req, res) => {
  try {
    let data = await doctorService.getExtraInforDoctorById(req.query.doctorId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

const getProfileDoctorById = async (req, res) => {
  try {
    let data = await doctorService.getProfileDoctorById(req.query.doctorId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

const getListPatient = async (req, res) => {
  try {
    let data = await doctorService.getListPatient(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  postInforDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
  getListPatient,
};
