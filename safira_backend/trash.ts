
// export const userImageStorage = {
//   storage: diskStorage({
//     destination: (req, file, cb) => {
//       const uploadPath = join(process.cwd(), "src", "core", "uploads", "user_images");

//       if (!existsSync(uploadPath)) {
//         mkdirSync(uploadPath, { recursive: true });
//       }
//       cb(null, uploadPath);

//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       const ext = extname(file.originalname);
//       cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//     },

//   }),
//   fileFilter(req, file, callback) {
//     const extract = extname(file.originalname)
//     console.log(file.mimetype)
//     if (!file.mimetype.includes("image")) {
//       callback(new UnsupportedMediaTypeException("File type image bo'lishi kerak"), false)
//     } else {
//       callback(null, true)
//     }
//   },
// };

// export const courseFileFields = [
//   { name: 'banner', maxCount: 1 },
//   { name: 'introVideo', maxCount: 1 },
// ]
// export const courseStorage = {
//   storage: diskStorage({
//     destination: (req, file, cb) => {
//       let filePath = "./uploads"
//       if (file.fieldname === 'banner') {
//         filePath = join(process.cwd(), "src", "core", "uploads", "banners")
//       } else if (file.fieldname === "introVideo") {
//         filePath = join(process.cwd(), "src", "core", "uploads", "intro_videos")
//       }
//       if (!existsSync(filePath)) {
//         mkdirSync(filePath, { recursive: true })
//       }
//       cb(null, filePath)
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + '-' + file.originalname);
//     },
//   }),
// }

// export const lessoVideoStorage = {
//   storage: diskStorage({
//     destination: (req, file, cb) => {
//       const uploadPath = join(process.cwd(), "src", "core", "uploads", "lesson-videos");

//       if (!existsSync(uploadPath)) {
//         mkdirSync(uploadPath, { recursive: true });
//       }
//       cb(null, uploadPath);

//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       const ext = extname(file.originalname);
//       cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//     },

//   }),
//   fileFilter(req, file, callback) {
//     const extract = extname(file.originalname)
//     console.log(file.mimetype)
//     if (!file.mimetype.includes("video")) {
//       callback(new UnsupportedMediaTypeException("File type image bo'lishi kerak"), false)
//     } else {
//       callback(null, true)
//     }
//   },
// };

// export const lessonFileStorage = {
//   storage: diskStorage({
//     destination: (req, file, cb) => {
//       const uploadPath = join(process.cwd(), "src", "core", "uploads", "lesson-files");

//       if (!existsSync(uploadPath)) {
//         mkdirSync(uploadPath, { recursive: true });
//       }
//       cb(null, uploadPath);

//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       const ext = extname(file.originalname);
//       cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//     },

//   }),
//   fileFilter(req, file, callback) {
//     const extract = extname(file.originalname)
//     console.log(file.mimetype)
//     if (!file.mimetype.includes("video")) {
//       callback(new UnsupportedMediaTypeException("File type video bo'lishi kerak"), false)
//     } else {
//       callback(null, true)
//     }
//   },
// };

