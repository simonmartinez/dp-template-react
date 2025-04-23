import { QueryRequest, QueryResponse } from "../../models/dataplatform/Query";

export const transformDataForCharts = (response: QueryResponse, query: QueryRequest, dictionnary: any = null) => {
    return response.results.map((res: any) => {
        let fieldName = Object.keys(query.data.fields)[0];
        let valueData = res.data[fieldName];
        let operationName = Object.keys(valueData)[0];

        let text = valueData[operationName][0][query.scale.fields[0]];
        if (dictionnary) {
            if (dictionnary.id) {
                text = dictionnary.data.find((item: any) => item[dictionnary.id] === text)[dictionnary.value]
            } else {
                text = dictionnary.data[text - 1][dictionnary.value]
            }
        }

        return {
            name: text,
            value: valueData[operationName][0].value
        };
    });
};

export const formatNumber = (language: string | undefined, num: any) => {
    return (num as number).toLocaleString(language, {
        maximumFractionDigits: 2
    });
};