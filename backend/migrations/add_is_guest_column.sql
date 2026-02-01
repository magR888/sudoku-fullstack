-- Migration: Add is_guest column to users table
-- Date: 2026-02-01
-- Description: Add is_guest flag for guest user accounts

-- Add is_guest column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'is_guest'
    ) THEN
        ALTER TABLE users ADD COLUMN is_guest BOOLEAN DEFAULT false;
        
        -- Create index for faster guest user queries
        CREATE INDEX idx_users_is_guest ON users(is_guest);
        
        RAISE NOTICE 'Column is_guest added successfully to users table';
    ELSE
        RAISE NOTICE 'Column is_guest already exists in users table';
    END IF;
END $$;

-- Update existing users to not be guests
UPDATE users SET is_guest = false WHERE is_guest IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN users.is_guest IS 'Flag indicating if user is a guest account (temporary)';
