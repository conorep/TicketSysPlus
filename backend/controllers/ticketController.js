import mongoose from "mongoose";
import { TicketSchema } from "../models/BaseSchemaJS.js";
import { jsonSchema } from "../models/jsonSchema";

const Ticket = mongoose.model("Ticket", TicketSchema);
const Json = mongoose.model("Json", jsonSchema);

//functions that interact w/ db when sending request to api. request to api w/ route, controller executes func in db

//POST
export const addNewTicket = (req, res) => {
    let newTicket = new Ticket(req.body);

    newTicket.save((err, Ticket) => {
        //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Ticket);
    });
};

//GET
export const getTickets = (req, res) => {
    Ticket.find((err, Ticket) => {
        //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Ticket);
    });
};

//ANOTHER GET
export const getTicketWithPriorityOne = (req, res) => {
    Ticket.find({ priority: 1 }, (err, Ticket) => {
        if (err) {
            res.send(err);
        }
        res.json(Ticket);
    });
};

//PUT
export const blockTicket = (req, res) => {
    let bodyid = req.body;
    console.log(bodyid);

    Ticket.findByIdAndUpdate(
        req.body,
        { blocked: true },
        { new: true },
        (err, Ticket) => {
            if (err) {
                res.send(err);
            }
            res.json(Ticket);
        }
    );
};

export const deleteTicket = (req, res) => {
    Ticket.deleteOne(
        req.body,
        (err, Ticket) => {
            if (err) {
                res.send(err);
            }
            res.json(Ticket);
        }
    );
};

//CHANGE TICKET PRIORITY 


//JSON TICKET/TEMPLATE FUNCTIONS
//POST
export const addJson = (req, res) => {
    let newJson = new Json(req.body);

    newJson.save((err, Json) => {
        //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Json);
    });
};

//GET
export const getJson = (req, res) => {
    Json.find((err, Json) => {
        //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Json);
    });
};


//PUT
export const changeJson = (req, res) => {
    let bodyid = req.body;
    console.log(bodyid);

    Json.findByIdAndUpdate(
        req.body,
        { blocked: true },
        { new: true },
        (err, Json) => {
            if (err) {
                res.send(err);
            }
            res.json(Json);
        }
    );
};

//DELETE
export const deleteJson = (req, res) => {
    Json.deleteOne(
        req.body,
        (err, Json) => {
            if (err) {
                res.send(err);
            }
            res.json(Json);
        }
    );
};
