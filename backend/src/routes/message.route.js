import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sendMessage, getMessages, getUsers } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send/:id", protectRoute, sendMessage);
router.get("/messages/:id", protectRoute, getMessages);
router.get("/users", protectRoute, getUsers);

export default router;


// import express from "express";
// import { protectRoute } from "../middleware/auth.middleware";
// import { sendMessage , getMessages} from "../controllers/message.controller";
// const router = express.Router();

// router.get("/users",protectRoute,getUsersForSidebar);
// router.get("/:id",protectRoute,getMessages);

// router.post("/send/:id",protectRoute,sendMessage);
// export default router;