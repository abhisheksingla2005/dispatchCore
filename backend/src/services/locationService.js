/**
 * Location Service
 *
 * Handles GPS ping persistence and location broadcasting.
 * Enforces visibility rules:
 *   - Employed drivers: GPS always broadcast to company dispatchers
 *   - Independent drivers: GPS broadcast ONLY during active delivery
 *     (from PICKED_UP to DELIVERED)
 */

const { DriverLocationLog, Driver, Assignment, Order } = require('../models');
const { DRIVER_TYPE, DRIVER_STATUS, ORDER_STATUS } = require('../utils/constants');
const logger = require('../config/logger');

const BROADCAST_CONTEXT_TTL_MS = 5000;

class LocationService {
    constructor(io) {
        this.io = io;
        this.broadcastContextCache = new Map();
    }

    /**
     * Record a GPS ping and broadcast if visibility rules allow.
     *
     * @param {number} driverId
     * @param {number} lat
     * @param {number} lng
     * @param {number|null} speed
     * @param {number|null} heading
     * @returns {Promise<DriverLocationLog>}
     */
    async recordPing(driverId, lat, lng, speed = null, heading = null) {
        // Persist to database
        const locationLog = await DriverLocationLog.create({
            driver_id: driverId,
            lat,
            lng,
            speed,
            heading,
            recorded_at: new Date(),
        });

        logger.debug({ driverId, lat, lng }, 'GPS ping recorded');

        // Determine if location should be broadcast
        await this.broadcastLocation(driverId, { lat, lng, speed, heading });

        return locationLog;
    }

    /**
     * Get the latest recorded location for a driver.
     *
     * @param {number} driverId
     * @returns {Promise<DriverLocationLog|null>}
     */
    async getLatestLocation(driverId) {
        return DriverLocationLog.findOne({
            where: { driver_id: driverId },
            order: [['recorded_at', 'DESC']],
        });
    }

    /**
     * Broadcast a driver's location to the appropriate WebSocket rooms
     * based on visibility rules.
     *
     * @param {number} driverId
     * @param {object} location - { lat, lng, speed, heading }
     */
    async broadcastLocation(driverId, location) {
        if (!this.io) {
            return;
        }

        const context = await this._getBroadcastContext(driverId);
        if (!context || context.status === DRIVER_STATUS.OFFLINE) {
            return;
        }

        const targetRooms = this._getTargetRooms(context);

        const payload = {
            driverId,
            lat: location.lat,
            lng: location.lng,
            speed: location.speed,
            heading: location.heading,
            timestamp: new Date().toISOString(),
        };

        for (const room of targetRooms) {
            this.io.to(room).emit('driver:location', payload);
        }
    }

    /**
     * Determine which WebSocket rooms should receive a driver's location.
     * @private
     *
     * @param {object} driver - Driver broadcast context
     * @returns {Promise<string[]>} Array of room names
     */
    _getTargetRooms(driver) {
        const rooms = [];

        if (driver.type === DRIVER_TYPE.EMPLOYED) {
            // Employed drivers: always broadcast to company dispatchers
            if (driver.company_id) {
                rooms.push(`company:${driver.company_id}:dispatchers`);
            }
        } else if (driver.type === DRIVER_TYPE.INDEPENDENT) {
            // Independent drivers: only during active delivery
            const activeAssignment = this._getActiveAssignment(driver);

            if (activeAssignment) {
                const order = activeAssignment.order;

                // Broadcast to the company that owns this order
                if (order && order.company_id) {
                    rooms.push(`company:${order.company_id}:dispatchers`);
                }

                // Broadcast to the customer tracking room
                if (order) {
                    rooms.push(`order:${order.id}:tracking`);
                }
            }
            // If no active assignment, do NOT broadcast (visibility rule)
        }

        return rooms;
    }

    /**
     * Find the currently active assignment for a driver.
     * Active = order status is PICKED_UP or EN_ROUTE.
     * @private
     */
    _getActiveAssignment(driver) {
        if (!driver.assignments || driver.assignments.length === 0) {
            return null;
        }

        return driver.assignments.find((assignment) => {
            const orderStatus = assignment.order && assignment.order.status;
            return (
                orderStatus === ORDER_STATUS.PICKED_UP ||
                orderStatus === ORDER_STATUS.EN_ROUTE ||
                orderStatus === ORDER_STATUS.ASSIGNED
            );
        });
    }

    async _getBroadcastContext(driverId) {
        const cached = this.broadcastContextCache.get(driverId);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.value;
        }

        const driver = await Driver.findByPk(driverId, {
            include: [
                {
                    model: Assignment,
                    as: 'assignments',
                    required: false,
                    include: [{ model: Order, as: 'order' }],
                },
            ],
        });

        if (!driver) {
            this.broadcastContextCache.delete(driverId);
            return null;
        }

        this.broadcastContextCache.set(driverId, {
            value: driver,
            expiresAt: Date.now() + BROADCAST_CONTEXT_TTL_MS,
        });

        return driver;
    }
}

module.exports = LocationService;
