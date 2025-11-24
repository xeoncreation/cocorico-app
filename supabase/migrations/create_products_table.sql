
-- BLOQUE 1: Tabla products para caché de escáner (SQL Server)
IF OBJECT_ID('dbo.products', 'U') IS NULL
BEGIN
	CREATE TABLE dbo.products (
		barcode NVARCHAR(255) PRIMARY KEY,
		name NVARCHAR(255),
		brand NVARCHAR(255),
		image NVARCHAR(255),
		nutri_score NVARCHAR(10),
		nova_group INT,
		cocorico_score INT,
		raw_off NVARCHAR(MAX),
		created_at DATETIME2 DEFAULT GETDATE()
	);
END
