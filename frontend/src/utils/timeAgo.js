/**
 * Simple time-ago utility — avoids needing the date-fns package.
 * Returns strings like "5 minutes ago", "2 days ago", etc.
 */
export const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;

    const secs  = Math.floor(diffMs / 1000);
    const mins  = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months= Math.floor(days / 30);

    if (secs < 60)   return 'just now';
    if (mins < 60)   return `${mins} minute${mins > 1 ? 's' : ''} ago`;
    if (hours < 24)  return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7)    return `${days} day${days > 1 ? 's' : ''} ago`;
    if (weeks < 5)   return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    return `${months} month${months > 1 ? 's' : ''} ago`;
};
