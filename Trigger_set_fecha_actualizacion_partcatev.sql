-- Trigger: trg_set_fecha_actualizacion_partcatev

CREATE OR REPLACE TRIGGER trg_set_fecha_actualizacion_partcatev
    BEFORE UPDATE 
    ON public.eventos_categorias
    FOR EACH ROW
    EXECUTE FUNCTION public.set_fecha_actualizacion();			