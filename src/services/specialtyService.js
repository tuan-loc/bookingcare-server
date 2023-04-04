import db from "../models/index";

const createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.descriptionMarkdown ||
        !data.descriptionHTML ||
        !data.imageBase64
      ) {
        resolve({ errorCode: 1, errorMessage: "Missing parameter !" });
      } else {
        await db.Specialty.create({
          name: data.name,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({ errorCode: 0, errorMessage: "OK" });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
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

const getDetailSpecialtyById = (id, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !location) {
        resolve({ errorCode: 1, errorMessage: "Missing parameter !" });
      } else {
        let data = await db.Specialty.findOne({
          where: { id },
          attributes: ["descriptionHTML", "descriptionMarkdown"],
        });

        if (data) {
          let doctorSpecialty = [];
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: id },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: id, provinceId: location },
              attributes: ["doctorId", "provinceId"],
            });
          }

          data.doctorSpecialty = doctorSpecialty;
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
  createSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
};
