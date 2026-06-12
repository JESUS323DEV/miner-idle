import { RentalConfig } from '../config/RentalConfig.js';

export const InitialRentalState = {
    available: null,
    active: [],
    appearanceRemainingMs: RentalConfig.firstAppearanceMs,
};
