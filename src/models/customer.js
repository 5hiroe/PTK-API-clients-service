import mongoose from 'mongoose'

const schema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        address: {
            street: String,
            city: String,
            postalCode: String,
            country: String
        },
        orders: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Order'
        }]
    },
    { timestamps: true }
)

const Customer = mongoose.model('Customer', schema);

export default Customer;