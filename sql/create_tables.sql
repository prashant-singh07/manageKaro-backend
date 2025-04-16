CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    shop_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    address TEXT,
    email VARCHAR(255),
    gst VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    shop_id INTEGER NOT NULL,
    supplier_id INTEGER REFERENCES suppliers(id),
    invoice_number VARCHAR(50),
    invoice_date DATE,
    total_amount DECIMAL(10,2),
    payment_status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_items (
    id SERIAL PRIMARY KEY,
    purchase_id INTEGER REFERENCES purchases(id),
    sku_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 