/**
 * Application principale du Dashboard Honeypot
 * Orchestre tous les composants et gère les mises à jour
 */

import { CONFIG, getRiskLevel, getCountryInfo } from './config.js';
import { API } from './utils/api.js';
import { TimezoneUtils } from './utils/timezone.js';
import Clock from './components/Clock.js';
import LiveFeed from './components/LiveFeed.js';
import Charts from './components/Charts.js';

class HoneypotDashboard {
    constructor() {
        this.components = {};
        this.data = {
            stats: null,
            threats: [],
            attackers: []
        };
        this.updateIntervals = {};
        this.lastThreatCount = 0;
        this.soundEnabled = true;
        this.init();
    }
    
    /**
     * Initialise l'application
     */
    async init() {
        console.log('🚀 Dashboard Honeypot démarrage...');
        console.log(`📍 Timezone: ${TimezoneUtils.userTimezone}`);
        console.log(`🔗 API: ${CONFIG.API_URL}`);
        
        // Initialiser les composants
        this.initComponents();
        
        // Configurer les callbacks API
        this.setupAPICallbacks();
        
        // Charger les données initiales
        await this.loadInitialData();
        
        // Démarrer les mises à jour automatiques
        this.startAutoUpdates();
        
        // Attacher les event listeners globaux
        this.attachEventListeners();
        
        // Afficher le statut
        this.updateConnectionStatus(true);
        
        console.log('✅ Dashboard prêt!');
    }
    
    /**
     * Initialise tous les composants
     */
    initComponents() {
        // Clock
        this.components.clock = new Clock('clock-container');
        
        // Live Feed
        this.components.liveFeed = new LiveFeed('live-feed-container');
        
        // Charts - seulement timeline
        this.components.charts = new Charts(
            'timeline-chart',
            null,  // Plus de types chart
            null   // Plus de trends chart
        );
    }
    
    /**
     * Configure les callbacks de l'API
     */
    setupAPICallbacks() {
        // Quand l'API passe offline
        API.on('onOffline', () => {
            this.updateConnectionStatus(false);
            this.showNotification('Connexion perdue', 'Tentative de reconnexion...', 'error');
        });
        
        // Quand l'API revient online
        API.on('onOnline', () => {
            this.updateConnectionStatus(true);
            this.showNotification('Connexion rétablie', 'Mise à jour des données...', 'success');
            this.updateDashboard();
        });
        
        // Sur erreur API
        API.on('onError', (error, endpoint) => {
            console.error(`Erreur API sur ${endpoint}:`, error);
        });
    }
    
    /**
     * Charge les données initiales
     */
    async loadInitialData() {
        try {
            // Vérifier la santé de l'API
            const isHealthy = await API.checkHealth();
            if (!isHealthy) {
                throw new Error('API non disponible');
            }
            
            // Charger toutes les données
            await this.updateDashboard();
            
        } catch (error) {
            console.error('Erreur lors du chargement initial:', error);
            this.showNotification(
                'Erreur de connexion',
                'Impossible de se connecter à l\'API. Vérifiez que le serveur est démarré.',
                'error'
            );
        }
    }
    
    /**
     * Démarre les mises à jour automatiques
     */
    startAutoUpdates() {
        // Mise à jour générale
        this.updateIntervals.dashboard = setInterval(
            () => this.updateDashboard(),
            CONFIG.UPDATE_INTERVAL
        );
        
        // Mise à jour du feed live
        this.updateIntervals.liveFeed = setInterval(
            () => this.updateLiveFeed(),
            CONFIG.LIVE_FEED_INTERVAL
        );
    }
    
    /**
     * Met à jour tout le dashboard
     */
    async updateDashboard() {
        try {
            // Récupérer les stats
            const stats = await API.getStats(CONFIG.CHART_HOURS_DEFAULT);
            this.data.stats = stats;
            
            // Mode démo si pas de données
            if (!this.data.stats || this.data.stats.total_threats === 0) {
                this.generateDemoData();
            }
            
            // Récupérer les menaces
            const threatsData = await API.getThreats({ perPage: CONFIG.MAX_TABLE_ROWS });
            this.data.threats = threatsData.threats;
            
            // Mettre à jour les composants
            this.updateStats();
            this.updateCharts();
            
            // Vérifier les nouvelles menaces
            this.checkNewThreats(stats.total_threats);
            
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
        }
    }
    
