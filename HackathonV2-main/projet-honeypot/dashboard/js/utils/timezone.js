/**
 * Utilitaire de gestion des timezones
 * Convertit UTC vers Europe/Paris et gère l'affichage des dates/heures
 */

export const TimezoneUtils = {
    // Configuration
    userTimezone: 'Europe/Paris',
    
    // Options de formatage par défaut
    timeOptions: {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    },
    
    dateOptions: {
        timeZone: 'Europe/Paris',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    },
    
    dateTimeOptions: {
        timeZone: 'Europe/Paris',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    },
    
    /**
     * Convertit un timestamp UTC en date locale
     * @param {string} timestamp - Timestamp UTC
     * @returns {Date} Date en timezone locale
     */
    utcToLocal(timestamp) {
        if (typeof timestamp !== 'string' && !(timestamp instanceof Date)) return new Date();

        if (timestamp instanceof Date) return timestamp;

        if (!timestamp.endsWith('Z') && !timestamp.includes('+')) {
            timestamp += 'Z';
        }
        return new Date(timestamp);
    },
    
    formatTime(timestamp) {
        const date = timestamp instanceof Date ? timestamp : this.utcToLocal(timestamp);
        return date.toLocaleTimeString('fr-FR', this.timeOptions);
    },
    
    formatDate(timestamp) {
        const date = timestamp instanceof Date ? timestamp : this.utcToLocal(timestamp);
        return date.toLocaleDateString('fr-FR', this.dateOptions);
    },
    
    formatDateTime(timestamp) {
        const date = timestamp instanceof Date ? timestamp : this.utcToLocal(timestamp);
        return date.toLocaleString('fr-FR', this.dateTimeOptions);
    },
    
    formatRelative(timestamp) {
        const date = timestamp instanceof Date ? timestamp : this.utcToLocal(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffSec < 60) return 'à l\'instant';
        if (diffMin < 60) return `il y a ${diffMin} min`;
        if (diffHour < 24) return `il y a ${diffHour} h`;
        if (diffDay < 7) return `il y a ${diffDay} j`;
        
        return this.formatDate(date);
    },
    
    getCurrentTime() {
        const now = new Date();
        return {
            time: this.formatTime(now),
            date: this.formatDate(now),
            datetime: this.formatDateTime(now),
            timestamp: now.toISOString()
        };
    },
    
    groupByHour(data, timestampField = 'timestamp', hours = 24) {
        const hourlyData = {};
        const now = new Date();
        
        for (let i = hours - 1; i >= 0; i--) {
            const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
            hour.setMinutes(0, 0, 0);
            hourlyData[hour.toISOString()] = 0;
        }

        if (Array.isArray(data)) {
            for (const item of data) {
                const rawTs = item?.[timestampField];
                if (!rawTs) continue;

                const date = this.utcToLocal(rawTs);
                date.setMinutes(0, 0, 0);
                const key = date.toISOString();
                if (hourlyData[key] !== undefined) {
                    hourlyData[key]++;
                }
            }
        }

        return hourlyData;
    },
    
    isNightTime() {
        const hour = new Date().getHours();
        return hour < 6 || hour >= 22;
    },
    
    getTimezoneOffset() {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('fr-FR', {
            timeZone: this.userTimezone,
            timeZoneName: 'short'
        });

        const parts = formatter.formatToParts(now);
        const tzPart = parts.find(part => part.type === 'timeZoneName');
        const timezoneName = tzPart ? tzPart.value : '';

        if (timezoneName.includes('CEST') || timezoneName.includes('été')) {
            return '+02:00';
        } else {
            return '+01:00';
        }
    }
};

export default TimezoneUtils;
