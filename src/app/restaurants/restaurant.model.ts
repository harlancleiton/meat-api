import * as mongoose from 'mongoose';

export interface IMenuItem extends mongoose.Document {
    name: string;
    price: number;
}

export interface IRestaurant extends mongoose.Document {
    name: string;
    menu: IMenuItem[];
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
});

export const restaurantModel: mongoose.Model<IRestaurant> = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
