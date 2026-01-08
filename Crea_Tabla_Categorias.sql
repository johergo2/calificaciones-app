select * from usuarios

select * from eventos

select * from participantes

select * from jurados


INSERT INTO usuarios (nombre, email, contrasena, estado, rol)
VALUES
('Administrador', 'jorge.hernan.16780@gmail.com', 'Jorgito2', 'ACT', 'Administrador');

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

select * from calificaciones

delete from calificaciones where cedula_participan = '16780919'

INSERT INTO calificaciones (cedula_jurado, cedula_participan, evento_id, categoria_id, puntaje)
VALUES ('66458957','16780917','19','2',7.5)


SELECT
  c.id,
  j.nombre        AS jurado,
  e.nombre        AS evento,
  cat.categoria   AS categoria,
  p.nombre        AS participante,
  c.puntaje
FROM calificaciones c
JOIN jurados j
  ON j.cedula = c.cedula_jurado
JOIN eventos e
  ON e.id = c.evento_id
JOIN categorias cat
  ON cat.id = c.categoria_id
JOIN participantes p
  ON p.cedula = c.cedula_participan;



SELECT
  c.id,
  j.cedula||'-'||j.nombre        AS jurado,
  e.id||'-'||e.nombre        AS evento,
  cat.id||'-'||cat.categoria   AS categoria,
  p.cedula||'-'||p.nombre        AS participante,
  c.puntaje
FROM calificaciones c, jurados j, eventos e, categorias cat, participantes p
WHERE j.cedula = c.cedula_jurado
AND   e.id = c.evento_id
AND   cat.id = c.categoria_id
AND   p.cedula = c.cedula_participan;

   

select * from calificaciones where cedula_participan = '16780919'


select * from calificaciones_promedio --where evento_id = '20'

--delete from calificaciones_promedio

INSERT INTO calificaciones_promedio (
                        cedula_jurado,                        
                        cedula_participan,                        
                        evento_id,
                        categoria_id,
                        promedio
                    )
                    VALUES ('66458957','16780919','19','2','7.9')

SELECT 
   cedula_participan,                        
   evento_id,
   categoria_id,
   ROUND(AVG(puntaje),2) AS promedio
FROM calificaciones
GROUP BY cedula_participan,                        
         evento_id,
         categoria_id					

--DROP TABLE IF EXISTS calificaciones_promedio CASCADE;



SELECT
c.id,
e.id            AS evento_id,
e.nombre        AS evento,
cat.id          AS categoria_id,
cat.categoria   AS categoria,
p.cedula        AS cedula_participan,
p.nombre        AS participante,
c.promedio
FROM calificaciones_promedio c, eventos e, categorias cat, participantes p
WHERE e.id = c.evento_id
AND   cat.id = c.categoria_id
AND   p.cedula = c.cedula_participan
ORDER BY e.id, cat.id, c.promedio desc


                    SELECT
                        c.id,
                        c.categoria
                    FROM eventos_categorias ec
                    JOIN categorias c ON c.id = ec.categoria_id
                    INNER JOIN usuarios_eventos ue
                       ON ue.evento_id = ec.evento_id
                    WHERE ec.evento_id = 19
                    AND   ue.usuario_id = 1
                    ORDER BY c.categoria

select * FROM eventos_categorias --ec.categoria_id		 

select * FROM categorias  c.id

select * FROM usuarios_eventos --ue.evento_id ec.evento_id

INSERT INTO usuarios_eventos (usuario_id, evento_id, rol)
VALUES ('4','23','n')

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
		JOIN usuarios_eventos ue ON ue.evento_id = e.id
        WHERE ue.usuario_id = 2


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
		JOIN usuarios_eventos ue ON ue.evento_id = e.id
        WHERE 1=1		
		AND pce.evento_id = '20'
		AND pce.cedula = '16444232'
		AND ue.usuario_id = 1
		ORDER BY pce.evento_id, pce.categoria_id, pce.cedula

                  SELECT 
                      c.id,
                      c.cedula_jurado,
                      c.cedula_participan,
                      c.evento_id,
                      c.categoria_id,
                      c.puntaje
                  FROM calificaciones c
				  JOIN usuarios_eventos ue ON ue.evento_id = c.evento_id
				  AND  ue.usuario_id = 2
                  ORDER BY c.evento_id,	c.categoria_id, c.cedula_participan, c.cedula_jurado




                    SELECT
                    c.id,
                    j.cedula        AS cedula_jurado,
                    j.nombre        AS jurado,
                    e.id            AS evento_id,
                    e.nombre        AS evento,
                    cat.id          AS categoria_id,
                    cat.categoria   AS categoria,
                    p.cedula        AS cedula_participan,
                    p.nombre        AS participante,
                    c.puntaje
                    FROM calificaciones c, jurados j, eventos e, categorias cat, participantes p, usuarios_eventos ue
                    WHERE j.cedula = c.cedula_jurado
                    AND   e.id = c.evento_id
                    AND   cat.id = c.categoria_id
                    AND   p.cedula = c.cedula_participan 
					AND   ue.evento_id = c.evento_id
					AND   ue.usuario_id = 1
					AND   j.cedula = '16444232'


                SELECT
                c.id,
                e.id            AS evento_id,
                e.nombre        AS evento,
                cat.id          AS categoria_id,
                cat.categoria   AS categoria,
                p.cedula        AS cedula_participan,
                p.nombre        AS participante,
                c.promedio
                FROM calificaciones_promedio c, eventos e, categorias cat, participantes p
                WHERE e.id = c.evento_id
                AND   cat.id = c.categoria_id
                AND   p.cedula = c.cedula_participan 
				AND e.id = '20'
	            AND EXISTS (
	                SELECT 1
	                FROM usuarios_eventos ue
	                WHERE ue.evento_id = e.id
	                AND ue.usuario_id = 1	)			
				ORDER BY e.id, cat.id, c.promedio desc

select * from jurados_categorias_eventos	

select * from usuarios 

select u.id, u.nombre, u.email, u.estado, u.rol , ue.evento_id
from usuarios u
JOIN usuarios_eventos ue ON ue.usuario_id = u.id

select usuarios_eventos.* from usuarios_eventos order by evento_id

ALTER TABLE usuarios
ADD COLUMN rol VARCHAR(20) NOT NULL DEFAULT 'Participante'
CHECK (rol IN ('Administrador', 'Jurado', 'Participante'));


        INSERT INTO usuarios (nombre, email, contrasena, estado, rol)
        VALUES ('Pilar Villafanez', 'pilar@email.com', '123456', 'ACT', 'Participante')

INSERT INTO usuarios_eventos (usuario_id, evento_id)
        VALUES ('8', '19')		


ALTER TABLE usuarios_eventos
DROP CONSTRAINT fk_usuario_usueven;

UPDATE usuarios SET id = 1 WHERE id = 333

UPDATE usuarios SET id = 1 WHERE id = 4

ALTER TABLE usuarios_eventos
ADD CONSTRAINT fk_usuario_usueven
FOREIGN KEY (usuario_id)
REFERENCES usuarios(id)
ON UPDATE CASCADE;

select * from usuarios order by id

select * from usuarios_eventos order by evento_id

select * from eventos order by id