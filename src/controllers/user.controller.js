import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloundinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong creating refresh and access tokens");
    }
}
    //register
const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, password, username } = req.body;

    if ([fullname, email, password, username].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (existUser) {
        throw new ApiError(409, "User already exists");
    }

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath =  req.files?.coverImage[0].path
    

    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar file is required")
    // }
    // if (!coverImageLocalPath) {
    //     throw new ApiError(400, "cover Image  is required")
    // }



    // const avatar = await uploadOnCloundinary(avatarLocalPath)
    // const coverImage = await uploadOnCloundinary(coverImageLocalPath)

    // if (!avatar) {
    //     throw new ApiError(400, "Avatar file is required")
    // }

    // if (!coverImage) {
    //     throw new ApiError(400, "cover Image is  required")
    // }
   

    const user = await User.create({
        fullname,
        // avatar: avatar.url,
        // coverImage: coverImage.url,
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(" -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong registering user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    );
});
         //login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password} = req.body;

    if (!email) {
        throw new ApiError(400, "Email and username are required");
    }

    const user = await User.findOne({
        $or: { email }
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const passwordValid = await user.isPasswordCorrect(password);
    if (!passwordValid) {
        throw new ApiError(401, "Incorrect password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };


    return res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});
       //logout
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
       
        {
            $set: {
                refreshToken:1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

   

    return res
        .status(201)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

     //refresh And Access token

     const refreshAndAccessToken = asyncHandler ( async (req,res) => {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken 
        
        if (!incomingRefreshToken) {
            throw new ApiError(401, "unauthorize request")
        }

      try {
          const decodedToken = jwt.verify(
              refreshAndAccessToken,
              "REFRESH_TOKEN_SECRET",
          )
         const user =  await User.findById(decodedToken?._id)
         if (!user) {
          throw new ApiError(401, "invalid refresh token")
         }
  
         if (refreshAndAccessToken !== user?.refreshToken) {
          throw new ApiError(401, "refresh token is expired and used")
         }
  
         const options = {
          httpOnly : true,
          secure : true
         }
         await generateAccessAndRefreshTokens(user._id)
  
         return res
         .status(200)
         .cookie("accessToken", accessToken , Option)
         .cookie("neRefreshToken", newRefreshToken ,options )
         .json(
          new ApiResponse(
              200,
              {accessToken , refreshToken : newRefreshToken},
              "Access token refreshed"
          )
         )
      } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
        
      }
      })

      //////Change current User Password

      const chnageCurrentUserPassword = asyncHandler (async (req,res) => {

        const { oldPassword , newPassword } = req.body;
       
       const user =  await User.findByIdAndUpdate(req.user?._id)

   
       if (!user) {
        throw new ApiError(404, "User not found");
    }
       
     const isPassword=  await user.isPasswordCorrect(oldPassword)
    if (!isPassword) {
        throw new ApiError(400, "invalid old passwrod")
     }
     user.password = newPassword

    await user.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "password change successfully"))
    
    })

          ///get current user

    const getCurrentUser = asyncHandler (async (req , res) => { 
        
        const users = await User.find({});
            if (!users || users.length === 0) {
                throw new ApiError(404, "No users found");
            }
        return res
        .status(200)
        .json(new ApiResponse(200, users , "All users fetched successfully"))
    })


    //  update Account Details

    const updateAccountDetail = asyncHandler (async (req, res) => {
        const { email , username} = req.body

        if (!(email || username)) {
            throw new ApiError(400, "All feilds are required")
        }

       const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set :{
                    username,
                    email
                }
            } ,
            {new : true}
        ).select("-password")

        return res
        .status(200)
        .json(new ApiResponse(200, user , "user detail update successfully"))

    })

    // update user Avatar

    const updateUserAvatar = asyncHandler(async (req, res) => {

        
        const avatarLocalFilePath = req.file?.path;
        console.log(req.file);

        if (!avatarLocalFilePath) {
            throw new ApiError(400, "Avatar file is missing");
        }
    
        const user = await User.findById(req.user._id);
        // if (user.avatar) {
        //     await deleteFromCloudinary(user.avatar); // Assuming you have the logic to extract the ID and delete the image
        // }
    
        const avatar = await uploadOnCloundinary(avatarLocalFilePath);
        if (!avatar.url) {
            throw new ApiError(400, "Error while uploading avatar");
        }
    
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { avatar: avatar.url } },
            { new: true }
        ).select("-password");
    
        return res.status(200).json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
    });


        //Update user cover image



    const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalFilePath = req.file?.path;
    if (!coverImageLocalFilePath) {
        throw new ApiError(400, "Cover image file is missing");
    }

    const coverImage = await uploadOnCloundinary(coverImageLocalFilePath);
    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading cover image");
    }

    const user = await User.findByIdAndUpdate(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Delete old cover image from cloudinary
    // if (user.coverImage) {
    //     await deleteFromCloudinary(user.coverImage);
    // }

    user.coverImage = coverImage.url;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, user, "Cover image updated successfully"));
});
    
            //DELECT user from database

            const deleteUserFromDatabase = asyncHandler(async (req, res) => {
                const { email } = req.body;
            
                if (!email) {
                    res.status(400).json({ message: 'Email is required' });
                    return;
                }
            
                // Find and delete the user by email
                const deletedUser = await User.findOneAndDelete({ email });
            
                if (deletedUser) {
                    res.status(200).json({ message: 'User deleted successfully' });
                } else {
                    res.status(404).json({ message: 'User not found' });
                }
            });



export { 
    loginUser,
    registerUser,
    logoutUser,
    refreshAndAccessToken,
    chnageCurrentUserPassword,
    getCurrentUser,
    updateAccountDetail,
    updateUserAvatar,
    updateUserCoverImage,
    deleteUserFromDatabase
};
