import * as mongoose from 'mongoose';
import { IRestaurant } from '../restaurants/restaurant.model';
import { IUser } from '../users/user.model';

export interface IReview extends mongoose.Document {
    comments: string;
    rating: number;
    restaurant: mongoose.Types.ObjectId | IRestaurant;
    user: mongoose.Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new mongoose.Schema({
    comments: {
        maxlength: 500,
        required: true,
        type: String
    },
    rating: {
        required: true,
        type: Number
    },
    restaurant: {
        ref: 'Restaurant',
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    user: {
        ref: 'User',
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
},
    {
        timestamps: true
    });

export const reviewModel: mongoose.Model<IReview> = mongoose.model('Review', reviewSchema);
