export interface Truck {
    _id: string;
    truckNumber: string;
    truckType: string;
    status: 'AVAILABLE' | 'IN_TRANSIT' | 'MAINTENANCE' | string; // Fixed TS2339
    ownerName?: string;
    driverId?: string;
    capacityTons?: string;
    model?: string;            // Fixes AllTrucks.tsx:21
    capacity?: string;         // Fixes AllTrucks.tsx:78
    assignedDriver?: string;   // Fixes AddTrip.tsx and ManageAllTrucks.tsx
    isActive?: boolean;
}

export interface TruckResponse {
    success: boolean;
    message?: string;
    trucks?: Truck[];
    truck?: Truck;
}