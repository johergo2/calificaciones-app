CREATE TABLE public.calificaciones
(
    id SERIAL PRIMARY KEY,
	cedula_jurado character varying(20) NOT NULL,
	cedula_participan character varying(20) NOT NULL,
    evento_id integer NOT NULL,
    categoria_id integer NOT NULL,
	puntaje numeric(7,4) NOT NULL,
    fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_calificaciones
        UNIQUE (cedula_jurado, cedula_participan, evento_id, categoria_id),	

    CONSTRAINT fk_cedula_jurado_calificaciones
        FOREIGN KEY (cedula_jurado)
        REFERENCES public.jurados (cedula)
        ON DELETE CASCADE,		

    CONSTRAINT fk_cedula_participan_calificaciones
        FOREIGN KEY (cedula_participan)
        REFERENCES public.participantes (cedula)
        ON DELETE CASCADE,				

    CONSTRAINT fk_evento_calificaciones
        FOREIGN KEY (evento_id)
        REFERENCES public.eventos (id)
        ON DELETE CASCADE,
		
    CONSTRAINT fk_categoria_calificaciones
        FOREIGN KEY (categoria_id)
        REFERENCES public.categorias (id)
        ON DELETE CASCADE	
);

    