-- 🏗️ ESTRUCTURA DE BASE DE DATOS: licorera
-- Versión: PostgreSQL (Limpiada de lógica de negocio)

-- 0. EXTENSIONES Y TIPOS
CREATE TYPE user_role AS ENUM ('Admin', 'Empleado', 'Cliente');
CREATE TYPE user_status AS ENUM ('Activo', 'Inactivo', 'Bloqueado');
CREATE TYPE availability_status AS ENUM ('Disponible', 'Ocupado');
CREATE TYPE category_status AS ENUM ('Activa', 'Inactiva');
CREATE TYPE product_status AS ENUM ('Activo', 'Descontinuado');
CREATE TYPE payment_method AS ENUM ('Efectivo', 'Transferencia', 'Tarjeta', 'Datafono');
CREATE TYPE order_status AS ENUM ('Pendiente', 'Confirmado', 'En_Camino', 'Entregado', 'Cancelado', 'Devuelto');
CREATE TYPE order_origin AS ENUM ('Web', 'POS', 'Telefono', 'WhatsApp');
CREATE TYPE return_status AS ENUM ('Pendiente', 'Aprobada', 'Rechazada');
CREATE TYPE item_condition AS ENUM ('Buen_Estado', 'Dañado');
CREATE TYPE inventory_action AS ENUM ('Venta', 'Compra', 'Ajuste_Manual', 'Devolucion', 'Merma');
CREATE TYPE alert_type AS ENUM ('Stock_Bajo', 'Agotado', 'Por_Vencer');
CREATE TYPE priority_level AS ENUM ('Baja', 'Media', 'Alta');
CREATE TYPE ticket_status AS ENUM ('Abierto', 'En_Proceso', 'Cerrado');

-- 1. TABLAS: SEGURIDAD Y USUARIOS
CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol user_role NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE NULL,
    estado user_status DEFAULT 'Activo',
    disponibilidad_reparto availability_status NULL DEFAULT NULL,
    aceptacion_habeas_data BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Direcciones_Clientes (
    id_direccion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    alias VARCHAR(50),
    direccion_texto VARCHAR(200) NOT NULL,
    barrio VARCHAR(100),
    es_principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE Intentos_Login (
    id_intento SERIAL PRIMARY KEY,
    correo VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    fecha_intento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exitoso BOOLEAN NOT NULL,
    detalles VARCHAR(255)
);

-- 2. TABLAS: CATÁLOGO E INVENTARIO
CREATE TABLE Categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    estado category_status DEFAULT 'Activa'
);

CREATE TABLE Productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_categoria INT,
    precio_venta DECIMAL(10, 2) NOT NULL,
    costo_unitario DECIMAL(10, 2) NOT NULL,
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 5,
    lote_vencimiento DATE NULL,
    imagen_url VARCHAR(255),
    codigo_barras VARCHAR(50) UNIQUE NULL,
    estado product_status DEFAULT 'Activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria),
    CONSTRAINT chk_stock_positivo CHECK (stock_actual >= 0)
);

CREATE TABLE Historial_Precios (
    id_historial SERIAL PRIMARY KEY,
    id_producto INT NOT NULL,
    precio_anterior DECIMAL(10, 2),
    precio_nuevo DECIMAL(10, 2),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario_responsable INT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto),
    FOREIGN KEY (id_usuario_responsable) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Lista_Deseos (
    id_favorito SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_usuario_producto UNIQUE (id_usuario, id_producto),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
);

-- 3. TABLAS: OPERACIÓN DE VENTAS
CREATE TABLE Carrito_Compras (
    id_carrito SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
);

