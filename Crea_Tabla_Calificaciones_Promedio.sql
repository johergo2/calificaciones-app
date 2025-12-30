CREATE TABLE public.calificaciones_promedio
(
    id SERIAL PRIMARY KEY,
	cedula_jurado character varying(20) NOT NULL,
	cedula_participan character varying(20) NOT NULL,
    evento_id integer NOT NULL,
    categoria_id integer NOT NULL,
	promedio numeric(7,4) NOT NULL,
    fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_calificaciones_promedio
        UNIQUE (cedula_jurado, cedula_participan, evento_id, categoria_id),	

    CONSTRAINT fk_cedula_jurado_calificaciones_prom
        FOREIGN KEY (cedula_jurado)
        REFERENCES public.jurados (cedula)
        ON DELETE CASCADE,		

    CONSTRAINT fk_cedula_participan_calificaciones_prom
        FOREIGN KEY (cedula_participan)
        REFERENCES public.participantes (cedula)
        ON DELETE CASCADE,				

    CONSTRAINT fk_evento_calificaciones_prom
        FOREIGN KEY (evento_id)
        REFERENCES public.eventos (id)
        ON DELETE CASCADE,
		
    CONSTRAINT fk_categoria_calificaciones_prom
        FOREIGN KEY (categoria_id)
        REFERENCES public.categorias (id)
        ON DELETE CASCADE	
);

-- Trigger: trg_set_fecha_actualizacion

CREATE OR REPLACE TRIGGER trg_set_fecha_actualizacion_prom
    BEFORE UPDATE 
    ON public.calificaciones_promedio
    FOR EACH ROW
    EXECUTE FUNCTION public.set_fecha_actualizacion();


    