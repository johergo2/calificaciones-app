select * from usuarios

select * from participantes


INSERT INTO usuarios (nombre, email, contrasena)
VALUES
('Jorge Gomez 3', 'johergo3@gmail.com', 'Jorgito2');

INSERT INTO participantes (cedula, nombre, tipo, observacion)
VALUES
('16780919', 'Jorge Hernán Gómez R', 'Individual', 'Competidor individual');




ALTER TABLE usuarios
ADD COLUMN estado VARCHAR(3) NOT NULL DEFAULT 'ACT';

update usuarios 
set estado = 'INA'
where id

select * from eventos

delete from eventos where id in (16,17)

