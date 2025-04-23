import React from "react";
import { Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, XAxis, YAxis, Bar } from "recharts";
import { QueryRequest, QueryResponse } from "../../../models/dataplatform/Query";
import { formatNumber, transformDataForCharts } from "../../../services/utils/ChartUtils";
import { useTranslation } from "react-i18next";

type BarChartProps = {
    response: QueryResponse
    query: QueryRequest
    dictionnary?: any | undefined
};

const BarChart: React.FC<BarChartProps> = ({ response, query, dictionnary }) => {
    const transformedData = transformDataForCharts(response, query, dictionnary);
    const { i18n } = useTranslation();

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
                data={transformedData}
            >
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => formatNumber(i18n.resolvedLanguage, value)} width={80} />
                <Tooltip formatter={(value) => formatNumber(i18n.resolvedLanguage, value)} />
                <Bar type="monotone" dataKey="value" fill="#0088FE" />
            </RechartsBarChart>
        </ResponsiveContainer>
    );
};

export default BarChart;
