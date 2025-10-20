import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { stringToColor } from "@/lib/utils";

export const fetchSubjects = async () => {
    return axios
        .get<ApiResponse<Array<Subject>>>(
            `${import.meta.env.VITE_API_URL}/api/subjects`,
        )
        .then((r) => r.data);
};

export function SubjectSelector() {
    const [subjects, setSubjects] = useState<Subject[]>();

    useEffect(() => {
        const getSubjects = async () => {
            const res = await fetchSubjects();
            if (!res.error) {
                setSubjects(res.data);
            }
        };
        getSubjects();
    }, []);

    return (
        <Select>
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
                {subjects?.map((subject) => (
                    <SelectItem value={subject.name}>
                        <Badge
                            style={{
                                backgroundColor: stringToColor(subject.name),
                            }}
                            className="text-white font-medium"
                        >
                            {subject.name}
                        </Badge>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
