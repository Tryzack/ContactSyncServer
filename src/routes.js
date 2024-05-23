import { Router } from "express";

//import controllers
import { login } from "./controllers/login.js";
import { register } from "./controllers/register.js";
import { logout } from "./controllers/logout.js";
import { updateContact } from "./controllers/updateContact.js";
import { createContact } from "./controllers/createContact.js";
import { createGroup } from "./controllers/createGroup.js";
import { createContactGroup } from "./controllers/createContactGroup.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.post("/createContact", createContact);
router.post("/createGroup", createGroup);
router.put("/updateContact", updateContact);

export default router;
