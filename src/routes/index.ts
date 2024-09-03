import { Router } from "express";

import { entryController, exitController } from "../controllers";

import { tollEntrySchema, tollExitSchema } from "../utils/validations";
import { validationMiddleware } from "../midlewares/validations";
import { routes } from "../constants/routes";

const router = Router();
const { ENTER, EXIT } = routes

router.post(ENTER, validationMiddleware(tollEntrySchema), entryController);
router.put(EXIT, validationMiddleware(tollExitSchema), exitController);

export default router;
