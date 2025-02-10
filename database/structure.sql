
CREATE DATABASE IF NOT EXISTS ecommerce_vcircle;
USE ecommerce_vcircle;


create table Users (
	userId INT AUTO_INCREMENT PRIMARY KEY,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	email VARCHAR(50),
	password TEXT,
	user_image TEXT
);


create table Categories (
	categoryId INT AUTO_INCREMENT PRIMARY KEY,
	name_category VARCHAR(50)
);


create table Products (
	productId INT AUTO_INCREMENT PRIMARY KEY,
	product_name VARCHAR(100),
	description TEXT,
	price DECIMAL(8,2),
	product_image TEXT,
	category_id INT,
    FOREIGN KEY (category_id) REFERENCES Categories(categoryId) ON DELETE CASCADE ON UPDATE CASCADE
    );


create table Cart (
	cartId INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT,
	total_price INT,
    FOREIGN KEY (user_id) REFERENCES Users(userId) ON DELETE CASCADE ON UPDATE CASCADE
);


create table Cart_Products (
	cart_productId INT AUTO_INCREMENT PRIMARY KEY,
	cart_id INT,
	product_id INT,
	quantity INT,
	cart_price DECIMAL(8,2),
     FOREIGN KEY (cart_id) REFERENCES Cart(cartId) ON DELETE CASCADE ON UPDATE CASCADE,
     FOREIGN KEY (product_id) REFERENCES Products(productId) ON DELETE CASCADE ON UPDATE CASCADE
);