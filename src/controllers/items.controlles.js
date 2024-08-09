import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIError.js";
import { Item } from "../models/item.models.js";
import { uploadOnCloundinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import {validationResult} from "express-validator"
import { json } from "express";
   
   
   //Add Items
   const addItems = asyncHandler(async (req, res) => {
    const { name, price, discription , stock} = req.body;
    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
      }
    

    const imageLocalFilePath = req.files?.carImage[0]?.path;

    if (!imageLocalFilePath) {
            throw new ApiError(400, "Product image  is required")
         }

         const image = await uploadOnCloundinary(imageLocalFilePath)
         if (!image) {
        throw new ApiError(400, "image file is required")
    }

    const item = await Item.create({
        name,
        price, 
        discription,
        stock,
        carImage : image.url

    })

 
    const createdItems = await Item.findById(item._id)
    if (!createdItems) {
        throw new ApiError(500, "Something went wrong Add item");
    }

    return res.status(201).json(
        new ApiResponse(201, createdItems, "item Add  successfully")
    );
});



            //get all items

 const getItem =  asyncHandler(async (req, res) => {
    const items = await Item.find({});
    if (!items || items.length === 0) {
        throw new ApiError(404, "No item  found");
    }
return res
.status(200)
.json(new ApiResponse(200, items , "All Items fetched successfully"))
 })


            //update Itema

            const updateItems = asyncHandler (async (req, res) => {
                const { price , name , discription} = req.body
                const id = req.params.id
                //    console.log(req);
                if (!(price || name || discription)) {
                    throw new ApiError(400, "All feilds are required")
                }
        
               const item = await Item.findByIdAndUpdate(
                        id,
                    {
                        $set :{
                            price,
                            name,
                            discription
                        }
                    } ,
                    {new : true}
                )

                await item.save()
                
                return res
                .status(200)
                .json(new ApiResponse(200, item , "Item update successfully"))
        
            })


            //Delet Items

            const deleteItemFromDatabase = asyncHandler(async (req, res) => {
                const id = req.params.id;
                const item = await Item.findByIdAndDelete(id);
            
                return res
                .status(200)
                .json(new ApiResponse(200, item, "Otem delect successfully"))
            });

export {
    addItems,
    getItem,
    updateItems,
    deleteItemFromDatabase

}


