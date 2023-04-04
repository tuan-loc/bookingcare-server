import _ from "lodash";
import db from "../models/index";
require("dotenv").config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limit,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });

      resolve({ errorCode: 0, data: users });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({ errorCode: 0, data: doctors });
    } catch (error) {
      reject(error);
    }
  });
};

const checkRequiredFields = (data) => {
  let arr = [
    "doctorId",
    "contentHTML",
    "contentMarkdown",
    "action",
    "selectedPrice",
    "selectedPayment",
    "selectedProvince",
    "clinicId",
    "addressClinic",
    "note",
    "description",
    "specialtyId",
    "selectedClinic",
  ];
  let isValid = true;
  let element = "";
  for (let i = 0; i < arr.length; i++) {
    if (!data[arr[i]]) {
      isValid = false;
      element = arr[i];
      break;
    }
  }
  return { isValid, element };
};

const saveDetailInforDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkRequiredFields(data);
      if (!checkObj.isValid) {
        resolve({
          errorCode: 1,
          errorMessage: `Missing parameter: ${checkObj.element} !`,
        });
      } else {
        if (data.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: data.contentHTML,
            contentMarkdown: data.contentMarkdown,
            description: data.description,
            doctorId: data.doctorId,
          });
        } else if (data.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: data.doctorId },
            raw: false,
          });

          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = data.contentHTML;
            doctorMarkdown.contentMarkdown = data.contentMarkdown;
            doctorMarkdown.description = data.description;
            await doctorMarkdown.save();
          }
        }

        let doctorInfor = await db.Doctor_Infor.findOne({
          where: { doctorId: data.doctorId },
          raw: false,
        });
        if (doctorInfor) {
          doctorInfor.doctorId = data.doctorId;
          doctorInfor.priceId = data.selectedPrice;
          doctorInfor.provinceId = data.selectedProvince;
          doctorInfor.paymentId = data.selectedPayment;
          doctorInfor.nameClinic = data.selectedClinic;
          doctorInfor.addressClinic = data.addressClinic;
          doctorInfor.note = data.note;
          doctorInfor.specialtyId = data.specialtyId;
          doctorInfor.clinicId = data.clinicId;
          await doctorInfor.save();
        } else {
          await db.Doctor_Infor.create({
            doctorId: data.doctorId,
            priceId: data.selectedPrice,
            provinceId: data.selectedProvince,
            paymentId: data.selectedPayment,
            nameClinic: data.selectedClinic,
            addressClinic: data.addressClinic,
            note: data.note,
            specialtyId: data.specialtyId,
            clinicId: data.clinicId,
          });
        }

        resolve({
          errorCode: 0,
          errorMessage: "Save information doctor succeed !",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getDetailDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({ errorCode: 1, errorMessage: "Missing required parameter !" });
      } else {
        let data = await db.User.findOne({
          where: { id: id },
          attributes: { exclude: ["password"] },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: { exclude: ["id", "doctorId"] },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }

        if (!data) data = {};

        resolve({ errorCode: 0, data: data });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
      resolve({ error: 1, errorMessage: "Missing required parameter !" });
    } else {
      let schedule = data.arrSchedule;
      if (schedule && schedule.length > 0) {
        schedule = schedule.map((item) => {
          item.maxNumber = MAX_NUMBER_SCHEDULE;
          return item;
        });
      }

      let existing = await db.Schedule.findAll({
        where: { doctorId: data.doctorId, date: data.formatedDate },
        attributes: ["timeType", "date", "doctorId", "maxNumber"],
        raw: true,
      });

      let toCreate = _.differenceWith(schedule, existing, (a, b) => {
        return a.timeType === b.timeType && +a.date === +b.date;
      });

      if (toCreate && toCreate.length > 0) {
        await db.Schedule.bulkCreate(toCreate);
      }

      resolve({ errorCode: 0, errorMessage: "OK" });
    }

    try {
    } catch (error) {
      reject(error);
    }
  });
};

const getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({ errorCode: 1, errorMessage: "Missing required parameter !" });
      } else {
        let data = await db.Schedule.findAll({
          where: { doctorId, date },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: false,
          nest: true,
        });

        if (!data) data = [];

        resolve({ errorCode: 0, data });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getExtraInforDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errorCode: 1,
          errorMessage: "Missing required parameters !",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId,
          },
          attributes: { exclude: ["id", "doctorId"] },
          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });

        if (!data) data = {};
        resolve({ errorCode: 0, data: data });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getProfileDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errorCode: 1,
          errorMessage: "Missing required parameters !",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: doctorId },
          attributes: { exclude: ["password"] },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: { exclude: ["id", "doctorId"] },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }

        if (!data) data = {};

        resolve({ errorCode: 0, data: data });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getListPatient = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({ errorCode: 1, errorMessage: "Missing required paramaters" });
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: "S2",
            doctorId,
            date,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["email", "firstName", "address", "gender"],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataPatient",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        resolve({ errorCode: 0, data });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  saveDetailInforDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
  getListPatient,
};
