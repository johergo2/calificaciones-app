CREATE TABLE public.participantes_categorias_eventos
(
    id SERIAL PRIMARY KEY,
	cedula character varying(20) NOT NULL,
    evento_id integer NOT NULL,
    categoria_id integer NOT NULL,
    fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_partic_categorias_event
        UNIQUE (cedula, evento_id, categoria_id),	

    CONSTRAINT fk_cedula_partcatev
        FOREIGN KEY (cedula)
        REFERENCES public.participantes (cedula)
        ON DELETE CASCADE,		

    CONSTRAINT fk_categoria_partcatev
        FOREIGN KEY (categoria_id)
        REFERENCES public.categorias (id)
        ON DELETE CASCADE,	

    CONSTRAINT fk_evento_partcatev
        FOREIGN KEY (evento_id)
        REFERENCES public.eventos (id)
        ON DELETE CASCADE
);

    