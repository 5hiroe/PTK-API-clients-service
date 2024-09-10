import mongoose from 'mongoose'

const schema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        items: [{
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    },
    { timestamps: true }
)

export default mongoose.model('Order', schema)