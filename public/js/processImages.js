const { Product, User } = require("../../models");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


const productImagesPath = path.join(__dirname, "../images/products");
const userImagesPath = path.join(__dirname, "../images/users");
const defaultProductImage = "default.png"; 


const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDirectoryExists(productImagesPath);
ensureDirectoryExists(userImagesPath);


const generateUniqueFileName = (base64Data, extension) => {
  const hash = crypto.createHash("sha256").update(base64Data).digest("hex");
  return `${hash}.${extension}`;
};


const migrateProductImages = async () => {
  console.log("Migrando imágenes de productos...");
  const products = await Product.findAll();

  for (const product of products) {
    const imagePath = path.join(productImagesPath, product.product_image || defaultProductImage);

    if (product.product_image && product.product_image.startsWith("data:image")) {
      try {
        const match = product.product_image.match(/^data:image\/(png|jpeg|jpg|gif);base64,/);
        if (match) {
          const extension = match[1];
          const fileName = generateUniqueFileName(product.product_image, extension);
          const outputPath = path.join(productImagesPath, fileName);
          const base64Content = product.product_image.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, "");

          fs.writeFileSync(outputPath, base64Content, { encoding: "base64" });
          product.product_image = fileName; 
          await product.save();
          console.log(`Imagen migrada para producto: ${product.product_name}`);
        }
      } catch (error) {
        console.error(`Error al migrar imagen para producto: ${product.product_name}`, error.message);
      }
    } else if (!fs.existsSync(imagePath)) {
      
      console.warn(`La imagen "${product.product_image}" no existe para el producto: ${product.product_name}`);
      product.product_image = defaultProductImage;
      await product.save();
      console.log(`Imagen predeterminada asignada para el producto: ${product.product_name}`);
    }
  }
};

const migrateUserImages = async () => {
  console.log("Migrando imágenes de usuarios...");
  const users = await User.findAll();

  for (const user of users) {
    if (user.user_image && user.user_image.startsWith("data:image")) {
      try {
        const match = user.user_image.match(/^data:image\/(png|jpeg|jpg|gif);base64,/);
        if (match) {
          const extension = match[1];
          const fileName = generateUniqueFileName(user.user_image, extension);
          const outputPath = path.join(userImagesPath, fileName);
          const base64Content = user.user_image.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, "");

          fs.writeFileSync(outputPath, base64Content, { encoding: "base64" });
          user.user_image = fileName; 
          await user.save();
          console.log(`Imagen migrada para usuario: ${user.first_name} ${user.last_name}`);
        }
      } catch (error) {
        console.error(`Error al migrar imagen para usuario: ${user.first_name} ${user.last_name}`, error.message);
      }
    }
  }
};


const migrateImages = async () => {
  try {
    await migrateProductImages();
    await migrateUserImages();
    console.log("Migración de imágenes completada.");
  } catch (error) {
    console.error("Error durante la migración de imágenes:", error);
  }
};

migrateImages();