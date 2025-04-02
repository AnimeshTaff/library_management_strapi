'use strict';

/**
 * categories service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::categories.categories');
