const adGroupSchema = require('../models/adGroupsRouter');
const campaign = require('../logics')
const mongoose = require('mongoose');

const AdGroup = {
    addSchema: async (Obj) => {
        try {
          let requestjson;
          Obj.mongo_schema.map((y) => {
            var name = y.Name;
            requestjson = {
              ...requestjson,
              [name]: { type: y.type, require: y.required, default: y.default },
            };
          });
          requestjson={...requestjson,companyId:{type:"Number",required:true}}
          const schema = await adGroupSchema.create({
            schema: Obj.schema,
            mongo_schema: [requestjson],
            status: "In-Progress",
            companyId: Obj.companyId,
          });
          console.log(schema);
          return 1;
        } catch (err) {
          return 0;
          process.exit(1);
        }
      },
      getSchema: async (company_id) => {
        const schema = await adGroupSchema.findOne({ companyId: company_id });
        return schema;
      },
      checkWithCompanyId: async (id) => {
        try {
          const schema = await adGroupSchema.findOne({ companyId: id });
          if (schema) {
            return 1;
          } else {
            return 2;
          }
        } catch (err) {
          console.error(err);
          return 0;
        }
      },
      updateSchema: async (Obj) => {
        try {
          let requestjson = {};
          Obj.mongo_schema.map((y) => {
            var name = y.Name;
            requestjson = {
              ...requestjson,
              [name]: { type: y.type, required: y.required, default: y.default },
            };
          });
          requestjson={...requestjson,companyId:{type:"Number",required:true}}
          const result = await adGroupSchema.updateOne(
            { companyId: Obj.companyId },
            { schema: Obj.schema, mongo_schema: [requestjson] }
          );
          return 1;
        } catch (err) {
          console.error(err);
          return 0;
        }
      },
    };
    const adGroupCreation = {
      createAdGroup: async (schema, data, id) => {
        const defineschema = new mongoose.Schema(schema);
        let keysArray = schema.map((obj) => Object.keys(obj));
        let flatKeysArray = [].concat(...keysArray);
        let final = [];
        console.log(flatKeysArray);
        console.log(schema);
        console.log(data);
        flatKeysArray.map((key, i) => {
          [data].map((v) => {
            if (key === Object.keys(v)[i]) {
              final = { ...final, [key]: v[key] };
            }
          });
        });
    
    
        final = { ...final, "companyId": id };
        console.log(final);
        try {
          const definemodel = mongoose.model("Ads", defineschema);
          const adsInfo = await definemodel.create(final);
          return adsInfo;
        } catch (e) {
          mongoose.deleteModel("Ads");
          const adsInfo = await mongoose
            .model("Ads", defineschema)
            .create(final);
          return adsInfo;
        }
      },  
      getAllAds: async (schema,id) => {
        try {
          const adsSchema = new mongoose.Schema(schema);
          let adsInfoModel;
          //console.log('adsSchema',adsSchema);
          try {
            adsInfoModel = mongoose.model("ads");
          } catch (error) {
            adsInfoModel = mongoose.model("ads", adsSchema);
            console.log("Error Occured");
          }
    
          const Ads = await adsInfoModel.find({companyId:id}, 
            { _id: 0,
             __v: 0,
             companyId: 0});
    
          return Ads;
        } catch (error) {
          // Handle any errors that occur during the query
          console.error("Error retrieving users:", error);
          return [];
        }
      },
    };
    
module.exports = { AdGroup, adGroupCreation };