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

export interface IRestaurantModel extends mongoose.Model<IRestaurant> {
    // tslint:disable-next-line: no-trailing-whitespace
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

// tslint:disable-next-line: max-line-length
export const restaurantModel: IRestaurantModel = mongoose.model<IRestaurant, IRestaurantModel>('Restaurant', restaurantSchema);
