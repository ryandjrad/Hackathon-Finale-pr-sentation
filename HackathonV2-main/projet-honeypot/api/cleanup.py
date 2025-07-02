#!/usr/bin/env python3
"""
Script de nettoyage des logs anciens
Empêche la saturation de l'espace disque
"""

import os
import glob
from datetime import datetime, timedelta
import logging

# Configuration
LOG_RETENTION_DAYS = int(os.environ.get('LOG_RETENTION_DAYS', 30))
LOG_DIR = '/app/logs'

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('cleanup')


def cleanup_old_logs(days=LOG_RETENTION_DAYS):
    """Supprime les logs de plus de X jours"""
    cutoff = datetime.now() - timedelta(days=days)
    deleted_count = 0
    total_size = 0
    
    logger.info(f"Starting cleanup - removing logs older than {days} days")
    
    try:
        # Parcourir tous les fichiers de log
        for logfile in glob.glob(os.path.join(LOG_DIR, '*.log')):
            try:
                file_mtime = datetime.fromtimestamp(os.path.getmtime(logfile))
                
                if file_mtime < cutoff:
                    file_size = os.path.getsize(logfile)
                    os.remove(logfile)
                    deleted_count += 1
                    total_size += file_size
                    logger.info(f"Deleted: {logfile} (size: {file_size} bytes)")
                    
            except Exception as e:
                logger.error(f"Error processing {logfile}: {e}")
        
        # Résumé
        if deleted_count > 0:
            logger.info(f"Cleanup complete: deleted {deleted_count} files, freed {total_size / 1024 / 1024:.2f} MB")
        else:
            logger.info("No old logs to delete")
            
    except Exception as e:
        logger.error(f"Cleanup failed: {e}")
        return False
    
    return True


def rotate_large_logs(max_size_mb=100):
    """Archive les logs trop volumineux"""
    max_size_bytes = max_size_mb * 1024 * 1024
    rotated_count = 0
    
    try:
        for logfile in glob.glob(os.path.join(LOG_DIR, '*.log')):
            try:
                file_size = os.path.getsize(logfile)
                
                if file_size > max_size_bytes:
                    # Créer un nom d'archive avec timestamp
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                    archive_name = f"{logfile}.{timestamp}.archive"
                    
                    # Renommer le fichier
                    os.rename(logfile, archive_name)
                    
                    # Créer un nouveau fichier vide
                    open(logfile, 'a').close()
                    
                    rotated_count += 1
                    logger.info(f"Rotated: {logfile} -> {archive_name} (size: {file_size / 1024 / 1024:.2f} MB)")
                    
            except Exception as e:
                logger.error(f"Error rotating {logfile}: {e}")
        
        if rotated_count > 0:
            logger.info(f"Rotation complete: rotated {rotated_count} large files")
            
    except Exception as e:
        logger.error(f"Rotation failed: {e}")
        return False
    
    return True


def get_log_stats():
    """Affiche des statistiques sur les logs"""
    try:
        total_files = 0
        total_size = 0
        oldest_file = None
        oldest_date = datetime.now()
        
        for logfile in glob.glob(os.path.join(LOG_DIR, '*.log')):
            total_files += 1
            total_size += os.path.getsize(logfile)
            
            file_mtime = datetime.fromtimestamp(os.path.getmtime(logfile))
            if file_mtime < oldest_date:
                oldest_date = file_mtime
                oldest_file = os.path.basename(logfile)
        
        logger.info(f"Log statistics:")
        logger.info(f"  Total files: {total_files}")
        logger.info(f"  Total size: {total_size / 1024 / 1024:.2f} MB")
        if oldest_file:
            logger.info(f"  Oldest file: {oldest_file} ({oldest_date.strftime('%Y-%m-%d %H:%M:%S')})")
            
    except Exception as e:
        logger.error(f"Failed to get stats: {e}")


def main():
    """Fonction principale"""
    logger.info("=== Log Cleanup Script ===")
    
    # Vérifier que le dossier existe
    if not os.path.exists(LOG_DIR):
        logger.error(f"Log directory not found: {LOG_DIR}")
        return 1
    
    # Afficher les stats avant
    logger.info("\nBefore cleanup:")
    get_log_stats()
    
    # Nettoyer les vieux logs
    if not cleanup_old_logs():
        return 1
    
    # Faire la rotation des gros fichiers
    if not rotate_large_logs():
        return 1
    
    # Afficher les stats après
    logger.info("\nAfter cleanup:")
    get_log_stats()
    
    logger.info("\n✅ Cleanup completed successfully")
    return 0


if __name__ == "__main__":
    exit(main())