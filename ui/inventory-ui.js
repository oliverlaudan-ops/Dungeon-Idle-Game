/**
 * Inventory UI v1.0
 * Display and manage equipment inventory
 * Equip/Unequip items, view stats, sell items
 */

import { gameState } from '../core/game-state.js';
import { equipItem, unequipItem, sellEquipment, getEquipmentStats } from '../upgrades/equipment-system.js';
import { updateHeroUI } from './hero-ui.js';

/**
 * Initialize Inventory UI
 */
export function initializeInventoryUI() {
    const inventoryContainer = document.getElementById('inventory-container');
    if (!inventoryContainer) {
        console.warn('⚠️ Inventory container not found');
        return;
    }

    updateInventoryUI();
}

/**
 * Update Inventory Display
 */
export function updateInventoryUI() {
    const inventoryContainer = document.getElementById('inventory-container');
    if (!inventoryContainer) return;

    const inventory = gameState.inventory || [];
    
    if (inventory.length === 0) {
        inventoryContainer.innerHTML = `
            <div class="empty-inventory">
                <p>📦 Dein Inventar ist leer</p>
                <p class="hint">Spiele Dungeons um Equipment zu bekommen!</p>
            </div>
        `;
        return;
    }

    // Group by type
    const weapons = inventory.filter(i => i.type === 'weapon');
    const armor = inventory.filter(i => i.type === 'armor');
    const accessories = inventory.filter(i => i.type === 'accessory');

    let html = `
        <div class="inventory-header">
            <h3>🎒 Inventar</h3>
            <div class="inventory-stats">
                <span>📦 ${inventory.length} Items</span>
                <span>⚔️ ${weapons.length} Waffen</span>
                <span>🛡️ ${armor.length} Rüstungen</span>
                <span>💍 ${accessories.length} Accessoires</span>
            </div>
        </div>
    `;

    // Render sections
    if (weapons.length > 0) {
        html += renderInventorySection('⚔️ Waffen', weapons);
    }
    if (armor.length > 0) {
        html += renderInventorySection('🛡️ Rüstungen', armor);
    }
    if (accessories.length > 0) {
        html += renderInventorySection('💍 Accessoires', accessories);
    }

    inventoryContainer.innerHTML = html;

    // Attach event listeners
    attachInventoryEventListeners();
}

/**
 * Render a section of inventory
 */
function renderInventorySection(title, items) {
    let html = `
        <div class="inventory-section">
            <h4 class="section-title">${title}</h4>
            <div class="inventory-grid">
    `;

    items.forEach(item => {
        html += renderInventoryItem(item);
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

/**
 * Render a single inventory item
 */
function renderInventoryItem(item) {
    const stats = getEquipmentStats(item);
    const isEquipped = item.equipped;
    const rarityClass = `rarity-${item.rarity}`;
    const equippedClass = isEquipped ? 'equipped' : '';

    return `
        <div class="inventory-item ${rarityClass} ${equippedClass}" data-item-id="${item.id}">
            <div class="item-icon">${item.icon}</div>
            <div class="item-info">
                <div class="item-name" style="color: ${item.color}">
                    ${item.name}
                    ${isEquipped ? '✅' : ''}
                </div>
                <div class="item-rarity">${item.rarity.toUpperCase()}</div>
                <div class="item-stats">
                    ${stats.map(s => `<div class="stat">${s}</div>`).join('')}
                </div>
                <div class="item-description">${item.description}</div>
            </div>
            <div class="item-actions">
                ${isEquipped 
                    ? `<button class="btn-unequip" data-item-id="${item.id}">❌ Abnehmen</button>` 
                    : `<button class="btn-equip" data-item-id="${item.id}">✅ Ausrüsten</button>`
                }
                <button class="btn-sell" data-item-id="${item.id}">💰 Verkaufen</button>
            </div>
        </div>
    `;
}

/**
 * Attach event listeners to inventory buttons
 */
function attachInventoryEventListeners() {
    // Equip buttons
    document.querySelectorAll('.btn-equip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.dataset.itemId;
            handleEquipItem(itemId);
        });
    });

    // Unequip buttons
    document.querySelectorAll('.btn-unequip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.dataset.itemId;
            handleUnequipItem(itemId);
        });
    });

    // Sell buttons
    document.querySelectorAll('.btn-sell').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.dataset.itemId;
            handleSellItem(itemId);
        });
    });
}

/**
 * Handle equipping an item
 */
function handleEquipItem(itemId) {
    const success = equipItem(itemId);
    
    if (success) {
        // Show notification
        showNotification('✅ Item ausgerüstet!', 'success');
        
        // Update UIs
        updateInventoryUI();
        if (typeof updateHeroUI === 'function') {
            updateHeroUI();
        }
    } else {
        showNotification('❌ Fehler beim Ausrüsten', 'error');
    }
}

/**
 * Handle unequipping an item
 */
function handleUnequipItem(itemId) {
    const success = unequipItem(itemId);
    
    if (success) {
        showNotification('❌ Item abgenommen', 'info');
        updateInventoryUI();
        if (typeof updateHeroUI === 'function') {
            updateHeroUI();
        }
    }
}

/**
 * Handle selling an item
 */
function handleSellItem(itemId) {
    const item = gameState.inventory?.find(i => i.id === itemId);
    if (!item) return;

    // Confirm sell
    const confirmSell = confirm(`Verkaufen: ${item.name}?\nDu erhältst Gold basierend auf der Seltenheit.`);
    
    if (confirmSell) {
        const goldEarned = sellEquipment(itemId);
        
        if (goldEarned > 0) {
            showNotification(`💰 Verkauft für ${goldEarned} Gold!`, 'success');
            updateInventoryUI();
            if (typeof updateHeroUI === 'function') {
                updateHeroUI();
            }
        }
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        // Fallback to console
        console.log(`[${type.toUpperCase()}] ${message}`);
        return;
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notificationContainer.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Get equipped items summary
 */
export function getEquippedItemsSummary() {
    const equipped = gameState.equipped || {};
    
    return {
        weapon: equipped.weapon || null,
        armor: equipped.armor || null,
        accessory: equipped.accessory || null
    };
}

/**
 * Export for external use
 */
export { updateInventoryUI as refreshInventory };
