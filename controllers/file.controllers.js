const useServices = require("../services/file.services");

module.exports = {
    postUploadSingleFileAPI: async (req, res) => {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
    
        let result = await useServices.uploadSingleFile(req.files.image);
    
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },

    postUploadMultipleFilesAPI: async (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        // console.log(req.files);
        //upload single => files is an object
        //upload multiple => files is an array
        if (Array.isArray(req.files.image)) {
            //upload multiple
            let result = await useServices.uploadMultipleFiles(req.files.image);
            return res.status(200).json({
                EC: 0,
                data: result
            })
    
        } else {
            //upload single
            return await postUploadSingleFileApi(req, res);
        }
    }
}