    /**
     * Met à jour les statistiques
     */
    updateStats() {
        if (!this.data.stats) return;
        
        // Total menaces
        const totalEl = document.getElementById('total-threats');
        if (totalEl) {
            totalEl.textContent = this.data.stats.total_threats.toLocaleString();
        }
        
        // Attaquants uniques
        const attackersEl = document.getElementById('unique-attackers');
        if (attackersEl) {
            attackersEl.textContent = this.data.stats.unique_attackers.toLocaleString();
        }
        
        // Score de risque moyen
        const riskEl = document.getElementById('avg-risk-score');
        if (riskEl) {
            const avgRisk = this.data.stats.average_risk_score.toFixed(1);
            const riskLevel = getRiskLevel(avgRisk);
            riskEl.textContent = avgRisk;
            riskEl.style.color = riskLevel.color;
        }
        
        // Service le plus ciblé - CORRIGÉ
        const serviceEl = document.getElementById('most-targeted');
        if (serviceEl && this.data.stats.service_distribution) {
            const topService = this.data.stats.service_distribution
                .sort((a, b) => b.count - a.count)[0];
            if (topService) {
                serviceEl.textContent = topService.service.toUpperCase();
            }
        }
    }
    
    /**
     * Met à jour les graphiques
     */
    updateCharts() {
        if (!this.data.stats) return;
        
        // Timeline - Vérifier que les données existent
        if (this.data.stats.timeline && Object.keys(this.data.stats.timeline).length > 0) {
            this.components.charts.updateTimeline(this.data.stats.timeline);
        } else {
            // Données de démonstration si pas de données
            const demoTimeline = this.generateDemoTimeline();
            this.components.charts.updateTimeline(demoTimeline);
        }
        
        // SUPPRIMÉ: updateTypes n'existe plus
    }
    
    /**
     * Génère des données de démonstration pour la timeline
     */
    generateDemoTimeline() {
        const timeline = {};
        const now = new Date();
        
        for (let i = 23; i >= 0; i--) {
            const hour = new Date(now);
            hour.setHours(hour.getHours() - i);
            hour.setMinutes(0);
            hour.setSeconds(0);
            hour.setMilliseconds(0);
            
            const key = hour.toISOString().slice(0, 13) + ':00:00';
            timeline[key] = Math.floor(Math.random() * 20) + 5;
        }
        
        return timeline;
    }
    
    /**
     * Met à jour le live feed
     */
    async updateLiveFeed() {
        try {
            const data = await API.getThreats({ perPage: CONFIG.MAX_FEED_ITEMS });
            this.components.liveFeed.updateBatch(data.threats);
        } catch (error) {
            console.error('Erreur mise à jour live feed:', error);
        }
    }
    
    /**
     * Vérifie les nouvelles menaces
     */
    checkNewThreats(currentCount) {
        if (this.lastThreatCount > 0 && currentCount > this.lastThreatCount) {
            const newThreats = currentCount - this.lastThreatCount;
            this.showNotification(
                '🚨 Nouvelles menaces détectées',
                `${newThreats} nouvelle(s) attaque(s) détectée(s)`,
                'warning'
            );
            
            if (this.soundEnabled) {
                this.playAlertSound();
            }
        }
        
        this.lastThreatCount = currentCount;
    }
    
    /**
     * Joue un son d'alerte
     */
    playAlertSound() {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTcJGmm98OScTgwOUajk4rRhGgU2mNn1y3ogCBh+yO/enEYDC1+z6O+oWBQNS6Pk4rJdGAUukNfyxX0tBh9+zPDhkkAIDGe68OWdTg0LUqzl4rVhHAc9lN3wy3kjBBh+yO/enEYDC1+z6O+oWBQNS6Pk4rJdGAUukNfyxX0tBh9+zPDhkkAIDGe68OWdTg0LUqzl4rVhGw');
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
    
    /**
     * Affiche une notification
     */
    showNotification(title, message, type = 'info') {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `
            fixed top-20 right-4 max-w-sm p-4 rounded-lg shadow-lg transform translate-x-full
            transition-all duration-300 ease-out z-50
        `;
        
        // Style selon le type
        const styles = {
            info: 'bg-blue-600 text-white',
            success: 'bg-green-600 text-white',
            warning: 'bg-yellow-600 text-white',
            error: 'bg-red-600 text-white'
        };
        
        notification.classList.add(...styles[type].split(' '));
        
        notification.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="flex-1">
                    <h4 class="font-semibold">${title}</h4>
                    <p class="text-sm opacity-90">${message}</p>
                </div>
                <button class="text-white/80 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 10);
        
        // Auto-suppression après 5 secondes
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    /**
     * Met à jour le statut de connexion
     */
    updateConnectionStatus(isOnline) {
        const statusEl = document.getElementById('connection-status');
        if (!statusEl) return;
        
        if (isOnline) {
            statusEl.className = 'connection-status online';
            statusEl.innerHTML = '<i class="fas fa-circle"></i><span>Connecté</span>';
        } else {
            statusEl.className = 'connection-status offline';
            statusEl.innerHTML = '<i class="fas fa-circle"></i><span>Hors ligne</span>';
        }
    }
    
    /**
     * Attache les event listeners
     */
    attachEventListeners() {
        // Bouton son
        const soundBtn = document.getElementById('toggle-sound');
        if (soundBtn) {
            soundBtn.onclick = () => this.toggleSound();
        }
        
        // Bouton thème
        const themeBtn = document.getElementById('toggle-theme');
        if (themeBtn) {
            themeBtn.onclick = () => this.toggleTheme();
        }
        
        // Bouton export
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.onclick = () => this.exportData();
        }
        
        // Bouton plein écran
        const fullscreenBtn = document.getElementById('toggle-fullscreen');
        if (fullscreenBtn) {
            fullscreenBtn.onclick = () => this.toggleFullscreen();
        }
        
        // Bouton refresh
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) {
            refreshBtn.onclick = () => {
                this.showNotification('Actualisation', 'Mise à jour des données...', 'info');
                this.updateDashboard();
            };
        }
    }
    
