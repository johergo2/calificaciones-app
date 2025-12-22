CREATE TABLE public.jurados_categorias_eventos
(
    id SERIAL PRIMARY KEY,
	cedula character varying(20) NOT NULL,
    evento_id integer NOT NULL,
    categoria_id integer NOT NULL,
    fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_jurados_categorias_event
        UNIQUE (cedula, evento_id, categoria_id),	

    CONSTRAINT fk_cedula_juradoscatev
        FOREIGN KEY (cedula)
        REFERENCES public.jurados (cedula)
        ON DELETE CASCADE,		

    CONSTRAINT fk_categoria_juradoscatev
        FOREIGN KEY (categoria_id)
        REFERENCES public.categorias (id)
        ON DELETE CASCADE,	

    CONSTRAINT fk_evento_juradoscatev
        FOREIGN KEY (evento_id)
        REFERENCES public.eventos (id)
        ON DELETE CASCADE
);

    