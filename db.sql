create table categories (
	id serial primary key,
	title varchar(70) not null
);

create table products (
	id serial primary key,
	title varchar(70) not null,
	url text not null,
	description text not null,
	category_id int not null,
	FOREIGN KEY (category_id) REFERENCES categories(id)
);

create table products_items(
	id serial primary key,
	url text not null,
	product_id int not null,
	FOREIGN KEY (product_id) REFERENCES products(id)
)

CREATE OR REPLACE FUNCTION delete_items_and_product()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM products_items WHERE product_id = OLD.product_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_delete_items_and_product
BEFORE DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION delete_items_and_product();