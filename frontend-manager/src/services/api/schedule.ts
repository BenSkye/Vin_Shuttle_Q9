import axiosInstance from "./axios"

export const DriverSchedule = async (scheduleData: {
    driver: string;
    vehicle: string;
    date: string;
    shift: string;
}) => {
    try {
        const response = await axiosInstance.post("/driver-schedules", [scheduleData]);
        console.log("Driver Schedule:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Re-throw to handle in the component
    }
}

export const getDriverSchedule = async () => {
    const startday = "2021-10-01";
    const endday = "2030-10-07";
    try {
        const response = await axiosInstance.get(`/driver-schedules/get-schedule-from-start-to-end/${startday}/${endday}`);
        console.log("Driver Schedule:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}