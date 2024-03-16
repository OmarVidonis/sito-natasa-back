import { application } from "express";
import mongoose from "mongoose";

const placesSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        imgUrl: {
            type: String,
            // required: true,
        },
        description: {
            type: String,
            // required: true,
        },
        isVisited: {
            type: Boolean,
            // required: true,
        },
        lat: {
            type: Number,
            // required: true,
        },
        lng: {
            type: Number,
            // required: true,
        },
        albumUrls: {
            type: Array,
            // required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Places = mongoose.model('Places', placesSchema)
