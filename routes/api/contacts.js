const express = require("express");
const upload = require("../../middlewares/upload");
const ctrl = require("../../controllers/contacts");
const path = require("path");
const { validateBody } = require("../../middlewares/validateBody");
const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", ctrl.getAll);

router.post(
  "/",
  validateBody(schemas.ContactAddSchema),
  upload.array("multiple_files", 6),
  ctrl.add
);

module.exports = router;
