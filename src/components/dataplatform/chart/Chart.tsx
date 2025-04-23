import React from "react";
import { QueryRequest, QueryResponse } from "../../../models/dataplatform/Query";
import DataPlatformApi from "../../../services/dataplatform/api/DataPlatformApi";
import { AlertTriangle, Loader2, InfoIcon } from "lucide-react";
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { useQuery } from "@tanstack/react-query";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import BarChart from "./BarChart";

type ChartProps = {
    query: QueryRequest,
    type: string;
    title: string;
    description: string;
    info: string;
    dictionnary?: any | undefined
} & React.HTMLProps<HTMLDivElement>;

const Chart: React.FC<ChartProps> = ({ query, type, title, description, info, dictionnary, ...props }) => {
    const { isLoading, error, data } = useQuery({
        queryKey: ['fetchQuery', query],
        retry: false,
        queryFn: () =>
            DataPlatformApi.query(query).then((data: any) => {
                return data.data as QueryResponse;
            }).catch((err) => {
                throw (err?.response?.data ?? new Error("An error just occured"))
            })
    })

    return (
        <div {...props} className="p-4 rounded-xl bg-gray-950/5 inset-ring inset-ring-gray-950/5 dark:bg-white/10 dark:inset-ring-white/10">
            <h3 className="text-xl font-bold mb-2">
                {title}
                {!!info && <ShadcnTooltip>
                    <TooltipTrigger>
                        <InfoIcon className="w-6 h-6" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[50vw] text-xs whitespace-pre-wrap text-center">
                        {info}
                    </TooltipContent>
                </ShadcnTooltip>}
            </h3>
            <p>{description}</p>
            <div className="relative w-full h-[340px] flex items-center justify-center">
                {isLoading ? (
                    <ShadcnTooltip>
                        <TooltipTrigger>
                            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[50vw] text-xs whitespace-pre-wrap text-center">
                            Loading data...
                        </TooltipContent>
                    </ShadcnTooltip>

                ) : error ? (
                    <Alert variant="destructive" className="max-w-sm text-center bg-destructive">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                ) : (
                    <>
                        {
                            (type === 'LineChart' && !!data) ? (
                                <LineChart query={query} response={data} dictionnary={dictionnary} />
                            ) : (type === 'BarChart' && !!data) ? (
                                <BarChart query={query} response={data} dictionnary={dictionnary} />
                            ) : (type === 'PieChart' && !!data) ? (
                                <PieChart query={query} response={data} dictionnary={dictionnary} />
                            ) : (
                                <Alert variant="destructive" className="max-w-sm text-center bg-destructive">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>Chart type not recognized</AlertDescription>
                                </Alert>
                            )
                        }

                    </>
                )}
            </div>
        </div>
    );
};

export default Chart;
