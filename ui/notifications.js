/**
 * Notification System v2.0
 * Toast notifications for achievements and manual run completion
 */

let notificationQueue = [];
let isShowingNotification = false;

/**
 * Show a toast notification
 */
export function showNotification(message, type = 'info', duration = 5000) {
    const notification = {
        message,
        type, // 'success', 'info', 'warning', 'error'
        duration
    };
    
    notificationQueue.push(notification);
    
    if (!isShowingNotification) {
        processNotificationQueue();
    }
}

/**
 * Show victory notification (manual run completion)
 */
export function showVictoryNotification(goldReward, xpReward, floor = 1) {
    const message = `🎉 Floor ${floor} Complete! +${goldReward} Gold, +${xpReward} XP`;
    showNotification(message, 'victory', 5000);
}

/**
 * Show defeat notification
 */
export function showDefeatNotification(floor = 1) {
    const message = `💀 Defeated on Floor ${floor}. Try again!`;
    showNotification(message, 'error', 4000);
}

/**
 * Show achievement notification
 */
export function showAchievementNotification(achievement) {
    const message = `${achievement.icon} ${achievement.name} unlocked! ${achievement.description}`;
    showNotification(message, 'achievement', 6000);
}

/**
 * Process notification queue
 */
function processNotificationQueue() {
    if (notificationQueue.length === 0) {
        isShowingNotification = false;
        return;
    }
    
    isShowingNotification = true;
    const notification = notificationQueue.shift();
    
    displayNotification(notification);
}

/**
 * Display a single notification
 */
function displayNotification(notification) {
    // Create notification element
    const toast = document.createElement('div');
    toast.className = `toast toast-${notification.type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${notification.message}</span>
            <button class="toast-close" aria-label="Close">&times;</button>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('toast-visible');
    }, 100);
    
    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(toast);
    });
    
    // Auto-dismiss after duration
    setTimeout(() => {
        removeNotification(toast);
    }, notification.duration);
}

/**
 * Remove notification and process queue
 */
function removeNotification(toast) {
    if (!toast || !toast.parentElement) return;
    
    toast.classList.remove('toast-visible');
    toast.classList.add('toast-hiding');
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
        processNotificationQueue();
    }, 300);
}

/**
 * Clear all notifications
 */
export function clearAllNotifications() {
    notificationQueue = [];
    const toasts = document.querySelectorAll('.toast');
    toasts.forEach(toast => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    });
    isShowingNotification = false;
}