    /**
     * Bascule le thème
     */
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Mettre à jour l'icône
        const btn = document.getElementById('toggle-theme');
        if (btn) {
            btn.innerHTML = newTheme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
    }
    
    /**
     * Bascule le son
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        
        const btn = document.getElementById('toggle-sound');
        if (btn) {
            btn.innerHTML = this.soundEnabled 
                ? '<i class="fas fa-volume-up"></i>' 
                : '<i class="fas fa-volume-mute"></i>';
        }
        
        this.showNotification(
            this.soundEnabled ? '🔊 Son activé' : '🔇 Son désactivé',
            this.soundEnabled ? 'Les alertes sonores sont activées' : 'Les alertes sonores sont désactivées',
            'info'
        );
    }
    
    /**
     * Génère des données de démonstration
     */
    generateDemoData() {
        // Stats démo
        this.data.stats = {
            total_threats: 1337,
            unique_attackers: 42,
            average_risk_score: 6.8,
            service_distribution: [
                { service: 'ssh', count: 50 },
                { service: 'http', count: 30 },
                { service: 'telnet', count: 20 }
            ],
            timeline: this.generateDemoTimeline(),
            top_attack_types: [
                { type: 'Brute Force', count: 45 },
                { type: 'SQL Injection', count: 32 },
                { type: 'Port Scan', count: 28 },
                { type: 'Path Traversal', count: 15 }
            ]
        };
        
        // Menaces démo
        const demoIPs = ['192.168.1.100', '10.0.0.50', '172.16.0.25'];
        const demoTypes = ['brute_force', 'sql_injection', 'port_scan'];
        const demoServices = ['ssh', 'http', 'telnet'];
        
        this.data.threats = Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            timestamp: new Date(Date.now() - i * 300000).toISOString(),
            attacker_ip: demoIPs[i % 3],
            country: 'FR',
            service: demoServices[i % 3],
            attack_type: demoTypes[i % 3],
            risk_score: Math.floor(Math.random() * 10) + 1,
            attacker_port: 40000 + i
        }));
    }
    
    /**
     * Exporte les données
     */
    async exportData() {
        try {
            const threats = await API.exportThreats();
            
            // Créer le CSV avec timezone correct
            const headers = ['Date/Heure (Paris)', 'IP', 'Pays', 'Service', 'Type d\'Attaque', 'Score de Risque'];
            const rows = threats.map(t => [
                TimezoneUtils.formatDateTime(t.timestamp),
                t.attacker_ip,
                getCountryInfo(t.country || 'XX').name,
                t.service.toUpperCase(),
                t.attack_type,
                t.risk_score
            ]);
            
            const csv = [headers, ...rows]
                .map(row => row.map(cell => `"${cell}"`).join(','))
                .join('\n');
            
            // Ajouter BOM pour Excel
            const BOM = '\uFEFF';
            const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
            
            // Télécharger
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${CONFIG.EXPORT.FILENAME_PREFIX}_${TimezoneUtils.formatDate(new Date()).replace(/\s/g, '_')}.csv`;
            a.click();
            
            window.URL.revokeObjectURL(url);
            
            this.showNotification(
                '✅ Export réussi',
                `${threats.length} menaces exportées`,
                'success'
            );
            
        } catch (error) {
            this.showNotification(
                '❌ Erreur d\'export',
                'Impossible d\'exporter les données',
                'error'
            );
        }
    }
    
    /**
     * Bascule le plein écran
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    /**
     * Affiche les détails d'une menace
     */
    showThreatDetails(threat) {
        console.log('Threat details:', threat);
        
        const countryInfo = getCountryInfo(threat.country || 'XX');
        const message = `
            IP: ${threat.attacker_ip} (${countryInfo.name})
            Service: ${threat.service}
            Port: ${threat.attacker_port || 'N/A'}
            Payload: ${JSON.stringify(threat.payload || {})}
        `;
        
        this.showNotification(
            `Détails: ${threat.attack_type}`,
            message,
            'info'
        );
    }
    
    /**
     * Nettoie l'application
     */
    destroy() {
        // Arrêter les intervals
        Object.values(this.updateIntervals).forEach(interval => {
            clearInterval(interval);
        });
        
        // Détruire les composants
        Object.values(this.components).forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
    }
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', () => {
    window.honeypotDashboard = new HoneypotDashboard();
});

// Export pour debug
export default HoneypotDashboard;