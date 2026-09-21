/** The tenant slug in every CollabCRM People route. The captures were taken on
 *  this tenant, so the prototype keeps the same URL shape. */
export const TENANT = 'bluewhaletechnosoftpvtltd'
export const peoplePath = (suffix = '') => `/people/${TENANT}${suffix}`
