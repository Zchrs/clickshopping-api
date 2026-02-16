import Chart from "react-apexcharts";
export const MyChart = () => {
    // Datos del gráfico de barras
    const options = {
      chart: {
        type: "bar3d",
        height: 100
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10
        }
      },
      xaxis: {
        categories: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
      },
      yaxis: {
        title: {
          text: "Cantidad"
        }
      },
      fill: {
        type: "gradient",
        colors: ["#008FFB"],
        gradient: {
          shadeIntensity: 0.5,
          opacityFrom: 0.8,
          opacityTo: 0.9,
          stops: [0, 60,]
        }
      },
      dataLabels: {
        enabled: false
      },
      title: {
        align: "center",
        margin: 20,
        offsetY: 20,
        style: {
          fontSize: "20px"
        }
      }
    };
  
    const series = [
      {
        name: "Cantidad",
        data: [30, 40, 45, 50, 49, 60, 70]
      }
    ];
  
    return (
      <div>
        {/* Renderizar el gráfico de barras */}
        <Chart options={options} series={series} type="bar" height={350} />
      </div>
    );
  };