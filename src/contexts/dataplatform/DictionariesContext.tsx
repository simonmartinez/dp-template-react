import { createContext, useContext } from "react";
import DataPlatformApi from "../../services/dataplatform/api/DataPlatformApi";
import { QueryRequest, QueryResponse } from "../../models/dataplatform/Query";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export interface DictionaryData {
    [key: string]: any;
}

export interface DictionariesContextType {
    dictionaries: DictionaryData | undefined;
    loading: boolean;
    error: Error | null
}

const DictionariesContext = createContext<DictionariesContextType | undefined>(undefined);

export const DictionariesProvider = ({ children }: { children: React.ReactNode }) => {

    const fetchDictionaries = async (): Promise<DictionaryData> => {
        const queries: QueryRequest[] = [
            {
                id: "station_name-dictionary",
                data: { fields: { station_name: ["max"] } },
                scale: { fields: ["station_name", "station_id"] },
                order: { station_name: 'asc' },
                filter: {},
                dynamic_parameters: []
            },
            {
                id: "week_day_label-dictionary", data: { fields: { week_day_label: ["max"] } }, scale: { fields: ["week_day_label"] }, filter: {}, dynamic_parameters: []
            }
        ];

        const promises = queries.map((query) => DataPlatformApi.query(query));
        const responses = await Promise.all(promises);
        const result: any = {};
        queries.forEach((query, index) => {
            result[query.id ?? "default"] = (responses[index].data as QueryResponse).results.map(item => item.scales);
        });
        return result;
    };

    const { data: dictionaries, error, isLoading: loading } = useQuery({
        queryKey: ['dictionaries'],
        retry: false,
        queryFn: fetchDictionaries,
    });

    return (
        <DictionariesContext.Provider value={{ dictionaries, loading, error }}>
            {loading ? <div className="flex items-center justify-center h-screen"><Loader2 className="w-6 h-6 animate-spin text-gray-500" /></div> : error ? (
                <Alert variant="destructive" className="max-w-sm text-center bg-destructive">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message ?? 'Error fetching dictionaries'}</AlertDescription>
                </Alert>
            ) : children}
        </DictionariesContext.Provider>
    );
};

export const useDictionaries = () => {
    const context = useContext(DictionariesContext);
    if (!context) {
        throw new Error("useDictionaries must be used within a DictionariesProvider");
    }
    return context;
};
