CREATE TABLE public.usuarios_eventos
(
    id SERIAL PRIMARY KEY,
	usuario_id INTEGER NOT NULL,
	evento_id INTEGER NOT NULL,
	rol VARCHAR(20) DEFAULT 'Participante' NOT NULL,
    fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_usuario_evento
        UNIQUE (usuario_id, evento_id),	

    CONSTRAINT fk_usuario_usueven
        FOREIGN KEY (usuario_id)
        REFERENCES public.usuarios(id)
        ON DELETE CASCADE,		

    CONSTRAINT fk_evento_usueven
        FOREIGN KEY (evento_id)
        REFERENCES public.eventos(id)
        ON DELETE CASCADE				
);

-- Trigger: trg_set_fecha_actualizacion

CREATE OR REPLACE TRIGGER trg_set_fecha_actualizacion_usueven
    BEFORE UPDATE 
    ON public.usuarios_eventos
    FOR EACH ROW
    EXECUTE FUNCTION public.set_fecha_actualizacion();

