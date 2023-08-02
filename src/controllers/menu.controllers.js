// const { Menu, Dish } = require("../models");

// const createDish = async (req, res) => {
//   try {
//     const { name, description, price, image, dishTypeId } = req.body;
//     const newDish = await Dish.create({
//       name: name,
//       description: description,
//       price: price,
//       image: image,
//       dishTypeId: dishTypeId,
//     });
//     res.status(200).json({
//       isSuccess: true,
//       msg: "Tạo món thành công",
//     });
//   } catch (error) {
//     res.status(500).json({
//       isSuccess: false,
//       msg: "Tạo món thất bại",
//     });
//   }
// };



// module.exports = {
//   createDish,
//   updateDish,
// };
