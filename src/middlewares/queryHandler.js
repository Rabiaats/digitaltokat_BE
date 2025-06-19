"use strict"

const Type = require("../models/type");

module.exports = async(req, res, next) => {

    let filter = req.query?.filter || {}
    
    let search = req.query?.search || {}

        if (filter.typeId && typeof filter.typeId === "string") {
        const typeDoc = await Type.findOne({ name: { $regex: filter.typeId, $options: "i" } }).select("_id");

        if (typeDoc) {
            filter.typeId = typeDoc._id;
        } else {
            filter = {}; // eşleşmezse filtreyi iptal et
        }
    }

    // search objesini regex'e çevir
    const searchTerms = [];
    for (let key in search) {
        searchTerms.push({ [key]: { $regex: search[key], $options: "i" } });
    }

    // pagination
    let limit = Number(req.query?.limit);
    limit = limit > 0 ? limit : Number(process.env.PAGE_SIZE || 20);

    let page = Number(req.query?.page);
    page = page > 0 ? page - 1 : 0;

    let skip = Number(req.query?.skip);
    skip = skip > 0 ? skip : (page * limit);

    // OR sorgusu oluştur
    const queryOrConditions = [];

    // filter varsa
    if (Object.keys(filter).length > 0) queryOrConditions.push(filter);

    // search varsa
    if (searchTerms.length > 0) queryOrConditions.push({ $or: searchTerms });

    // boşsa, boş obje döndür (hepsi gelir)
    const finalQuery = queryOrConditions.length > 0 ? { $or: queryOrConditions } : {};

    console.log(search)

    // Veriyi getiren fonksiyon
    res.getModelList = async (Model, customFilter = {}, populate = null) => {
        const sort = Model.modelName === "Firm" ? { rating: -1 } : req.query?.sort || {};

        return await Model.find({ ...finalQuery, ...customFilter })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate(populate);
    };

    res.getModelListDetails = async (Model, customFilter = {}) => {
        const data = await Model.find({ ...filter, ...search, ...customFilter })
        const sort = Model.modelName == 'Firm' ? { rating: -1} : req.query?.sort || {}
        
        let details = {
            filter,
            search,
            sort,
            skip,
            limit,
            page,
            pages: {
                previous: (page > 0 ? page : false),
                current: page + 1,
                next: page + 2,
                total: Math.ceil(data.length / limit)
            },
            totalRecords: data.length,
        }
        details.pages.next = (details.pages.next > details.pages.total ? false : details.pages.next)
        if (details.totalRecords <= limit) details.pages = false
        return details
    }
    
    next()
}