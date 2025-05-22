"use strict"


const Comment = require('../models/comment');
const Firm  = require("../models/firm");


module.exports = {

    create: async (req, res) => {
        /* 
            #swagger.tags = ["Comments"]
            #swagger.summary = "Create Comment"
            #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema:{
                    $ref"#/definitions/Comment"
                }
            }
        */

        req.body.userId = req.user._id;

        const comment = await Comment.create(req.body);

        const data =  await Comment.findById(comment._id).populate({
            path: "userId",
            select: "firstName lastName image",
        });

        await Firm.findOneAndUpdate({_id : req.body.firmId}, {$push: { comments: comment._id }});

        const firm = await Firm.commentRating(data.firmId);

        res.status(201).send({
            error: false,
            data,
            firm
        })
    },

    read: async (req, res) => {
        /* 
           #swagger.tags = ["Comments"]
           #swagger.summary = "Get Single Comment"
        */

        const data = await Comment.findOne({ _id: req.params.id }).populate([
            { path: "userId", select: "firstName lastName image" },
          ]);

          if (!data) {
            return res.status(404).send({
              error: true,
              message: "Comment not found",
            });
          }

        res.status(200).send({
            error: false,
            data
        })
    },

    update: async (req, res) => {
        /* 
            #swagger.tags = ["Comments"]
            #swagger.summary = "Update Comment"
            #swagger.parameters['body'] = {
                in:'body',
                required:true,
                schema:{
                    $ref"#/definitions/Comment"
                }
            }
        */

        const data = await Comment.findOneAndUpdate({ _id: req.params.id, userId: req.user_id }, req.body, { runValidators: true })

        if (!data) {
            return res.status(404).send({
              error: true,
              message: "Comment not found",
            });
          }

        const firm = await Firm.commentRating(data.firmId);

        res.status(202).send({
            error: false,
            data,
            firm
        })
    },

    deletee: async (req, res) => {
        /* 
            #swagger.tags = ["Comments"]
            #swagger.summary = "Delete Single Comment"
        */

        const data = await Comment.findOneAndDelete({ _id: req.params.id, userId: req.user_id })

        if (!data) {
            return res.status(404).send({
              error: true,
              message: "Comment not found",
            });
          };

        await Firm.findByIdAndUpdate(data.firmId, {
            $pull: { comments: req.params.id },
        });

        const firm = await Firm.commentRating(data.firmId);

        res.status(data ? 204 : 404).send({
            error: true,
            message: 'Something went wrong, data might be deleted already.'
        })
    },

}