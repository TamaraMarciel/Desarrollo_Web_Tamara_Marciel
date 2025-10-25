console.log('📊 estadisticas.js cargado');

// Ver que Highcharts esté disponible
if (typeof Highcharts === 'undefined') {
    console.error('❌ Highcharts no está disponible en estadisticas.js');
} else {
    console.log('✓ Highcharts disponible en estadisticas.js');
    
    // Cargar los tres gráficos 
    cargarGraficoAvisosPorDia();
    cargarGraficoAvisosPorTipo();
    cargarGraficoAvisosPorMes();
}

/**
 *Avisos por día
 */
function cargarGraficoAvisosPorDia() {
    console.log('📈 Cargando gráfico de avisos por día...');
    
    fetch('/api/estadisticas/avisos-por-dia')
        .then(response => {
            console.log('Respuesta avisos-por-dia:', response.status);
            return response.json();
        })
        .then(result => {
            console.log('Datos avisos-por-dia:', result);
            
            if (!result.success) {
                console.error('Error al cargar datos:', result.error);
                mostrarMensajeError('lineal-chart', 'Error al cargar datos');
                return;
            }

            const data = result.data;
            
            if (!data || data.length === 0) {
                console.warn('No hay datos para mostrar');
                mostrarMensajeError('lineal-chart', 'No hay datos disponibles');
                return;
            }
            
            // Preparar datos para Highcharts
            const fechas = data.map(item => item.fecha);
            const cantidades = data.map(item => item.cantidad);
            
            console.log('Fechas:', fechas);
            console.log('Cantidades:', cantidades);

            // Crear gráfico de líneas
            Highcharts.chart('lineal-chart', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Avisos de Adopción por Día'
                },
                xAxis: {
                    categories: fechas,
                    title: {
                        text: 'Fecha'
                    },
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Cantidad de Avisos'
                    },
                    allowDecimals: false,
                    min: 0
                },
                series: [{
                    name: 'Avisos',
                    data: cantidades,
                    color: '#5DD9E8'  
                }],
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.x + '</b><br/>' +
                               'Avisos: ' + this.y;
                    }
                }
            });
            
            console.log('✅ Gráfico de líneas creado exitosamente');
        })
        .catch(error => {
            console.error('❌ Error al cargar gráfico de avisos por día:', error);
            mostrarMensajeError('lineal-chart', 'Error al cargar el gráfico');
        });
}

/**
 * Avisos por tipo de mascota
 */
function cargarGraficoAvisosPorTipo() {
    console.log('🥧 Cargando gráfico de avisos por tipo...');
    
    fetch('/api/estadisticas/avisos-por-tipo')
        .then(response => {
            console.log('Respuesta avisos-por-tipo:', response.status);
            return response.json();
        })
        .then(result => {
            console.log('Datos avisos-por-tipo:', result);
            
            if (!result.success) {
                console.error('Error al cargar datos:', result.error);
                mostrarMensajeError('pie-chart', 'Error al cargar datos');
                return;
            }

            const data = result.data;
            
            if (!data || data.length === 0) {
                console.warn('No hay datos para mostrar');
                mostrarMensajeError('pie-chart', 'No hay datos disponibles');
                return;
            }
            
            // Preparar datos para Highcharts 
            const seriesData = data.map(item => ({
                name: item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1),
                y: item.cantidad
            }));
            
            console.log('Series data:', seriesData);

            // Crear gráfico de torta
            Highcharts.chart('pie-chart', {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: 'Avisos por Tipo de Mascota'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)'
                        },
                        // colores turquesa
                        colors: ['#5DD9E8', '#3BA4B8']
                    }
                },
                series: [{
                    name: 'Avisos',
                    colorByPoint: true,
                    data: seriesData
                }],
                credits: {
                    enabled: false
                }
            });
            
            console.log('✅ Gráfico de torta creado exitosamente');
        })
        .catch(error => {
            console.error('❌ Error al cargar gráfico de avisos por tipo:', error);
            mostrarMensajeError('pie-chart', 'Error al cargar el gráfico');
        });
}

/**
 *  Avisos por mes y tipo
 */
function cargarGraficoAvisosPorMes() {
    console.log('📊 Cargando gráfico de avisos por mes...');
    
    fetch('/api/estadisticas/avisos-por-mes')
        .then(response => {
            console.log('Respuesta avisos-por-mes:', response.status);
            return response.json();
        })
        .then(result => {
            console.log('Datos avisos-por-mes:', result);
            
            if (!result.success) {
                console.error('Error al cargar datos:', result.error);
                mostrarMensajeError('bar-chart', 'Error al cargar datos');
                return;
            }

            const data = result.data;
            
            if (!data || data.length === 0) {
                console.warn('No hay datos para mostrar');
                mostrarMensajeError('bar-chart', 'No hay datos disponibles');
                return;
            }
            
            // Preparar datos para Highcharts
            const meses = data.map(item => {
                // Convertir fecha
                const [año, mes] = item.mes.split('-');
                const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                                      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                return nombresMeses[parseInt(mes) - 1] + ' ' + año;
            });
            
            const datosGatos = data.map(item => item.gato);
            const datosPerros = data.map(item => item.perro);
            
            console.log('Meses:', meses);
            console.log('Datos gatos:', datosGatos);
            console.log('Datos perros:', datosPerros);

            // Crear gráfico de barras
            Highcharts.chart('bar-chart', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Avisos de Adopción por Mes y Tipo'
                },
                xAxis: {
                    categories: meses,
                    title: {
                        text: 'Mes'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Cantidad de Avisos'
                    },
                    allowDecimals: false,
                    min: 0
                },
                plotOptions: {
                    column: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [{
                    name: 'Gatos',
                    data: datosGatos,
                    color: '#5DD9E8'  
                }, {
                    name: 'Perros',
                    data: datosPerros,
                    color: '#3BA4B8' 
                }],
                credits: {
                    enabled: false
                }
            });
            
            console.log('✅ Gráfico de barras creado exitosamente');
        })
        .catch(error => {
            console.error('❌ Error al cargar gráfico de avisos por mes:', error);
            mostrarMensajeError('bar-chart', 'Error al cargar el gráfico');
        });
}

/**
 * error en un contenedor
 */
function mostrarMensajeError(containerId, mensaje) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #666;">
                <p>${mensaje}</p>
            </div>
        `;
    }
}