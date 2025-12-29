import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import type { CalificacionTot } from "../services/calificacionesApi";
import { getCalificacionestab } from "../services/calificacionesApi";

export default function CalificacionesTab() {
  const navigate = useNavigate();

  /* Estados */
  const [calificaciones, setCalificaciones] = useState<CalificacionTot[]>([]);

  /* Filtros por Columna (Cabecera de la Tabla) */
  const [filters, setFilters] = useState({
    cedula_jurado: "",
    jurado: "",
    evento_id: "",
    evento: "",
    categoria_id: "",
    categoria: "",
    cedula_participan: "",
    participante: "",
    puntaje: "",
  });

  /* Carga Inicial */
  useEffect(() => {
    cargarCalificaciones();
  }, []);

  const cargarCalificaciones = async () => {
    try {
      const data = await getCalificacionestab();
      setCalificaciones(data);
    } catch (error) {
      console.error("Error cargando calificaciones", error);
    }
  };

  /* Lógica de Filtrado */
  const calificacionesFiltradas = calificaciones.filter(c =>
    c.cedula_jurado.toLowerCase().includes(filters.cedula_jurado.toLowerCase()) &&
    c.jurado.toLowerCase().includes(filters.jurado.toLowerCase()) &&
    String(c.evento_id).toLowerCase().includes(filters.evento_id.toLowerCase()) &&
    c.evento.toLowerCase().includes(filters.evento.toLowerCase()) &&
    String(c.categoria_id).toLowerCase().includes(filters.categoria_id.toLowerCase()) &&
    c.categoria.toLowerCase().includes(filters.categoria.toLowerCase()) &&
    String(c.cedula_participan).toLowerCase().includes(filters.cedula_participan.toLowerCase()) &&
    c.participante.toLowerCase().includes(filters.participante.toLowerCase()) &&
    String(c.puntaje).toLowerCase().includes(filters.puntaje.toLowerCase())
  );


  /* Función para obtener valores únicos en los filtro de cada campo */
  const getUniqueValues = <T, K extends keyof T>(
    data: T[],
    key: K
  ): string[] => {
    return Array.from(
      new Set(
        data
          .map(item => item[key])
          .filter(v => v !== null && v !== undefined)
          .map(v => String(v))
      )
    );
  };


  /*********************************************
  * Estilos para los campos del formulario
   *********************************************/
  const selectStyle: React.CSSProperties = {
    fontSize: "0.9rem",
    padding: "4px 12px",
    borderRadius: 8,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    //marginLeft: "20px"
  };
  
  const thStyle: React.CSSProperties = {
    padding: "12px 14px",
    fontSize: "0.85rem",
    fontWeight: 600,
    textTransform: "uppercase",
    borderBottom: "2px solid #1005a7ff",
    borderRight: "1px solid #E5E7EB",    
    position: "sticky",
    top: 0,
    background: "linear-gradient(90deg, #007bff, #2563EB)",
    color: "#FFFFFF",
    zIndex: 3,
  };

  const tdStyle: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: "0.9rem",
    color: "#374151",
    borderRight: "1px solid #9db9f1ff",
  };

  const thFilterStyle: React.CSSProperties = {
    position: "sticky",
    top: 44,
    background: "#E0E7FF",
    zIndex: 2,
    padding: 6,
    borderBottom: "1px solid #CBD5E1",
  };

  const thInputStyle: React.CSSProperties = {
    width: "100%",
    fontSize: "0.75rem",
    padding: "4px 6px",
    borderRadius: 4,
    border: "1px solid #CBD5E1",
  };

  const filterSelectStyle: React.CSSProperties = {
    width: "100%",
    fontSize: "0.75rem",
    padding: "4px 6px",
    borderRadius: 6,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
  };



  /* ===============================
     Render
  ================================ */

  return (
    <div style={{ width: "90vw", padding: 5, background: "#f1f5f9", minHeight: "100vh" }}>


      <h2 style={{ textAlign: "center", color: "#1E40AF", fontWeight: 700, letterSpacing: "0.1PX", marginTop: 2 }}>
        CALIFICACIONES CONCURSO
      </h2>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => navigate("/menu")}
                  style={{
                    background: "#007bff",
                    color: "white",
                    fontSize: "0.75rem",
                    padding: "6px 12px",
                    //height: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                    transition: "all 0.2s",
                  }}                    
        >          
          ⬅ Volver al Menú</button>
      </div>

      {/* ===============================
         TABLA
      ================================ */}
      
          <div style={{ maxHeight: "80vh", overflowY: "auto", overflowX: "auto", marginTop: 2 }}>
            <table           
              width="100%" 
                style={{ 
                  marginTop: 2, 
                  borderCollapse: "collapse",
                  background: "#FFFFFF",
                  borderRadius: 12,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  tableLayout: "auto",
                  width: "auto",                  
                  minWidth: "100%",                         
                }}
            >
              <thead>
                <tr style={{ background: "linear-gradient(90deg, #007bff, #2563EB)", 
                            color: "#FFFFFF", textAlign: "center"}}>
                  <th style={{ ...thStyle, borderTopLeftRadius: 12}}>Cedula</th>
                  <th style={thStyle}>Jurado</th>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Evento</th>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Categoría</th>
                  <th style={thStyle}>No. ID</th>
                  <th style={thStyle}>Participante</th>
                  <th style={{ ...thStyle, borderTopRightRadius: 12}}>Puntaje</th>                
                </tr>
                {/*FILA DE FILTROS*/}
                <tr>
                  <th style={thFilterStyle}>
                    <select style={filterSelectStyle}
                      value={filters.cedula_jurado}                      
                      onChange={e => setFilters({ ...filters, cedula_jurado: e.target.value})}
                    >  
                      <option value="">Todos</option>
                            {getUniqueValues(calificaciones, "cedula_jurado").map(v => (
                            <option key={v} value={v}>{v}</option>
                            ))}
                    </select>
                  </th>

                  <th style={thFilterStyle}>
                    <select style={thInputStyle}    
                      onChange={e => setFilters({ ...filters, jurado: e.target.value})}
                    >  
                      <option value="">Todos</option>
                            {getUniqueValues(calificaciones, "jurado").map(v => (
                            <option key={v} value={v}>{v}</option>
                            ))}                                      
                    </select>
                  </th> 

                  <th style={thFilterStyle}>
                    <select style={thInputStyle}                                     
                      onChange={e => setFilters({ ...filters, evento_id: e.target.value})}
                    >  
                      <option value="">Todos</option>
                            {getUniqueValues(calificaciones, "evento_id").map(v => (
                            <option key={v} value={v}>{v}</option>
                            ))}                    
                    </select>                  
                  </th>  

                  <th style={thFilterStyle}>
                    <select style={thInputStyle}                                        
                      onChange={e => setFilters({ ...filters, evento: e.target.value})}
                    >   
                      <option value="">Todos</option>
                            {getUniqueValues(calificaciones, "evento").map(v => (
                            <option key={v} value={v}>{v}</option>
                            ))}                    
                    </select>                 
                  </th>

                  <th style={thFilterStyle}>
                    <select style={thInputStyle}                           
                      onChange={e => setFilters({ ...filters, categoria_id: e.target.value})}
                    > 
                      <option value="">Todos</option>
                            {getUniqueValues(calificaciones, "categoria_id").map(v => (
                            <option key={v} value={v}>{v}</option>
                            ))}                    
                    </select>                   
                  </th>   

                  <th style={thFilterStyle}>
                    <select style={thInputStyle}                       
                      onChange={e => setFilters({ ...filters, categoria: e.target.value})}
                    >
                      <option value="">Todos</option>
                            {getUniqueValues(calificaciones, "categoria").map(v => (
                            <option key={v} value={v}>{v}</option>
                            ))}                      
                    </select>

                  </th>                               
                  <th style={thFilterStyle}>
                    <select style={thInputStyle}                                          
                      onChange={e => setFilters({ ...filters, cedula_participan: e.target.value})}
                    >  
                      <option value="">Todos</option>
                            {getUniqueValues(calificaciones, "cedula_participan").map(v => (
                            <option key={v} value={v}>{v}</option>
                            ))}                    
                    </select>                  
                  </th>   

                  <th style={thFilterStyle}>
                    <select style={thInputStyle}                         
                      onChange={e => setFilters({ ...filters, participante: e.target.value})}
                    > 
                      <option value="">Todos</option>
                            {getUniqueValues(calificaciones, "participante").map(v => (
                            <option key={v} value={v}>{v}</option>
                            ))}                    
                    </select>                   
                  </th> 

                  <th style={thFilterStyle}>
                    <select style={thInputStyle}                                 
                      onChange={e => setFilters({ ...filters, puntaje: e.target.value})}
                    >    
                      <option value="">Todos</option>
                            {getUniqueValues(calificaciones, "puntaje").map(v => (
                            <option key={v} value={v}>{v}</option>
                            ))}                    
                    </select>                
                  </th>    

                </tr>
              </thead>
              <tbody>
                {calificacionesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                      No hay resultados
                    </td>
                  </tr>
                ) : (
                  calificacionesFiltradas.map(c => ( 
                    <tr key={c.id}>
                      <td style={tdStyle}>{c.cedula_jurado}</td>
                      <td style={tdStyle}>{c.jurado}</td>
                      <td style={tdStyle}>{c.evento_id}</td>
                      <td style={tdStyle}>{c.evento}</td>
                      <td style={tdStyle}>{c.categoria_id}</td>
                      <td style={tdStyle}>{c.categoria}</td>
                      <td style={tdStyle}>{c.cedula_participan}</td>
                      <td style={tdStyle}>{c.participante}</td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>{c.puntaje}</td>                  
                    </tr>
                  ))
                )}
              </tbody>
            </table>          
          </div>
    </div>
  );
}