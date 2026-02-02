-- 1. Create a test user (If you haven't created one in Auth tab yet, you can do it there. 
-- BUT for the app to work, we need an Organization linked to that user.)

-- RUN THIS AFTER YOU HAVE SIGNED UP A USER via the App or Supabase Dashboard.
-- Replace 'YOUR_USER_ID_HERE' with the UUID from the Authentication > Users tab.

WITH new_org AS (
  INSERT INTO organizations (name) 
  VALUES ('My Demo Company') 
  RETURNING id
)
INSERT INTO user_organizations (user_id, organization_id, role)
SELECT 
  'YOUR_USER_ID_HERE'::uuid, -- REPLACE THIS with your actual User UUID
  id, 
  'owner'
FROM new_org;
