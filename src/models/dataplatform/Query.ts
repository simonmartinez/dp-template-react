export interface DynamicParameter {
    type: string;
    transform: string;
    value: string[] | null;
    reference: string
}

export interface DataQuery {
    fields: { [key: string]: string[]}
}

export interface QueryRequest {
    id?: string;
    data: DataQuery;
    filter: any;
    dynamic_parameters: DynamicParameter[];
    scale: {
        fields: string[];
    }
    order?: any;
}

export interface QueryResponse {
    cache: boolean;
    duration: number;
    query_params: QueryRequest;
    results: any[];
    sql: string;
    status: number;
    success: boolean;
    table_name: string;
    tables: string[];
    total: any;
}

