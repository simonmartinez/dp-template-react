import React from "react";
import { Tooltip, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { QueryRequest, QueryResponse } from "../../../models/dataplatform/Query";
import { formatNumber, transformDataForCharts } from "../../../services/utils/ChartUtils";
import { useTranslation } from "../../../../node_modules/react-i18next";

const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF5C8D",
    "#6a4c93", "#9b59b6", "#f39c12", "#d35400", "#1abc9c",
    "#16a085", "#2980b9", "#e74c3c", "#2ecc71", "#3498db"
];

type PieChartProps = {
    response: QueryResponse
    query: QueryRequest
    dictionnary?: any | undefined
};

const PieChart: React.FC<PieChartProps> = ({ response, query, dictionnary }) => {
    const { i18n } = useTranslation();
    const transformedData = transformDataForCharts(response, query, dictionnary);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
                <Pie
                    data={transformedData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name }) => name}
                >
                    {response?.results.map((_, index: number) => {
                        return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    })}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(i18n.resolvedLanguage, value)} />
            </RechartsPieChart>
        </ResponsiveContainer>
    );
};

export default PieChart;
