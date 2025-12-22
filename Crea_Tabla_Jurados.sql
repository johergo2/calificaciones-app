-- Table: public.jurados

CREATE TABLE public.jurados
(
    id SERIAL PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE, 
    nombre VARCHAR(150) NOT NULL,     
	observacion TEXT,
    fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT jurados_cedula_key UNIQUE (cedula)
);

-- Trigger: trg_set_fecha_actualizacion_jur

CREATE OR REPLACE TRIGGER trg_set_fecha_actualizacion_jur
    BEFORE UPDATE 
    ON public.jurados
    FOR EACH ROW
    EXECUTE FUNCTION public.set_fecha_actualizacion();
