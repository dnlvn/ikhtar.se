-- Check actual column definition for current_price
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    is_generated,
    generation_expression
FROM information_schema.columns
WHERE table_name = 'mobile_plans_public'
ORDER BY ordinal_position;

-- Also check if plan_key exists and is unique
SELECT column_name, constraint_type
FROM information_schema.key_column_usage
JOIN information_schema.table_constraints USING (constraint_name, table_schema, table_name)
WHERE table_name = 'mobile_plans_public';
