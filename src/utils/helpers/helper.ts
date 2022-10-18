export class Helper {
    static customFileName(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      let fileExtension = "";
      if(file.mimetype.indexOf("jpeg") > -1){
          fileExtension = "jpg"
      }else if(file.mimetype.indexOf("png") > -1){
          fileExtension = "png";
      }
      const originalName = file.originalname.split(".")[0];
      cb(null, originalName + '-' + uniqueSuffix+"."+fileExtension);
    }
   
    static destinationPath(req, file, cb) {
      if(file.fieldname == 'plate'){
        cb(null, './images/plates')
      }else if (file.fieldname == 'cer'){
        cb(null, './images/certificates')
      }else if(file.fieldname == 'side') {
        cb(null, './images/sideimgs')
      }else {
        cb(null, './images/driverlec')
      }
    }
    static registrationPath(req, file, cb) {
      cb(null, './uploads/vehicle/')
    }
  }