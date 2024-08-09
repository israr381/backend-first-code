import { Router } from "express";
   
    import { addItems, getItem, updateItems, deleteItemFromDatabase } from "../controllers/items.controlles.js";
    import upload  from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/addItem").post( 
    upload.fields([
        {
            name: "carImage",
            maxCount: 1
        },
       
    ]),
      addItems
);

router.route("/get-all-items").get(getItem)
router.route("/update-items/:id").get(updateItems)
router.route("/delete/:id").delete(deleteItemFromDatabase)







export default router;
