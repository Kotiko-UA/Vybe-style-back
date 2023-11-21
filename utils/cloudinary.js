const cloudinary = require("cloudinary").v2;
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadFiles = async (filePathes) => {
  const results = Promise.all(
    filePathes.map((path) => cloudinary.uploader.upload(path))
  );
  console.log(filePathes);
  console.log(results);
  try {
    const cloudFilesData = await results;
    console.log(cloudFilesData);
    return cloudFilesData;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { cloudinary, cloudinaryUploadFiles };
