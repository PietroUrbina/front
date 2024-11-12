import React from 'react';
import './Dashboard.css'; // Importa los estilos

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Header con estadísticas principales */}
      <div className="dashboard-header">
        <div className="card">
          <span className="icon">🛒</span>
          <div>
            <p>Compras</p>
            <h2>$0.00</h2>
          </div>
        </div>
        <div className="card">
          <span className="icon">🛍️</span>
          <div>
            <p>Ventas</p>
            <h2>$0.00</h2>
          </div>
        </div>
        <div className="card">
          <span className="icon">👥</span>
          <div>
            <p>Clientes</p>
            <h2>28</h2>
          </div>
        </div>
        <div className="card">
          <span className="icon">📑</span>
          <div>
            <p>Proveedores</p>
            <h2>5</h2>
          </div>
        </div>
      </div>

      {/* Artículos más vendidos */}
      <div className="top-selling">
        <h3>Artículos más vendidos</h3>
        <table>
          <thead>
            <tr>
              <th>Artículo</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Cantidad</th>
              <th>Ventas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TECLADOS PC</td>
              <td>385</td>
              <td>65%</td>
              <td>52</td>
              <td>$56,367.00</td>
            </tr>
            {/* Agrega más filas de artículos aquí */}
          </tbody>
        </table>
      </div>

      {/* Ventas resumen */}
      <div className="sales-summary">
        <div className="sales-card">
          <span className="icon">🌍</span>
          <p>Ventas hoy</p>
          <h2>$0.00</h2>
          <small>0% Desde ayer</small>
        </div>
        <div className="sales-card">
          <span className="icon">📅</span>
          <p>Ventas semana</p>
          <h2>$40,001.00</h2>
          <small>100% Desde la semana pasada</small>
        </div>
        <div className="sales-card">
          <span className="icon">🏅</span>
          <p>Ventas mes</p>
          <h2>$58,176.70</h2>
          <small>22.7% Desde el mes pasado</small>
        </div>
      </div>

      {/* Compra y venta en gráficos */}
      <div className="charts">
        <div className="chart-card">
          <h3>Compra de los últimos 10 días</h3>
          {/* Aquí va el gráfico de compras */}
        </div>
        <div className="chart-card">
          <h3>Venta en los últimos 12 meses</h3>
          {/* Aquí va el gráfico de ventas */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
