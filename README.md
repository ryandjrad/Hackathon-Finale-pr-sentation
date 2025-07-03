# 🛡️ Honeypot Security System

> **Système de détection de cybermenaces intelligent** combinant honeypots multi-services, intelligence artificielle et visualisation temps réel.

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)

## 📋 Table des Matières

- [🎯 Présentation](#-présentation)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🚀 Installation Rapide](#-installation-rapide)
- [📖 Guide d'Utilisation](#-guide-dutilisation)
- [🧪 Tests et Simulation](#-tests-et-simulation)
- [🤖 Machine Learning](#-machine-learning)
- [📊 Dashboard](#-dashboard)
- [🔧 Configuration](#-configuration)
- [🐳 Docker](#-docker)
- [📚 Documentation Technique](#-documentation-technique)
- [🛡️ Sécurité](#️-sécurité)
- [🚀 Déploiement](#-déploiement)
- [🤝 Contribution](#-contribution)
- [📝 Licence](#-licence)

## 🎯 Présentation

### Hackathon ESTIAM 2025 - Sujet 2: Détection des Menaces

Ce projet répond au défi de créer un **système innovant de détection et de réponse aux menaces cybernétiques**. Notre solution combine:

- 🍯 **Honeypots multi-services** (SSH, HTTP, Telnet) pour attirer les attaquants
- 🤖 **Intelligence Artificielle** pour détecter les anomalies avec Isolation Forest
- 📊 **Dashboard temps réel** avec visualisations interactives
- ⚡ **Réponse automatisée** aux incidents détectés

### 🏆 Points Forts pour le Jury

1. **Innovation technique** : ML pour détection d'anomalies, architecture microservices
2. **Interface impressionnante** : Dashboard moderne avec carte mondiale en temps réel
3. **Réponse automatisée** : Blocage d'IP, alertes contextuelles, scoring intelligent
4. **Scalabilité** : Architecture Docker prête pour la production

## ✨ Fonctionnalités

### 🍯 Honeypots Intelligents
- **SSH Honeypot** (port 2222) - Simule OpenSSH 5.1 vulnérable
- **HTTP Honeypot** (port 8080) - Endpoints piégés (/admin, /wp-admin, /.env)
- **Telnet Honeypot** (port 2323) - Ancien serveur Linux

### 🤖 Machine Learning Avancé
- Algorithme **Isolation Forest** pour détection d'anomalies
- Analyse comportementale des attaquants
- Scoring automatique des risques (1-10)
- Détection de patterns d'attaques coordonnées

### 📊 Dashboard Temps Réel
- Statistiques live avec mise à jour automatique
- Timeline interactive des attaques (Chart.js)
- Feed en temps réel avec animations
- Carte mondiale des attaquants (future version)

### ⚡ Réponse Automatisée
- Blocage d'IP automatique après seuil (configurable)
- Alertes visuelles et sonores pour menaces critiques
- Escalade automatique selon le niveau de risque
- Notifications contextuelles avec détails

### 🔒 Sécurité Avancée
- Isolation complète des honeypots en containers
- Validation stricte des adresses IP
- Utilisateurs non-root pour tous les services
- Chiffrement des communications internes
- Rate limiting sur l'API

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Attackers     │────▶│    Honeypots    │────▶│      API        │
│                 │     │  SSH/HTTP/Tel   │     │   Flask/REST    │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                          │
                        ┌─────────────────┐               │
                        │   ML Detector   │◀──────────────┤
                        │ Anomaly Detection│               │
                        └─────────────────┘               │
                                                          ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Dashboard    │◀────│   PostgreSQL    │────▶│  Auto Response  │
│   React/JS      │     │    Database     │     │   IP Blocking   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Composants Principaux

| Composant | Technologie | Port | Description |
|-----------|-------------|------|-------------|
| 🍯 Honeypots | Python 3.11 + AsyncIO | 2222, 8080, 2323 | Services vulnérables simulés |
| 🔌 API REST | Flask + SQLAlchemy | 5000 | Collecte et traitement des données |
| 🗄️ Base de données | PostgreSQL 15 | 5432 | Stockage sécurisé des menaces |
| 📊 Dashboard | JavaScript ES6 + Chart.js | 3000 | Interface de surveillance |
| 🤖 ML Detector | Scikit-learn | - | Détection d'anomalies |
| 🛠️ Admin DB | Adminer | 8081 | Interface d'administration |

## 🚀 Installation Rapide

### Prérequis
- Docker & Docker Compose
- Python 3.8+ (pour les scripts de test)
- 4GB RAM minimum
- Ports libres : 2222, 2323, 3000, 5000, 8080

### 1. Cloner le Projet
```bash
git clone https://github.com/votre-equipe/honeypot-security.git
cd honeypot-security
```

### 2. Lancement Automatique
```bash
# Script de démarrage tout-en-un
chmod +x start.sh
./start.sh
```

### 3. Vérification
```bash
# Tester que tout fonctionne
python3 test_system.py
```

### 4. Accès aux Services
- 📊 **Dashboard** : http://localhost:3000
- 🔌 **API** : http://localhost:5000/api/stats
- 🗄️ **Base de données** : http://localhost:8081
- 🍯 **Honeypots** : SSH(2222), HTTP(8080), Telnet(2323)

## 📖 Guide d'Utilisation

### Dashboard Principal

Le dashboard offre une vue d'ensemble en temps réel :

1. **📈 Statistiques Globales**
   - Nombre total de menaces détectées
   - Attaquants uniques identifiés
   - Score de risque moyen
   - Service le plus ciblé

2. **📊 Timeline des Attaques**
   - Graphique interactif des dernières 24h
   - Mise à jour automatique toutes les 5 secondes
   - Détails au survol

3. **🔴 Feed Temps Réel**
   - Flux en continu des nouvelles attaques
   - Filtrage par service et niveau de risque
   - Animations pour les menaces critiques

4. **⚙️ Contrôles**
   - Basculer le thème (sombre/clair)
   - Activer/désactiver les alertes sonores
   - Exporter les données en CSV
   - Mode plein écran

### Types d'Attaques Détectées

| Type | Service | Description | Score de Risque |
|------|---------|-------------|-----------------|
| 🔑 Brute Force | SSH/Telnet | Tentatives d'authentification | 5 |
| 💉 SQL Injection | HTTP | Injection dans les paramètres | 7 |
| 🐚 Command Injection | HTTP | Exécution de commandes | 8 |
| 📁 Path Traversal | HTTP | Accès aux fichiers système | 6 |
| 🔍 Reconnaissance | HTTP | Scan de découverte | 3 |
| 💣 DoS Attempt | Tous | Déni de service | 6 |

### Niveaux de Risque

- 🟢 **Faible (1-3)** : Activité normale, surveillance passive
- 🟡 **Moyen (4-6)** : Activité suspecte, monitoring renforcé
- 🟠 **Élevé (7-8)** : Menace confirmée, alertes activées
- 🔴 **Critique (9-10)** : Attaque active, réponse immédiate

## 🧪 Tests et Simulation

### Simulateur d'Attaques Intégré

```bash
# Lancer le simulateur interactif
python3 simulate_attacks.py

# Options disponibles :
# 1. Toutes les attaques (recommandé pour démo)
# 2. Reconnaissance HTTP
# 3. Brute Force SSH/Telnet  
# 4. Injections SQL/Commandes
# 5. Attaque personnalisée
```

### Types de Simulations

1. **🔍 Reconnaissance HTTP**
   ```bash
   # Scan automatique des endpoints sensibles
   GET /admin, /login, /wp-admin, /.env, /config.php
   ```

2. **🔑 Brute Force**
   ```bash
   # Tentatives d'authentification
   SSH: admin:admin, root:password, user:123456
   Telnet: guest:guest, admin:admin
   ```

3. **💉 Injections**
   ```bash
   # SQL: ' OR '1'='1, admin' AND 1=1#
   # Command: ; cat /etc/passwd, | whoami
   ```

4. **💣 Stress Test**
   ```bash
   # 10 requêtes simultanées pour tester la réactivité
   python3 simulate_attacks.py --dos-test
   ```

### Tests Automatisés

```bash
# Vérification complète du système
python3 test_system.py

# Tests unitaires (si disponibles)
pytest tests/

# Test de charge
python3 stress_test.py --duration 60
```

## 🤖 Machine Learning

### Détecteur d'Anomalies

Notre système utilise l'algorithme **Isolation Forest** pour identifier les comportements anormaux :

```python
# Lancement de l'analyse ML
python3 ml_detector.py

# Mode surveillance continue
python3 ml_detector.py --watch
```

### Caractéristiques Analysées

Le modèle ML analyse 7 features principales :

1. **Temporel** : Heure de l'attaque (détection d'activité nocturne)
2. **Service** : Type de service ciblé (SSH=0, HTTP=1, Telnet=2)
3. **Attaque** : Type d'attaque encodé (0-6)
4. **Risque** : Score de risque initial (1-10)
5. **Géographique** : Dernier octet de l'IP source
6. **Payload** : Taille des données transmises
7. **Port** : Port source de l'attaquant

### Exemples de Détection

```bash
🚨 ANOMALIES DÉTECTÉES:

1. IP: 192.168.1.100 | Service: ssh
   Type: brute_force | Score: 5
   Raison: Attaque en dehors des heures normales
   Score d'anomalie: -0.234

2. IP: 10.0.0.50 | Service: http  
   Type: sql_injection | Score: 8
   Raison: Score de risque très élevé | Payload anormalement grand
   Score d'anomalie: -0.456
```

### Patterns Avancés

Le système détecte également :
- **Attaques coordonnées** : Plusieurs IPs dans une fenêtre de 5 minutes
- **Séquences d'attaque** : Patterns répétitifs (ex: reconnaissance → brute force → injection)
- **Anomalies temporelles** : Pics d'activité inhabituels

## 📊 Dashboard

### Interface Moderne

Le dashboard utilise une approche **mobile-first** avec :

- **Thème sombre par défaut** optimisé pour les SOC
- **Animations fluides** pour les nouvelles menaces
- **Graphiques interactifs** avec Chart.js
- **Design responsive** pour tous les écrans

### Composants Principaux

1. **Header Intelligent**
   ```javascript
   // Horloge temps réel avec timezone Paris
   // Statut de connexion API
   // Boutons de contrôle rapide
   ```

2. **Cards de Statistiques**
   ```javascript
   // Mise à jour automatique toutes les 5s
   // Animations de compteur
   // Indicateurs de tendance
   ```

3. **Timeline Interactive**
   ```javascript
   // Chart.js avec données temps réel
   // Tooltip avancé
   // Zoom et pan
   ```

4. **Feed Temps Réel**
   ```javascript
   // WebSocket (future version)
   // Filtrage en temps réel
   // Animations d'entrée
   ```

### Personnalisation

```javascript
// Configuration du dashboard
const CONFIG = {
    UPDATE_INTERVAL: 5000,     // Mise à jour générale
    MAX_FEED_ITEMS: 20,        // Items du feed
    CHART_HOURS_DEFAULT: 24,   // Heures affichées
    THEME: 'dark',             // Thème par défaut
    SOUND_ENABLED: true        // Alertes sonores
};
```

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env` :

```bash
# API Configuration
API_URL=http://localhost:5000
SECRET_KEY=your-secret-key-change-this

# Database
DATABASE_URL=postgresql://honeypot_user:honeypot_pass@localhost:5432/threats_db

# Honeypot
HONEYPOT_ID=honeypot-001
LOG_LEVEL=INFO

# Security
IP_BLOCK_THRESHOLD=10
IP_BLOCK_DURATION=3600

# ML
ML_CONTAMINATION=0.1
ML_UPDATE_INTERVAL=900
```

### Configuration Honeypot

Fichier `honeypot/config/honeypot.conf` :

```ini
[general]
honeypot_id = honeypot-001
log_level = INFO
log_retention_days = 30

[ssh]
enabled = true
port = 22
banner = SSH-2.0-OpenSSH_5.1p1 Debian-5
max_attempts = 5

[http]
enabled = true
port = 80
fake_paths = /admin,/login,/wp-admin,/.env
max_post_size_kb = 1024

[security]
ip_block_enabled = true
ip_block_threshold = 10
whitelist = 127.0.0.1,::1
```

### Configuration API

Fichier `api/config.py` :

```python
class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    # Pagination
    DEFAULT_PAGE_SIZE = 20
    MAX_PAGE_SIZE = 100
    
    # Alert thresholds
    CRITICAL_RISK_THRESHOLD = 8
    HIGH_RISK_THRESHOLD = 6
```

## 🐳 Docker

### Architecture des Containers

```yaml
services:
  honeypot:      # Services honeypot
  api:           # API REST Flask
  db:            # Base PostgreSQL
  dashboard:     # Interface web
  adminer:       # Admin base de données
```

### Commandes Docker Utiles

```bash
# Démarrage complet
docker-compose up -d --build

# Logs en temps réel
docker-compose logs -f honeypot
docker-compose logs -f api

# Redémarrage d'un service
docker-compose restart honeypot

# Sauvegarde de la base
docker exec -t threats_database pg_dump -U honeypot_user threats_db > backup.sql

# Restauration
docker exec -i threats_database psql -U honeypot_user threats_db < backup.sql

# Nettoyage complet
docker-compose down -v
docker system prune -a
```

### Dockerfile Optimisé

Chaque service utilise des images optimisées :

- **Multi-stage builds** pour réduire la taille
- **Utilisateurs non-root** pour la sécurité
- **Health checks** intégrés
- **Cache de dépendances** optimisé

### Volumes Persistants

```yaml
volumes:
  postgres-data:     # Données de la base
  honeypot-logs:     # Logs des honeypots
  api-logs:          # Logs de l'API
```

## 📚 Documentation Technique

### Structure du Projet

```
projet-honeypot/
├── 🍯 honeypot/           # Services honeypot
│   ├── app.py            # Serveurs SSH/HTTP/Telnet
│   ├── Dockerfile        # Container honeypot
│   ├── config/           # Configuration
│   └── logs/             # Logs des attaques
├── 🔌 api/               # API REST
│   ├── app.py            # Flask API + SQLAlchemy
│   ├── database/         # Scripts SQL + migrations
│   ├── config.py         # Configuration API
│   └── requirements.txt  # Dépendances Python
├── 📊 dashboard/         # Interface web
│   ├── index.html        # Page principale
│   ├── js/               # Modules JavaScript
│   │   ├── app.js        # Orchestrateur principal
│   │   ├── components/   # Composants UI
│   │   └── utils/        # Utilitaires (API, timezone)
│   └── css/              # Styles et thèmes
├── 🤖 ml_detector.py     # Détection ML
├── 🧪 simulate_attacks.py # Simulateur d'attaques
├── 🐳 docker-compose.yml # Orchestration
└── 📖 README.md          # Cette documentation
```

### API Endpoints

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/health` | GET | Santé de l'API |
| `/api/threats` | GET | Liste des menaces |
| `/api/threats` | POST | Créer une menace |
| `/api/threats/{id}` | GET | Détails d'une menace |
| `/api/stats` | GET | Statistiques globales |
| `/api/attackers` | GET | Profils d'attaquants |
| `/api/alerts/test` | POST | Test d'alerte |

### Modèles de Données

```python
# Threat Model
{
    "id": 1,
    "timestamp": "2025-07-02T10:30:00Z",
    "honeypot_id": "honeypot-001", 
    "service": "ssh",
    "attacker_ip": "192.168.1.100",
    "attacker_port": 45234,
    "attack_type": "brute_force",
    "risk_score": 5,
    "payload": {
        "username": "admin",
        "password": "123456"
    }
}

# Attacker Profile
{
    "ip_address": "192.168.1.100",
    "first_seen": "2025-07-01T08:00:00Z",
    "last_seen": "2025-07-02T10:30:00Z", 
    "total_attacks": 47,
    "risk_level": "high",
    "country": "CN"
}
```

## 🛡️ Sécurité

### Mesures Implémentées

1. **Isolation des Containers**
   - Honeypots isolés dans des containers séparés
   - Réseau Docker interne sécurisé
   - Aucun accès au système hôte

2. **Validation des Entrées**
   - Validation stricte des adresses IP
   - Sanitisation de tous les payloads
   - Protection contre l'injection SQL

3. **Authentification & Autorisation**
   - API avec tokens JWT (future version)
   - Rate limiting sur tous les endpoints
   - CORS configuré restrictif

4. **Monitoring de Sécurité**
   - Logs complets de toutes les activités
   - Détection d'anomalies en temps réel
   - Alertes automatiques

### Bonnes Pratiques

```python
# Validation IP
def validate_ip(ip_string):
    try:
        ipaddress.ip_address(ip_string)
        return True
    except ValueError:
        return False

# Sanitisation payload
def sanitize_payload(payload):
    if isinstance(payload, dict):
        return {k: str(v)[:1000] for k, v in payload.items()}
    return str(payload)[:1000]

# Rate limiting
@limiter.limit("100/hour")
def api_endpoint():
    pass
```

### Conformité

Le système respecte :
- **OWASP Top 10** - Protection contre les vulnérabilités courantes
- **NIST Cybersecurity Framework** - Detect, Respond, Recover
- **ISO 27001** - Gestion de la sécurité de l'information
- **ANSSI** - Recommandations françaises de cybersécurité

## 🚀 Déploiement

### Environnement de Production

1. **Prérequis Serveur**
   ```bash
   # Ubuntu 20.04+ recommandé
   sudo apt update
   sudo apt install docker.io docker-compose git
   
   # Configuration firewall
   sudo ufw allow 22,80,443,2222,2323,3000,5000,8080,8081/tcp
   ```

2. **SSL/TLS avec Let's Encrypt**
   ```bash
   # Nginx reverse proxy
   sudo apt install nginx certbot python3-certbot-nginx
   
   # Certificat SSL
   sudo certbot --nginx -d honeypot.votre-domaine.com
   ```

3. **Configuration Nginx**
   ```nginx
   # /etc/nginx/sites-available/honeypot
   server {
       listen 443 ssl;
       server_name honeypot.votre-domaine.com;
       
       ssl_certificate /etc/letsencrypt/live/honeypot.votre-domaine.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/honeypot.votre-domaine.com/privkey.pem;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
       }
   }
   ```

### Monitoring Production

1. **Logs Centralisés**
   ```bash
   # Rotation automatique
   docker run -d --name logrotate \
     -v /var/lib/docker/containers:/var/lib/docker/containers:ro \
     blacklabelops/logrotate
   ```

2. **Monitoring avec Prometheus**
   ```yaml
   # docker-compose.monitoring.yml
   version: '3.8'
   services:
     prometheus:
       image: prom/prometheus
       ports:
         - "9090:9090"
       volumes:
         - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
     
     grafana:
       image: grafana/grafana
       ports:
         - "3001:3000"
       environment:
         - GF_SECURITY_ADMIN_PASSWORD=admin
   ```

3. **Sauvegarde Automatique**
   ```bash
   #!/bin/bash
   # backup.sh - À exécuter via cron toutes les heures
   
   BACKUP_DIR="/backups/honeypot"
   DATE=$(date +%Y%m%d_%H%M%S)
   
   # Backup base de données
   docker exec threats_database pg_dump -U honeypot_user threats_db | \
     gzip > "$BACKUP_DIR/db_$DATE.sql.gz"
   
   # Backup logs
   tar -czf "$BACKUP_DIR/logs_$DATE.tar.gz" \
     ./honeypot/logs ./api/logs
   
   # Nettoyage (garder 7 jours)
   find "$BACKUP_DIR" -name "*.gz" -mtime +7 -delete
   ```

### Scaling Horizontal

Pour gérer plus de trafic :

```yaml
# docker-compose.scale.yml
services:
  honeypot:
    deploy:
      replicas: 3
  
  api:
    deploy:
      replicas: 2
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - honeypot
      - api
```

## 🤝 Contribution

### Guide de Contribution

1. **Fork le projet**
2. **Créer une branche** (`git checkout -b feature/AmazingFeature`)
3. **Commit les changements** (`git commit -m 'Add AmazingFeature'`)
4. **Push la branche** (`git push origin feature/AmazingFeature`)
5. **Ouvrir une Pull Request**

### Standards de Code

```python
# Format Python avec Black
black --line-length 88 .

# Linting avec flake8
flake8 --max-line-length 88 --ignore E203,W503

# Type checking avec mypy
mypy --ignore-missing-imports .
```

### Tests

```bash
# Tests unitaires
pytest tests/ -v --cov=.

# Tests d'intégration
pytest tests/integration/ -v

# Tests de performance
pytest tests/performance/ -v --benchmark-only
```

### Roadmap

- [ ] **V2.0** - Honeypots FTP, SMB, RDP
- [ ] **V2.1** - Intégration Threat Intelligence feeds
- [ ] **V2.2** - Deep Learning avec LSTM
- [ ] **V3.0** - Intégrations SIEM (Splunk, ELK)
- [ ] **V3.1** - API GraphQL
- [ ] **V3.2** - Interface mobile (React Native)

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **ESTIAM** pour l'organisation du hackathon
- **Mentors et experts** en cybersécurité
- **Communauté open source** pour les outils utilisés
- **Équipe de développement** pour le travail acharné

---

<div align="center">

**Développé par le groupe 3**

</div>
