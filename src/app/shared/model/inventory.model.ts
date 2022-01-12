export interface InventoryItem { 
    id?:  number,
    inventoryCode: string;
    quantity: number;
    name: string,
    unitId: number; 
}

export interface Unit { 
    shortCode: string;
    name: string;
    id: number;
}