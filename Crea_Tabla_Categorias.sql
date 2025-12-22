select * from usuarios

select * from eventos

select * from participantes

select * from jurados


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


INSERT INTO categorias (categoria)
VALUES ('Master')

select * from categorias	

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

	
select * from eventos_categorias

INSERT INTO eventos_categorias (evento_id, categoria_id)
VALUES ('19','3')

UPDATE eventos_categorias
        SET categoria_id = :categoria_id
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = :evid


SELECT
    c.id,
    c.categoria
FROM eventos_categorias ec
JOIN categorias c ON c.id = ec.categoria_id
WHERE ec.evento_id = 18
ORDER BY c.categoria;

select * from participantes_categorias_eventos

INSERT INTO participantes_categorias_eventos (cedula, evento_id, categoria_id)
VALUES ('16780919','19','2')

        SELECT
            pce.id,
            pce.cedula,
            p.nombre AS participante,
            pce.evento_id,
            e.nombre AS evento,
            pce.categoria_id,
            c.categoria,
            pce.fecha_creacion
        FROM participantes_categorias_eventos pce
        JOIN participantes p ON p.cedula = pce.cedula
        JOIN eventos e ON e.id = pce.evento_id
        JOIN categorias c ON c.id = pce.categoria_id
        WHERE 1=1

select * from jurados		

INSERT INTO jurados (cedula, nombre, observacion)
VALUES
('66458957', 'Pilar Villafanez', 'Senior');


select * from public.jurados_categorias_eventos

INSERT INTO jurados_categorias_eventos (cedula, evento_id, categoria_id)
VALUES ('66458957','19','3')

        SELECT
            pce.id,
            pce.cedula,
            p.nombre AS jurado,
            pce.evento_id,
            e.nombre AS evento,
            pce.categoria_id,
            c.categoria,
            pce.fecha_creacion
        FROM jurados_categorias_eventos pce
        JOIN jurados p ON p.cedula = pce.cedula
        JOIN eventos e ON e.id = pce.evento_id
        JOIN categorias c ON c.id = pce.categoria_id
        WHERE 1=1

SELECT 
	id,
	cedula_jurado,
	cedula_participan,
	evento_id,
	categoria_id,
	puntaje
FROM calificaciones
WHERE evento_id = :evento_id
ORDER BY evento_id


INSERT INTO calificaciones (cedula_jurado, cedula_participan, evento_id, categoria_id, puntaje)
VALUES ('66458957','16780917','19','2',7.5)