CREATE TABLE Pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INT NULL,
    id_empleado_encargado INT NULL,
    nombre_contacto VARCHAR(100) NOT NULL,
    telefono_contacto VARCHAR(20) NOT NULL,
    direccion_entrega VARCHAR(255) NOT NULL,
    email_contacto VARCHAR(100) NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    metodo_pago payment_method NOT NULL,
    estado order_status DEFAULT 'Pendiente',
    codigo_otp VARCHAR(6) NULL,
    origen order_origin DEFAULT 'Web',
    notas_especiales TEXT,
    FOREIGN KEY (id_cliente) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_empleado_encargado) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Detalle_Pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal_linea DECIMAL(10, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

-- 4. TABLAS: DEVOLUCIONES
CREATE TABLE Devoluciones (
    id_devolucion SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT NOT NULL,
    id_empleado_autoriza INT,
    estado return_status DEFAULT 'Pendiente',
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
    FOREIGN KEY (id_empleado_autoriza) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Detalle_Devoluciones (
    id_detalle_devolucion SERIAL PRIMARY KEY,
    id_devolucion INT NOT NULL,
    id_detalle_pedido INT NOT NULL,
    cantidad_devuelta INT NOT NULL,
    estado_producto item_condition NOT NULL,
    FOREIGN KEY (id_devolucion) REFERENCES Devoluciones(id_devolucion) ON DELETE CASCADE,
    FOREIGN KEY (id_detalle_pedido) REFERENCES Detalle_Pedido(id_detalle)
);

-- 5. TABLAS: FINANZAS
CREATE TABLE Gastos_Caja (
    id_gasto SERIAL PRIMARY KEY,
    id_empleado INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empleado) REFERENCES Usuarios(id_usuario)
);

CREATE TABLE Arqueos_Caja (
    id_arqueo SERIAL PRIMARY KEY,
    id_empleado INT NOT NULL,
    fecha_cierre TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ventas_sistema DECIMAL(10, 2) NOT NULL,
    gastos_registrados DECIMAL(10, 2) NOT NULL,
    monto_esperado DECIMAL(10, 2) NOT NULL,
    monto_real DECIMAL(10, 2) NOT NULL,
    diferencia DECIMAL(10, 2) GENERATED ALWAYS AS (monto_real - monto_esperado) STORED,
    observaciones TEXT,
    FOREIGN KEY (id_empleado) REFERENCES Usuarios(id_usuario)
);

-- 6. TABLAS: AUDITORÍA Y SOPORTE
CREATE TABLE Auditoria_Inventario (
    id_log SERIAL PRIMARY KEY,
    id_producto INT NOT NULL,
    id_detalle_pedido INT NULL,
    accion inventory_action NOT NULL,
    cantidad_afectada INT NOT NULL,
    stock_antes INT NOT NULL,
    stock_despues INT NOT NULL,
    motivo TEXT,
    usuario_responsable VARCHAR(100),
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

CREATE TABLE Alertas_Stock (
    id_alerta SERIAL PRIMARY KEY,
    id_producto INT NOT NULL,
    tipo_alerta alert_type NOT NULL,
    fecha_alerta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revisado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

CREATE TABLE Tickets_Soporte (
    id_ticket SERIAL PRIMARY KEY,
    id_usuario INT NULL,
    email_contacto VARCHAR(100) NOT NULL,
    asunto VARCHAR(150),
    mensaje TEXT,
    prioridad priority_level DEFAULT 'Media',
    estado ticket_status DEFAULT 'Abierto',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- 7. FUNCIONES Y TRIGGERS (PL/pgSQL)
-- Estos se mantienen porque garantizan INTEGRIDAD de datos independientemente del backend.

CREATE OR REPLACE FUNCTION fn_actualizar_stock_venta() 
RETURNS TRIGGER AS $$
DECLARE
    stock_previo INT;
    pedido_estado order_status;
BEGIN
    SELECT estado INTO pedido_estado FROM Pedidos WHERE id_pedido = NEW.id_pedido;
    IF pedido_estado != 'Cancelado' THEN
        SELECT stock_actual INTO stock_previo FROM Productos WHERE id_producto = NEW.id_producto;
        UPDATE Productos SET stock_actual = stock_actual - NEW.cantidad WHERE id_producto = NEW.id_producto;
        INSERT INTO Auditoria_Inventario (id_producto, id_detalle_pedido, accion, cantidad_afectada, stock_antes, stock_despues, usuario_responsable, motivo)
        VALUES (NEW.id_producto, NEW.id_detalle, 'Venta', -NEW.cantidad, stock_previo, stock_previo - NEW.cantidad, 'SISTEMA AUTO', 'Pedido #' || NEW.id_pedido);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_stock_venta
AFTER INSERT ON Detalle_Pedido
FOR EACH ROW EXECUTE FUNCTION fn_actualizar_stock_venta();

CREATE OR REPLACE FUNCTION fn_historial_precios() 
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.precio_venta != NEW.precio_venta THEN
        INSERT INTO Historial_Precios (id_producto, precio_anterior, precio_nuevo, id_usuario_responsable)
        VALUES (NEW.id_producto, OLD.precio_venta, NEW.precio_venta, 1);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_historial_precios
BEFORE UPDATE ON Productos
FOR EACH ROW EXECUTE FUNCTION fn_historial_precios();

CREATE OR REPLACE FUNCTION fn_alerta_stock() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock_actual <= NEW.stock_minimo THEN
        INSERT INTO Alertas_Stock (id_producto, tipo_alerta)
        VALUES (NEW.id_producto, 'Stock_Bajo');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_alerta_stock
AFTER UPDATE ON Productos
FOR EACH ROW EXECUTE FUNCTION fn_alerta_stock();

CREATE OR REPLACE FUNCTION fn_generar_otp() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.origen = 'Web' AND NEW.codigo_otp IS NULL THEN
        NEW.codigo_otp := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_otp
BEFORE INSERT ON Pedidos
FOR EACH ROW EXECUTE FUNCTION fn_generar_otp();

-- 8. DATOS DE PRUEBA
INSERT INTO Usuarios (nombre_completo, correo, password_hash, rol, telefono, fecha_nacimiento, disponibilidad_reparto) VALUES
('Carlos Dueño', 'admin@aranjuez.com', 'hash_123', 'Admin', '3001111111', '1985-05-20', NULL),
('Juan Todoterreno', 'empleado@aranjuez.com', 'hash_123', 'Empleado', '3002222222', '1995-10-15', 'Disponible'),
('Laura Cliente', 'cliente@gmail.com', 'hash_123', 'Cliente', '3003333333', '2000-01-10', NULL);

INSERT INTO Categorias (nombre) VALUES ('Aguardiente'), ('Ron'), ('Whisky'), ('Tequila'), ('Cervezas'), ('Vapes');

INSERT INTO Productos (nombre, id_categoria, precio_venta, costo_unitario, stock_actual, stock_minimo, imagen_url) VALUES
('Aguardiente Antioqueño Tapa Azul', 1, 45000, 32000, 120, 12, 'img/guaro.png'),
('Ron Viejo de Caldas 3 Años', 2, 52000, 38000, 60, 10, 'img/ron.png'),
('Buchanans 12 Años', 3, 145000, 110000, 40, 5, 'img/buchanas.png'),
('Don Julio 70', 4, 280000, 210000, 15, 2, 'img/tequila.png'),
('Cerveza Corona x6', 5, 28000, 19000, 100, 24, 'img/corona.png'),
('Vuse Go Mint Ice', 6, 35000, 20000, 200, 20, 'img/vuse.png');
