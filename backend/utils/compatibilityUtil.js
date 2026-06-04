/**
 * Compatibility matrix for blood types (Red Blood Cells)
 * Keys are recipient blood groups, values are compatible donor blood groups.
 */
const RBC_COMPATIBILITY = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
};

/**
 * Checks if a donor blood group is compatible with a recipient blood group.
 * @param {string} recipientGroup - e.g., 'A+'
 * @param {string} donorGroup - e.g., 'O-'
 * @returns {boolean}
 */
export const isCompatible = (recipientGroup, donorGroup) => {
    if (!RBC_COMPATIBILITY[recipientGroup]) return false;
    return RBC_COMPATIBILITY[recipientGroup].includes(donorGroup);
};

/**
 * Returns a list of compatible donor groups for a given recipient group.
 * @param {string} recipientGroup 
 * @returns {string[]}
 */
export const getCompatibleDonors = (recipientGroup) => {
    return RBC_COMPATIBILITY[recipientGroup] || [];
};
