const { Contact } = require("../models/contact");
const { cloudinary } = require("../utils/cloudinary.js");
const { ctrlWrapper, HttpError } = require("../helpers");
const { cloudinaryUploadFiles } = require("../utils/cloudinary");
const deleteManyFiles = require("../utils/deleteManyFiles");
const sendEmail = require("../helpers/sendEmail");

const getAll = async (req, res) => {
  const result = await Contact.find({}, "-createdAt -updatedAt");
  res.json(result);
};

const add = async (req, res) => {
  const files = req.files;
  console.log(files);
  const filePathes = files.map(({ path }) => path);
  console.log(filePathes);

  const cloudinaryUploadedFiles = await cloudinaryUploadFiles(filePathes);

  await deleteManyFiles(filePathes);

  // console.log(cloudinaryUploadedFiles);
  // res.json({});

  const cloudinarySecureUrls = cloudinaryUploadedFiles.map(
    ({ secure_url }) => secure_url
  );
  // console.log(cloudinarySecureUrls);

  const cloudinaryPublicId = cloudinaryUploadedFiles.map(
    ({ public_id }) => public_id
  );
  // console.log(cloudinaryPublicId);

  let body = req.body;
  let bodyWithFiles = { ...body, multiple_files: cloudinarySecureUrls };
  console.log(bodyWithFiles);

  await sendEmail(bodyWithFiles).catch((e) => console.log(e));

  const result = await Contact.create(bodyWithFiles);

  res.status(201).json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  add: ctrlWrapper(add),
};
