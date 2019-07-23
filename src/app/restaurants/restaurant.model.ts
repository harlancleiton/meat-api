import * as mongoose from 'mongoose';

export interface IMenuItem extends mongoose.Document {
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IRestaurant extends mongoose.Document {
    name: string;
    menu: IMenuItem[];
    createdAt: Date;
    updatedAt: Date;
}

const menuSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    price: {
        required: true,
        type: Number,
    }
},
    {
        timestamps: true
    });

const restaurantSchema = new mongoose.Schema({
    menu: {
        default: [],
        required: false,
        select: false,
        type: [menuSchema],
    },
    name: {
        required: true,
        type: String
    },
},
    {
        timestamps: true
    });

export const restaurantModel: mongoose.Model<IRestaurant> = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
