import React, { useEffect, useRef } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

const ChartsSection = () => {
  const meterCanvasRef = useRef(null);
  const textElementRef = useRef(null);

  useEffect(() => {
    const ctx = meterCanvasRef.current.getContext('2d');
    const textElement = textElementRef.current;
    const totalRotation = ((71 / 100) * 180 * Math.PI) / 180;
    let rotation = 0;

    const drawDot = (x, y, dotRadius, dotColor) => {
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = dotColor;
      ctx.fill();
    };

    const drawDottedLine = (x1, y1, x2, y2, dotRadius, dotCount, dotColor) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const spaceX = dx / (dotCount - 1);
      const spaceY = dy / (dotCount - 1);
      let newX = x1;
      let newY = y1;

      for (let i = 0; i < dotCount; i++) {
        drawDot(newX, newY, dotRadius, dotColor);
        newX += spaceX;
        newY += spaceY;
      }
    };

    const calcPointsCirc = (cx, cy, rad, dashLength) => {
      const points = [];
      const n = rad / dashLength;
      const alpha = (Math.PI * 2) / n;

      for (let i = 0; i < n; i += 2) {
        const theta = alpha * i;
        const theta2 = alpha * (i + 1);

        points.push({
          x: Math.cos(theta) * rad + cx,
          y: Math.sin(theta) * rad + cy,
          ex: Math.cos(theta2) * rad + cx,
          ey: Math.sin(theta2) * rad + cy
        });
      }
      return points;
    };

    const animate = () => {
      ctx.clearRect(0, 0, meterCanvasRef.current.width, meterCanvasRef.current.height);
      const center = { x: 175, y: 175 };
      const radius = 174;

      ctx.beginPath();
      ctx.strokeStyle = rotation >= 0.75 * Math.PI ? "#FF9421" : "#35FFFF";
      ctx.lineWidth = 3;
      ctx.arc(center.x, center.y, radius, Math.PI, Math.PI + rotation);
      ctx.stroke();

      if (rotation <= 0.75 * Math.PI) {
        ctx.beginPath();
        ctx.strokeStyle = "#FF9421";
        ctx.arc(center.x, center.y, radius, 1.75 * Math.PI, 0);
        ctx.stroke();
      }

      const firstDottedLineDots = calcPointsCirc(center.x, center.y, 165, 1);
      for (const point of firstDottedLineDots) {
        drawDottedLine(point.x, point.y, 175, 175, 1.75, 30, "#35FFFF");
      }

      ctx.beginPath();
      ctx.arc(center.x, center.y, 80, 2 * Math.PI, 0);
      ctx.fillStyle = "black";
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.translate(center.x, center.y);
      ctx.rotate(rotation);
      ctx.moveTo(-75, 0);
      ctx.lineTo(-65, -10);
      ctx.lineTo(-65, 10);
      ctx.closePath();
      ctx.fillStyle = rotation >= 0.75 * Math.PI ? "#FF9421" : "#35FFFF";
      ctx.fill();
      ctx.restore();

      if (rotation < totalRotation) {
        rotation += (1 * Math.PI) / 180;
        if (rotation > totalRotation) {
          rotation -= (1 * Math.PI) / 180;
        }
      }

      textElement.innerHTML = Math.round((rotation / Math.PI) * 100) + "%";
      requestAnimationFrame(animate);
    };

    setTimeout(() => requestAnimationFrame(animate), 1500);
  }, []);

  const barData = {
    labels: ['Maths', 'Physics', 'Chemistry', 'Graphics', 'English', 'Tamil', 'Social'],
    datasets: [{
      label: 'Scores',
      data: [40, 80, 30, 90, 60, 70, 60],
      backgroundColor: '#00bcd4',
      borderWidth: 0
    }]
  };

  const barOptions = {
    indexAxis: 'y',
    scales: {
      x: {
        ticks: { color: '#fff' },
        grid: { color: '#444' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#fff' },
        grid: { color: '#444' }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Scores',
      data: [40, 55, 60, 70, 65, 50, 55],
      backgroundColor: 'rgba(0, 188, 212, 0.2)',
      borderColor: '#00bcd4',
      borderWidth: 2,
      pointBackgroundColor: '#00bcd4',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#00bcd4'
    }]
  };

  const pieData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
    datasets: [{
      label: 'Dataset 1',
      data: [300, 50, 100, 80, 120],
      backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4caf50', '#ab47bc'],
      hoverOffset: 4
    }]
  };

  return (
    <section className="charts-section">
      <div className="chart-container">
        <Bar data={barData} options={barOptions} />
      </div>
      <section className="charts-section multi-chart">
        <div className="chart-container">
          <div className="chart-title">Line Chart</div>
          <Line data={lineData} />
        </div>
        <div className="chart-container">
          <div className="chart-title">Pie Chart</div>
          <Pie data={pieData} />
        </div>
        <div className="chart-container">
          <div className="chart-title">ArchimediX Meter</div>
          <canvas ref={meterCanvasRef} height="175" width="350" aria-label="ArchimediX Meter"></canvas>
          <p className="text" ref={textElementRef}>0%</p>
          <p className="caption">ArchimediX Meter</p>
        </div>
      </section>
    </section>
  );
}

export default ChartsSection;
