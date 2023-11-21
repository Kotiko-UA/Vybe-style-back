const fs = require("fs/promises");

const deleteManyFiles = async (filePathes) => {
  const deleteFiles = Promise.all(filePathes.map((path) => fs.unlink(path)));
  try {
    await deleteFiles;
  } catch (error) {
    console.log(error);
  }
};

module.exports = deleteManyFiles;
