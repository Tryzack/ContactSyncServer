import { Router } from "express";

//import controllers
import { login } from "./controllers/login.js";
import { register } from "./controllers/register.js";
import { logout } from "./controllers/logout.js";

import { createContact } from "./controllers/createContact.js";
import { createGroup } from "./controllers/createGroup.js";
import { createContactGroup } from "./controllers/createContactGroup.js";
import { createPhone } from "./controllers/createPhone.js";
import { createEmail } from "./controllers/createEmail.js";
import { createURL } from "./controllers/createURL.js";
import { createContactDate } from "./controllers/createContactDate.js";

import { updateContact } from "./controllers/updateContact.js";
import { updateContactPhone } from "./controllers/updatePhone.js";
import { updateContactEmail } from "./controllers/updateContactEmail.js";
import { updateContactURL } from "./controllers/updateContactURL.js";
import { updateContactDate } from "./controllers/updateContactDate.js";

import { deleteContact } from "./controllers/deleteContact.js";
import { deleteContactPhone } from "./controllers/deleteContactPhone.js";
import { deleteContactEmail } from "./controllers/deleteContactEmail.js";
import { deleteContactUrl } from "./controllers/deleteContactUrl.js";
import { deleteContactDate } from "./controllers/deleteContactDate.js";
import { deleteGroup } from "./controllers/deleteGroup.js";
import { deleteContactFromGroup } from "./controllers/deleteContactFromGroup.js";

const router = Router();

// login routes
router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);

// create routes
router.post("/createContact", createContact);
router.post("/createGroup", createGroup);
router.post("/InsertContactToGroup", createContactGroup);
router.post("/createPhone", createPhone);
router.post("/createEmail", createEmail);
router.post("/createURL", createURL);
router.post("/createContactDate", createContactDate);

// update routes
router.put("/updateContact", updateContact);
router.put("/updateContactPhone", updateContactPhone);
router.put("/updateContactEmail", updateContactEmail);
router.put("/updateContactURL", updateContactURL);
router.put("/updateContactDate", updateContactDate);

// delete routes
router.delete("/deleteContact", deleteContact);
router.delete("/deleteContactPhone", deleteContactPhone);
router.delete("/deleteContactEmail", deleteContactEmail);
router.delete("/deleteContactURL", deleteContactUrl);
router.delete("/deleteContactDate", deleteContactDate);
router.delete("/deleteGroup", deleteGroup);
router.delete("/deleteContactFromGroup", deleteContactFromGroup);

export default router;
