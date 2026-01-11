import mongoose from "mongoose";
const Schema = mongoose.Schema;


const BillSchema = new Schema({

    invoice_no: {
        type: String,
        unique: true,
        required: true
    },
    invoice_date: {
        type: String,
        unique: true,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    state_code: {
        type: Number,
        required: true
    },
    transport_name: {
        type: String,
    },
    vehicle_number:{
        type:String,
        required:true
    },
    date_of_supply:{
        type:String
    },
    
    pono_date:{
        type:String,
    },
    eway_bill_no:{
        type:String,
        
    },
    receiver_name:{
        type:String,
        required:true
    },
    receiver_address:{
        type:String,
        required:true
    },
    receiver_gstin:{
        type:String,
        required:true
    },
    receiver_state:{
        type:String,
        required:true,
    },
    receiver_state_code:{
        type:String,
        required:true
    },
    consignee_name:{
        type:String,

    },
    consignee_address:{
        type:String
    },
    consignee_gstin:{
        type:String,
    },
    consignee_state:{
        type:String,
    },
    consignee_state_code:{
        type:String

    },
    items:[{
        si_no:{
            type:String,
            required:true,
        },
        name:{
            type:String,
            required:true,
        },
        hsncode:{
            type:String,
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
    
        },
    
        rate:{
            type:Number,
            required:true,
    
        },
        per:{
            type:   String,
            required:true,
    
        },
        value:{
            type:Number,
            required:true,
            
        },
        
        
    }],
    totalquantity:{
        type:Number,
        required:true,
    },
    
    total_before_tax:{
        type:Number,
        required:true,

    },
    roundoff:{
        type:Number,
        required:true,
    },
    grand_total:{
        type:Number,
        required:true,
    },
    grand_total_words:{
        type:String,
        required:true,
    }
})

export default mongoose.model("BillDetails", BillSchema);