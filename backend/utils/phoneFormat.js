export const formatPhoneNumber = (value = '', defaultCountryCode = '+92') => {
    const raw = String(value || '').trim();
    if (!raw) return raw;

    let digits = raw.replace(/\D/g, '');

    if (raw.startsWith('00')) {
        digits = digits.slice(2);
    } else if (defaultCountryCode === '+92' && digits.startsWith('0')) {
        digits = `92${digits.slice(1)}`;
    } else if (defaultCountryCode === '+92' && digits.length === 10 && digits.startsWith('3')) {
        digits = `92${digits}`;
    } else if (defaultCountryCode && !digits.startsWith(defaultCountryCode.replace(/\D/g, ''))) {
        digits = `${defaultCountryCode.replace(/\D/g, '')}${digits}`;
    }

    if (digits.startsWith('92') && digits.length === 12) {
        return `+92 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    }

    if (digits.length > 3) {
        return `+${digits.slice(0, 2)} ${digits.slice(2).replace(/(\d{3})(?=\d)/g, '$1 ').trim()}`;
    }

    return raw;
};
