export interface TableConfig {
    headers: TableHeader[];
    clickableRows?: boolean;
}

export interface TableHeader {
    sortable?: boolean;
    name: string;
    key: string;
}

