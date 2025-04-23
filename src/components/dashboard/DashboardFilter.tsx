import { useState } from "react";
import { FilterX } from "lucide-react";
import { Button } from "../ui/button";
import RangeDate from "../filter/RangeDate";
import { useDictionaries } from "../../contexts/dataplatform/DictionariesContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface DashboardFilterProps {
    filters: Record<string, string>;
    onApplyFilters: (filters: Record<string, string>) => void;
}

const DashboardFilter = ({ filters, onApplyFilters }: DashboardFilterProps) => {
    const [tempFilters, setTempFilters] = useState(filters);
    const { dictionaries } = useDictionaries();

    const handleTempChange = (key: string, value: string) => {
        setTempFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleApply = () => {
        onApplyFilters(tempFilters);
    };

    const handleClear = () => {
        setTempFilters({
            range_date: '',
            station_name: ''
        });
        onApplyFilters({});
    };

    const handleCancel = () => {
        setTempFilters(filters);
    };

    return (
        <div className="p-4 bg-black rounded-xl shadow" id="dashboard-filter">
            <label>
                Range Date:
                <RangeDate
                    value={tempFilters.range_date || undefined}
                    onChange={(value) => handleTempChange("range_date", value)}
                />
            </label>

            {!!dictionaries?.['station_name-dictionary'] &&
                <label>
                    Station:
                    <Select value={tempFilters.station_name} onValueChange={(value: string) => handleTempChange("station_name", value)}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select a station" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                dictionaries?.['station_name-dictionary'].map((item: any) => {
                                    return <SelectItem value={item.station_name} key={item.station_id}>{item.station_name}</SelectItem>
                                })
                            }
                        </SelectContent>
                    </Select>
                </label>
            }
            <hr className="my-4" />
            <Button id="dashboard-filter-apply-btn" variant="secondary" className="cursor-pointer" onClick={handleApply}>
                Apply filters <FilterX />
            </Button>
            <Button id="dashboard-filter-clear-btn" variant="destructive" className="cursor-pointer" onClick={handleClear}>
                Clear filters <FilterX />
            </Button>
            <Button id="dashboard-filter-cancel-btn" variant="ghost" className="cursor-pointer" onClick={handleCancel}>
                Cancel
            </Button>
        </div>
    );
};

export default DashboardFilter;
