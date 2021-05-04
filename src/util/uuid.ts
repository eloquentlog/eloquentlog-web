const UUIDv4 = `[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}`;

const regexp = new RegExp(`^${UUIDv4}$`, 'i');

export const validateUUID = (uuid: string): boolean => {
	return regexp.test(uuid);
};
