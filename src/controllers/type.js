"use strict"


const Type = require('../models/Type');

module.exports = {

    list: async (req, res) => {
        
          /*
            #swagger.tags = ["Types"]
            #swagger.summary = "List Types"
            #swagger.description = `
                You can send query with endpoint for filter[], search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

            const data = await res.getModelList(Type)

            res.status(200).send({
                error: false,
                details: await res.getModelListDetails(Type),
                data            
            })
    },

    // CRUD:
    create: async (req, res) => {
        /*
            #swagger.tags = ["Types"]
            #swagger.summary = "Create Type"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref:"#/definitions/Type"
                    }
                }
            */

        const data = await Type.create(req.body)

        res.status(201).send({
            error: false,
            data
        })
    },

    read: async (req, res) => {
        /* 
           #swagger.tags = ["Types"]
           #swagger.summary = "Get Single Type"
        */

        const data = await Type.findOne({ _id: req.params.id })

        res.status(200).send({
            error: false,
            data
        })
    },

    update: async (req, res) => {
         /*
                #swagger.tags = ["Types"]
                #swagger.summary = "Update Type"
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        $ref:"#/definitions/Type"
                    }
                }
            */

        const data = await Type.updateOne({ _id: req.params.id }, req.body, { runValidators: true })


        res.status(202).send({
            error: false,
            data,
            new: await Type.findOne({ _id: req.params.id })
        })
    },

    deletee: async (req, res) => {
                /*
                #swagger.tags = ["Types"]
                #swagger.summary = "Delete Type"
            */
    

        const data = await Type.deleteOne({ _id: req.params.id })

        res.status(data.deletedCount ? 204 : 404).send({
            error: true,
            message: 'Something went wrong, data might be deleted already.'
        })
    },

}