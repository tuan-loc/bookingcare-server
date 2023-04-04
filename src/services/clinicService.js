import db from "../models/index";

const createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.imageBase64
      ) {
        resolve({ errorCode: 1, errorMessage: "Missing parameter" });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
          image: data.imageBase64,
        });
        resolve({ errorCode: 0, errorMessage: "OK" });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({ errorCode: 0, errorMessage: "OK", data });
    } catch (error) {
      reject(error);
    }
  });
};

const getDetailClinicById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({ errorCode: 1, errorMessage: "Missing parameter !" });
      } else {
        let data = await db.Clinic.findOne({
          where: { id },
          attributes: [
            "descriptionHTML",
            "descriptionMarkdown",
            "name",
            "address",
          ],
        });

        if (data) {
          let doctorClinic = [];
          doctorClinic = await db.Doctor_Infor.findAll({
            where: { clinicId: id },
            attributes: ["doctorId", "provinceId"],
          });

          data.doctorClinic = doctorClinic;
        } else {
          data = {};
        }
        resolve({ errorCode: 0, errorMessage: "OK", data });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createClinic,
  getAllClinic,
  getDetailClinicById,
};
