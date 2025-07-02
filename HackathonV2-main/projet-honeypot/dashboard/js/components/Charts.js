/**
 * Gestion des graphiques du dashboard
 * Version simplifiée avec seulement la timeline
 */

import { CONFIG } from '../config.js';
import { TimezoneUtils } from '../utils/timezone.js';

class Charts {
    constructor(timelineId, typesId, trendsId) {
        this.containers = {
            timeline: document.getElementById(timelineId),
            types: null,  // Plus utilisé
            trends: null   // Plus utilisé
        };
        
        this.charts = {
            timeline: null,
            types: null,
            trends: null
        };
        
        this.init();
    }
    
    /**
     * Initialise les graphiques
     */
    init() {
        // Configuration par défaut de Chart.js
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.borderColor = 'rgba(148, 163, 184, 0.1)';
        Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        
        this.initTimeline();
        // Plus de initTypes() ni initTrends()
    }
    
    /**
     * Initialise le graphique timeline
     */
    initTimeline() {
        if (!this.containers.timeline) return;
        
        const ctx = this.containers.timeline.getContext('2d');
        
        this.charts.timeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Attaques',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: {
                            size: 14,
                            weight: 'normal'
                        },
                        bodyFont: {
                            size: 16,
                            weight: 'bold'
                        },
                        displayColors: false,
                        callbacks: {
                            title: (context) => {
                                return `${context[0].label}`;
                            },
                            label: (context) => {
                                return `${context.parsed.y} attaques`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(148, 163, 184, 0.05)'
                        },
                        ticks: {
                            stepSize: 1,
                            precision: 0
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Met à jour le graphique timeline
     */
    updateTimeline(data) {
        if (!this.charts.timeline || !data) return;
        
        const hours = Object.keys(data).sort();
        const values = hours.map(h => data[h]);
        
        // Formater les labels avec l'heure locale
        const labels = hours.map(h => {
            const date = new Date(h);
            return TimezoneUtils.formatTime(date);
        });
        
        // Animation fluide
        this.charts.timeline.data.labels = labels;
        this.charts.timeline.data.datasets[0].data = values;
        this.charts.timeline.update('active');
    }
    
    /**
     * Met à jour le graphique des types (plus utilisé)
     */
    updateTypes(data) {
        // Ne fait plus rien - méthode gardée pour compatibilité
        console.log('updateTypes called but not implemented');
    }
    
    /**
     * Met à jour le graphique des tendances (plus utilisé)
     */
    updateTrends(stats) {
        // Ne fait plus rien - méthode gardée pour compatibilité
        console.log('updateTrends called but not implemented');
    }
    
    /**
     * Détruit tous les graphiques
     */
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
    }
}

export default Charts;