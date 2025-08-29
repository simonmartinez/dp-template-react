import React from "react";
import { Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, XAxis, YAxis, Line } from "recharts";
import { QueryRequest, QueryResponse } from "../../../models/dataplatform/Query";
import { formatNumber, transformDataForCharts } from "../../../services/utils/ChartUtils";
import { useTranslation } from "../../../../node_modules/react-i18next";


type LineChartProps = {
    response: QueryResponse
    query: QueryRequest
    dictionnary?: any | undefined
};

const LineChart: React.FC<LineChartProps> = ({ response, query, dictionnary }) => {
    const transformedData = transformDataForCharts(response, query, dictionnary);
    const { i18n } = useTranslation();
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
                data={transformedData}
            >
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => formatNumber(i18n.resolvedLanguage, value)} width={80} />
                <Tooltip formatter={(value) => formatNumber(i18n.resolvedLanguage, value)} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </RechartsLineChart>
        </ResponsiveContainer>
    );
};

export default LineChart;
