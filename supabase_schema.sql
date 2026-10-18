-- =========================================================================
-- SISTEMA INTEGRAL EDTECH CNEB INICIAL (5 AÑOS) - SUPABASE SCHEMA
-- Proyecto: Matemática Divertida con Kusi
-- Docente Administradora: Prof. Yanet Salvador
-- =========================================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CONFIGURACIÓN DEL COLEGIO Y DEL AULA
CREATE TABLE IF NOT EXISTS public.colegio_config (
    id TEXT PRIMARY KEY DEFAULT 'aula_default',
    school_name TEXT NOT NULL DEFAULT 'I.E. Inicial San Gabriel',
    active_class TEXT NOT NULL DEFAULT 'Aula Los Creativos (5 Años)',
    teacher_name TEXT NOT NULL DEFAULT 'Prof. Yanet Salvador',
    teacher_phone TEXT DEFAULT '',
    mascot_icon TEXT DEFAULT '🦙',
    mascot_name TEXT DEFAULT 'Kusi',
    app_title TEXT DEFAULT 'Matemática Kusi',
    teacher_pin TEXT DEFAULT '1234',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. USUARIOS Y FAMILIAS (PADRES DE FAMILIA Y DOCENTE)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    rol TEXT NOT NULL CHECK (rol IN ('docente', 'padre')),
    pin_acceso TEXT DEFAULT '1234',
    ultimo_ingreso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. ESTUDIANTES (NIÑOS DEL AULA DE 5 AÑOS VINCULADOS A SU FAMILIA)
-- ID: Formato [Letra del Apellido] + 4 números aleatorios (Ej: V4821)
CREATE TABLE IF NOT EXISTS public.estudiantes (
    id TEXT PRIMARY KEY,
    parent_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    parent_nombre TEXT DEFAULT '',
    parent_telefono TEXT DEFAULT '',
    parent_email TEXT DEFAULT '',
    nombre TEXT NOT NULL,
    avatar TEXT NOT NULL DEFAULT '🦙',
    edad INTEGER DEFAULT 5,
    estrellas INTEGER DEFAULT 0,
    pin_acceso TEXT DEFAULT '1234',
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Migración segura si la tabla ya existía
ALTER TABLE public.estudiantes ADD COLUMN IF NOT EXISTS parent_email TEXT DEFAULT '';

-- 4. EVALUACIONES FORMATIVAS CNEB (NOTAS AD, A, B, C POR CADA RETO)
CREATE TABLE IF NOT EXISTS public.evaluaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estudiante_id TEXT NOT NULL REFERENCES public.estudiantes(id) ON DELETE CASCADE,
    juego_id TEXT NOT NULL,
    intentos INTEGER DEFAULT 0,
    aciertos INTEGER DEFAULT 0,
    pistas INTEGER DEFAULT 0,
    completado BOOLEAN DEFAULT false,
    calificacion TEXT DEFAULT 'Sin evaluar',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(estudiante_id, juego_id)
);

-- 5. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- Configuración pública optimizada para consumo seguro desde frontend y GitHub Pages
ALTER TABLE public.colegio_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluaciones ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso para clave anónima (anon public key)
DROP POLICY IF EXISTS "Permitir todo en colegio_config" ON public.colegio_config;
CREATE POLICY "Permitir todo en colegio_config" ON public.colegio_config FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en usuarios" ON public.usuarios;
CREATE POLICY "Permitir todo en usuarios" ON public.usuarios FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en estudiantes" ON public.estudiantes;
CREATE POLICY "Permitir todo en estudiantes" ON public.estudiantes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en evaluaciones" ON public.evaluaciones;
CREATE POLICY "Permitir todo en evaluaciones" ON public.evaluaciones FOR ALL USING (true) WITH CHECK (true);

-- 6. REGISTRO INICIAL POR DEFECTO DEL AULA
INSERT INTO public.colegio_config (id, school_name, active_class, teacher_name, mascot_icon, mascot_name, app_title)
VALUES ('aula_default', 'I.E. Inicial San Gabriel', 'Aula Los Creativos (5 Años)', 'Prof. Yanet Salvador', '🦙', 'Kusi', 'Matemática Kusi')
ON CONFLICT (id) DO NOTHING;

-- 7. VISTA CONSOLIDADA DE NOTAS DEL AULA (PARA REPORTES RÁPIDOS)
CREATE OR REPLACE VIEW public.vista_monitoreo_aula AS
SELECT 
    e.id AS estudiante_id,
    e.nombre AS estudiante_nombre,
    e.avatar AS estudiante_avatar,
    e.estrellas,
    e.parent_nombre,
    e.parent_telefono,
    e.pin_acceso,
    e.ultimo_acceso,
    COUNT(ev.id) FILTER (WHERE ev.completado = true) AS retos_completados,
    ROUND((COUNT(ev.id) FILTER (WHERE ev.completado = true)::decimal / 23) * 100) AS porcentaje_avance
FROM public.estudiantes e
LEFT JOIN public.evaluaciones ev ON e.id = ev.estudiante_id
GROUP BY e.id, e.nombre, e.avatar, e.estrellas, e.parent_nombre, e.parent_telefono, e.pin_acceso, e.ultimo_acceso;
