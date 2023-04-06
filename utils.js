import {fileURLToPath} from "url";
import {dirname} from "path";
import bcrypt from "bcrypt";

import config from "./configs/config.js";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, __dirname+"/public/img");
    },
    filename:function(req, file, cb){
        cb(null, file.originalname);
    }
})

export const uploader = multer({storage});


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;