select * from usuarios

select * from eventos

select * from participantes where tip


INSERT INTO usuarios (nombre, email, contrasena)
VALUES
('Jorge Gomez 3', 'johergo3@gmail.com', 'Jorgito2');

INSERT INTO participantes (cedula, nombre, tipo, observacion)
VALUES
('Jorge Gomez 3', 'johergo3@gmail.com', 'Jorgito2');

INSERT INTO participantes (cedula, nombre, tipo, observacion)
VALUES ('16780917', 'Juan Grisales', 'Individual', 'Vieja Guardia')




ALTER TABLE usuarios
ADD COLUMN estado VARCHAR(3) NOT NULL DEFAULT 'ACT';

update usuarios 
set estado = 'INA'
where id

select * from eventos

delete from eventos where id in (16,17)



CREATE TABLE public.categorias
(
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(50) NOT NULL UNIQUE, 
    fecha_creacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP    
);


-- Trigger: trg_set_fecha_actualizacion

CREATE OR REPLACE TRIGGER trg_set_fecha_actualizacion_part
    BEFORE UPDATE 
    ON public.participantes
    FOR EACH ROW
    EXECUTE FUNCTION public.set_fecha_actualizacion();