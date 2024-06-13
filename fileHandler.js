const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'))
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const uploadSingle = multer({ storage: storage }).single('image');
const uploadMulti = multer({ storage: storage }).array('images', 3);

module.exports = {
    uploadSingle,
    uploadMulti
}
