import patientService from "../services/patientService";

const postBookAppointment = async (req, res) => {
  try {
    let response = await patientService.postBookAppointment(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

const postVerifyBookAppointment = async (req, res) => {
  try {
    let response = await patientService.postVerifyBookAppointment(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorCode: -1, errorMessage: "Error from the server" });
  }
};

module.exports = {
  postBookAppointment,
  postVerifyBookAppointment,
};
