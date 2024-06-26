import { Router } from "express";
import { loginUser, logoutUser, registerUser , refreshAndAccessToken, chnageCurrentUserPassword, updateAccountDetail, updateUserAvatar, updateUserCoverImage,  getCurrentUser, deleteUserFromDatabase} from "../controllers/user.controller.js";
import upload  from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import emailSend from "../controllers/Email.controllers.js"
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);
router.route("/login").post(loginUser)

router.route("/logout").post(verifyJwt, logoutUser)
router.route("/refresh-token").post(refreshAndAccessToken)
router.route("/send").post(emailSend)

router.route("/change").patch(verifyJwt,chnageCurrentUserPassword)
router.route("/update-user").post(verifyJwt,updateAccountDetail)
router.route("/update-avatar").post(verifyJwt , upload.single("avatar") , updateUserAvatar)
router.route("/update-coverImage").post(verifyJwt , upload.single("coverImage") , updateUserCoverImage)
router.route("/allUsers").get( getCurrentUser)
router.route("/delete-user").delete(deleteUserFromDatabase)




export default router;
