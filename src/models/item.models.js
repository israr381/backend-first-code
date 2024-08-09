import mongoose, {Schema} from 'mongoose';

const itemSchema = new Schema({
    name: { 
        type: String,
        required: true
         },
    discription: { 
        type: String, 
        required: true 
    },
    price: {
         type: Number,
         required: true 
        },
    stock: { 
        type: Number, 
        required: true },

    carImage : {
        type : String,
        required : true
    },
   
}, { timestamps: true });

export const Item = mongoose.model('Item', itemSchema);


