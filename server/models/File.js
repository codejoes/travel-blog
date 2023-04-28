const { Schema, model } = require("mongoose");

const fileSchema = new Schema(
  {
    filename: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    path: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const File = model("File", fileSchema);

module.exports = File;

// ("use strict");
// module.exports = (mongoose) => {
//   const newSchema = new mongoose.Schema(
//     {
//       filename: {
//         type: String,
//       },
//       mimetype: {
//         type: String,
//       },
//       path: {
//         type: String,
//       },
//     },
//     {
//       timestamps: {
//         createdAt: "created_at",
//         updatedAt: "updated_at",
//       },
//     }
//   );
//   const image = mongoose.model("image", newSchema);
//   return image;
// };
