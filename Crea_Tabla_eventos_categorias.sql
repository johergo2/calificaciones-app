CREATE TABLE public.eventos_categorias
(
    id SERIAL PRIMARY KEY,
    evento_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_evento_evcat
        FOREIGN KEY (evento_id)
        REFERENCES public.eventos (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_categoria_evcat
        FOREIGN KEY (categoria_id)
        REFERENCES public.categorias (id)
        ON DELETE CASCADE,

    CONSTRAINT uq_evento_categoria
        UNIQUE (evento_id, categoria_id),

-- Trigger: trg_set_fecha_actualizacion

CREATE OR REPLACE TRIGGER trg_set_fecha_actualizacion_evcat
    BEFORE UPDATE 
    ON public.eventos_categorias
    FOR EACH ROW
    EXECUTE FUNCTION public.set_fecha_actualizacion();	

	
);

