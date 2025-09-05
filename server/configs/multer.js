// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Tạo thư mục uploads nếu chưa có
// const uploadDir = './uploads';
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         // Tạo tên file unique với timestamp
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });

// // Tạo multer instance cho ảnh
// export const uploadImages = multer({
//     storage,
//     limits: {
//         fileSize: 10 * 1024 * 1024, // 10MB cho ảnh
//         files: 4 // Tối đa 4 ảnh
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Chỉ chấp nhận file ảnh'), false);
//         }
//     }
// });

// // Tạo multer instance cho video
// export const uploadVideos = multer({
//     storage,
//     limits: {
//         fileSize: 100 * 1024 * 1024, // 100MB cho video
//         files: 2 // Tối đa 2 video
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('video/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Chỉ chấp nhận file video'), false);
//         }
//     }
// });

// // Tạo multer instance cho cả ảnh và video
// export const upload = multer({
//     storage,
//     limits: {
//         fileSize: 100 * 1024 * 1024, // 100MB cho video
//         files: 6 // Tối đa 6 files (4 ảnh + 2 video)
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Chỉ chấp nhận file ảnh hoặc video'), false);
//         }
//     }
// });

// // Middleware xử lý lỗi multer
// export const handleMulterError = (error, req, res, next) => {
//     if (error instanceof multer.MulterError) {
//         if (error.code === 'LIMIT_FILE_SIZE') {
//             return res.status(400).json({
//                 success: false,
//                 message: 'File quá lớn. Kích thước tối đa: 100MB'
//             });
//         }
//         if (error.code === 'LIMIT_FILE_COUNT') {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Quá nhiều file. Tối đa: 6 files'
//             });
//         }
//         return res.status(400).json({
//             success: false,
//             message: `Lỗi upload file: ${error.message}`
//         });
//     }

//     if (error.message.includes('Chỉ chấp nhận')) {
//         return res.status(400).json({
//             success: false,
//             message: error.message
//         });
//     }

//     next(error);
// };

import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir + '/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

// const fileFilter = (req, file, cb) => {
//     // Allow images and videos
//     if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image and video files are allowed!'), false);
//     }
// };

const fileFilter = (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit for videos
    }
});

