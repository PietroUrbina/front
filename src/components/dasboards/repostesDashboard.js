import React from 'react';
import './repostesDashboard.css'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';


// Datos de ejemplo para las ganancias (por meses)
const dataGanancias = [
  { mes: 'Enero', ganancia: 4000 },
  { mes: 'Febrero', ganancia: 3000 },
  { mes: 'Marzo', ganancia: 5000 },
  { mes: 'Abril', ganancia: 4000 },
  { mes: 'Mayo', ganancia: 6000 },
];

// Datos de ejemplo para las ventas (por categorías de productos)
const dataVentas = [
  { categoria: 'Bebidas', ventas: 500 },
  { categoria: 'Comidas', ventas: 200 },
  { categoria: 'Entradas', ventas: 800 },
  { categoria: 'Promociones', ventas: 600 },
];

const ReportesDashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Reportes de Ganancias y Ventas</h2>

      {/* Gráfico de Línea para Ganancias */}
      <div className="chart-container">
        <h3>Ganancias Mensuales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataGanancias}>
            <Line type="monotone" dataKey="ganancia" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Barras para Ventas */}
      <div className="chart-container">
        <h3>Ventas por Categoría</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataVentas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ventas" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportesDashboard;
