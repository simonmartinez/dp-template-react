import { useEffect, useMemo, useState } from 'react'
import Chart from '../../components/dataplatform/chart/Chart'
import { DynamicParameter, QueryRequest } from '../../models/dataplatform/Query'
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardFilter from '../../components/dashboard/DashboardFilter';
import { useSearchParams } from 'react-router-dom';
import { compact, pick } from 'lodash';
import { useDictionaries } from '../../contexts/dataplatform/DictionariesContext';

function DashboardOne() {
  const { dictionaries } = useDictionaries();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  });

  const query = useMemo(() => {
    return {
      "data": { "fields": { "avg_rides_per_day_per_station": ["select"] } }, "scale": { "fields": ["week_day"] }, "filter": {}, "dynamic_parameters": compact(Object.entries(filters).map(([key, value]) => {
        if (value)
          return {
            reference: key,
            transform: "default",
            type: "filter",
            value: Array.isArray(value) ? value : [value]
          } as DynamicParameter
      }))
    } as QueryRequest
  }, [filters])

  const query2 = useMemo(() => {
    return {
      "data": {
        "limit": 5,
        "fields": {
          "rides": [
            "sum"
          ]
        }
      },
      "scale": {
        "fields": [
          "station_name"
        ]
      },
      "filter": {},
      "order": {
        "rides": "desc"
      },
      "dynamic_parameters": compact(Object.entries(pick(filters, ['range_date'])).map(([key, value]) => {
        if (value)
          return {
            reference: key,
            transform: "default",
            type: "filter",
            value: Array.isArray(value) ? value : [value]
          } as DynamicParameter
      }))
    } as QueryRequest
  }, [filters])

  const handleApplyFilters = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    const newParams = new URLSearchParams(newFilters);
    setSearchParams(newParams);
  };

  useEffect(() => {
    const newParams = new URLSearchParams(filters);
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  return (
    <DashboardLayout>
      <DashboardLayout.Left>
        <DashboardFilter filters={filters} onApplyFilters={handleApplyFilters} />
      </DashboardLayout.Left>
      <DashboardLayout.Right>
        <>
          <h2 className="text-2xl font-bold mb-4">Dashboard One</h2>
          <div className="block xl:flex gap-3">
            <div className="flex-1">
              <Chart id="dashboardone-piechart" query={query} type="PieChart" dictionnary={{
                data: dictionaries?.['week_day_label-dictionary'],
                value: "week_day_label"
              }} title="Average rides per day" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit" info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus condimentum pellentesque massa, non rhoncus diam dictum nec. Mauris tempus purus eu odio finibus, non condimentum ante iaculis. Donec aliquet quis est at accumsan. Aenean at sapien tincidunt, posuere sapien eget, finibus turpis. In egestas est diam, ac convallis libero varius eu. Donec at leo nisl. Aenean pretium finibus tincidunt. Duis lacinia vitae diam lobortis facilisis. Praesent faucibus facilisis ligula blandit fringilla. Nunc pellentesque sapien eu ex congue mollis." />
            </div>
            <div className="flex-1">
              <Chart id="dashboardone-barchart" query={query2} type="BarChart" title="Station top 5" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit" info="" />
            </div>
          </div>
        </>
      </DashboardLayout.Right>
    </DashboardLayout>
  )
}

export default DashboardOne
