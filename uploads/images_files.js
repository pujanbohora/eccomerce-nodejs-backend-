const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'images'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() +  "-" + file.originalname);
    },
})

//filter - only accepting valid file - png, jpeg, gif

const filter = function (req, file, cb) {
    if (file.minetype == 'image/png' || file.minetype == 'image/jpeg') {
        //valid
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    filter: filter
})

module.exports = upload;