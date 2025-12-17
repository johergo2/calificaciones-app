-- Table: public.usuarios
select * from participantes
-- DROP TABLE IF EXISTS public.usuarios;

CREATE TABLE public.participantes
(
    id SERIAL PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE, 
    nombre VARCHAR(150) NOT NULL, 
    tipo VARCHAR(20) NOT NULL,
	observacion TEXT,
    fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT participantes_cedula_key UNIQUE (cedula)
);

-- Trigger: trg_set_fecha_actualizacion

CREATE OR REPLACE TRIGGER trg_set_fecha_actualizacion
    BEFORE UPDATE 
    ON public.participantes
    FOR EACH ROW
    EXECUTE FUNCTION public.set_fecha_actualizacion();


    id SERIAL PRIMARY KEY,  
    categoria VARCHAR(50) NOT NULL, 
    fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP