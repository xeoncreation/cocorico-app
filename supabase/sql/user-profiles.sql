drop trigger if exists on_auth_user_created on auth.users;
CREATE TABLE user_profiles (
  user_id UNIQUEIDENTIFIER PRIMARY KEY,
  email NVARCHAR(255),
  plan NVARCHAR(20) NOT NULL DEFAULT 'free',
  role NVARCHAR(20) NOT NULL DEFAULT 'user',
  metadata NVARCHAR(MAX) DEFAULT '{}',
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX user_profiles_plan_idx ON user_profiles (plan);
CREATE INDEX user_profiles_role_idx ON user_profiles (role);
