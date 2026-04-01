-- SQL Migration: Update Candidates Status to Professional ATS Stages
-- This script updates legacy candidate status values to the new professional stage names
-- to ensure consistency across the dashboard.

-- 1. APPLIED / NEW -> Nuevo
UPDATE job_applications 
SET status = 'Nuevo' 
WHERE LOWER(status) IN ('applied', 'nuevo', 'sourced', 'sourced candidate');

-- 2. SCREENING -> Screening
UPDATE job_applications 
SET status = 'Screening' 
WHERE LOWER(status) IN ('screening', 'phone screening');

-- 3. INTERVIEW -> Entrevista RRHH
UPDATE job_applications 
SET status = 'Entrevista RRHH' 
WHERE LOWER(status) IN ('interview', 'entrevista rrhh', 'entrevista');

-- 4. TECHNICAL / TRIAL -> Entrevista Técnica
UPDATE job_applications 
SET status = 'Entrevista Técnica' 
WHERE LOWER(status) IN ('technical', 'technical interview', 'prueba técnica', 'entrevista técnica');

-- 5. OFFER -> Oferta
UPDATE job_applications 
SET status = 'Oferta' 
WHERE LOWER(status) IN ('offer', 'oferta');

-- 6. HIRED -> Contratado
UPDATE job_applications 
SET status = 'Contratado' 
WHERE LOWER(status) IN ('hired', 'contratado');

-- 7. REJECTED / ARCHIVED -> Desestimado
UPDATE job_applications 
SET status = 'Desestimado' 
WHERE LOWER(status) IN ('rejected', 'desestimado', 'rechazado', 'withdrawn', 'archived');
