-- =====================================================
-- ACCEPT INVITE FUNCTION (Security Definer)
-- =====================================================
-- This function runs with elevated privileges to check for invites for the current user.

CREATE OR REPLACE FUNCTION accept_my_invite()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- <--- Runs as the creator of the function (postgres/admin)
AS $$
DECLARE
  current_user_email text;
  invite_record record;
  org_id uuid;
BEGIN
  -- 1. Get current user's email
  SELECT email INTO current_user_email FROM auth.users WHERE id = auth.uid();
  
  IF current_user_email IS NULL THEN
     RETURN json_build_object('success', false, 'error', 'No authenticated user');
  END IF;

  -- 2. Find pending invite
  SELECT * INTO invite_record 
  FROM organization_invites 
  WHERE email = current_user_email AND status = 'pending'
  LIMIT 1;

  IF invite_record IS NULL THEN
     RETURN json_build_object('success', false, 'message', 'No pending invites found');
  END IF;

  -- 3. Add to user_organizations
  INSERT INTO user_organizations (user_id, organization_id, role)
  VALUES (auth.uid(), invite_record.organization_id, invite_record.role)
  ON CONFLICT (user_id, organization_id) DO NOTHING;

  -- 4. Update invite status
  UPDATE organization_invites 
  SET status = 'accepted' 
  WHERE id = invite_record.id;

  RETURN json_build_object('success', true, 'organization_id', invite_record.organization_id);
END;
$$;
