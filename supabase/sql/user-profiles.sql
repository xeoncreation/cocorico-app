
-- Elimina trigger si existe (SQL Server)
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'on_auth_user_created')
  DROP TRIGGER on_auth_user_created;

IF OBJECT_ID('dbo.user_profiles', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.user_profiles (
    user_id UNIQUEIDENTIFIER PRIMARY KEY,
    email NVARCHAR(255),
    plan NVARCHAR(20) NOT NULL DEFAULT 'free',
    role NVARCHAR(20) NOT NULL DEFAULT 'user',
    metadata NVARCHAR(MAX) DEFAULT '{}',
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
  );
END

IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = 'user_profiles_plan_idx')
  CREATE INDEX user_profiles_plan_idx ON dbo.user_profiles (plan);
IF NOT EXISTS (SELECT name FROM sys.indexes WHERE name = 'user_profiles_role_idx')
  CREATE INDEX user_profiles_role_idx ON dbo.user_profiles (role);
